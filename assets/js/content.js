/* ---------------------------------------------------------------------------
   content.js — the single source of truth for every string on the site.

   This is a plain script assigning to a global, not JSON, so the page works
   when opened directly from disk (file:// blocks fetch of local files).

   Structure:
     SITE.data     locale-independent fields (URLs, image paths, dimensions),
                   keyed by slug and merged into the localised entries at render
                   time so a URL is never duplicated across three translations.
     SITE.content  three parallel trees with IDENTICAL key structure, so a
                   missing translation shows up immediately in a diff.
--------------------------------------------------------------------------- */

window.SITE = window.SITE || {};

SITE.LOCALES = ['en', 'zh-Hant', 'zh-Hans'];
SITE.LOCALE_LABELS = { 'en': 'EN', 'zh-Hant': '繁', 'zh-Hans': '简' };
SITE.LOCALE_NAMES = { 'en': 'English', 'zh-Hant': '繁體中文', 'zh-Hans': '简体中文' };

/* -------------------------------------------------------------- locale-free */

SITE.data = {
  /* Project cards are deliberately text-only: the screenshots were plots and
     terminal output that read as noise at card size. img stays in the shape so
     a card can carry one later — the renderer omits the frame when it is null. */
  projects: {
    'wind-turbine':      { img: null, w: 640, h: 400, href: 'https://github.com/J71956/MSE456-ML-Project' },
    'unignn':            { img: null, w: 640, h: 400, href: 'https://github.com/J71956/UniGNN-Recreation' },
    'writing-style-rag': { img: null, w: 640, h: 400, href: 'https://github.com/J71956/WritingStyle' },
    'cantonese':         { img: null, w: 640, h: 400, href: 'https://github.com/J71956/Cantonese-Transcribe-Refinement' },
    'mnist':             { img: null, w: 640, h: 400, href: 'https://github.com/J71956/MNIST-Recreation' },
    'cvfs':              { img: null, w: 640, h: 400, href: 'https://github.com/J71956/CVFS-Project' },
    'cops-robbers':      { img: null, w: 640, h: 400, href: 'https://github.com/J71956/Comp1002MiniProject' },
    'py-minifier':       { img: null, w: 640, h: 400, href: 'https://github.com/J71956/Python-minify-obsfucator' },
    'ram-vram':          { img: null, w: 640, h: 400, href: 'https://github.com/J71956/RAM-VRAMTracker' }
  },

  /* Gallery is a fixed-height film strip, so widths vary by orientation.
     Intrinsic dimensions are recorded here to keep CLS at zero. */
  gallery: {
    'polyu-ta':           { img: 'assets/img/gallery/polyu-ta', w: 1333, h: 1000 },
    'hkust-ta':           { img: 'assets/img/gallery/hkust-ta', w: 1333, h: 1000 },
    'hkuspace-ta':        { img: 'assets/img/gallery/hkuspace-ta', w: 1333, h: 1000 },
    'tranxfer-barcelona': { img: 'assets/img/gallery/tranxfer-barcelona', w: 1333, h: 1000 },
    'cambridge-punting':  { img: 'assets/img/gallery/cambridge-punting', w: 1333, h: 1000 },
    'cambridge-formal':   { img: 'assets/img/gallery/cambridge-formal', w: 750, h: 1000 }
  },

  /* Phone number is deliberately absent: a public page is scraped
     continuously and a mobile number published here cannot be revoked. */
  contact: {
    email:    { href: 'mailto:shilohsiu0@gmail.com', value: 'shilohsiu0@gmail.com' },
    github:   { href: 'https://github.com/J71956', value: 'github.com/J71956' },
    linkedin: { href: 'https://www.linkedin.com/in/yau-shing-siu-368383225/', value: 'in/yau-shing-siu' }
  },

  /* Display order. Changing these arrays reorders the rendered sections. */
  order: {
    projects: ['wind-turbine', 'unignn', 'writing-style-rag', 'cantonese', 'mnist',
               'cvfs', 'cops-robbers', 'py-minifier', 'ram-vram'],
    /* Narrative arc: Hong Kong teaching -> Barcelona -> Cambridge */
    gallery:  ['polyu-ta', 'hkust-ta', 'hkuspace-ta', 'tranxfer-barcelona',
               'cambridge-punting', 'cambridge-formal'],
    contact:  ['email', 'github', 'linkedin']
  }
};

/* ------------------------------------------------------------------ english */

SITE.content = {};

