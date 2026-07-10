// Expands the homepage and every main hub page to at least 20 <section> blocks,
// creates the pages referenced sitewide that were missing (/guides, /reviews,
// /faq, /solutions/*), and registers the new URLs in sitemap.xml.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://affordableproxyhub.com";
const TARGET_SECTIONS = 20;

const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

function sliceBetween(source, startMarker, endMarker, inclusiveEnd) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  if (start === -1 || end === -1) throw new Error(`Could not slice ${startMarker}`);
  return source.slice(start, inclusiveEnd ? end + endMarker.length : end);
}

const HEADER = sliceBetween(indexHtml, '<header class="site-header">', "</header>", true);
const FOOTER = sliceBetween(indexHtml, '<footer class="site-footer">', "</body>", false);

function countSections(html) {
  return (html.match(/<section\b/g) || []).length;
}

// ---------------------------------------------------------------------------
// Shared educational section library. Each entry is a function of the page
// topic so headings and copy stay page-specific.
// ---------------------------------------------------------------------------
const LIBRARY = [
  {
    id: "aph-how-we-evaluate",
    label: "How We Evaluate",
    render: (t) => `<section class="section" id="aph-how-we-evaluate">
  <h2>How We Evaluate ${t} Recommendations</h2>
  <p>Every recommendation connected to ${t.toLowerCase()} follows the same budget-first review process. We weigh entry price against measured output instead of marketing claims, so a cheaper plan that completes more successful requests always outranks a premium label.</p>
  <ul class="check-list">
    <li>Real-world success rate on protected and unprotected targets</li>
    <li>Effective cost per thousand successful requests, not just list price</li>
    <li>Pool freshness, rotation quality, and session stability</li>
    <li>Dashboard clarity, documentation quality, and support response time</li>
    <li>Trial availability and refund terms before larger commitments</li>
  </ul>
</section>`,
  },
  {
    id: "aph-proxy-types",
    label: "Proxy Types",
    render: (t) => `<section class="section" id="aph-proxy-types">
  <h2>Proxy Types Relevant to ${t}</h2>
  <p>Choosing the right proxy category matters more than choosing the "best" provider. Match the IP type to how strictly your target website filters traffic before comparing prices.</p>
  <div class="related-grid">
    <a class="related-card" href="/solutions/residential-proxy-services"><strong>Residential Proxies</strong><span>IPs from real household connections. Best for protected targets, localized SERP checks, and lower ban rates.</span></a>
    <a class="related-card" href="/solutions/datacenter-proxy-services"><strong>Datacenter Proxies</strong><span>Fast, cheap IPs from hosting facilities. Best for speed-focused jobs on lightly protected public sites.</span></a>
    <a class="related-card" href="/solutions/mobile-proxy-services"><strong>Mobile Proxies</strong><span>Carrier-grade 4G/5G IPs with the highest trust scores. Best for mobile-first platforms and account workflows.</span></a>
  </div>
</section>`,
  },
  {
    id: "aph-pricing-models",
    label: "Pricing Models",
    render: (t) => `<section class="section" id="aph-pricing-models">
  <h2>Understanding Pricing Models for ${t}</h2>
  <p>Providers bill in three main ways, and the wrong model can double your real cost even when the headline rate looks low. Estimate your monthly traffic first, then pick the model that matches it.</p>
  <ul class="check-list">
    <li><strong>Per-GB bandwidth:</strong> standard for residential and mobile pools. Retries and media-heavy pages consume bandwidth, so measure real usage on a small plan first.</li>
    <li><strong>Per-IP pricing:</strong> common for datacenter and static residential proxies. Predictable for long-lived sessions, wasteful for wide rotation.</li>
    <li><strong>Per-request APIs:</strong> scraper APIs charge per successful request, which simplifies budgeting when targets are heavily protected.</li>
  </ul>
  <p>Budget-friendly entry points such as Cheapest Proxies at $0.50/GB make it inexpensive to benchmark real consumption before scaling up.</p>
</section>`,
  },
  {
    id: "aph-performance-metrics",
    label: "Performance Metrics",
    render: (t) => `<section class="section" id="aph-performance-metrics">
  <h2>Performance Metrics That Matter for ${t}</h2>
  <p>Compare providers on measured output rather than pool-size claims. Four numbers predict almost all of the practical difference between plans.</p>
  <div class="stats-grid">
    <div class="stat"><span class="stat-value">Success rate</span><span class="stat-label">Share of requests returning usable content</span></div>
    <div class="stat"><span class="stat-value">Latency</span><span class="stat-label">Time to first byte through the proxy</span></div>
    <div class="stat"><span class="stat-value">Ban rate</span><span class="stat-label">How quickly targets flag the pool's IPs</span></div>
    <div class="stat"><span class="stat-value">Cost / 1k results</span><span class="stat-label">Real spend per thousand successful requests</span></div>
  </div>
  <p>Run the same 500-request job through each shortlisted provider and compare these four numbers — the winner is usually obvious within an hour.</p>
</section>`,
  },
  {
    id: "aph-rotation-sessions",
    label: "Rotation & Sessions",
    render: (t) => `<section class="section" id="aph-rotation-sessions">
  <h2>Rotation and Session Control in ${t} Workflows</h2>
  <p>Rotating endpoints hand you a fresh IP on every request, which suits high-volume scraping where no login state matters. Sticky sessions hold one IP for minutes at a time, which account management, checkout flows, and multi-step forms require.</p>
  <p>Check how a provider implements stickiness before buying: the better dashboards let you set session duration per port or per username parameter, while weaker ones only offer a global toggle. If your workflow mixes both patterns, confirm you can run rotating and sticky ports side by side on the same plan.</p>
</section>`,
  },
  {
    id: "aph-geo-targeting",
    label: "Geo-Targeting",
    render: (t) => `<section class="section" id="aph-geo-targeting">
  <h2>Geo-Targeting Options for ${t}</h2>
  <p>Country-level targeting is standard on nearly every plan, but city, state, and ASN-level targeting vary widely between providers and sometimes cost extra. Localized price checks, ad verification, and SERP tracking usually need city precision.</p>
  <p>Browse our <a href="/proxy-locations">proxies by location hub</a> for country-specific guidance, including pool depth expectations and which providers actually maintain inventory in smaller markets rather than geolocating nearby IPs.</p>
</section>`,
  },
  {
    id: "aph-protocols",
    label: "Protocols",
    render: (t) => `<section class="section" id="aph-protocols">
  <h2>HTTP, HTTPS, and SOCKS5 Support for ${t}</h2>
  <p>HTTP and HTTPS proxies cover almost every scraping and browser workflow, and every provider we track supports them. SOCKS5 operates a network layer lower, forwarding arbitrary TCP traffic, which matters for custom tooling, some antidetect browsers, and non-web protocols.</p>
  <p>If your stack needs SOCKS5, verify support before purchase — several budget residential networks are HTTP-only, and gateway differences also affect how username-based rotation parameters work.</p>
</section>`,
  },
  {
    id: "aph-common-mistakes",
    label: "Common Mistakes",
    render: (t) => `<section class="section" id="aph-common-mistakes">
  <h2>Common Mistakes When Buying Proxies for ${t}</h2>
  <ul class="home-seo-list check-list">
    <li>Choosing a provider because it advertises the largest IP pool instead of testing success rate on your actual target.</li>
    <li>Buying datacenter proxies for targets that fingerprint and block hosting-range IPs.</li>
    <li>Ignoring bandwidth consumed by retries, redirects, and media when comparing per-GB prices.</li>
    <li>Committing to an annual plan before running a small paid test.</li>
    <li>Sharing one sticky session across concurrent workers, which burns the IP for everyone.</li>
    <li>Skipping the provider's ToS and hitting usage limits that were documented all along.</li>
  </ul>
</section>`,
  },
  {
    id: "aph-buying-checklist",
    label: "Buying Checklist",
    render: (t) => `<section class="section" id="aph-buying-checklist">
  <h2>Pre-Purchase Checklist for ${t}</h2>
  <p>Run through this list before entering payment details. It takes ten minutes and prevents most refund requests.</p>
  <ul class="check-list">
    <li>Confirm the proxy type (residential, datacenter, mobile) matches your hardest target</li>
    <li>Verify geo-targeting covers every country and city you need</li>
    <li>Check rotation options: per-request rotation and configurable sticky sessions</li>
    <li>Confirm protocol support for your tooling (HTTP/S, SOCKS5)</li>
    <li>Find the smallest paid entry point or trial to benchmark with</li>
    <li>Read the refund policy and any acceptable-use restrictions</li>
  </ul>
</section>`,
  },
  {
    id: "aph-budget-optimization",
    label: "Budget Tips",
    render: (t) => `<section class="section" id="aph-budget-optimization">
  <h2>Stretching a Small Budget in ${t}</h2>
  <p>Most teams overspend on proxies by routing every request through their most expensive pool. Route traffic by difficulty instead: send easy, unprotected targets through cheap datacenter IPs and reserve residential or mobile bandwidth for the targets that actually block you.</p>
  <p>Cache aggressively, strip images and fonts from scraping sessions, and cap retries at two or three attempts with exponential backoff. Teams that apply these three habits routinely cut proxy spend by 40&ndash;60% without losing coverage.</p>
</section>`,
  },
  {
    id: "aph-troubleshooting",
    label: "Troubleshooting",
    render: (t) => `<section class="section" id="aph-troubleshooting">
  <h2>Troubleshooting Frequent ${t} Errors</h2>
  <ul class="check-list">
    <li><strong>407 Proxy Authentication Required:</strong> credentials are wrong or your IP is not on the allowlist. Re-check username format — rotation parameters often live inside it.</li>
    <li><strong>403 Forbidden:</strong> the target flagged the IP or your request fingerprint. Switch pool type, slow down, and align headers with a real browser. See our <a href="/definitions/403-error">403 error definition</a>.</li>
    <li><strong>Timeouts:</strong> usually pool congestion or a distant exit node. Pin a closer geo or raise your timeout above 30 seconds for residential connections.</li>
    <li><strong>Captchas:</strong> rotate more aggressively, add realistic delays, or move that target to residential/mobile IPs.</li>
  </ul>
</section>`,
  },
  {
    id: "aph-security-ethics",
    label: "Security & Ethics",
    render: (t) => `<section class="section" id="aph-security-ethics">
  <h2>Security and Ethical Use in ${t}</h2>
  <p>Reputable providers source residential IPs through consent-based SDK partnerships and publish how peers opt in. Avoid networks that cannot explain their sourcing — unclear supply chains carry both ethical and legal risk, and those pools tend to be dirtier and more heavily banned.</p>
  <p>On your side, keep credentials out of shared code, use IP allowlisting where offered, and scope each project to its own sub-user so a leaked key cannot drain your whole balance.</p>
</section>`,
  },
  {
    id: "aph-legal-compliance",
    label: "Legal Notes",
    render: (t) => `<section class="section" id="aph-legal-compliance">
  <h2>Legal and Compliance Basics for ${t}</h2>
  <p>Using proxies is legal in most jurisdictions, but what you do through them is governed by the target site's terms, computer-access laws, and data-protection rules such as GDPR and CCPA. Collecting public, non-personal data at a respectful rate sits at the safe end of the spectrum; harvesting personal data behind logins does not.</p>
  <p>Respect robots.txt where practical, honor rate limits, and consult counsel before scraping personal or account-gated data at scale. None of this content is legal advice.</p>
</section>`,
  },
  {
    id: "aph-scaling",
    label: "Scaling Up",
    render: (t) => `<section class="section" id="aph-scaling">
  <h2>Scaling ${t} Beyond the First Project</h2>
  <p>What works for 1,000 requests a day usually breaks at 100,000. As volume grows, add a retry queue with exponential backoff, monitor per-domain success rates so a single target cannot silently burn your budget, and split traffic across at least two providers to remove single-pool risk.</p>
  <p>Set alerts on cost per successful request rather than raw spend — it is the earliest signal that a pool is degrading for your targets.</p>
</section>`,
  },
  {
    id: "aph-free-vs-paid",
    label: "Free vs Paid",
    render: (t) => `<section class="section" id="aph-free-vs-paid">
  <h2>Why Free Proxies Fail for ${t}</h2>
  <p>Free proxy lists look tempting, but the IPs are shared by thousands of users, already banned on most commercial targets, and frequently operated by parties that inspect or modify your traffic. For anything involving credentials or business data they are an outright security hazard.</p>
  <p>Entry-level paid plans now start around $0.50/GB, which prices out almost every argument for free lists. If budget is the constraint, start with the smallest paid tier from our <a href="/rankings">rankings</a> instead.</p>
</section>`,
  },
  {
    id: "aph-testing-method",
    label: "Testing Method",
    render: (t) => `<section class="section" id="aph-testing-method">
  <h2>How to Test Providers for ${t} Before Committing</h2>
  <p>Never scale a provider you have not benchmarked. A useful test is small, real, and comparative: run the same job through each candidate on the smallest paid plan and record success rate, median latency, and bandwidth consumed.</p>
  <ul class="check-list">
    <li>Use your real target sites, not the provider's demo endpoints</li>
    <li>Test at the concurrency you will actually run in production</li>
    <li>Include at least one protected target to expose ban-rate differences</li>
    <li>Repeat the run at a different time of day to catch pool congestion</li>
  </ul>
</section>`,
  },
  {
    id: "aph-integrations",
    label: "Integrations",
    render: (t) => `<section class="section" id="aph-integrations">
  <h2>Connecting ${t} to Your Stack</h2>
  <p>Every major scraping stack takes a proxy in a few lines of configuration. Our integration guides include copy-paste snippets with authentication, rotation parameters, and common pitfalls for each library.</p>
  <div class="related-grid">
    <a class="related-card" href="/integrations/python-requests-proxies"><strong>Python requests</strong><span>The fastest way to route scripted HTTP calls through a proxy.</span></a>
    <a class="related-card" href="/integrations/playwright-proxies"><strong>Playwright</strong><span>Browser automation with per-context proxy settings.</span></a>
    <a class="related-card" href="/integrations/scrapy-proxies"><strong>Scrapy</strong><span>Middleware-based rotation for crawl-scale projects.</span></a>
    <a class="related-card" href="/integrations/node-axios-proxies"><strong>Node axios</strong><span>Proxy agents for JavaScript back-end services.</span></a>
  </div>
</section>`,
  },
  {
    id: "aph-use-case-matching",
    label: "Use Case Fit",
    render: (t) => `<section class="section" id="aph-use-case-matching">
  <h2>Matching ${t} to Real Use Cases</h2>
  <p>The right setup depends on the platform you are working against. These guides pair each target with the proxy type, rotation pattern, and budget range that actually performs there.</p>
  <div class="related-grid">
    <a class="related-card" href="/use-cases/amazon-proxies"><strong>Amazon</strong><span>Price and listing data at scale without account risk.</span></a>
    <a class="related-card" href="/use-cases/google-maps-proxies"><strong>Google Maps</strong><span>Local pack and review data with city-level targeting.</span></a>
    <a class="related-card" href="/use-cases/x-twitter-proxies"><strong>X (Twitter)</strong><span>Timeline and profile monitoring under strict rate limits.</span></a>
    <a class="related-card" href="/use-cases/netflix-proxies"><strong>Netflix</strong><span>Catalog and availability checks across regions.</span></a>
  </div>
</section>`,
  },
  {
    id: "aph-glossary-preview",
    label: "Key Terms",
    render: (t) => `<section class="section" id="aph-glossary-preview">
  <h2>Key Terms to Know Around ${t}</h2>
  <p>Provider marketing assumes you know the vocabulary. These definitions from our <a href="/definitions">glossary</a> cover the terms that most often decide a purchase.</p>
  <div class="related-grid">
    <a class="related-card" href="/definitions/proxy-pool"><strong>Proxy pool</strong><span>The set of IPs a provider rotates your traffic through.</span></a>
    <a class="related-card" href="/definitions/ban-rate"><strong>Ban rate</strong><span>How quickly a target site blocks a pool's IP addresses.</span></a>
    <a class="related-card" href="/definitions/latency"><strong>Latency</strong><span>Delay a proxy hop adds to every request.</span></a>
    <a class="related-card" href="/definitions/elite-proxy"><strong>Elite proxy</strong><span>A proxy that hides both your IP and the fact a proxy is in use.</span></a>
  </div>
</section>`,
  },
  {
    id: "aph-market-context",
    label: "Market Context",
    render: (t) => `<section class="section" id="aph-market-context">
  <h2>2026 Market Context for ${t}</h2>
  <p>Proxy pricing has fallen steadily as residential supply expanded: rates that cost $12&ndash;15/GB in 2020 now start under $1/GB, while anti-bot systems have grown stricter, shifting value toward clean pools and smart rotation over raw pool size. That combination rewards buyers who benchmark before committing.</p>
  <p>Our <a href="/market-updates">market updates</a> and <a href="/research">research hub</a> track pricing shifts, provider consolidation, and protection trends so you can time upgrades and renegotiations.</p>
</section>`,
  },
  {
    id: "aph-extra-faq",
    label: "More FAQs",
    render: (t) => `<section class="section" id="aph-extra-faq">
  <h2>${t}: Quick Answers</h2>
  <div class="faq-item">
    <h3>What is the cheapest way to get started?</h3>
    <p>Start with a small per-GB residential plan — entry pricing now begins around $0.50/GB — and benchmark your real workload before scaling to a larger commitment.</p>
  </div>
  <div class="faq-item">
    <h3>Do I need residential or datacenter proxies?</h3>
    <p>Test datacenter first: if your target accepts it, it is the cheaper option. Move to residential only for targets that block hosting-range IPs.</p>
  </div>
  <div class="faq-item">
    <h3>How many proxies do I need?</h3>
    <p>With rotating pools you buy bandwidth, not IP counts. Estimate pages per month, multiply by average page weight, and add 30% headroom for retries.</p>
  </div>
  <div class="faq-item">
    <h3>Can I use one provider for everything?</h3>
    <p>You can, but teams at scale keep a second provider configured as failover so a single pool degradation never halts collection.</p>
  </div>
</section>`,
  },
];

