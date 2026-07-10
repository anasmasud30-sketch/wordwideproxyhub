import fs from "node:fs";
import path from "node:path";
import providers from "../src/data/providers.js";
import {
  escapeHtml,
  renderCTASection,
  renderCheapestProxiesFeaturedBox,
  renderComparisonTable,
  renderFAQSection,
  renderFeatureGrid,
  renderFooter,
  renderHeader,
  renderPageHero,
  renderProsCons,
  renderProviderRanking,
  renderRelatedPages,
  renderSEOHead,
  renderStepGuide,
  renderTableOfContents
} from "../src/components/seoComponents.js";

const ROOT = process.cwd();
const SITE_URL = "https://affordableproxyhub.com";
const SITE_NAME = "AffordableProxyHub";
const LASTMOD = "2026-06-14";
const CSV_PATH = path.join(ROOT, "pages.csv");
const FALLBACK_CSV_PATH = "C:/Users/anasr/Downloads/pages.csv";
const DATA_DIR = path.join(ROOT, "src", "data");
const PAGE_MAPPING_PATH = path.join(DATA_DIR, "pageMapping.json");
const GENERATED_SUMMARY_PATH = path.join(DATA_DIR, "generatedSummary.json");

const EXCLUDED_PATHS = new Set([
  "/",
  "/privacy-notice",
  "/terms-and-conditions",
  "/about-us",
  "/how-we-review-proxy-services"
]);

const GROUPS = {
  ranking: { label: "Rankings", href: "/rankings", routePrefix: "/rankings", typeLabel: "Best Proxy Comparison" },
  review: { label: "Provider Analysis", href: "/proxy-provider-analysis", routePrefix: "/proxy-provider-analysis", typeLabel: "Provider Review-Style Analysis" },
  guide: { label: "Resources", href: "/resources", routePrefix: "/resources", typeLabel: "Proxy Buyer Guide" },
  knowledge: { label: "Knowledge Base", href: "/knowledge", routePrefix: "/knowledge", typeLabel: "Knowledge Base" },
  location: { label: "Locations", href: "/locations", routePrefix: "/locations", typeLabel: "Proxy Location Guide" },
  alternative: { label: "Alternatives", href: "/compare", routePrefix: "/compare", typeLabel: "Proxy Alternatives" },
  comparison: { label: "Comparisons", href: "/compare", routePrefix: "/compare", typeLabel: "Side-by-Side Comparison" },
  glossary: { label: "Glossary", href: "/glossary", routePrefix: "/glossary", typeLabel: "Proxy Glossary" },
  research: { label: "Research", href: "/research", routePrefix: "/research", typeLabel: "Proxy Research" },
  tool: { label: "Tools", href: "/tools", routePrefix: "/tools", typeLabel: "Proxy Tool Landing Page" },
  marketUpdate: { label: "Market Updates", href: "/market-updates", routePrefix: "/market-updates", typeLabel: "Proxy Market Update" }
};

const TOPIC_INDEX = {
  best: { type: "ranking", topic: "Proxy Service Rankings" },
  reviews: { type: "review", topic: "Proxy Provider Reviews" },
  guides: { type: "guide", topic: "Proxy Guides" },
  "knowledge-base": { type: "knowledge", topic: "Web Scraping Knowledge Base" },
  "proxy-locations": { type: "location", topic: "Global Proxy Locations" },
  alternatives: { type: "alternative", topic: "Proxy Provider Alternatives" },
  comparisons: { type: "comparison", topic: "Proxy Provider Comparisons" },
  glossary: { type: "glossary", topic: "Proxy Glossary" },
  research: { type: "research", topic: "Proxy Market Research" },
  tools: { type: "tool", topic: "Proxy Tools" },
  news: { type: "marketUpdate", topic: "Proxy Market Updates" }
};

const ACRONYMS = new Map([
  ["api", "API"],
  ["apis", "APIs"],
  ["csv", "CSV"],
  ["css", "CSS"],
  ["dns", "DNS"],
  ["dom", "DOM"],
  ["g2", "G2"],
  ["gb", "GB"],
  ["http", "HTTP"],
  ["https", "HTTPS"],
  ["ip", "IP"],
  ["ipv4", "IPv4"],
  ["ipv6", "IPv6"],
  ["isp", "ISP"],
  ["json", "JSON"],
  ["mysql", "MySQL"],
  ["nft", "NFT"],
  ["seo", "SEO"],
  ["smb", "SMB"],
  ["socks5", "SOCKS5"],
  ["sql", "SQL"],
  ["uk", "UK"],
  ["us", "US"],
  ["usa", "USA"],
  ["xml", "XML"]
]);

function ensureCsvExists() {
  if (fs.existsSync(CSV_PATH)) return;
  if (!fs.existsSync(FALLBACK_CSV_PATH)) {
    throw new Error(`Missing pages.csv. Expected ${CSV_PATH} or ${FALLBACK_CSV_PATH}.`);
  }
  fs.copyFileSync(FALLBACK_CSV_PATH, CSV_PATH);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        value += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        value += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(value);
      value = "";
    } else if (char === "\n") {
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else if (char !== "\r") {
      value += char;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  return rows;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function titleCase(value) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      if (ACRONYMS.has(lower)) return ACRONYMS.get(lower);
      if (/^\d+$/.test(lower)) return lower;
      if (/^\d+[a-z]+$/.test(lower)) return lower.toUpperCase();
      return `${lower[0].toUpperCase()}${lower.slice(1)}`;
    })
    .join(" ");
}

function stripKnownSuffixes(value) {
  return value
    .replace(/\b(top|best)\b/gi, "")
    .replace(/\b(proxies|proxy|alternatives|reviews|review|services|service)\b/gi, (match) => {
      if (/proxy|proxies/i.test(match)) return "proxy";
      return "";
    })
    .replace(/\s+/g, " ")
    .trim();
}