SITE.content.en = {
  meta: {
    title: 'Siu Yau Shing — AI and Financial Technology',
    desc: 'Year 4 BSc (Hons) Financial Technology and Artificial Intelligence at PolyU. Recently a technical intern at Tranxfer in Barcelona, building LLM and RAG systems.'
  },
  brand: { name: 'Siu Yau Shing', short: 'SYS', alt: '蕭佑丞 · Shiloh' },
  nav: {
    home: 'Home', about: 'About', experience: 'Experience', projects: 'Projects',
    education: 'Education', exchange: 'Exchange', awards: 'Awards',
    gallery: 'Gallery', skills: 'Skills', contact: 'Contact'
  },
  hero: {
    eyebrow: 'Hong Kong · Waterloo · Barcelona',
    name: 'Siu Yau Shing',
    alt: '蕭佑丞 · Shiloh',
    lede: 'Year 4 BSc (Hons) Financial Technology and Artificial Intelligence at The Hong Kong Polytechnic University.',
    cta: 'View my work on GitHub',
    scroll: 'Scroll',
    portraitAlt: 'Portrait of Siu Yau Shing'
  },
  about: {
    numeral: '01',
    heading: 'About',
    lede: 'I am Siu Yau Shing — Shiloh — a Year 4 BSc (Hons) student in Financial Technology and Artificial Intelligence at The Hong Kong Polytechnic University, most recently building AI infrastructure at Tranxfer in Barcelona.',
    body: [
      'Most of my work has been about making AI systems hold up outside a notebook. At Tranxfer I built an asynchronous document-labelling microservice on Spring Boot and Vertex AI, where strict multi-tenant isolation and zero content retention were requirements rather than afterthoughts. At AI Lab I shipped RAG workflows and local model pipelines, and halved image and video generation time by profiling where the hardware was actually spending it.',
      'That practical streak runs alongside a research one. On exchange at the University of Waterloo I used historical SCADA data to model wind turbine degradation — anomaly detection that transfers cleanly to financial risk. I have reimplemented hypergraph neural networks from an IJCAI paper, and built a fully offline RAG pipeline that pairs stylometric analysis with dense retrieval so a local model can write in a specific voice.',
      'Beyond building, I am committed to demystifying AI. As a teaching assistant and STEM tutor I have taught over 100 learners — primary schoolers, university students, and corporate executives at HKU SPACE — computer vision, NLP and PyTorch, and just as importantly what these systems can and cannot do.'
    ],
    exploringLabel: 'Currently exploring',
    exploring: [
      'On-device AI and privacy-preserving LLMs',
      'Applications for inclusive human–AI interaction',
      'AI and technological literacy as a foundational modern skill'
    ]
  },
  experience: {
    numeral: '02',
    heading: 'Experience',
    earlierLabel: 'Earlier',
    items: [
      {
        slug: 'tranxfer', role: 'Technical Intern', org: 'Tranxfer',
        place: 'Barcelona', period: 'Jun – Aug 2026', year: '2026',
        points: ['Developed an async Gemini-powered document-labelling microservice using Spring Boot, Vertex AI and PostgreSQL, enforcing strict multi-tenant data isolation and zero document-content retention.']
      },
      {
        slug: 'feelingss', role: 'AI Technical Intern', org: 'Feelingss AI',
        place: 'Hong Kong', period: 'Sep – Dec 2025', year: '2025',
        points: ['Designed and implemented a bug reporting system inside an AI application with real-time database logging, and integrated several GenAI models into the system alongside the technical team.']
      },
      {
        slug: 'ailab', role: 'Research AI Engineer Intern', org: 'AI Lab Limited',
        place: 'Hong Kong', period: 'Aug 2024 · May – Aug 2025', year: '2024',
        points: [
          'Designed and deployed LLM-powered tools and RAG workflows for research; authored technical documentation and presented findings to the technology team for decision making.',
          'Engineered a local conversational chatbot pipeline using open-source LLMs with ASR and TTS.',
          'Optimised AI-driven image and video generation workflows on a local compute platform, achieving a 50% reduction in generation time while profiling RAM and VRAM utilisation.',
          'Built a financial analysis tool in Python and XlsxWriter that generated charted Excel reports of company data, deployed on Azure.'
        ]
      },
      {
        slug: 'ta', role: 'Teaching Assistant', org: 'PolyU · HKUST · HKU SPACE',
        place: 'Hong Kong', period: 'Jan – Apr 2025', year: '2025',
        points: [
          'Assisted Prof Alan Chow in teaching Introduction to Artificial Intelligence and Entrepreneurship to over 100 students across PolyU and HKUST, covering NLP and PyTorch.',
          'Demonstrated LLM and data-visualisation technology for the Executive Course for Corporate Globalization at HKU SPACE, on artificial intelligence and its business applications.'
        ]
      }
    ],
    earlier: [
      { slug: 'pigeon', role: 'Part-Time STEM Tutor', org: 'Pigeon City Creative Computer Training Centre', period: 'Jan 2024 – Mar 2025' },
      { slug: 'stem-lead', role: 'STEM Team Leader', org: 'Po Leung Kuk Choi Kai Yau School', period: '2021 – 2023' },
      { slug: 'cafe', role: 'Student Cafe Manager', org: 'Po Leung Kuk Choi Kai Yau School', period: '2017 – 2023' }
    ]
  },
  projects: {
    numeral: '03',
    heading: 'Projects',
    linkLabel: 'View project',
    moreLabel: 'More on GitHub',
    items: {
      'wind-turbine': {
        title: 'Wind Turbine Anomaly Detection',
        meta: 'University of Waterloo',
        blurb: 'Leveraged historical SCADA data to build predictive models for system degradation — a methodology that transfers directly to financial anomaly detection and risk modelling.',
        alt: null
      },
      'unignn': {
        title: 'Uni-GNN Recreation',
        meta: 'Python · PyTorch',
        blurb: 'A modification of the IJCAI 2021 paper “UniGNN: a Unified Framework for Graph and Hypergraph Neural Networks”, with customised models and a report consolidating our findings.',
        alt: 'Training-loss plots from the UniGNN reimplementation'
      },
      'writing-style-rag': {
        title: 'Personal Writing Style RAG Pipeline',
        meta: 'Python · Local LLMs',
        blurb: 'A fully offline, privacy-preserving RAG pipeline combining multi-dimensional stylometric analysis with dense vector retrieval to prompt local LLMs, generating text that mimics a specific writing voice.',
        alt: null
      },
      'cantonese': {
        title: 'Cantonese Transcription and Refinement',
        meta: 'Ollama · Transformers',
        blurb: 'An implementation of a Cantonese transcription and refinement workflow running on local models.',
        alt: 'Terminal output of the Cantonese transcription pipeline'
      },
      'mnist': {
        title: 'MNIST Classifier',
        meta: 'Python · PyTorch',
        blurb: 'A digit classifier using object detection to recognise handwritten numbers.',
        alt: 'Grid of MNIST digits with predicted labels'
      },
      'cvfs': {
        title: 'CVFS — Virtual File System',
        meta: 'Java · MVC',
        blurb: 'An in-memory virtual file system built in Java, using object-oriented design and the Model–View–Controller pattern to simulate a real file system.',
        alt: 'Command interface of the CVFS virtual file system'
      },
      'cops-robbers': {
        title: 'Cops and Robbers',
        meta: 'Python · Graphs',
        blurb: 'A pursuit game played over a graph data structure, written in Python and run from the command line.',
        alt: 'Command-line rendering of the Cops and Robbers game graph'
      },
      'py-minifier': {
        title: 'Python Minifier + Obfuscator',
        meta: 'Python · Selenium',
        blurb: 'Automatically minifies and obfuscates every Python file in a directory without breaking the code.',
        alt: 'Before and after view of obfuscated Python source'
      },
      'ram-vram': {
        title: 'RAM / VRAM Tracker',
        meta: 'Python',
        blurb: 'A small utility that samples RAM and VRAM usage over time and writes it to CSV for analysis.',
        alt: 'CSV output and usage graph from the RAM/VRAM tracker'
      }
    }
  },
  education: {
    numeral: '04',
    heading: 'Education',
    items: [
      {
        slug: 'polyu',
        award: 'BSc (Hons) Financial Technology and Artificial Intelligence',
        org: 'The Hong Kong Polytechnic University',
        period: 'Sep 2023 – Jul 2027',
        note: ''
      },
      {
        slug: 'plkcky',
        award: 'IB Diploma · IGCSE',
        org: 'Po Leung Kuk Choi Kai Yau School',
        period: '2021 – 2023',
        note: 'IB Diploma 35/45 (Jul 2023) · IGCSE 5A* and 6A (Aug 2021)'
      }
    ]
  },
  exchange: {
    numeral: '05',
    heading: 'Exchange and Study Abroad',
    items: [
      {
        slug: 'waterloo',
        award: 'Exchange Semester',
        org: 'University of Waterloo · Ontario, Canada',
        period: 'Winter 2026',
        note: 'Awarded the GEO Scholarship for Student Exchange. Coursework included the wind turbine SCADA anomaly-detection project.'
      },
      {
        slug: 'cambridge',
        award: 'Mathematics Summer Programme',
        org: 'University of Cambridge, Girton College · United Kingdom',
        period: 'Aug 2026',
        note: ''
      }
    ]
  },
  awards: {
    numeral: '06',
    heading: 'Awards and Certificates',
    items: [
      { slug: 'nvidia', title: 'Fundamentals of Deep Learning', org: 'NVIDIA Deep Learning Institute', year: '2024' },
      { slug: 'digital-economy', title: 'Silver Award', org: 'China Mainland, HK and Macao Digital Economy Innovation and Entrepreneurship Competition', year: '2025' },
      { slug: 'icaie', title: 'Merit Award — Stream 1, Higher Education', org: 'International Competition on AI in Education', year: '2025' },
      { slug: 'geo', title: 'GEO Scholarship for Student Exchange', org: 'The Hong Kong Polytechnic University', year: '2026' }
    ]
  },
  gallery: {
    numeral: '07',
    heading: 'In the Room',
    items: {
      'polyu-ta': {
        caption: 'With PolyU students on the Introduction to Artificial Intelligence and Entrepreneurship course, as an NVIDIA Deep Learning Institute teaching assistant.',
        alt: 'Group photo with PolyU students at the end of an AI and entrepreneurship class'
      },
      'hkust-ta': {
        caption: 'Teaching artificial intelligence concepts at HKUST on the same course.',
        alt: 'Presenting AI concepts to a lecture room of students at HKUST'
      },
      'hkuspace-ta': {
        caption: 'Demonstrating FinTech and AI for the Executive Course for Corporate Globalization at HKU SPACE.',
        alt: 'Demonstrating FinTech and AI technology to executives at HKU SPACE'
      },
      'tranxfer-barcelona': {
        caption: 'The Tranxfer team in the Barcelona office, at the end of the summer internship.',
        alt: 'The full Tranxfer team gathered around a long table in the Barcelona office'
      },
      'cambridge-punting': {
        caption: 'Punting on the Cam with coursemates from the Cambridge mathematics summer programme.',
        alt: 'Punting on the River Cam with coursemates on a bright summer afternoon'
      },
      'cambridge-formal': {
        caption: 'Formal hall at Girton College, Cambridge.',
        alt: 'Formal hall under the vaulted timber roof at Girton College, Cambridge'
      }
    }
  },
  skills: {
    numeral: '08',
    heading: 'Capabilities',
    groups: [
      { slug: 'prog', label: 'Programming',
        items: ['Python', 'PyTorch', 'TensorFlow', 'Java (Spring)', 'C++', 'TypeScript', 'JavaScript', 'SQL', 'R', 'Django', 'HTML', 'CSS'] },
      { slug: 'tools', label: 'Tools and Platforms',
        items: ['Git', 'Docker', 'Linux', 'Azure', 'Claude Code', 'MCP', 'Ollama', 'LM Studio', 'ComfyUI', 'SQLite', 'Power BI', 'Microsoft 365'] },
      { slug: 'spoken', label: 'Spoken',
        items: ['Cantonese (Native)', 'English (Native · IELTS 8)', 'Mandarin (Fluent)'] }
    ]
  },
  contact: {
    numeral: '09',
    heading: 'Get in touch',
    lede: 'Open to graduate roles, internships and collaboration in AI, financial technology, and anything at the boundary between the two.',
    location: 'Hong Kong',
    labels: { email: 'Email', github: 'GitHub', linkedin: 'LinkedIn' }
  },
  footer: { copy: '© 2026 Siu Yau Shing', built: 'Hand-built. No frameworks.' },
  a11y: {
    skip: 'Skip to content',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    langLabel: 'Language',
    prev: 'Previous image',
    next: 'Next image',
    galleryLabel: 'Photo gallery'
  }
};

