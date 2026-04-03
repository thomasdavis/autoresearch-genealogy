export default function HighlightsPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-ink mb-2">
          Davis Family Story
        </h1>
        <p className="text-ink/60 text-lg">
          Five generations from Cooktown to Mossman. From a Scottish immigrant and
          an Aboriginal woman to Australia&apos;s first Aboriginal magistrate.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { value: "5", label: "Generations" },
          { value: "75+", label: "Known Individuals" },
          { value: "1885", label: "Earliest Arrival" },
          { value: "1", label: "First Aboriginal Magistrate" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg border border-accent/20 p-4 text-center"
          >
            <div className="font-serif text-2xl font-bold text-ink">
              {stat.value}
            </div>
            <div className="text-xs text-ink/50 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Legal and Public Distinction */}
      <Section title="Legal and Public Distinction">
        <Table
          headers={["Person", "Achievement", "Year", "Details"]}
          rows={[
            [
              "Pat O'Shane AM",
              "First Aboriginal magistrate in Australia",
              "1986",
              "Appointed to the NSW Local Court. Served for over 25 years. Of the Kuku Yalanji people, granddaughter of George Edgar Davis.",
            ],
            [
              "Pat O'Shane AM",
              "Head, NSW Ministry of Aboriginal Affairs",
              "1981",
              "First Aboriginal person to head a government ministry in Australia.",
            ],
            [
              "Pat O'Shane AM",
              "Chancellor, University of New England",
              "1994",
              "Served as Chancellor of UNE.",
            ],
            [
              "Gladys Dorothy O'Shane",
              "Pioneer of Aboriginal rights, Cairns",
              "1940s-1965",
              "Raised her children to pursue education at a time when Aboriginal families faced systemic barriers. Her daughter became a national figure.",
            ],
            [
              "Patrick James O'Shane",
              '"Tiger" O\'Shane',
              "1940s-1999",
              "Irish-born husband of Gladys. Known as 'Tiger' for fighting back when taunted about his marriage to an Aboriginal woman. Married Gladys on 26 Oct 1940 at Assembly of God Tabernacle, Cairns.",
            ],
          ]}
        />
      </Section>

      {/* Native Title */}
      <Section title="Native Title and Land Rights">
        <Table
          headers={["Person / Group", "Determination", "Year", "Details"]}
          rows={[
            [
              "Caroline Rose Davis (apical ancestor)",
              "Brady v State of Queensland [2013] FCA 958",
              "2013",
              "Caroline identified as apical ancestor of the Western Yalanji people. Listed under five name forms: Davis, Molloy, Brown, Roberts, Kitchay.",
            ],
            [
              "Buiku Buiku > Kitty > Caroline",
              "Western Yalanji maternal line",
              "2013",
              "Three-generation maternal line established through native title evidence. Buiku Buiku was Kitty's father, Kitty was Caroline's mother.",
            ],
            [
              "Rosie Rosie (apical ancestor xxxv)",
              "Eastern Kuku Yalanji native title schedule",
              "Present",
              "Rosie is listed as 'Rosie Rosie', apical ancestor entry xxxv in the Eastern Kuku Yalanji native title schedule. Kate Waters, expert genealogist for the CYU#1 claim, holds unpublished descent charts that may illuminate her parentage and connections.",
            ],
            [
              "Edgar Davis and family",
              "Yarrabah mission and later Mossman",
              "1906-1977",
              "Edgar's 1906 birth registration (1906/O/924) lists him as child of George Brackenridge and Rosie. The 'Davis' surname was adopted later, likely at Yarrabah mission. The retrospective marriage registration (2010/N/4550) for Edgar and Caroline was likely processed as part of native title evidence preparation.",
            ],
            [
              "George Davis Park (Bubu Kinkari)",
              "Mossman public park",
              "Present",
              "A park in Mossman bearing the Davis name and an Aboriginal name. Used for NAIDOC Week celebrations. Likely named after George Edgar Davis.",
            ],
          ]}
        />
      </Section>

      {/* Immigration and Settlement */}
      <Section title="Immigration and Settlement">
        <Table
          headers={["Person", "Event", "Year", "Details"]}
          rows={[
            [
              "John Brackenridge (likely George's brother)",
              "Arrived Queensland on the Gulf of Carpentaria",
              "1885",
              "Arrived from Ayrshire, Scotland, in 1885. Occupation: Fitter. Mrs J. Brackenridge was recorded at Mossman in 1939. The Ayrshire origin suggests the Brackenridge family were lowland Scots.",
            ],
            [
              "George Brackenridge",
              "Active on the Mossman/Port Douglas coast",
              "c. 1890s-1939",
              "Father of Edgar (born 1906, reg. 1906/O/924), Frederick (baptised 1899), Arthur, Joseph, and others. His wife was Rosie, an Aboriginal woman. His 1939 death certificate names his parents as Maurice and Mary Brackenridge. The family adopted the surname 'Davis' at Yarrabah mission; Edgar used both names throughout his life.",
            ],
            [
              "Brown Roberts",
              "Cooktown / Mount Carbine area",
              "c. 1880s",
              "Father of Caroline Rose. No given name recorded. Caroline was born at Mount Carbine, at the boundary between Western Yalanji and Eastern Kuku Yalanji country.",
            ],
          ]}
        />
      </Section>

      {/* Mission System */}
      <Section title="Mission System and Government Control">
        <Table
          headers={["Person", "Event", "Year", "Details"]}
          rows={[
            [
              "George Edgar Davis",
              "Recorded at Yarrabah mission",
              "1904",
              "Listed as 'Edgar, H/C, 14 yrs' in the Chief Protector's report. Taken to Yarrabah as a child. His 1906 birth registration (1906/O/924) under 'Edgar Brackenridge' was filed around this time, naming parents George Brackenridge and Rosie.",
            ],
            [
              "Julia and Nellie (Rossville orphans)",
              "Removed to Yarrabah as orphans",
              "1905",
              "Official report records Julia (9, H/C) and Nellie (4.5, H/C) from Rossville as orphans. Their mother had died. Julia's marriage record later names father 'Davis', mother 'Rosie Rosie'.",
            ],
            [
              "Arthur Brackenridge",
              "Sent to Yarrabah aged ~4",
              "1901",
              "Northern Protector report says mother 'Rosie' already had '3 other children at Yarrabah' and was 'legally married to a kanaka at Mossman'.",
            ],
            [
              "Edgar Davis and Caroline",
              "Marriage at St John's Church, Cairns",
              "1909",
              "Edgar Davis married Caroline on 9 Oct 1909. Edgar recorded as 22 years old. He used the name 'Edgar Davis' for this marriage, though his birth was registered as Edgar Brackenridge. Marriage independently confirmed by Yarrabah transcriptions.",
            ],
            [
              "Edgar Braikenridge",
              "Witness on Harold Douglas birth registration",
              "1921",
              "Edgar signed as 'Edgar Braikenridge' on Harold Douglas's 1921 birth registration, confirming he used both the Davis and Brackenridge surnames at different times.",
            ],
            [
              "Charles Joseph Davis",
              "Exemption certificate, Mossman",
              "1938",
              "Parents described as 'H/C Phillipino, H/C Aborigine'. DNA has since ruled out Filipino ancestry; the classification was bureaucratic error.",
            ],
            [
              "Pansy, Hazel, Edgar, Kathleen Davis",
              "Removed from Edmonton to Mona Mona",
              "1921",
              "Separate Davis sibling group. The younger Edgar Davis was blind ('from finger cherry'). Must never be confused with the older George Edgar Davis of Mossman.",
            ],
          ]}
        />
      </Section>

      {/* Family Connections */}
      <Section title="Marriages and Family Connections">
        <Table
          headers={["Couple", "Date", "Place", "Significance"]}
          rows={[
            [
              "George Edgar Davis and Caroline Rose Brown/Molloy",
              "9 Oct 1909",
              "St John's Church, Cairns",
              "Union of an Aboriginal man (taken to Yarrabah as a child) and a woman of the Western Yalanji people. They had at least 10 children at Mossman/Port Douglas.",
            ],
            [
              "Gladys Dorothy Davis and Patrick James O'Shane",
              "26 Oct 1940",
              "Assembly of God Tabernacle, Cairns",
              "Cross-cultural marriage between an Aboriginal woman and an Irishman. Their daughter Pat became Australia's first Aboriginal magistrate.",
            ],
            [
              "Julia Nunn and Victor Leftwich",
              "15 Feb 1912",
              "St Alban's Church, Yarrabah",
              "Julia's marriage record names father 'Davis' and mother 'Rosie Rosie'. The strongest free-source record linking the Davis and Rosie names in one document.",
            ],
            [
              "Pat O'Shane and Mick Miller",
              "5 May 1962",
              "St Monica's Cathedral, Cairns",
              "Marriage between two prominent Aboriginal Australians. Mick Miller was an Aboriginal statesman. Two daughters: Lydia Caroline and Marilyn Rose.",
            ],
            [
              "George Clifford Noble and Mollie Hewison",
              "8 Apr 1912",
              "Yarrabah Aboriginal Community",
              "Noble family married into the Davis line through their daughter Dorothy Molly Noble, who married Charles Joseph Davis in 1935.",
            ],
            [
              "Rosie Julian (nee Hippi) and Paddy Julian",
              "13 May 1949",
              "Mossman",
              "Rosie's late marriage to Paddy Julian at Mossman. Rosie was recorded as age 57. She acquired the surname Julian, under which her death was registered in 1964.",
            ],
          ]}
        />
      </Section>

      {/* Deaths and Tragedies */}
      <Section title="Deaths and Tragedies">
        <Table
          headers={["Person", "Date", "Circumstances"]}
          rows={[
            [
              "George Brackenridge (patriarch)",
              "1939",
              "Died 1939. Death certificate names his parents as Maurice and Mary Brackenridge. His children had been raised partly at Yarrabah mission under the adopted surname 'Davis'. The surname change obscured the Brackenridge connection for decades.",
            ],
            [
              "Rosie Julian (mother)",
              "21 Aug 1964",
              "Death registration 1964/C/3548. Father listed as 'Mick'. This is the strongest candidate for the real Rosie's death record. She was also known as Rosie Hippie, Rosie Homalee, Rosie Honalze, and Rosie Rosie across decades of records.",
            ],
            [
              "Rosina / Rosie (if different from Rosie Julian)",
              "Before 1905",
              "The 1905 Protector report calls Julia and Nellie 'orphans', indicating their mother had died by then. However, if Rosie Julian (d. 1964) is the same woman, the 'orphan' designation may reflect administrative separation rather than actual death.",
            ],
            [
              "Caroline Muriel Davis",
              "20 Aug 1919",
              "Died aged 1 year 10 months. Infant daughter of George Edgar and Caroline.",
            ],
            [
              "Richard Patrik Davis",
              "29 May 1950",
              "Child of Charles Joseph Davis and Dorothy Molly Noble.",
            ],
            [
              "Dorothy Molly Noble Davis",
              "6 Sep 1950",
              "Died aged 32. Wife of Charles Joseph Davis. Buried at Cairns Cemetery.",
            ],
            [
              "Gladys Dorothy O'Shane",
              "29 Dec 1965",
              "Died aged 46. Mother of Pat O'Shane. Survived by husband, two daughters, and three sons.",
            ],
          ]}
        />
      </Section>

      {/* The Brackenridge-Davis Identity */}
      <Section title="The Brackenridge-Davis Identity: Solved">
        <p className="text-ink/80 text-sm leading-relaxed mb-4">
          The central question of whether George Davis and George Brackenridge
          were the same family has been resolved. Edgar&apos;s 1906 birth
          registration (1906/O/924) lists him as the child of George
          Brackenridge and Rosie. Edgar used both surnames throughout his life:
          &quot;Edgar Davis&quot; for his 1909 marriage at St John&apos;s Church,
          Cairns, and &quot;Edgar Braikenridge&quot; on Harold Douglas&apos;s
          1921 birth registration. The &quot;Davis&quot; surname was adopted at
          Yarrabah mission, likely by officials or Edgar himself, and became the
          family&apos;s primary identity. George Brackenridge&apos;s 1939 death
          certificate names his parents as Maurice and Mary Brackenridge. His
          brother John Brackenridge arrived from Ayrshire, Scotland in 1885 on
          the Gulf of Carpentaria.
        </p>
        <Table
          headers={["Person", "Dates", "Connection"]}
          rows={[
            [
              "George Brackenridge (patriarch)",
              "Active 1890s-1939",
              "Father of Edgar (birth reg. 1906/O/924), Frederick (baptised 1899, Mossman), Arthur, Joseph, and others. His wife was Rosie. Parents: Maurice and Mary Brackenridge. His children at Yarrabah adopted the surname 'Davis'.",
            ],
            [
              "John Brackenridge (likely brother)",
              "Arrived 1885",
              "Arrived from Ayrshire, Scotland on the Gulf of Carpentaria. Occupation: Fitter. Mrs J. Brackenridge was at Mossman in 1939.",
            ],
            [
              "Arthur Braikenridge",
              "1900-1973",
              "Born Mossman. Parents listed as George Braikenridge and Rose Braikenridge (FindAGrave). Exemption at Mossman 1915. Later lived at Ingham with wife Florence and 8 children.",
            ],
            [
              "Joseph Braikenridge",
              "1892-1961",
              "Born Cooktown. Parents listed as George Braikenridge and Rose (FindAGrave). Buried Cairns Cemetery.",
            ],
            [
              "Fred Braikenridge",
              "b. 1894",
              "Listed on the 1915 Port Douglas war census alongside 'Rosie Honalle' and an unnamed 'George'. Later at Ingham with wife Ivy.",
            ],
            [
              "George Bracken (boxer)",
              "b. 1934, Palm Island",
              "Real name George Joseph Braikenridge. Son of Arthur and Florence. Became a noted Aboriginal boxing champion in Queensland.",
            ],
            [
              "David Molloy",
              "Active 1910s-1920s",
              "Brother-in-law of Edgar and Fred Braikenridge. A 1920 Cairns Post article places all three on a shooting trip together from Mossman. This Molloy connection may explain why Caroline Davis was also known as 'nee Molloy'.",
            ],
          ]}
        />
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-900 font-medium mb-1">
            Ruled Out: Croydon George Davis (d. 1893)
          </p>
          <p className="text-sm text-amber-800">
            Earlier research identified a George Davis who died at the Croydon
            goldfield on 10 Oct 1893 (reg. 1893/C/630) as a possible patriarch.
            This man was an unrelated Irish immigrant who arrived on the Scottish
            Lassie in 1883 and drowned delirious with measles in a mill dam.
            He was single, no one who knew him was present at his death, and his
            parents were recorded as &quot;not known&quot;. He has no documented
            connection to Rosie or the Brackenridge family.
          </p>
        </div>
      </Section>

      {/* The Rosie Identity Thread */}
      <Section title="The Rosie Identity Thread">
        <p className="text-ink/80 text-sm leading-relaxed mb-4">
          A woman named Rosie appears across decades of North Queensland records
          under shifting surnames. The strongest candidate for her death record
          is Rosie Julian (d. 21 Aug 1964, reg. 1964/C/3548), with father
          listed as &quot;Mick&quot;. She is &quot;Rosie Rosie&quot;, apical
          ancestor entry xxxv in the Eastern Kuku Yalanji native title schedule.
          Her Aboriginal parents remain unknown beyond the father name
          &quot;Mick&quot; from the 1964 death certificate.
        </p>
        <Table
          headers={["Name Form", "Year", "Source", "Details"]}
          rows={[
            [
              "Rosie Brackenridge",
              "1899",
              "Yarrabah baptisms",
              "Mother of Frederick, baptised at Mossman. Father: George Brackenridge.",
            ],
            [
              "Rosie (mother of Arthur)",
              "1901",
              "Northern Protector report",
              "'Legally married to a kanaka at Mossman'. Already had 3 children at Yarrabah.",
            ],
            [
              "Rosie Homalee / Honalze",
              "1905",
              "Chief Protector report",
              "Of Schuster Creek, Port Douglas. Late husband was a South Sea Islander. Had a son. Over 270 pounds in savings.",
            ],
            [
              "Rosie Rosie",
              "1912",
              "Yarrabah marriage record",
              "Named as mother of Julia Nunn on Julia's marriage to Victor Leftwich. Father: 'Davis'. Also listed as apical ancestor entry xxxv in the Eastern Kuku Yalanji native title schedule.",
            ],
            [
              "Rosie Honalle",
              "1915",
              "Port Douglas war census",
              "Listed alongside George (no surname), Nellie, Mary, Fred Braikenridge.",
            ],
            [
              "Rosie (deceased)",
              "1916",
              "Aboriginal deaths register",
              "Died Port Douglas Hospital, 17 Mar 1916. Her half-caste daughters removed to Yarrabah. May be a different Rosie.",
            ],
            [
              "Rosie Hippie / Homarlee Epi",
              "1942",
              "Indigence application",
              "Age ~73, born 'near Mossman', 'lived all my life in the district'. Brother Tommy Gray at Mona Mona. Widow of Willie Api (SSI).",
            ],
            [
              "Rosie Julian (nee Hippi)",
              "1949",
              "Exemption register",
              "Married Paddy Julian at Mossman, 13 May 1949. Age 57.",
            ],
            [
              "Rosie Julian",
              "1964",
              "Death registration 1964/C/3548",
              "Died 21 Aug 1964. Father listed as 'Mick'. Strongest candidate for the real Rosie's death record.",
            ],
          ]}
        />
        <p className="text-ink/60 text-xs mt-3 italic">
          Note: &quot;Homalee&quot; and &quot;Api&quot; are confirmed South Sea
          Islander surnames in the Queensland SSI government index, indicating
          Rosie acquired these names through her SSI husbands, not from her own
          Aboriginal identity. An earlier hypothesis that Rosie&apos;s parents
          were Henry Chainey and Hannah Waters has been ruled out: those were the
          parents of a different Rose Brackenridge, an English woman from London
          who married James Brackenridge and died at Toowoomba in 1957.
        </p>
      </Section>

      {/* Tindale and Genealogical Records */}
      <Section title="Tindale and Genealogical Records">
        <Table
          headers={["Person / Record", "Location", "Significance"]}
          rows={[
            [
              "Tommy Gray (Rosie's brother)",
              "Tindale genealogy sheet page 27, Mona Mona",
              "Tommy Gray appears on Tindale's genealogy sheet for Mona Mona. The sheet would contain his parents and kinship connections, which could reveal Rosie's Aboriginal parentage beyond the name 'Mick'. Accessible via SLQ Tindale Enquiry.",
            ],
            [
              "Kate Waters descent charts",
              "CYU#1 native title claim",
              "Kate Waters, expert genealogist for the CYU#1 claim, holds unpublished descent charts that may connect Rosie Rosie to her Aboriginal kin network. These charts are not publicly available but may be accessible through the native title process.",
            ],
            [
              "Edgar Brackenridge birth registration",
              "QLD BDM 1906/O/924",
              "Filed as child of George Brackenridge and Rosie. The key document proving the Brackenridge-Davis identity. The 'O' district code and 1906 date suggest it was a late registration filed while Edgar was at Yarrabah.",
            ],
          ]}
        />
      </Section>

      {/* DNA and Heritage */}
      <Section title="DNA and Heritage">
        <Table
          headers={["Finding", "Implication"]}
          rows={[
            [
              "No Filipino ancestry detected",
              "Rules out the 'H/C Phillipino' classification on the 1938 exemption certificate. The description was a bureaucratic misclassification.",
            ],
            [
              "Scottish ancestry indicated",
              "Consistent with George Brackenridge's family origin in Ayrshire, Scotland. His brother John arrived from Ayrshire on the Gulf of Carpentaria in 1885.",
            ],
            [
              "Melanesian ancestry confirmed",
              "Comes from elsewhere in the family tree, not through George Brackenridge. Likely through the Noble line (Jack Noble's parents Jacko Morris and Caril Martin from Fraser Island) or through Rosie's South Sea Islander connections.",
            ],
            [
              "Aboriginal ancestry confirmed",
              "Through Rosie (George Edgar's mother, Eastern Kuku Yalanji) and Caroline Rose (Kuku Yalanji / Western Yalanji).",
            ],
          ]}
        />
      </Section>

      {/* The Numbers */}
      <Section title="The Numbers">
        <div className="bg-white rounded-lg border border-accent/20 p-6">
          <ul className="space-y-2 text-sm text-ink/80">
            {[
              "75+ named individuals documented across the family tree",
              "5 generations traced from George Brackenridge to Thomas Alwyn Davis (born 1989)",
              "10 children of George Edgar Davis and Caroline Rose Brown/Molloy",
              "15+ children of Charles Joseph Davis and Dorothy Molly Noble",
              "8 children of Arthur Braikenridge and Florence at Ingham",
              "1 first Aboriginal magistrate in Australian history (Pat O'Shane)",
              "2 surnames for one family: Brackenridge (birth name) and Davis (mission name)",
              "4 surnames for one woman: Brown, Molloy, Roberts, Kitchay (Caroline Rose Davis)",
              "8+ aliases for Rosie across 50 years of records",
              "23 Ancestry public trees containing George Edgar Davis",
              "46 research files in the vault",
              "3 native title determinations touching this family",
              "2 separate Edgar Davis identities that must never be merged (Mossman vs Mona Mona)",
              "1 birth registration proving the connection: 1906/O/924, Edgar Brackenridge",
              "1 park: George Davis Park (Bubu Kinkari), Mossman",
              "1 Tindale sheet: page 27 (Mona Mona), containing Tommy Gray, Rosie's brother",
              "200 Kanakas cutting cane at Mossman by 1897",
              "0 headstones surviving for George Brackenridge",
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-accent/40 flex-shrink-0">--</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Biographical Sketches */}
      <Section title="Biographical Sketches">
        <Sketch
          name="George Brackenridge (d. 1939): The Real Patriarch"
          text="George Brackenridge was the patriarch of the family that later became known as the Davis family of Mossman. His parents were Maurice and Mary Brackenridge, as recorded on his 1939 death certificate. His brother John Brackenridge arrived in Queensland from Ayrshire, Scotland in 1885 on the Gulf of Carpentaria, occupation Fitter, establishing the family's Scottish origin. George was active on the Mossman and Port Douglas coast from the 1890s onward. He formed a relationship with Rosie, an Aboriginal woman of the Eastern Kuku Yalanji people, and they had multiple children: Edgar (birth registered 1906/O/924 as 'Edgar Brackenridge, child of George Brackenridge and Rosie'), Frederick (baptised 1899 at Mossman), Arthur (born 1900), Joseph (born 1892 at Cooktown), and others. Several of his children were taken to Yarrabah mission, where the surname 'Davis' was adopted, likely by mission officials. Edgar used both names throughout his life: 'Edgar Davis' for his 1909 marriage and 'Edgar Braikenridge' on Harold Douglas's 1921 birth registration. In 1909, George petitioned for the release of 'his two children (sons)' from Yarrabah. Mrs J. Brackenridge (likely John's wife) was recorded at Mossman in 1939. George died in 1939."
          confidence="Moderate Signal"
          sources="QLD BDM 1906/O/924 (Edgar's birth registration); George Brackenridge 1939 death cert (parents Maurice and Mary); QSA immigration records (John Brackenridge, Gulf of Carpentaria, 1885); FindAGrave (Arthur, Joseph); 1909 Yarrabah petition."
        />

        <Sketch
          name="George Edgar Davis (c. 1887-1977): The Anchor of the Line"
          text="George Edgar Davis was born around 1887, the son of George Brackenridge and Rosie (an Aboriginal woman of the Eastern Kuku Yalanji people). His birth was registered in 1906 (reg. 1906/O/924) under the name Edgar Brackenridge, listing his parents as George Brackenridge and Rosie. After his parents' children were taken into the mission system, Edgar was recorded at Yarrabah in 1904 as 'Edgar, H/C, 14 yrs'. It was at Yarrabah that the surname 'Davis' was adopted. He married Caroline Rose Brown (also known as Molloy, Roberts, and Kitchay) on 9 October 1909 at St John's Church, Cairns, using the name Edgar Davis and recorded as 22 years old. He and Caroline settled at Mossman, where Edgar worked as a labourer, and they had at least 10 children. Edgar continued to use both surnames: he signed as 'Edgar Braikenridge' on Harold Douglas's 1921 birth registration. His sons Charles Joseph and Edgar Leonard received exemption certificates at Mossman in 1938. Edgar married a second time, to Violet Hobbler, on 22 April 1951 after Caroline's death in 1975. He died on 10 March 1977 at Mossman. His death certificate names his father as George Davis and his mother as Rosina (no surname). George Davis Park in Mossman (also known by the Aboriginal name Bubu Kinkari) is likely named after him."
          confidence="Strong Signal"
          sources="QLD BDM 1906/O/924; QLD BDM 1977/C/384; CIFHS Yarrabah marriages; 1904 Protector report; 1938 Exemption Card Index; Harold Douglas 1921 birth registration; ADB Gladys O'Shane entry."
        />

        <Sketch
          name="Caroline Rose Davis (c. 1887-1975): Four Names, Two Worlds"
          text="Caroline Rose was born around 1887 at Mount Carbine, Queensland, at the precise boundary between Western Yalanji and Eastern Kuku Yalanji country. Her father was recorded simply as '- Brown' with no given name on her death certificate; her mother was Kitty (also known as Kitchay). Through the Brady v State of Queensland [2013] native title determination, her maternal grandfather was identified as Buiku Buiku, placing her firmly in the Western Yalanji kinship system. Caroline was known throughout her life by multiple surnames: Brown (from her father), Molloy (possibly through a Braikenridge marriage connection), Roberts (the surname of her father Brown Roberts), and Davis (from her husband Edgar). She married George Edgar Davis on 9 October 1909 at St John's Church, Cairns. They settled at Mossman, where she raised a large family. Her sixth child, Gladys Dorothy, would become the mother of Pat O'Shane. The Australian Dictionary of Biography identifies her as 'nee Brown', while the People Australia entry says 'nee Molloy'. Both are correct in that she carried both names. She died on 6 July 1975 at Mossman. Her death registration is 1975/C/4130."
          confidence="Strong Signal"
          sources="QLD BDM 1975/C/4130; Brady v State of Queensland [2013] FCA 958; ADB; People Australia."
        />

        <Sketch
          name="Pat O'Shane AM (b. 1941): From Mossman to the Bench"
          text="Patricia June O'Shane was born on 19 June 1941 in Mossman, Queensland, the daughter of Gladys Dorothy Davis and Patrick James O'Shane. She is of the Kuku Yalanji people through her mother's line, which traces back through Caroline Rose Davis to the Western Yalanji apical ancestor Kitty. Pat's father, an Irishman known as 'Tiger' O'Shane, fought back physically when taunted about his marriage to an Aboriginal woman. Pat grew up in Cairns, where her parents had moved for the children's education. She became the first Aboriginal person to be admitted to the NSW bar, was appointed head of the NSW Ministry of Aboriginal Affairs in 1981 (the first Aboriginal person to head a government ministry), and in 1986 became Australia's first Aboriginal magistrate, serving on the NSW Local Court for over 25 years. She married Mick Miller, an Aboriginal statesman, on 5 May 1962 at St Monica's Catholic Cathedral, Cairns, and had two daughters: Lydia Caroline Miller and Marilyn Rose Miller. She was also Chancellor of the University of New England. Susan Mitchell interviewed her for the book Tall Poppies (1984), which contains one of the most detailed published accounts of her family background."
          confidence="Strong Signal"
          sources="ADB; People Australia; Wikipedia; Susan Mitchell, Tall Poppies (1984)."
        />

        <Sketch
          name="Julia Leftwich, nee Nunn (d. 1986): The Key Witness"
          text="Julia was born around the Bloomfield area and came from the Wujal Wujal and Kuku Yalanji tribes. After her mother died, the Nunn family at Nunnville (near Rossville, on the Annan River) looked after her for about two years before police removed her from the Cooktown side and sent her to Yarrabah mission. The official 1905 Chief Protector report records her as 'Julia, H/C, 9 years, an orphan, Rossville, sent to Yarrabah'. She was baptised at Yarrabah on 27 May 1906 alongside 'Nellie H/C, about 9 years old'. Her brother Fred Leftwich later said Nellie Watkins was Julia's sister, and that their mother had kept moving around the Cooktown and Black Mountains area to avoid police before she died. Julia married Victor Leftwich at Yarrabah on 15 February 1912. Her marriage record is the single most important document in the research: it names her father as 'Davis' and her mother as 'Rosie Rosie'. She named one of her daughters Bessie Rosina, echoing the name 'Rosina' recorded on George Edgar Davis's death certificate for his mother. This naming pattern is the strongest circumstantial evidence that Julia and George Edgar Davis were siblings who shared a mother named Rosina. Julia's 1986 death entry records her parent as '- Nunn', showing the foster surname had fully replaced the biological one. Her grandson Cecil Copeland Leftwich (1949-2023) was buried at Mossman Cemetery, connecting both the Leftwich and Davis families to the same town."
          confidence="Moderate Signal (for the sibling hypothesis); Strong Signal (for the documented facts)"
          sources="CIFHS Yarrabah marriages; 1905 Chief Protector report (AIATSIS 63539); Reaching Back (1988); Geni Leftwich tree; Tindale Index."
        />

        <Sketch
          name="Rosie (c. 1869-1964): The Woman with Eight Names"
          text="Rosie was an Aboriginal woman of the Eastern Kuku Yalanji people, born near Mossman around 1869 (based on age estimates across records). She is listed as 'Rosie Rosie', apical ancestor entry xxxv in the Eastern Kuku Yalanji native title schedule. Her father's name was 'Mick', as recorded on her 1964 death certificate (reg. 1964/C/3548 as Rosie Julian). Her mother's identity remains unknown. She had children with George Brackenridge, including Edgar (b. c. 1887, birth reg. 1906/O/924), Frederick (baptised 1899), Arthur (b. 1900), and Joseph (b. 1892). She was also 'legally married to a kanaka at Mossman' by 1901, and was later the widow of Willie Api, a South Sea Islander. She acquired the surnames Homalee, Honalze, Hippie, and Api through her SSI connections. Her brother Tommy Gray appears on Tindale genealogy sheet page 27 (Mona Mona), which may hold her parents' names and kinship connections. In 1942, she applied for indigence aged about 73, stating she was born 'near Mossman' and had 'lived all my life in the district'. She married Paddy Julian at Mossman on 13 May 1949 and died on 21 August 1964 as Rosie Julian."
          confidence="Moderate Signal"
          sources="QLD BDM 1964/C/3548; Eastern Kuku Yalanji native title schedule (entry xxxv); 1901 Northern Protector report; 1905 Chief Protector report; 1942 indigence application; 1949 exemption register; Tindale genealogy sheets (SLQ)."
        />
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <h2 className="font-serif text-2xl font-bold text-ink mb-4 border-b-2 border-accent/30 pb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="text-left p-3 bg-sidebar-bg/10 border-b-2 border-accent/20 font-medium text-ink/70"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-accent/10 hover:bg-parchment/50"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`p-3 ${j === 0 ? "font-medium text-ink" : "text-ink/80"}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Sketch({
  name,
  text,
  confidence,
  sources,
}: {
  name: string;
  text: string;
  confidence: string;
  sources: string;
}) {
  return (
    <div className="mb-8 bg-white rounded-lg border border-accent/20 p-6">
      <h3 className="font-serif text-lg font-bold text-ink mb-1">{name}</h3>
      <div className="flex gap-2 mb-3">
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            confidence.includes("Strong")
              ? "bg-green-100 text-green-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {confidence}
        </span>
      </div>
      <p className="text-ink/80 text-sm leading-relaxed mb-3">{text}</p>
      <p className="text-ink/50 text-xs">
        <span className="font-medium">Sources:</span> {sources}
      </p>
    </div>
  );
}
