#!/usr/bin/env python3
"""Rosie Identity Resolution System v2

A multi-stage probabilistic identity resolution engine that assigns every
Rosie-related record in GOKS to one of the known Rosie identities.

Architecture:
  1. Ground truth: hard constraints from manual review and source provenance
  2. Feature extraction: 8 independent feature channels
  3. Log-linear scoring: weighted combination of features in log-odds space
  4. Belief propagation: iterative refinement through co-occurrence graph
  5. Evaluation: precision/recall/F1 against ground truth

Based on Fellegi-Sunter probabilistic record linkage adapted for
multi-identity assignment with temporal/geographic/genealogical constraints.
"""

import sqlite3
import json
import re
import sys
import os
import math
from collections import defaultdict, Counter
from dataclasses import dataclass, field, asdict
from typing import Optional, List, Dict, Tuple, Set, FrozenSet

from .stage1_normalize import parse_date


# ═══════════════════════════════════════════════════════════════
# 1. IDENTITY DEFINITIONS
# ═══════════════════════════════════════════════════════════════

@dataclass
class RosieIdentity:
    """A known or hypothesised Rosie identity with anchor facts."""
    id: str
    label: str
    birth_year_min: Optional[int] = None
    birth_year_max: Optional[int] = None
    death_year: Optional[int] = None
    death_year_max: Optional[int] = None
    birth_locations: List[str] = field(default_factory=list)
    death_locations: List[str] = field(default_factory=list)
    residence_locations: List[str] = field(default_factory=list)
    name_forms: List[str] = field(default_factory=list)
    family_names: List[str] = field(default_factory=list)
    classifications: List[str] = field(default_factory=list)
    key_facts: Dict[str, str] = field(default_factory=dict)
    # Negative evidence: locations/names that EXCLUDE this identity
    anti_locations: List[str] = field(default_factory=list)
    anti_names: List[str] = field(default_factory=list)
    # Predicate-value pairs that are diagnostic for this identity
    diagnostic_claims: List[Tuple[str, str]] = field(default_factory=list)
    # EKY schedule adjacency: names from neighboring entries (kinship cluster signal)
    schedule_neighbors: List[str] = field(default_factory=list)
    # EKY schedule entry number (for ordering analysis)
    schedule_entry: Optional[int] = None


# ═══════════════════════════════════════════════════════════════
# EKY ATTACHMENT 2: SCHEDULE STRUCTURE
# ═══════════════════════════════════════════════════════════════
# The 43 apical ancestor entries are ordered by the anthropologist.
# Adjacent entries cluster by kinship network and/or clan estate.
# This ordering reveals which families are connected.

EKY_SCHEDULE = [
    (1, "Siblings Wawuyilkinga, Lily Kajakaja, Ulurban, Kurlur, Juwalkji, Jinabaji"),
    (2, "Kilkil (Gilgil) and Yougie (Emera)"),
    (3, "Ngamubaralba"),
    (4, "Jimmy Johnson Snr and his brothers Toby King and Peter King"),
    (5, "Brothers Billy King, Willie King 1 and Willie King 2"),
    (6, "Siblings Nambaji, Bijun (Dangara) and Jimmy (Mandilba) Rossville"),
    (7, "Old Man Jimmy and Sarah"),
    (8, "Kurukuna and Nellie"),
    (9, "Bluja King Kunarra and his three wives Ngingkibaji #1 and Ngingkibaji #2, and Baral-Baral"),
    (10, "Dimbanga and Mara Baril Baril"),
    (11, "Sisters Mujala and Rosie"),
    (12, "Brothers Dickie Springvale and Mundy Nunn"),
    (13, "Jilngarr"),
    (14, "Burradi and Wawu Dimbi"),
    (15, "Siblings Jimmy, Polly (Jukura), Nellie (Wuynkul-baka), Charlie (Junjurr or Munjurr), Lily (Jabi or Chubby) Blanket"),
    (16, "Rosie Gurrmurragudgee"),
    (17, "Brothers George Doughboy, Toby Bloomfield and Peter Bloomfield (Kalka Jurungu)"),
    (18, "Brothers Charlie Ball (Dirrakari) and Billy Collins and Davey Douglas and Sandy Peterson"),
    (19, "Isabella Henderson (Wawu-kuwa)"),
    (20, "Ginny Bamboo"),
    (21, "Siblings Archibald (Bauly) Mossman, Jessie Mossman (Bawanya) and Billy Mossman"),
    (22, "Siblings Jessie Buchanan (Babi Milbija or Narrijinya) and King Charlie Diamond"),
    (23, "Henry Bloomfield"),
    (24, "Yangki and Buji"),
    (25, "Willy Ngamu-Darrba and his two wives Molly Kalumba and Yimaday"),
    (26, "Kalkamanangu and Duraja"),
    (27, "Kalkaymba"),
    (28, "Rosie Maund Jankarji and her husbands Tommy Jinjarrba Lefthand, Tommy Ngangkun Johnson (Buchanan), Barney Lunn (Lund), Billie Lunn (Lund) and Tommy Jindalman Hide"),
    (29, "Big Friday Ngamu-Ngulmbay and Ruby"),
    (30, "Leslie Yerry"),
    (31, "Brothers King Toby and Old Man Toby (Jinjirrba)"),
    (32, "Maggie Queen"),
    (33, "Siblings Miliji, Kalkabinda, Kuruwuja, Peter Smith (Marray-Marray or Murranbi or Jinakulu)"),
    (34, "Kitty Wulbar (Maymi)"),
    (35, "Rosie Rosie"),
    (36, "Brothers Old Man Juwalba (Willie Cross-eye) and Wunbu Cross-eye"),
    (37, "Jimmy Mossman"),
    (38, "Wabaji"),
    (39, "Old Kokoe"),
    (40, "Charlie Ogilvie and Maggie"),
    (41, "Old Man Yorkey and Rosie"),
    (42, "George Mero"),
    (43, "Old Man Kooka and Maudie"),
    # Note: xliii (Jerry Wotton and Frances Diamond) appears to be entry 44
    # but the NQLC numbering is offset by 1 from NNTT in places
]

# Extract all person names from schedule for matching
def _extract_schedule_names() -> Dict[int, Set[str]]:
    """Extract searchable name tokens from each schedule entry."""
    result = {}
    for num, text in EKY_SCHEDULE:
        # Split on commas, 'and', parentheses to get individual names
        names = set()
        # Remove parenthetical content first for cleaner names
        clean = re.sub(r'\([^)]*\)', '', text)
        # Split on delimiters
        parts = re.split(r',|\band\b|;', clean)
        for p in parts:
            p = p.strip()
            # Remove common prefixes
            for prefix in ['Siblings ', 'Brothers ', 'Sisters ', 'Old Man ', 'his three wives ', 'his two wives ', 'her husbands ']:
                p = p.replace(prefix, '')
            p = p.strip()
            if p and len(p) > 2:
                names.add(p.lower())
                # Also add individual words for matching
                for word in p.split():
                    if len(word) > 3 and word.lower() not in {'from', 'with', 'their', 'three', 'wives'}:
                        names.add(word.lower())
        result[num] = names
    return result

_SCHEDULE_NAMES = _extract_schedule_names()


def _get_neighbor_names(entry_num: int, radius: int = 2) -> Set[str]:
    """Get all names from entries within radius of the given entry."""
    names = set()
    for num, entry_names in _SCHEDULE_NAMES.items():
        if num != entry_num and abs(num - entry_num) <= radius:
            names |= entry_names
    return names


# R2 (Homalee/Honalle) merged into R9 based on evidence:
# - 101 shared events, both at Port Douglas/Mossman/Saltwater Creek
# - Homalee married SSI Jimmy Homalee; R9 listed as "widow" in 1949
# - Willie Api connection to both
# - Same geographic corridor, same time period
# - "Rosie Homarlee Epi" name form bridges the two
# R2 name forms and family names are folded into R9 below.

