export type PersonData = {
  slug: string;
  name: string;
  born?: string;
  died?: string;
  birthPlace?: string;
  deathPlace?: string;
  nationality: string;
  ethnicity: string;
  clan?: string;
  island?: string;
  occupation?: string[];
  knownFor?: string;
  spouse?: string;
  children?: string[];
  parents?: { father?: string; mother?: string };
  siblings?: string[];
  militaryService?: string;
  education?: string;
  awards?: string[];
  bio: string;
  sections: { heading: string; content: string }[];
  sources: string[];
  relatedArticles: string[];
  categories: string[];
  image?: string;
};

export type ArticleData = {
  slug: string;
  title: string;
  type: "tribe" | "location" | "organization" | "event" | "culture";
  summary: string;
  sections: { heading: string; content: string }[];
  infobox?: Record<string, string>;
  sources: string[];
  relatedArticles: string[];
  categories: string[];
};

export type FamilyLink = {
  parent: string;
  child: string;
};

export type SpouseLink = {
  person1: string;
  person2: string;
  marriageDate?: string;
};

// ─── People ────────────────────────────────────────────────────────────

export const people: PersonData[] = [
  // ── Sagigi Family (Badu Island) ──────────────────────────────────────
  {
    slug: "baita-sagigi",
    name: "Baita Sagigi",
    born: "c. 1900s",
    island: "Badu Island",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander (Badulgal)",
    clan: "Badulgal",
    occupation: ["Community member"],
    bio: "Baita Sagigi was a Torres Strait Islander man from Badu Island in the western Torres Strait. He is recorded in the 1941 Child Endowment records as head of a household on Badu Island with six children.",
    sections: [
      {
        heading: "Family",
        content:
          "In the 1941 Child Endowment records (CIFHS), Baita Sagigi TSI of Badu Island was listed as claimant for six children: Kathleen (b. 10 September 1926), Seilu (b. 5 October 1930), Margaret (b. 1933), Nazareth (b. 1 October 1934), Natanelu (b. 19 April 1937), and Masi (b. 13 July 1938).",
      },
      {
        heading: "Historical context",
        content:
          "The Child Endowment scheme was introduced by the Australian Government in 1941. For Torres Strait Islander families, these records provide some of the earliest systematic documentation of family structures, as civil registration was inconsistently applied in the Torres Strait before the 1940s.",
      },
    ],
    children: [
      "Kathleen Sagigi",
      "Seilu Sagigi",
      "Margaret Sagigi",
      "Nazareth Sagigi",
      "Natanelu Sagigi",
      "Masi Sagigi",
    ],
    sources: [
      "CIFHS Child Endowment Thursday Island c.1941",
    ],
    relatedArticles: ["gawagi-sagigi", "dan-sagigi-snr", "badu-island", "badulgal"],
    categories: ["Sagigi family", "Badu Island people", "Badulgal"],
  },
  {
    slug: "gawagi-sagigi",
    name: "Gawagi Sagigi",
    born: "c. 1900s",
    island: "Badu Island",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander (Badulgal)",
    clan: "Badulgal",
    occupation: ["Community member"],
    bio: "Gawagi Sagigi was a Torres Strait Islander man from Badu Island. He appears in the 1941 Child Endowment records as head of a household with two children on Badu Island.",
    sections: [
      {
        heading: "Family",
        content:
          "In the 1941 CIFHS Child Endowment records, Gawagi Sagigi TSI of Badu Island was listed as claimant for two children: Rosa (b. 16 March 1938) and Diat (b. 12 October 1939).",
      },
    ],
    children: ["Rosa Sagigi", "Diat Sagigi"],
    sources: ["CIFHS Child Endowment Thursday Island c.1941"],
    relatedArticles: ["baita-sagigi", "badu-island", "badulgal"],
    categories: ["Sagigi family", "Badu Island people", "Badulgal"],
  },
  {
    slug: "dan-sagigi-snr",
    name: "Dan Sagigi (Snr)",
    died: "July 2002",
    island: "Badu Island",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander (Badulgal)",
    clan: "Badulgal",
    occupation: ["Traditional elder", "Native title claimant"],
    knownFor: "Original applicant in Badu Island native title claim",
    bio: "Dan Sagigi (Snr) was a traditional Badulaig elder from Badu Island in the western Torres Strait. He served as the original named applicant in the Badu Island native title claim, one of the landmark cases recognizing Torres Strait Islander peoples' traditional ownership of their island homelands.",
    sections: [
      {
        heading: "Native title",
        content:
          "Dan Sagigi (Snr) was the original applicant in the Badu Island native title claim filed with the Federal Court of Australia. After his death in July 2002, Victor Nona became the named applicant and continued the case. Native title over Badu Island was formally determined on 1 February 2014, recognizing the traditional rights of the Badulgal people.",
      },
      {
        heading: "Legacy",
        content:
          "Dan Sagigi (Snr) is remembered as a respected Badulaig elder who fought for the formal recognition of his people's traditional ownership of Badu Island. His son, Jacob Dan Sagigi Jr. (2 June 1959 to 21 May 2001), predeceased him and is buried at Cairns Cemetery.",
      },
    ],
    children: ["Jacob Dan Sagigi Jr."],
    sources: [
      "Badu PBC Corporation",
      "Queensland Government community histories",
      "Federal Court of Australia, Badu Island native title determination, 2014",
    ],
    relatedArticles: ["badu-island", "badulgal", "jacob-dan-sagigi-jr"],
    categories: [
      "Sagigi family",
      "Badu Island people",
      "Badulgal",
      "Native title claimants",
      "Torres Strait elders",
    ],
  },
  {
    slug: "jacob-dan-sagigi-jr",
    name: "Jacob Dan Sagigi Jr.",
    born: "2 June 1959",
    died: "21 May 2001",
    deathPlace: "Cairns, Queensland",
    island: "Badu Island",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander (Badulgal)",
    clan: "Badulgal",
    parents: { father: "Dan Sagigi (Snr)" },
    bio: "Jacob Dan Sagigi Jr. was a Torres Strait Islander man from Badu Island, the son of Dan Sagigi (Snr). He died in 2001 at the age of 41 and is buried at Cairns Cemetery.",
    sections: [],
    sources: ["Find a Grave, Cairns Cemetery"],
    relatedArticles: ["dan-sagigi-snr", "badu-island"],
    categories: ["Sagigi family", "Badu Island people"],
  },
  {
    slug: "maria-sagigi-baira",
    name: "Maria Sagigi Baira",
    born: "1914",
    died: "12 December 1987",
    deathPlace: "Cairns, Queensland",
    island: "Badu Island",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander",
    clan: "Badulgal",
    bio: "Maria Sagigi Baira (1914-1987) was a Torres Strait Islander woman whose double-barrelled surname connects two prominent Badu Island families: Sagigi and Baira. She is buried at Cairns Cemetery.",
    sections: [
      {
        heading: "Sagigi-Baira connection",
        content:
          "The Baira surname appears independently in Torres Strait records (Simi Baira, John Baira in NAA J1781 records) and is connected to the Sagigi family through Maria and later through Royston Sagigi-Baira, the 2023 Australian Idol winner, whose father is from Badu Island.",
      },
    ],
    sources: ["Find a Grave, Cairns Cemetery", "NAA J1781 records"],
    relatedArticles: ["royston-sagigi-baira", "badu-island"],
    categories: ["Sagigi family", "Baira family", "Badu Island people"],
  },
  {
    slug: "salapata-sagigi",
    name: "Salapata Sagigi",
    born: "c. 1920s",
    island: "Thursday Island",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander",
    occupation: ["Actor"],
    knownFor: "Actor in King of the Coral Sea (1954)",
    bio: "Salapata Sagigi was a Torres Strait Islander actor who played the character Charlie Juda in the 1954 Australian film King of the Coral Sea, directed by Lee Robinson and starring Chips Rafferty. The film was shot on location at Thursday Island and was also Rod Taylor's film debut.",
    sections: [
      {
        heading: "King of the Coral Sea",
        content:
          "King of the Coral Sea (1954) was an Australian adventure film about pearl diving and smuggling in the Torres Strait, directed by Lee Robinson. It starred Chips Rafferty and Charles 'Bud' Tingwell and was filmed on location at Thursday Island. Salapata Sagigi played the character Charlie Juda. The film is notable as one of the first Australian feature films to be shot in the Torres Strait and to feature Torres Strait Islander performers. It was also the film debut of Rod Taylor, who went on to become one of Australia's most famous Hollywood actors.",
      },
    ],
    sources: ["IMDB", "ASO: Australia's audio and visual heritage online"],
    relatedArticles: ["thursday-island"],
    categories: [
      "Sagigi family",
      "Torres Strait Islander actors",
      "Thursday Island people",
    ],
  },
  {
    slug: "jessie-sagigi",
    name: "Jessie Sagigi",
    born: "c. 1920s",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander (Meriam)",
    occupation: ["Storyteller", "Cultural custodian"],
    knownFor: "Storyteller recorded by Margaret Lawrie",
    bio: "Jessie Sagigi was a Torres Strait Islander storyteller whose oral narratives were recorded by folklorist Margaret Lawrie during her fieldwork in the Torres Strait during the 1950s and 1960s. Jessie told the story 'Paslag,' collected from the Mer/Erub/Ugar island group in the eastern Torres Strait.",
    sections: [
      {
        heading: "Margaret Lawrie Collection",
        content:
          "Jessie Sagigi's story 'Paslag' is preserved in the Margaret Lawrie Torres Strait Islands Collection at the State Library of Queensland. This collection, which includes stories, songs, genealogies, and cultural materials from across the Torres Strait, was inscribed on the UNESCO Australian Memory of the World Register in recognition of its significance. The collection represents one of the most comprehensive records of Torres Strait Islander oral traditions.",
      },
      {
        heading: "Cultural significance",
        content:
          "The Mer/Erub/Ugar island group (eastern Torres Strait) is the homeland of the Meriam people. Jessie Sagigi's connection to this group, combined with the Sagigi family's primary association with Badu Island in the western Torres Strait, illustrates the inter-island kinship networks that characterize Torres Strait society.",
      },
    ],
    sources: [
      "Margaret Lawrie Collection, State Library of Queensland",
      "UNESCO Memory of the World Register",
    ],
    relatedArticles: ["meriam", "mer-murray-island", "erub-darnley-island"],
    categories: [
      "Sagigi family",
      "Torres Strait storytellers",
      "Meriam people",
    ],
  },
  {
    slug: "robert-bongo-sagigi",
    name: 'Robert "Bongo" Sagigi',
    island: "Badu Island",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander (Badulgal)",
    clan: "Wakaid",
    occupation: ["Community elder", "Community health advocate"],
    bio: 'Robert "Bongo" Sagigi is a Wakaid Elder on Badu Island and a community leader involved in health initiatives and media advocacy for Torres Strait Islander peoples.',
    sections: [
      {
        heading: "Community leadership",
        content:
          "Robert Sagigi is an active community leader on Badu Island. He has been involved in community health programs and has been interviewed by the Torres Strait Islanders Media Association (TSIMA) about significant events including Survival Day, contributing to public discourse about Torres Strait Islander identity and rights.",
      },
    ],
    sources: [
      "SoundCloud/TSIMA interview",
      "Badu PBC Corporation",
    ],
    relatedArticles: ["badu-island", "badulgal"],
    categories: ["Sagigi family", "Badu Island people", "Torres Strait elders"],
  },
  {
    slug: "marita-sagigi",
    name: "Marita Sagigi",
    island: "Thursday Island",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander",
    clan: "Dauareb",
    occupation: [
      "Medical Scientist",
      "Health service executive",
    ],
    knownFor: "Executive General Manager, Northern Sector, Torres and Cape HHS",
    awards: ["Torres Shire Council Australia Day Award"],
    bio: "Marita Sagigi is a Torres Strait Islander health professional and Dauareb descendant who rose from a Year 10 work experience student to become Medical Scientist at Thursday Island Pathology (from 2005), and later Executive General Manager for the Northern Sector of the Torres and Cape Hospital and Health Service (TCHHS), one of the most senior health administration roles in the Torres Strait region.",
    sections: [
      {
        heading: "Career",
        content:
          "Marita Sagigi began her connection to the health service as a Year 10 work experience student on Thursday Island. She developed her career in pathology, becoming Medical Scientist at Thursday Island Pathology from 2005. She was later promoted to Executive General Manager for the Northern Sector of the Torres and Cape Hospital and Health Service, overseeing health services across the Torres Strait and Northern Peninsula Area.",
      },
      {
        heading: "Recognition",
        content:
          "Marita received the Torres Shire Council Australia Day Award in recognition of her contributions to health services and the community on Thursday Island. Her career trajectory from work experience student to senior executive has been highlighted by Queensland Health as an example of local career development in remote communities.",
      },
      {
        heading: "Cultural identity",
        content:
          "Marita identifies as a Dauareb descendant, connecting her to the Daurareb tribal division. This is the same clan affiliation identified by Nathan Sagigi, suggesting a close family connection within the broader Sagigi network.",
      },
    ],
    sources: [
      "Queensland Health news",
      "Torres and Cape Hospital and Health Service",
    ],
    relatedArticles: ["thursday-island"],
    categories: [
      "Sagigi family",
      "Thursday Island people",
      "Torres Strait Islander scientists",
      "Health professionals",
    ],
  },
  {
    slug: "betty-sagigi",
    name: "Betty Sagigi",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander",
    island: "Thursday Island",
    occupation: ["Aged Care Assessment Team Coordinator", "Health researcher"],
    education:
      "Certificate IV in Aboriginal and Torres Strait Islander Primary Health Care (2013, SQIT Toowoomba)",
    awards: [
      "Aboriginal and Torres Strait Islander Student of the Year (2014)",
    ],
    bio: "Betty Sagigi is a Torres Strait Islander health professional and researcher based on Thursday Island. She works as the Aged Care Assessment Team Coordinator and is a co-author on multiple academic publications through the JCU HART (Healthy Ageing Research Team) group, contributing to research on dementia, falls, depression, and social and emotional wellbeing among Torres Strait Islander elders.",
    sections: [
      {
        heading: "Health career",
        content:
          "Betty Sagigi works as the Aged Care Assessment Team Coordinator on Thursday Island, a front-line role in delivering health services to elderly Torres Strait Islander peoples. In 2014, she was featured in the Torres News (Thursday Island) after receiving the Aboriginal and Torres Strait Islander Student of the Year Award for her Certificate IV studies at SQIT Toowoomba.",
      },
      {
        heading: "Research",
        content:
          "Betty is a co-author on five or more academic publications through the James Cook University HART (Healthy Ageing Research Team) group. Her research contributions span topics including dementia care, falls prevention, depression screening, and social and emotional wellbeing among Torres Strait Islander elders. This community-embedded research approach, with local health workers as co-investigators, ensures research is grounded in local knowledge and cultural context.",
      },
    ],
    sources: [
      "Torres News (Trove article 255539485), 31 March 2014",
      "SAGE Journals, Qualitative Health Research, 2025",
    ],
    relatedArticles: ["thursday-island"],
    categories: [
      "Sagigi family",
      "Health professionals",
      "Torres Strait Islander researchers",
    ],
  },
  {
    slug: "nathan-sagigi",
    name: "Nathan Sagigi",
    island: "Murray Island / Badu Island",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander",
    clan: "Daurareb and Wakaid",
    occupation: ["Exercise physiologist (student)"],
    education:
      "Bachelor of Clinical Exercise Physiology, University of Queensland",
    bio: "Nathan Sagigi is a Torres Strait Islander man who identifies as Daurareb and Wakaid, from Murray Island and Badu Island. He is studying a Bachelor of Clinical Exercise Physiology at the University of Queensland, motivated by the prevalence of chronic disease in his community.",
    sections: [
      {
        heading: "Early life",
        content:
          "Nathan attended primary school on Thursday Island before moving to Cairns for boarding school. His experience growing up in the Torres Strait, where chronic diseases such as diabetes disproportionately affect the community, motivated him to pursue a career in exercise physiology.",
      },
      {
        heading: "Education",
        content:
          "Nathan is studying a Bachelor of Clinical Exercise Physiology at the University of Queensland. He has spoken about his desire to return to the Torres Strait after graduating to help address the health challenges facing his community.",
      },
      {
        heading: "Cultural identity",
        content:
          "Nathan identifies as a Daurareb and Wakaid man from Murray Island and Badu Island. The Daurareb appears to correspond to one of the traditional tribal divisions on Mer (Murray Island). Wakaid is the main settlement on Badu Island.",
      },
    ],
    sources: ["University of Queensland student stories"],
    relatedArticles: [
      "badu-island",
      "mer-murray-island",
      "badulgal",
      "meriam",
    ],
    categories: [
      "Sagigi family",
      "Badu Island people",
      "Murray Island people",
      "University of Queensland alumni",
    ],
  },
  {
    slug: "royston-sagigi-baira",
    name: "Royston Sagigi-Baira",
    birthPlace: "Mapoon, Queensland",
    nationality: "Australian",
    ethnicity: "Aboriginal (Thanakwith) and Torres Strait Islander (Wagadagam)",
    clan: "Wagadagam",
    island: "Badu Island (paternal)",
    occupation: ["Singer", "Musician", "Songwriter"],
    knownFor: "Winner of Australian Idol 2023",
    education: "ACPA (Aboriginal Centre for the Performing Arts); Business, CQUniversity; QUT",
    bio: "Royston Sagigi-Baira is an Australian singer and musician of Aboriginal (Thanakwith) and Torres Strait Islander (Wagadagam) heritage. He won Australian Idol in 2023 with a performance of Whitney Houston's 'When You Believe,' becoming the second First Nations winner of the show after Casey Donovan. He signed with Sony Music Australia and has released singles including 'Dreaming' (2023) and 'Feeling Good' (2024).",
    sections: [
      {
        heading: "Early life",
        content:
          "Royston grew up in Mapoon on the western coast of Cape York Peninsula, Queensland. His mother was a Thanakwith woman from the Weipa area, and his father is from Badu Island in the Torres Strait. He trained at the Aboriginal Centre for the Performing Arts (ACPA), studied business at CQUniversity in Cairns, and also attended QUT. Before his music career, he worked in various roles in regional Queensland.",
      },
      {
        heading: "Australian Idol",
        content:
          "Royston auditioned for the 2023 revival season of Australian Idol. He quickly became a fan favourite for his powerful vocals and emotional connection to his songs. In the grand finale, he performed Whitney Houston's 'When You Believe' and was crowned the winner. He became the second First Nations person to win Australian Idol, after Casey Donovan in 2004. During the competition, he dedicated a performance to his late mother, drawing national attention to his personal story.",
      },
      {
        heading: "Music career",
        content:
          "After winning Idol, Royston signed with Sony Music Australia. He released his debut single 'Dreaming' in late 2023, followed by 'Feeling Good' in 2024. His music draws on his cultural heritage and personal experiences growing up in remote Queensland.",
      },
      {
        heading: "Cultural identity",
        content:
          "Royston identifies as Thanakwith (Aboriginal) and Wagadagam (Torres Strait Islander). The Wagadagam clan is associated with Mabuiag Island in the near western Torres Strait, with the crocodile (kodal) as its totem. His father's connection to Badu Island links him to the broader Sagigi family network in the western Torres Strait. The Baira surname in his double-barrelled name connects to the Baira family, who have historical governance roots on Badu (Jacob Baira represented Badu at the 1937 Torres Strait conference).",
      },
    ],
    sources: [
      "Wikipedia",
      "SBS NITV",
      "National Indigenous Times",
      "CQUniversity",
      "Sony Music Australia",
    ],
    relatedArticles: [
      "maria-sagigi-baira",
      "badu-island",
      "wagadagam",
      "badulgal",
    ],
    categories: [
      "Sagigi family",
      "Baira family",
      "Australian musicians",
      "Australian Idol contestants",
      "Wagadagam people",
      "Thanakwith people",
    ],
  },
  {
    slug: "mistee-sagigi",
    name: "Mistee Sagigi",
    born: "c. 2008",
    island: "Thursday Island",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander",
    occupation: ["Australian rules footballer"],
    knownFor: "AFL Woomeras program 2024, Troy Clarke Scholarship 2024",
    awards: [
      "Troy Clarke Scholarship (2024)",
      "AFL Woomeras selection (2024)",
      "Best-on-ground, AFL Woomeras 2024",
    ],
    bio: "Mistee Sagigi is a Torres Strait Islander Australian rules footballer from Thursday Island, approximately 16 years old. She was selected for the AFL's 2024 Woomeras program, a development pathway for Indigenous women footballers, and was awarded the 2024 Troy Clarke Scholarship. She had only picked up an AFL football approximately two years before her breakthrough selection.",
    sections: [
      {
        heading: "Football career",
        content:
          "Mistee Sagigi was selected as one of 38 Indigenous players for the AFL's 2024 Woomeras program. Despite having only picked up an AFL Sherrin roughly two years before, she won best-on-ground honours during the program and sealed a win with the final goal. She was identified as a standout talent and prospect for AFLW clubs for the 2025 season.",
      },
      {
        heading: "Development pathway",
        content:
          "Mistee was noticed through the AFLQ School Cup competition and joined the Gold Coast Suns Academy pathway. She was awarded the 2024 Troy Clarke Scholarship, which recognizes outstanding young Indigenous footballers and supports their development in the sport. In 2025, she suffered a concussion setback but returned stronger.",
      },
    ],
    sources: [
      "Cape York Weekly",
      "play.afl",
      "Rookie Me Central",
    ],
    relatedArticles: ["thursday-island"],
    categories: [
      "Sagigi family",
      "Thursday Island people",
      "Torres Strait Islander sportspeople",
      "Australian rules footballers",
    ],
  },
  {
    slug: "rasa-sagigi",
    name: "Rasa Sagigi",
    born: "c. 1920s",
    island: "Badu Island",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander (Badulgal)",
    clan: "Badulgal",
    bio: "Rasa Sagigi (also recorded as Rasa Irene Sagigi) was a Torres Strait Islander woman from Badu Island. She married William Namok. Queensland BDM death records document three of her children: Napthali Namok (d. 17 December 1961), Neira Namok (d. 15 October 1975), and Irene R Giblet (born 1944, d. 3 October 1985).",
    sections: [
      {
        heading: "Family",
        content:
          "Rasa married into the Namok family, another prominent Badu Island family. Her children include Napthali Namok, Neira Namok, and Irene R. Giblet (nee Namok, born 1944). The Namok family is well known on Badu Island, and the marriage represents a connection between two significant island families.",
      },
    ],
    parents: {},
    spouse: "William Namok",
    children: ["Napthali Namok", "Neira Namok", "Irene R. Giblet"],
    sources: ["Queensland BDM death records"],
    relatedArticles: ["badu-island", "badulgal"],
    categories: ["Sagigi family", "Badu Island people", "Namok family"],
  },

  // ── Doolah Family (Erub / Mer) ──────────────────────────────────────
  {
    slug: "napoleon-doolah",
    name: "Napoleon Doolah",
    island: "Mer (Murray Island)",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander (Meriam)",
    clan: "Samsep-Meriam",
    occupation: ["Traditional community member"],
    bio: "Napoleon Doolah was a Samsep Meriam man from Warwe village on Mer (Murray Island) in the eastern Torres Strait. He is an ancestor of the Doolah family, which later became associated with Erub (Darnley Island) and eventually migrated to the Australian mainland.",
    sections: [
      {
        heading: "Family",
        content:
          "Napoleon married Atima Dawita, a woman of the Piadram clan of Mer. Their eldest son was Gara Doolah, described as an Erubam and Meriam man from Warwe village. They also had a daughter named Bunga, who died as a baby.",
      },
      {
        heading: "Clan affiliation",
        content:
          "The Samsep-Meriam are one of the eight traditional clan divisions (nosik) of the Meriam people on Murray Island. The Meriam people are the Indigenous inhabitants of the eastern Torres Strait islands, with their own language (Meriam Mir) and distinct Melanesian cultural traditions.",
      },
    ],
    spouse: "Atima Dawita",
    children: ["Gara Doolah", "Bunga Doolah"],
    sources: [
      "Dr John Doolah, PhD thesis, University of Newcastle, 2021",
    ],
    relatedArticles: ["gara-doolah", "meriam", "mer-murray-island"],
    categories: [
      "Doolah family",
      "Murray Island people",
      "Meriam people",
      "Samsep-Meriam",
    ],
  },
  {
    slug: "gara-doolah",
    name: "Gara Doolah",
    island: "Mer (Murray Island) / Erub (Darnley Island)",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander (Meriam / Erubam)",
    clan: "Samsep-Meriam",
    bio: "Gara Doolah was described as an Erubam and Meriam man from Warwe village in Mer (Murray Island). He was the eldest son of Napoleon Doolah and Atima Dawita.",
    sections: [
      {
        heading: "Heritage",
        content:
          "Gara's dual identification as both Erubam (of Erub/Darnley Island) and Meriam (of Mer/Murray Island) reflects the close kinship ties between the eastern Torres Strait islands. His family's association with both islands helped establish the Doolah family's presence across the eastern Torres Strait.",
      },
    ],
    parents: { father: "Napoleon Doolah", mother: "Atima Dawita" },
    siblings: ["Bunga Doolah"],
    sources: [
      "Dr John Doolah, PhD thesis, University of Newcastle, 2021",
    ],
    relatedArticles: [
      "napoleon-doolah",
      "meriam",
      "mer-murray-island",
      "erub-darnley-island",
    ],
    categories: [
      "Doolah family",
      "Murray Island people",
      "Darnley Island people",
    ],
  },
  {
    slug: "charlotte-doolah",
    name: "Charlotte Doolah",
    born: "c. 1900s",
    island: "Erub (Darnley Island)",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander",
    knownFor: "Matriarch of the Doolah family, Darnley Island",
    bio: "Nene Charlotte Buri Doolah was a Torres Strait Islander woman from Erub (Darnley Island). She is recorded in the 1941 Child Endowment records as head of a household with six children. She is the grandmother of Dr John Doolah. The honorific 'Nene' denotes a respected elder woman in Torres Strait Islander culture.",
    sections: [
      {
        heading: "Family",
        content:
          "Charlotte's six children recorded in the 1941 Child Endowment were: Rene (b. 10 December 1925), Reuben (b. 12 June 1927), Colina (b. 22 May 1929), Geoffrey (b. 8 June 1931), Richard (b. 14 September 1935), and Taibi Napoleon (b. 15 March 1939). Elia Doolah (Snr), born 5 January 1924, is not listed among these children, possibly because he was 17 at the time and no longer eligible for the endowment, or because he was from a different branch of the family.",
      },
      {
        heading: "Legacy",
        content:
          "Charlotte is referred to with the honorific 'Nene' (respected elder woman) in family accounts, including in the academic work of her grandson Dr John 'Cyril' Doolah. Her full name, Nene Charlotte Buri Doolah, appears in his PhD thesis documenting Torres Strait Islander migration.",
      },
    ],
    children: [
      "Rene Doolah",
      "Reuben Doolah",
      "Colina Doolah",
      "Geoffrey Doolah",
      "Richard Doolah",
      "Taibi Napoleon Doolah",
    ],
    sources: [
      "CIFHS Child Endowment Thursday Island c.1941",
      "Dr John Doolah, PhD thesis, University of Newcastle, 2021",
    ],
    relatedArticles: [
      "elia-doolah-snr",
      "reuben-doolah",
      "geoffrey-doolah",
      "erub-darnley-island",
    ],
    categories: [
      "Doolah family",
      "Darnley Island people",
      "Torres Strait elders",
    ],
  },
  {
    slug: "elia-doolah-snr",
    name: "Elia Doolah (Snr)",
    born: "5 January 1924",
    birthPlace: "Erub (Darnley Island), Torres Strait",
    died: "2 August 1984",
    deathPlace: "Brisbane, Queensland",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander",
    clan: "Samsep-Meriam",
    occupation: [
      "Soldier",
      "Minister, Universal World Church",
      "Community leader",
    ],
    militaryService:
      "Torres Strait Light Infantry Battalion (Q85155), enlisted 13 April 1942, discharged 30 March 1946",
    knownFor: "WWII service in Torres Strait Light Infantry Battalion",
    bio: "Private Elia Doolah (Snr) was a Torres Strait Islander man from Erub (Darnley Island) who served in the Torres Strait Light Infantry Battalion during World War II. After the war, he became a minister of the Universal World Church and a respected community leader. He died in Brisbane in 1984 and is buried at Mount Gravatt Cemetery.",
    sections: [
      {
        heading: "Military service",
        content:
          "Elia enlisted on 13 April 1942 in the Torres Strait Light Infantry Battalion, service number Q85155. He served until 30 March 1946. The Torres Strait Light Infantry Battalion was a significant unit in Australian military history, being one of the first military units composed primarily of Indigenous Australians. Torres Strait Islander men served in the defence of their own islands during the Japanese threat to northern Australia.",
      },
      {
        heading: "Post-war life",
        content:
          'After the war, Elia became a minister of the Universal World Church, where he was known as "Big Daddy Elia Doolah." He was a respected community and spiritual leader in both the Torres Strait and the mainland Torres Strait Islander diaspora in Brisbane.',
      },
      {
        heading: "Elia Doolah (Jnr)",
        content:
          "Research has confirmed the existence of an Elia Doolah Jnr (son of Elia Snr). The ATSIC Commissioner for Torres Strait elected in April 2000, Chairperson of Erub (Darnley) Island Council, TSRA Portfolio Member for Education, Training and Employment, member of the ICC Executive, member of the IBIS Board, and Chairperson of the Area Consultative Committee was Elia Doolah Jnr, as Elia Snr died in 1984. This confirms that the Doolah family maintained community leadership across generations.",
      },
      {
        heading: "Death and burial",
        content:
          "Elia died on 2 August 1984 in Brisbane at the age of 60. He is buried at Mount Gravatt Cemetery and Crematorium (Mains Road, Macgregor QLD 4109). Taibie Napoleon Doolah (b. 15 March 1939, d. 6 January 1985), believed to be his sibling, is buried alongside him.",
      },
    ],
    sources: [
      "Australian War Memorial, P11077601",
      "BillionGraves headstone record #99632306",
      "ATSIC Annual Report 1999-2000 (AustLII)",
    ],
    relatedArticles: [
      "charlotte-doolah",
      "torres-strait-light-infantry",
      "erub-darnley-island",
      "tsi-migration",
    ],
    categories: [
      "Doolah family",
      "Darnley Island people",
      "Torres Strait Light Infantry Battalion",
      "WWII veterans",
      "ATSIC commissioners",
    ],
  },
  {
    slug: "reuben-doolah",
    name: "Reuben Doolah",
    born: "12 June 1927",
    birthPlace: "Erub (Darnley Island), Torres Strait",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander (Meriam)",
    occupation: ["Dancer", "Cultural performer", "Dance teacher"],
    education: "NAISDA Dance College",
    knownFor:
      "Foundation member of Ngaru Aboriginal and Torres Strait Dance Company; performed for Queen Elizabeth II",
    bio: "Reuben Doolah, born 12 June 1927 on Erub (Darnley Island), became one of Sydney's most experienced Torres Strait Island dancers. He has been a professional dancer since 1986, is a foundation member of the Ngaru Aboriginal and Torres Strait Dance Company (1993), trained at NAISDA, and now performs with Descendance. He has performed for audiences of 500,000 at the Honolulu Festival and for Queen Elizabeth II at the 2002 Golden Jubilee.",
    sections: [
      {
        heading: "Dance career",
        content:
          "Reuben became one of Sydney's most experienced Torres Strait Island dancers, with heritage from both Murray Island and Darnley Island. He has been performing professionally since 1986. He trained at NAISDA (National Aboriginal and Islander Skills Development Association) Dance College, Australia's premier training institution for Aboriginal and Torres Strait Islander performing arts. He was a foundation member of the Ngaru Aboriginal and Torres Strait Dance Company in 1993, and now performs with the Descendance dance company.",
      },
      {
        heading: "Notable performances",
        content:
          "Reuben performed for an audience of approximately 500,000 at the Honolulu Festival in Hawaii. He was selected to perform for Queen Elizabeth II at the 2002 Golden Jubilee celebrations. These performances brought Torres Strait Islander dance traditions to international audiences.",
      },
      {
        heading: "Cultural significance",
        content:
          "Torres Strait Islander dance is a central part of cultural expression, used to tell stories, celebrate, and maintain connection to country. Reuben's decades of work in preserving and performing these traditions in Sydney helped maintain cultural continuity for the Torres Strait Islander diaspora on the mainland.",
      },
    ],
    parents: { mother: "Charlotte Doolah" },
    siblings: [
      "Rene Doolah",
      "Colina Doolah",
      "Geoffrey Doolah",
      "Richard Doolah",
      "Taibi Napoleon Doolah",
    ],
    sources: [
      "CIFHS Child Endowment Thursday Island c.1941",
      "Ngaru Dance Company records",
      "NAISDA College",
    ],
    relatedArticles: [
      "charlotte-doolah",
      "geoffrey-doolah",
      "erub-darnley-island",
      "tsi-migration",
    ],
    categories: [
      "Doolah family",
      "Darnley Island people",
      "Torres Strait Islander dancers",
      "Performing arts",
    ],
  },
  {
    slug: "geoffrey-doolah",
    name: "Geoffrey Doolah",
    born: "8 June 1931",
    birthPlace: "Erub (Darnley Island), Torres Strait",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander",
    occupation: ["Teacher", "Musician", "Arts and crafts instructor"],
    bio: "Geoffrey Doolah, born 8 June 1931 on Erub (Darnley Island), was a Torres Strait Islander man who was evacuated to Cherbourg Mission during WWII and later became a teacher, musician, and arts instructor at the mission.",
    sections: [
      {
        heading: "Cherbourg Mission",
        content:
          "During World War II, Torres Strait Islander families were evacuated from the islands to mainland Queensland. Geoffrey Doolah ended up at Cherbourg Aboriginal Community (formerly Barambah Aboriginal Settlement). A photograph exists of him at the Boys Dormitory at Barambah c.1929, though this date may relate to the dormitory rather than his presence there, as he was born in 1931.",
      },
      {
        heading: "Career at Cherbourg",
        content:
          "Geoffrey was involved in setting up Aboriginal arts and crafts and shell displays for the Native Affairs Department at Cherbourg in 1958. He taught at Cherbourg Mission State School in 1959. He was also a musician, performing banjo at Cherbourg concerts as early as 1953.",
      },
    ],
    parents: { mother: "Charlotte Doolah" },
    siblings: [
      "Rene Doolah",
      "Reuben Doolah",
      "Colina Doolah",
      "Richard Doolah",
      "Taibi Napoleon Doolah",
    ],
    sources: [
      "CIFHS Child Endowment Thursday Island c.1941",
      "Cherbourg Memory Project",
      "ANU Press",
    ],
    relatedArticles: ["charlotte-doolah", "reuben-doolah", "erub-darnley-island"],
    categories: [
      "Doolah family",
      "Darnley Island people",
      "Cherbourg community",
      "Torres Strait Islander educators",
    ],
  },
  {
    slug: "john-doolah",
    name: 'Dr John "Cyril" Doolah',
    nationality: "Australian",
    ethnicity: "Torres Strait Islander (Meriam / Erubam)",
    clan: "Samsep-Meriam",
    island: "Erub (Darnley Island) / Mer (Murray Island)",
    occupation: ["Academic", "Lecturer"],
    education:
      "PhD, University of Newcastle (2021); Masters in Aboriginal Studies, University of Newcastle (2015)",
    knownFor:
      "First postgraduate Torres Strait Islander at University of Newcastle to graduate with Masters",
    bio: 'Dr John "Cyril" Doolah is a Torres Strait Islander academic who identifies as Erubam Le (of Erub) and Meriam Le (of Mer), of the Samsep-Meriam clan. He is the second eldest of six children and the grandson of Nene Charlotte Buri Doolah. His family migrated from the Torres Strait to mainland Australia in the 1960s.',
    sections: [
      {
        heading: "Academic career",
        content:
          "John was the first postgraduate Torres Strait Islander student at the University of Newcastle to graduate with a Masters in Aboriginal Studies (2015). He completed his PhD in 2021 with a thesis titled 'Stories behind the Torres Strait Islander Migration Myth: the journey of the sap/bethey' (also described as 'Decolonising the migration and urbanisation of Torres Strait Islanders'). He is currently a Ngarrngga Postdoctoral Fellow and Lecturer at the University of Melbourne.",
      },
      {
        heading: "Family",
        content:
          "John is the second eldest of six siblings: Napoleon, John (Cyril), Vicky, Tiby, Mareja, and Sineba. His grandmother is Nene Charlotte Buri Doolah of Darnley Island. His sister Mareja married into the Bin Juda family.",
      },
      {
        heading: "Research",
        content:
          "His doctoral research documents the migration of Torres Strait Islander families from the islands to mainland Australian cities during the 1960s and 1970s, a significant but often overlooked chapter in Australian Indigenous history. The thesis contains detailed Doolah family genealogy and oral histories.",
      },
    ],
    siblings: ["Napoleon Doolah Jr.", "Vicky Doolah", "Tiby Doolah", "Mareja Bin Juda", "Sineba Doolah"],
    sources: [
      "University of Newcastle",
      "University of Melbourne",
      "ResearchGate",
    ],
    relatedArticles: [
      "charlotte-doolah",
      "erub-darnley-island",
      "mer-murray-island",
      "meriam",
      "tsi-migration",
    ],
    categories: [
      "Doolah family",
      "Meriam people",
      "Torres Strait Islander academics",
      "University of Melbourne staff",
    ],
  },
  {
    slug: "mareja-doolah-badu",
    name: "Mareja Doolah",
    born: "1902",
    birthPlace: "Badu Island, Torres Strait",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander",
    spouse: "Bora Bin Juda",
    bio: "Mareja Doolah was a Torres Strait Islander woman born on Badu Island in 1902. She married Bora Bin Juda, a man from Macassar (Makassar), Indonesia, on 29 December 1922. They lived at Cherbourg Aboriginal Community on the mainland with four children.",
    sections: [
      {
        heading: "Marriage and family",
        content:
          "Mareja married Bora Bin Juda (b. 1895, Macassar/Indonesia) on 29 December 1922. They were living at Cherbourg with four children. Bora worked at Cherbourg until he broke his arm. In January 1943, he left to look for work while his wife remained at Cherbourg.",
      },
      {
        heading: "Significance",
        content:
          "Mareja's birth on Badu Island is significant because it connects the Doolah family (primarily associated with Darnley Island in the eastern Torres Strait) with Badu Island in the western Torres Strait, the home island of the Sagigi family. This suggests inter-island Doolah family branches and the extensive kinship networks that characterize Torres Strait society.",
      },
    ],
    sources: [
      'Julia Martinez, "Aboriginal History," ANU Press, Volume 35, 2011',
    ],
    relatedArticles: [
      "leilani-bin-juda",
      "badu-island",
      "erub-darnley-island",
    ],
    categories: [
      "Doolah family",
      "Bin Juda family",
      "Badu Island people",
      "Cherbourg community",
    ],
  },
  {
    slug: "leilani-bin-juda",
    name: "Leilani Bin-Juda",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander",
    occupation: [
      "Diplomat",
      "CEO, Torres Strait Regional Authority",
      "High Commissioner to Nigeria",
    ],
    education: "BA Business, CQUniversity (1995)",
    knownFor:
      "First Indigenous Australian High Commissioner (to Nigeria, 2023)",
    awards: ["Public Service Medal (PSM), 2019", "Churchill Fellowship, 2000"],
    bio: "Leilani Bin-Juda is a Torres Strait Islander woman and descendant of the Doolah and Bin Juda families. She has had a distinguished career spanning diplomacy, cultural heritage, and Indigenous affairs. She established the Gab Titui Cultural Centre on Thursday Island, became the first woman substantively appointed CEO of the Torres Strait Regional Authority, and in November 2023 became Australia's first Indigenous High Commissioner, appointed to Nigeria.",
    sections: [
      {
        heading: "Heritage",
        content:
          "Leilani has Torres Strait Islander heritage with ties to Hammond, Darnley, and Murray Islands. Her great-grandfathers came from Japan, China, the Philippines, Indonesia, Jamaica, and Niue, while her great-grandmothers were from various Torres Strait islands. This multicultural heritage reflects the rich diversity of Torres Strait Island communities, which have long been a crossroads of Pacific, Asian, and European cultures. She is a descendant of the Doolah-Bin Juda marriage connecting the eastern Torres Strait Doolah family to Indonesian heritage through Bora Bin Juda.",
      },
      {
        heading: "Career",
        content:
          "Leilani graduated from CQUniversity with a BA in Business in 1995. She worked at the Department of Foreign Affairs and Trade (DFAT), with postings to Shanghai, Honiara, and Port Moresby. She was the first Torres Strait Islander at the Torres Strait Treaty Liaison Office. She established the Gab Titui Cultural Centre on Thursday Island, a major cultural institution for the Torres Strait. She became the first woman substantively appointed CEO of the Torres Strait Regional Authority (TSRA). She was awarded a Churchill Fellowship in 2000 and the Public Service Medal (PSM) in 2019.",
      },
      {
        heading: "High Commissioner to Nigeria",
        content:
          "In November 2023, Leilani was appointed as Australia's High Commissioner to Nigeria, making her the first Indigenous Australian to hold a Head of Mission role in Australian diplomacy. This appointment was widely celebrated as a milestone in both Indigenous and Australian diplomatic history.",
      },
    ],
    sources: [
      "Indigenous Diplomacy CDU",
      "DFAT",
      "ANZSOG",
    ],
    relatedArticles: [
      "mareja-doolah-badu",
      "erub-darnley-island",
      "thursday-island",
    ],
    categories: [
      "Bin Juda family",
      "Doolah family",
      "Torres Strait Islander diplomats",
      "Australian diplomats",
    ],
  },

  // ── Cowley Family ──────────────────────────────────────────────────
  {
    slug: "george-cowley",
    name: "George Cowley",
    nationality: "Australian",
    ethnicity: "European / Torres Strait Islander",
    island: "Torres Strait",
    spouse: "Balo Boa",
    bio: 'George Cowley was a man recorded in Torres Strait records as the father of Leo William Cowley. He married Balo Boa, whose name suggests she was a Torres Strait Islander woman. The surname "Cowley" appears in various Torres Strait administrative records from the early 20th century.',
    sections: [
      {
        heading: "Family",
        content:
          "George married Balo Boa, and their son Leo William Cowley was born on 21 August 1899 in the Torres Strait. The Cowley family appears in Thursday Island audit records from 1946, with Leo, Tom, Tassie, Wonie, and Tim Cowley all listed.",
      },
    ],
    children: ["Leo William Cowley"],
    sources: ["Ancestry.com", "QSA Thursday Island audit records, 1946"],
    relatedArticles: ["leo-cowley", "thursday-island"],
    categories: ["Cowley family", "Torres Strait people"],
  },
  {
    slug: "leo-cowley",
    name: "Leo William Cowley",
    born: "21 August 1899",
    birthPlace: "Torres Strait, Queensland",
    died: "2 January 1938",
    deathPlace: "Torres Strait, Queensland",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander (mixed heritage)",
    bio: "Leo William Cowley (1899-1938) was a Torres Strait man, the son of George Cowley and Balo Boa. He is the most documented member of the Cowley family in online records.",
    sections: [
      {
        heading: "Family",
        content:
          'Leo was born on 21 August 1899 in the Torres Strait and died on 2 January 1938. His mother\'s name, "Balo Boa," strongly suggests Torres Strait Islander heritage. The Cowley family was present on Thursday Island and potentially on Erub (Darnley Island), where they appear in the same administrative records as the Doolah family.',
      },
    ],
    parents: { father: "George Cowley", mother: "Balo Boa" },
    sources: [
      "Ancestry.com",
      "QSA Thursday Island audit records, 1946",
    ],
    relatedArticles: ["george-cowley", "thursday-island", "erub-darnley-island"],
    categories: ["Cowley family", "Torres Strait people"],
  },

  // ── Ben's family ─────────────────────────────────────────────────
  {
    slug: "charlie-sagigi",
    name: "Charlie Sagigi",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander (Badulgal)",
    clan: "Badulgal",
    island: "Badu Island",
    bio: "Charlie Sagigi is a Torres Strait Islander man from Badu Island. He is the father of Benjamin Sagigi (b. 1998). A 'Sagigi, Charles' appears in the NAA J1781 combined records for the Torres Strait, though the connection to this specific Charlie has not been confirmed.",
    sections: [
      {
        heading: "Records",
        content:
          "The NAA J1781 series contains records of Torres Strait Islander individuals managed under the Protection Acts. A 'Sagigi, Charles' is listed in the combined records, alongside Salepata Sagigi and Samuel Sagigi. Further research in the National Archives and Queensland State Archives may reveal more details.",
      },
    ],
    children: ["Benjamin Sagigi"],
    sources: ["NAA J1781 combined records", "Family information"],
    relatedArticles: ["benjamin-sagigi", "badu-island", "badulgal"],
    categories: ["Sagigi family", "Badu Island people"],
  },
  {
    slug: "benjamin-sagigi",
    name: "Benjamin Sagigi",
    born: "1998",
    nationality: "Australian",
    ethnicity: "Torres Strait Islander / Torres Strait Islander",
    bio: "Benjamin Sagigi, born in 1998, is a Torres Strait Islander man. His father is Charlie Sagigi from Badu Island. His maternal family connects to the Doolah and Cowley families through his mother's parents: Elia Doolah and a woman of the Cowley family.",
    sections: [
      {
        heading: "Heritage",
        content:
          "Benjamin's paternal family, the Sagigis, are traditionally from Badu Island in the western Torres Strait, one of the most prominent families on the island with connections spanning back to the earliest records. His maternal grandfather, Elia Doolah, was from Erub (Darnley Island) in the eastern Torres Strait, and his maternal grandmother was from the Cowley family. This heritage connects him to both the western and eastern Torres Strait island groups.",
      },
    ],
    parents: { father: "Charlie Sagigi" },
    sources: ["Family information"],
    relatedArticles: [
      "charlie-sagigi",
      "elia-doolah-snr",
      "badu-island",
      "erub-darnley-island",
      "badulgal",
      "meriam",
    ],
    categories: [
      "Sagigi family",
      "Doolah family",
      "Cowley family",
    ],
  },
];

