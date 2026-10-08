/* Anchor Associates — site data (projects, clients, services, testimonials) */

export const SITE_DATA = (function () {

  // ===== Image pool — local featured photos (public/featured/*.jpg) =====
  // 20 source files cycled across the named keys below. Swap individual
  // entries below to map specific photos to specific project slots.
  const IMG = {
    // architectural / building exteriors
    archA: '/featured/01.jpg',
    archB: '/featured/02.jpg',
    archC: '/featured/03.jpg',
    archD: '/featured/04.jpg',
    archE: '/featured/05.jpg',
    archF: '/featured/06.jpg',
    archG: '/featured/07.jpg',
    // construction sites
    constA: '/featured/08.jpg',
    constB: '/featured/09.jpg',
    constC: '/featured/10.jpg',
    constD: '/featured/11.jpg',
    constE: '/featured/12.jpg',
    // interiors
    intA: '/featured/13.jpg',
    intB: '/featured/14.jpg',
    intC: '/featured/15.jpg',
    intD: '/featured/16.jpg',
    intE: '/featured/17.jpg',
    // industrial / warehouse / agri
    indA: '/featured/18.jpg',
    indB: '/featured/19.jpg',
    indC: '/featured/20.jpg',
    // greenhouses / glass
    greenA: '/featured/01.jpg',
    greenB: '/featured/02.jpg',
    // residential
    resA: '/featured/03.jpg',
    resB: '/featured/04.jpg',
    resC: '/featured/05.jpg',
    // canopy / structure
    canA: '/featured/06.jpg',
    canB: '/featured/07.jpg',
    // theatre / studio
    studA: '/featured/08.jpg',
    studB: '/featured/09.jpg',
    // people / team
    teamA: '/featured/10.jpg',
    teamB: '/featured/11.jpg',
    teamC: '/featured/12.jpg',
    teamD: '/featured/13.jpg',
  };

  // ===== Categories =====
  const CATEGORIES = [
    { id: 'civil', name: 'Civil & MEP' },
    { id: 'prefab', name: 'Steel & Pre-Fab' },
    { id: 'reno', name: 'Interiors & Fit-Outs' },
    { id: 'soundproof', name: 'Soundproofing' },
    { id: 'studios', name: 'Studios & Set Design' },
    { id: 'tensile', name: 'Shades & Canopies' },
    { id: 'agri', name: 'Glass Houses & Research' },
    { id: 'preconstruction', name: 'Pre-Construction & Design' },
  ];

  // ===== Services =====
  const SERVICES = [
    {
      id: 'civil',
      number: '01',
      name: 'Civil & MEP Construction',
      tagline: 'Structure and services, under one contract.',
      description: 'Complete construction from ground up, combined with the mechanical, electrical, and plumbing systems that make every building function. We manage both under one contract, with no coordination gap between structure and services.',
      hero: IMG.constA,
      categoryId: 'civil',
      scope: [
        'Offices',
        'Laboratories',
        'Administration blocks',
        'Academic buildings',
        'Residential & commercial construction',
        'Boundary walls',
        'Roads & site works',
        'Electrical works',
        'Plumbing',
        'HVAC',
        'Firefighting systems',
        'Waterproofing',
        'CCTV & data networking',
      ],
    },
    {
      id: 'prefab',
      number: '02',
      name: 'Steel & Pre-Fabricated Structures',
      tagline: 'Built off-site, assembled on yours.',
      description: 'Fast, durable, and cost-effective — steel and prefab structures are built off-site and assembled on yours, cutting time without cutting corners. From large-span industrial sheds to fully insulated prefabricated office buildings, we fabricate and install across Pakistan.',
      hero: IMG.indA,
      categoryId: 'prefab',
      scope: [
        'Industrial & agricultural sheds',
        'Prefabricated offices & call centers',
        'Modular storage units',
        'Insulated panel roofing',
        'CGI roofing systems',
        'Steel frame structures',
      ],
    },
    {
      id: 'reno',
      number: '03',
      name: 'Interior Design & Fit-Outs',
      tagline: 'Bare shell to fully finished, under one roof.',
      description: 'We take a space from bare shell to fully finished — with design, materials, trades, and MEP all under one roof. Whether it is a corporate office, a bank branch, a university facilitation center, or a café, we deliver spaces that work as well as they look.',
      hero: IMG.intA,
      categoryId: 'reno',
      scope: [
        'Office interiors',
        'Café & restaurant fit-outs',
        'Glass partition systems',
        'False ceilings',
        'WPC & feature wall panelling',
        'Custom woodwork & joinery',
        'Flooring',
        'Renovation & remodeling',
        'Soundproofing',
      ],
    },
    {
      id: 'soundproof',
      number: '04',
      name: 'Soundproofing Solutions',
      tagline: 'Measurable noise reduction, engineered to last.',
      description: 'Effective soundproofing is an engineering problem, not just an interior finish. We assess, design, and install acoustic treatment for offices, studios, conference rooms, residential spaces, and specialist facilities — delivering measurable noise reduction that lasts.',
      hero: IMG.studB,
      categoryId: 'soundproof',
      scope: [
        'Acoustic wall & ceiling treatment',
        'Soundproof partition systems',
        'Studio & recording room acoustic builds',
        'Floor & door soundproofing',
        'Noise barrier installations',
        'Acoustic panels & absorption systems',
      ],
    },
    {
      id: 'studios',
      number: '05',
      name: 'Studios & Set Design',
      tagline: 'Performance-safe, visually precise, built for live production.',
      description: 'We design and construct fully engineered theatre sets, studio environments, and event installations — structures that are performance safe, visually precise, and built to the exact demands of live production. We work directly with directors, production designers, and event teams, translating creative briefs into built reality with the precision of a construction firm and the sensibility of a creative one.',
      hero: IMG.studA,
      categoryId: 'studios',
      scope: [
        'Theatre set design & construction',
        'Multi-storey stage structures with load-bearing engineering',
        'Custom props & period-accurate furniture',
        'Modular sets built for quick assembly & strike',
        'Film & TV studio builds',
        'Event & exhibition installations',
      ],
    },
    {
      id: 'tensile',
      number: '06',
      name: 'Parking Shades & Canopies',
      tagline: 'Engineered for wind, finished for the architecture.',
      description: 'A parking shade is one of the most visible structures on any campus, institution, or commercial property — and one of the most under-designed. We treat it differently. Every shade structure we build is engineered for wind load, site orientation, and long-term material performance, then finished to a standard that complements the architecture around it. Tensile membrane, fiber fabric, or structural steel — we specify the right system for the site, not the easiest one to install.',
      hero: IMG.canA,
      categoryId: 'tensile',
      scope: [
        'Tensile membrane parking shades',
        'Fiber fabric shade structures',
        'Steel & hybrid canopy systems',
        'Architectural walkway covers',
        'Entrance & drop-off canopies',
        'Large-span shade installations for universities, airports & government campuses',
      ],
    },
    {
      id: 'agri',
      number: '07',
      name: 'Glass Houses & Research Facilities',
      tagline: 'Research-grade construction, climate-controlled.',
      description: 'Precision-built growing and research environments for Pakistan\'s agricultural and scientific institutions. These are not standard construction projects — they require controlled climates, specialist materials, and an understanding of what happens inside them. We have built them and know what research-grade construction demands.',
      hero: IMG.greenA,
      categoryId: 'agri',
      scope: [
        'Intelligent glasshouses with smart ventilation & climate control',
        'Polycarbonate panel greenhouses',
        'Poly tunnel structures',
        'Maize & crop isolation facilities',
        'Cold storage construction',
        'Agricultural research infrastructure',
      ],
    },
    {
      id: 'preconstruction',
      number: '08',
      name: 'Pre-Construction & Design Services',
      tagline: 'Clarity, documentation, and groundwork — before the first pour.',
      description: 'Every successful project is won or lost before construction begins. Our pre-construction services give clients the clarity, documentation, and technical groundwork needed to move into execution with confidence — whether you are tendering a government project, planning a private development, or scoping a specialist facility. We handle the full pre-construction process from initial concept through to construction-ready documentation.',
      hero: IMG.archD,
      categoryId: 'preconstruction',
      scope: [
        'Architectural design',
        'Structural design',
        'Interior space planning',
        '3D visualization & renderings',
        'BOQ preparation & cost estimation',
        'Feasibility studies',
        'Site analysis',
        'Material specification',
        'Project scheduling',
        'Tender documentation',
        'Authority approval drawings',
      ],
    },
  ];

  // ===== Clients =====
  const CLIENTS = [
    { id: 'parc',       name: 'PARC',               fullName: 'Pakistan Agricultural Research Council',                         sector: 'Government', since: 2015, projects: 8 },
    { id: 'narc',       name: 'NARC',               fullName: 'National Agricultural Research Centre',                          sector: 'Government', since: 2016, projects: 6 },
    { id: 'cimmyt',     name: 'CIMMYT',             fullName: 'International Maize and Wheat Improvement Center',               sector: 'Government', since: 2017, projects: 2 },
    { id: 'usc',        name: 'USC',                fullName: 'Utility Stores Corporation',                                     sector: 'Government', since: 2018, projects: 2 },
    { id: 'statelife',  name: 'State Life',          fullName: 'State Life Insurance Corporation',                               sector: 'Government', since: 2020, projects: 2 },
    { id: 'ntc',        name: 'NTC',                fullName: 'National Telecommunication Corporation',                         sector: 'Government', since: 2016, projects: 3 },
    { id: 'ptcl',       name: 'PTCL',               fullName: 'Pakistan Telecommunication Company',                             sector: 'Retainer',   since: 2014, projects: 11 },
    { id: 'nrtc',       name: 'NRTC',               fullName: 'National Radio & Telecommunication Corporation',                 sector: 'Government', since: 2019, projects: 2 },
    { id: 'ufone',      name: 'Ufone',              fullName: 'Ufone',                                                          sector: 'Retainer',   since: 2015, projects: 7 },
    { id: 'pmdc',       name: 'PMDC',               fullName: 'Pakistan Mineral Development Corporation',                       sector: 'Government', since: 2018, projects: 3 },
    { id: 'boee',       name: 'BoEE',               fullName: 'Bureau of Emigration & Overseas Employment',                     sector: 'Government', since: 2020, projects: 1 },
    { id: 'febgif',     name: 'FEB & GIF',          fullName: 'Federal Employees Benevolent and Group Insurance Fund',          sector: 'Government', since: 2021, projects: 1 },
    { id: 'mofa',       name: 'MOFA',               fullName: 'Ministry of Foreign Affairs',                                    sector: 'Government', since: 2019, projects: 2 },
    { id: 'cda',        name: 'CDA',                fullName: 'Capital Development Authority',                                  sector: 'Government', since: 2021, projects: 2 },
    { id: 'pitad',      name: 'PITAD',              fullName: 'Pakistan Institute of Trade & Development',                      sector: 'Government', since: 2020, projects: 1 },
    { id: 'nibaf',      name: 'NIBAF',              fullName: 'National Institute of Banking & Finance',                        sector: 'Government', since: 2022, projects: 1 },
    { id: 'paa',        name: 'PAA',                fullName: 'Pakistan Airports Authority',                                    sector: 'Government', since: 2021, projects: 2 },
    { id: 'wapda',      name: 'WAPDA',              fullName: 'Water and Power Development Authority',                          sector: 'Government', since: 2018, projects: 3 },
    { id: 'allied',     name: 'Allied Bank',         fullName: 'Allied Bank Limited',                                            sector: 'Retainer',   since: 2017, projects: 4 },
    { id: 'sbp',        name: 'State Bank',          fullName: 'State Bank of Pakistan',                                         sector: 'Government', since: 2020, projects: 1 },
    { id: 'ztbl',       name: 'ZTBL',               fullName: 'Zarai Taraqiati Bank Limited',                                   sector: 'Government', since: 2017, projects: 2 },
    { id: 'pmdcm',      name: 'PMDC (Medical)',      fullName: 'Pakistan Medical & Dental Council',                              sector: 'Government', since: 2021, projects: 1 },
    { id: 'eikon7',     name: 'Eikon 7',             fullName: 'Eikon 7',                                                        sector: 'Private',    since: 2023, projects: 1 },
    { id: 'fourthwall', name: 'Fourth Wall Studios',  fullName: 'Fourth Wall Studios',                                           sector: 'Private',    since: 2022, projects: 3 },
    { id: 'kingdom',    name: 'Kingdom Valley',       fullName: 'Kingdom Valley Islamabad',                                      sector: 'Private',    since: 2022, projects: 5 },
    { id: 'parkview',   name: 'Park View City',       fullName: 'Park View City',                                                sector: 'Private',    since: 2021, projects: 3 },
    { id: 'hec',        name: 'HEC',                fullName: 'Higher Education Commission',                                    sector: 'Government', since: 2018, projects: 2 },
    { id: 'nust',       name: 'NUST',               fullName: 'National University of Sciences & Technology',                   sector: 'Government', since: 2017, projects: 3 },
    { id: 'cui',        name: 'CUI',                fullName: 'COMSATS University Islamabad',                                   sector: 'Government', since: 2019, projects: 5 },
    { id: 'iiui',       name: 'IIUI',               fullName: 'International Islamic University Islamabad',                     sector: 'Government', since: 2017, projects: 2 },
    { id: 'numl',       name: 'NUML',               fullName: 'National University of Modern Languages',                        sector: 'Government', since: 2020, projects: 2 },
    { id: 'bahria',     name: 'Bahria',             fullName: 'Bahria University',                                              sector: 'Government', since: 2019, projects: 2 },
    { id: 'aiou',       name: 'AIOU',               fullName: 'Allama Iqbal Open University',                                   sector: 'Government', since: 2018, projects: 4 },
    { id: 'vu',         name: 'Virtual University',  fullName: 'Virtual University of Pakistan',                                 sector: 'Government', since: 2018, projects: 3 },
    { id: 'saudipak',   name: 'Saudi Pak',           fullName: 'Saudi Pak Industrial & Agricultural Investment Company Ltd.',   sector: 'Government', since: 2019, projects: 2 },
    { id: 'wahnobel',   name: 'Wah Nobel',           fullName: 'Wah Nobel Group',                                               sector: 'Private',    since: 2018, projects: 2 },
    { id: 'nigab',      name: 'NIGAB',              fullName: 'National Institute for Genomics and Advanced Biotechnology',    sector: 'Government', since: 2023, projects: 1 },
    { id: 'alkaram',    name: 'Al Karam University', fullName: 'Al Karam University',                                           sector: 'Private',    since: 2024, projects: 1 },
    { id: 'csi',        name: 'CSI',                fullName: 'Crop Sciences Institute, NARC',                                 sector: 'Government', since: 2024, projects: 1 },
  ];

  // ===== Key differentiators =====
  const DIFFERENTIATORS = [
    { k: '01', t: 'Category C-2 Registered',     d: 'PEC Category C-2 registration — credibility verified, eligible for major federal and provincial tenders across Pakistan.' },
    { k: '02', t: 'Trusted by Government',        d: 'A roster built around Pakistan\'s federal ministries, research councils, universities and state-owned corporations.' },
    { k: '03', t: 'Full Turnkey Capability',      d: 'Civil works, structural construction, MEP, interiors and finishing — managed under one contract, no coordination gap.' },
    { k: '04', t: 'Agricultural Research Expertise', d: 'Glass houses, tunnel cultivation, photoperiod chambers and controlled environments built for research-grade demands.' },
    { k: '05', t: 'Studios & Soundproofing',      d: 'A rare specialty: theatre sets, acoustic studios and engineered noise reduction — built to performance and broadcast specs.' },
    { k: '06', t: 'Active Nationwide',            d: 'Headquartered in Islamabad, with active project sites across Sindh, Punjab, and the wider country.' },
    { k: '07', t: 'Design + Build Approach',      d: 'Not just contractors — pre-construction design, BOQs, approval drawings and execution, in one delivery team.' },
  ];

  // ===== Projects =====
  const PROJECTS = [
    { id: 'azri', name: 'PARC AZRI Office & Laboratory', clientId: 'parc', categoryId: 'civil', location: 'Umerkot, Sindh', year: 2024, area: '38,000 sqft', scope: 'Turnkey · Civil · MEP · Finishing', hero: IMG.archA, gallery: [IMG.constA, IMG.archB, IMG.intA], tagline: 'A working monolith for arid-zone research.', body: 'Delivered as a complete turnkey solution — civil works, MEP systems, interior finishing and external development. Procurement, quality control, safety management and final commissioning sat under one contract. The result is a fully functional modern office and laboratory facility purpose-built for PARC\'s research activities in Arid-Zone Agriculture.' },
    { id: 'cold', name: 'NIGAB Cold Storage', clientId: 'narc', categoryId: 'civil', location: 'NARC, Islamabad', year: 2023, area: '8,500 sqft', scope: 'Turnkey · RCC · Insulation · Cold storage', hero: IMG.indA, gallery: [IMG.indB, IMG.indC, IMG.constB], tagline: 'A controlled environment, anchored in concrete.', body: 'A dedicated cold-storage facility built using a reinforced RCC frame combined with insulated sandwich panels. The controlled environment supports research materials and agricultural samples. Anchor managed structural development through the installation of insulation systems and final external finishing.' },
    { id: 'dme',  name: 'Mechanical Engineering Lab — DME, E&ME', clientId: 'nust', categoryId: 'civil', location: 'Rawalpindi', year: 2023, area: '12,000 sqft', scope: 'Civil · Finishing', hero: IMG.archB, gallery: [IMG.archC, IMG.intB, IMG.constC], tagline: 'A new lab for the Department of Mechanical Engineering.', body: 'Complete construction and finishing of a laboratory building for the College of Electrical & Mechanical Engineering. The structure complements existing campus architecture while introducing a clean, modern aesthetic.' },
    { id: 'alkaram', name: 'Alkaram University Administration Block', clientId: 'parc', categoryId: 'civil', location: 'Islamabad', year: 2024, area: '46,000 sqft', scope: 'Grey structure · Dome · Twin wings', hero: IMG.archC, gallery: [IMG.archD, IMG.archE, IMG.constD], tagline: 'A central dome, two symmetrical wings.', body: 'The complete grey-structure works of the Administration Block at Alkaram University Islamabad — from ground-breaking to final structural completion. The building features a strong, distinctive architectural form, anchored by a central dome and two symmetrical wings.' },
    { id: 'callctr', name: 'AIOU Prefab Call Center', clientId: 'aiou', categoryId: 'prefab', location: 'Islamabad', year: 2023, area: '6,200 sqft', scope: 'Prefab · Soundproofed cabins', hero: IMG.indC, gallery: [IMG.intC, IMG.indA, IMG.archG], tagline: 'A communications hub, raised in weeks.', body: 'A dedicated communication hub for Allama Iqbal Open University — high-performance insulated prefab panels, branded entrance, and acoustically enhanced cabins giving call agents a controlled, noise-free space.' },
    { id: 'sfc',  name: 'AIOU Student Facilitation Centre', clientId: 'aiou', categoryId: 'prefab', location: 'Islamabad', year: 2023, area: '4,800 sqft', scope: 'Prefab · Service interior', hero: IMG.intB, gallery: [IMG.intC, IMG.intD, IMG.indB], tagline: 'Approachable, student-centric, fast-deployed.', body: 'A long structured counter system, digital numbering displays, and ample space to accommodate large groups during peak hours. Clear circulation paths and well-planned seating arrangements ensure smooth movement and efficient service delivery.' },
    { id: 'photoperiod', name: 'PARC Photoperiod Chambers HVAC', clientId: 'parc', categoryId: 'agri', location: 'Makli, Thatta', year: 2023, area: '3,200 sqft', scope: 'HVAC · Insulation · Light control', hero: IMG.greenA, gallery: [IMG.greenB, IMG.indC, IMG.archG], tagline: 'Old polycarbonate, new precision.', body: 'Conversion of old transparent polycarbonate chambers into state-of-the-art insulated and air-tight photoperiod facilities at PARC NSTHRI. High-grade thermal and light insulation, full HVAC system, and a stable, energy-efficient environment for crop and horticulture experimentation.' },
    { id: 'maize', name: 'Maize Isolation Glass House', clientId: 'narc', categoryId: 'agri', location: 'CSI, NARC Islamabad', year: 2024, area: '2,400 sqft', scope: 'Foundations · Steel · Glazing', hero: IMG.greenB, gallery: [IMG.greenA, IMG.archA, IMG.indA], tagline: 'A transparent envelope for isolated maize trials.', body: 'Raised concrete foundations, a fabricated steel skeleton supporting the lightweight glazing system, and integration of cooling pads, airflow louvers and structural bracing — a fully climate-managed space for maize isolation research.' },
    { id: 'intelligent', name: 'Intelligent Glass House', clientId: 'narc', categoryId: 'agri', location: 'NARC Islamabad', year: 2024, area: '5,400 sqft', scope: 'Smart ventilation · Climate balancing', hero: IMG.archG, gallery: [IMG.greenA, IMG.greenB, IMG.intD], tagline: 'A new standard in agricultural innovation.', body: 'A refined steel and glass architecture combined with smart ventilation and climate-balancing systems. The facility supports advanced crop studies, experimental trials and long-term research programs.' },
    { id: 'tunnels', name: 'Multi-Tunnel Agricultural Zone', clientId: 'parc', categoryId: 'agri', location: 'Islamabad', year: 2023, area: '1.2 acres', scope: 'Tunnels · Hydroponics · Site works', hero: IMG.indB, gallery: [IMG.greenA, IMG.greenB, IMG.constE], tagline: 'Eight tunnels, full site works, modular hydroponics.', body: 'Eight well-structured growing tunnels supported by neatly executed civil works — tuff tile paving, secure boundary fence, raised tunnel foundations, organized access pathways. Modular vertical grow towers and integrated nutrient reservoirs designed for high-yield, water-efficient cultivation.' },
    { id: 'kingdom', name: 'Kingdom Valley Residential Villas', clientId: 'kingdom', categoryId: 'civil', location: 'Kingdom Valley Islamabad', year: 2024, area: '12 villas', scope: 'Civil · Masonry · External finishes', hero: IMG.resA, gallery: [IMG.resB, IMG.resC, IMG.archF], tagline: 'A community of villas, built to spec.', body: 'Complete construction of multiple residential villas — civil works, structural execution, masonry, plastering and external finishes. Strong focus on workmanship, material quality and timely delivery, with consistent standards across the development.' },
    { id: 'statelife', name: 'State Life Office Renovation', clientId: 'statelife', categoryId: 'reno', location: 'Building No 9, Islamabad', year: 2023, area: '14,000 sqft', scope: 'Demolition · Partitions · Fit-out', hero: IMG.intA, gallery: [IMG.intB, IMG.intC, IMG.intE], tagline: 'A complete corporate transformation.', body: 'Full demolition and rebuild of the State Life Health & Accident Insurance Office — polished glass partitions, premium marble-finish flooring, suspended ceilings and a clean, organized layout aligned with State Life\'s professional identity.' },
    { id: 'pmdc-wash', name: 'PMDC Premium Washroom', clientId: 'pmdc', categoryId: 'reno', location: 'PMDC H-9, Islamabad', year: 2024, area: '480 sqft', scope: 'Tiling · Sanitary · Lighting', hero: IMG.intC, gallery: [IMG.intD, IMG.intE, IMG.archA], tagline: 'A washroom that looks like a hotel.', body: 'Modern, premium-grade facility — sleek tiling, updated sanitary fixtures, concealed plumbing, and a contemporary floating vanity with LED-backlit mirror.' },
    { id: 'chajees', name: 'Chai Jee\'s Café', clientId: 'chajees', categoryId: 'reno', location: 'Islamabad', year: 2024, area: '2,800 sqft', scope: 'Concept · Interior · MEP · Joinery', hero: IMG.intC, gallery: [IMG.intD, IMG.intE, IMG.intB], tagline: 'A café crafted end-to-end.', body: 'A complete end-to-end transformation — rich wooden textures, ambient ceiling lighting, a streamlined service counter, and bold feature walls. Ergonomic kitchen layout, durable finishes and efficient MEP works support high-volume café operations.' },
    { id: 'vu-studio', name: 'Virtual University Recording Studio', clientId: 'parc', categoryId: 'studios', location: 'Islamabad', year: 2023, area: '900 sqft', scope: 'Acoustic · Lighting · Cyclorama', hero: IMG.studA, gallery: [IMG.studB, IMG.intD, IMG.archA], tagline: 'A controlled, echo-free environment.', body: 'A fully soundproof production studio designed for professional recording, broadcasting and digital content creation. Acoustic wall treatments, isolated construction, controlled lighting, and a seamless green-screen cyclorama.' },
    { id: 'pmdc-board', name: 'PMDC Soundproof Board Room', clientId: 'pmdc', categoryId: 'studios', location: 'PMDC HQ, Islamabad', year: 2024, area: '600 sqft', scope: 'Acoustic · Ceiling · Flooring', hero: IMG.intB, gallery: [IMG.intC, IMG.studB, IMG.archG], tagline: 'A sound-controlled executive room.', body: 'Acoustic panel installation, flooring, ceiling work and high-end conference furniture — every detail engineered to support focused discussions in a disturbance-free environment.' },
    { id: 'irith', name: 'Set Design — It Runs in the Family', clientId: 'fourthwall', categoryId: 'studios', location: 'Islamabad Club', year: 2023, area: 'Stage', scope: 'Modular set · Backdrops · Props', hero: IMG.studB, gallery: [IMG.studA, IMG.intE, IMG.archB], tagline: 'A custom-built, fully moveable site set.', body: 'Custom-built, fully moveable site-assembled stage set combining artistic design with engineering precision. Three successful shows at Islamabad Club.' },
    { id: 'tpgw', name: 'Set Design — The Play That Goes Wrong', clientId: 'fourthwall', categoryId: 'studios', location: 'Islamabad Club', year: 2024, area: 'Stage', scope: 'Modular set · Special effects · Multi-level', hero: IMG.studA, gallery: [IMG.studB, IMG.archA, IMG.intB], tagline: 'Controlled chaos on cue.', body: 'Breakaway walls, collapsing props, a safe collapsing-stair feature and a functional small first floor. Precision off-site fabrication, on-site assembly, and thematic detailing.' },
    { id: 'lk', name: 'Set Design — The Ladykillers', clientId: 'fourthwall', categoryId: 'studios', location: 'Islamabad Club', year: 2024, area: 'Stage', scope: 'Two-storey set · Custom furniture · Staircase', hero: IMG.studB, gallery: [IMG.studA, IMG.intD, IMG.archD], tagline: 'A two-storey environment for fast-paced storytelling.', body: 'Functional upper floor, detailed interior decor, custom-built furniture and a carefully engineered staircase — a high-impact set delivered safe, durable, and visually rich.' },
    { id: 'miap', name: 'MIAP Multan Entry Canopy', clientId: 'parc', categoryId: 'tensile', location: 'Multan', year: 2023, area: '1,200 sqft', scope: 'Steel · Roofing · Site planning', hero: IMG.canA, gallery: [IMG.canB, IMG.archA, IMG.indC], tagline: 'A clean, modern entrance experience.', body: 'A robust steel structure, precision roofing installation and enhanced site planning — reliable coverage for incoming traffic and a significant aesthetic upgrade.' },
    { id: 'cui-shades', name: 'CUI Wah Tensile & Fiber Sheds', clientId: 'cui', categoryId: 'tensile', location: 'CUI Wah Campus', year: 2023, area: 'Multiple', scope: 'Tensile · Walkways · Café shed', hero: IMG.canB, gallery: [IMG.canA, IMG.archG, IMG.intD], tagline: 'A series of beautifully shaded spaces.', body: 'Custom fiber sheds, tensile structures and window shades across multiple locations — walkway coverings, staircase shelters, large-span tensile canopies and a complete café shed.' },
    { id: 'numl-tensile', name: 'NUML Tensile Parking & Canopies', clientId: 'numl', categoryId: 'tensile', location: 'NUML Islamabad', year: 2024, area: '14,000 sqft', scope: 'Steel · Tensile membrane', hero: IMG.canA, gallery: [IMG.canB, IMG.archE, IMG.archF], tagline: 'Engineered steel structures with high-performance membranes.', body: 'Tensile parking sheds and architectural canopies throughout NUML University — beautifully constructed shaded spaces that elevate comfort, usability and the overall campus environment.' },
    { id: 'bf-shade', name: 'B.F Building Tensile Shade', clientId: 'statelife', categoryId: 'tensile', location: 'Islamabad', year: 2023, area: '6,000 sqft', scope: 'Steel · Tensile membrane', hero: IMG.canB, gallery: [IMG.canA, IMG.archD, IMG.archE], tagline: 'Premium tensile shade for the front car park.', body: 'A premium tensile fabric shade system for the main front car-parking area of the B.F Building — durable steel framework, high-performance tensile fabric, long-lasting protection against heat, UV exposure and rainfall.' },
    { id: 'f6-road', name: 'F-6 Road & Drainage Development', clientId: 'cda', categoryId: 'civil', location: 'F-6, Islamabad', year: 2024, area: '0.8 km', scope: 'Subgrade · Asphalt · Drainage', hero: IMG.constB, gallery: [IMG.constA, IMG.constE, IMG.archC], tagline: 'From sandy lot to functional infrastructure.', body: 'Comprehensive road and parking development — subgrade preparation, compaction, road layering, asphalt surfacing, integrated drainage works, underground drainage lines and surface channels.' },
    { id: 'comsats-park', name: 'COMSATS Wah Parking Development', clientId: 'cui', categoryId: 'civil', location: 'COMSATS Wah Campus', year: 2024, area: '32,000 sqft', scope: 'Drainage · Pavers · Access roads', hero: IMG.constE, gallery: [IMG.constB, IMG.canA, IMG.archG], tagline: 'A fully developed parking facility.', body: 'Complete transformation of an unpaved, sand-based area — proper ground preparation, an underground drainage network, durable paved access roads and parking lanes using high-quality interlocking pavers.' },
    { id: 'narc-fence', name: 'NARC Fence & Prefab Store', clientId: 'narc', categoryId: 'prefab', location: 'NARC Islamabad', year: 2023, area: '0.6 acre boundary', scope: 'Steel · Fencing · Prefab store', hero: IMG.indA, gallery: [IMG.indB, IMG.indC, IMG.constC], tagline: 'Boundary security plus weather-resistant storage.', body: 'Precision steel fabrication, RC foundation preparation, chain-link fencing installation, gate fixing and assembly of a fully insulated prefab storage unit designed for long-term use.' },
  ];

  // ===== Testimonials =====
  const TESTIMONIALS = [
    { quote: 'Anchor delivered our research facility ahead of schedule and to spec. Their attention to safety standards is what set them apart.', who: 'Project Director, PARC', clientId: 'parc' },
    { quote: 'A turnkey contractor in the truest sense. They handled the dome, the wings, the finish — we just watched it rise.', who: 'Vice Chancellor, Alkaram University', clientId: 'parc' },
    { quote: 'Three plays, three different sets — every single one assembled flawlessly. A genuine theatre-construction partner.', who: 'Director, Fourth Wall Studios', clientId: 'fourthwall' },
    { quote: 'The intelligent glass house lets us control more variables than ever. NARC\'s research capacity has stepped up.', who: 'Head of Crop Research, NARC', clientId: 'narc' },
  ];

  // ===== Helpers =====
  const byId = (arr, id) => arr.find(x => x.id === id);
  const projectsByCategory = (catId) => PROJECTS.filter(p => p.categoryId === catId);
  const projectsByClient = (clientId) => PROJECTS.filter(p => p.clientId === clientId);

  return {
    IMG, CATEGORIES, SERVICES, CLIENTS, PROJECTS, TESTIMONIALS, DIFFERENTIATORS,
    byId, projectsByCategory, projectsByClient,
  };
})();