ROSIE_IDENTITIES = [
    RosieIdentity(
        id='R1',
        label='Rosie Reynolds (Edgar mother, d.1904)',
        birth_year_min=1864, birth_year_max=1874,
        death_year=1904, death_year_max=1904,
        birth_locations=['Laura', 'McIvor River', 'Cooktown', 'near Cooktown',
                         'near McIvor River', 'Laura near Cooktown'],
        death_locations=['Cairns', 'Cairns Base Hospital', 'Pioneer Cemetery',
                         'Pioneer Cemetery Cairns'],
        residence_locations=['Cooktown', 'Mossman', 'Laura', 'Mulgrave', 'Rossville',
                             'McIvor River', 'North Shore', 'Cairns',
                             'Middle Laura', 'Palmer'],
        name_forms=['Rosie Reynolds', 'Rosie Robinson', 'Rosie Brackenridge',
                    'Rosie McIvor', 'Rosina', 'Rosy Reynolds', 'Rosie Davis',
                    'Rose Reynolds', 'Rosie Braikenridge'],
        family_names=['Edgar', 'Edgar Davis', 'Nellie', 'Julia', 'Julia Nunn',
                      'Joseph', 'Frederick', 'Arthur',
                      'Owen Reynolds', 'Owen', 'George Brackenridge',
                      'Brackenridge', 'Braikenridge', 'Fred Braikenridge',
                      'Caroline', 'Lena Stevens', 'John Hartley', 'Myra Bogle',
                      'Frederick Davis', 'Rosie Rosie'],
        classifications=['Aboriginal', 'Aboriginal person', 'full blood', 'F/B',
                         'Aboriginal woman'],
        key_facts={
            'burial': 'Pioneer Cemetery Cairns Plot C449, Burial #1153, Map Ref N7',
            'grave_record': 'born c.1869 Queensland, died April 1904, age 35',
            'occupation': 'Servant',
            'religion': 'Protestant',
        },
        anti_locations=['Mareeba', 'Mona Mona', 'Daintree Mission'],
        anti_names=['Paddy Julian', 'Willie Api', 'Tommy Gray', 'Dorrie Hippie',
                    'D.M. Guivarra', 'Francisco Guivarra', 'Bessie Hippi',
                    'Jimmy Homalee'],
        diagnostic_claims=[
            ('burial', 'Pioneer Cemetery'),
            ('burial_plot', 'C449'),
            ('burial_number', '1153'),
            ('death_date', '1904'),
            ('death_place', 'Cairns'),
            ('death_place', 'Pioneer Cemetery'),
            ('birthplace', 'Laura'),
            ('birthplace', 'McIvor River'),
            ('birthplace', 'near Cooktown'),
            ('origin', 'Laura'),
            ('origin', 'McIvor River'),
            ('occupation', 'Servant'),
            ('religion', 'Protestant'),
            ('mother_of', 'Edgar'),
            ('mother_of', 'Frederick'),
            ('mother_of', 'Joseph'),
            ('mother_of', 'Arthur'),
            ('father_of_children', 'Owen Reynolds'),
        ],
    ),
    RosieIdentity(
        id='R3',
        label='Rosie Neill (married Whyea, Mitchell River)',
        birth_year_min=1886, birth_year_max=1892,
        death_year=None, death_year_max=None,
        birth_locations=['Mitchell River', 'Mitchell River, Cook'],
        death_locations=[],
        residence_locations=['Port Douglas', 'Mossman'],
        name_forms=['Rosie Neill', 'Rosie Neil', 'Rosie Null', 'Rosie Whyea'],
        family_names=['Whyea'],
        classifications=['Aboriginal', 'full blood'],
        key_facts={
            'marriage': 'married Whyea at Mossman 4/6/1914',
            '1915_census': 'page 139 Port Douglas (SEPARATE from Rosie Honalle page 138)',
        },
        anti_locations=['Laura', 'McIvor River', 'Mareeba'],
        anti_names=['Edgar', 'Nellie', 'Owen Reynolds', 'Paddy Julian', 'George Brackenridge'],
        diagnostic_claims=[
            ('birthplace', 'Mitchell River'),
            ('married_to', 'Whyea'),
            ('spouse', 'Whyea'),
        ],
    ),
    RosieIdentity(
        id='R4',
        label='Rosie Rosie (EKY #35)',
        birth_year_min=1860, birth_year_max=1880,
        death_year=None, death_year_max=None,
        birth_locations=[],
        death_locations=[],
        residence_locations=['Mossman', 'Yarrabah'],
        name_forms=['Rosie Rosie'],
        family_names=['Julia Nunn', 'Julia Leftwich', 'Davis',
                      'Nellie', 'Edgar',
                      # Schedule neighbors (xxxiii-xxxvi): Kitty Wulbar, Cross-eye
                      'Kitty Wulbar', 'Kitty', 'Maymi', 'Wulbar',
                      'Juwalba', 'Willie Cross-eye', 'Wunbu Cross-eye',
                      # xxxii-xxxiii cluster: Miliji siblings, Peter Smith
                      'Miliji', 'Kalkabinda', 'Kuruwuja', 'Peter Smith'],
        classifications=[],
        key_facts={
            'native_title': 'EKY apical ancestor #35 (Entry xxxv)',
            'julia_marriage': 'mother Rosie Rosie on Julia Nunn 1912 marriage record',
            'note': 'Most minimal entry in entire 44-ancestor schedule',
            'schedule_cluster': 'Adjacent to Kitty Wulbar (xxxiii) who married Mick 1907 = Caroline mother. Caroline married Edgar (R1 son). Kinship network connection.',
        },
        diagnostic_claims=[
            ('entry', 'EKY Entry xxxv'),
            ('entry', 'xxxv'),
            ('entry', 'xxxiv'),
        ],
        schedule_entry=35,
        schedule_neighbors=['Kitty Wulbar', 'Miliji', 'Kalkabinda', 'Kuruwuja',
                           'Peter Smith', 'Old Man Juwalba', 'Willie Cross-eye',
                           'Wunbu Cross-eye'],
    ),
    RosieIdentity(
        id='R5',
        label='Mujala sister Rosie (EKY #11)',
        birth_year_min=None, birth_year_max=None,
        death_year=None, death_year_max=None,
        birth_locations=[],
        death_locations=[],
        residence_locations=['Bloomfield', 'Rossville'],
        name_forms=['Sisters Mujala and Rosie', 'Mujala', 'Mujala and Rosie'],
        family_names=['Mujala', 'Mundy Nunn', 'Friday', 'King',
                      'Miliji', 'Kalkabinda', 'Kuruwuja', 'Peter Smith',
                      # Schedule neighbors (x-xii): Dimbanga, Baril Baril, Dickie Springvale
                      'Dimbanga', 'Mara Baril Baril', 'Baril',
                      'Dickie Springvale', 'Dickie', 'Springvale', 'Nunn'],
        classifications=[],
        key_facts={
            'native_title': 'EKY apical ancestor #11 (Entry xi)',
            'structure': 'sibling pair as joint ancestor',
            'schedule_cluster': 'Adjacent to Dickie Springvale and Mundy Nunn (xii). Nunn surname connects to Julia Nunn (R1 daughter). Strongest kinship signal for R1 connection.',
        },
        diagnostic_claims=[
            ('entry', 'EKY Entry xi'),
            ('entry', 'xi'),
        ],
        schedule_entry=11,
        schedule_neighbors=['Dimbanga', 'Mara Baril Baril', 'Dickie Springvale',
                           'Mundy Nunn', 'Jilngarr'],
    ),
    RosieIdentity(
        id='R6',
        label='Rosie Maund Jankarji (EKY #28)',
        birth_year_min=None, birth_year_max=None,
        death_year=None, death_year_max=None,
        birth_locations=[],
        death_locations=[],
        residence_locations=['Port Douglas', 'Mossman', 'Bloomfield'],
        name_forms=['Rosie Maund Jankarji', 'Rosie Maund', 'Jankarji',
                    'Rosie Jankarji'],
        family_names=['Tommy Lefthand', 'Tommy Johnson', 'Barney Lunn',
                      'Billie Lunn', 'Tommy Hide', 'Jinjarrba', 'Maund',
                      'Tommy Jinjarrba Lefthand', 'Tommy Ngangkun Johnson',
                      'Tommy Jindalman Hide', 'Buchanan', 'Lunn', 'Lund',
                      'Jimmie Maund',
                      # Schedule neighbors (xxvii-xxix): Kalkaymba, Big Friday, Ruby
                      'Kalkaymba', 'Big Friday', 'Ngamu-Ngulmbay', 'Ruby',
                      'Leslie Yerry', 'Yerry'],
        classifications=[],
        key_facts={
            'native_title': 'EKY apical ancestor #28 (Entry xxviii)',
            'husbands': '5 named husbands',
            'epi_marriage': 'William Mandin Epi marriage 1906/C/497',
            'schedule_cluster': 'Adjacent to Big Friday Ngamu-Ngulmbay (xxix). Friday is Paddy Julian father. R9 married Paddy Julian 1949. R6 and R9 are in same kinship network but DIFFERENT people.',
        },
        diagnostic_claims=[
            ('entry', 'EKY Entry xxviii'),
            ('entry', 'xxviii'),
            ('married_to', 'Tommy Lefthand'),
            ('married_to', 'Tommy Johnson'),
            ('married_to', 'Barney Lunn'),
            ('married_to', 'Billie Lunn'),
            ('married_to', 'Tommy Hide'),
            ('surname', 'Maund'),
        ],
        schedule_entry=28,
        schedule_neighbors=['Kalkaymba', 'Big Friday', 'Ngamu-Ngulmbay', 'Ruby',
                           'Leslie Yerry'],
    ),
    RosieIdentity(
        id='R7',
        label='Rosie Gurrmurragudgee (EKY #16)',
        birth_year_min=None, birth_year_max=None,
        death_year=None, death_year_max=None,
        birth_locations=['Bloomfield'],
        death_locations=[],
        residence_locations=['Bloomfield'],
        name_forms=['Rosie Gurrmurragudgee', 'Gurrmurragudgee'],
        # Schedule neighbors (xv-xvii): Blanket family, Bloomfield brothers, Doughboy
        family_names=['Blanket', 'Jimmy Blanket', 'Polly Blanket', 'Nellie Blanket',
                      'Charlie Blanket', 'Lily Blanket', 'Jukura', 'Wuynkul-baka',
                      'George Doughboy', 'Toby Bloomfield', 'Peter Bloomfield',
                      'Kalka Jurungu', 'Doughboy'],
        classifications=[],
        key_facts={
            'native_title': 'EKY apical ancestor #16 (Entry xvi)',
            'records': 'zero records outside EKY schedule',
            'schedule_cluster': 'Between Blanket siblings (xv) and Bloomfield brothers (xvii). Places her country in the Bloomfield River valley.',
        },
        diagnostic_claims=[
            ('entry', 'EKY Entry xvi'),
            ('entry', 'xvi'),
        ],
        schedule_entry=16,
        schedule_neighbors=['Jimmy Blanket', 'Polly Blanket', 'Nellie Blanket',
                           'Charlie Blanket', 'Lily Blanket',
                           'George Doughboy', 'Toby Bloomfield', 'Peter Bloomfield'],
    ),
    RosieIdentity(
        id='R8',
        label='Old Man Yorkey Rosie (EKY #41)',
        birth_year_min=1860, birth_year_max=1880,
        death_year=None, death_year_max=None,
        birth_locations=[],
        death_locations=[],
        residence_locations=['Port Douglas', 'Mossman', 'Daintree Mission',
                             'Daintree'],
        name_forms=['Old Man Yorkey and Rosie', 'Rosie Yorkey',
                    'Rosie (Yorkey)'],
        family_names=['Yorkey', 'Old Man Yorkey', 'Jimmy Yorkey',
                      'Yorkey Beaumann', 'Yorkey Bauman', 'Paddy Beaumann',
                      'Beaumann', 'Baumann', 'Mary Kerr',
                      # Schedule neighbors (xxxix-xli): Charlie Ogilvie, George Mero
                      'Charlie Ogilvie', 'Ogilvie', 'Maggie', 'George Mero', 'Mero'],
        classifications=[],
        key_facts={
            'native_title': 'EKY apical ancestor #41 (Entry xl)',
            '1943_mission': 'Rosie Yorkey at Daintree Mission 1943',
            '1915_census': 'Yorkey at Port Douglas war census entry 138',
            'schedule_cluster': 'Late in schedule (xl) with Charlie Ogilvie (xxxix) and George Mero (xli). Port Douglas/Mossman cluster.',
        },
        diagnostic_claims=[
            ('entry', 'EKY Entry xl'),
            ('entry', 'xl'),
            ('spouse', 'Yorkey'),
            ('spouse', 'Old Man Yorkey'),
            ('surname', 'Yorkey'),
            ('surname', 'Beaumann'),
            ('surname', 'Baumann'),
        ],
        schedule_entry=41,
        schedule_neighbors=['Charlie Ogilvie', 'Maggie', 'George Mero',
                           'Old Kokoe', 'Old Man Kooka', 'Maudie'],
    ),
    RosieIdentity(
        id='R9',
        label='Rosie Hippie/Julian/Homalee (d.1964)',
        birth_year_min=1869, birth_year_max=1877,
        death_year=1964, death_year_max=1964,
        birth_locations=['Mareeba', 'Mareeba, Queensland'],
        death_locations=['Mossman', 'District Hospital Mossman'],
        residence_locations=['Mossman', 'Miallo', 'Saltwater Creek', 'Mt Carbine',
                             'Port Douglas', 'Mona Mona', 'Saltwater',
                             'Cairns', 'Daintree'],
        # Merged R2 (Homalee/Honalle) name forms into R9
        name_forms=['Rosie Hippie', 'Rosie Julian', 'Rosie Hippi', 'Rosie Hippy',
                    'Rosie H. Hippi', 'Rosie Homarlee Epi', 'Rosie Julian nee Hippi',
                    'Rosie Julian nee Rosie Hippi',
                    'Rosie Homalee', 'Rosie Honalle', 'Rosie Homarlee',
                    'Rosie Honalze', 'Rosie Honalla', 'HONALLE Rosie',
                    'Rosie Epi', 'Rosie Api'],
        # Merged R2 family names into R9
        family_names=['Paddy Julian', 'Willie Api', 'Tommy Gray', 'Dorrie Hippie',
                      'Mick', 'Nellie', 'D.M. Guivarra', 'Francisco Guivarra',
                      'Bessie Hippi', 'Friday', 'Lizzie', 'Rutherford',
                      'Ethel Rutherford', 'L.B. Rutherford',
                      'Jimmy Homalee', 'Homalee', 'Fred Braikenridge',
                      'Mary', 'Yorkey', 'Crees', 'J.S.D. Crees'],
        classifications=['H/C', 'half-caste', 'Aboriginal', 'F/B or H/C Kanaka',
                         'full blood', 'F', 'Aboriginal woman'],
        key_facts={
            '1942_indigence': 'None for sons or daughters',
            '1949_marriage': 'married Paddy Julian 13 May 1949, reg 1949/C/1596',
            '1949_marriage_age': '74 years (born c.1875)',
            '1949_marriage_birthplace': 'Mareeba, Queensland',
            '1949_marriage_parents': 'Father: Mick, Mother: Nellie',
            '1964_death_cert': 'father Mick, mother Nellie, reg 1964/C/3548',
            'adopted_daughter': 'D.M. Guivarra (Dorrie Hippie)',
            'brother': 'Tommy Gray at Mona Mona',
            '1905_report': 'Rosie Homalee of Saltwater Ck, widow of SSI, has a son',
            '1906_permission': 'permission to marry South Sea Islander at Cairns',
            '1915_census': 'page 138 Port Douglas with George, Fred Braikenridge',
            'employer': 'J.S.D. Crees',
        },
        anti_locations=['Laura', 'McIvor River', 'Mitchell River', 'Noble Island'],
        anti_names=['Owen Reynolds'],
        diagnostic_claims=[
            ('father', 'Mick'),
            ('mother', 'Nellie'),
            ('married_to', 'Paddy Julian'),
            ('spouse', 'Paddy Julian'),
            ('married_to', 'Jimmy Homalee'),
            ('spouse', 'Jimmy Homalee'),
            ('married_to', 'Willie Api'),
            ('spouse', 'Willie Api'),
            ('birthplace', 'Mareeba'),
            ('brother', 'Tommy Gray'),
            ('sibling', 'Tommy Gray'),
            ('adopted_daughter', 'D.M. Guivarra'),
            ('adopted_daughter', 'Dorrie'),
            ('death_date', '1964'),
            ('death_place', 'Mossman'),
            ('death_registration', '1964/C/3548'),
            ('marriage_registration', '1949/C/1596'),
            ('indigence', 'None for sons or daughters'),
            ('employer', 'Crees'),
            ('employer', 'Rutherford'),
        ],
    ),
    RosieIdentity(
        id='R10',
        label='Rosie of Noble Island',
        birth_year_min=None, birth_year_max=None,
        death_year=None, death_year_max=None,
        birth_locations=['Noble Island', 'Noble Islands'],
        death_locations=[],
        residence_locations=['Cooktown', 'Noble Island'],
        name_forms=['Rosie of Noble Island'],
        family_names=['Fausto Billows', 'Pausto Billows', 'Billones'],
        classifications=['Aboriginal'],
        key_facts={
            'marriage_refused': 'Fausto Billows (Manila man) sought to marry her',
        },
        diagnostic_claims=[
            ('origin', 'Noble Island'),
            ('birthplace', 'Noble Island'),
            ('partner', 'Fausto'),
            ('partner', 'Pausto'),
            ('partner', 'Billows'),
        ],
    ),
]