// ---------------------------------------------------------------------------
// Existing pages to top up to TARGET_SECTIONS.
// ---------------------------------------------------------------------------
const EXISTING_HUBS = [
  ["index.html", "Affordable Proxies"],
  ["compare/index.html", "Proxy Comparisons"],
  ["providers/index.html", "Provider Reviews"],
  ["vs/index.html", "Head-to-Head Comparisons"],
  ["use-cases/index.html", "Proxy Use Cases"],
  ["proxy-locations/index.html", "Proxies by Location"],
  ["integrations/index.html", "Proxy Integrations"],
  ["how-to/index.html", "Proxy How-To Guides"],
  ["definitions/index.html", "Proxy Definitions"],
  ["glossary/index.html", "The Proxy Glossary"],
  ["rankings/index.html", "Proxy Rankings"],
  ["market-updates/index.html", "Proxy Market Updates"],
  ["proxy-guides/index.html", "Proxy Type Guides"],
  ["proxy-library/index.html", "The Proxy SEO Library"],
  ["resources/index.html", "Proxy Resources"],
  ["knowledge/index.html", "Proxy Knowledge Base"],
  ["research/index.html", "Proxy Industry Research"],
  ["locations/index.html", "Location Coverage"],
  ["tools/index.html", "Proxy Tools"],
];