// ─── Articles (Tribes, Locations, Organizations) ──────────────────────

export const articles: ArticleData[] = [
  {
    slug: "badulgal",
    title: "Badulgal",
    type: "tribe",
    summary:
      "The Badulgal are the Torres Strait Islander people of Badu Island (Badu) in the western Torres Strait. They are part of the broader Kala Lagaw Ya language group and are the traditional owners of Badu Island, with native title formally recognized in 2014.",
    infobox: {
      "Language": "Kala Lagaw Ya",
      "Region": "Western Torres Strait",
      "Island": "Badu Island",
      "Native title": "Determined 1 February 2014",
      "Notable families": "Sagigi, Nona",
    },
    sections: [
      {
        heading: "Culture and language",
        content:
          "The Badulgal speak Kala Lagaw Ya, a language of the western and central Torres Strait. This language family is distinct from Meriam Mir, the language of the eastern Torres Strait islands. The Badulgal share cultural practices with other western Torres Strait peoples, including traditional dance, storytelling, and sea-based livelihoods.",
      },
      {
        heading: "Native title",
        content:
          "Native title over Badu Island was formally determined by the Federal Court of Australia on 1 February 2014. Dan Sagigi (Snr) was the original named applicant in the claim. After his death in July 2002, Victor Nona continued as named applicant. The determination recognized the Badulgal people's traditional ownership of Badu Island and its surrounding waters.",
      },
      {
        heading: "Clans and totems",
        content:
          "Badu Island has several clan groups. The Wakaid clan is associated with the main settlement on the island. The Sagigi family has been identified with both the Badulgal broadly and the Wakaid clan specifically. Totemic affiliations connect families to specific animals, plants, and natural phenomena central to Torres Strait cosmology.",
      },
    ],
    sources: [
      "Federal Court of Australia",
      "Badu PBC Corporation",
      "Queensland Government",
    ],
    relatedArticles: ["badu-island", "dan-sagigi-snr", "meriam", "wagadagam"],
    categories: [
      "Torres Strait peoples",
      "Western Torres Strait",
      "Kala Lagaw Ya speakers",
    ],
  },
  {
    slug: "meriam",
    title: "Meriam people",
    type: "tribe",
    summary:
      "The Meriam are the Indigenous people of the eastern Torres Strait islands, primarily Mer (Murray Island), Erub (Darnley Island), and Ugar (Stephen Island). They speak Meriam Mir and are of Melanesian origin. Mer is famously the homeland of Eddie Koiki Mabo, whose High Court case in 1992 overturned the doctrine of terra nullius in Australia.",
    infobox: {
      "Language": "Meriam Mir",
      "Region": "Eastern Torres Strait",
      "Islands": "Mer, Erub, Ugar",
      "Population": "~450 on Mer (2016 census)",
      "Notable legal case": "Mabo v Queensland (No 2), 1992",
      "Clan divisions": "8 traditional nosik (clans)",
    },
    sections: [
      {
        heading: "Culture",
        content:
          "The Meriam people have a distinct Melanesian cultural heritage, setting them apart from the western Torres Strait peoples who have stronger Papuan connections. They speak Meriam Mir, an Eastern Trans-Fly language, and maintain rich traditions of dance, storytelling, gardening, and seafaring. The Meriam have eight traditional clan divisions (nosik), including the Samsep-Meriam clan of the Doolah family.",
      },
      {
        heading: "Clan structure",
        content:
          "The eight traditional clans of Mer are organized by village and totemic affiliation. The Samsep-Meriam is one of these clans, associated with Warwe village on Mer. Napoleon Doolah, an ancestor of the Doolah family, was a Samsep Meriam man from Warwe. The Piadram clan is another, associated with Atima Dawita, who married Napoleon Doolah.",
      },
      {
        heading: "Mabo case",
        content:
          "The Meriam people are internationally known through Mabo v Queensland (No 2), decided by the High Court of Australia on 3 June 1992. Eddie Koiki Mabo, a Meriam man from Mer, led the legal challenge that overturned the doctrine of terra nullius and led to the recognition of native title in Australian law through the Native Title Act 1993.",
      },
      {
        heading: "Connection to the Doolah family",
        content:
          "The Doolah family is of the Samsep-Meriam clan from Warwe village on Mer. Napoleon Doolah was a Samsep Meriam man, and his descendants maintained connections to both Mer and Erub (Darnley Island). Dr John Doolah, an academic at the University of Melbourne, identifies as Erubam Le and Meriam Le of the Samsep-Meriam clan.",
      },
    ],
    sources: [
      "Dr John Doolah, University of Newcastle/Melbourne",
      "High Court of Australia",
      "AIATSIS",
    ],
    relatedArticles: [
      "mer-murray-island",
      "erub-darnley-island",
      "napoleon-doolah",
      "john-doolah",
      "badulgal",
    ],
    categories: [
      "Torres Strait peoples",
      "Eastern Torres Strait",
      "Meriam Mir speakers",
      "Melanesian peoples",
    ],
  },
  {
    slug: "wagadagam",
    title: "Wagadagam",
    type: "tribe",
    summary:
      "The Wagadagam are a Torres Strait Islander clan associated with Mabuiag Island in the near western Torres Strait. Their totem is the crocodile (kodal). Royston Sagigi-Baira, winner of Australian Idol 2023, identifies as Wagadagam.",
    infobox: {
      "Region": "Near western Torres Strait",
      "Island": "Mabuiag Island",
      "Totem": "Crocodile (kodal)",
      "Language group": "Kala Lagaw Ya",
    },
    sections: [
      {
        heading: "Totem and identity",
        content:
          "The crocodile (kodal) is the primary totem of the Wagadagam clan. In Torres Strait Islander culture, totemic identities are central to social organization, ceremony, and personal identity. The mythological figure Sagai, one of four ancestral brothers who paddled from Cape York to the Torres Strait islands, is associated with Iama (Yam Island) and the crocodile totem, suggesting deep ancestral connections.",
      },
      {
        heading: "Notable Wagadagam people",
        content:
          "Royston Sagigi-Baira, the 2023 Australian Idol winner, identifies as Wagadagam (Torres Strait Islander) and Thanakwith (Aboriginal). His father is from Badu Island, and his Wagadagam identity connects him to the Mabuiag Island clan tradition.",
      },
    ],
    sources: ["SBS NITV", "Torres Strait cultural resources"],
    relatedArticles: ["royston-sagigi-baira", "badulgal", "badu-island"],
    categories: [
      "Torres Strait peoples",
      "Western Torres Strait",
      "Torres Strait clans",
    ],
  },
  {
    slug: "badu-island",
    title: "Badu Island",
    type: "location",
    summary:
      "Badu Island (also known as Badu) is an island in the western Torres Strait, Queensland, Australia. It is the traditional homeland of the Badulgal people and home to the Sagigi family. The main settlement is Wakaid, on the south-east coast. Native title was determined in 2014.",
    infobox: {
      "Traditional name": "Badu",
      "Location": "Western Torres Strait",
      "Traditional owners": "Badulgal",
      "Main settlement": "Wakaid",
      "Area": "~102 km2",
      "Population": "~800",
      "Native title": "Determined 1 February 2014",
    },
    sections: [
      {
        heading: "Geography",
        content:
          "Badu Island is one of the larger islands in the Torres Strait, located in the western group between Cape York Peninsula and Papua New Guinea. The island is approximately 102 square kilometres. The main settlement is Wakaid (also spelled Wasaga), located on the south-eastern coast of the island.",
      },
      {
        heading: "History",
        content:
          "Badu Island has been continuously inhabited by the Badulgal people for thousands of years. During the colonial period, the island was affected by the pearl shell industry, missionary activity, and government control under the Queensland Aboriginal Protection Acts. During World War II, the Torres Strait was a strategic military zone, and many Badu men served in the Torres Strait Light Infantry Battalion.",
      },
      {
        heading: "Pearl shell industry",
        content:
          "Like much of the Torres Strait, Badu's economy was historically tied to the pearl shell (trochus and mother-of-pearl) industry. Torres Strait Islander men worked as divers and crew on luggers, and the industry brought Japanese, Malay, Filipino, and Pacific Islander workers to the region.",
      },
      {
        heading: "Native title",
        content:
          "Dan Sagigi (Snr) was the original named applicant in the Badu Island native title claim. After his death in 2002, Victor Nona continued the case. Native title was formally determined on 1 February 2014, recognizing the Badulgal people's traditional rights.",
      },
      {
        heading: "Notable residents",
        content:
          "The Sagigi family is one of the prominent families on Badu Island, with members including Dan Sagigi (Snr) (native title elder), Robert 'Bongo' Sagigi (community elder), and the Baita and Gawagi Sagigi households recorded in 1941. The Namok family is another significant Badu family, connected to the Sagigis through the marriage of Rasa Sagigi to William Namok.",
      },
    ],
    sources: [
      "Badu PBC Corporation",
      "Queensland Government",
      "Torres Strait Island Regional Council",
    ],
    relatedArticles: [
      "badulgal",
      "dan-sagigi-snr",
      "baita-sagigi",
      "thursday-island",
      "torres-strait-light-infantry",
    ],
    categories: [
      "Torres Strait islands",
      "Western Torres Strait",
      "Badulgal territory",
    ],
  },
  {
    slug: "erub-darnley-island",
    title: "Erub (Darnley Island)",
    type: "location",
    summary:
      "Erub, also known as Darnley Island, is an island in the eastern Torres Strait. It is the traditional homeland of the Erubam people and is closely associated with the Doolah family. The island has a long history of pearl diving and was an important site during World War II.",
    infobox: {
      "Traditional name": "Erub",
      "Colonial name": "Darnley Island",
      "Location": "Eastern Torres Strait",
      "Traditional owners": "Erubam Le (Erub people)",
      "Language": "Meriam Mir",
      "Population": "~400",
    },
    sections: [
      {
        heading: "Geography",
        content:
          "Erub is a volcanic island in the eastern Torres Strait, located approximately 60 kilometres north-east of Thursday Island. It is part of the Murray Islands group in the Meriam people's territory.",
      },
      {
        heading: "History",
        content:
          "Erub has been continuously inhabited by the Erubam people, a subgroup of the broader Meriam people. The island was an important centre for the pearl diving industry in the late 19th and early 20th centuries. During WWII, Torres Strait Islander men from Erub, including Elia Doolah (Snr), served in the Torres Strait Light Infantry Battalion.",
      },
      {
        heading: "Doolah family connection",
        content:
          "The Doolah family is strongly associated with Erub. Charlotte Doolah was listed in the 1941 Child Endowment records on Darnley Island with six children. Elia Doolah (Snr), born on Erub in 1924, served in WWII and later became a community leader. The Cowley family was also present on Erub, with both Doolah and Cowley men appearing in Australian War Memorial records for the island.",
      },
    ],
    sources: [
      "CIFHS records",
      "Australian War Memorial",
      "Torres Strait Island Regional Council",
    ],
    relatedArticles: [
      "meriam",
      "elia-doolah-snr",
      "charlotte-doolah",
      "mer-murray-island",
      "thursday-island",
    ],
    categories: [
      "Torres Strait islands",
      "Eastern Torres Strait",
      "Meriam territory",
    ],
  },
  {
    slug: "mer-murray-island",
    title: "Mer (Murray Island)",
    type: "location",
    summary:
      "Mer, also known as Murray Island, is a small volcanic island in the eastern Torres Strait. It is the homeland of the Meriam people and is internationally known as the birthplace of Eddie Koiki Mabo, whose landmark 1992 High Court case led to the recognition of native title in Australia.",
    infobox: {
      "Traditional name": "Mer",
      "Colonial name": "Murray Island",
      "Location": "Eastern Torres Strait",
      "Traditional owners": "Meriam Le (Meriam people)",
      "Language": "Meriam Mir",
      "Population": "~450",
      "Famous resident": "Eddie Koiki Mabo",
    },
    sections: [
      {
        heading: "Geography",
        content:
          "Mer is a small volcanic island of approximately 2 square kilometres in the eastern Torres Strait. It is part of the Murray Islands group, which also includes Dauar and Waier.",
      },
      {
        heading: "Clan structure",
        content:
          "Mer has eight traditional clan divisions (nosik), organized by village. These include the Samsep-Meriam (associated with Warwe village, the clan of the Doolah family) and the Piadram clan. Each clan has its own totemic affiliations and ceremonial responsibilities.",
      },
      {
        heading: "Mabo v Queensland",
        content:
          "Mer is internationally significant as the island at the centre of Mabo v Queensland (No 2), decided by the High Court of Australia on 3 June 1992. Eddie Koiki Mabo, born on Mer in 1936, led the legal challenge that overturned the legal fiction of terra nullius and established the principle of native title in Australian law. The decision is considered one of the most important in Australian legal history.",
      },
      {
        heading: "Connection to the Doolah family",
        content:
          "Napoleon Doolah was a Samsep Meriam man from Warwe village on Mer. His descendants maintained connections to both Mer and Erub (Darnley Island). Nathan Sagigi identifies as Daurareb, corresponding to a tribal division on Mer, linking the Sagigi family to the island as well.",
      },
    ],
    sources: [
      "High Court of Australia",
      "AIATSIS",
      "Dr John Doolah, University of Newcastle",
    ],
    relatedArticles: [
      "meriam",
      "erub-darnley-island",
      "napoleon-doolah",
      "nathan-sagigi",
    ],
    categories: [
      "Torres Strait islands",
      "Eastern Torres Strait",
      "Meriam territory",
      "Mabo case",
    ],
  },
  {
    slug: "thursday-island",
    title: "Thursday Island (Waiben)",
    type: "location",
    summary:
      "Thursday Island, known as Waiben in the local language, is the administrative capital of the Torres Strait Islands region in far north Queensland, Australia. It has been the main hub for government, commerce, and community life in the Torres Strait since the late 19th century.",
    infobox: {
      "Traditional name": "Waiben",
      "Location": "Torres Strait, Queensland",
      "Population": "~2,900",
      "Function": "Administrative capital of Torres Strait",
      "Industries": "Government, fishing, tourism",
    },
    sections: [
      {
        heading: "History",
        content:
          "Thursday Island became the administrative centre for the Torres Strait in 1877 when the Queensland Government established a police magistrate there. It quickly grew as the hub of the pearl shell industry, attracting a diverse population of Torres Strait Islanders, Aboriginal people, Japanese, Malay, Filipino, Chinese, Pacific Islander, and European workers.",
      },
      {
        heading: "Pearl diving industry",
        content:
          "From the 1870s to the mid-20th century, the pearl shell (trochus and mother-of-pearl) industry was the economic backbone of Thursday Island and the broader Torres Strait. At its peak, Thursday Island was the world's largest producer of cultured pearls. The industry brought thousands of Asian and Pacific Islander workers to the region, creating one of the most multicultural communities in Australia.",
      },
      {
        heading: "World War II",
        content:
          "Thursday Island was a major military garrison during WWII due to its strategic location near Papua New Guinea. The civilian population was evacuated in 1942, and the island became a military base. Torres Strait Islander men served in the Torres Strait Light Infantry Battalion, defending their homeland against the Japanese threat.",
      },
      {
        heading: "Sagigi, Doolah, and Cowley families",
        content:
          "All three families, the Sagigis, Doolahs, and Cowleys, appear in Thursday Island administrative records from the 1940s, including the 1946 QSA audit. Thursday Island served as the administrative hub through which all Torres Strait Islander affairs were managed under the Protection Acts. Multiple Sagigi family members have lived and worked on Thursday Island, including Marita Sagigi (health executive) and Mistee Sagigi (footballer).",
      },
    ],
    sources: [
      "Queensland State Archives",
      "Torres Shire Council",
      "Australian War Memorial",
    ],
    relatedArticles: [
      "badu-island",
      "erub-darnley-island",
      "torres-strait-light-infantry",
      "marita-sagigi",
      "salapata-sagigi",
    ],
    categories: [
      "Torres Strait islands",
      "Queensland towns",
      "Pearl diving",
    ],
  },
  {
    slug: "torres-strait-light-infantry",
    title: "Torres Strait Light Infantry Battalion",
    type: "organization",
    summary:
      "The Torres Strait Light Infantry Battalion was the only Indigenous Australian battalion ever formed. Approximately 830 Torres Strait Islander men enlisted, representing roughly one-fifth of the total Islander population. Formed in May 1941 and reaching full battalion strength in March 1943, the unit served in the defence of the Torres Strait and conducted a combat patrol in Dutch New Guinea.",
    infobox: {
      "Active": "May 1941 - 1946",
      "Branch": "Australian Army",
      "Type": "Light infantry",
      "Role": "Defence of Torres Strait",
      "Garrison": "Thursday Island",
      "Strength": "~830 enlisted (1/5 of total Islander population)",
      "Casualties": "36 deaths on active service; 1 KIA, 6 WIA (Dutch New Guinea)",
      "Notable members": "Elia Doolah (Snr), Private Q85155",
      "Last surviving member": "Mebai Warusam (d. July 2023)",
    },
    sections: [
      {
        heading: "Formation",
        content:
          "The battalion was formed in May 1941 in response to the Japanese threat to northern Australia, initially as a company-strength unit. It reached full battalion strength in March 1943. Approximately 830 Torres Strait Islander men volunteered, representing roughly one-fifth of the total Torres Strait Islander population at the time, an extraordinary enlistment rate.",
      },
      {
        heading: "Service",
        content:
          "The unit served throughout the war in the Torres Strait region, manning defensive positions, conducting patrols, and supporting the broader Australian military presence. In December 1943, a patrol was sent to Dutch New Guinea, where the unit saw combat: one soldier was killed and six were wounded. 36 men died on active service overall.",
      },
      {
        heading: "Pay discrimination and the 1943 strike",
        content:
          "Despite their service, Torres Strait Islander soldiers were initially paid at one-third the rate of their non-Indigenous counterparts. After a strike action in 1943, pay was raised to two-thirds of the standard rate. Full back pay was not awarded until 1986, over 40 years after the war ended. This pay disparity became a source of ongoing grievance and a catalyst for post-war activism for Indigenous civil rights.",
      },
      {
        heading: "Legacy",
        content:
          "The Torres Strait Light Infantry Battalion is the only Indigenous Australian battalion ever formed and holds a significant place in Australian military history. The service of Torres Strait Islander men during WWII is commemorated annually and contributed to the broader movement for Indigenous rights in Australia. Elia Doolah (Snr) was one of many men from Erub (Darnley Island) who served in the battalion. The last surviving member of the battalion, Mebai Warusam, died in July 2023.",
      },
    ],
    sources: [
      "Australian War Memorial",
      "National Archives of Australia",
    ],
    relatedArticles: [
      "elia-doolah-snr",
      "thursday-island",
      "badu-island",
      "erub-darnley-island",
    ],
    categories: [
      "Australian military units",
      "World War II",
      "Torres Strait history",
      "Indigenous military service",
    ],
  },
  {
    slug: "tsi-migration",
    title: "Torres Strait Islander migration to mainland Australia",
    type: "event",
    summary:
      "Beginning in the 1960s, a significant wave of Torres Strait Islander families migrated from the islands to mainland Australian cities. Today approximately 6,000 Torres Strait Islanders remain in the Torres Strait, while roughly 37,000 live on the mainland, particularly in Cairns, Townsville, Brisbane, and the Pilbara region of Western Australia. This migration transformed Torres Strait Islander communities and is the subject of Dr John Doolah's doctoral research.",
    infobox: {
      "Period": "1960s-1970s (peak)",
      "From": "Torres Strait Islands",
      "To": "Cairns, Townsville, Brisbane, Sydney, Pilbara (WA)",
      "Push factors": "Pearl industry collapse, WWII disruption, limited services",
      "Pull factors": "Railway construction, union wages, freedom from Protection Board",
      "Key event": "Railway time (1965 Perth arrival, 1968 Mt Newman world record)",
      "Population": "~6,000 remain on islands; ~37,000 on mainland",
      "Researcher": "Dr John Doolah, University of Melbourne",
    },
    sections: [
      {
        heading: "Background",
        content:
          "From the 1960s onwards, Torres Strait Islander families began migrating in significant numbers to mainland Australian cities. Push factors included the collapse of the pearl shell industry, WWII disruption to island life, continuing government control under the Protection Board, and limited health and education services. Pull factors included employment opportunities (particularly in railway construction), union wages, and freedom from the paternalistic oversight of the Protection Acts.",
      },
      {
        heading: "Railway time",
        content:
          "A key driver of migration was employment in railway construction across Australia, a period known among Torres Strait Islanders as 'railway time.' Torres Strait Islander workers arrived in Perth in 1965 and were part of the team that set a world record for track-laying at Mount Newman in Western Australia in 1968. The railway work offered good wages under union conditions and took Islander men far from the Torres Strait, establishing new communities in Western Australia's Pilbara region.",
      },
      {
        heading: "Mainland communities",
        content:
          "The migration created large Torres Strait Islander communities in mainland cities, particularly in Cairns (the closest major city), Townsville, and Brisbane. These diaspora communities maintained cultural traditions including dance, language, and ceremony while adapting to urban life. The Doolah family was part of this migration wave, with Dr John Doolah documenting his family's journey from the islands in the 1960s. Elia Doolah (Snr) died in Brisbane in 1984 and Taibi Napoleon Doolah died there in 1985, both buried at Mount Gravatt Cemetery.",
      },
      {
        heading: "Border No Change movement",
        content:
          "Despite migration, Torres Strait Islanders maintained strong connections to their island homelands. The 'Border No Change' movement reflected Islander determination to maintain Australian sovereignty over the Torres Strait and to preserve their rights to their traditional waters and sea country, even as many families established mainland lives.",
      },
      {
        heading: "Academic study",
        content:
          "Dr John Doolah's PhD thesis at the University of Newcastle (2021), titled 'Stories behind the Torres Strait Islander Migration Myth: the journey of the sap/bethey,' documents this migration from the perspective of the families who experienced it. His research provides detailed accounts of the Doolah family's journey from the islands to the mainland and challenges the simplistic 'migration myth' narrative.",
      },
    ],
    sources: [
      "Dr John Doolah, University of Newcastle, 2021",
      "ABS Census data",
    ],
    relatedArticles: [
      "john-doolah",
      "elia-doolah-snr",
      "reuben-doolah",
      "thursday-island",
    ],
    categories: [
      "Torres Strait history",
      "Australian migration",
      "Indigenous Australian history",
    ],
  },
];