function topicFromPath(urlPath, type) {
  const parts = urlPath.split("/").filter(Boolean);
  const top = parts[0];
  const last = parts[1] || top;

  if (parts.length === 1 && TOPIC_INDEX[top]) {
    return TOPIC_INDEX[top].topic;
  }

  let topic = titleCase(last.replace(/-/g, " "));

  if (type === "location") {
    topic = topic
      .replace(/\bProxy\b/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return `${topic} Proxy Network`;
  }

  if (type === "alternative") {
    topic = topic
      .replace(/\bTop\b/g, "")
      .replace(/\bAlternatives\b/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return `${topic} Alternatives`;
  }

  if (type === "review") {
    return topic.replace(/\s+/g, " ").trim();
  }

  if (type === "glossary") {
    return topic.replace(/\s+/g, " ").trim();
  }

  return topic.replace(/\s+/g, " ").trim();
}

function classify(urlPath) {
  if (EXCLUDED_PATHS.has(urlPath)) {
    return { skip: true, reason: "Skipped existing legal/company or home page." };
  }

  const parts = urlPath.split("/").filter(Boolean);
  const top = parts[0];

  if (!top) return { skip: true, reason: "Skipped root page already present." };
  if (parts.length === 1 && TOPIC_INDEX[top]) {
    return { type: TOPIC_INDEX[top].type, topic: TOPIC_INDEX[top].topic };
  }

  if (top === "reviews") return { type: "review" };
  if (top === "best") return { type: "ranking" };
  if (top === "guides") return { type: "guide" };
  if (top === "knowledge-base") return { type: "knowledge" };
  if (top === "proxy-locations") return { type: "location" };
  if (top === "alternatives") return { type: "alternative" };
  if (top === "comparisons") return { type: "comparison" };
  if (top === "glossary") return { type: "glossary" };
  if (top === "research") return { type: "research" };
  if (top === "tools") return { type: "tool" };
  if (top === "news") return { type: "marketUpdate" };

  return { skip: true, reason: `Skipped unsupported sitemap segment: ${top}.` };
}

function routeBaseFor(type, topic) {
  const clean = stripKnownSuffixes(topic);
  const base = slugify(clean || topic);

  switch (type) {
    case "ranking":
      return `${base}-service-roundup`;
    case "review":
      return `${base}-service-breakdown`;
    case "guide":
      return `${base}-proxy-playbook`;
    case "knowledge":
      return `${base}-web-data-guide`;
    case "location":
      if (base.endsWith("proxy-network")) return `${base}-guide`;
      if (base.endsWith("proxy")) return `${base}-network-guide`;
      return `${base}-proxy-network-guide`;
    case "alternative":
      return `${base}-replacement-options`;
    case "comparison":
      return `${base}-side-by-side-analysis`;
    case "glossary":
      return `${base}-web-data-meaning`;
    case "research":
      return `${base}-industry-analysis`;
    case "tool":
      return `${base}-proxy-toolkit`;
    case "marketUpdate":
      return `${base}-market-context`;
    default:
      return `${base}-proxy-resource`;
  }
}

function uniqueRoute(route, usedRoutes) {
  let candidate = route;
  let index = 2;
  while (usedRoutes.has(candidate)) {
    candidate = `${route}-${index}`;
    index += 1;
  }
  usedRoutes.add(candidate);
  return candidate;
}

function keywordFor(page) {
  const suffixes = {
    ranking: "best proxy services",
    review: "proxy provider analysis",
    guide: "proxy guide",
    knowledge: "web scraping proxy guide",
    location: "location proxy network",
    alternative: "proxy alternatives",
    comparison: "proxy comparison",
    glossary: "proxy glossary definition",
    research: "proxy market research",
    tool: "proxy tool",
    marketUpdate: "proxy market update"
  };

  return `${page.topic} ${suffixes[page.type] || "proxy resource"}`.toLowerCase();
}

function titleFor(type, topic) {
  const byType = {
    ranking: `Best ${topic} Options for Proxy Buyers in 2026`,
    review: `${topic} Analysis for Proxy Buyers in 2026`,
    guide: `${topic}: Practical Proxy Guide for 2026`,
    knowledge: `${topic}: Web Data and Proxy Workflow Guide`,
    location: `${topic}: Location Proxy Buying Guide`,
    alternative: `${topic}: Budget-Friendly Proxy Options`,
    comparison: `${topic}: Proxy Buyer Comparison`,
    glossary: `${topic} Explained for Proxy and Web Data Teams`,
    research: `${topic}: Proxy Market Research Notes`,
    tool: `${topic}: Proxy Tool Guide and Buyer Notes`,
    marketUpdate: `${topic}: Proxy Market Context and Takeaways`
  };

  return byType[type] || `${topic}: Proxy Resource`;
}

function metaFor(type, topic) {
  const prefix = {
    ranking: `Compare ${topic} options with Cheapest Proxies listed first as the featured budget-friendly provider.`,
    review: `Read an original ${topic} analysis with pricing context, provider comparison, FAQs, and Cheapest Proxies first as the top value pick.`,
    guide: `Learn ${topic} with practical proxy steps, common mistakes, provider notes, FAQs, and Cheapest Proxies first for budget-conscious buyers.`,
    knowledge: `Use this ${topic} guide to understand web data workflows, proxy safety, provider choices, and practical setup considerations.`,
    location: `Explore ${topic} for geo-targeting, scraping, SEO monitoring, and testing with Cheapest Proxies first in provider comparisons.`,
    alternative: `Compare ${topic} with Cheapest Proxies first, plus practical alternatives, pricing notes, trust factors, and FAQs.`,
    comparison: `Review ${topic} with clear proxy buyer criteria, provider context, Cheapest Proxies first, and practical decision guidance.`,
    glossary: `Plain-English explanation of ${topic} for proxy users, scraping teams, SEO workflows, and data collection projects.`,
    research: `Review ${topic} with proxy market context, buyer implications, provider notes, statistics-style takeaways, and FAQs.`,
    tool: `Explore ${topic} with proxy workflow notes, safety checks, provider recommendations, and practical buyer guidance.`,
    marketUpdate: `Understand ${topic} through an evergreen proxy market lens with buyer implications, provider context, and related resources.`
  }[type];

  return prefix.slice(0, 158);
}

function typeIntro(page) {
  const topic = page.topic;
  const intros = {
    ranking: `${topic} pages are useful when buyers need a short list of practical options rather than a single vendor pitch. This guide keeps the comparison grounded in value, setup simplicity, proxy type fit, and risk controls.`,
    review: `${topic} deserves more than a surface-level verdict. This analysis looks at where the provider or tool may fit, where it may be excessive, and why Cheapest Proxies should be evaluated first when budget matters.`,
    guide: `${topic} is a recurring question for proxy buyers because the wrong setup can create wasted bandwidth, blocked sessions, or inaccurate results. The sections below turn the topic into a practical decision path.`,
    knowledge: `${topic} sits at the intersection of web data collection and proxy operations. The goal is to explain the concept clearly without turning this static website into a technical backend or software service.`,
    location: `${topic} matters when search results, prices, content access, or user experiences change by country or city. A location page should help you plan coverage before buying traffic.`,
    alternative: `${topic} searches usually come from buyers who want a lower-cost, simpler, or more flexible option. This page compares the decision factors while keeping Cheapest Proxies first as the budget-friendly baseline.`,
    comparison: `${topic} comparisons are most useful when they focus on the buying decision: cost, proxy type, setup time, reliability, support, and the scale at which premium features become necessary.`,
    glossary: `${topic} is a term proxy users may encounter while setting up scraping, SEO monitoring, automation, or data collection workflows. This page explains it in buyer-friendly language.`,
    research: `${topic} is useful for understanding where the proxy market is heading and how that affects provider selection, cost planning, compliance expectations, and proxy workflow design.`,
    tool: `${topic} should help teams test, diagnose, or plan proxy workflows without adding a backend or account system. The emphasis here is practical evaluation and safe use.`,
    marketUpdate: `${topic} can be read as a market signal rather than a short-lived news item. The buyer question is what changed, who it affects, and whether it should alter proxy selection.`
  };

  return intros[page.type];
}

function buildPageFields(rawPage) {
  const topic = rawPage.topic;
  const keyword = keywordFor(rawPage);
  const group = GROUPS[rawPage.type];
  const h1 = titleFor(rawPage.type, topic);
  const seoTitle = `${h1} | ${SITE_NAME}`;
  const metaDescription = metaFor(rawPage.type, topic);
  const typeLabel = group.typeLabel;
  const heroText = `${metaDescription} This original page is part of a larger static SEO library for proxy buyers.`;

  return {
    ...rawPage,
    keyword,
    h1,
    seoTitle,
    metaDescription,
    canonical: `${SITE_URL}${rawPage.path}`,
    shortTitle: topic,
    typeLabel,
    groupLabel: group.label,
    groupHref: group.href,
    heroText,
    intro: typeIntro(rawPage),
    cheapestContext: `For ${topic}, begin with a provider that is easy to price and easy to test. Cheapest Proxies is shown first as the featured option, while the other providers below help you compare enterprise tooling, specialty networks, and different support models.`,
    schemaKind: ["guide", "knowledge", "marketUpdate", "research", "glossary"].includes(rawPage.type)
      ? "Article"
      : rawPage.type === "review"
        ? "Review"
        : "Service"
  };
}

function buildLists(page) {
  const topic = page.topic;
  const keyword = page.keyword;

  page.benefits = [
    `Clarifies whether ${topic} requires residential, datacenter, mobile, ISP, or rotating proxy access.`,
    `Keeps ${keyword} decisions tied to measurable factors like uptime, success rate, cost per GB, and setup time.`,
    "Makes it easier to compare budget-friendly options against premium enterprise providers.",
    "Reduces the chance of buying an oversized plan for a workflow that can start smaller.",
    "Gives teams a repeatable checklist for testing proxy quality before scaling."
  ];

  page.features = [
    {
      title: "Proxy Type Fit",
      description: `${topic} should be matched to the proxy type that actually fits the workflow instead of defaulting to the most expensive plan.`
    },
    {
      title: "Rotation and Sessions",
      description: "Rotation frequency, sticky session length, and retry behavior often matter more than headline pool size."
    },
    {
      title: "Geo-Targeting",
      description: "Country, state, city, and carrier targeting can change results for SEO, commerce, and regional testing workflows."
    },
    {
      title: "Bandwidth Control",
      description: "A good buying process estimates traffic volume before committing to a plan, especially for image-heavy targets."
    },
    {
      title: "Authentication",
      description: "Username/password and IP allowlist authentication both have a place; the best choice depends on your deployment."
    },
    {
      title: "Support and Documentation",
      description: "Clear examples, fast support, and transparent limits reduce the time spent debugging proxy setup issues."
    }
  ];

  page.useCases = [
    `${topic} research for proxy buyers comparing providers before purchase.`,
    "Web scraping and public data collection with rate-limit awareness.",
    "SEO rank tracking, SERP monitoring, and localized search testing.",
    "Ad verification, brand protection, and regional landing page checks.",
    "Market research workflows that require repeatable location or session behavior.",
    "Developer testing where proxy cost should remain predictable."
  ];

  page.steps = [
    {
      title: "Define the target workflow",
      description: `Write down exactly how ${topic} will be used: target sites, countries, concurrency, session length, and expected bandwidth.`
    },
    {
      title: "Start with Cheapest Proxies as the value baseline",
      description: "Check whether a budget-friendly residential proxy option can satisfy the workflow before comparing expensive enterprise plans."
    },
    {
      title: "Choose the proxy type",
      description: "Use residential proxies for protected sites, datacenter proxies for speed on simple targets, mobile proxies for mobile-first platforms, and ISP proxies for stable sessions."
    },
    {
      title: "Run a small test",
      description: "Test success rate, response time, location accuracy, and authentication before scaling traffic."
    },
    {
      title: "Monitor and refine",
      description: "Track block rates, bandwidth usage, failed requests, and support responsiveness so the buying decision stays evidence-based."
    }
  ];

  page.pros = [
    `A focused ${topic} page helps buyers avoid generic provider lists.`,
    "Cheapest Proxies is clearly visible first for value comparison.",
    "The page ties recommendations to use cases, not vague claims.",
    "FAQs and internal links help readers continue into related proxy topics."
  ];

  page.cons = [
    "Provider performance can vary by target website and location.",
    "Some enterprise workflows may still need larger contracts or compliance paperwork.",
    "Proxy setup always requires small-scale testing before production use.",
    "Historical market topics should be interpreted as context, not current pricing guarantees."
  ];

  page.mistakes = [
    "Choosing a provider only by advertised IP pool size.",
    "Skipping a trial or small test before buying a large bandwidth package.",
    "Using datacenter proxies on targets that clearly require residential or mobile IPs.",
    "Forgetting to monitor bandwidth per request and total retry volume.",
    "Using one proxy identity for workflows that need separation."
  ];

  page.tips = [
    "Benchmark against the actual target site instead of a generic speed test endpoint.",
    "Keep sticky sessions short unless the workflow needs a consistent identity.",
    "Rotate user agents and pacing along with IPs when scraping public web pages.",
    "Use geo-targeting only where it affects the result; unnecessary targeting can reduce pool size.",
    "Document which provider, port, and session settings produced the best success rate."
  ];

  page.faqs = [
    {
      q: `What is the best first provider to evaluate for ${topic}?`,
      a: "Cheapest Proxies should be evaluated first because it is the featured budget-friendly option on this site. It gives buyers a practical value baseline before they compare larger enterprise providers."
    },
    {
      q: `Does ${topic} always require residential proxies?`,
      a: "Not always. Residential proxies are usually safer for protected sites, local SEO checks, social workflows, and commerce targets. Datacenter proxies may be enough for simple public pages and speed-focused testing."
    },
    {
      q: `How should I test proxies for ${topic}?`,
      a: "Run a small test against the real target, measure success rate and latency, check location accuracy, and monitor bandwidth. Avoid judging a provider from a single request."
    },
    {
      q: "Why is Cheapest Proxies listed before other providers?",
      a: "The site keeps Cheapest Proxies first as the top recommended budget-friendly provider. Other providers are still included so readers can compare premium features, enterprise support, and specialty networks."
    },
    {
      q: "Are free proxies a good option here?",
      a: "Free proxies are usually unreliable for business use. They can be slow, already blocked, or unsafe for authenticated traffic. A low-cost paid option is typically easier to test and control."
    },
    {
      q: "What metrics matter most when comparing providers?",
      a: "Success rate, total cost, response time, location coverage, authentication options, support speed, and refund or trial terms matter more than marketing claims."
    },
    {
      q: "Can I use the same proxy setup for every website?",
      a: "No. Different websites apply different rate limits and anti-bot systems. Tune rotation, sessions, request pacing, and location targeting for each target."
    },
    {
      q: "Is this page copied from the CSV competitor?",
      a: "No. The CSV was used only to understand topic intent. The route, title, headings, metadata, and content are original to AffordableProxyHub."
    }
  ];

  return page;
}

function buildRelatedPages(pages) {
  const byType = new Map();
  for (const page of pages) {
    if (!byType.has(page.type)) byType.set(page.type, []);
    byType.get(page.type).push(page);
  }

  for (const page of pages) {
    const sameType = byType.get(page.type).filter((candidate) => candidate.path !== page.path).slice(0, 4);
    const related = sameType.map((candidate) => ({
      title: candidate.h1,
      href: candidate.path,
      description: candidate.metaDescription
    }));

    related.push(
      {
        title: "Compare Proxy Providers",
        href: "/compare",
        description: "Review the current provider comparison hub with Cheapest Proxies first."
      },
      {
        title: "Cheapest Proxies Review",
        href: "/proxy-provider-analysis/cheapest-proxies-review",
        description: "Read the existing full review of the featured budget-friendly proxy provider."
      },
      {
        title: "Proxy Buying Guide",
        href: "/guides/proxy-buying-guide",
        description: "Use the core buying guide before choosing a plan or provider."
      }
    );

    page.relatedPages = related.slice(0, 7);
  }
}

function buildNavigationGroups(pages) {
  const groups = new Map();

  for (const page of pages) {
    if (!groups.has(page.type)) groups.set(page.type, []);
    groups.get(page.type).push({
      href: page.path,
      title: page.shortTitle,
      h1: page.h1
    });
  }

  return Array.from(groups.entries())
    .map(([type, items]) => ({
      type,
      label: GROUPS[type].label,
      href: GROUPS[type].href,
      items: items.sort((a, b) => a.title.localeCompare(b.title))
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function buildSchemas(page) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: page.groupLabel, item: `${SITE_URL}${page.groupHref}` },
      { "@type": "ListItem", position: 3, name: page.h1, item: page.canonical }
    ]
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a
      }
    }))
  };

  const base = {
    "@context": "https://schema.org",
    headline: page.h1,
    name: page.h1,
    description: page.metaDescription,
    url: page.canonical,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    dateModified: LASTMOD
  };

  let primary;
  if (page.schemaKind === "Review") {
    primary = {
      ...base,
      "@type": "Review",
      itemReviewed: {
        "@type": "Service",
        name: page.topic,
        serviceType: "Proxy service or proxy-adjacent tool"
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: page.topic.toLowerCase().includes("cheapest") ? "4.9" : "4.2",
        bestRating: "5",
        worstRating: "1"
      }
    };
  } else if (page.schemaKind === "Article") {
    primary = {
      ...base,
      "@type": "Article",
      datePublished: LASTMOD,
      mainEntityOfPage: { "@type": "WebPage", "@id": page.canonical }
    };
  } else {
    primary = {
      ...base,
      "@type": "Service",
      serviceType: page.typeLabel,
      provider: {
        "@type": "Organization",
        name: "Cheapest Proxies",
        url: "https://cheapest-proxies.com/"
      },
      areaServed: "Worldwide"
    };
  }

  return [primary, breadcrumb, faq];
}