# Build lookup dict
IDENTITY_MAP = {i.id: i for i in ROSIE_IDENTITIES}


# ═══════════════════════════════════════════════════════════════
# 2. GROUND TRUTH SYSTEM
# ═══════════════════════════════════════════════════════════════

@dataclass
class GroundTruthRule:
    """A hard constraint that overrides probabilistic assignment."""
    identity_id: str
    confidence: float  # 0-1, how certain we are
    reason: str
    # Matching criteria (any match triggers the rule)
    entity_name_pattern: Optional[str] = None  # regex
    predicate: Optional[str] = None
    value_pattern: Optional[str] = None  # regex
    source_id_pattern: Optional[str] = None  # regex


# Source provenance rules: entire source documents belong to a specific identity
SOURCE_PROVENANCE = {
    # R9 sources
    'rosie-hippie-paddy-julian-marriage-1949': ('R9', 0.99, 'R9 marriage certificate'),
    'qsa-rosie-hippie-1942-indigence': ('R9', 0.95, 'R9 indigence application'),
    # R1 sources
    'rosie-died-1904-scenario': ('R1', 0.85, 'R1 death scenario analysis'),
    'rosie-edgar-1883-timeline': ('R1', 0.80, 'R1/Edgar timeline'),
    # Neutral sources (inform both R1 and R9)
    'rosie-definitive-timeline': (None, 0.0, 'mixed source'),
    'rosie-potential-timelines': (None, 0.0, 'mixed source'),
    'rosie-timeline-owen-reynolds': ('R1', 0.70, 'Owen Reynolds is R1 partner'),
    'reynolds-aboriginal-relationships': ('R1', 0.65, 'Reynolds family analysis'),
    'edgar-parentage-professional-report': ('R1', 0.60, 'Edgar parentage focus'),
    'thrulines-reynolds-lineage': ('R1', 0.75, 'Reynolds DNA lineage'),
    'reynolds-surname-research': ('R1', 0.65, 'Reynolds surname analysis'),
    'nellie-deep': ('R1', 0.60, 'Nellie is R1 child'),
    'nellie-complete-profile': ('R1', 0.60, 'Nellie is R1 child'),
    'owen-reynolds-potential': ('R1', 0.70, 'Owen Reynolds analysis'),
    'mick-deep': ('R9', 0.50, 'Mick is R9 father, not R1'),
    'mick-nellie-research': ('R9', 0.50, 'Mick/Nellie are R9 parents'),
    'rosie-epi-marriage-cert-1906': ('R9', 0.80, 'Epi/Hippie marriage'),
    'bowman-baumann': ('R8', 0.70, 'Baumann = Yorkey family'),
}