// ─── Family Links ──────────────────────────────────────────────────────

export const familyLinks: FamilyLink[] = [
  // Baita Sagigi's children
  { parent: "baita-sagigi", child: "rasa-sagigi" }, // Rasa may be connected via the Kathleen/Margaret generation

  // Dan Sagigi Snr
  { parent: "dan-sagigi-snr", child: "jacob-dan-sagigi-jr" },

  // Charlie -> Benjamin
  { parent: "charlie-sagigi", child: "benjamin-sagigi" },

  // Napoleon Doolah's children
  { parent: "napoleon-doolah", child: "gara-doolah" },

  // Charlotte Doolah's children
  { parent: "charlotte-doolah", child: "reuben-doolah" },
  { parent: "charlotte-doolah", child: "geoffrey-doolah" },
  { parent: "charlotte-doolah", child: "elia-doolah-snr" },

  // Elia Doolah connection to Ben's mother
  // (Ben's mother is unnamed but was daughter of Elia Doolah and a Cowley woman)

  // Mareja Doolah -> Leilani Bin-Juda (descendant, not direct child)
  { parent: "mareja-doolah-badu", child: "leilani-bin-juda" },

  // George Cowley -> Leo Cowley
  { parent: "george-cowley", child: "leo-cowley" },
];

export const spouseLinks: SpouseLink[] = [
  { person1: "napoleon-doolah", person2: "napoleon-doolah" }, // placeholder
  { person1: "george-cowley", person2: "george-cowley" }, // placeholder - Balo Boa
  { person1: "mareja-doolah-badu", person2: "mareja-doolah-badu" }, // placeholder - Bora Bin Juda
  { person1: "rasa-sagigi", person2: "rasa-sagigi" }, // placeholder - William Namok
];