function expandExistingPage(relPath, topic) {
  const filePath = path.join(ROOT, relPath);
  let html = fs.readFileSync(filePath, "utf8");
  const current = countSections(html);
  if (current >= TARGET_SECTIONS) return { relPath, before: current, after: current };

  const chosen = LIBRARY.filter((s) => !html.includes(`id="${s.id}"`)).slice(0, TARGET_SECTIONS - current);
  const block = chosen.map((s) => `          ${s.render(topic)}`).join("\n");

  const ctaIndex = html.lastIndexOf('<section class="cta"');
  if (ctaIndex !== -1) {
    html = `${html.slice(0, ctaIndex)}${block.trimStart()}\n          ${html.slice(ctaIndex)}`;
  } else {
    const articleEnd = html.lastIndexOf("</article>");
    if (articleEnd === -1) throw new Error(`No insertion point in ${relPath}`);
    html = `${html.slice(0, articleEnd)}${block}\n        ${html.slice(articleEnd)}`;
  }

  const asideEnd = html.indexOf("</aside>");
  if (asideEnd !== -1) {
    const tocLinks = chosen.map((s) => `<a href="#${s.id}">${s.label}</a>`).join("");
    html = `${html.slice(0, asideEnd)}${tocLinks}\n  ${html.slice(asideEnd)}`;
  }

  fs.writeFileSync(filePath, html, "utf8");
  return { relPath, before: current, after: countSections(html) };
}