/* ------------------------------------------------------- traditional chinese */

SITE.content['zh-Hant'] = {
  meta: {
    title: '蕭佑丞 — 人工智慧與金融科技',
    desc: '香港理工大學金融科技及人工智能（榮譽）理學士四年級。近期於巴塞隆納的 Tranxfer 擔任技術實習生，建構大型語言模型與 RAG 系統。'
  },
  brand: { name: '蕭佑丞', short: '蕭佑丞', alt: 'Siu Yau Shing · Shiloh' },
  nav: {
    home: '首頁', about: '關於我', experience: '工作經驗', projects: '項目',
    education: '學歷', exchange: '交換', awards: '獎項',
    gallery: '相簿', skills: '技能', contact: '聯絡'
  },
  hero: {
    eyebrow: '香港 · 滑鐵盧 · 巴塞隆納',
    name: '蕭佑丞',
    alt: 'Siu Yau Shing · Shiloh',
    lede: '香港理工大學金融科技及人工智能（榮譽）理學士四年級。',
    cta: '到 GitHub 看看我的作品',
    scroll: '向下捲動',
    portraitAlt: '蕭佑丞的照片'
  },
  about: {
    numeral: '01',
    heading: '關於我',
    lede: '我是蕭佑丞（Shiloh），香港理工大學金融科技及人工智能（榮譽）理學士四年級學生，最近於巴塞隆納的 Tranxfer 建構人工智慧基礎架構。',
    body: [
      '我的工作大多是讓人工智慧系統能在實驗環境以外站得住腳。在 Tranxfer，我以 Spring Boot 與 Vertex AI 建構非同步的文件標註微服務，嚴格的多租戶隔離與零內容保留是設計前提，而非事後補救。在人工智能研究所，我交付了 RAG 工作流程與本地模型管線，並透過分析硬體實際的耗時所在，將圖像與影片生成時間縮短一半。',
      '在務實之外，我也保有研究的一面。於滑鐵盧大學交換期間，我運用歷史 SCADA 資料建立風力發電機劣化模型——這種異常偵測方法可直接遷移至金融風險領域。我曾重新實作 IJCAI 論文中的超圖神經網路，也建構了完全離線的 RAG 管線，結合文體分析與稠密向量檢索，讓本地模型能以特定的寫作風格書寫。',
      '除了開發技術，我也致力於揭開人工智慧的神秘面紗。作為助教及 STEM 導師，我已向超過 100 名學習者授課——從小學生、大學生到香港大學專業進修學院的企業高階主管——內容涵蓋電腦視覺、自然語言處理與 PyTorch，同樣重要的是，讓他們理解這些系統能做什麼、又不能做什麼。'
    ],
    exploringLabel: '目前探索的方向',
    exploring: [
      '端側人工智慧與隱私保護型大型語言模型（LLM）',
      '包容性人機協作互動的應用',
      '人工智慧與科技素養作為現代社會的基礎能力'
    ]
  },
  experience: {
    numeral: '02',
    heading: '工作經驗',
    earlierLabel: '早期經歷',
    items: [
      {
        slug: 'tranxfer', role: '技術實習生', org: 'Tranxfer',
        place: '巴塞隆納', period: '2026年6月 – 8月', year: '2026',
        points: ['使用 Spring Boot、Vertex AI 與 PostgreSQL 開發非同步的 Gemini 文件標註微服務，實施嚴格的多租戶資料隔離，並確保不保留任何文件內容。']
      },
      {
        slug: 'feelingss', role: '人工智慧技術實習生', org: 'Feelingss AI',
        place: '香港', period: '2025年9月 – 12月', year: '2025',
        points: ['設計並實作人工智慧應用程式中結合即時資料庫日誌記錄的錯誤回報系統，並與技術團隊將多個 GenAI 模型整合至系統。']
      },
      {
        slug: 'ailab', role: '研究人工智慧工程師實習生', org: '人工智能研究所',
        place: '香港', period: '2024年8月 · 2025年5月 – 8月', year: '2024',
        points: [
          '設計並部署以大型語言模型驅動的工具及 RAG 工作流程，撰寫技術文件並向技術團隊簡報研究結果以支援決策。',
          '以開源大型語言模型結合語音辨識（ASR）與語音合成（TTS），建構本地對話機器人流程。',
          '在本地運算平台上優化人工智慧圖像與影片生成工作流程，將生成時間縮短 50%，並分析 RAM 與 VRAM 使用情況。',
          '以 Python 與 XlsxWriter 開發財務分析工具，產生帶圖表的 Excel 報告以檢視公司資料，並部署於 Azure。'
        ]
      },
      {
        slug: 'ta', role: '助教', org: '理大 · 科大 · 港大專業進修學院',
        place: '香港', period: '2025年1月 – 4月', year: '2025',
        points: [
          '協助周建新教授為香港理工大學及香港科技大學逾 100 名學生教授「人工智慧與創業入門」課程，內容涵蓋自然語言處理與 PyTorch。',
          '在香港大學專業進修學院「企業全球化高階主管課程」中，展示大型語言模型與資料視覺化技術，講授人工智慧及其商業應用。'
        ]
      }
    ],
    earlier: [
      { slug: 'pigeon', role: '兼職 STEM 導師', org: '博思創意電腦培訓中心', period: '2024年1月 – 2025年3月' },
      { slug: 'stem-lead', role: 'STEM 團隊領袖', org: '保良局蔡繼有學校', period: '2021 – 2023' },
      { slug: 'cafe', role: '學生咖啡廳經理', org: '保良局蔡繼有學校', period: '2017 – 2023' }
    ]
  },
  projects: {
    numeral: '03',
    heading: '項目',
    linkLabel: '查看項目',
    moreLabel: '在 GitHub 查看更多',
    items: {
      'wind-turbine': {
        title: '風力發電機異常偵測',
        meta: '滑鐵盧大學',
        blurb: '運用歷史 SCADA 資料建立系統劣化的預測模型，該方法可直接遷移至金融異常偵測與風險建模。',
        alt: null
      },
      'unignn': {
        title: 'Uni-GNN 重新實現',
        meta: 'Python · PyTorch',
        blurb: '改寫 IJCAI 2021 論文《UniGNN: a Unified Framework for Graph and Hypergraph Neural Networks》中的模型，並撰寫整合研究結果的報告。',
        alt: 'UniGNN 重新實現的訓練損失曲線圖'
      },
      'writing-style-rag': {
        title: '個人寫作風格 RAG 流程',
        meta: 'Python · 本地大型語言模型',
        blurb: '完全離線、保護隱私的 RAG 流程，結合多維度文體分析與稠密向量檢索來提示本地大型語言模型，生成模仿特定寫作風格的文字。',
        alt: null
      },
      'cantonese': {
        title: '廣東話轉錄與精煉',
        meta: 'Ollama · Transformers',
        blurb: '以本地模型實現的廣東話轉錄與文字精煉工作流程。',
        alt: '廣東話轉錄流程的終端機輸出畫面'
      },
      'mnist': {
        title: 'MNIST 分類器',
        meta: 'Python · PyTorch',
        blurb: '使用物件偵測辨識手寫數字的分類器。',
        alt: 'MNIST 手寫數字與預測標籤的網格圖'
      },
      'cvfs': {
        title: 'CVFS — 虛擬檔案系統',
        meta: 'Java · MVC',
        blurb: '以 Java 建構的記憶體內虛擬檔案系統，運用物件導向設計與模型–視圖–控制器（MVC）模式模擬真實檔案系統。',
        alt: 'CVFS 虛擬檔案系統的指令介面'
      },
      'cops-robbers': {
        title: '警察與強盜',
        meta: 'Python · 圖論',
        blurb: '以圖形資料結構進行的追捕遊戲，使用 Python 編寫並在命令列執行。',
        alt: '命令列中呈現的警察與強盜遊戲圖形'
      },
      'py-minifier': {
        title: 'Python 壓縮與混淆工具',
        meta: 'Python · Selenium',
        blurb: '自動壓縮並混淆目錄中所有 Python 檔案，同時確保程式碼仍可正常執行。',
        alt: 'Python 原始碼混淆前後的對照畫面'
      },
      'ram-vram': {
        title: 'RAM / VRAM 追蹤器',
        meta: 'Python',
        blurb: '持續取樣 RAM 與 VRAM 使用量並寫入 CSV，方便後續分析的小型工具。',
        alt: 'RAM/VRAM 追蹤器的 CSV 輸出與使用量圖表'
      }
    }
  },
  education: {
    numeral: '04',
    heading: '學歷',
    items: [
      {
        slug: 'polyu',
        award: '金融科技及人工智能（榮譽）理學士',
        org: '香港理工大學',
        period: '2023年9月 – 2027年7月',
        note: ''
      },
      {
        slug: 'plkcky',
        award: 'IB 文憑 · IGCSE',
        org: '保良局蔡繼有學校',
        period: '2021 – 2023',
        note: 'IB 文憑總分 35/45（2023年7月）· IGCSE 5A* 及 6A（2021年8月）'
      }
    ]
  },
  exchange: {
    numeral: '05',
    heading: '交換與海外學習',
    items: [
      {
        slug: 'waterloo',
        award: '交換學期',
        org: '滑鐵盧大學 · 加拿大安大略省',
        period: '2026年冬季學期',
        note: '獲頒 GEO 學生交換獎學金。修課期間完成風力發電機 SCADA 異常偵測項目。'
      },
      {
        slug: 'cambridge',
        award: '數學暑期課程',
        org: '劍橋大學格頓學院 · 英國',
        period: '2026年8月',
        note: ''
      }
    ]
  },
  awards: {
    numeral: '06',
    heading: '獎項及證書',
    items: [
      { slug: 'nvidia', title: '深度學習基礎', org: 'NVIDIA 深度學習研究所', year: '2024' },
      { slug: 'digital-economy', title: '銀獎', org: '中國內地、香港及澳門數字經濟創新創業大賽', year: '2025' },
      { slug: 'icaie', title: '優異獎 — 第一組，高等教育', org: '國際人工智能教育競賽', year: '2025' },
      { slug: 'geo', title: 'GEO 學生交換獎學金', org: '香港理工大學', year: '2026' }
    ]
  },
  gallery: {
    numeral: '07',
    heading: '現場紀錄',
    items: {
      'polyu-ta': {
        caption: '以 NVIDIA 深度學習研究所助教身分，與香港理工大學「人工智慧與創業入門」課程的學生合影。',
        alt: '課堂結束時與香港理工大學學生的合照'
      },
      'hkust-ta': {
        caption: '於香港科技大學同一課程中講授人工智慧概念。',
        alt: '在香港科技大學的課室向學生講解人工智慧概念'
      },
      'hkuspace-ta': {
        caption: '在香港大學專業進修學院「企業全球化高階主管課程」中展示金融科技與人工智慧。',
        alt: '向企業高階主管展示金融科技與人工智慧技術'
      },
      'tranxfer-barcelona': {
        caption: '暑期實習結束時，與 Tranxfer 團隊在巴塞隆納辦公室合影。',
        alt: 'Tranxfer 全體團隊在巴塞隆納辦公室長桌旁的合照'
      },
      'cambridge-punting': {
        caption: '與劍橋數學暑期課程的同學一同在康河撐篙。',
        alt: '夏日午後與同學在康河上撐篙'
      },
      'cambridge-formal': {
        caption: '劍橋大學格頓學院的正式晚宴。',
        alt: '格頓學院拱形木構屋頂下的正式晚宴會場'
      }
    }
  },
  skills: {
    numeral: '08',
    heading: '技能',
    groups: [
      { slug: 'prog', label: '程式設計',
        items: ['Python', 'PyTorch', 'TensorFlow', 'Java (Spring)', 'C++', 'TypeScript', 'JavaScript', 'SQL', 'R', 'Django', 'HTML', 'CSS'] },
      { slug: 'tools', label: '工具與平台',
        items: ['Git', 'Docker', 'Linux', 'Azure', 'Claude Code', 'MCP', 'Ollama', 'LM Studio', 'ComfyUI', 'SQLite', 'Power BI', 'Microsoft 365'] },
      { slug: 'spoken', label: '語言',
        items: ['廣東話（母語）', '英語（母語 · 雅思 8 分）', '普通話（流利）'] }
    ]
  },
  contact: {
    numeral: '09',
    heading: '聯絡我',
    lede: '歡迎洽談人工智慧、金融科技，以及兩者交界領域的全職、實習與合作機會。',
    location: '香港',
    labels: { email: '電郵', github: 'GitHub', linkedin: 'LinkedIn' }
  },
  footer: { copy: '© 2026 蕭佑丞', built: '純手工打造，未使用框架。' },
  a11y: {
    skip: '跳至主要內容',
    menuOpen: '開啟選單',
    menuClose: '關閉選單',
    langLabel: '語言',
    prev: '上一張相片',
    next: '下一張相片',
    galleryLabel: '相片集'
  }
};

