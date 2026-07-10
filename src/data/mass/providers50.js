// Real proxy providers — mass-page data (Provider[])
// Schema: src/data/mass/SCHEMA.md
// NOTE: figures are approximate-but-plausible marketing/public-doc numbers, not live quotes.
export default [
  {
    name: "Bright Data",
    slug: "bright-data",
    founded: 2014,
    hq: "Netanya, Israel",
    startingPrice: "$8.40/GB residential (pay-as-you-go), plans from ~$499/mo",
    poolSize: "150M+ residential IPs",
    proxyTypes: ["residential", "datacenter", "mobile", "ISP"],
    locationsCount: "195+ countries with city and ASN targeting",
    features: [
      "Proxy Manager (open-source) plus a hosted Web Unlocker that solves CAPTCHAs and rotates fingerprints",
      "SERP API, Web Scraper IDE and pre-built dataset marketplace",
      "Granular targeting down to city, carrier and ASN level",
      "KYC compliance gating and per-domain usage approval"
    ],
    pros: [
      "Largest and most geographically complete network on the market",
      "Deep tooling beyond raw proxies (unlocker, scraping IDE, datasets)",
      "Reliable on the hardest anti-bot targets like Amazon, Google and Cloudflare-fronted sites"
    ],
    cons: [
      "Complex pricing and dashboard that overwhelm small users",
      "Strict KYC and site-approval process can slow onboarding",
      "Premium per-GB cost is among the highest in the industry"
    ],
    bestFor: "Enterprise data teams that need maximum coverage and unblocking on the toughest targets and can absorb premium pricing.",
    rating: 4.7,
    authMethods: ["username/password", "IP whitelist", "API token"],
    integrations: ["Proxy Manager", "Puppeteer", "Playwright", "Selenium", "Scrapy", "cURL"],
    notes: "Formerly Luminati Networks, rebranded to Bright Data in 2020 after selling its consumer VPN arm (Hola). Its compliance team manually reviews scraping targets, which is unusual among proxy vendors.",
    keywords: ["bright data proxies", "luminati alternative", "web unlocker", "enterprise residential proxies"]
  },
  {
    name: "Oxylabs",
    slug: "oxylabs",
    founded: 2015,
    hq: "Vilnius, Lithuania",
    startingPrice: "~$8/GB residential, Web Scraper API from ~$49/mo",
    poolSize: "100M+ residential IPs",
    proxyTypes: ["residential", "datacenter", "mobile", "ISP"],
    locationsCount: "195 countries with city-level targeting",
    features: [
      "Dedicated datacenter and ISP proxy tiers with 99.9% uptime SLA",
      "Web Scraper API and SERP Scraper API with JS rendering",
      "OxyCopilot AI assistant that generates scraping parsers",
      "Enterprise account management and ISO 27001 certification"
    ],
    pros: [
      "Very high success rates on e-commerce and search targets",
      "Strong compliance posture and enterprise support",
      "Broad product range from raw IPs to fully managed scrapers"
    ],
    cons: [
      "Premium pricing aimed at mid-market and enterprise budgets",
      "Trial access is limited for residential without sales contact"
    ],
    bestFor: "Compliance-conscious enterprises running large-scale e-commerce and SERP scraping who want managed APIs alongside raw proxies.",
    rating: 4.7,
    authMethods: ["username/password", "IP whitelist", "API token"],
    integrations: ["Scrapy", "Playwright", "Puppeteer", "Selenium", "n8n"],
    notes: "Runs the Oxycon scraping conference and co-founded the Ethical Web Data Collection Initiative. Its ISP proxies are hosted in datacenters but registered to real ISPs for static-but-fast sessions.",
    keywords: ["oxylabs proxies", "web scraper api", "isp proxies", "serp scraper api"]
  },
  {
    name: "Decodo (formerly Smartproxy)",
    slug: "decodo",
    founded: 2018,
    hq: "Vilnius, Lithuania",
    startingPrice: "~$3.5/GB residential, Pay As You Go from $7/GB",
    poolSize: "65M+ residential IPs",
    proxyTypes: ["residential", "datacenter", "mobile", "ISP"],
    locationsCount: "195+ locations with city and state targeting",
    features: [
      "Polished dashboard with sub-user management and usage stats",
      "Site Unblocker and dedicated Google/Amazon scraping APIs",
      "Free browser extensions for Chrome and Firefox",
      "8-hour sticky sessions plus rotating endpoints"
    ],
    pros: [
      "One of the most beginner-friendly dashboards and docs",
      "Competitive residential pricing with small entry plans",
      "Responsive 24/7 live chat support"
    ],
    cons: [
      "Pool is smaller than Bright Data or Oxylabs",
      "Advanced targeting is less granular than top-tier rivals"
    ],
    bestFor: "Small teams and mid-market users who want a clean UX and fair residential pricing without enterprise complexity.",
    rating: 4.6,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Multilogin", "GoLogin", "AdsPower", "Scrapy", "Puppeteer"],
    notes: "Rebranded from Smartproxy to Decodo in 2025 to avoid confusion with the many copycat 'proxy' brands. Popular with sneaker and multi-account communities for its social-media friendly IPs.",
    keywords: ["smartproxy alternative", "decodo proxies", "site unblocker", "affordable residential proxies"]
  },
  {
    name: "SOAX",
    slug: "soax",
    founded: 2019,
    hq: "London, United Kingdom",
    startingPrice: "~$4/GB residential, plans from ~$99/mo",
    poolSize: "155M+ residential and mobile IPs",
    proxyTypes: ["residential", "mobile", "ISP", "datacenter"],
    locationsCount: "195+ countries with city and carrier targeting",
    features: [
      "Very granular geo-targeting by country, region, city and mobile carrier",
      "Clean, whitelisted IP pool with automatic bad-IP removal",
      "Web Data, SERP and e-commerce scraping APIs",
      "Flexible rotating and sticky session control"
    ],
    pros: [
      "Excellent city and carrier-level targeting",
      "Constantly cleaned pool keeps ban rates low",
      "Strong mobile proxy coverage"
    ],
    cons: [
      "Per-GB cost climbs on smaller plans",
      "Dashboard has a learning curve for new users"
    ],
    bestFor: "Researchers and ad-verification teams needing precise city or mobile-carrier targeting on clean, low-ban IPs.",
    rating: 4.5,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Multilogin", "Dolphin Anty", "Scrapy", "Playwright"],
    notes: "SOAX markets itself heavily on IP-pool hygiene, pruning flagged addresses continuously rather than reselling stale ranges. Its mobile pool sources 3G/4G/5G exits across major carriers.",
    keywords: ["soax proxies", "mobile carrier targeting", "city level proxies", "clean ip pool"]
  },
  {
    name: "IPRoyal",
    slug: "iproyal",
    founded: 2020,
    hq: "Wilmington, Delaware, USA (ops in Ohrid, North Macedonia)",
    startingPrice: "$1.75/GB residential (Royal Residential), datacenter from $1.39/IP",
    poolSize: "34M+ residential IPs",
    proxyTypes: ["residential", "datacenter", "mobile", "ISP"],
    locationsCount: "195 countries",
    features: [
      "Traffic never expires on Royal Residential pay-as-you-go",
      "Sticky sessions up to 24 hours",
      "Sources residential IPs via the Pawns.app opt-in SDK",
      "Sneaker-friendly ISP and dedicated datacenter options"
    ],
    pros: [
      "Aggressive budget pricing with non-expiring traffic",
      "Simple onboarding and low entry cost",
      "Flexible IP-count datacenter and ISP plans"
    ],
    cons: [
      "Support depth trails the top enterprise vendors",
      "Success rate on the hardest targets is behind premium pools"
    ],
    bestFor: "Budget-focused scrapers and resellers who want cheap residential traffic that doesn't expire.",
    rating: 4.4,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Scrapy", "Puppeteer", "Selenium", "Multilogin"],
    notes: "IPRoyal fuels its residential pool through Pawns.app, a paid bandwidth-sharing app that compensates end users. Non-expiring GB is a rare feature that suits irregular, bursty projects.",
    keywords: ["iproyal proxies", "cheap residential proxies", "pawns.app", "non expiring traffic"]
  },
  {
    name: "Webshare",
    slug: "webshare",
    founded: 2018,
    hq: "San Francisco, California, USA",
    startingPrice: "Free 10 proxies, paid datacenter from ~$2.99/mo, residential from $4.50/GB",
    poolSize: "30M+ residential IPs, 100k+ datacenter IPs",
    proxyTypes: ["datacenter", "residential", "ISP", "static residential"],
    locationsCount: "195+ countries (residential); ~40 for datacenter",
    features: [
      "Free tier with 10 datacenter proxies and 1GB/month",
      "Self-serve dashboard with instant proxy list download",
      "Bandwidth and thread limits configurable per plan",
      "Static residential and premium datacenter tiers"
    ],
    pros: [
      "Genuinely usable free plan for testing",
      "Very cheap high-thread datacenter proxies",
      "Fast, automated self-service with no sales calls"
    ],
    cons: [
      "Datacenter IPs are easily blocked by strict targets",
      "Residential pool and features are lighter than specialists"
    ],
    bestFor: "Developers and hobbyists who want cheap, instantly provisioned datacenter proxies or a free tier to prototype with.",
    rating: 4.5,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Python requests", "Scrapy", "cURL", "Node.js"],
    notes: "Now owned by Oxylabs (acquired 2023) but still operated as a self-serve, developer-first brand. Its free tier is one of the few real no-cost proxy offerings that isn't a bait funnel.",
    keywords: ["webshare proxies", "free proxies", "cheap datacenter proxies", "developer proxies"]
  },
  {
    name: "NetNut",
    slug: "netnut",
    founded: 2017,
    hq: "Tel Aviv, Israel",
    startingPrice: "~$1.5k/mo enterprise entry, residential from ~$15/GB on small plans",
    poolSize: "85M+ residential and ISP IPs",
    proxyTypes: ["ISP", "residential", "mobile", "datacenter"],
    locationsCount: "150+ countries",
    features: [
      "Direct ISP-sourced static residential IPs (no peer-to-peer)",
      "One-hop architecture through DiViNetworks ISP partnerships",
      "SERP scraper API and Website Unblocker",
      "High-throughput static residential for stable long sessions"
    ],
    pros: [
      "ISP-backed IPs deliver fast, stable static sessions",
      "No reliance on end-user P2P bandwidth",
      "Strong for accounts needing a consistent single IP"
    ],
    cons: [
      "Entry pricing skews toward business budgets",
      "Rotating residential pool is smaller than P2P giants"
    ],
    bestFor: "Businesses needing fast, stable static residential/ISP IPs for account management or long scraping sessions.",
    rating: 4.4,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Scrapy", "Puppeteer", "Selenium", "Multilogin"],
    notes: "NetNut sources IPs directly from ISP partners via parent company DiViNetworks rather than a consumer bandwidth-sharing app. That gives it unusually stable static residential exits.",
    keywords: ["netnut proxies", "isp proxies", "static residential proxies", "netnut alternative"]
  },
  {
    name: "Rayobyte",
    slug: "rayobyte",
    founded: 2015,
    hq: "Boise, Idaho, USA",
    startingPrice: "Datacenter from ~$0.65/IP, residential from ~$7.5/GB",
    poolSize: "Millions of datacenter IPs, growing residential pool",
    proxyTypes: ["datacenter", "residential", "ISP", "mobile"],
    locationsCount: "150+ countries (residential); 27+ ASNs for datacenter",
    features: [
      "Large owned datacenter IP inventory across many ASNs and subnets",
      "Ethical, opt-in residential sourcing with a public compliance stance",
      "Automatic replacement of banned datacenter IPs",
      "Scraping Robot API for managed data extraction"
    ],
    pros: [
      "Excellent subnet and ASN diversity on datacenter proxies",
      "Strong, transparent ethics and compliance messaging",
      "Flexible dedicated, semi-dedicated and rotating options"
    ],
    cons: [
      "Residential network is smaller than pure residential specialists",
      "Interface feels dated compared with newer rivals"
    ],
    bestFor: "Teams that need diverse, ethically sourced datacenter subnets with easy ban replacement for large scraping jobs.",
    rating: 4.4,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Scraping Robot", "Scrapy", "Selenium", "Puppeteer"],
    notes: "Rebranded from Blazing SEO in 2021 and leans hard into 'ethical proxies' as a differentiator. It owns much of its datacenter hardware rather than leasing, which aids subnet diversity.",
    keywords: ["rayobyte proxies", "blazing seo", "datacenter subnets", "ethical proxies"]
  },
  {
    name: "Proxy-Cheap",
    slug: "proxy-cheap",
    founded: 2019,
    hq: "Tallinn, Estonia",
    startingPrice: "Residential from ~$4.99/GB, mobile from ~$16/GB, datacenter from ~$1.99/IP",
    poolSize: "7M+ residential IPs",
    proxyTypes: ["residential", "mobile", "datacenter", "ISP"],
    locationsCount: "127+ countries",
    features: [
      "Low-cost entry plans across every proxy type",
      "Dedicated mobile 4G/LTE proxies with unlimited bandwidth options",
      "Pay-as-you-go residential with no monthly commitment",
      "Simple dashboard and quick self-serve setup"
    ],
    pros: [
      "Very affordable across residential, mobile and datacenter",
      "Good option for small budgets and testing",
      "Unlimited-bandwidth mobile plans available"
    ],
    cons: [
      "Smaller pool means more geo gaps outside major markets",
      "Support and reliability trail premium tiers"
    ],
    bestFor: "Cost-sensitive individuals and small businesses wanting cheap access to all proxy types in one place.",
    rating: 4.2,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Scrapy", "Puppeteer", "Multilogin", "Dolphin Anty"],
    notes: "Proxy-Cheap positions squarely on price, offering pay-as-you-go GB and unlimited mobile plans that appeal to solo operators. Coverage is thinner in Africa and parts of Asia.",
    keywords: ["proxy-cheap", "cheap mobile proxies", "budget residential proxies", "pay as you go proxies"]
  },
  {
    name: "ProxyEmpire",
    slug: "proxyempire",
    founded: 2020,
    hq: "Dover, Delaware, USA",
    startingPrice: "Residential from ~$7.5/GB, mobile plans from ~$45/mo",
    poolSize: "9M+ residential IPs",
    proxyTypes: ["residential", "mobile", "ISP", "datacenter"],
    locationsCount: "170+ countries with region, city and ISP targeting",
    features: [
      "Rollover data so unused GB carries to the next month",
      "Granular targeting by country, region, city and ISP",
      "Ethically sourced rotating and sticky residential IPs",
      "Dedicated mobile proxies with real carrier IPs"
    ],
    pros: [
      "Rollover data is rare and reduces waste",
      "Broad country coverage including hard-to-reach markets",
      "Solid mobile and residential mix"
    ],
    cons: [
      "Per-GB pricing is mid-to-high on small plans",
      "Brand is less established than top-tier vendors"
    ],
    bestFor: "Users with irregular usage who value rollover data and wide, ISP-level geographic targeting.",
    rating: 4.2,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Scrapy", "Puppeteer", "Selenium", "Multilogin"],
    notes: "ProxyEmpire's rollover-data policy lets unused bandwidth accumulate rather than expire monthly. It advertises coverage in niche markets across Africa and the Middle East that larger vendors often skip.",
    keywords: ["proxyempire", "rollover data proxies", "isp targeting proxies", "mobile proxies"]
  },
  {
    name: "Infatica",
    slug: "infatica",
    founded: 2019,
    hq: "Singapore",
    startingPrice: "Residential from ~$8/GB, datacenter from ~$0.9/IP",
    poolSize: "15M+ residential IPs",
    proxyTypes: ["residential", "datacenter", "mobile", "ISP"],
    locationsCount: "150+ countries",
    features: [
      "Opt-in P2P residential sourcing via SDK partnerships with app publishers",
      "Scraper API and ready-made web unblocking tools",
      "Rotating and sticky sessions with country/city targeting",
      "Datacenter and mobile add-on tiers"
    ],
    pros: [
      "Balanced pricing across the product range",
      "Transparent about its SDK-monetization sourcing model",
      "Decent global coverage for the price"
    ],
    cons: [
      "Success rates lag the premium leaders on tough targets",
      "Dashboard and docs are functional but basic"
    ],
    bestFor: "Mid-budget scrapers wanting a full proxy lineup with reasonable coverage and honest sourcing disclosure.",
    rating: 4.1,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Scrapy", "Puppeteer", "Selenium"],
    notes: "Infatica monetizes app publishers by embedding an opt-in SDK, then routes ethical residential traffic through consenting devices. It also sells its business proxy network to app developers as a revenue stream.",
    keywords: ["infatica proxies", "sdk residential proxies", "scraper api", "infatica alternative"]
  },
  {
    name: "GeoSurf",
    slug: "geosurf",
    founded: 2009,
    hq: "Tel Aviv, Israel",
    startingPrice: "Enterprise plans from ~$300/mo",
    poolSize: "2.5M+ residential IPs",
    proxyTypes: ["residential", "datacenter", "ISP"],
    locationsCount: "130+ countries, 1,700+ cities",
    features: [
      "One of the deepest city-level targeting catalogs (1,700+ cities)",
      "Browser toolbar for manual geo-verification",
      "Sticky and rotating residential sessions",
      "Long track record with ad-verification and brand-protection clients"
    ],
    pros: [
      "Exceptional city-level coverage for ad verification",
      "Mature, stable platform with long operating history",
      "Convenient browser extension for QA teams"
    ],
    cons: [
      "Pool size is small versus modern P2P giants",
      "Pricing and minimums favor enterprise buyers"
    ],
    bestFor: "Ad-verification and brand-protection teams that need precise city-level residential coverage.",
    rating: 4.0,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Browser toolbar", "Selenium", "Puppeteer"],
    notes: "One of the oldest residential proxy brands, GeoSurf built its reputation in ad verification with a famously granular city list. It was acquired by BIScience, an ad-intelligence firm, in 2020.",
    keywords: ["geosurf proxies", "ad verification proxies", "city level residential", "brand protection proxies"]
  },
  {
    name: "Storm Proxies",
    slug: "storm-proxies",
    founded: 2016,
    hq: "United States",
    startingPrice: "Rotating residential from ~$50/mo (40 threads)",
    poolSize: "~200k rotating residential IPs",
    proxyTypes: ["residential", "datacenter"],
    locationsCount: "US and EU regions",
    features: [
      "Flat monthly pricing with unlimited bandwidth (no per-GB metering)",
      "Rotating reverse-connect residential gateways",
      "Backconnect ports that rotate IPs automatically",
      "Simple plans sized by concurrent threads"
    ],
    pros: [
      "Unlimited bandwidth flat-rate model is budget-friendly",
      "Extremely simple setup for beginners",
      "Good for high-volume, low-precision rotating tasks"
    ],
    cons: [
      "Very limited geo-targeting (mainly US/EU)",
      "Small pool leads to IP reuse and higher ban rates on tough sites"
    ],
    bestFor: "Beginners and SEO tools that want cheap, unlimited-bandwidth rotating IPs and don't need precise geo-targeting.",
    rating: 3.7,
    authMethods: ["IP whitelist"],
    integrations: ["Scrapy", "GSA", "ScrapeBox", "SEO tools"],
    notes: "Storm Proxies sells flat-rate unlimited bandwidth by thread count rather than metering GB, which is unusual and popular for SEO tooling. Its small pool and coarse geo make it unsuitable for precise or high-security targets.",
    keywords: ["storm proxies", "unlimited bandwidth proxies", "rotating backconnect proxies", "seo proxies"]
  },
  {
    name: "PacketStream",
    slug: "packetstream",
    founded: 2018,
    hq: "United States",
    startingPrice: "$1/GB residential (flat)",
    poolSize: "7M+ residential IPs",
    proxyTypes: ["residential"],
    locationsCount: "Global, country-level targeting",
    features: [
      "Flat $1/GB bandwidth-sharing marketplace pricing",
      "Peers earn by sharing idle bandwidth (Packeter app)",
      "Simple single-endpoint residential gateway",
      "Country-level targeting"
    ],
    pros: [
      "One of the cheapest residential per-GB rates available",
      "Dead-simple pricing with no tiers",
      "Good enough for light, non-sensitive scraping"
    ],
    cons: [
      "No city-level targeting or advanced session control",
      "Speeds and reliability vary with peer availability"
    ],
    bestFor: "Budget users running light residential scraping who prize the lowest flat per-GB price over precision.",
    rating: 3.9,
    authMethods: ["username/password"],
    integrations: ["Scrapy", "Puppeteer", "cURL"],
    notes: "PacketStream pioneered the $1/GB residential marketplace, paying 'Packeters' who share unused bandwidth. It trades advanced features for a rock-bottom, uncomplicated price.",
    keywords: ["packetstream", "1 dollar per gb proxies", "cheapest residential proxies", "bandwidth sharing proxies"]
  },
  {
    name: "Nimble",
    slug: "nimble",
    founded: 2020,
    hq: "Tel Aviv, Israel",
    startingPrice: "Residential from ~$8/GB, Web API plans from ~$150/mo",
    poolSize: "85M+ residential IPs",
    proxyTypes: ["residential", "datacenter", "ISP", "mobile"],
    locationsCount: "195+ countries with state and city targeting",
    features: [
      "AI-powered fingerprint and pattern engine for unblocking",
      "Nimble Browser and Web API for structured data extraction",
      "Pipelines for scheduling and delivering datasets to cloud storage",
      "State- and city-level geo-targeting"
    ],
    pros: [
      "Modern AI-driven unblocking tech",
      "Clean developer experience and structured output",
      "Native delivery to S3, GCS and other cloud storage"
    ],
    cons: [
      "Newer brand with a shorter track record",
      "Premium positioning; not aimed at bargain hunters"
    ],
    bestFor: "Data engineering teams wanting an AI-assisted scraping platform with proxies and structured delivery baked in.",
    rating: 4.3,
    authMethods: ["username/password", "API token"],
    integrations: ["AWS S3", "Google Cloud Storage", "Azure Blob", "Playwright"],
    notes: "Nimble (Nimbleway) markets an AI 'online pipeline' that decides fingerprints and retry logic automatically rather than exposing raw rotation controls. It targets the data-platform niche more than the raw-proxy market.",
    keywords: ["nimble proxies", "nimbleway", "ai web scraping", "web data pipelines"]
  },
  {
    name: "Zyte",
    slug: "zyte",
    founded: 2010,
    hq: "Cork, Ireland",
    startingPrice: "Zyte API usage-based, from ~$0.30 per thousand requests / ~$100/mo",
    poolSize: "Managed pool (not publicly sized)",
    proxyTypes: ["datacenter", "residential"],
    locationsCount: "Global via Smart Proxy Manager / Zyte API",
    features: [
      "Zyte API auto-selects proxy type, headers and ban-avoidance per request",
      "Automatic extraction (AI-powered structured parsing)",
      "Built on the open-source Scrapy framework (Zyte maintains it)",
      "Ban detection and smart retry handled server-side"
    ],
    pros: [
      "Abstracts proxy management entirely — pay per successful request",
      "Deep Scrapy ecosystem integration and expertise",
      "AI auto-extraction reduces parser maintenance"
    ],
    cons: [
      "Not a raw-IP provider; less control for advanced users",
      "Request-based pricing can be costly at very high volume"
    ],
    bestFor: "Python and Scrapy teams who want to outsource proxy rotation and ban-handling to a managed API.",
    rating: 4.3,
    authMethods: ["API token"],
    integrations: ["Scrapy", "Scrapy Cloud", "Python", "Playwright"],
    notes: "Formerly Scrapinghub, Zyte is the company behind and maintainer of the Scrapy framework. Its API sells 'successful responses' rather than bandwidth or IPs, a fundamentally different model from raw proxy vendors.",
    keywords: ["zyte", "scrapinghub", "zyte api", "scrapy proxies"]
  },
  {
    name: "ScraperAPI",
    slug: "scraperapi",
    founded: 2018,
    hq: "New York, USA",
    startingPrice: "Free 5,000 credits, paid from $49/mo (100k credits)",
    poolSize: "150M+ IPs across datacenter, residential and mobile",
    proxyTypes: ["datacenter", "residential", "mobile"],
    locationsCount: "50+ countries for geotargeting",
    features: [
      "Single endpoint API that rotates IPs and handles CAPTCHAs",
      "Automatic JS rendering via headless browsers",
      "Structured data endpoints for Amazon, Google and Walmart",
      "Async request builder for large jobs"
    ],
    pros: [
      "Extremely simple API — one call returns rendered HTML",
      "Handles retries, CAPTCHAs and rotation automatically",
      "Generous free tier and clear credit pricing"
    ],
    cons: [
      "Credit costs multiply for JS rendering and premium geos",
      "Less control than managing raw proxies yourself"
    ],
    bestFor: "Developers who want to add reliable scraping to an app with one API call and no proxy plumbing.",
    rating: 4.5,
    authMethods: ["API token"],
    integrations: ["Python", "Node.js", "Ruby", "PHP", "cURL"],
    notes: "ScraperAPI abstracts proxies behind a single endpoint and bills in credits that scale with difficulty (JS rendering, residential, premium geos cost more). Popular for its friction-free onboarding.",
    keywords: ["scraperapi", "web scraping api", "rotating proxy api", "captcha handling scraper"]
  },
  {
    name: "ScrapingBee",
    slug: "scrapingbee",
    founded: 2019,
    hq: "Paris, France",
    startingPrice: "Free 1,000 credits, paid from $49/mo",
    poolSize: "Managed pool (datacenter + residential)",
    proxyTypes: ["datacenter", "residential"],
    locationsCount: "Country-level geotargeting on premium proxies",
    features: [
      "Headless Chrome rendering with configurable wait/JS scenarios",
      "Google search API and screenshot endpoints",
      "AI-powered data extraction from a prompt",
      "Handles retries, rotation and CAPTCHAs behind one API"
    ],
    pros: [
      "Developer-friendly docs and predictable credit pricing",
      "Solid JS rendering and screenshot support",
      "Good support responsiveness for a small team"
    ],
    cons: [
      "Premium (residential) requests consume many credits",
      "Concurrency is capped by plan tier"
    ],
    bestFor: "Small dev teams and indie hackers who want a clean scraping API with JS rendering and simple pricing.",
    rating: 4.4,
    authMethods: ["API token"],
    integrations: ["Python", "Node.js", "Make", "Zapier", "cURL"],
    notes: "ScrapingBee is a small, bootstrapped French team known for excellent documentation and a no-nonsense credit model. It focuses on rendering-heavy scraping rather than selling raw IP lists.",
    keywords: ["scrapingbee", "headless browser scraping", "javascript rendering api", "google search api"]
  },
  {
    name: "Froxy",
    slug: "froxy",
    founded: 2019,
    hq: "Larnaca, Cyprus",
    startingPrice: "Residential from ~$1.99/GB (larger plans), from ~$8/GB small",
    poolSize: "10M+ residential IPs",
    proxyTypes: ["residential", "mobile", "datacenter", "ISP"],
    locationsCount: "200+ countries with city and ISP targeting",
    features: [
      "City- and ISP-level targeting across a wide country list",
      "Rotating and sticky sessions with fast rotation control",
      "API for automated proxy-list generation",
      "Non-expiring traffic on residential plans"
    ],
    pros: [
      "Competitive per-GB pricing on larger plans",
      "Fine-grained geo-targeting for the price point",
      "Traffic doesn't expire, aiding long projects"
    ],
    cons: [
      "Brand recognition lags the market leaders",
      "Support is decent but not enterprise-grade"
    ],
    bestFor: "Value-seeking scrapers who want granular geo-targeting and non-expiring residential traffic at a fair price.",
    rating: 4.1,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Scrapy", "Puppeteer", "Multilogin", "Dolphin Anty"],
    notes: "Froxy pairs city/ISP targeting with non-expiring GB, a combination usually reserved for pricier vendors. It leans toward the mid-market scraping and multi-account crowd.",
    keywords: ["froxy proxies", "city targeting proxies", "non expiring residential", "froxy alternative"]
  },
  {
    name: "Proxy-Seller",
    slug: "proxy-seller",
    founded: 2016,
    hq: "Cyprus",
    startingPrice: "IPv4 datacenter from ~$1.5/IP, residential from ~$7/GB",
    poolSize: "15M+ residential IPs plus large datacenter inventory",
    proxyTypes: ["datacenter", "residential", "mobile", "ISP"],
    locationsCount: "800+ networks across many countries",
    features: [
      "Individual dedicated IPv4/IPv6 datacenter proxies by city",
      "Residential rotating and sticky sessions",
      "Mobile 4G proxies and ISP options",
      "Per-IP purchases without large minimums"
    ],
    pros: [
      "Buy individual dedicated IPs, not just bandwidth",
      "Wide choice of datacenter locations and subnets",
      "Flexible mix of static and rotating options"
    ],
    cons: [
      "Interface and checkout feel dated",
      "Residential pool trails dedicated-IP strengths"
    ],
    bestFor: "Users needing individual dedicated datacenter or ISP IPs in specific cities without bandwidth-only pricing.",
    rating: 4.2,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Scrapy", "Selenium", "Multilogin", "cURL"],
    notes: "Proxy-Seller is strongest as a dedicated-IP vendor, letting buyers pick individual IPv4/IPv6 addresses by city and subnet. It complements that with a bandwidth-metered residential pool.",
    keywords: ["proxy-seller", "dedicated ipv4 proxies", "ipv6 proxies", "static datacenter proxies"]
  },
  {
    name: "Shifter",
    slug: "shifter",
    founded: 2012,
    hq: "United States",
    startingPrice: "Rotating residential (special) from ~$125/mo, backconnect ports",
    poolSize: "31M+ residential IPs",
    proxyTypes: ["residential", "datacenter", "mobile"],
    locationsCount: "Global country-level targeting",
    features: [
      "Unlimited-bandwidth rotating backconnect ports",
      "Ports rotate on a configurable interval (e.g. every 5 minutes)",
      "Large P2P residential pool",
      "Plans sized by number of ports rather than GB"
    ],
    pros: [
      "Unlimited bandwidth model suits heavy rotating jobs",
      "Long-running, established residential network",
      "Port-based pricing is predictable"
    ],
    cons: [
      "Geo-targeting is coarse compared with metered rivals",
      "Rotation timing gives less fine session control"
    ],
    bestFor: "High-volume rotators who prefer unlimited-bandwidth backconnect ports over per-GB metering.",
    rating: 3.8,
    authMethods: ["IP whitelist", "username/password"],
    integrations: ["Scrapy", "GSA", "ScrapeBox", "Puppeteer"],
    notes: "Shifter was formerly Microleaves, one of the oldest backconnect residential networks. It sticks to a ports-and-rotation-interval model rather than the GB metering that dominates today.",
    keywords: ["shifter proxies", "microleaves", "backconnect rotating proxies", "unlimited bandwidth residential"]
  },
  {
    name: "ProxyRack",
    slug: "proxyrack",
    founded: 2012,
    hq: "Sydney, Australia",
    startingPrice: "Rotating residential from ~$49.95/mo, unmetered plans available",
    poolSize: "5M+ residential IPs, 20k+ datacenter",
    proxyTypes: ["residential", "datacenter", "ISP"],
    locationsCount: "140+ countries",
    features: [
      "Unmetered residential plans priced by concurrent threads",
      "Rotating and sticky (up to 1 hour) session options",
      "Mix of residential, datacenter and USA static tiers",
      "Simple thread-based plan structure"
    ],
    pros: [
      "Unmetered options remove bandwidth anxiety",
      "Long operating history and broad coverage",
      "Flexible thread-count pricing"
    ],
    cons: [
      "Success rate trails premium pools on tough sites",
      "Pool freshness varies by region"
    ],
    bestFor: "Users who want unmetered residential access billed by concurrency rather than gigabytes.",
    rating: 3.9,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Scrapy", "Selenium", "Puppeteer", "cURL"],
    notes: "ProxyRack offers both metered and unmetered (thread-based) residential plans, which is handy for jobs with unpredictable bandwidth. It has been operating since 2012, making it one of the older survivors.",
    keywords: ["proxyrack", "unmetered residential proxies", "thread based proxies", "rotating proxies"]
  },
  {
    name: "ProxyScrape",
    slug: "proxyscrape",
    founded: 2016,
    hq: "Roeselare, Belgium",
    startingPrice: "Free public lists; premium residential from ~$3.49/GB",
    poolSize: "10M+ residential IPs",
    proxyTypes: ["residential", "datacenter", "mobile", "ISP"],
    locationsCount: "120+ countries",
    features: [
      "Free public proxy lists (HTTP/SOCKS) updated frequently",
      "Premium residential and datacenter tiers with API access",
      "Proxy checker and scraping tools",
      "Pay-as-you-go residential option"
    ],
    pros: [
      "Well-known free proxy lists for casual use",
      "Affordable premium residential entry",
      "Handy free tooling (checker, generator)"
    ],
    cons: [
      "Free lists are unreliable and short-lived (expected)",
      "Premium features are lighter than specialists"
    ],
    bestFor: "Hobbyists starting with free lists who may graduate to cheap premium residential for real projects.",
    rating: 4.0,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Python", "Scrapy", "cURL", "Node.js"],
    notes: "ProxyScrape is best known for its huge free public proxy lists, which funnel users toward its paid residential and datacenter tiers. The free lists are fine for learning but not for production.",
    keywords: ["proxyscrape", "free proxy list", "socks5 proxies", "cheap residential proxies"]
  },
  {
    name: "MyPrivateProxy",
    slug: "myprivateproxy",
    founded: 2011,
    hq: "United States",
    startingPrice: "Private datacenter from ~$2.49/proxy (bulk), ~$1.49 at scale",
    poolSize: "125k+ datacenter IPs across A/B/C subnets",
    proxyTypes: ["datacenter", "ISP"],
    locationsCount: "US and EU datacenters",
    features: [
      "Dedicated private datacenter proxies with subnet diversity",
      "Multiple subnets across different data centers",
      "Instant activation and monthly IP refresh option",
      "SEO and social-media friendly IP allocation"
    ],
    pros: [
      "Reliable, fast dedicated datacenter IPs",
      "Good subnet diversity for the price",
      "Long-standing reputation in SEO circles"
    ],
    cons: [
      "No residential or mobile options",
      "Coverage limited mainly to US/EU"
    ],
    bestFor: "SEO practitioners and social-media managers who want stable private datacenter IPs with good subnet spread.",
    rating: 4.1,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["ScrapeBox", "GSA", "SEO tools", "cURL"],
    notes: "MyPrivateProxy (MPP) is a veteran datacenter-only vendor popular for SEO tooling and account management. It emphasizes subnet diversity and monthly IP replacement rather than large pools.",
    keywords: ["myprivateproxy", "private datacenter proxies", "seo proxies", "dedicated proxies"]
  },
  {
    name: "HighProxies",
    slug: "highproxies",
    founded: 2014,
    hq: "United States",
    startingPrice: "Shared from ~$1.4/proxy, private datacenter from ~$2.3/proxy",
    poolSize: "Large datacenter inventory across multiple subnets",
    proxyTypes: ["datacenter"],
    locationsCount: "US and EU locations",
    features: [
      "Private, shared and specialized (Craigslist, ticket, social) proxies",
      "Multiple subnet allocation to reduce footprints",
      "Instant setup with dashboard management",
      "Category-specific proxy packages"
    ],
    pros: [
      "Purpose-built packages for specific use cases",
      "Cheap shared options for casual tasks",
      "Quick provisioning"
    ],
    cons: [
      "Datacenter-only; no residential or mobile",
      "Aggressive targets block datacenter IPs easily"
    ],
    bestFor: "Buyers wanting task-specific datacenter proxy packages (e.g. classifieds, tickets, social) at low cost.",
    rating: 3.8,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["ScrapeBox", "GSA", "Ticket bots", "cURL"],
    notes: "HighProxies sells niche datacenter bundles tuned for particular platforms like Craigslist and ticketing sites. It is a straightforward, budget datacenter shop with no residential ambitions.",
    keywords: ["highproxies", "craigslist proxies", "ticket proxies", "shared datacenter proxies"]
  },
  {
    name: "InstantProxies",
    slug: "instantproxies",
    founded: 2013,
    hq: "United States",
    startingPrice: "$10 for 10 private proxies (~$1/proxy)",
    poolSize: "40k+ datacenter IPs",
    proxyTypes: ["datacenter"],
    locationsCount: "US-focused with some international",
    features: [
      "Flat ~$1 per private datacenter proxy",
      "Compatibility checker before purchase",
      "Instant activation and dashboard",
      "Monthly IP replacement on request"
    ],
    pros: [
      "Among the cheapest private datacenter proxies",
      "Pre-purchase compatibility test is a nice touch",
      "Dead simple, no upsells"
    ],
    cons: [
      "Datacenter-only and limited features",
      "Small pool and coarse geo options"
    ],
    bestFor: "Bargain buyers who just need a handful of cheap, private datacenter IPs for simple tasks.",
    rating: 3.7,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["ScrapeBox", "cURL", "SEO tools"],
    notes: "InstantProxies keeps things minimal: a flat dollar-per-proxy price and a checker that tests your target before you buy. It's a no-frills datacenter option for low-stakes work.",
    keywords: ["instantproxies", "cheap private proxies", "1 dollar proxies", "datacenter proxies"]
  },
  {
    name: "SquidProxies",
    slug: "squidproxies",
    founded: 2011,
    hq: "United States",
    startingPrice: "Private from ~$24/mo (10 proxies), rotating from ~$79/mo",
    poolSize: "40k+ datacenter IPs",
    proxyTypes: ["datacenter"],
    locationsCount: "Multiple US and international datacenters",
    features: [
      "Private dedicated and rotating datacenter proxies",
      "High-bandwidth 1Gbps+ network",
      "Multiple subnets and locations",
      "Unlimited bandwidth on private plans"
    ],
    pros: [
      "Fast, high-bandwidth datacenter network",
      "Unlimited bandwidth on dedicated plans",
      "Established, dependable brand"
    ],
    cons: [
      "Datacenter-only offering",
      "Interface and features feel dated"
    ],
    bestFor: "Users wanting fast, unlimited-bandwidth private datacenter proxies for SEO and bulk tasks.",
    rating: 3.8,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["ScrapeBox", "GSA", "SEO tools", "cURL"],
    notes: "SquidProxies is a long-running datacenter vendor emphasizing raw speed and unlimited bandwidth on its private plans. It remains a staple in older SEO tool tutorials.",
    keywords: ["squidproxies", "private proxies", "unlimited bandwidth datacenter", "seo proxies"]
  },
  {
    name: "ProxyMesh",
    slug: "proxymesh",
    founded: 2011,
    hq: "United States",
    startingPrice: "From $10/mo (10 GB, rotating datacenter)",
    poolSize: "Rotating datacenter pools across regional gateways",
    proxyTypes: ["datacenter"],
    locationsCount: "15+ rotating gateway locations worldwide",
    features: [
      "Rotating datacenter proxies via regional gateway hostnames",
      "Open-source proxy rotation examples and libraries",
      "World gateway that rotates across all locations",
      "Simple bandwidth-based plans"
    ],
    pros: [
      "Very developer-friendly with clear docs and code samples",
      "Stable regional gateways for predictable geo",
      "Long-trusted by engineering teams"
    ],
    cons: [
      "Datacenter-only; blocked by strict anti-bot sites",
      "Smaller IP pool per gateway"
    ],
    bestFor: "Developers who want simple, reliable rotating datacenter gateways with excellent documentation.",
    rating: 4.0,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Python", "Scrapy", "Node.js", "cURL"],
    notes: "ProxyMesh exposes rotating proxies as named regional gateways (e.g. us-wa, uk, jp) that you point your client at. It's one of the oldest developer-centric rotating datacenter services still running.",
    keywords: ["proxymesh", "rotating datacenter proxies", "gateway proxies", "developer proxies"]
  },
  {
    name: "ZenRows",
    slug: "zenrows",
    founded: 2021,
    hq: "Wilmington, Delaware, USA",
    startingPrice: "Free trial; paid from ~$69/mo (usage-based credits)",
    poolSize: "55M+ residential IPs (via Scraping Browser + proxy)",
    proxyTypes: ["residential", "datacenter"],
    locationsCount: "190+ countries geotargeting",
    features: [
      "Universal Scraper API with automatic anti-bot bypass",
      "Scraping Browser with JS rendering and fingerprinting",
      "Residential proxy add-on with geotargeting",
      "AI-assisted CSS/auto parsing"
    ],
    pros: [
      "Strong at bypassing Cloudflare, DataDome and PerimeterX",
      "Modern API and Scraping Browser combo",
      "Clear docs and quick integration"
    ],
    cons: [
      "Credit costs rise for premium proxies and JS rendering",
      "Younger company with a shorter track record"
    ],
    bestFor: "Developers battling advanced anti-bot walls (Cloudflare, DataDome) who want a managed bypass API.",
    rating: 4.4,
    authMethods: ["API token"],
    integrations: ["Python", "Node.js", "Scrapy", "Playwright", "cURL"],
    notes: "ZenRows specializes in defeating modern anti-bot systems and publishes detailed teardowns of Cloudflare and DataDome. It bundles a Scraping Browser and residential proxies behind a single API.",
    keywords: ["zenrows", "cloudflare bypass", "datadome bypass", "scraping browser"]
  },
  {
    name: "ScrapingAnt",
    slug: "scrapingant",
    founded: 2020,
    hq: "Tallinn, Estonia",
    startingPrice: "Free 10,000 credits; paid from ~$19/mo",
    poolSize: "Managed residential + datacenter pool",
    proxyTypes: ["residential", "datacenter"],
    locationsCount: "Country-level geotargeting",
    features: [
      "Headless Chrome rendering via a single API call",
      "Residential proxy rotation with anti-bot handling",
      "Screenshot and data-extraction endpoints",
      "Low-cost entry tier with a real free plan"
    ],
    pros: [
      "Affordable entry pricing and generous free credits",
      "Simple API with JS rendering built in",
      "Good fit for small automation projects"
    ],
    cons: [
      "Smaller and less battle-tested than bigger APIs",
      "Concurrency and features limited on cheap tiers"
    ],
    bestFor: "Indie developers and small automations that need cheap rendered scraping with rotating residential IPs.",
    rating: 4.1,
    authMethods: ["API token"],
    integrations: ["Python", "Node.js", "Scrapy", "cURL"],
    notes: "ScrapingAnt is a lean web-scraping API pairing headless Chrome with rotating residential proxies at a low price point. It targets solo developers and small teams rather than enterprises.",
    keywords: ["scrapingant", "headless browser api", "cheap scraping api", "rotating residential api"]
  },
  {
    name: "Crawlbase",
    slug: "crawlbase",
    founded: 2016,
    hq: "Nicosia, Cyprus",
    startingPrice: "Free 1,000 requests; Crawling API from ~$29/mo usage-based",
    poolSize: "Managed pool (datacenter + residential)",
    proxyTypes: ["datacenter", "residential"],
    locationsCount: "Country-level geotargeting",
    features: [
      "Crawling API with automatic proxy rotation and CAPTCHAs",
      "Scraper API returning structured data for major sites",
      "Crawler for async large-scale jobs with webhooks",
      "Cloud storage for scraped pages (Crawlbase Storage)"
    ],
    pros: [
      "Broad managed toolset (crawler, scraper, storage)",
      "Handles rotation and unblocking behind one endpoint",
      "Free tier for evaluation"
    ],
    cons: [
      "Abstracts away IP-level control",
      "Costs scale with request volume and difficulty"
    ],
    bestFor: "Teams wanting a managed crawling-and-scraping stack with proxies, storage and webhooks bundled.",
    rating: 4.1,
    authMethods: ["API token"],
    integrations: ["Python", "Node.js", "Ruby", "PHP", "cURL"],
    notes: "Crawlbase was formerly ProxyCrawl and pivoted toward a full managed crawling platform. Its Crawler + Storage combo lets teams queue large jobs and retrieve results asynchronously.",
    keywords: ["crawlbase", "proxycrawl", "crawling api", "managed web scraping"]
  },
  {
    name: "Scrapfly",
    slug: "scrapfly",
    founded: 2020,
    hq: "France",
    startingPrice: "Free tier; paid from ~$30/mo (credit-based)",
    poolSize: "Managed residential + datacenter pool",
    proxyTypes: ["residential", "datacenter"],
    locationsCount: "50+ countries geotargeting",
    features: [
      "Web Scraping API with anti-scraping-protection bypass",
      "JS rendering via cloud browsers with session support",
      "Extraction API using LLMs and templates",
      "Detailed observability dashboard with request logs"
    ],
    pros: [
      "Strong anti-bot bypass with transparent debugging tools",
      "Good developer experience and SDKs",
      "Screenshot, extraction and rendering in one API"
    ],
    cons: [
      "Credit accounting can be confusing at first",
      "Premium bypass features consume more credits"
    ],
    bestFor: "Developers who want a debuggable scraping API with strong anti-bot bypass and rich request observability.",
    rating: 4.3,
    authMethods: ["API token"],
    integrations: ["Python", "TypeScript", "Scrapy", "Playwright"],
    notes: "Scrapfly emphasizes observability, giving developers detailed logs of each request's proxy, headers and result. It publishes an open blog of anti-bot research alongside its API.",
    keywords: ["scrapfly", "web scraping api", "anti bot bypass", "scraping observability"]
  },
  {
    name: "Apify Proxy",
    slug: "apify-proxy",
    founded: 2015,
    hq: "Prague, Czech Republic",
    startingPrice: "Free tier ($5 credit/mo); residential ~$8/GB, datacenter cheaper",
    poolSize: "Datacenter pool + partner residential (tens of millions)",
    proxyTypes: ["datacenter", "residential"],
    locationsCount: "Country-level geotargeting",
    features: [
      "Integrated with the Apify Actors serverless scraping platform",
      "Automatic proxy rotation and session persistence",
      "Datacenter (SERP-optimized) and residential groups",
      "Works seamlessly with the open-source Crawlee library"
    ],
    pros: [
      "Deep integration with Apify's scraping cloud and Crawlee",
      "Convenient if you already run Apify Actors",
      "Session management and rotation handled for you"
    ],
    cons: [
      "Most valuable inside the Apify ecosystem",
      "Standalone residential is pricier than dedicated vendors"
    ],
    bestFor: "Developers building on the Apify Actors platform or Crawlee who want proxies wired into their scrapers.",
    rating: 4.2,
    authMethods: ["username/password", "API token"],
    integrations: ["Apify Actors", "Crawlee", "Playwright", "Puppeteer"],
    notes: "Apify Proxy is part of the broader Apify cloud, tightly coupled with its Actors runtime and the Crawlee framework it maintains. It shines as infrastructure for scrapers already hosted on Apify.",
    keywords: ["apify proxy", "crawlee proxies", "apify actors", "serverless scraping proxies"]
  },
  {
    name: "HydraProxy",
    slug: "hydraproxy",
    founded: 2020,
    hq: "United States",
    startingPrice: "Residential from ~$2.9/GB, mobile from ~$1.5/day per port",
    poolSize: "6M+ residential and mobile IPs",
    proxyTypes: ["residential", "mobile"],
    locationsCount: "100+ countries with state/city targeting",
    features: [
      "Pay-as-you-go residential with no expiration",
      "Rotating mobile 4G/5G proxies by the day or week",
      "State- and city-level targeting",
      "Instant self-serve dashboard"
    ],
    pros: [
      "Cheap flexible entry for residential and mobile",
      "Short-term daily mobile rentals available",
      "Non-expiring residential balance"
    ],
    cons: [
      "Smaller pool with regional gaps",
      "Lightweight tooling and support"
    ],
    bestFor: "Solo operators and social-media managers wanting cheap short-term mobile or non-expiring residential IPs.",
    rating: 4.0,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Multilogin", "Dolphin Anty", "GoLogin", "cURL"],
    notes: "HydraProxy is a budget residential-and-mobile shop popular for its short daily mobile rentals and non-expiring GB. It's aimed at individual multi-account and social use rather than enterprise scraping.",
    keywords: ["hydraproxy", "cheap mobile proxies", "daily mobile proxies", "non expiring residential"]
  },
  {
    name: "Live Proxies",
    slug: "live-proxies",
    founded: 2021,
    hq: "London, United Kingdom",
    startingPrice: "Residential plans from ~$45/mo",
    poolSize: "10M+ residential IPs",
    proxyTypes: ["residential", "ISP", "datacenter"],
    locationsCount: "150+ countries",
    features: [
      "Rotating and static residential with private IP allocations",
      "B2C and B2B plan tiers with dedicated subpools",
      "City and state targeting on higher tiers",
      "24/7 support with fast response times"
    ],
    pros: [
      "Private (non-shared) IP allocations reduce ban risk",
      "Responsive support and clean dashboard",
      "Good balance of rotating and static options"
    ],
    cons: [
      "Newer entrant with a shorter public track record",
      "Pool smaller than the top P2P networks"
    ],
    bestFor: "Users who want privately allocated residential IPs and responsive support without enterprise minimums.",
    rating: 4.2,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Scrapy", "Puppeteer", "Multilogin", "Dolphin Anty"],
    notes: "Live Proxies markets 'private' residential pools where your plan gets exclusive IPs rather than sharing the whole network. That model targets users burned by over-shared, pre-banned addresses.",
    keywords: ["live proxies", "private residential proxies", "dedicated residential ips", "rotating proxies"]
  },
  {
    name: "Massive",
    slug: "massive",
    founded: 2018,
    hq: "Los Angeles, California, USA",
    startingPrice: "Residential from ~$4.49/GB (pay-as-you-go)",
    poolSize: "1M+ ethically sourced residential IPs",
    proxyTypes: ["residential"],
    locationsCount: "195+ countries with city targeting",
    features: [
      "Fully consent-based, GDPR/CCPA-compliant IP sourcing",
      "SDK for app developers to monetize opt-in bandwidth",
      "City-level targeting and sticky sessions",
      "Transparent ethical-sourcing documentation"
    ],
    pros: [
      "Industry-leading compliance and consent transparency",
      "Clean, ethically sourced pool",
      "Simple pay-as-you-go pricing"
    ],
    cons: [
      "Smaller pool than legacy P2P networks",
      "Residential-only; no datacenter or mobile"
    ],
    bestFor: "Compliance-first teams that need ethically and transparently sourced residential IPs.",
    rating: 4.1,
    authMethods: ["username/password", "API token"],
    integrations: ["Scrapy", "Puppeteer", "Playwright", "cURL"],
    notes: "Massive (joinmassive.com) builds its pool entirely from explicit opt-in consent via its SDK and publishes its compliance framework openly. It appeals to buyers who need to defend their sourcing to legal teams.",
    keywords: ["massive proxies", "ethical residential proxies", "gdpr compliant proxies", "consent based proxies"]
  },
  {
    name: "ABCProxy",
    slug: "abcproxy",
    founded: 2022,
    hq: "Singapore",
    startingPrice: "Residential from ~$0.77/GB (volume), ~$4.5/GB entry",
    poolSize: "200M+ residential IPs",
    proxyTypes: ["residential", "datacenter", "ISP", "mobile"],
    locationsCount: "190+ countries with city/ASN targeting",
    features: [
      "Very aggressive per-GB volume pricing",
      "Static ISP (S5) and unlimited residential plans",
      "SOCKS5 residential client with per-IP selection",
      "Web unblocker and SERP API"
    ],
    pros: [
      "Among the lowest residential per-GB at volume",
      "Large advertised pool with broad coverage",
      "Flexible SOCKS5 and unlimited options"
    ],
    cons: [
      "Younger brand; sourcing transparency is limited",
      "Quality can be uneven across regions"
    ],
    bestFor: "Volume buyers chasing the lowest residential per-GB who can tolerate a newer, less-proven brand.",
    rating: 4.0,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Multilogin", "AdsPower", "Scrapy", "Puppeteer"],
    notes: "ABCProxy grew fast on aggressive volume pricing and a SOCKS5 residential client that lets users pick individual IPs. Its stated 200M+ pool is large but sourcing details are thin compared with veteran vendors.",
    keywords: ["abcproxy", "cheap residential proxies", "socks5 residential", "unlimited residential proxies"]
  },
  {
    name: "PYPROXY",
    slug: "pyproxy",
    founded: 2020,
    hq: "Hong Kong",
    startingPrice: "Residential from ~$0.77/GB (volume), ~$4/GB entry",
    poolSize: "90M+ residential IPs",
    proxyTypes: ["residential", "datacenter", "ISP", "static residential"],
    locationsCount: "195+ countries with city targeting",
    features: [
      "Rotating and time-based sticky residential sessions",
      "Static residential (ISP) and unlimited traffic plans",
      "SOCKS5/HTTP with API list generation",
      "Country, state and city targeting"
    ],
    pros: [
      "Low per-GB pricing at volume",
      "Large advertised residential pool",
      "Flexible session-duration control"
    ],
    cons: [
      "Limited public info on sourcing and ethics",
      "Support quality is inconsistent"
    ],
    bestFor: "Price-driven multi-account and scraping users wanting cheap residential with flexible session control.",
    rating: 3.9,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Multilogin", "AdsPower", "Dolphin Anty", "Scrapy"],
    notes: "PYPROXY is an Asia-based budget residential vendor with configurable sticky-session durations and large advertised coverage. Like many low-cost pools, its sourcing transparency lags the established brands.",
    keywords: ["pyproxy", "cheap residential proxies", "sticky session proxies", "static residential"]
  },
  {
    name: "LunaProxy",
    slug: "lunaproxy",
    founded: 2021,
    hq: "Hong Kong",
    startingPrice: "Residential from ~$0.85/GB (volume), ~$3.5/GB entry",
    poolSize: "200M+ residential IPs",
    proxyTypes: ["residential", "datacenter", "ISP", "static residential"],
    locationsCount: "195+ countries with city/ASN targeting",
    features: [
      "Aggressive tiered per-GB residential pricing",
      "Unlimited-traffic residential plans",
      "Static ISP and datacenter add-ons",
      "Web unblocker and scraping API"
    ],
    pros: [
      "Very competitive residential rates at scale",
      "Large advertised pool and broad coverage",
      "Unlimited plan option for heavy users"
    ],
    cons: [
      "Newer brand with limited sourcing disclosure",
      "Reliability varies by region and time"
    ],
    bestFor: "High-volume scrapers optimizing for the cheapest residential GB who accept a newer brand's tradeoffs.",
    rating: 3.9,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Multilogin", "AdsPower", "Scrapy", "Puppeteer"],
    notes: "LunaProxy competes almost entirely on price, undercutting Western vendors with steep volume discounts and unlimited plans. Coverage is broad on paper but real-world quality is region-dependent.",
    keywords: ["lunaproxy", "cheap residential proxies", "unlimited residential", "lunaproxy alternative"]
  },
  {
    name: "IPBurger",
    slug: "ipburger",
    founded: 2012,
    hq: "Nevis (West Indies)",
    startingPrice: "Dedicated residential from ~$75/mo, residential GB plans available",
    poolSize: "75M+ residential IPs (network partners)",
    proxyTypes: ["residential", "datacenter", "ISP"],
    locationsCount: "190+ countries",
    features: [
      "Dedicated exclusive residential IPs (fresh, non-shared)",
      "Rotating residential and static ISP options",
      "Privacy-focused company with a VPN heritage",
      "City targeting on higher tiers"
    ],
    pros: [
      "Exclusive dedicated residential IPs reduce ban risk",
      "Strong privacy and anonymity focus",
      "Established brand with a long history"
    ],
    cons: [
      "Dedicated fresh IPs cost more than shared pools",
      "Interface feels older"
    ],
    bestFor: "Account managers and privacy-focused users needing exclusive, fresh residential IPs that aren't shared.",
    rating: 4.0,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Multilogin", "Dolphin Anty", "Scrapy", "cURL"],
    notes: "IPBurger started as a VPN/privacy brand and later added dedicated 'fresh' residential IPs that belong to one customer at a time. That exclusivity suits sensitive multi-account work.",
    keywords: ["ipburger", "dedicated residential proxies", "fresh residential ips", "private proxies"]
  },
  {
    name: "GoProxies",
    slug: "goproxies",
    founded: 2022,
    hq: "Vilnius, Lithuania",
    startingPrice: "Residential from ~$3.99/GB",
    poolSize: "100M+ residential IPs",
    proxyTypes: ["residential", "datacenter", "ISP", "mobile"],
    locationsCount: "195+ countries with city targeting",
    features: [
      "AI-powered rotation and ban-avoidance logic",
      "24/7 human support with fast onboarding",
      "City-level targeting and sticky sessions",
      "SERP and e-commerce scraping helpers"
    ],
    pros: [
      "Responsive support and smooth onboarding",
      "Competitive mid-market residential pricing",
      "Clean, modern dashboard"
    ],
    cons: [
      "Younger brand still building reputation",
      "Advanced tooling thinner than market leaders"
    ],
    bestFor: "Growing teams wanting a modern, well-supported residential network at mid-market pricing.",
    rating: 4.1,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Multilogin", "AdsPower", "Scrapy", "Puppeteer"],
    notes: "GoProxies is a Lithuanian newcomer positioning on customer support and a polished UX to differentiate from the crowded budget field. It leans on AI-driven rotation as a marketing angle.",
    keywords: ["goproxies", "residential proxies", "ai rotation proxies", "goproxies alternative"]
  },
  {
    name: "Ping Proxies",
    slug: "ping-proxies",
    founded: 2021,
    hq: "London, United Kingdom",
    startingPrice: "Residential from ~$1.8/GB (volume), ISP and datacenter tiers",
    poolSize: "20M+ residential IPs",
    proxyTypes: ["residential", "ISP", "datacenter", "mobile"],
    locationsCount: "190+ countries with city/ASN targeting",
    features: [
      "Performance-focused network with low-latency routing",
      "Detailed usage analytics and API management",
      "Static ISP proxies with high uptime",
      "Sticky and rotating residential sessions"
    ],
    pros: [
      "Strong performance and low latency",
      "Transparent analytics dashboard",
      "Good ISP proxy quality"
    ],
    cons: [
      "Smaller pool than the largest networks",
      "Brand still gaining mainstream recognition"
    ],
    bestFor: "Performance-sensitive scrapers and account managers who value low latency and clear usage analytics.",
    rating: 4.1,
    authMethods: ["username/password", "IP whitelist", "API token"],
    integrations: ["Scrapy", "Puppeteer", "Multilogin", "cURL"],
    notes: "Ping Proxies emphasizes network performance and observability, exposing granular analytics on requests and latency. It has grown a following in gaming and sneaker communities for fast ISP proxies.",
    keywords: ["ping proxies", "low latency proxies", "isp proxies", "residential proxies"]
  },
  {
    name: "Mars Proxies",
    slug: "mars-proxies",
    founded: 2022,
    hq: "United Kingdom",
    startingPrice: "Residential from ~$3.5/GB, unlimited ISP plans available",
    poolSize: "9M+ residential IPs",
    proxyTypes: ["residential", "ISP"],
    locationsCount: "150+ countries",
    features: [
      "Sneaker- and sales-optimized residential IPs (UnlimIP tech)",
      "Static-like sticky sessions tuned for checkout flows",
      "City targeting for major sneaker release regions",
      "Discord-based community support"
    ],
    pros: [
      "Purpose-built for sneaker copping and drops",
      "Sticky, checkout-friendly sessions",
      "Active community and support presence"
    ],
    cons: [
      "Narrow focus limits broader enterprise use",
      "Smaller, niche-oriented pool"
    ],
    bestFor: "Sneaker resellers and drop-hunters needing checkout-stable residential IPs in key release regions.",
    rating: 4.0,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["AIO Bot", "Kodai", "Cyber AIO", "Multilogin"],
    notes: "Mars Proxies is squarely aimed at the sneaker/reselling scene, marketing 'UnlimIP' sessions that stay stable through checkout. Support and community run largely through Discord.",
    keywords: ["mars proxies", "sneaker proxies", "residential proxies", "copping proxies"]
  },
  {
    name: "Evomi",
    slug: "evomi",
    founded: 2021,
    hq: "Zurich, Switzerland",
    startingPrice: "Residential from ~$0.49/GB, datacenter and mobile tiers",
    poolSize: "12M+ residential IPs",
    proxyTypes: ["residential", "datacenter", "ISP", "mobile"],
    locationsCount: "150+ countries with city targeting",
    features: [
      "Swiss-based, privacy-forward operation",
      "Very low residential per-GB entry pricing",
      "Free trial across proxy types",
      "Browser extension and proxy generator tools"
    ],
    pros: [
      "Extremely cheap residential entry price",
      "Swiss privacy jurisdiction",
      "Real free trial to test quality"
    ],
    cons: [
      "Younger brand with a smaller pool",
      "Feature depth trails established leaders"
    ],
    bestFor: "Cost-conscious users who want cheap Swiss-hosted residential proxies with a genuine free trial.",
    rating: 4.1,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Multilogin", "AdsPower", "Scrapy", "Puppeteer"],
    notes: "Evomi is a Swiss provider undercutting the market on residential per-GB while leaning on Switzerland's strong privacy reputation. It offers free trials across all proxy types, which is rare.",
    keywords: ["evomi", "swiss proxies", "cheap residential proxies", "free trial proxies"]
  },
  {
    name: "NodeMaven",
    slug: "nodemaven",
    founded: 2022,
    hq: "London, United Kingdom",
    startingPrice: "Residential from ~$3.5/GB, sticky sessions up to 24h",
    poolSize: "30M+ residential and mobile IPs",
    proxyTypes: ["residential", "mobile", "ISP"],
    locationsCount: "150+ countries with city targeting",
    features: [
      "Real-time IP quality filtering for high 'clean IP' rates",
      "Sticky sessions up to 24 hours",
      "Non-expiring residential traffic",
      "City- and ISP-level targeting"
    ],
    pros: [
      "Focus on filtering out flagged IPs boosts success rates",
      "Long sticky sessions aid account work",
      "Traffic doesn't expire"
    ],
    cons: [
      "Newer brand still scaling its pool",
      "Premium filtering reflected in mid-range pricing"
    ],
    bestFor: "Account managers and quality-sensitive scrapers who want pre-filtered, low-ban residential and mobile IPs.",
    rating: 4.2,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Multilogin", "Dolphin Anty", "GoLogin", "Scrapy"],
    notes: "NodeMaven markets a real-time IP-quality filter that screens exits against blocklists before serving them, claiming very high clean-IP rates. Non-expiring traffic and 24-hour sessions round out its account-friendly pitch.",
    keywords: ["nodemaven", "clean ip proxies", "sticky session proxies", "residential proxies"]
  },
  {
    name: "DataImpulse",
    slug: "dataimpulse",
    founded: 2022,
    hq: "Tallinn, Estonia",
    startingPrice: "$1/GB residential (flat), $5 minimum top-up",
    poolSize: "10M+ residential IPs",
    proxyTypes: ["residential", "datacenter", "mobile"],
    locationsCount: "195+ countries with city targeting",
    features: [
      "Flat $1/GB residential with a low $5 entry",
      "Non-expiring pay-as-you-go traffic",
      "City-level targeting and sticky sessions",
      "Simple API and dashboard"
    ],
    pros: [
      "One of the cheapest flat residential per-GB rates",
      "Tiny $5 minimum lowers the barrier to entry",
      "Non-expiring balance"
    ],
    cons: [
      "Smaller, younger network with regional gaps",
      "Lighter tooling and support"
    ],
    bestFor: "Budget scrapers and testers who want flat $1/GB residential with a very low commitment.",
    rating: 4.0,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Scrapy", "Puppeteer", "Multilogin", "cURL"],
    notes: "DataImpulse offers a straightforward flat $1/GB with just a $5 minimum, making it one of the lowest-barrier residential entries. It's a lean startup pitching simplicity over feature breadth.",
    keywords: ["dataimpulse", "1 dollar per gb residential", "cheap residential proxies", "pay as you go proxies"]
  },
  {
    name: "Geonode",
    slug: "geonode",
    founded: 2021,
    hq: "Dover, Delaware, USA",
    startingPrice: "Unlimited residential from ~$29/mo, or ~$3.5/GB metered",
    poolSize: "5M+ residential IPs",
    proxyTypes: ["residential", "datacenter", "mobile", "ISP"],
    locationsCount: "140+ countries",
    features: [
      "Unlimited-bandwidth residential plans by concurrent requests",
      "Metered pay-as-you-go option too",
      "Rotating and sticky sessions",
      "Scraper API and country targeting"
    ],
    pros: [
      "Unlimited residential bandwidth is unusual and cost-effective",
      "Choice of unlimited or metered billing",
      "Reasonable entry pricing"
    ],
    cons: [
      "Unlimited plans cap concurrency",
      "Pool smaller than top-tier networks"
    ],
    bestFor: "Heavy residential users who prefer unlimited-bandwidth plans billed by concurrency rather than gigabytes.",
    rating: 3.9,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Scrapy", "Puppeteer", "Selenium", "cURL"],
    notes: "Geonode is one of the few vendors offering true unlimited-bandwidth residential plans, priced by concurrent connections instead of GB. That model suits bandwidth-heavy jobs with predictable concurrency.",
    keywords: ["geonode", "unlimited residential proxies", "concurrency based proxies", "residential proxies"]
  },
  {
    name: "Proxidize",
    slug: "proxidize",
    founded: 2019,
    hq: "Wilmington, Delaware, USA",
    startingPrice: "Hardware kits from ~$399 one-time + SIM/data costs",
    poolSize: "Self-hosted (you build your own mobile pool)",
    proxyTypes: ["mobile", "ISP"],
    locationsCount: "Anywhere you deploy hardware",
    features: [
      "Software + hardware to build your own 4G/5G mobile proxy farm",
      "Full control over IP rotation via carrier reconnects",
      "Dashboard to manage modems and proxy ports",
      "No per-GB fees once hardware is running"
    ],
    pros: [
      "Genuine carrier mobile IPs you fully control",
      "No recurring bandwidth metering",
      "Ideal for agencies wanting private mobile infrastructure"
    ],
    cons: [
      "Requires hardware, SIMs and technical setup",
      "Geo limited to where you physically deploy modems"
    ],
    bestFor: "Agencies and power users who want to own a private, fully controlled 4G/5G mobile proxy farm.",
    rating: 4.2,
    authMethods: ["username/password", "IP whitelist"],
    integrations: ["Multilogin", "Dolphin Anty", "GoLogin", "cURL"],
    notes: "Proxidize is not a pool reseller — it sells software and modem hardware so you build and operate your own mobile proxies with real SIM cards. Rotation happens by forcing carrier reconnects on the modems you own.",
    keywords: ["proxidize", "mobile proxy hardware", "build your own mobile proxies", "4g proxy farm"]
  }
];