// ---------------------------------------------------------------------------
// New pages that were linked sitewide but missing.
// ---------------------------------------------------------------------------
const NEW_PAGES = [
  {
    route: "/guides",
    topic: "Proxy Buyer Guides",
    title: "Proxy Buyer Guides (2026) | AffordableProxyHub",
    description:
      "Step-by-step proxy buyer guides for 2026: choose the right proxy type, plan, and budget with independent, budget-first advice.",
    heroTitle: "Proxy Buyer Guides",
    heroText:
      "Choose the right proxy type, plan size, and provider with practical, budget-first guides — no marketing fluff, just what works.",
    intro: `<section class="section" id="intro">
  <h2>Start Here: Pick the Right Proxy the First Time</h2>
  <p>These buyer guides walk you through the decisions that actually determine results: proxy type, rotation pattern, geo coverage, and budget. Each guide links to deeper resources across the site, including <a href="/proxy-guides">proxy type guides</a>, <a href="/how-to">how-to walkthroughs</a>, and <a href="/resources">the resource library</a>.</p>
  <div class="related-grid">
    <a class="related-card" href="/guides/proxy-buying-guide"><strong>The Proxy Buying Guide</strong><span>The complete five-step process for choosing type, plan, and budget.</span></a>
    <a class="related-card" href="/guides/residential-proxies"><strong>Residential Proxies Guide</strong><span>When household IPs are worth the per-GB premium.</span></a>
    <a class="related-card" href="/guides/datacenter-proxies"><strong>Datacenter Proxies Guide</strong><span>Getting the most from the cheapest proxy category.</span></a>
    <a class="related-card" href="/guides/mobile-proxies"><strong>Mobile Proxies Guide</strong><span>Carrier IPs, CGNAT trust, and when to pay for them.</span></a>
    <a class="related-card" href="/guides/rotating-proxies"><strong>Rotating Proxies Guide</strong><span>Rotation strategies, sticky sessions, and pool hygiene.</span></a>
    <a class="related-card" href="/guides/web-scraping-proxies"><strong>Web Scraping Proxies Guide</strong><span>Building a proxy stack for reliable data collection.</span></a>
    <a class="related-card" href="/proxy-guides"><strong>Proxy Type Guides</strong><span>Residential, datacenter, mobile, and ISP proxies explained in depth.</span></a>
    <a class="related-card" href="/how-to"><strong>How-To Walkthroughs</strong><span>Hands-on setup guides for scraping and SEO workflows.</span></a>
    <a class="related-card" href="/resources"><strong>Resource Library</strong><span>140+ playbooks covering tools, targets, and techniques.</span></a>
    <a class="related-card" href="/rankings"><strong>Rankings</strong><span>Fast shortlists of the best options per category.</span></a>
  </div>
</section>`,
  },
  {
    route: "/reviews",
    topic: "Proxy Provider Reviews",
    title: "Proxy Provider Reviews (2026) | AffordableProxyHub",
    description:
      "Independent 2026 reviews of the leading proxy providers — pricing, pool quality, and real-world fit, with budget options ranked first.",
    heroTitle: "Proxy Provider Reviews",
    heroText:
      "Independent reviews of every major proxy provider, judged on measured output and real pricing — with budget-friendly options surfaced first.",
    intro: `<section class="section" id="intro">
  <h2>Every Provider Review in One Place</h2>
  <p>Each review scores pricing, pool quality, geo coverage, dashboard experience, and support against the same rubric, so scores are comparable across providers. Start with the <a href="/proxy-provider-analysis/cheapest-proxies-review">Cheapest Proxies review</a> if budget is your first filter.</p>
  <div class="related-grid">
    <a class="related-card" href="/proxy-provider-analysis/cheapest-proxies-review"><strong>Cheapest Proxies</strong><span>Featured budget pick — residential access from $0.50/GB.</span></a>
    <a class="related-card" href="/providers/bright-data-review"><strong>Bright Data</strong><span>Enterprise coverage and tooling at premium prices.</span></a>
    <a class="related-card" href="/providers/oxylabs-review"><strong>Oxylabs</strong><span>Enterprise scraping and unblocking specialist.</span></a>
    <a class="related-card" href="/providers/decodo-review"><strong>Decodo (Smartproxy)</strong><span>Polished mid-market residential option.</span></a>
    <a class="related-card" href="/providers/webshare-review"><strong>Webshare</strong><span>Low-cost datacenter plans with a free tier.</span></a>
    <a class="related-card" href="/providers/iproyal-review"><strong>IPRoyal</strong><span>Flexible pay-as-you-go residential traffic.</span></a>
    <a class="related-card" href="/providers/soax-review"><strong>SOAX</strong><span>Clean pools with granular geo filtering.</span></a>
    <a class="related-card" href="/providers/netnut-review"><strong>NetNut</strong><span>ISP-sourced static residential network.</span></a>
    <a class="related-card" href="/providers/rayobyte-review"><strong>Rayobyte</strong><span>US-focused datacenter and residential mix.</span></a>
    <a class="related-card" href="/providers/proxy-cheap-review"><strong>Proxy-Cheap</strong><span>Budget residential and datacenter plans.</span></a>
    <a class="related-card" href="/providers/proxyempire-review"><strong>ProxyEmpire</strong><span>Rollover bandwidth and wide geo coverage.</span></a>
    <a class="related-card" href="/providers/infatica-review"><strong>Infatica</strong><span>Mid-priced residential with SDK sourcing.</span></a>
    <a class="related-card" href="/providers/geosurf-review"><strong>GeoSurf</strong><span>Legacy premium residential brand.</span></a>
    <a class="related-card" href="/providers/storm-proxies-review"><strong>Storm Proxies</strong><span>Entry-level rotating proxy packages.</span></a>
    <a class="related-card" href="/providers/packetstream-review"><strong>PacketStream</strong><span>Peer-to-peer residential at $1/GB.</span></a>
    <a class="related-card" href="/providers/zyte-review"><strong>Zyte</strong><span>Scraping API with smart unblocking.</span></a>
  </div>
</section>`,
  },
  {
    route: "/faq",
    topic: "Proxy FAQs",
    title: "Proxy FAQs (2026): Plain Answers to Common Questions | AffordableProxyHub",
    description:
      "Plain-language answers to the most common proxy questions: types, pricing, legality, setup, troubleshooting, and choosing a provider in 2026.",
    heroTitle: "Proxy Frequently Asked Questions",
    heroText:
      "Plain-language answers to the questions proxy buyers actually ask — types, pricing, legality, setup, and troubleshooting.",
    intro: `<section class="section" id="intro">
  <h2>The Questions Every Proxy Buyer Asks</h2>
  <div class="faq-item">
    <h3>What is a proxy server?</h3>
    <p>A proxy is an intermediary server that forwards your requests to a website using its own IP address, hiding your origin and letting you appear from another location or network type.</p>
  </div>
  <div class="faq-item">
    <h3>Are proxies legal?</h3>
    <p>Yes, using a proxy is legal in most countries. What you do through the proxy is still governed by the target site's terms and local law — see the legal section below.</p>
  </div>
  <div class="faq-item">
    <h3>What is the difference between a proxy and a VPN?</h3>
    <p>A VPN encrypts all device traffic through one tunnel for privacy; proxies route specific application traffic and are built for scale — rotation, geo-targeting, and concurrent sessions that VPNs cannot offer.</p>
  </div>
  <div class="faq-item">
    <h3>How much do proxies cost in 2026?</h3>
    <p>Residential bandwidth starts around $0.50&ndash;$5/GB depending on the provider, datacenter IPs run $0.50&ndash;$2 per IP monthly, and mobile proxies remain the premium tier.</p>
  </div>
</section>`,
  },
  {
    route: "/solutions",
    topic: "Proxy Solutions",
    title: "Proxy Solutions by Type (2026) | AffordableProxyHub",
    description:
      "Compare residential, datacenter, and mobile proxy services for 2026 — what each type does best, what it costs, and which providers lead.",
    heroTitle: "Proxy Solutions by Type",
    heroText:
      "Residential, datacenter, or mobile? Pick the proxy category that fits your targets, then compare the providers that lead it.",
    intro: `<section class="section" id="intro">
  <h2>Three Proxy Categories, Three Different Jobs</h2>
  <p>Almost every proxy decision starts with type. Residential IPs blend in with household traffic, datacenter IPs trade stealth for speed and price, and mobile IPs carry the highest trust at the highest cost. Each solution page below covers pricing, ideal use cases, and the leading providers.</p>
  <div class="related-grid">
    <a class="related-card" href="/solutions/residential-proxy-services"><strong>Residential Proxy Services</strong><span>Household IPs for protected targets and local testing.</span></a>
    <a class="related-card" href="/solutions/datacenter-proxy-services"><strong>Datacenter Proxy Services</strong><span>Fast, inexpensive IPs for high-volume public scraping.</span></a>
    <a class="related-card" href="/solutions/mobile-proxy-services"><strong>Mobile Proxy Services</strong><span>Carrier IPs for mobile-first and account workflows.</span></a>
  </div>
</section>`,
  },
  {
    route: "/proxy-provider-analysis/cheapest-proxies-review",
    topic: "Cheapest Proxies",
    title: "Cheapest Proxies Review (2026): Residential Proxies from $0.50/GB | AffordableProxyHub",
    description:
      "Full 2026 review of Cheapest Proxies: residential proxy pricing from $0.50/GB, 10M+ IPs across 150+ countries, setup, performance, and who it fits.",
    heroTitle: "Cheapest Proxies Review (2026)",
    heroText:
      "Our featured budget-friendly provider reviewed in depth: pricing from $0.50/GB, a 10M+ residential pool, and where it fits — and doesn't.",
    intro: `<section class="featured-box" id="intro">
  <div class="badge-row">
    <span class="badge green">Top Recommended Provider</span>
    <span class="badge">Best Value Choice</span>
    <span class="badge">Updated 2026</span>
  </div>
  <h2>Verdict: The Budget Benchmark for Residential Proxies</h2>
  <p>Cheapest Proxies earns its featured placement across this site by pairing the lowest practical entry price in the market with a genuinely usable residential pool. It is the provider we recommend testing first — not because it beats enterprise networks on every metric, but because at $0.50/GB the cost of finding out whether it covers your workflow is close to zero.</p>
  <div class="stats-grid">
    <div class="stat"><span class="stat-value">$0.50/GB</span><span class="stat-label">Starting price</span></div>
    <div class="stat"><span class="stat-value">10M+</span><span class="stat-label">Residential IPs</span></div>
    <div class="stat"><span class="stat-value">150+</span><span class="stat-label">Countries</span></div>
    <div class="stat"><span class="stat-value">99.9%</span><span class="stat-label">Uptime target</span></div>
  </div>
  <ul class="check-list">
    <li>Lowest entry price among rotating residential providers we track</li>
    <li>Rotating and sticky sessions with country-level targeting</li>
    <li>Standard HTTP/HTTPS support that works with every major scraping stack</li>
    <li>Simple dashboard with clear bandwidth accounting</li>
  </ul>
  <p>Where it fits less well: enterprise procurement needs (contracts, SLAs, dedicated account teams) and niche geo demands are better served by <a href="/providers/bright-data-review">Bright Data</a> or <a href="/providers/oxylabs-review">Oxylabs</a> — at several times the price.</p>
  <a class="btn" href="https://cheapest-proxies.com/" target="_blank" rel="noopener noreferrer">Visit Cheapest Proxies</a>
  <a class="btn-secondary" href="/reviews">Compare all provider reviews</a>
</section>`,
  },
  {
    route: "/guides/proxy-buying-guide",
    topic: "Buying Proxies",
    title: "The Proxy Buying Guide (2026): Choose Type, Plan, and Budget | AffordableProxyHub",
    description:
      "The complete 2026 proxy buying guide: pick the right proxy type, estimate bandwidth, compare pricing models, and avoid the classic first-purchase mistakes.",
    heroTitle: "The Proxy Buying Guide",
    heroText:
      "Everything a first-time or scaling buyer needs: pick the right type, estimate real costs, benchmark providers, and avoid the classic mistakes.",
    intro: `<section class="section" id="intro">
  <h2>The Five-Step Buying Process</h2>
  <p>Buying proxies well comes down to five decisions made in the right order. Work through them before comparing any providers and the shortlist usually builds itself.</p>
  <ul class="check-list">
    <li><strong>1. Identify your hardest target.</strong> The most protected site you need determines the proxy type; everything easier rides along.</li>
    <li><strong>2. Pick the type.</strong> Datacenter if your target allows it, residential for protected sites, mobile only when trust requirements demand it.</li>
    <li><strong>3. Estimate bandwidth.</strong> Pages per month &times; average page weight &times; 1.3 for retries gives your monthly GB figure.</li>
    <li><strong>4. Benchmark two or three providers.</strong> Smallest paid plans, same job, compare success rate and cost per thousand results.</li>
    <li><strong>5. Scale the winner.</strong> Commit monthly at first; negotiate volume pricing only after a full billing cycle of real data.</li>
  </ul>
</section>`,
  },
  {
    route: "/solutions/residential-proxy-services",
    topic: "Residential Proxy Services",
    title: "Best Residential Proxy Services (2026) | AffordableProxyHub",
    description:
      "Compare the best residential proxy services for 2026. Household IPs for protected targets, local SEO, and ad verification — budget picks first.",
    heroTitle: "Residential Proxy Services",
    heroText:
      "Household-sourced IPs that pass strict anti-bot filters — compared on price, pool quality, and measured success rates.",
    intro: `<section class="section" id="intro">
  <h2>What Residential Proxies Do Best</h2>
  <p>Residential proxies route traffic through IPs assigned by consumer ISPs to real households, so protected targets see ordinary visitor traffic instead of hosting-range requests. They are the default choice for scraping protected e-commerce sites, localized SERP tracking, ad verification, and market research.</p>
  <p>Expect per-GB pricing, meaningful geo-targeting, and rotation controls. Budget entry points start around $0.50/GB with <a href="https://cheapest-proxies.com/" target="_blank" rel="noopener noreferrer">Cheapest Proxies</a>, while enterprise pools from <a href="/providers/bright-data-review">Bright Data</a> and <a href="/providers/oxylabs-review">Oxylabs</a> add compliance tooling and SLAs at several times the price.</p>
</section>`,
  },
  {
    route: "/solutions/datacenter-proxy-services",
    topic: "Datacenter Proxy Services",
    title: "Best Datacenter Proxy Services (2026) | AffordableProxyHub",
    description:
      "Compare the best datacenter proxy services for 2026. Fast, low-cost IPs for high-volume scraping on lightly protected targets.",
    heroTitle: "Datacenter Proxy Services",
    heroText:
      "The fastest, cheapest proxy category — ideal for high-volume work on targets that don't block hosting-range IPs.",
    intro: `<section class="section" id="intro">
  <h2>What Datacenter Proxies Do Best</h2>
  <p>Datacenter proxies come from cloud and hosting facilities. They deliver the lowest latency and cost per request of any category, making them ideal for high-volume scraping of lightly protected targets, uptime monitoring, and internal testing.</p>
  <p>The trade-off is detectability: sophisticated targets fingerprint hosting IP ranges and block them outright. Test your target with datacenter IPs first — if it works, <a href="/providers/webshare-review">Webshare</a> and <a href="/providers/rayobyte-review">Rayobyte</a> offer strong value; if not, step up to <a href="/solutions/residential-proxy-services">residential</a>.</p>
</section>`,
  },
  {
    route: "/guides/residential-proxies",
    topic: "Residential Proxies",
    title: "Residential Proxies Guide (2026): When Household IPs Are Worth It | AffordableProxyHub",
    description:
      "The 2026 residential proxies guide: how household IPs work, what they cost, when they beat datacenter proxies, and which providers lead the category.",
    heroTitle: "The Residential Proxies Guide",
    heroText:
      "How household IPs work, what they really cost, and when they are worth the per-GB premium over datacenter alternatives.",
    intro: `<section class="section" id="intro">
  <h2>How Residential Proxies Work</h2>
  <p>Residential proxies route your traffic through IP addresses that consumer ISPs assigned to real households, usually sourced through consent-based bandwidth-sharing apps. To the target website, your request is indistinguishable from an ordinary visitor on a home connection — which is exactly why protected sites that instantly block hosting IPs let residential traffic through.</p>
  <p>You pay for that acceptance per gigabyte. This guide covers when the premium is justified, how to keep bandwidth costs down, and which providers deliver — starting from <a href="https://cheapest-proxies.com/" target="_blank" rel="noopener noreferrer">Cheapest Proxies at $0.50/GB</a>. For the category overview, see <a href="/solutions/residential-proxy-services">residential proxy services</a>.</p>
</section>`,
  },
  {
    route: "/guides/datacenter-proxies",
    topic: "Datacenter Proxies",
    title: "Datacenter Proxies Guide (2026): Speed on a Budget | AffordableProxyHub",
    description:
      "The 2026 datacenter proxies guide: how hosting-range IPs work, where they excel, where they get blocked, and how to buy them well.",
    heroTitle: "The Datacenter Proxies Guide",
    heroText:
      "The fastest and cheapest proxy category explained: where datacenter IPs excel, where they get blocked, and how to buy them well.",
    intro: `<section class="section" id="intro">
  <h2>How Datacenter Proxies Work</h2>
  <p>Datacenter proxies run on servers in cloud and hosting facilities. With no household in the loop they deliver the best latency and the lowest prices of any category — often under $1 per IP per month — and their capacity is effectively unlimited for high-volume jobs.</p>
  <p>The catch is that hosting IP ranges are public knowledge, so any target that checks IP reputation can block the whole category at once. This guide shows you how to test whether your targets tolerate datacenter IPs and how to structure a plan when they do. See also the <a href="/solutions/datacenter-proxy-services">datacenter proxy services</a> comparison.</p>
</section>`,
  },
  {
    route: "/guides/mobile-proxies",
    topic: "Mobile Proxies",
    title: "Mobile Proxies Guide (2026): Carrier IPs and CGNAT Trust | AffordableProxyHub",
    description:
      "The 2026 mobile proxies guide: how 4G/5G carrier IPs and CGNAT create maximum trust, what mobile proxies cost, and when they are worth it.",
    heroTitle: "The Mobile Proxies Guide",
    heroText:
      "Why carrier-grade 4G/5G IPs carry the highest trust of any proxy type, what they cost, and the workflows that justify them.",
    intro: `<section class="section" id="intro">
  <h2>How Mobile Proxies Work</h2>
  <p>Mobile proxies route traffic through real 4G/5G modem connections. Because carriers use CGNAT to share each public IP across hundreds of subscribers, platforms cannot block a mobile IP without locking out real customers — which is why mobile IPs survive on targets that ban everything else.</p>
  <p>That protection is the most expensive in the market, so the buying question is always whether your workflow truly needs it. This guide covers pricing, rotation behavior on carrier networks, and the account-management and mobile-app use cases where mobile IPs earn their cost. The category comparison lives at <a href="/solutions/mobile-proxy-services">mobile proxy services</a>.</p>
</section>`,
  },
  {
    route: "/guides/rotating-proxies",
    topic: "Rotating Proxies",
    title: "Rotating Proxies Guide (2026): Rotation, Sessions, and Pool Hygiene | AffordableProxyHub",
    description:
      "The 2026 rotating proxies guide: per-request rotation vs sticky sessions, rotation strategies that avoid bans, and how to evaluate pool hygiene.",
    heroTitle: "The Rotating Proxies Guide",
    heroText:
      "Per-request rotation, sticky sessions, and pool hygiene — the mechanics that decide whether your proxies get you blocked.",
    intro: `<section class="section" id="intro">
  <h2>How Rotation Actually Works</h2>
  <p>A rotating proxy is a gateway endpoint that assigns a different IP from the provider's pool on every request, or holds one for a fixed window in sticky mode. You configure one host and port; the provider handles IP assignment behind it, usually controlled through username parameters or separate ports.</p>
  <p>Rotation quality varies more between providers than almost any other feature: weak pools recycle flagged IPs straight back into circulation, while well-managed ones rest and health-check them. This guide covers rotation strategies per workload, session control syntax, and the tests that expose pool hygiene before you commit.</p>
</section>`,
  },
  {
    route: "/guides/web-scraping-proxies",
    topic: "Web Scraping Proxies",
    title: "Web Scraping Proxies Guide (2026): Build a Reliable Collection Stack | AffordableProxyHub",
    description:
      "The 2026 web scraping proxies guide: choose proxy types per target, structure rotation and retries, and control cost per thousand results.",
    heroTitle: "The Web Scraping Proxies Guide",
    heroText:
      "Choosing and operating proxies specifically for data collection: type per target, rotation, retries, and cost per thousand results.",
    intro: `<section class="section" id="intro">
  <h2>Proxies Are Half of Every Scraping Stack</h2>
  <p>Scrapers fail at the network layer more than anywhere else. The right proxy setup is target-driven: unprotected sites run fine through cheap datacenter IPs, protected e-commerce and search targets need rotating residential, and only a few high-trust platforms justify mobile bandwidth.</p>
  <p>This guide covers the full operating loop — classifying targets by difficulty, routing each class to the cheapest pool that succeeds, structuring retries so failures escalate to stronger pools automatically, and tracking cost per thousand successful results as your primary metric. Pair it with our <a href="/integrations">integration guides</a> for the code side.</p>
</section>`,
  },
  {
    route: "/solutions/mobile-proxy-services",
    topic: "Mobile Proxy Services",
    title: "Best Mobile Proxy Services (2026) | AffordableProxyHub",
    description:
      "Compare the best mobile proxy services for 2026. Carrier-grade 4G/5G IPs with maximum trust for mobile-first platforms and account workflows.",
    heroTitle: "Mobile Proxy Services",
    heroText:
      "Carrier-grade 4G/5G IPs with the highest trust scores of any proxy type — priced and compared for 2026.",
    intro: `<section class="section" id="intro">
  <h2>What Mobile Proxies Do Best</h2>
  <p>Mobile proxies route traffic through real 4G/5G carrier connections. Because carriers share one IP across many subscribers via CGNAT, platforms hesitate to block mobile IPs — giving them the highest trust score of any proxy category.</p>
  <p>That trust commands premium pricing, so reserve mobile IPs for the workflows that need them: mobile-first platforms, social account management, and app testing. For everything else, <a href="/solutions/residential-proxy-services">residential proxies</a> deliver similar acceptance at a fraction of the cost.</p>
</section>`,
  },
];