# Manual event assignments from expert review
MANUAL_ASSIGNMENTS: List[GroundTruthRule] = [
    # Father Mick belongs to R9 (1949 cert, 1964 death cert)
    GroundTruthRule('R9', 0.95, 'Father Mick on 1949 and 1964 certs = R9',
                    predicate='father', value_pattern=r'(?i)\bMick\b'),
    # Mother Nellie belongs to R9
    GroundTruthRule('R9', 0.95, 'Mother Nellie on 1949 and 1964 certs = R9',
                    predicate='mother', value_pattern=r'(?i)\bNellie\b'),
    # Tommy Gray brother = R9
    GroundTruthRule('R9', 0.70, 'Tommy Gray brother from R9 documents',
                    predicate='brother', value_pattern=r'(?i)Tommy.?Gray'),
    GroundTruthRule('R9', 0.70, 'Tommy Gray sibling from R9 documents',
                    predicate='sibling', value_pattern=r'(?i)Tommy.?Gray'),
    # Rutherford connections = R9
    GroundTruthRule('R9', 0.80, 'Rutherfords witnessed R9 1949 wedding',
                    value_pattern=r'(?i)\bRutherford\b'),
    # Homalee/SSI marriage = R9
    GroundTruthRule('R9', 0.90, 'Jimmy Homalee SSI husband = R9',
                    value_pattern=r'(?i)\bHomalee\b'),
    GroundTruthRule('R9', 0.90, 'Honalle = R9',
                    entity_name_pattern=r'(?i)Honall[ez]'),
    GroundTruthRule('R9', 0.90, 'Homalee entity = R9',
                    entity_name_pattern=r'(?i)Homalee'),
    GroundTruthRule('R9', 0.90, 'Homarlee entity = R9',
                    entity_name_pattern=r'(?i)Homarlee'),
    # Pioneer Cemetery = R1
    GroundTruthRule('R1', 0.99, 'Pioneer Cemetery burial = R1',
                    value_pattern=r'(?i)Pioneer.?Cemetery'),
    # Burial 1153 = R1
    GroundTruthRule('R1', 0.99, 'Burial #1153 = R1',
                    value_pattern=r'(?i)(Burial|Plot).*(1153|C449|N7)'),
    # Owen Reynolds children = R1
    GroundTruthRule('R1', 0.95, 'Owen Reynolds children = R1',
                    value_pattern=r'(?i)Owen.?Reynolds'),
    # Paddy Julian = R9
    GroundTruthRule('R9', 0.95, 'Paddy Julian husband = R9',
                    value_pattern=r'(?i)Paddy.?Julian'),
    # D.M. Guivarra = R9
    GroundTruthRule('R9', 0.90, 'D.M. Guivarra adopted daughter = R9',
                    value_pattern=r'(?i)Guivarra'),
    # Dorrie Hippie = R9
    GroundTruthRule('R9', 0.90, 'Dorrie Hippie = R9',
                    value_pattern=r'(?i)Dorrie.?Hipp'),
    # Rosie Robinson / John Hartley = R1
    GroundTruthRule('R1', 0.85, 'Rosie Robinson (Hartley) = R1',
                    entity_name_pattern=r'(?i)Rosie.?Robinson'),
    # Age 73 in 1942 = R9
    GroundTruthRule('R9', 0.90, '1942 indigence age = R9',
                    source_id_pattern=r'(?i)1942.*indigence'),
    # Death 1964 = R9
    GroundTruthRule('R9', 0.99, '1964 death = R9',
                    predicate='death_year', value_pattern=r'1964'),
    GroundTruthRule('R9', 0.99, '1964 death = R9',
                    predicate='death_date', value_pattern=r'1964'),
    # Birth at Mareeba = R9
    GroundTruthRule('R9', 0.85, 'Birthplace Mareeba = R9',
                    predicate='birthplace', value_pattern=r'(?i)\bMareeba\b'),
    # Birth at Laura / McIvor = R1
    GroundTruthRule('R1', 0.85, 'Birthplace Laura = R1',
                    predicate='birthplace', value_pattern=r'(?i)\bLaura\b'),
    GroundTruthRule('R1', 0.85, 'Birthplace McIvor = R1',
                    predicate='birthplace', value_pattern=r'(?i)\bMcIvor\b'),
    # Mona Mona = R9 (Tommy Gray at Mona Mona)
    GroundTruthRule('R9', 0.70, 'Mona Mona = R9 (Tommy Gray)',
                    predicate='residence', value_pattern=r'(?i)\bMona.?Mona\b'),
    # Rosie Hippie entity = R9
    GroundTruthRule('R9', 0.95, 'Entity named Rosie Hippie = R9',
                    entity_name_pattern=r'^Rosie Hipp'),
    # Rosie Julian entity = R9
    GroundTruthRule('R9', 0.95, 'Entity named Rosie Julian = R9',
                    entity_name_pattern=r'^Rosie Julian'),
    # Rosie Reynolds entity = R1
    GroundTruthRule('R1', 0.90, 'Entity named Rosie Reynolds = R1',
                    entity_name_pattern=r'^Ros(ie|y) Reynolds'),
    # Rosie Brackenridge entity = R1
    GroundTruthRule('R1', 0.85, 'Entity named Rosie Brackenridge = R1',
                    entity_name_pattern=r'^Rosie Bra(c?)kenridge'),
    # Willie Api = R9
    GroundTruthRule('R9', 0.85, 'Willie Api = R9 husband',
                    value_pattern=r'(?i)Willie.?Api'),
    # Epi marriage 1906 = R9
    GroundTruthRule('R9', 0.80, '1906 Epi marriage = R9',
                    value_pattern=r'(?i)William.?Mandin'),
    GroundTruthRule('R9', 0.80, '1906 Epi marriage = R9',
                    value_pattern=r'1906/C/497'),
    # 1949 marriage cert = R9
    GroundTruthRule('R9', 0.99, '1949 marriage registration = R9',
                    value_pattern=r'1949/C/1596'),
    # 1964 death cert = R9
    GroundTruthRule('R9', 0.99, '1964 death registration = R9',
                    value_pattern=r'1964/C/3548'),
    # EKY native title entry patterns
    GroundTruthRule('R4', 0.95, 'EKY entry xxxv = R4',
                    value_pattern=r'(?i)\bxxxv\b'),
    GroundTruthRule('R5', 0.95, 'EKY entry xi = R5',
                    predicate='entry', value_pattern=r'\bxi\b'),
    GroundTruthRule('R6', 0.95, 'EKY entry xxviii = R6',
                    value_pattern=r'(?i)\bxxviii\b'),
    GroundTruthRule('R7', 0.95, 'EKY entry xvi = R7',
                    predicate='entry', value_pattern=r'\bxvi\b'),
    GroundTruthRule('R8', 0.95, 'EKY entry xl = R8',
                    predicate='entry', value_pattern=r'\bxl\b'),
    # Rosie Maund entity = R6
    GroundTruthRule('R6', 0.95, 'Rosie Maund = R6',
                    entity_name_pattern=r'(?i)Rosie.?Maund'),
    GroundTruthRule('R6', 0.95, 'Jankarji = R6',
                    entity_name_pattern=r'(?i)Jankarji'),
    # Gurrmurragudgee = R7
    GroundTruthRule('R7', 0.95, 'Gurrmurragudgee = R7',
                    entity_name_pattern=r'(?i)Gurrmurragudgee'),
    # Rosie Yorkey = R8
    GroundTruthRule('R8', 0.90, 'Rosie Yorkey = R8',
                    entity_name_pattern=r'(?i)Rosie.?Yorkey'),
    # Mujala = R5
    GroundTruthRule('R5', 0.95, 'Mujala = R5',
                    entity_name_pattern=r'(?i)Mujala'),
    # Noble Island = R10
    GroundTruthRule('R10', 0.95, 'Noble Island = R10',
                    value_pattern=r'(?i)Noble.?Island'),
    GroundTruthRule('R10', 0.95, 'Fausto/Pausto Billows = R10',
                    value_pattern=r'(?i)(Fausto|Pausto).?Billow'),
    # Additional R1 anchors from research documents
    GroundTruthRule('R1', 0.80, 'Edgar mother = R1',
                    value_pattern=r"(?i)Edgar'?s?.?(mother|mum|mom)"),
    GroundTruthRule('R1', 0.80, 'mother of Edgar = R1',
                    predicate='mother_of', value_pattern=r'(?i)\bEdgar\b'),
    GroundTruthRule('R1', 0.75, 'George Brackenridge partner = R1',
                    value_pattern=r'(?i)George.?Bra(c?)kenridge'),
    GroundTruthRule('R1', 0.75, 'Brackenridge children = R1',
                    value_pattern=r'(?i)Bra(c?)kenridge.*(child|son|daughter)'),
    GroundTruthRule('R1', 0.80, 'Lena Stevens reference = R1',
                    value_pattern=r'(?i)Lena.?Stevens'),
    GroundTruthRule('R1', 0.80, 'John Hartley reference = R1',
                    value_pattern=r'(?i)John.?Hartley'),
    GroundTruthRule('R1', 0.80, 'Myra Bogle reference = R1',
                    value_pattern=r'(?i)Myra.?Bogle'),
    GroundTruthRule('R1', 0.85, 'Death 1904 = R1',
                    predicate='death_year', value_pattern=r'1904'),
    GroundTruthRule('R1', 0.85, 'Death 1904 = R1',
                    predicate='death_date', value_pattern=r'1904'),
    GroundTruthRule('R1', 0.70, 'Edgar birth cert mother = R1',
                    value_pattern=r'1906/O/924'),
    GroundTruthRule('R1', 0.70, 'Frederick death cert mother = R1',
                    value_pattern=r'1955/C/4598'),
    # Source provenance: edgar/reynolds focused sources = R1
    GroundTruthRule('R1', 0.65, 'Edgar timeline source = R1',
                    source_id_pattern=r'edgar-'),
    GroundTruthRule('R1', 0.65, 'Reynolds source = R1',
                    source_id_pattern=r'reynolds-'),
    GroundTruthRule('R1', 0.60, 'Nellie source = R1',
                    source_id_pattern=r'nellie-'),
]

# Entity names that are clearly different people (not R1, R9, or any of our identities)
EXCLUDE_ENTITIES = {
    'rosie murray', 'rosie morton', 'rosie creed', 'rosie anderson',
    'rosie butcher', 'rosie douglas', 'rosie mammis', 'rosie frog',
    'rosie smith', 'rosie harper', 'rosie phillips', 'rosie mathieson',
    'rosie james', 'rosie banjo', 'rosie doolan', 'rosie johnny',
    'rosie molloy', 'junkurrji rosie molloy', 'mookai rosie bi-bayan',
    'rosie shoreman', 'rosie shoman',
    'murray, rosie [132107]', 'brazier rosie', 'grogan rosie',
    'maloney rosie', 'mathieson rosie', 'rosie lockhart',
    'rosie neil', 'rosie mortlapp',  # specific named Rosies from Cooktown records
}


def check_ground_truth(event: 'RosieEvent') -> Optional[Tuple[str, float, str]]:
    """Check if an event matches any ground truth rule.
    Returns (identity_id, confidence, reason) or None."""

    # Check entity name exclusions first
    if event.entity_name.lower().strip() in EXCLUDE_ENTITIES:
        return None  # will be handled as excluded

    best_match = None
    best_confidence = 0.0

    for rule in MANUAL_ASSIGNMENTS:
        matched = False

        if rule.entity_name_pattern:
            if re.search(rule.entity_name_pattern, event.entity_name):
                matched = True

        if rule.predicate and rule.predicate == event.predicate:
            if rule.value_pattern:
                if re.search(rule.value_pattern, event.value) or \
                   re.search(rule.value_pattern, event.text_span):
                    matched = True
            else:
                matched = True
        elif rule.predicate is None and rule.value_pattern:
            if re.search(rule.value_pattern, event.value) or \
               re.search(rule.value_pattern, event.text_span):
                matched = True

        if rule.source_id_pattern and event.source_id:
            if re.search(rule.source_id_pattern, event.source_id):
                matched = True

        if matched and rule.confidence > best_confidence:
            best_match = (rule.identity_id, rule.confidence, rule.reason)
            best_confidence = rule.confidence

    # Check source provenance
    if event.source_id:
        for prefix, (sid, conf, reason) in SOURCE_PROVENANCE.items():
            if sid and event.source_id.startswith(prefix) and conf > best_confidence:
                best_match = (sid, conf, reason)
                best_confidence = conf

    return best_match


# ═══════════════════════════════════════════════════════════════
# 3. FEATURE EXTRACTORS (8 independent channels)
# ═══════════════════════════════════════════════════════════════