// ─── Helpers ────────────────────────────────────────────────────────────

export function getPersonBySlug(slug: string): PersonData | undefined {
  return people.find((p) => p.slug === slug);
}

export function getArticleBySlug(slug: string): ArticleData | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getAllSlugs(): string[] {
  return [
    ...people.map((p) => p.slug),
    ...articles.map((a) => a.slug),
  ];
}

export function getBySlug(
  slug: string
): { type: "person"; data: PersonData } | { type: "article"; data: ArticleData } | null {
  const person = getPersonBySlug(slug);
  if (person) return { type: "person", data: person };
  const article = getArticleBySlug(slug);
  if (article) return { type: "article", data: article };
  return null;
}

export function getRelatedPeople(slug: string): PersonData[] {
  const item = getBySlug(slug);
  if (!item) return [];
  const related = item.type === "person" ? item.data.relatedArticles : item.data.relatedArticles;
  return related
    .map((s) => getPersonBySlug(s))
    .filter((p): p is PersonData => p !== undefined);
}

// Family tree structure for visualization
export type TreeNode = {
  slug: string;
  name: string;
  born?: string;
  died?: string;
  island?: string;
  clan?: string;
  children: TreeNode[];
  family: "sagigi" | "doolah" | "cowley" | "other";
};

export function buildFamilyTrees(): TreeNode[] {
  const childMap = new Map<string, string[]>();
  for (const link of familyLinks) {
    const existing = childMap.get(link.parent) || [];
    existing.push(link.child);
    childMap.set(link.parent, existing);
  }

  const allChildren = new Set(familyLinks.map((l) => l.child));

  function buildNode(slug: string): TreeNode | null {
    const person = getPersonBySlug(slug);
    if (!person) return null;
    const childSlugs = childMap.get(slug) || [];
    const family = person.categories.some((c) => c.includes("Sagigi"))
      ? "sagigi"
      : person.categories.some((c) => c.includes("Doolah"))
        ? "doolah"
        : person.categories.some((c) => c.includes("Cowley"))
          ? "cowley"
          : "other";
    return {
      slug: person.slug,
      name: person.name,
      born: person.born,
      died: person.died,
      island: person.island,
      clan: person.clan,
      children: childSlugs.map(buildNode).filter((n): n is TreeNode => n !== null),
      family,
    };
  }

  // Find root nodes (people who are parents but not children)
  const roots = [...childMap.keys()].filter((slug) => !allChildren.has(slug));
  return roots.map(buildNode).filter((n): n is TreeNode => n !== null);
}