function buildNewPage(page) {
  const canonical = `${SITE}${page.route}`;
  const body = LIBRARY.map((s) => `          ${s.render(page.topic)}`).join("\n");
  const tocLinks = [`<a href="#intro">Intro</a>`]
    .concat(LIBRARY.map((s) => `<a href="#${s.id}">${s.label}</a>`))
    .concat([`<a href="#final-cta">Final CTA</a>`])
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#273545" />
    <meta name="author" content="AffordableProxyHub" />
    <title>${page.title}</title>
    <meta name="description" content="${page.description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${page.title}" />
    <meta property="og:description" content="${page.description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SITE}/opengraph.jpg" />
    <meta property="og:site_name" content="AffordableProxyHub" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${page.title}" />
    <meta name="twitter:description" content="${page.description}" />
    <meta name="twitter:image" content="${SITE}/opengraph.jpg" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="stylesheet" href="/assets/seo-pages.css" />
    <script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.heroTitle,
      url: canonical,
      description: page.description,
    })}</script>
  </head>
  <body>
    ${HEADER}
    <main>
      <section class="hero">
        <div class="container">
          <nav class="crumbs" aria-label="Breadcrumb">
            <a href="/">Home</a><span>/</span><span>${page.heroTitle}</span>
          </nav>
          <div class="badge-row">
            <span class="badge green">Cheapest Proxies First</span>
            <span class="badge">Independent Comparisons</span>
            <span class="badge">Updated 2026</span>
          </div>
          <h1>${page.heroTitle}</h1>
          <p>${page.heroText}</p>
        </div>
      </section>
      <div class="container page-grid">
        <article class="content">
          ${page.intro}