# Geographic distance model with location hierarchy
LOCATION_HIERARCHY = {
    # FNQ macro-regions
    'laura': {'region': 'cape_york_south', 'lat': -15.56, 'lon': 144.45},
    'mciver river': {'region': 'cape_york_south', 'lat': -15.4, 'lon': 144.7},
    'mciver': {'region': 'cape_york_south', 'lat': -15.4, 'lon': 144.7},
    'cooktown': {'region': 'cape_york_south', 'lat': -15.47, 'lon': 145.25},
    'rossville': {'region': 'bloomfield', 'lat': -15.72, 'lon': 145.23},
    'bloomfield': {'region': 'bloomfield', 'lat': -15.88, 'lon': 145.33},
    'wujal wujal': {'region': 'bloomfield', 'lat': -15.93, 'lon': 145.33},
    'daintree': {'region': 'daintree', 'lat': -16.25, 'lon': 145.42},
    'port douglas': {'region': 'douglas', 'lat': -16.48, 'lon': 145.46},
    'mossman': {'region': 'douglas', 'lat': -16.46, 'lon': 145.37},
    'miallo': {'region': 'douglas', 'lat': -16.48, 'lon': 145.40},
    'saltwater creek': {'region': 'douglas', 'lat': -16.50, 'lon': 145.44},
    'saltwater': {'region': 'douglas', 'lat': -16.50, 'lon': 145.44},
    'cairns': {'region': 'cairns', 'lat': -16.92, 'lon': 145.77},
    'mulgrave': {'region': 'cairns', 'lat': -17.10, 'lon': 145.82},
    'north shore': {'region': 'cairns', 'lat': -16.87, 'lon': 145.73},
    'mareeba': {'region': 'tablelands', 'lat': -17.00, 'lon': 145.43},
    'mona mona': {'region': 'tablelands', 'lat': -16.75, 'lon': 145.60},
    'mt carbine': {'region': 'tablelands', 'lat': -16.53, 'lon': 145.12},
    'yarrabah': {'region': 'cairns', 'lat': -16.93, 'lon': 145.87},
    'innisfail': {'region': 'south_fnq', 'lat': -17.52, 'lon': 146.03},
    'noble island': {'region': 'cape_york_south', 'lat': -15.30, 'lon': 145.20},
    'mitchell river': {'region': 'cape_york_west', 'lat': -15.20, 'lon': 141.90},
    'palmer': {'region': 'cape_york_south', 'lat': -15.95, 'lon': 144.78},
    'middle laura': {'region': 'cape_york_south', 'lat': -15.60, 'lon': 144.40},
}

# Region adjacency for soft matching
ADJACENT_REGIONS = {
    'cape_york_south': {'bloomfield', 'cape_york_west'},
    'bloomfield': {'cape_york_south', 'daintree', 'douglas'},
    'daintree': {'bloomfield', 'douglas'},
    'douglas': {'daintree', 'bloomfield', 'cairns', 'tablelands'},
    'cairns': {'douglas', 'tablelands', 'south_fnq'},
    'tablelands': {'douglas', 'cairns'},
    'south_fnq': {'cairns'},
    'cape_york_west': {'cape_york_south'},
}


def _normalize_location(loc: str) -> str:
    """Normalize location string for matching."""
    return loc.lower().strip().replace(',', '').replace('.', '')


def _get_location_info(loc: str) -> Optional[dict]:
    """Get geographic info for a location string."""
    norm = _normalize_location(loc)
    # Direct match
    if norm in LOCATION_HIERARCHY:
        return LOCATION_HIERARCHY[norm]
    # Substring match
    for key, info in LOCATION_HIERARCHY.items():
        if key in norm or norm in key:
            return info
    return None


def extract_year_from_claim(claim: dict) -> Optional[int]:
    """Extract a year from any claim value or text span."""
    for text in [claim.get('object_value', ''), claim.get('text_span', ''),
                 claim.get('date_value', '')]:
        if not text:
            continue
        pd = parse_date(str(text))
        if pd['year'] and 1800 <= pd['year'] <= 2030:
            return pd['year']
    return None


def extract_location_from_claim(claim: dict) -> Optional[str]:
    """Extract a location from a claim."""
    pred = (claim.get('predicate', '') or '').lower()
    val = claim.get('object_value', '') or ''

    location_predicates = {
        'location', 'residence', 'birthplace', 'death_place',
        'burial_place', 'origin', 'associated_location', 'place',
        'death_location', 'burial_location', 'marriage_location',
        'last_residence', 'marriage_place', 'birth_place',
    }
    if pred in location_predicates:
        return val.strip() if val.strip() else None
    return None


# --- Feature 1: Name Form Similarity ---

def feat_name_form(name: str, identity: RosieIdentity) -> float:
    """Score how well entity name matches identity's known name forms. 0-1."""
    if not name:
        return 0.05
    name_lower = name.lower().strip()

    # Just "Rosie" with no surname: weak signal
    if name_lower in ('rosie', 'rose', 'rosina', 'rosy'):
        return 0.15  # generic, matches everyone weakly

    # Exact match with any name form
    for nf in identity.name_forms:
        if name_lower == nf.lower():
            return 1.0

    # Check anti-names in entity name
    for an in identity.anti_names:
        if an.lower() in name_lower:
            return 0.02  # strong negative signal

    best = 0.05
    for nf in identity.name_forms:
        nf_lower = nf.lower()
        # Check if one contains the other (but not just "rosie")
        if len(nf_lower) > 6 and (name_lower in nf_lower or nf_lower in name_lower):
            similarity = min(len(name_lower), len(nf_lower)) / max(len(name_lower), len(nf_lower))
            best = max(best, similarity * 0.85)
        # Word-level overlap (excluding "rosie")
        words_a = set(name_lower.split()) - {'rosie', 'rose', 'rosy'}
        words_b = set(nf_lower.split()) - {'rosie', 'rose', 'rosy'}
        if words_a and words_b:
            overlap = len(words_a & words_b) / max(len(words_a), len(words_b))
            if overlap > 0:
                best = max(best, overlap * 0.75)

    return best


# --- Feature 2: Temporal Plausibility ---

def feat_temporal(year: Optional[int], identity: RosieIdentity) -> float:
    """Score temporal plausibility. 0.0 = impossible (veto), 1.0 = perfect fit."""
    if year is None:
        return 0.5  # unknown = neutral

    # Hard constraint: event after death (with 1 year grace for reporting delays)
    if identity.death_year and year > identity.death_year + 1:
        return 0.0  # VETO

    # Hard constraint: event before plausible birth - 5 years
    if identity.birth_year_min and year < identity.birth_year_min - 5:
        return 0.0  # VETO

    # No temporal data for this identity
    if not identity.birth_year_min:
        return 0.4

    # Compute age at event
    mid_birth = (identity.birth_year_min + (identity.birth_year_max or identity.birth_year_min)) / 2
    age_at_event = year - mid_birth

    # Score based on plausible adult life (15-90 years old)
    if identity.death_year:
        lifespan_start = identity.birth_year_min
        lifespan_end = identity.death_year
        if lifespan_start <= year <= lifespan_end:
            # Peak scoring in prime adult years (20-60)
            if 20 <= age_at_event <= 60:
                return 1.0
            elif 15 <= age_at_event <= 70:
                return 0.9
            else:
                return 0.7
        elif year <= lifespan_start + 5:
            return 0.3  # before birth but close
        else:
            return 0.0  # after death
    else:
        # No death date: score based on age reasonableness
        if 15 <= age_at_event <= 90:
            return 0.8
        elif 0 <= age_at_event <= 100:
            return 0.5
        return 0.1


# --- Feature 3: Geographic Similarity ---

def feat_location(location: Optional[str], identity: RosieIdentity) -> float:
    """Score geographic match using location hierarchy. 0-1."""
    if not location:
        return 0.3  # unknown = slightly below neutral

    loc_norm = _normalize_location(location)

    # Check anti-locations
    for anti in identity.anti_locations:
        if anti.lower() in loc_norm or loc_norm in anti.lower():
            return 0.05  # strong negative

    all_locs = identity.birth_locations + identity.death_locations + identity.residence_locations
    if not all_locs:
        return 0.3  # identity has no location data

    # Exact or substring match with known locations
    for known_loc in all_locs:
        kl = _normalize_location(known_loc)
        if loc_norm == kl or kl in loc_norm or loc_norm in kl:
            return 1.0

    # Region-level match
    event_info = _get_location_info(location)
    if event_info:
        for known_loc in all_locs:
            known_info = _get_location_info(known_loc)
            if known_info:
                # Same region
                if event_info['region'] == known_info['region']:
                    return 0.75
                # Adjacent region
                adj = ADJACENT_REGIONS.get(event_info['region'], set())
                if known_info['region'] in adj:
                    return 0.45

    # Word overlap as fallback
    loc_words = set(loc_norm.replace(',', ' ').split())
    for known_loc in all_locs:
        kl_words = set(_normalize_location(known_loc).split())
        if loc_words & kl_words - {'queensland', 'qld', 'australia'}:
            return 0.5

    return 0.1  # no match


# --- Feature 4: Family Name in Context ---

def feat_family(text: str, identity: RosieIdentity) -> float:
    """Score presence of family names in combined text. 0-1."""
    if not text:
        return 0.1
    text_lower = text.lower()

    # Check anti-names first
    anti_matches = 0
    for an in identity.anti_names:
        if an.lower() in text_lower:
            anti_matches += 1
    if anti_matches > 0 and not identity.family_names:
        return 0.02

    if not identity.family_names:
        return 0.1

    # Count family name matches, weighting longer/more specific names higher
    matches = 0
    match_weight = 0.0
    for fn in identity.family_names:
        fn_lower = fn.lower()
        if fn_lower in text_lower:
            matches += 1
            # Longer names are more distinctive
            match_weight += min(1.0, len(fn_lower) / 15.0)

    if matches == 0:
        # Check for anti-name matches with no family name matches
        if anti_matches > 0:
            return 0.02
        return 0.1

    # Diminishing returns on multiple matches
    return min(1.0, 0.3 + match_weight * 0.25)


# --- Feature 5: Diagnostic Predicate-Value Pairs ---

def feat_diagnostic(predicate: str, value: str, text_span: str,
                    identity: RosieIdentity) -> float:
    """Score diagnostic predicate-value matches. These are the strongest signals."""
    if not identity.diagnostic_claims:
        return 0.3  # neutral

    pred_lower = predicate.lower()
    val_lower = value.lower()
    text_lower = text_span.lower()
    combined = f"{val_lower} {text_lower}"

    for diag_pred, diag_val in identity.diagnostic_claims:
        dp = diag_pred.lower()
        dv = diag_val.lower()

        # Exact predicate match + value contains diagnostic value
        if pred_lower == dp and dv in combined:
            return 1.0

        # Value match without predicate (still strong)
        if len(dv) > 4 and dv in combined:
            return 0.85

    return 0.2  # no diagnostic match


