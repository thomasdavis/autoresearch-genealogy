export interface InfoboxField {
  label: string;
  value: string;
}

export interface Reference {
  id: string;
  text: string;
}

export interface ArticleSection {
  id: string;
  title: string;
  content: string; // HTML content
  subsections?: ArticleSection[];
}

export interface Article {
  slug: string;
  title: string;
  subtitle?: string;
  ekyEntry: string;
  hatnote?: string;
  noticeBox?: { type: "stub" | "dispute" | "sources"; text: string };
  infobox: {
    headerLabel: string;
    headerValue: string;
    image?: string;
    imageCaption?: string;
    fields: InfoboxField[];
  };
  introduction: string; // HTML
  sections: ArticleSection[];
  categories: string[];
  references: Reference[];
  seeAlso: { title: string; slug: string }[];
}

const articles: Article[] = [
  // ---- ROSIE ROSIE #35 ----
  {
    slug: "rosie-rosie",
    title: "Rosie Rosie",
    subtitle: "EKY Apical Ancestor Entry xxxv",
    ekyEntry: "xxxv",
    hatnote:
      'This article is about the EKY apical ancestor listed as "Rosie Rosie" (Entry xxxv). For other women named Rosie in the Eastern Kuku Yalanji determination, see <a href="/rosie-maund-jankarji">Rosie Maund Jankarji</a>, <a href="/rosie-gurrmurragudgee">Rosie Gurrmurragudgee</a>, <a href="/sisters-mujala-and-rosie">Sisters Mujala and Rosie</a>, or <a href="/old-man-yorkey-and-rosie">Old Man Yorkey and Rosie</a>.',
    noticeBox: {
      type: "sources",
      text: "This article relies largely on a single archival source (Julia Nunn's 1912 Yarrabah marriage record). Additional citations are needed to verify claims about this individual's identity and family connections.",
    },
    infobox: {
      headerLabel: "Rosie Rosie",
      headerValue: "EKY Apical Ancestor",
      fields: [
        { label: "Other names", value: "Rosie" },
        { label: "Born", value: "Unknown (estimated c.1865\u20131875)" },
        { label: "Died", value: "Unknown" },
        { label: "Region", value: "Eastern Kuku Yalanji country" },
        { label: "Language group", value: "Kuku Yalanji" },
        { label: "Native title", value: "EKY Determination, Entry xxxv" },
        { label: "Spouse(s)", value: "Unknown" },
        {
          label: "Children",
          value: "Possibly Julia Nunn (per 1912 marriage record)",
        },
      ],
    },
    introduction: `<p><b>Rosie Rosie</b> is an apical ancestor listed at Entry xxxv (thirty-five) of the Eastern Kuku Yalanji (EKY) native title determination, handed down by the Federal Court of Australia in December 2007 in <i>Walker v State of Queensland</i>.<sup>[1]</sup> She is the most minimally documented of the five women named Rosie in the 44-entry schedule, with no biographical detail, no country association, no spouse, no children, no language name, and no alternative names recorded in the determination itself.</p>
<p>The reduplicative name form "Rosie Rosie" matches the mother's name recorded on the 1912 Yarrabah marriage certificate of Julia Nunn (father listed as "Davis"), providing the strongest documentary link between this apical ancestor and the broader Davis family genealogy of Far North Queensland.<sup>[2]</sup></p>`,
    sections: [
      {
        id: "identity",
        title: "Identity and naming",
        content: `<p>The name "Rosie Rosie" uses a reduplicative form uncommon in European naming conventions but attested in Aboriginal naming practices in Far North Queensland, where a single personal name might be doubled to distinguish individuals in communities where the name was common. Colonial records from the Cooktown district alone contain at least sixteen different women named "Rosie" in the late nineteenth and early twentieth centuries,<sup>[3]</sup> making disambiguation a persistent challenge for genealogical researchers.</p>
<p>No traditional language name, clan estate name, or European-derived surname is recorded for this individual in the EKY determination schedule. The entry is, by a significant margin, the most minimal of all 44 apical ancestor entries in the determination.</p>`,
      },
      {
        id: "historical-context",
        title: "Historical context",
        content: `<p>The Eastern Kuku Yalanji native title determination covers a large area of Far North Queensland, stretching from the Daintree River in the south to the Annan River in the north, and inland to the Great Dividing Range. The traditional country of the Eastern Kuku Yalanji people encompasses the Bloomfield River valley, the town of Rossville, Wujal Wujal, and surrounding areas.</p>
<p>Aboriginal people in this region experienced significant disruption during the colonial period, including removal to missions (particularly Bloomfield River Mission, established 1887, and Hope Vale, established 1886), employment on pastoral stations, and government control under successive iterations of the Aboriginal Protection Act. These circumstances make the documentary record fragmentary and often unreliable for genealogical purposes.</p>`,
      },
      {
        id: "julia-nunn-connection",
        title: "Connection to Julia Nunn",
        content: `<p>The 1912 marriage record of Julia Nunn at Yarrabah mission near Cairns lists the bride's mother as "Rosie Rosie" and father as "Davis."<sup>[2]</sup> Julia Nunn (also known as Julia Leftwich or Julia Davis) married at Yarrabah and later lived in the Innisfail district.</p>
<p>If this identification is correct, Rosie Rosie would be the mother of Julia Nunn and possibly related to Edgar Davis (born c.1883\u20131890) and Nellie (born c.1897\u20131901), who are connected to other EKY apical ancestor entries. However, no published source directly confirms this link, and the identification remains at moderate confidence.</p>`,
      },
      {
        id: "research-status",
        title: "Research status",
        content: `<p>Rosie Rosie has zero archival records outside the EKY schedule and the 1912 Yarrabah marriage entry. No records have been found in:</p>
<ul>
<li>Cairns and District Family History Society (CIFHS) registers</li>
<li>Trove newspaper archives</li>
<li>OH55 oral history recordings</li>
<li>Queensland State Archives Aboriginal Protection files</li>
<li>Port Douglas or Mossman audit records</li>
<li>Bloomfield Mission or Hope Vale records</li>
</ul>
<p>The absence of records is itself significant: it suggests either that this individual lived and died before the most intensive period of government record-keeping (post-1897 Aboriginal Protection Act), or that her records are filed under a different name not yet identified.</p>`,
      },
      {
        id: "disambiguation",
        title: "Disambiguation from other Rosies",
        content: `<p>The EKY determination explicitly lists five separate apical ancestor entries involving a woman named Rosie. The anthropological connection report prepared for the Federal Court treats each as a distinct individual. Rosie Rosie (Entry xxxv) is distinguished from:</p>
<ul>
<li><a href="/sisters-mujala-and-rosie">Sisters Mujala and Rosie</a> (Entry xi) \u2014 a sibling pair</li>
<li><a href="/rosie-gurrmurragudgee">Rosie Gurrmurragudgee</a> (Entry xvi) \u2014 identified by traditional name</li>
<li><a href="/rosie-maund-jankarji">Rosie Maund Jankarji</a> (Entry xxviii) \u2014 identified by traditional name Jankarji and surname Maund</li>
<li><a href="/old-man-yorkey-and-rosie">Old Man Yorkey and Rosie</a> (Entry xl) \u2014 a named couple</li>
</ul>`,
      },
    ],
    categories: [
      "Eastern Kuku Yalanji people",
      "Aboriginal Australians",
      "Native title holders",
      "People from Far North Queensland",
      "Year of birth unknown",
      "Year of death unknown",
    ],
    references: [
      {
        id: "ref1",
        text: "Walker v State of Queensland [2007] FCA 967. Federal Court of Australia, December 2007. EKY native title determination, Attachment 2: Schedule of Apical Ancestors.",
      },
      {
        id: "ref2",
        text: "Queensland BDM, Marriage Registration 2010/N/4576. Julia Nunn marriage record, Yarrabah, 1912. Mother listed as \"Rosie Rosie\", father listed as \"Davis.\"",
      },
      {
        id: "ref3",
        text: "Cooktown and District Historical Society Museum Records. Compiled register of all persons named Rosie in the Cooktown district. 16 separate individuals identified.",
      },
    ],
    seeAlso: [
      { title: "Sisters Mujala and Rosie", slug: "sisters-mujala-and-rosie" },
      { title: "Rosie Maund Jankarji", slug: "rosie-maund-jankarji" },
      { title: "Rosie Gurrmurragudgee", slug: "rosie-gurrmurragudgee" },
      {
        title: "Old Man Yorkey and Rosie",
        slug: "old-man-yorkey-and-rosie",
      },
    ],
  },

  // ---- SISTERS MUJALA AND ROSIE #11 ----
  {
    slug: "sisters-mujala-and-rosie",
    title: "Sisters Mujala and Rosie",
    subtitle: "EKY Apical Ancestor Entry xi",
    ekyEntry: "xi",
    hatnote:
      'This article is about the sibling pair listed at Entry xi of the EKY determination. For other women named Rosie in the determination, see <a href="/rosie-rosie">Rosie Rosie</a>, <a href="/rosie-maund-jankarji">Rosie Maund Jankarji</a>, <a href="/rosie-gurrmurragudgee">Rosie Gurrmurragudgee</a>, or <a href="/old-man-yorkey-and-rosie">Old Man Yorkey and Rosie</a>.',
    noticeBox: {
      type: "stub",
      text: "This article about an Aboriginal Australian person or group is a stub. No independent archival records have been located for either Mujala or Rosie beyond the EKY native title schedule.",
    },
    infobox: {
      headerLabel: "Sisters Mujala and Rosie",
      headerValue: "EKY Apical Ancestors",
      fields: [
        { label: "Other names", value: "None recorded" },
        { label: "Born", value: "Unknown" },
        { label: "Died", value: "Unknown" },
        { label: "Region", value: "Eastern Kuku Yalanji country" },
        { label: "Language group", value: "Kuku Yalanji" },
        { label: "Native title", value: "EKY Determination, Entry xi" },
        { label: "Spouse(s)", value: "None recorded" },
        { label: "Children", value: "Unknown" },
        {
          label: "Siblings",
          value: "Each other (Mujala and Rosie are sisters)",
        },
      ],
    },
    introduction: `<p><b>Sisters Mujala and Rosie</b> are a pair of siblings listed jointly at Entry xi (eleven) of the Eastern Kuku Yalanji (EKY) native title determination, handed down by the Federal Court of Australia in December 2007.<sup>[1]</sup> They are recorded as sisters, with no surnames, no traditional language names (beyond "Mujala"), no spouses, and no children named in the determination schedule.</p>
<p>The entry is one of several in the EKY schedule that lists multiple individuals as a single apical ancestor unit, reflecting the kinship-based structure of Aboriginal descent reckoning rather than the European convention of tracing from a single individual.</p>`,
    sections: [
      {
        id: "names",
        title: "Names and identity",
        content: `<p>"Mujala" appears to be a traditional personal name. No European equivalent or surname is recorded. "Rosie" is a European personal name commonly assigned to Aboriginal women during the colonial period, particularly in Far North Queensland where at least sixteen women named Rosie appear in the Cooktown district records alone.<sup>[2]</sup></p>
<p>No alternative spellings, aliases, or traditional names for the Rosie in this entry are recorded in any known source.</p>`,
      },
      {
        id: "location",
        title: "Location and country",
        content: `<p>Sisters Mujala and Rosie are placed within the broader Eastern Kuku Yalanji determination area, which encompasses the Bloomfield River valley, Rossville, and surrounding country between the Daintree and Annan Rivers. No specific clan estate or locality is recorded for this entry.</p>
<p>The Bloomfield and Rossville corridor is also associated with other EKY apical ancestor entries, including Entry xxxiii (Siblings Miliji, Kalkabinda, Kuruwuja, Peter Smith), suggesting possible kinship or geographic connections between these family groups.</p>`,
      },
      {
        id: "possible-connections",
        title: "Possible family connections",
        content: `<p>In April 2022, an anonymous commenter on the CIFHS Aboriginal Genealogy Australia blog asked for information about "Sisters Mujala and Rosie" alongside Entry xxxiii (the Miliji siblings).<sup>[3]</sup> This suggests a possible family connection between the two entries, though the nature of the relationship (marriage, shared clan estate, or kinship obligation) is not specified.</p>
<p>The entry has also been noted as having the best native title district fit for the Julia Nunn, Friday, and King family corridor in the Bloomfield and Rossville area, though this connection remains speculative.</p>`,
      },
      {
        id: "archival-record",
        title: "Archival record",
        content: `<p>No independent archival records have been located for either Mujala or Rosie in this entry. Searches have been conducted across:</p>
<ul>
<li>Cairns and District Family History Society (CIFHS) registers</li>
<li>Queensland BDM indexes</li>
<li>Trove newspaper archives</li>
<li>Port Douglas and Mossman audit records</li>
<li>OH55 oral history recordings</li>
<li>Bloomfield Mission and Hope Vale records</li>
</ul>
<p>The complete absence of archival records may indicate that both women lived before the systematic recording of Aboriginal populations under the 1897 Aboriginal Protection and Restriction of the Sale of Opium Act, or that their records are filed under names not yet connected to this entry.</p>`,
      },
    ],
    categories: [
      "Eastern Kuku Yalanji people",
      "Aboriginal Australians",
      "Native title holders",
      "People from Far North Queensland",
      "Sibling pairs",
      "Year of birth unknown",
      "Year of death unknown",
    ],
    references: [
      {
        id: "ref1",
        text: "Walker v State of Queensland [2007] FCA 967. Federal Court of Australia, December 2007. EKY native title determination, Attachment 2: Schedule of Apical Ancestors, Entry xi.",
      },
      {
        id: "ref2",
        text: "Cooktown and District Historical Society Museum Records. Compiled register of all persons named Rosie in the Cooktown district.",
      },
      {
        id: "ref3",
        text: "Aboriginal Genealogy Australia blog (CIFHS), April 2022 comment. Anonymous descendant enquiry regarding Entries xi and xxxiii.",
      },
    ],
    seeAlso: [
      { title: "Rosie Rosie", slug: "rosie-rosie" },
      { title: "Rosie Maund Jankarji", slug: "rosie-maund-jankarji" },
      { title: "Rosie Gurrmurragudgee", slug: "rosie-gurrmurragudgee" },
      {
        title: "Old Man Yorkey and Rosie",
        slug: "old-man-yorkey-and-rosie",
      },
    ],
  },

  // ---- ROSIE GURRMURRAGUDGEE #16 ----
  {
    slug: "rosie-gurrmurragudgee",
    title: "Rosie Gurrmurragudgee",
    subtitle: "EKY Apical Ancestor Entry xvi",
    ekyEntry: "xvi",
    hatnote:
      'This article is about the EKY apical ancestor listed at Entry xvi. For other women named Rosie in the determination, see <a href="/rosie-rosie">Rosie Rosie</a>, <a href="/rosie-maund-jankarji">Rosie Maund Jankarji</a>, <a href="/sisters-mujala-and-rosie">Sisters Mujala and Rosie</a>, or <a href="/old-man-yorkey-and-rosie">Old Man Yorkey and Rosie</a>.',
    noticeBox: {
      type: "stub",
      text: "This article about an Aboriginal Australian person is a stub. No independent archival records have been located for Rosie Gurrmurragudgee beyond the EKY native title schedule.",
    },
    infobox: {
      headerLabel: "Rosie Gurrmurragudgee",
      headerValue: "EKY Apical Ancestor",
      fields: [
        { label: "Traditional name", value: "Gurrmurragudgee" },
        { label: "European name", value: "Rosie" },
        { label: "Born", value: "Unknown" },
        { label: "Died", value: "Unknown" },
        { label: "Region", value: "Eastern Kuku Yalanji country" },
        { label: "Language group", value: "Kuku Yalanji" },
        { label: "Native title", value: "EKY Determination, Entry xvi" },
        { label: "Spouse(s)", value: "None recorded" },
        { label: "Children", value: "Unknown" },
      ],
    },
    introduction: `<p><b>Rosie Gurrmurragudgee</b> is an apical ancestor listed at Entry xvi (sixteen) of the Eastern Kuku Yalanji (EKY) native title determination, handed down by the Federal Court of Australia in December 2007 in <i>Walker v State of Queensland</i>.<sup>[1]</sup></p>
<p>Unlike several other Rosie entries in the determination, Rosie Gurrmurragudgee is identified by a traditional language name: "Gurrmurragudgee." No spouse, children, or additional biographical details are recorded in the determination schedule. She is the least documented of all five Rosie entries in the EKY determination, with no independent archival records located in any repository.</p>`,
    sections: [
      {
        id: "name",
        title: "Name and language",
        content: `<p>The name "Gurrmurragudgee" is a polysyllabic form consistent with personal names in Kuku Yalanji and related languages of Far North Queensland. The name structure (five or more syllables, ending in a vowel sound) follows patterns attested in other traditional names from the Eastern Kuku Yalanji region. No translation or meaning for the name has been recorded in accessible sources.</p>
<p>"Rosie" is a European personal name widely assigned to Aboriginal women during the colonial period. The combination of a European first name with a traditional name as a second identifier was common in government and mission records.</p>`,
      },
      {
        id: "location",
        title: "Country and location",
        content: `<p>Rosie Gurrmurragudgee is placed within the Eastern Kuku Yalanji determination area but no specific clan estate, river system, or locality is recorded. The determination area covers country from the Daintree River northward to the Annan River, including the Bloomfield Valley, Wujal Wujal, Rossville, and surrounding areas.</p>`,
      },
      {
        id: "archival-record",
        title: "Archival record",
        content: `<p>Extensive searches across all major archival repositories have returned no results for Rosie Gurrmurragudgee. The following sources were searched with negative results:</p>
<ul>
<li>Cairns and District Family History Society (CIFHS) registers</li>
<li>Queensland BDM birth, death, and marriage indexes</li>
<li>Trove digitised newspaper archives</li>
<li>Port Douglas and Mossman Auditor-General savings bank records</li>
<li>OH55 oral history recordings (Kuku Yalanji series)</li>
<li>Bloomfield River Mission records</li>
<li>Hope Vale Lutheran Mission records</li>
<li>FamilySearch, Ancestry.com, and FindAGrave databases</li>
<li>Queensland State Archives Aboriginal Protection files</li>
</ul>
<p>The traditional name "Gurrmurragudgee" does not appear in any colonial-era document indexed in these collections. This is consistent with the general pattern in which traditional Aboriginal names were rarely recorded by colonial administrators, who assigned European names for administrative convenience.</p>`,
      },
      {
        id: "significance",
        title: "Significance in native title",
        content: `<p>Despite the absence of archival records, Rosie Gurrmurragudgee's inclusion as an apical ancestor in the EKY determination reflects the oral testimony and genealogical knowledge presented to the Federal Court. The anthropological connection report prepared for the case would have documented the descent lines connecting living claimants to this ancestor, though these reports are typically not publicly accessible.</p>
<p>Her listing as a separate entry from the four other Rosies in the schedule indicates that the anthropological evidence was sufficient to distinguish her as a distinct individual.</p>`,
      },
    ],
    categories: [
      "Eastern Kuku Yalanji people",
      "Aboriginal Australians",
      "Native title holders",
      "People from Far North Queensland",
      "Year of birth unknown",
      "Year of death unknown",
    ],
    references: [
      {
        id: "ref1",
        text: "Walker v State of Queensland [2007] FCA 967. Federal Court of Australia, December 2007. EKY native title determination, Attachment 2: Schedule of Apical Ancestors, Entry xvi.",
      },
    ],
    seeAlso: [
      { title: "Rosie Rosie", slug: "rosie-rosie" },
      { title: "Rosie Maund Jankarji", slug: "rosie-maund-jankarji" },
      { title: "Sisters Mujala and Rosie", slug: "sisters-mujala-and-rosie" },
      {
        title: "Old Man Yorkey and Rosie",
        slug: "old-man-yorkey-and-rosie",
      },
    ],
  },

  // ---- ROSIE MAUND JANKARJI #28 ----
  {
    slug: "rosie-maund-jankarji",
    title: "Rosie Maund Jankarji",
    subtitle: "EKY Apical Ancestor Entry xxviii",
    ekyEntry: "xxviii",
    hatnote:
      'This article is about the EKY apical ancestor listed at Entry xxviii. For other women named Rosie in the determination, see <a href="/rosie-rosie">Rosie Rosie</a>, <a href="/rosie-gurrmurragudgee">Rosie Gurrmurragudgee</a>, <a href="/sisters-mujala-and-rosie">Sisters Mujala and Rosie</a>, or <a href="/old-man-yorkey-and-rosie">Old Man Yorkey and Rosie</a>.',
    infobox: {
      headerLabel: "Rosie Maund Jankarji",
      headerValue: "EKY Apical Ancestor",
      fields: [
        { label: "Traditional name", value: "Jankarji" },
        { label: "European name", value: "Rosie Maund" },
        { label: "Born", value: "Unknown (estimated pre-1890)" },
        { label: "Died", value: "Unknown" },
        { label: "Region", value: "Port Douglas / Mossman / Bloomfield" },
        { label: "Language group", value: "Kuku Yalanji" },
        { label: "Native title", value: "EKY Determination, Entry xxviii" },
        {
          label: "Spouse(s)",
          value:
            "Tommy Jinjarrba Lefthand, Tommy Ngangkun Johnson (Buchanan), Barney Lunn (Lund), Billie Lunn (Lund), Tommy Jindalman Hide",
        },
        { label: "Children", value: "Unknown" },
      ],
    },
    introduction: `<p><b>Rosie Maund Jankarji</b> is an apical ancestor listed at Entry xxviii (twenty-eight) of the Eastern Kuku Yalanji (EKY) native title determination, handed down by the Federal Court of Australia in December 2007.<sup>[1]</sup> She is the most extensively documented of the five Rosie entries in the determination, being the only one with a traditional name (Jankarji), a European-derived surname (Maund), and five named husbands or partners.</p>
<p>Her full entry in the schedule reads: "Rosie Maund Jankarji and her husbands Tommy Jinjarrba Lefthand, Tommy Ngangkun Johnson (Buchanan), Barney Lunn (Lund), Billie Lunn (Lund) and Tommy Jindalman Hide."<sup>[1]</sup></p>`,
    sections: [
      {
        id: "names",
        title: "Names and identity",
        content: `<p>"Jankarji" is a traditional personal name from the Kuku Yalanji language. "Maund" is a European-derived surname that appears in the CIFHS records alongside "Johnson" as an alias: "Jimmy Johnson Mossman (or Maund)" appears in removal records, indicating that the Johnson and Maund names were used interchangeably within this family network.<sup>[2]</sup></p>
<p>The Maund surname does not appear to derive from a pastoral station or employer name in the Port Douglas district, and its origin is uncertain.</p>`,
      },
      {
        id: "husbands",
        title: "Husbands and partners",
        content: `<p>Rosie Maund Jankarji is recorded with five named husbands or partners. The listing of multiple partners in an apical ancestor entry may reflect sequential marriages (common where life expectancy was short and remarriage frequent), or it may reflect the anthropological report's effort to capture all known family connections for the purposes of establishing descent.</p>

<h3 id="tommy-lefthand">Tommy Jinjarrba Lefthand</h3>
<p>Tommy Jinjarrba Lefthand appears in the Port Douglas Auditor-General savings bank audit of 1923 under account number /4566.<sup>[3]</sup> The name "Jinjarrba" (also written "Jinjirrba") echoes the name associated with Old Man Toby (EKY Entry xxxi), suggesting possible kinship between the two family groups. The "Lefthand" surname, also rendered "Left Hand," may derive from a physical characteristic or be an assigned European name.</p>

<h3 id="tommy-johnson">Tommy Ngangkun Johnson (Buchanan)</h3>
<p>The dual surname "Johnson (Buchanan)" connects this partner to the broader Buchanan family network in the EKY determination, including Entry xxii (Jessie Buchanan). The Johnson family at Mossman included John Johnson, who held an exemption certificate from 1915.<sup>[2]</sup> "Ngangkun" is a traditional personal name.</p>

<h3 id="lunn-brothers">Barney Lunn (Lund) and Billie Lunn (Lund)</h3>
<p>The two Lunn (also Lund) partners were likely brothers. Related Lunn family members appear in CIFHS records: Harry Lunn (H-67) at Mossman and Willie Lunn (W-81) at Mossman.<sup>[2]</sup> The "Lunn/Lund" surname may derive from a Scandinavian settler family in the Port Douglas district.</p>

<h3 id="tommy-hide">Tommy Jindalman Hide</h3>
<p>Tommy Jindalman Hide appears in the Port Douglas audit of 1923 under account /4161 as "Tommy Hides."<sup>[3]</sup> The Hide family also has connections to Yarrabah mission, where Charlie Hide/Hyde and Amy Hide appear in baptism records. "Jindalman" is a traditional personal name.</p>`,
      },
      {
        id: "port-douglas",
        title: "Port Douglas connections",
        content: `<p>The Port Douglas Auditor-General savings bank audits of 1921 and 1923 provide the most substantial documentary evidence for Rosie Maund Jankarji's family network. Multiple EKY apical ancestors and their families appear on the same audit pages, indicating a concentration of Aboriginal families under government administration at Port Douglas during this period.<sup>[3]</sup></p>
<p>Notably, Joseph Braikenridge (account /4701) also appears in the same 1923 audit. The Brackenridge family is connected to other lines in the EKY genealogy, though no direct link to Rosie Maund Jankarji has been established.</p>`,
      },
      {
        id: "maund-johnson",
        title: "Maund and Johnson surname network",
        content: `<p>The interchangeable use of "Maund" and "Johnson" as surnames for members of the same family group is documented in CIFHS removal records. This pattern, where an individual or family might be recorded under different surnames in different administrative contexts, is common in Aboriginal records from this period and complicates genealogical research.</p>
<p>The Johnson/Maund alias pattern suggests the surnames reflect different administrative encounters rather than distinct family lines: "Johnson" may have been assigned by a mission or employer, while "Maund" may derive from a different context.</p>`,
      },
      {
        id: "disambiguation",
        title: "Disambiguation",
        content: `<p>Rosie Maund Jankarji is explicitly distinguished from the four other Rosie entries in the EKY determination. Her traditional name (Jankarji), European surname (Maund), and five named partners provide more identifying information than any other Rosie entry, making her the least likely to be confused with another individual.</p>
<p>The entry serves as an important "anti-merge" reference in genealogical research: it demonstrates that not every woman named Rosie in the Bloomfield/Mossman/Cooktown corridor can be assumed to be the same person.</p>`,
      },
    ],
    categories: [
      "Eastern Kuku Yalanji people",
      "Aboriginal Australians",
      "Native title holders",
      "People from Port Douglas, Queensland",
      "People from Mossman, Queensland",
      "Year of birth unknown",
      "Year of death unknown",
    ],
    references: [
      {
        id: "ref1",
        text: "Walker v State of Queensland [2007] FCA 967. Federal Court of Australia, December 2007. EKY native title determination, Attachment 2: Schedule of Apical Ancestors, Entry xxviii.",
      },
      {
        id: "ref2",
        text: 'Cairns and District Family History Society (CIFHS). Aboriginal registers: employment, removal, and exemption records. Entries for Johnson/Maund alias, Harry Lunn (H-67), Willie Lunn (W-81), John Johnson exemption.',
      },
      {
        id: "ref3",
        text: "Port Douglas Auditor-General Savings Bank Audit, 1921 and 1923. Account entries for Tommy Left Hand (/4566), Tommy Hides (/4161), Jimmie Maund (2725/4501).",
      },
    ],
    seeAlso: [
      { title: "Rosie Rosie", slug: "rosie-rosie" },
      { title: "Rosie Gurrmurragudgee", slug: "rosie-gurrmurragudgee" },
      { title: "Sisters Mujala and Rosie", slug: "sisters-mujala-and-rosie" },
      {
        title: "Old Man Yorkey and Rosie",
        slug: "old-man-yorkey-and-rosie",
      },
    ],
  },

  // ---- OLD MAN YORKEY AND ROSIE #41 ----
  {
    slug: "old-man-yorkey-and-rosie",
    title: "Old Man Yorkey and Rosie",
    subtitle: "EKY Apical Ancestor Entry xl",
    ekyEntry: "xl",
    hatnote:
      'This article is about the couple listed at Entry xl of the EKY determination. For other women named Rosie in the determination, see <a href="/rosie-rosie">Rosie Rosie</a>, <a href="/rosie-maund-jankarji">Rosie Maund Jankarji</a>, <a href="/rosie-gurrmurragudgee">Rosie Gurrmurragudgee</a>, or <a href="/sisters-mujala-and-rosie">Sisters Mujala and Rosie</a>.',
    infobox: {
      headerLabel: "Old Man Yorkey and Rosie",
      headerValue: "EKY Apical Ancestors",
      fields: [
        { label: "Other names", value: "Yorkey Beaumann/Baumann, Rosie Yorkey" },
        { label: "Born", value: "Estimated c.1860\u20131880 (both)" },
        { label: "Died", value: "Unknown" },
        {
          label: "Region",
          value: "Port Douglas / Mossman / Daintree",
        },
        { label: "Language group", value: "Kuku Yalanji" },
        { label: "Native title", value: "EKY Determination, Entry xl" },
        {
          label: "Relationship",
          value: "Married couple or long-term partners",
        },
        {
          label: "Known descendants",
          value:
            "Yorkey Bauman (b. c.1906), Jimmy Yorkey, Arnold Yorkey, Margaret Yorkey, Evelyn Yorkey",
        },
      ],
    },
    introduction: `<p><b>Old Man Yorkey and Rosie</b> are a couple listed jointly at Entry xl (forty) of the Eastern Kuku Yalanji (EKY) native title determination, handed down by the Federal Court of Australia in December 2007.<sup>[1]</sup> Of the five Rosie entries in the determination, this couple has the most extensive family documentation, with archival records spanning from 1915 to 1962 across Port Douglas, Mossman, and the Daintree Aboriginal Mission.</p>
<p>The surname "Yorkey" became a family name carried by their descendants. The European surname "Beaumann" (also written "Baumann") was also adopted by the family, appearing in later government records.</p>`,
    sections: [
      {
        id: "old-man-yorkey",
        title: "Old Man Yorkey",
        content: `<p>"Old Man" is a respectful prefix denoting an elder in Aboriginal communities, not a personal name. "Yorkey" (also written "Yorkie" or "Yorky") may derive from the English name "York" or from a place name. The name appears in multiple administrative records across three decades:</p>
<ul>
<li><b>1915\u20131916:</b> Listed in the Port Douglas war census, entry 138.<sup>[2]</sup></li>
<li><b>1921:</b> Port Douglas Auditor-General savings bank audit, account 1810.<sup>[3]</sup></li>
<li><b>1923:</b> Port Douglas audit, accounts 4190 and 4706 (as "Yorky").<sup>[3]</sup></li>
<li><b>1943:</b> Listed among males receiving relief at the Daintree Aboriginal Mission.<sup>[4]</sup></li>
<li><b>1944:</b> Mossman audit, listed as "Yorkey Beaumann" (Y-11).<sup>[5]</sup></li>
</ul>
<p>The transition from "Yorkey" to "Yorkey Beaumann" between the 1923 and 1944 records suggests the family adopted the European surname Beaumann (or Baumann) during the intervening years, possibly through employment or administrative assignment.</p>`,
      },
      {
        id: "rosie-yorkey",
        title: "Rosie (Yorkey)",
        content: `<p>The Rosie in this entry appears in the archival record as "Rosie Yorkey," taking her partner's name as a surname. She appears in:</p>
<ul>
<li><b>1943:</b> Listed among women receiving relief at the Daintree Aboriginal Mission (22 April 1943), entry #41.<sup>[4]</sup> Her listing alongside Yorkey in the same relief distribution confirms their partnership.</li>
</ul>
<p>No earlier independent records for Rosie Yorkey have been located. Her birth name, traditional name, and family of origin are not recorded in any known source.</p>`,
      },
      {
        id: "daintree-mission",
        title: "Daintree Aboriginal Mission",
        content: `<p>The Daintree Aboriginal Mission (also known as the Daintree Aboriginal Settlement) was a government-managed settlement for Aboriginal people in the Daintree River area. Old Man Yorkey and Rosie were resident there by at least 1943, when both appear in relief distribution records.</p>
<p>The settlement housed Aboriginal families from across the Eastern Kuku Yalanji region who had been removed from pastoral stations, towns, and fringe camps under the Aboriginal Protection Act. Residents were subject to government control over movement, employment, and marriage.</p>`,
      },
      {
        id: "beaumann-family",
        title: "Beaumann/Baumann family",
        content: `<p>The Beaumann (or Baumann) surname appears in multiple records connected to this family:</p>
<ul>
<li><b>Paddy Beaumann:</b> Listed at Port Douglas in the 1921 audit (account 1868) and 1923 audit (account 4240). Likely a relative of Old Man Yorkey.<sup>[3]</sup></li>
<li><b>P Baumann:</b> Mossman, 1930 audit, account 4240 (last used 1923). Likely the same Paddy Beaumann.<sup>[5]</sup></li>
<li><b>Yorkey Bauman:</b> Listed in 1962 exemption records, age 56 (born c.1906), single. Likely a son of Old Man Yorkey.<sup>[6]</sup></li>
</ul>
<p>The surname "Beaumann/Baumann" is of German or Scandinavian origin and likely derives from a European settler or employer in the Port Douglas or Daintree district.</p>`,
      },
      {
        id: "descendants",
        title: "Documented descendants",
        content: `<p>Queensland Government exemption records from 1962 document several members of the Yorkey family:<sup>[6]</sup></p>
<ul>
<li><b>Yorkey Bauman</b> (age 56, single) \u2014 likely a son of Old Man Yorkey</li>
<li><b>Jimmy Yorkey</b> (age 33, married)</li>
<li><b>Mary Yorkey</b> (age 27, wife of Jimmy)</li>
<li><b>Arnold Yorkey</b> (age 9, son of Jimmy)</li>
<li><b>Margaret Yorkey</b> (age 6, daughter of Jimmy)</li>
<li><b>Evelyn Yorkey</b> (age 3, daughter of Jimmy)</li>
</ul>
<p>These exemption records indicate the family was seeking release from the restrictions of the Aboriginal Protection Act, which by 1962 was in its final years before being replaced by less restrictive legislation.</p>
<p>Hope Vale church records also note that "Mary Kerr possibly married Yorkey Beaumann," providing a further connection between the Yorkey/Beaumann family and the Hope Vale Lutheran Mission community.<sup>[7]</sup></p>`,
      },
      {
        id: "geographic-range",
        title: "Geographic range",
        content: `<p>The documentary record places Old Man Yorkey and Rosie's family across a wide area of Eastern Kuku Yalanji country over several decades:</p>
<ul>
<li><b>Port Douglas:</b> 1915\u20131923 (war census, savings bank audits)</li>
<li><b>Mossman:</b> 1944 (audit), 1962 (exemption records)</li>
<li><b>Daintree Mission:</b> 1943 (relief distribution)</li>
</ul>
<p>This geographic range, spanning from Port Douglas to the Daintree River, is consistent with the broader Eastern Kuku Yalanji determination area and suggests the family maintained connections across multiple communities within their traditional country.</p>`,
      },
    ],
    categories: [
      "Eastern Kuku Yalanji people",
      "Aboriginal Australians",
      "Native title holders",
      "People from Port Douglas, Queensland",
      "People from Mossman, Queensland",
      "People from the Daintree, Queensland",
      "Married couples",
      "Year of birth unknown",
      "Year of death unknown",
    ],
    references: [
      {
        id: "ref1",
        text: "Walker v State of Queensland [2007] FCA 967. Federal Court of Australia, December 2007. EKY native title determination, Attachment 2: Schedule of Apical Ancestors, Entry xl.",
      },
      {
        id: "ref2",
        text: "Port Douglas War Census, 1915\u20131916. Entry 138: Yorkey.",
      },
      {
        id: "ref3",
        text: "Port Douglas Auditor-General Savings Bank Audit, 1921 and 1923. Account entries for Yorkey/Yorky (1810/4190/4706), Paddy Beaumann (1868/4240).",
      },
      {
        id: "ref4",
        text: "Daintree Aboriginal Mission, relief distribution list, 22 April 1943. Yorkey listed among males, Rosie Yorkey listed among females.",
      },
      {
        id: "ref5",
        text: "Mossman Auditor-General Savings Bank Audit, 1944. Yorkey Beaumann (Y-11). Also: P Baumann, 1930 audit (account 4240).",
      },
      {
        id: "ref6",
        text: "Queensland Government exemption records, 1962. Yorkey Bauman (age 56), Jimmy Yorkey (age 33), Mary Yorkey (age 27), Arnold Yorkey (age 9), Margaret Yorkey (age 6), Evelyn Yorkey (age 3).",
      },
      {
        id: "ref7",
        text: "Hope Vale Lutheran Mission church records. Note: \"Mary Kerr possibly married Yorkey Beaumann.\"",
      },
    ],
    seeAlso: [
      { title: "Rosie Rosie", slug: "rosie-rosie" },
      { title: "Rosie Maund Jankarji", slug: "rosie-maund-jankarji" },
      { title: "Rosie Gurrmurragudgee", slug: "rosie-gurrmurragudgee" },
      { title: "Sisters Mujala and Rosie", slug: "sisters-mujala-and-rosie" },
    ],
  },
];

export function getAllArticles(): Article[] {
  return articles;
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getAllSlugs(): string[] {
  return articles.map((a) => a.slug);
}