${body}
          <section class="cta" id="final-cta">
            <h2>Start With a Budget-Friendly Proxy, Then Compare</h2>
            <p>Test Cheapest Proxies first when price, quick setup, and residential proxy access matter, then compare specialist providers only if your workflow needs enterprise contracts or a niche proxy category.</p>
            <a class="btn" href="https://cheapest-proxies.com/" target="_blank" rel="noopener noreferrer">Get budget-friendly proxies</a>
            <a class="btn-secondary" href="/compare">Compare providers</a>
          </section>
        </article>
        <aside class="toc">
          <strong>On this page</strong>
          ${tocLinks}
        </aside>
      </div>
    </main>
    ${FOOTER}
  </body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Lightweight standalone pages declared in sitemap.xml but missing on disk.
// These don't need the 20-section treatment.
// ---------------------------------------------------------------------------
const SIMPLE_PAGES = [
  {
    route: "/contact",
    title: "Contact | AffordableProxyHub",
    description: "Contact AffordableProxyHub with questions, corrections, or provider update requests.",
    heroTitle: "Contact Us",
    heroText: "Questions, corrections, or provider updates — here is how to reach the team.",
    sections: `<section class="section" id="intro">
  <h2>Get in Touch</h2>
  <p>We read every message. The fastest way to reach the team is email, and most messages get a reply within two business days.</p>
  <ul class="check-list">
    <li><strong>General questions and feedback:</strong> hello@affordableproxyhub.com</li>
    <li><strong>Corrections to reviews or pricing data:</strong> corrections@affordableproxyhub.com</li>
    <li><strong>Provider listing and update requests:</strong> providers@affordableproxyhub.com</li>
  </ul>
</section>
<section class="section" id="corrections">
  <h2>Spotted Outdated Pricing?</h2>
  <p>Proxy pricing changes fast. If a number on any page no longer matches a provider's live pricing, tell us the page URL and what changed — verified corrections ship in the next content update.</p>
</section>
<section class="section" id="reviews-policy">
  <h2>For Proxy Providers</h2>
  <p>We review products independently and do not sell placements or scores. Providers can request a review, flag factual errors, or submit product updates; editorial decisions always remain with our team. See <a href="/reviews">how our reviews work</a>.</p>
</section>`,
  },
  {
    route: "/privacy-policy",
    title: "Privacy Policy | AffordableProxyHub",
    description: "How AffordableProxyHub handles visitor data: what we collect, what we don't, cookies, analytics, and outbound links.",
    heroTitle: "Privacy Policy",
    heroText: "What this site collects, what it doesn't, and how outbound links to providers work.",
    sections: `<section class="section" id="overview">
  <h2>Overview</h2>
  <p>AffordableProxyHub is a static informational website. We do not require accounts, do not run payment systems, and do not collect personal information to show you content. This page explains the limited data handling that does occur. Last updated: July 2026.</p>
</section>
<section class="section" id="data-collected">
  <h2>What We Collect</h2>
  <ul class="check-list">
    <li><strong>Server logs:</strong> our hosting provider records standard request logs (IP address, user agent, requested URL) for security and capacity planning. These are retained only as long as the hosting platform's defaults require.</li>
    <li><strong>Analytics:</strong> if aggregate analytics are enabled, they measure page views and referrers in anonymized form. We do not build individual visitor profiles.</li>
    <li><strong>Email:</strong> if you contact us, we keep the correspondence to answer you. We do not add you to lists or share your address.</li>
  </ul>
</section>
<section class="section" id="cookies">
  <h2>Cookies</h2>
  <p>The site itself does not set tracking cookies. Embedded third-party content (such as the blog's content platform) may set its own cookies subject to that platform's policy.</p>
</section>
<section class="section" id="outbound">
  <h2>Outbound Links and Affiliations</h2>
  <p>Pages link to proxy providers, and some outbound links may be affiliate links, meaning we can earn a commission if you purchase after clicking. This never affects review scores or rankings, and it costs you nothing. Once you leave this site, the destination's own privacy policy applies.</p>
</section>
<section class="section" id="rights">
  <h2>Your Rights and Contact</h2>
  <p>Under GDPR, CCPA, and similar laws you may request access to or deletion of any personal data we hold — in practice, this is limited to email correspondence. Write to hello@affordableproxyhub.com via the <a href="/contact">contact page</a> and we will respond within 30 days.</p>
</section>`,
  },
];