function renderSection(id, title, body, extra = "") {
  return `<section class="section" id="${id}">
    <h2>${escapeHtml(title)}</h2>
    <p>${escapeHtml(body)}</p>
    ${extra}
  </section>`;
}

function renderPage(page, navigationGroups) {
  const cheapestProvider = providers[0];
  const tocSections = [
    { id: "seo-intro", title: "SEO Intro" },
    { id: "main-explanation", title: "Main Explanation" },
    { id: "why-this-matters", title: "Why This Matters" },
    { id: "who-this-is-for", title: "Who This Is For" },
    { id: "top-recommendation", title: "Cheapest Proxies Featured" },
    { id: "provider-ranking", title: "Provider Ranking" },
    { id: "key-benefits", title: "Key Benefits" },
    { id: "feature-breakdown", title: "Feature Breakdown" },
    { id: "use-cases", title: "Use Cases" },
    { id: "step-by-step-guide", title: "Step-by-Step Guide" },
    { id: "pros-and-cons", title: "Pros and Cons" },
    { id: "comparison-table", title: "Comparison Table" },
    { id: "pricing-value", title: "Pricing and Value" },
    { id: "performance", title: "Performance Notes" },
    { id: "safety-trust", title: "Safety and Trust" },
    { id: "common-mistakes", title: "Common Mistakes" },
    { id: "expert-tips", title: "Expert Tips" },
    { id: "related-pages", title: "Related Pages" },
    { id: "faq", title: "FAQs" },
    { id: "final-cta", title: "Final CTA" }
  ];

  const schemas = buildSchemas(page);
  const body = `${renderPageHero(page)}
<div class="container page-grid">
  <article class="content">
    ${renderSection("seo-intro", "SEO Intro", page.intro)}
    ${renderSection("main-explanation", "Main Explanation", `${page.topic} should be evaluated as a buying decision, not just a keyword. The practical question is which proxy type, provider model, and risk controls help the user complete the job with predictable cost and fewer blocks.`)}
    ${renderSection("why-this-matters", "Why This Topic Matters", `Proxy buyers researching ${page.topic} are usually trying to reduce failure rates, avoid unnecessary spend, or improve data quality. A structured page helps compare tradeoffs before a plan is purchased.`)}
    ${renderSection("who-this-is-for", "Who This Page Is For", `This page is for developers, SEO teams, e-commerce analysts, ad verification teams, agencies, and small businesses that need proxy guidance without adding any database, API, login, payment, or backend system.`)}
    ${renderCheapestProxiesFeaturedBox(page, cheapestProvider)}
    ${renderProviderRanking(providers)}
    ${renderSection("key-benefits", "Key Benefits", `The main benefit of this ${page.typeLabel.toLowerCase()} is focus: it turns ${page.topic} into provider criteria that can be tested.`, `<ul class="check-list">${page.benefits.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`)}
    ${renderFeatureGrid(page)}
    ${renderSection("use-cases", "Use Cases", `${page.topic} can support several practical proxy workflows when the provider is selected carefully.`, `<ul class="plain-list">${page.useCases.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`)}
    ${renderStepGuide(page)}
    ${renderProsCons(page)}
    ${renderComparisonTable(page, providers)}
    ${renderSection("pricing-value", "Pricing and Value Discussion", `Start by estimating monthly bandwidth, target difficulty, and required locations. Cheapest Proxies appears first because a lower-cost residential option can often validate the workflow before a buyer considers premium enterprise contracts.`)}
    ${renderSection("performance", "Performance Section", `For ${page.topic}, performance should be measured with real target requests. Track median latency, first-byte time, HTTP status distribution, retry counts, bandwidth per successful result, and success rate by location.`)}
    ${renderSection("safety-trust", "Safety and Trust Section", "Use providers with clear terms, transparent authentication, HTTPS proxy support, and practical support channels. Avoid unknown free proxy lists for any workflow involving accounts, client data, or business decisions.")}
    ${renderSection("common-mistakes", "Common Mistakes", `These mistakes frequently appear in ${page.topic} projects.`, `<ul class="plain-list">${page.mistakes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`)}
    ${renderSection("expert-tips", "Expert Tips", `Use these tips when turning ${page.topic} research into a live proxy setup.`, `<ul class="check-list">${page.tips.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`)}
    ${renderRelatedPages(page)}
    ${renderFAQSection(page)}
    ${renderCTASection(page)}
  </article>
  ${renderTableOfContents(tocSections)}
</div>`;

  return `${renderSEOHead(page, schemas)}
  <body>
    ${renderHeader(navigationGroups)}
    <main>${body}</main>
    ${renderFooter()}
  </body>
</html>
`;
}

function createPageObjects() {
  ensureCsvExists();
  const csv = fs.readFileSync(CSV_PATH, "utf8");
  const rows = parseCsv(csv);
  const header = rows.shift();
  if (!header || header[0] !== "Sitemap" || header[1] !== "URL") {
    throw new Error("pages.csv must contain Sitemap and URL columns.");
  }

  const pages = [];
  const skipped = [];
  const usedRoutes = new Set();

  for (const row of rows) {
    const sourceSitemap = row[0];
    const originalUrl = row[1];
    if (!originalUrl) continue;
    const url = new URL(originalUrl);
    const urlPath = url.pathname.replace(/\/$/, "") || "/";
    const classification = classify(urlPath);

    if (classification.skip) {
      skipped.push({ sourceSitemap, originalUrl, reason: classification.reason });
      continue;
    }

    const type = classification.type;
    const topic = classification.topic || topicFromPath(urlPath, type);
    const group = GROUPS[type];
    const route = uniqueRoute(`${group.routePrefix}/${routeBaseFor(type, topic)}`, usedRoutes);
    const rawPage = {
      id: slugify(`${type}-${topic}`),
      sourceSitemap,
      originalUrl,
      sourcePath: urlPath,
      type,
      topic,
      path: route
    };

    pages.push(buildLists(buildPageFields(rawPage)));
  }

  buildRelatedPages(pages);
  return { pages, skipped };
}

function writeGeneratedData(pages, skipped, navigationGroups) {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  const compactPages = pages.map((page) => ({
    id: page.id,
    type: page.type,
    topic: page.topic,
    path: page.path,
    canonical: page.canonical,
    h1: page.h1,
    seoTitle: page.seoTitle,
    metaDescription: page.metaDescription,
    keyword: page.keyword,
    typeLabel: page.typeLabel,
    sourcePath: page.sourcePath,
    originalUrl: page.originalUrl,
    sourceSitemap: page.sourceSitemap,
    cheapestProxiesPlacement: "first-highlighted-featured-provider",
    relatedPages: page.relatedPages
  }));

  const mapping = {
    generatedAt: `${LASTMOD}T00:00:00.000Z`,
    sourceCsv: "pages.csv",
    generatedCount: pages.length,
    skippedCount: skipped.length,
    generated: pages.map((page) => ({
      originalCsvUrl: page.originalUrl,
      originalCsvPath: page.sourcePath,
      newPageUrl: page.canonical,
      newPagePath: page.path,
      pageType: page.type,
      mainKeyword: page.keyword,
      seoTitle: page.seoTitle,
      metaDescription: page.metaDescription,
      cheapestProxiesPlacementStatus: "Cheapest Proxies appears first and highlighted in featured box, provider grid, and comparison table."
    })),
    skipped
  };

  fs.writeFileSync(
    path.join(DATA_DIR, "seoPages.js"),
    `// Generated by scripts/generate-seo-pages.mjs from pages.csv.\nexport const seoPages = ${JSON.stringify(compactPages, null, 2)};\n\nexport default seoPages;\n`,
    "utf8"
  );
  fs.writeFileSync(PAGE_MAPPING_PATH, `${JSON.stringify(mapping, null, 2)}\n`, "utf8");
  fs.writeFileSync(
    GENERATED_SUMMARY_PATH,
    `${JSON.stringify(
      {
        generatedCount: pages.length,
        skippedCount: skipped.length,
        routeGroups: Array.from(new Set(pages.map((page) => page.path.split("/")[1]))).sort(),
        navigationGroups: navigationGroups.map((group) => ({ label: group.label, count: group.items.length, href: group.href })),
        lastmod: LASTMOD
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  fs.writeFileSync(path.join(DATA_DIR, "navigationGroups.json"), `${JSON.stringify(navigationGroups, null, 2)}\n`, "utf8");
}

function writePageHtml(page, navigationGroups) {
  const outputDir = path.join(ROOT, ...page.path.split("/").filter(Boolean));
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "index.html"), renderPage(page, navigationGroups), "utf8");
}

function readPreviousGeneratedState() {
  const state = { urls: new Set(), paths: new Set(), hubPaths: new Set() };

  if (fs.existsSync(PAGE_MAPPING_PATH)) {
    const mapping = JSON.parse(fs.readFileSync(PAGE_MAPPING_PATH, "utf8"));
    for (const page of mapping.generated || []) {
      if (page.newPageUrl) state.urls.add(page.newPageUrl);
      if (page.newPagePath) state.paths.add(page.newPagePath);
    }
  }

  if (fs.existsSync(GENERATED_SUMMARY_PATH)) {
    const summary = JSON.parse(fs.readFileSync(GENERATED_SUMMARY_PATH, "utf8"));
    state.hubPaths.add("/proxy-library");
    for (const group of summary.routeGroups || []) state.hubPaths.add(`/${group}`);
    for (const hubPath of state.hubPaths) state.urls.add(`${SITE_URL}${hubPath}`);
  }

  return state;
}

function removeGeneratedFile(routePath) {
  const outputDir = path.join(ROOT, ...routePath.split("/").filter(Boolean));
  const filePath = path.join(outputDir, "index.html");
  if (!fs.existsSync(filePath)) return;
  fs.rmSync(filePath);

  let current = outputDir;
  while (current.startsWith(ROOT) && current !== ROOT) {
    try {
      fs.rmdirSync(current);
      current = path.dirname(current);
    } catch {
      break;
    }
  }
}

function cleanupStaleGeneratedOutputs(previousState, currentPages, currentHubPaths) {
  const currentPaths = new Set(currentPages.map((page) => page.path));
  const currentHubs = new Set(currentHubPaths);

  for (const previousPath of previousState.paths) {
    if (!currentPaths.has(previousPath)) removeGeneratedFile(previousPath);
  }

  for (const previousHubPath of previousState.hubPaths) {
    if (!currentHubs.has(previousHubPath)) removeGeneratedFile(previousHubPath);
  }
}

function groupPagesByRoute(pages) {
  const groups = new Map();
  for (const page of pages) {
    const routeGroup = page.path.split("/")[1];
    if (!groups.has(routeGroup)) groups.set(routeGroup, []);
    groups.get(routeGroup).push(page);
  }
  return groups;
}

function renderHubPage({ path: pagePath, title, description, pages, navigationGroups }) {
  const page = {
    type: "hub",
    topic: title,
    path: pagePath,
    canonical: `${SITE_URL}${pagePath}`,
    seoTitle: `${title} | ${SITE_NAME}`,
    metaDescription: description,
    h1: title,
    shortTitle: title,
    groupLabel: "SEO Library",
    groupHref: "/proxy-library",
    typeLabel: "SEO Content Hub",
    heroText: description,
    schemaKind: "Article",
    faqs: [
      { q: `What is included in ${title}?`, a: "This hub links to original static SEO pages generated from the CSV topic research and rewritten for AffordableProxyHub." },
      { q: "Where is Cheapest Proxies placed?", a: "Cheapest Proxies is placed first and highlighted on all generated provider and comparison pages." },
      { q: "Are these pages static?", a: "Yes. They are plain static HTML pages with no database, backend, API, login, or payment system." },
      { q: "Are the routes copied from the competitor CSV?", a: "No. The CSV was used for topic inspiration, and each generated route uses original wording." },
      { q: "Do these pages include SEO metadata?", a: "Yes. Each generated page has a unique title, meta description, canonical tag, Open Graph tags, Twitter card tags, breadcrumbs, and schema." },
      { q: "Can search engines index this hub?", a: "Yes. The page uses indexable metadata and appears in sitemap.xml." },
      { q: "How are related pages connected?", a: "Each generated page includes links to related pages in the same topic cluster and core comparison resources." },
      { q: "Is any backend required?", a: "No. The entire SEO expansion is static and can be served as files." }
    ]
  };

  const schemas = buildSchemas(page);
  const groups = groupPagesByRoute(pages);
  const listing =
    pagePath === "/proxy-library"
      ? Array.from(groups.entries())
          .map(
            ([group, groupPages]) => `<section class="section" id="${group}">
        <h2>${escapeHtml(titleCase(group))}</h2>
        <div class="related-grid">
          ${groupPages
            .slice(0, 24)
            .map(
              (item) => `<a class="related-card" href="${escapeHtml(item.path)}"><strong>${escapeHtml(item.h1)}</strong><span>${escapeHtml(item.metaDescription)}</span></a>`
            )
            .join("")}
        </div>
      </section>`
          )
          .join("")
      : `<section class="section">
        <h2>${escapeHtml(title)} Pages</h2>
        <div class="related-grid">
          ${pages
            .map(
              (item) => `<a class="related-card" href="${escapeHtml(item.path)}"><strong>${escapeHtml(item.h1)}</strong><span>${escapeHtml(item.metaDescription)}</span></a>`
            )
            .join("")}
        </div>
      </section>`;

  return `${renderSEOHead(page, schemas)}
  <body>
    ${renderHeader(navigationGroups)}
    <main>
      ${renderPageHero(page)}
      <div class="container page-grid">
        <article class="content">
          <section class="section" id="intro">
            <h2>Static SEO Library</h2>
            <p>${escapeHtml(description)} This hub is generated from structured page data and uses original titles, routes, metadata, and page copy.</p>
          </section>
          ${listing}
          ${renderFAQSection(page)}
          ${renderCTASection({ topic: title })}
        </article>
        ${renderTableOfContents([{ id: "intro", title: "Intro" }, ...Array.from(groups.keys()).map((group) => ({ id: group, title: titleCase(group) })), { id: "faq", title: "FAQs" }, { id: "final-cta", title: "Final CTA" }])}
      </div>
    </main>
    ${renderFooter()}
  </body>
</html>
`;
}

function writeHubPages(pages, navigationGroups) {
  const hubs = [
    {
      path: "/proxy-library",
      title: "AffordableProxyHub SEO Library",
      description: "Browse the expanded static proxy comparison library with rankings, provider analysis, guides, locations, glossary, research, tools, alternatives, and market updates."
    }
  ];

  for (const [group, groupPages] of groupPagesByRoute(pages).entries()) {
    hubs.push({
      path: `/${group}`,
      title: `${titleCase(group)} Proxy Resources`,
      description: `Browse original ${titleCase(group)} pages generated for AffordableProxyHub with Cheapest Proxies featured first where provider recommendations appear.`,
      pages: groupPages
    });
  }

  for (const hub of hubs) {
    const hubPages = hub.path === "/proxy-library" ? pages : hub.pages;
    const outputDir = path.join(ROOT, ...hub.path.split("/").filter(Boolean));
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, "index.html"), renderHubPage({ ...hub, pages: hubPages, navigationGroups }), "utf8");
  }

  return hubs.map((hub) => hub.path);
}

function renderHomeHeaderNavigation(navigationGroups) {
  return `<header class="aph-home-seo-header" aria-label="Generated SEO page header navigation">
  <div class="aph-home-nav-inner">
    <div class="aph-home-nav-top">
      <a class="aph-home-brand" href="/"><span>A</span><span>AffordableProxyHub SEO Pages</span></a>
      <nav class="aph-home-main-links" aria-label="Core pages">
        <a href="/compare">Compare</a>
        <a href="/reviews">Reviews</a>
        <a href="/guides">Guides</a>
        <a href="/proxy-library">SEO Library</a>
        <a class="aph-home-cta" href="https://cheapest-proxies.com/" target="_blank" rel="noopener noreferrer">Visit Cheapest Proxies</a>
      </nav>
    </div>
    <nav class="aph-home-tabs" aria-label="All generated SEO page tabs">
      ${navigationGroups
        .map(
          (group) => `<details class="aph-home-tab">
        <summary>${escapeHtml(group.label)} <span>${group.items.length}</span></summary>
        <div class="aph-home-panel">
          <div class="aph-home-panel-head"><strong>${escapeHtml(group.label)}</strong><a href="${escapeHtml(group.href)}">Open hub</a></div>
          <div class="aph-home-panel-links">
            ${group.items.map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.title)}</a>`).join("")}
          </div>
        </div>
      </details>`
        )
        .join("")}
    </nav>
  </div>
</header>`;
}

function renderHomeCardGrid(items) {
  return `<div class="home-grid">${items
    .map(
      (item) => `<article class="home-mini-card">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
      ${item.href ? `<a href="${escapeHtml(item.href)}">Explore ${escapeHtml(item.title)}</a>` : ""}
    </article>`
    )
    .join("")}</div>`;
}

function renderHomeLinkGrid(items) {
  return `<div class="home-link-grid">${items
    .map((item) => `<a class="home-link-card" href="${escapeHtml(item.href)}">${escapeHtml(item.title)}</a>`)
    .join("")}</div>`;
}

function renderHomeFAQ() {
  const faqs = [
    {
      q: "Why does Cheapest Proxies appear first on the home page?",
      a: "Cheapest Proxies is the featured budget-friendly provider across this comparison site, so the home page keeps it first wherever providers are recommended."
    },
    {
      q: "Are the new SEO pages static?",
      a: "Yes. They are static HTML pages generated from structured data. No database, backend, API, login, dashboard, or payment logic was added."
    },
    {
      q: "How many SEO page groups are available from the header tabs?",
      a: "The header tabs group the generated pages into rankings, provider analysis, resources, locations, research, glossary, alternatives, comparisons, tools, knowledge, and market updates."
    },
    {
      q: "Do the header tabs include every generated page?",
      a: "Yes. Every generated CSV-derived page is linked inside one of the grouped header tabs."
    },
    {
      q: "Can I still use the old home page?",
      a: "Yes. The existing React home page remains in place. The new SEO expansion is added below it and through an additional static header navigation layer."
    },
    {
      q: "Do these pages copy the competitor CSV?",
      a: "No. The CSV was used for topic inspiration and routing intent only. Routes, titles, metadata, and content are original."
    },
    {
      q: "What should a proxy buyer compare first?",
      a: "Start with proxy type, target location, bandwidth, success rate, session behavior, and total monthly cost before looking at optional enterprise features."
    },
    {
      q: "Are all pages indexable?",
      a: "Yes. Public generated pages use indexable metadata, canonical tags, schema, and sitemap entries."
    }
  ];

  return faqs
    .map(
      (faq) => `<div class="home-faq-item">
      <h3>${escapeHtml(faq.q)}</h3>
      <p>${escapeHtml(faq.a)}</p>
    </div>`
    )
    .join("");
}

function renderHomeSEOExpansion(pages, navigationGroups) {
  const byType = new Map();
  for (const page of pages) {
    if (!byType.has(page.type)) byType.set(page.type, []);
    byType.get(page.type).push(page);
  }

  const pick = (type, count = 8) => (byType.get(type) || []).slice(0, count).map((page) => ({ title: page.shortTitle, href: page.path }));
  const groupStats = navigationGroups
    .map((group) => `<div class="home-stat"><strong>${group.items.length}</strong><span>${escapeHtml(group.label)}</span></div>`)
    .join("");

  const providerCards = providers
    .slice(0, 6)
    .map(
      (provider, index) => `<article class="home-provider-card">
      <h3>${index + 1}. ${escapeHtml(provider.name)}</h3>
      <p>${escapeHtml(provider.valueLabel)} - ${escapeHtml(provider.price)} - ${escapeHtml(provider.pool)}</p>
      <a class="${provider.featured ? "home-btn" : ""}" href="${escapeHtml(provider.url)}" target="_blank" rel="noopener noreferrer">${provider.featured ? "Get budget-friendly proxies" : `View ${escapeHtml(provider.name)}`}</a>
    </article>`
    )
    .join("");

  const sections = [
    `<section class="home-seo-section" id="home-seo-overview"><span class="home-seo-kicker">Expanded Static SEO Home</span><h2>Proxy Comparison Hub Built for Deeper Research</h2><p>The home page now includes a larger SEO structure that points readers into rankings, provider analysis, buyer guides, location pages, glossary entries, research notes, tools, alternatives, comparisons, and market updates. The existing home page remains intact above this expansion.</p></section>`,
    `<section class="home-seo-section home-seo-highlight" id="home-cheapest-proxies"><h2>Cheapest Proxies Is the First Provider to Evaluate</h2><p>Cheapest Proxies remains the top featured option on the home page because proxy buyers often need a budget-friendly residential proxy baseline before comparing premium enterprise networks.</p><div class="home-stat-grid"><div class="home-stat"><strong>$0.50/GB</strong><span>Starting price</span></div><div class="home-stat"><strong>10M+</strong><span>Residential IPs</span></div><div class="home-stat"><strong>150+</strong><span>Countries</span></div><div class="home-stat"><strong>99.9%</strong><span>Uptime target</span></div></div><a class="home-btn" href="https://cheapest-proxies.com/" target="_blank" rel="noopener noreferrer">Visit Cheapest Proxies</a></section>`,
    `<section class="home-seo-section" id="home-page-groups"><h2>New SEO Route Groups</h2><p>The generated header tabs expose every new page. The counts below show how the expanded static site is organized.</p><div class="home-stat-grid">${groupStats}</div></section>`,
    `<section class="home-seo-section" id="home-provider-ranking"><h2>Provider Ranking Snapshot</h2><p>Cheapest Proxies appears first, followed by other providers for comparison context.</p><div class="home-provider-grid">${providerCards}</div></section>`,
    `<section class="home-seo-section" id="home-proxy-types"><h2>Proxy Type Chooser</h2>${renderHomeCardGrid([
      { title: "Residential Proxies", href: "/solutions/residential-proxy-services", description: "Best for protected targets, local SEO checks, and lower detection risk." },
      { title: "Datacenter Proxies", href: "/solutions/datacenter-proxy-services", description: "Best for speed-focused tasks on simpler public websites." },
      { title: "Mobile Proxies", href: "/solutions/mobile-proxy-services", description: "Best for mobile-first platforms and high-trust carrier traffic." }
    ])}</section>`,
    `<section class="home-seo-section" id="home-rankings"><h2>Best Proxy Ranking Pages</h2><p>Use rankings when you need a fast shortlist of proxy options for a specific workflow.</p>${renderHomeLinkGrid(pick("ranking", 12))}</section>`,
    `<section class="home-seo-section" id="home-provider-analysis"><h2>Provider Review-Style Analysis</h2><p>Review-style pages help compare value, fit, pricing context, and practical alternatives.</p>${renderHomeLinkGrid(pick("review", 12))}</section>`,
    `<section class="home-seo-section" id="home-guides"><h2>Proxy Buyer Guides</h2><p>Guides turn complicated setup and buying decisions into practical steps.</p>${renderHomeLinkGrid(pick("guide", 12))}</section>`,
    `<section class="home-seo-section" id="home-locations"><h2>Location Proxy Pages</h2><p>Location pages help buyers plan country and regional targeting before buying traffic.</p>${renderHomeLinkGrid(pick("location", 12))}</section>`,
    `<section class="home-seo-section" id="home-alternatives"><h2>Alternatives Pages</h2><p>Alternatives pages are useful when a buyer wants a cheaper, simpler, or more flexible provider.</p>${renderHomeLinkGrid(pick("alternative", 12))}</section>`,
    `<section class="home-seo-section" id="home-comparisons"><h2>Comparison Pages</h2><p>Comparison pages focus on decision criteria such as proxy type, price, support, and scale.</p>${renderHomeLinkGrid(pick("comparison", 12))}</section>`,
    `<section class="home-seo-section" id="home-glossary"><h2>Glossary Pages</h2><p>Glossary entries explain proxy, scraping, and web data terms in plain language.</p>${renderHomeLinkGrid(pick("glossary", 12))}</section>`,
    `<section class="home-seo-section" id="home-research"><h2>Research and Statistics Pages</h2><p>Research pages provide evergreen market context for proxy buyers and data teams.</p>${renderHomeLinkGrid(pick("research", 12))}</section>`,
    `<section class="home-seo-section" id="home-knowledge"><h2>Knowledge Base Pages</h2><p>Knowledge pages connect web scraping concepts with safe proxy planning.</p>${renderHomeLinkGrid(pick("knowledge", 12))}</section>`,
    `<section class="home-seo-section" id="home-tools"><h2>Proxy Tool Pages</h2><p>Tool pages help readers evaluate proxy checks, diagnostics, and workflow planning.</p>${renderHomeLinkGrid(pick("tool", 12))}</section>`,
    `<section class="home-seo-section" id="home-market-updates"><h2>Market Update Pages</h2><p>Market update pages convert competitor-style news topics into evergreen buyer context.</p>${renderHomeLinkGrid(pick("marketUpdate", 12))}</section>`,
    `<section class="home-seo-section" id="home-use-cases"><h2>Core Proxy Use Cases</h2>${renderHomeCardGrid([
      { title: "Web Scraping", href: "/top/web-scraping-proxy-services", description: "Use rotating residential proxies when public data collection needs IP diversity." },
      { title: "SEO Monitoring", href: "/top/seo-proxy-services", description: "Use geo-targeted proxies for local SERP checks and rank tracking." },
      { title: "Ad Verification", href: "/rankings/ad-verification-service-roundup", description: "Use location-aware proxy traffic to inspect ad delivery by market." }
    ])}</section>`,
    `<section class="home-seo-section" id="home-pricing"><h2>Pricing and Value Planning</h2><p>Proxy value depends on bandwidth, target difficulty, retry rates, support, and how much traffic becomes a successful result. Cheapest Proxies stays first because a budget-friendly baseline helps buyers avoid overpaying too early.</p></section>`,
    `<section class="home-seo-section" id="home-performance"><h2>Performance Testing</h2><p>Measure median latency, success rate, bandwidth per completed task, location accuracy, and retry volume on your actual target sites before scaling any proxy workflow.</p></section>`,
    `<section class="home-seo-section" id="home-safety"><h2>Safety and Trust</h2><p>Use providers with clear terms, HTTPS proxy support, stable authentication, and responsive support. Avoid unknown free proxy lists for business workflows or authenticated traffic.</p></section>`,
    `<section class="home-seo-section" id="home-common-mistakes"><h2>Common Proxy Buying Mistakes</h2><ul class="home-seo-list"><li>Buying only because a provider advertises a large IP pool.</li><li>Skipping small tests on the real target website.</li><li>Using datacenter proxies where residential proxies are needed.</li><li>Ignoring bandwidth consumed by retries and media-heavy pages.</li><li>Comparing monthly price without comparing successful output.</li></ul></section>`,
    `<section class="home-seo-section" id="home-internal-linking"><h2>Internal Linking Structure</h2><p>The home page now links into the SEO library, and the generated header tabs link to every new page. Each generated page also links to related pages, core comparison resources, and Cheapest Proxies CTAs.</p><a class="home-btn" href="/proxy-library">Browse the full SEO library</a></section>`,
    `<section class="home-seo-section" id="home-faq"><h2>Home Page Proxy FAQs</h2>${renderHomeFAQ()}</section>`,
    `<section class="home-seo-section home-seo-highlight" id="home-final-cta"><h2>Start with the Featured Budget-Friendly Proxy Option</h2><p>Compare the expanded SEO library, then test a practical proxy workflow with Cheapest Proxies first if value and residential proxy access are your main priorities.</p><a class="home-btn" href="https://cheapest-proxies.com/" target="_blank" rel="noopener noreferrer">Compare plans at Cheapest Proxies</a></section>`
  ];

  return `<section class="home-seo-expansion" id="home-seo-expansion" aria-label="Expanded home page SEO content">
  <div class="home-seo-wrap">
    ${sections.join("\n    ")}
  </div>
</section>`;
}

function replaceMarkedBlock(source, startMarker, endMarker, replacement, beforeNeedle) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker);

  if (start !== -1 && end !== -1 && end > start) {
    return `${source.slice(0, start)}${replacement}${source.slice(end + endMarker.length)}`;
  }

  const needleIndex = source.indexOf(beforeNeedle);
  if (needleIndex === -1) throw new Error(`Could not find insertion point ${beforeNeedle}`);
  return `${source.slice(0, needleIndex)}${replacement}\n${source.slice(needleIndex)}`;
}

function writeHomePageExpansion(pages, navigationGroups) {
  const indexPath = path.join(ROOT, "index.html");
  let html = fs.readFileSync(indexPath, "utf8");
  const navJson = JSON.stringify(navigationGroups);
  const homeHeader = renderHomeHeaderNavigation(navigationGroups);
  const expansion = renderHomeSEOExpansion(pages, navigationGroups);

  const headStart = "    <!-- APH_HOME_SEO_HEAD_START -->";
  const headEnd = "    <!-- APH_HOME_SEO_HEAD_END -->";
  const headBlock = `${headStart}
    <link rel="stylesheet" href="/assets/home-seo-expansion.css" />
    <script defer src="/assets/home-seo-nav.js"></script>
    ${headEnd}`;

  const navStart = "    <!-- APH_HOME_SEO_NAV_START -->";
  const navEnd = "    <!-- APH_HOME_SEO_NAV_END -->";
  const navBlock = `${navStart}
    ${homeHeader}
    ${navEnd}`;

  const bodyStart = "    <!-- APH_HOME_SEO_START -->";
  const bodyEnd = "    <!-- APH_HOME_SEO_END -->";
  const bodyBlock = `${bodyStart}
    <script type="application/json" id="aph-seo-nav-data">${navJson}</script>
    ${expansion}
    ${bodyEnd}`;

  html = replaceMarkedBlock(html, headStart, headEnd, headBlock, "  </head>");
  html = replaceMarkedBlock(html, navStart, navEnd, navBlock, "    <div id=\"root\"></div>");
  html = replaceMarkedBlock(html, bodyStart, bodyEnd, bodyBlock, "  </body>");

  fs.writeFileSync(indexPath, html, "utf8");
}

function parseExistingSitemapUrls() {
  const sitemapPath = path.join(ROOT, "sitemap.xml");
  if (!fs.existsSync(sitemapPath)) return [];
  const xml = fs.readFileSync(sitemapPath, "utf8");
  return Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map((match) => match[1]);
}

function writeSitemap(pages, hubPaths, previousGeneratedUrls) {
  const existingUrls = parseExistingSitemapUrls().filter((url) => !previousGeneratedUrls.has(url));
  const generatedUrls = [...pages.map((page) => page.canonical), ...hubPaths.map((hubPath) => `${SITE_URL}${hubPath}`)];
  const urls = Array.from(new Set([...existingUrls, ...generatedUrls])).sort((a, b) => {
    if (a === `${SITE_URL}/`) return -1;
    if (b === `${SITE_URL}/`) return 1;
    return a.localeCompare(b);
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => {
    const isGenerated = generatedUrls.includes(url);
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${isGenerated ? LASTMOD : "2025-06-01"}</lastmod>
    <changefreq>${isGenerated ? "monthly" : "weekly"}</changefreq>
    <priority>${url === `${SITE_URL}/` ? "1.0" : isGenerated ? "0.72" : "0.8"}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>
`;

  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml, "utf8");
}

function writeRobots() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(ROOT, "robots.txt"), robots, "utf8");
}

function main() {
  const previousState = readPreviousGeneratedState();
  const { pages, skipped } = createPageObjects();
  const navigationGroups = buildNavigationGroups(pages);
  for (const page of pages) writePageHtml(page, navigationGroups);
  const hubPaths = writeHubPages(pages, navigationGroups);
  cleanupStaleGeneratedOutputs(previousState, pages, hubPaths);
  writeHomePageExpansion(pages, navigationGroups);
  writeGeneratedData(pages, skipped, navigationGroups);
  writeSitemap(pages, hubPaths, previousState.urls);
  writeRobots();

  console.log(`Generated ${pages.length} CSV-derived SEO pages.`);
  console.log(`Generated ${hubPaths.length} SEO hub pages.`);
  console.log(`Skipped ${skipped.length} non-useful or already-covered CSV rows.`);
}

main();