# --- Feature 6: Source Document Clustering ---

def feat_source(source_id: str, identity: RosieIdentity,
                source_identity_map: Dict[str, Dict[str, float]]) -> float:
    """Score based on what other events from the same source are assigned to."""
    if not source_id or source_id == 'unknown':
        return 0.3
    scores = source_identity_map.get(source_id, {})
    return scores.get(identity.id, 0.3)


# --- Feature 7: Classification Match ---

def feat_classification(value: str, predicate: str, identity: RosieIdentity) -> float:
    """Score classification match."""
    if 'classif' not in predicate.lower() and predicate.lower() not in ('classification', 'race', 'racial_classification'):
        return 0.3  # not a classification predicate

    if not identity.classifications:
        return 0.3

    val_lower = value.lower()
    for ic in identity.classifications:
        if ic.lower() in val_lower or val_lower in ic.lower():
            return 1.0

    return 0.2


# --- Feature 8: Entity Co-occurrence ---

# Pre-compute lowercased family/anti name sets per identity (avoids millions of .lower() calls)
_IDENTITY_FAMILY_LOWER: Dict[str, Set[str]] = {}
_IDENTITY_ANTI_LOWER: Dict[str, Set[str]] = {}

def _init_cooccurrence_caches():
    """Pre-compute lowercased name sets for all identities."""
    for identity in ROSIE_IDENTITIES:
        _IDENTITY_FAMILY_LOWER[identity.id] = {fn.lower() for fn in identity.family_names}
        _IDENTITY_ANTI_LOWER[identity.id] = {an.lower() for an in identity.anti_names}

_init_cooccurrence_caches()


# Pre-computed co-occurrence scores: (entity_id, identity_id) -> score
_COOCCURRENCE_CACHE: Dict[Tuple[str, str], float] = {}
_COOCCURRENCE_CACHE_BUILT = False


def _build_cooccurrence_cache(cooccurrence_map: Dict[str, Set[str]]):
    """Pre-compute all co-occurrence scores to avoid hot-loop substring matching."""
    global _COOCCURRENCE_CACHE, _COOCCURRENCE_CACHE_BUILT

    for entity_id, co_entities in cooccurrence_map.items():
        for identity in ROSIE_IDENTITIES:
            family_lower = _IDENTITY_FAMILY_LOWER.get(identity.id, set())
            anti_lower = _IDENTITY_ANTI_LOWER.get(identity.id, set())

            if not family_lower:
                _COOCCURRENCE_CACHE[(entity_id, identity.id)] = 0.3
                continue

            matches = 0
            anti_matches = 0
            for co_ent in co_entities:
                matched_fam = False
                for fam in family_lower:
                    if fam in co_ent or co_ent in fam:
                        matches += 1
                        matched_fam = True
                        break
                if not matched_fam:
                    for anti in anti_lower:
                        if anti in co_ent or co_ent in anti:
                            anti_matches += 1
                            break

            if matches == 0 and anti_matches == 0:
                score = 0.3
            elif anti_matches > matches:
                score = 0.1
            else:
                score = min(1.0, 0.3 + matches * 0.15)

            _COOCCURRENCE_CACHE[(entity_id, identity.id)] = score

    _COOCCURRENCE_CACHE_BUILT = True


def feat_cooccurrence(entity_id: str, identity: RosieIdentity,
                      cooccurrence_map: Dict[str, Set[str]]) -> float:
    """Score based on other entities mentioned in same source chunks as this entity.
    Uses pre-computed cache for performance."""
    if not entity_id:
        return 0.3
    return _COOCCURRENCE_CACHE.get((entity_id, identity.id), 0.3)


# --- Feature 9: EKY Schedule Adjacency ---

def feat_schedule_adjacency(text: str, entity_name: str,
                            identity: RosieIdentity) -> float:
    """Score based on mentions of EKY schedule neighbor names in the event.
    If an event mentions a name from a neighboring schedule entry, it's a
    signal that this event belongs to the identity in that cluster."""
    if not identity.schedule_neighbors:
        return 0.3  # not a native title identity or no neighbors

    combined = f"{entity_name} {text}".lower()

    matches = 0
    for neighbor in identity.schedule_neighbors:
        if neighbor.lower() in combined:
            matches += 1

    if matches == 0:
        return 0.3

    # Each neighbor match is a moderate signal
    return min(1.0, 0.4 + matches * 0.2)


# ═══════════════════════════════════════════════════════════════
# 4. EVENT DATA STRUCTURE
# ═══════════════════════════════════════════════════════════════

@dataclass
class RosieEvent:
    """A single event/claim/record about someone named Rosie."""
    id: str
    entity_name: str
    entity_id: str
    predicate: str
    value: str
    confidence: str
    text_span: str
    source_id: str
    year: Optional[int] = None
    location: Optional[str] = None
    probabilities: Dict[str, float] = field(default_factory=dict)
    best_identity: str = ""
    best_probability: float = 0.0
    ground_truth: Optional[str] = None  # set by ground truth system
    ground_truth_conf: float = 0.0
    ground_truth_reason: str = ""
    excluded: bool = False  # clearly different person
    features: Dict[str, Dict[str, float]] = field(default_factory=dict)


# ═══════════════════════════════════════════════════════════════
# 5. MAIN RESOLUTION ENGINE
# ═══════════════════════════════════════════════════════════════

def load_rosie_events(db_path: str = "research.db") -> List[RosieEvent]:
    """Load all Rosie events from GOKS."""
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row

    rows = conn.execute("""
        SELECT c.id, e.canonical_name, e.id as entity_id,
               c.predicate, c.object_value, c.confidence,
               c.text_span, c.source_id
        FROM claims c JOIN entities e ON c.subject_id = e.id
        WHERE e.type = 'person' AND e.canonical_name LIKE '%Rosie%'
        AND c.confidence IN ('strong', 'moderate')
    """).fetchall()

    events = []
    for r in rows:
        event = RosieEvent(
            id=r['id'],
            entity_name=r['canonical_name'],
            entity_id=r['entity_id'],
            predicate=r['predicate'] or '',
            value=r['object_value'] or '',
            confidence=r['confidence'],
            text_span=r['text_span'] or '',
            source_id=r['source_id'] or '',
        )
        event.year = extract_year_from_claim(dict(r))
        event.location = extract_location_from_claim(dict(r))
        events.append(event)

    conn.close()
    return events


def build_cooccurrence_map(db_path: str = "research.db") -> Dict[str, Set[str]]:
    """Build entity co-occurrence map: for each Rosie entity, find what other
    entities appear in claims from the same source_id."""
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row

    # Get all Rosie entity IDs
    rosie_ids = set()
    for r in conn.execute("""
        SELECT DISTINCT e.id FROM entities e
        WHERE e.type = 'person' AND e.canonical_name LIKE '%Rosie%'
    """).fetchall():
        rosie_ids.add(r['id'])

    # For each source_id that has Rosie claims, find all entities mentioned
    source_entities = defaultdict(set)
    for r in conn.execute("""
        SELECT c.source_id, e.canonical_name, e.id as entity_id
        FROM claims c JOIN entities e ON c.subject_id = e.id
        WHERE c.source_id IS NOT NULL AND c.source_id != 'unknown'
        AND c.source_id IN (
            SELECT DISTINCT c2.source_id FROM claims c2 JOIN entities e2 ON c2.subject_id = e2.id
            WHERE e2.type = 'person' AND e2.canonical_name LIKE '%Rosie%'
            AND c2.source_id IS NOT NULL AND c2.source_id != 'unknown'
        )
    """).fetchall():
        source_entities[r['source_id']].add(r['canonical_name'])

    # Build co-occurrence map: entity_id -> set of co-occurring entity names (lowercased)
    cooccurrence = defaultdict(set)
    for r in conn.execute("""
        SELECT c.source_id, e.id as entity_id
        FROM claims c JOIN entities e ON c.subject_id = e.id
        WHERE e.type = 'person' AND e.canonical_name LIKE '%Rosie%'
        AND c.source_id IS NOT NULL AND c.source_id != 'unknown'
    """).fetchall():
        src = r['source_id']
        eid = r['entity_id']
        cooccurrence[eid] |= source_entities.get(src, set())

    # Pre-lowercase all co-occurring names for faster comparison
    lowered = {}
    for eid, names in cooccurrence.items():
        lowered[eid] = {n.lower() for n in names}

    conn.close()
    return lowered


def build_source_identity_prior(events: List[RosieEvent],
                                identities: List[RosieIdentity]) -> Dict[str, Dict[str, float]]:
    """Build source-level identity priors from ground truth assignments.
    For each source_id, compute what fraction of its ground-truth events
    belong to each identity."""
    source_counts: Dict[str, Dict[str, float]] = defaultdict(lambda: defaultdict(float))
    source_totals: Dict[str, float] = defaultdict(float)

    for event in events:
        if event.ground_truth and event.source_id and event.source_id != 'unknown':
            source_counts[event.source_id][event.ground_truth] += event.ground_truth_conf
            source_totals[event.source_id] += event.ground_truth_conf

    result = {}
    for src, counts in source_counts.items():
        total = source_totals[src]
        if total > 0:
            result[src] = {iid: counts.get(iid, 0) / total for iid in [i.id for i in identities]}
        else:
            result[src] = {i.id: 1.0 / len(identities) for i in identities}

    return result