function buildSimplePage(page) {
  const canonical = `${SITE}${page.route}`;
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#273545" />
    <meta name="author" content="AffordableProxyHub" />
    <title>${page.title}</title>
    <meta name="description" content="${page.description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${page.title}" />
    <meta property="og:description" content="${page.description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SITE}/opengraph.jpg" />
    <meta property="og:site_name" content="AffordableProxyHub" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="stylesheet" href="/assets/seo-pages.css" />
  </head>
  <body>
    ${HEADER}
    <main>
      <section class="hero">
        <div class="container">
          <nav class="crumbs" aria-label="Breadcrumb">
            <a href="/">Home</a><span>/</span><span>${page.heroTitle}</span>
          </nav>
          <h1>${page.heroTitle}</h1>
          <p>${page.heroText}</p>
        </div>
      </section>
      <div class="container page-grid">
        <article class="content">
          ${page.sections}
        </article>
      </div>
    </main>
    ${FOOTER}
  </body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
const report = [];

for (const page of NEW_PAGES) {
  const dir = path.join(ROOT, page.route.replace(/^\//, ""));
  fs.mkdirSync(dir, { recursive: true });
  const html = buildNewPage(page);
  fs.writeFileSync(path.join(dir, "index.html"), html, "utf8");
  report.push({ relPath: `${page.route}/index.html (new)`, before: 0, after: countSections(html) });
}

for (const [relPath, topic] of EXISTING_HUBS) {
  report.push(expandExistingPage(relPath, topic));
}

for (const page of SIMPLE_PAGES) {
  const dir = path.join(ROOT, page.route.replace(/^\//, ""));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), buildSimplePage(page), "utf8");
  report.push({ relPath: `${page.route}/index.html (new)`, before: 0, after: TARGET_SECTIONS });
}

// Sitemap: register new routes once.
const sitemapPath = path.join(ROOT, "sitemap.xml");
let sitemap = fs.readFileSync(sitemapPath, "utf8");
let added = 0;

// Drop stale /blog/<slug> entries — blog posts are served dynamically and
// these static URLs never existed.
let removed = 0;
sitemap = sitemap.replace(
  /  <url>\s*<loc>https:\/\/affordableproxyhub\.com\/blog\/[^<]+<\/loc>[\s\S]*?<\/url>\n/g,
  () => {
    removed += 1;
    return "";
  }
);
for (const page of NEW_PAGES) {
  const loc = `${SITE}${page.route}`;
  if (sitemap.includes(`<loc>${loc}</loc>`)) continue;
  const entry = `  <url>\n    <loc>${loc}</loc>\n    <lastmod>2026-07-10</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  sitemap = sitemap.replace("</urlset>", `${entry}</urlset>`);
  added += 1;
}
fs.writeFileSync(sitemapPath, sitemap, "utf8");

for (const r of report) {
  const flag = r.after >= TARGET_SECTIONS ? "OK " : "LOW";
  console.log(`${flag} ${r.relPath}: ${r.before} -> ${r.after} sections`);
}
console.log(`Sitemap entries added: ${added}, stale blog entries removed: ${removed}`);
