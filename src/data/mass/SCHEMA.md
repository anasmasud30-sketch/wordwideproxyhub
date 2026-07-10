# Mass-page data contract (v1)

Every data module lives in `src/data/mass/` and does `export default <array>` (ESM).
Fields marked **required**. Extra fields are allowed. Strings should be plain text
(no HTML), factual, and specific. `slug` = lowercase kebab-case, unique within its file.
Arrays of sentences should be full, punctuated sentences.

## countries — `geo_<continent>.js` → default export: Country[]
```
Country = {
  name: string,            // "Germany"                         (required)
  slug: string,            // "germany"                         (required)
  iso2: string,            // "DE"                              (required)
  continent: string,       // "Europe"                          (required)
  region: string,          // "Western Europe"
  capital: string,         // "Berlin"                          (required)
  majorCities: string[],   // ["Berlin","Munich","Hamburg",...] (>=3, required)
  languages: string[],     // ["German"]
  currency: string,        // "Euro (EUR)"
  timezone: string,        // "CET (UTC+1)"
  population: string,      // "83 million"
  topISPs: string[],       // ["Deutsche Telekom","Vodafone DE","1&1"]  (>=2, required)
  popularTargets: string[],// ["Zalando","Otto","Amazon.de","Idealo"]   (>=3, required)
  useCases: string[],      // ["localized SERP tracking","price monitoring on .de retail", ...] (>=3, required)
  intent: string,          // 1-2 sentences: why someone buys proxies here (required, unique per country)
  keywords: string[]       // ["germany proxies","german residential proxies","buy proxies germany", ...] (>=4, required)
}
```

## cities — `geo_cities.js` → default export: City[]  (~250-350 major cities)
```
City = { name, slug, country, countrySlug, iso2, region, notes(1 sentence, city-specific), keywords[] }  // all required except region
```

## providers — `providers50.js` → default export: Provider[]  (~48 REAL proxy providers)
```
Provider = {
  name, slug, founded(string yr), hq,                                   (required: name, slug)
  startingPrice,          // "$0.50/GB" or "$1.75/GB"
  poolSize,               // "10M+ residential IPs"
  proxyTypes: string[],   // ["residential","datacenter","mobile","ISP"]  (required)
  locationsCount,         // "150+ countries"
  features: string[],     // (>=4)
  pros: string[],         // (>=3, required)
  cons: string[],         // (>=2, required)
  bestFor: string,        // one sentence
  rating: number,         // 3.5 - 4.9
  authMethods: string[],  // ["user:pass","IP allowlist"]
  integrations: string[], // ["Python","Scrapy","Selenium","Puppeteer"]
  notes: string,          // 1-2 sentences, provider-specific (required, unique)
  keywords: string[]      // (>=3, required)
}
```
Include real, well-known providers (Bright Data, Oxylabs, Smartproxy/Decodo, Soax, IPRoyal,
Webshare, NetNut, Rayobyte, Proxy-Cheap, ProxyEmpire, Infatica, GeoSurf, Storm Proxies,
PacketStream, Nimble, Zyte, ScraperAPI, Bright Data alternatives, etc.). Keep facts approximate
but plausible; DO NOT invent fake companies. Mark none as "Cheapest Proxies" (that's our featured brand, injected separately).

## targets — `targets_<category>.js` → default export: Target[]
```
Target = {
  name, slug, category,               // category e.g. "E-commerce","Social Media","Sneakers & Retail","Travel","SEO & Marketing","Ad Tech","Streaming","Gaming","Finance","Jobs & Real Estate"
  subcategory,
  difficulty,                         // "low" | "medium" | "high" | "very high"   (anti-bot strength) (required)
  recommendedProxyType,               // "residential" | "mobile" | "datacenter" | "ISP" | "rotating residential"  (required)
  whyProxies: string,                 // 1-2 sentences specific to this target (required, unique)
  commonBlocks: string[],             // ["rate limiting","IP bans","CAPTCHA","device fingerprinting"] (>=2)
  tips: string[],                     // (>=2) target-specific
  notes: string,
  keywords: string[]                  // (>=3, required) e.g. ["amazon proxies","scrape amazon","amazon scraping proxies"]
}
```

## tools — `tools.js` → default export: Tool[]  (~50 languages/libraries/frameworks/tools)
```
Tool = {
  name, slug, language,               // language e.g. "Python","JavaScript","Go","Ruby","PHP","Shell","Java"
  category,                           // "HTTP client" | "Browser automation" | "Scraping framework" | "Scraper API" | "Tool"
  proxySupport: string,              // 1 sentence on how it supports proxies (required, unique)
  configNote: string,                // 1 sentence describing how you'd set a proxy (plain English, NO code)
  commonErrors: string[],            // (>=2) e.g. ["407 Proxy Authentication Required","SSL cert errors on HTTPS proxy"]
  tips: string[],                    // (>=2)
  notes: string,
  keywords: string[]                 // (>=3, required)
}
```

## how-tos — `howto_<category>.js` → default export: HowTo[]
```
HowTo = {
  title,                              // "How to rotate proxies in Python requests"  (required)
  slug,                               // "rotate-proxies-python-requests"             (required)
  category,                           // "Scraping","Automation","Proxy setup","Anti-bot","Data"
  intent: string,                     // 1-2 sentences on who needs this + why (required, unique)
  stepsOutline: string[],             // (>=4) short step descriptions, plain English (required)
  tools: string[],                    // ["Python","requests"]
  pitfalls: string[],                 // (>=2)
  keywords: string[]                  // (>=3, required)
}
```

## glossary — `glossary200.js` → default export: Glossary[]
```
Glossary = { term, slug, short(1 sentence), long(2-3 sentences), related: string[], keywords: string[] }  // all required
```

## content banks — `bank_<type>.js` → default export: Bank
`<type>` in: location, compare, provider, usecase, integration, howto, shared
```
Bank = {
  intros: string[],          // >=25 full intro paragraphs. Use the literal token {TOPIC} where the page subject goes. Vary structure/wording heavily.
  sections: {title: string, body: string}[],  // >=18 reusable section blocks; body may use {TOPIC}. Titles are H2-worthy.
  faqs: {q: string, a: string}[],              // >=30 Q/A pairs, may use {TOPIC}
  benefits: string[],        // >=20 benefit sentences, may use {TOPIC}
  ctas: string[],            // >=8 call-to-action paragraphs (Cheapest Proxies is our featured budget provider — shown first)
  transitions: string[]      // >=12 connective sentences
}
```
Rules for banks: NO HTML. Heavy wording variety (these rotate across thousands of pages, so
repetition looks spammy). `{TOPIC}` is the only placeholder. Keep proxy advice accurate.