def compute_probabilities(events: List[RosieEvent],
                          identities: List[RosieIdentity],
                          cooccurrence_map: Dict[str, Set[str]],
                          source_identity_map: Dict[str, Dict[str, float]]) -> List[RosieEvent]:
    """Compute probability distribution for each event across all identities."""

    # Feature weights (importance ranking from most to least informative)
    W = {
        'diagnostic':    5.0,  # diagnostic predicate-value pairs
        'ground_truth':  8.0,  # ground truth override (highest weight)
        'name_form':     3.5,  # entity name matching
        'temporal':      4.0,  # temporal constraints (hard vetoes)
        'location':      2.5,  # geographic matching
        'family':        3.0,  # family name in context
        'source':        2.0,  # source document clustering
        'classification': 1.0, # racial classification
        'cooccurrence':  1.5,  # entity co-occurrence
        'schedule':      2.0,  # EKY schedule adjacency (kinship cluster)
    }

    for event in events:
        # Skip excluded entities
        if event.excluded:
            continue

        scores = {}
        combined_text = f"{event.value} {event.text_span}"

        for identity in identities:
            # Ground truth override
            if event.ground_truth == identity.id:
                gt_score = event.ground_truth_conf
            elif event.ground_truth and event.ground_truth != identity.id:
                gt_score = 0.05  # penalize non-matching identities
            else:
                gt_score = 0.3  # neutral

            # Compute each feature
            f_name = feat_name_form(event.entity_name, identity)
            f_temporal = feat_temporal(event.year, identity)
            f_location = feat_location(event.location, identity)
            f_family = feat_family(combined_text, identity)
            f_diagnostic = feat_diagnostic(event.predicate, event.value,
                                           event.text_span, identity)
            f_source = feat_source(event.source_id, identity, source_identity_map)
            f_class = feat_classification(event.value, event.predicate, identity)
            f_cooc = feat_cooccurrence(event.entity_id, identity, cooccurrence_map)
            f_schedule = feat_schedule_adjacency(combined_text, event.entity_name, identity)

            # Store features for debugging
            if identity.id not in event.features:
                event.features[identity.id] = {}
            event.features[identity.id] = {
                'name_form': round(f_name, 3),
                'temporal': round(f_temporal, 3),
                'location': round(f_location, 3),
                'family': round(f_family, 3),
                'diagnostic': round(f_diagnostic, 3),
                'source': round(f_source, 3),
                'classification': round(f_class, 3),
                'cooccurrence': round(f_cooc, 3),
                'schedule': round(f_schedule, 3),
                'ground_truth': round(gt_score, 3),
            }

            # Hard constraint: temporal impossibility = veto
            if f_temporal == 0.0:
                scores[identity.id] = 0.0
                continue

            # Weighted log-linear combination
            eps = 0.001
            log_score = (
                W['ground_truth'] * math.log(max(gt_score, eps)) +
                W['diagnostic'] * math.log(max(f_diagnostic, eps)) +
                W['name_form'] * math.log(max(f_name, eps)) +
                W['temporal'] * math.log(max(f_temporal, eps)) +
                W['location'] * math.log(max(f_location, eps)) +
                W['family'] * math.log(max(f_family, eps)) +
                W['source'] * math.log(max(f_source, eps)) +
                W['classification'] * math.log(max(f_class, eps)) +
                W['cooccurrence'] * math.log(max(f_cooc, eps)) +
                W['schedule'] * math.log(max(f_schedule, eps))
            )

            scores[identity.id] = math.exp(log_score)

        # Normalize to probabilities
        total = sum(scores.values())
        if total > 0:
            for iid in scores:
                scores[iid] /= total
        else:
            for identity in identities:
                scores[identity.id] = 1.0 / len(identities)

        event.probabilities = scores
        if scores:
            event.best_identity = max(scores, key=scores.get)
            event.best_probability = scores[event.best_identity]

    return events


# ═══════════════════════════════════════════════════════════════
# 6. BELIEF PROPAGATION
# ═══════════════════════════════════════════════════════════════

def belief_propagation(events: List[RosieEvent],
                       identities: List[RosieIdentity],
                       max_iterations: int = 5,
                       damping: float = 0.3) -> List[RosieEvent]:
    """Iterative belief propagation through entity and source co-occurrence.

    After initial scoring, propagate beliefs:
    - Events from the same entity_id should converge toward the same identity
    - Events from the same source_id should be influenced by each other
    - High-confidence assignments propagate to lower-confidence neighbors

    Uses damping to prevent oscillation.
    """

    for iteration in range(max_iterations):
        changes = 0.0

        # Phase 1: Entity-level propagation
        # Events about the same entity should agree
        entity_groups: Dict[str, List[RosieEvent]] = defaultdict(list)
        for e in events:
            if not e.excluded and e.entity_id:
                entity_groups[e.entity_id].append(e)

        for entity_id, group in entity_groups.items():
            if len(group) < 2:
                continue

            # Compute mean probability per identity (weighted by confidence)
            mean_probs: Dict[str, float] = defaultdict(float)
            total_weight = 0.0
            for e in group:
                w = e.best_probability  # higher confidence events have more influence
                for iid, prob in e.probabilities.items():
                    mean_probs[iid] += prob * w
                total_weight += w

            if total_weight > 0:
                for iid in mean_probs:
                    mean_probs[iid] /= total_weight

            # Update each event toward the mean (with damping)
            for e in group:
                # Don't propagate away from ground truth
                if e.ground_truth and e.ground_truth_conf > 0.8:
                    continue

                new_probs = {}
                for iid in e.probabilities:
                    old = e.probabilities[iid]
                    target = mean_probs.get(iid, old)
                    new_val = old * (1 - damping) + target * damping
                    new_probs[iid] = new_val
                    changes += abs(new_val - old)

                # Re-normalize
                total = sum(new_probs.values())
                if total > 0:
                    for iid in new_probs:
                        new_probs[iid] /= total
                e.probabilities = new_probs

        # Phase 2: Source-level propagation
        source_groups: Dict[str, List[RosieEvent]] = defaultdict(list)
        for e in events:
            if not e.excluded and e.source_id and e.source_id != 'unknown':
                source_groups[e.source_id].append(e)

        for source_id, group in source_groups.items():
            if len(group) < 3:  # need at least 3 for meaningful propagation
                continue

            mean_probs: Dict[str, float] = defaultdict(float)
            total_weight = 0.0
            for e in group:
                w = e.best_probability
                for iid, prob in e.probabilities.items():
                    mean_probs[iid] += prob * w
                total_weight += w

            if total_weight > 0:
                for iid in mean_probs:
                    mean_probs[iid] /= total_weight

            # Lighter damping for source propagation (less certain)
            src_damping = damping * 0.5
            for e in group:
                if e.ground_truth and e.ground_truth_conf > 0.8:
                    continue

                new_probs = {}
                for iid in e.probabilities:
                    old = e.probabilities[iid]
                    target = mean_probs.get(iid, old)
                    new_val = old * (1 - src_damping) + target * src_damping
                    new_probs[iid] = new_val

                total = sum(new_probs.values())
                if total > 0:
                    for iid in new_probs:
                        new_probs[iid] /= total
                e.probabilities = new_probs

        # Update best assignments
        for e in events:
            if not e.excluded and e.probabilities:
                e.best_identity = max(e.probabilities, key=e.probabilities.get)
                e.best_probability = e.probabilities[e.best_identity]

        # Check convergence
        avg_change = changes / max(len(events), 1)
        if avg_change < 0.001:
            break

    return events


# ═══════════════════════════════════════════════════════════════
# 7. EVALUATION SYSTEM
# ═══════════════════════════════════════════════════════════════

@dataclass
class EvalMetrics:
    """Evaluation metrics for the resolver."""
    total_events: int = 0
    excluded_events: int = 0
    ground_truth_events: int = 0
    # Per-identity metrics
    identity_metrics: Dict[str, Dict[str, float]] = field(default_factory=dict)
    # Overall metrics
    accuracy: float = 0.0
    ambiguity_rate: float = 0.0  # fraction with best_prob < 0.4
    high_confidence_rate: float = 0.0  # fraction with best_prob > 0.8
    r1_r9_separation: float = 0.0  # how cleanly R1/R9 are separated
    mean_confidence: float = 0.0


def evaluate(events: List[RosieEvent], identities: List[RosieIdentity]) -> EvalMetrics:
    """Compute evaluation metrics."""
    m = EvalMetrics()
    m.total_events = len(events)
    m.excluded_events = sum(1 for e in events if e.excluded)

    active_events = [e for e in events if not e.excluded]
    gt_events = [e for e in active_events if e.ground_truth]
    m.ground_truth_events = len(gt_events)

    # Accuracy on ground truth events
    if gt_events:
        correct = sum(1 for e in gt_events if e.best_identity == e.ground_truth)
        m.accuracy = correct / len(gt_events)

    # Per-identity precision/recall
    for identity in identities:
        iid = identity.id
        # True positives: ground truth = iid AND predicted = iid
        tp = sum(1 for e in gt_events if e.ground_truth == iid and e.best_identity == iid)
        # False positives: predicted = iid but ground truth != iid
        fp = sum(1 for e in gt_events if e.best_identity == iid and e.ground_truth != iid)
        # False negatives: ground truth = iid but predicted != iid
        fn = sum(1 for e in gt_events if e.ground_truth == iid and e.best_identity != iid)
        # Total assigned
        total_assigned = sum(1 for e in active_events if e.best_identity == iid)

        precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0.0

        m.identity_metrics[iid] = {
            'precision': round(precision, 4),
            'recall': round(recall, 4),
            'f1': round(f1, 4),
            'true_positives': tp,
            'false_positives': fp,
            'false_negatives': fn,
            'total_assigned': total_assigned,
        }

    # Ambiguity and confidence rates
    if active_events:
        m.ambiguity_rate = sum(1 for e in active_events if e.best_probability < 0.4) / len(active_events)
        m.high_confidence_rate = sum(1 for e in active_events if e.best_probability > 0.8) / len(active_events)
        m.mean_confidence = sum(e.best_probability for e in active_events) / len(active_events)

    # R1/R9 separation score
    # For events assigned to R1, how much probability mass goes to R9 (and vice versa)?
    r1_events = [e for e in active_events if e.best_identity == 'R1']
    r9_events = [e for e in active_events if e.best_identity == 'R9']

    r1_leakage = 0.0
    if r1_events:
        r1_leakage = sum(e.probabilities.get('R9', 0) for e in r1_events) / len(r1_events)

    r9_leakage = 0.0
    if r9_events:
        r9_leakage = sum(e.probabilities.get('R1', 0) for e in r9_events) / len(r9_events)

    # Separation = 1 - average leakage (1.0 = perfect separation, 0.0 = complete overlap)
    m.r1_r9_separation = 1.0 - (r1_leakage + r9_leakage) / 2.0

    return m