/* -------------------------------------------------------- simplified chinese */

SITE.content['zh-Hans'] = {
  meta: {
    title: '萧佑丞 — 人工智能与金融科技',
    desc: '香港理工大学金融科技及人工智能（荣誉）理学士四年级。近期于巴塞罗那的 Tranxfer 担任技术实习生，构建大型语言模型与 RAG 系统。'
  },
  brand: { name: '萧佑丞', short: '萧佑丞', alt: 'Siu Yau Shing · Shiloh' },
  nav: {
    home: '首页', about: '关于我', experience: '工作经验', projects: '项目',
    education: '学历', exchange: '交换', awards: '奖项',
    gallery: '相册', skills: '技能', contact: '联络'
  },
  hero: {
    eyebrow: '香港 · 滑铁卢 · 巴塞罗那',
    name: '萧佑丞',
    alt: 'Siu Yau Shing · Shiloh',
    lede: '香港理工大学金融科技及人工智能（荣誉）理学士四年级。',
    cta: '到 GitHub 看看我的作品',
    scroll: '向下滚动',
    portraitAlt: '萧佑丞的照片'
  },
  about: {
    numeral: '01',
    heading: '关于我',
    lede: '我是萧佑丞（Shiloh），香港理工大学金融科技及人工智能（荣誉）理学士四年级学生，最近于巴塞罗那的 Tranxfer 构建人工智能基础架构。',
    body: [
      '我的工作大多是让人工智能系统能在实验环境以外站得住脚。在 Tranxfer，我以 Spring Boot 与 Vertex AI 构建异步的文档标注微服务，严格的多租户隔离与零内容保留是设计前提，而非事后补救。在人工智能研究所，我交付了 RAG 工作流程与本地模型管线，并通过分析硬件实际的耗时所在，将图像与视频生成时间缩短一半。',
      '在务实之外，我也保有研究的一面。于滑铁卢大学交换期间，我运用历史 SCADA 数据建立风力发电机劣化模型——这种异常检测方法可直接迁移至金融风险领域。我曾重新实现 IJCAI 论文中的超图神经网络，也构建了完全离线的 RAG 管线，结合文体分析与稠密向量检索，让本地模型能以特定的写作风格书写。',
      '除了技术开发，我也致力于揭开人工智能的神秘面纱。作为助教及 STEM 导师，我已向超过 100 名学习者授课——从小学生、大学生到香港大学专业进修学院的企业高阶主管——内容涵盖计算机视觉、自然语言处理与 PyTorch，同样重要的是，让他们理解这些系统能做什么、又不能做什么。'
    ],
    exploringLabel: '目前探索的方向',
    exploring: [
      '端侧人工智能与隐私保护型大语言模型（LLM）',
      '包容性人机协作互动的应用',
      '人工智能与科技素养作为现代社会的基础能力'
    ]
  },
  experience: {
    numeral: '02',
    heading: '工作经验',
    earlierLabel: '早期经历',
    items: [
      {
        slug: 'tranxfer', role: '技术实习生', org: 'Tranxfer',
        place: '巴塞罗那', period: '2026年6月 – 8月', year: '2026',
        points: ['使用 Spring Boot、Vertex AI 与 PostgreSQL 开发异步的 Gemini 文档标注微服务，实施严格的多租户数据隔离，并确保不保留任何文档内容。']
      },
      {
        slug: 'feelingss', role: '人工智能技术实习生', org: 'Feelingss AI',
        place: '香港', period: '2025年9月 – 12月', year: '2025',
        points: ['设计并实现人工智能应用程序中结合实时数据库日志记录的错误报告系统，并与技术团队将多个 GenAI 模型集成至系统。']
      },
      {
        slug: 'ailab', role: '研究人工智能工程师实习生', org: '人工智能研究所',
        place: '香港', period: '2024年8月 · 2025年5月 – 8月', year: '2024',
        points: [
          '设计并部署以大语言模型驱动的工具及 RAG 工作流程，撰写技术文档并向技术团队汇报研究结果以支持决策。',
          '以开源大语言模型结合语音识别（ASR）与语音合成（TTS），构建本地对话机器人流程。',
          '在本地计算平台上优化人工智能图像与视频生成工作流程，将生成时间缩短 50%，并分析 RAM 与 VRAM 使用情况。',
          '以 Python 与 XlsxWriter 开发财务分析工具，生成带图表的 Excel 报告以查看公司数据，并部署于 Azure。'
        ]
      },
      {
        slug: 'ta', role: '助教', org: '理大 · 科大 · 港大专业进修学院',
        place: '香港', period: '2025年1月 – 4月', year: '2025',
        points: [
          '协助周建新教授为香港理工大学及香港科技大学逾 100 名学生教授「人工智能与创业入门」课程，内容涵盖自然语言处理与 PyTorch。',
          '在香港大学专业进修学院「企业全球化高阶主管课程」中，展示大语言模型与数据可视化技术，讲授人工智能及其商业应用。'
        ]
      }
    ],
    earlier: [
      { slug: 'pigeon', role: '兼职 STEM 导师', org: '博思创意电脑培训中心', period: '2024年1月 – 2025年3月' },
      { slug: 'stem-lead', role: 'STEM 团队领袖', org: '保良局蔡继有学校', period: '2021 – 2023' },
      { slug: 'cafe', role: '学生咖啡厅经理', org: '保良局蔡继有学校', period: '2017 – 2023' }
    ]
  },
  projects: {
    numeral: '03',
    heading: '项目',
    linkLabel: '查看项目',
    moreLabel: '在 GitHub 查看更多',
    items: {
      'wind-turbine': {
        title: '风力发电机异常检测',
        meta: '滑铁卢大学',
        blurb: '运用历史 SCADA 数据建立系统劣化的预测模型，该方法可直接迁移至金融异常检测与风险建模。',
        alt: null
      },
      'unignn': {
        title: 'Uni-GNN 重新实现',
        meta: 'Python · PyTorch',
        blurb: '改写 IJCAI 2021 论文《UniGNN: a Unified Framework for Graph and Hypergraph Neural Networks》中的模型，并撰写整合研究结果的报告。',
        alt: 'UniGNN 重新实现的训练损失曲线图'
      },
      'writing-style-rag': {
        title: '个人写作风格 RAG 流程',
        meta: 'Python · 本地大语言模型',
        blurb: '完全离线、保护隐私的 RAG 流程，结合多维度文体分析与稠密向量检索来提示本地大语言模型，生成模仿特定写作风格的文字。',
        alt: null
      },
      'cantonese': {
        title: '广东话转录与精炼',
        meta: 'Ollama · Transformers',
        blurb: '以本地模型实现的广东话转录与文字精炼工作流程。',
        alt: '广东话转录流程的终端输出画面'
      },
      'mnist': {
        title: 'MNIST 分类器',
        meta: 'Python · PyTorch',
        blurb: '使用物体检测识别手写数字的分类器。',
        alt: 'MNIST 手写数字与预测标签的网格图'
      },
      'cvfs': {
        title: 'CVFS — 虚拟文件系统',
        meta: 'Java · MVC',
        blurb: '以 Java 构建的内存虚拟文件系统，运用面向对象设计与模型–视图–控制器（MVC）模式模拟真实文件系统。',
        alt: 'CVFS 虚拟文件系统的命令界面'
      },
      'cops-robbers': {
        title: '警察与强盗',
        meta: 'Python · 图论',
        blurb: '以图数据结构进行的追捕游戏，使用 Python 编写并在命令行执行。',
        alt: '命令行中呈现的警察与强盗游戏图形'
      },
      'py-minifier': {
        title: 'Python 压缩与混淆工具',
        meta: 'Python · Selenium',
        blurb: '自动压缩并混淆目录中所有 Python 文件，同时确保代码仍可正常执行。',
        alt: 'Python 源代码混淆前后的对照画面'
      },
      'ram-vram': {
        title: 'RAM / VRAM 追踪器',
        meta: 'Python',
        blurb: '持续采样 RAM 与 VRAM 使用量并写入 CSV，方便后续分析的小型工具。',
        alt: 'RAM/VRAM 追踪器的 CSV 输出与使用量图表'
      }
    }
  },
  education: {
    numeral: '04',
    heading: '学历',
    items: [
      {
        slug: 'polyu',
        award: '金融科技及人工智能（荣誉）理学士',
        org: '香港理工大学',
        period: '2023年9月 – 2027年7月',
        note: ''
      },
      {
        slug: 'plkcky',
        award: 'IB 文凭 · IGCSE',
        org: '保良局蔡继有学校',
        period: '2021 – 2023',
        note: 'IB 文凭总分 35/45（2023年7月）· IGCSE 5A* 及 6A（2021年8月）'
      }
    ]
  },
  exchange: {
    numeral: '05',
    heading: '交换与海外学习',
    items: [
      {
        slug: 'waterloo',
        award: '交换学期',
        org: '滑铁卢大学 · 加拿大安大略省',
        period: '2026年冬季学期',
        note: '获颁 GEO 学生交换奖学金。修课期间完成风力发电机 SCADA 异常检测项目。'
      },
      {
        slug: 'cambridge',
        award: '数学暑期课程',
        org: '剑桥大学格顿学院 · 英国',
        period: '2026年8月',
        note: ''
      }
    ]
  },
  awards: {
    numeral: '06',
    heading: '奖项及证书',
    items: [
      { slug: 'nvidia', title: '深度学习基础', org: 'NVIDIA 深度学习研究所', year: '2024' },
      { slug: 'digital-economy', title: '银奖', org: '中国内地、香港及澳门数字经济创新创业大赛', year: '2025' },
      { slug: 'icaie', title: '优异奖 — 第一组，高等教育', org: '国际人工智能教育竞赛', year: '2025' },
      { slug: 'geo', title: 'GEO 学生交换奖学金', org: '香港理工大学', year: '2026' }
    ]
  },
  gallery: {
    numeral: '07',
    heading: '现场记录',
    items: {
      'polyu-ta': {
        caption: '以 NVIDIA 深度学习研究所助教身分，与香港理工大学「人工智能与创业入门」课程的学生合影。',
        alt: '课堂结束时与香港理工大学学生的合照'
      },
      'hkust-ta': {
        caption: '于香港科技大学同一课程中讲授人工智能概念。',
        alt: '在香港科技大学的教室向学生讲解人工智能概念'
      },
      'hkuspace-ta': {
        caption: '在香港大学专业进修学院「企业全球化高阶主管课程」中展示金融科技与人工智能。',
        alt: '向企业高阶主管展示金融科技与人工智能技术'
      },
      'tranxfer-barcelona': {
        caption: '暑期实习结束时，与 Tranxfer 团队在巴塞罗那办公室合影。',
        alt: 'Tranxfer 全体团队在巴塞罗那办公室长桌旁的合照'
      },
      'cambridge-punting': {
        caption: '与剑桥数学暑期课程的同学一同在康河撑篙。',
        alt: '夏日午后与同学在康河上撑篙'
      },
      'cambridge-formal': {
        caption: '剑桥大学格顿学院的正式晚宴。',
        alt: '格顿学院拱形木构屋顶下的正式晚宴会场'
      }
    }
  },
  skills: {
    numeral: '08',
    heading: '技能',
    groups: [
      { slug: 'prog', label: '程序设计',
        items: ['Python', 'PyTorch', 'TensorFlow', 'Java (Spring)', 'C++', 'TypeScript', 'JavaScript', 'SQL', 'R', 'Django', 'HTML', 'CSS'] },
      { slug: 'tools', label: '工具与平台',
        items: ['Git', 'Docker', 'Linux', 'Azure', 'Claude Code', 'MCP', 'Ollama', 'LM Studio', 'ComfyUI', 'SQLite', 'Power BI', 'Microsoft 365'] },
      { slug: 'spoken', label: '语言',
        items: ['广东话（母语）', '英语（母语 · 雅思 8 分）', '普通话（流利）'] }
    ]
  },
  contact: {
    numeral: '09',
    heading: '联络我',
    lede: '欢迎洽谈人工智能、金融科技，以及两者交界领域的全职、实习与合作机会。',
    location: '香港',
    labels: { email: '电邮', github: 'GitHub', linkedin: 'LinkedIn' }
  },
  footer: { copy: '© 2026 萧佑丞', built: '纯手工打造，未使用框架。' },
  a11y: {
    skip: '跳至主要内容',
    menuOpen: '开启菜单',
    menuClose: '关闭菜单',
    langLabel: '语言',
    prev: '上一张相片',
    next: '下一张相片',
    galleryLabel: '相片集'
  }
};