def print_evaluation(m: EvalMetrics, identities: List[RosieIdentity]):
    """Print evaluation report."""
    print()
    print("=" * 80)
    print("EVALUATION REPORT")
    print("=" * 80)
    print(f"Total events: {m.total_events}")
    print(f"Excluded (different people): {m.excluded_events}")
    print(f"Active events: {m.total_events - m.excluded_events}")
    print(f"Ground truth events: {m.ground_truth_events}")
    print()
    print(f"{'Metric':<30} {'Value':>10}")
    print("-" * 42)
    print(f"{'Accuracy (on GT events)':<30} {m.accuracy:>10.1%}")
    print(f"{'Mean confidence':<30} {m.mean_confidence:>10.1%}")
    print(f"{'High confidence rate (>0.8)':<30} {m.high_confidence_rate:>10.1%}")
    print(f"{'Ambiguity rate (<0.4)':<30} {m.ambiguity_rate:>10.1%}")
    print(f"{'R1/R9 separation':<30} {m.r1_r9_separation:>10.1%}")

    print()
    print(f"{'ID':<5} {'Precision':>10} {'Recall':>10} {'F1':>10} {'TP':>5} {'FP':>5} {'FN':>5} {'Assigned':>10}")
    print("-" * 70)
    for identity in identities:
        iid = identity.id
        im = m.identity_metrics.get(iid, {})
        if im.get('total_assigned', 0) > 0 or im.get('true_positives', 0) > 0:
            print(f"{iid:<5} {im.get('precision',0):>10.1%} {im.get('recall',0):>10.1%} "
                  f"{im.get('f1',0):>10.1%} {im.get('true_positives',0):>5} "
                  f"{im.get('false_positives',0):>5} {im.get('false_negatives',0):>5} "
                  f"{im.get('total_assigned',0):>10}")


# ═══════════════════════════════════════════════════════════════
# 8. AGGREGATION AND OUTPUT
# ═══════════════════════════════════════════════════════════════

def aggregate_identity_scores(events: List[RosieEvent],
                               identities: List[RosieIdentity]) -> Dict[str, Dict]:
    """Aggregate event-level probabilities into identity-level scores."""
    active_events = [e for e in events if not e.excluded]

    agg = {}
    for identity in identities:
        assigned = [e for e in active_events if e.best_identity == identity.id]
        total_prob = sum(e.probabilities.get(identity.id, 0) for e in active_events)
        strong = [e for e in assigned if e.best_probability > 0.5]
        weak = [e for e in assigned if e.best_probability <= 0.5]
        gt_count = sum(1 for e in assigned if e.ground_truth == identity.id)

        predicates = set(e.predicate for e in assigned)
        locations = set(e.location for e in assigned if e.location)
        years = [e.year for e in assigned if e.year]

        agg[identity.id] = {
            'id': identity.id,
            'label': identity.label,
            'total_events': len(assigned),
            'total_probability_mass': round(total_prob, 2),
            'strong_assignments': len(strong),
            'weak_assignments': len(weak),
            'ground_truth_confirmed': gt_count,
            'predicates_covered': sorted(predicates),
            'locations_found': sorted(locations),
            'year_range': f"{min(years)}-{max(years)}" if years else "unknown",
        }

    return agg


def print_results(events, identities, aggregates, metrics):
    """Print comprehensive results."""
    print()
    print("=" * 80)
    print("ROSIE IDENTITY RESOLUTION SYSTEM v2")
    print("=" * 80)

    active = [e for e in events if not e.excluded]
    print(f"Events processed: {len(events)} ({len(events) - len(active)} excluded, {len(active)} active)")
    print(f"Identities defined: {len(identities)} (R2 merged into R9)")
    print()

    # Identity summary
    print("IDENTITY SUMMARY:")
    print(f"{'ID':<5} {'Label':<45} {'Events':>7} {'Strong':>7} {'GT':>5} {'Prob Mass':>10}")
    print("-" * 85)

    sorted_ids = sorted(aggregates.values(), key=lambda x: x['total_probability_mass'], reverse=True)
    for a in sorted_ids:
        print(f"{a['id']:<5} {a['label']:<45} {a['total_events']:>7} "
              f"{a['strong_assignments']:>7} {a['ground_truth_confirmed']:>5} "
              f"{a['total_probability_mass']:>10.1f}")

    # Detailed per-identity
    for a in sorted_ids:
        if a['total_events'] == 0:
            continue
        print(f"\n{'─'*80}")
        print(f"  {a['id']}: {a['label']}")
        print(f"  Events: {a['total_events']} ({a['strong_assignments']} strong, {a['weak_assignments']} weak, {a['ground_truth_confirmed']} GT-confirmed)")
        print(f"  Year range: {a['year_range']}")
        print(f"  Locations: {', '.join(list(a['locations_found'])[:10])}")
        print(f"  Predicates: {', '.join(list(a['predicates_covered'])[:10])}")

        id_events = sorted(
            [e for e in active if e.best_identity == a['id']],
            key=lambda e: e.best_probability, reverse=True
        )
        if id_events:
            print(f"  Top events (by confidence):")
            for e in id_events[:8]:
                gt_marker = " [GT]" if e.ground_truth == a['id'] else ""
                print(f"    [{e.best_probability:.3f}] {e.predicate:20s} = {e.value[:50]}{gt_marker}")

    # Ambiguous events
    print(f"\n{'='*80}")
    print("AMBIGUOUS EVENTS (best probability < 0.4):")
    ambiguous = [e for e in active if e.best_probability < 0.4 and e.best_probability > 0]
    ambiguous.sort(key=lambda e: e.best_probability)
    for e in ambiguous[:20]:
        top3 = sorted(e.probabilities.items(), key=lambda x: -x[1])[:3]
        probs_str = ', '.join(f"{k}:{v:.2f}" for k, v in top3)
        gt_str = f" [GT={e.ground_truth}]" if e.ground_truth else ""
        print(f"  {e.entity_name:30s} | {e.predicate:15s} | {probs_str}{gt_str}")

    # Potential merges
    print(f"\n{'='*80}")
    print("R1/R9 OVERLAP (events where both score > 0.3):")
    overlap = [(e, e.probabilities.get('R1', 0), e.probabilities.get('R9', 0))
               for e in active
               if e.probabilities.get('R1', 0) > 0.3 and e.probabilities.get('R9', 0) > 0.3]
    overlap.sort(key=lambda x: abs(x[1] - x[2]))
    for e, r1p, r9p in overlap[:15]:
        print(f"  {e.entity_name:30s} | {e.predicate:15s} | R1:{r1p:.2f} R9:{r9p:.2f} | {e.value[:40]}")
    print(f"  Total R1/R9 overlap events: {len(overlap)}")

    # Evaluation
    print_evaluation(metrics, identities)


def save_results(events, identities, aggregates, metrics, output_path="rosie_resolution.json"):
    """Save full results as JSON."""
    active = [e for e in events if not e.excluded]

    output = {
        'version': 2,
        'identities': {i.id: asdict(i) for i in identities},
        'aggregates': aggregates,
        'metrics': {
            'accuracy': round(metrics.accuracy, 4),
            'mean_confidence': round(metrics.mean_confidence, 4),
            'high_confidence_rate': round(metrics.high_confidence_rate, 4),
            'ambiguity_rate': round(metrics.ambiguity_rate, 4),
            'r1_r9_separation': round(metrics.r1_r9_separation, 4),
            'per_identity': metrics.identity_metrics,
        },
        'event_count': len(events),
        'active_count': len(active),
        'excluded_count': len(events) - len(active),
        'ambiguous_count': sum(1 for e in active if e.best_probability < 0.4),
        'events': [
            {
                'entity_name': e.entity_name,
                'predicate': e.predicate,
                'value': e.value[:200],
                'year': e.year,
                'location': e.location,
                'source_id': e.source_id,
                'best_identity': e.best_identity,
                'best_probability': round(e.best_probability, 4),
                'ground_truth': e.ground_truth,
                'probabilities': {k: round(v, 4) for k, v in e.probabilities.items() if v > 0.01},
                'features': {iid: feats for iid, feats in e.features.items()
                             if e.probabilities.get(iid, 0) > 0.05} if e.features else {},
            }
            for e in active
        ],
    }

    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2, default=str)

    print(f"\nFull results saved to {output_path} ({len(json.dumps(output)):,} chars)")


# ═══════════════════════════════════════════════════════════════
# 9. CLI
# ═══════════════════════════════════════════════════════════════

def main():
    db_path = os.environ.get('GIE_DB', 'research.db')

    print(f"Loading Rosie events from {db_path}...")
    events = load_rosie_events(db_path)
    print(f"Loaded {len(events)} events")

    # Mark excluded entities
    for e in events:
        if e.entity_name.lower().strip() in EXCLUDE_ENTITIES:
            e.excluded = True
    excluded = sum(1 for e in events if e.excluded)
    print(f"Excluded {excluded} events (clearly different people)")

    # Apply ground truth
    print("Applying ground truth constraints...")
    gt_count = 0
    for e in events:
        if e.excluded:
            continue
        gt = check_ground_truth(e)
        if gt:
            e.ground_truth, e.ground_truth_conf, e.ground_truth_reason = gt
            gt_count += 1
    print(f"Ground truth applied to {gt_count} events")

    # Build co-occurrence map
    print("Building entity co-occurrence map...")
    cooccurrence_map = build_cooccurrence_map(db_path)
    print(f"Co-occurrence data for {len(cooccurrence_map)} entities")

    # Pre-compute co-occurrence scores (avoids hot-loop substring matching)
    print("Pre-computing co-occurrence scores...")
    _build_cooccurrence_cache(cooccurrence_map)
    print(f"Cached {len(_COOCCURRENCE_CACHE)} (entity, identity) scores")

    # Build source identity priors (from ground truth)
    source_identity_map = build_source_identity_prior(events, ROSIE_IDENTITIES)
    print(f"Source priors computed for {len(source_identity_map)} sources")

    # Initial probability computation
    print("Computing initial probabilities (10 feature channels)...")
    events = compute_probabilities(events, ROSIE_IDENTITIES, cooccurrence_map, source_identity_map)

    # Belief propagation
    print("Running belief propagation (5 iterations)...")
    events = belief_propagation(events, ROSIE_IDENTITIES, max_iterations=5, damping=0.3)

    # Evaluate
    print("Evaluating...")
    metrics = evaluate(events, ROSIE_IDENTITIES)

    # Aggregate
    aggregates = aggregate_identity_scores(events, ROSIE_IDENTITIES)

    # Output
    print_results(events, ROSIE_IDENTITIES, aggregates, metrics)
    save_results(events, ROSIE_IDENTITIES, aggregates, metrics)


if __name__ == '__main__':
    main()
