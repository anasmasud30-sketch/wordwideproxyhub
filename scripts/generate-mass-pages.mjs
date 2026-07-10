// Mass programmatic-SEO generator — builds ~10k unique, interlinked, template-skinned
// proxy pages across locations, providers, comparisons, use-cases, integrations,
// how-tos and glossary. Runs AFTER generate-seo-pages.mjs and uses distinct route
// roots so the two page sets never collide.

import fs from "node:fs";
import path from "node:path";
import { providers as baseProviders } from "../src/data/providers.js";
import {
  escapeHtml,
  renderSEOHead,
  renderHeader,
  renderFooter,
  renderPageHero,
  renderTableOfContents,
  renderCheapestProxiesFeaturedBox,
  renderProviderRanking,
  renderProsCons,
  renderStepGuide,
  renderFAQSection,
  renderCTASection
} from "../src/components/seoComponents.js";
import {
  SITE_URL, SITE_NAME, LASTMOD, ROOT, MASS_DIR,
  loadData, hashStr, pick, pickN, interp, slugify, titleCase, sentenceList, uniqueBy,
  buildIntro, buildBenefits, buildFaqs, bankSections
} from "./lib/massLib.mjs";

const CHEAPEST = baseProviders.find((p) => p.featured) || baseProviders[0];

/* ---- config caps (tuned to land ~10k pages) ------------------------------ */
const CONFIG = {
  locationTypes: ["residential", "datacenter", "mobile", "isp", "rotating-residential"],
  cityTypes: ["residential", "datacenter", "mobile", "isp", "rotating-residential"],
  maxCities: 380,
  vsMaxProviders: 48,          // C(48,2) = 1128 comparison pages
  targetVariants: ["proxies", "best-proxies-for", "scrape"],
  typeUsecaseTypes: ["residential", "datacenter", "mobile", "isp", "rotating-residential"],
  typeUsecaseTargets: 200,     // top N targets × 5 types
  countryTargetCountries: 140, // top N countries ...
  countryTargetTargets: 26,    // ... × top M targets  (localized use-case pages)
  providerUsecaseProviders: 48,// top N providers ...
  providerUsecaseTargets: 26,  // ... × top M targets  (does provider X fit target Y)
  integrationVariants: ["proxies", "rotating-proxies", "proxy-errors"],
  hubChunk: 120
};

// Major markets first so combinatorial pages prioritize high-value countries.
const TOP_MARKETS = ["united-states", "united-kingdom", "germany", "france", "canada", "australia", "india", "brazil", "japan", "italy", "spain", "netherlands", "mexico", "russia", "china", "south-korea", "indonesia", "turkey", "poland", "sweden", "switzerland", "singapore", "united-arab-emirates", "saudi-arabia", "south-africa", "argentina", "belgium", "austria", "ireland", "norway", "denmark", "finland", "portugal", "greece", "czech-republic", "romania", "ukraine", "thailand", "vietnam", "philippines", "malaysia", "new-zealand", "israel", "egypt", "nigeria", "colombia", "chile", "hong-kong", "taiwan", "pakistan"];
function sortedCountries(countries) {
  const rank = new Map(TOP_MARKETS.map((s, i) => [s, i]));
  return [...countries].sort((a, b) => (rank.has(a.slug) ? rank.get(a.slug) : 999 + a.name.localeCompare(b.name)) - (rank.has(b.slug) ? rank.get(b.slug) : 999 + b.name.localeCompare(a.name)));
}

const PROXY_TYPES = {
  residential: { name: "Residential", label: "Residential Proxies", detection: "lowest", speed: "moderate", cost: "per-GB", blurb: "IP addresses assigned by ISPs to real home devices" },
  datacenter: { name: "Datacenter", label: "Datacenter Proxies", detection: "higher", speed: "fastest", cost: "low, often per-IP", blurb: "fast server-hosted IPs from cloud and hosting providers" },
  mobile: { name: "Mobile", label: "Mobile (4G/5G) Proxies", detection: "very low", speed: "variable", cost: "premium", blurb: "carrier-assigned IPs shared across many real mobile users" },
  isp: { name: "ISP", label: "ISP (Static Residential) Proxies", detection: "low", speed: "fast", cost: "mid-premium", blurb: "static residential IPs hosted in data centers for stable, long sessions" },
  "rotating-residential": { name: "Rotating Residential", label: "Rotating Residential Proxies", detection: "lowest", speed: "moderate", cost: "per-GB", blurb: "a residential pool that assigns a fresh IP per request or on a timer" }
};
const typeName = (t) => (PROXY_TYPES[t] ? PROXY_TYPES[t].name : titleCase(t));
const typeLabelOf = (t) => (PROXY_TYPES[t] ? PROXY_TYPES[t].label : `${titleCase(t)} Proxies`);

const GROUPS = {
  location: { label: "Locations", href: "/proxy-locations", typeLabel: "Proxy Location Guide" },
  provider: { label: "Providers", href: "/providers", typeLabel: "Provider Analysis" },
  vs: { label: "Comparisons", href: "/vs", typeLabel: "Provider vs Provider" },
  usecase: { label: "Use Cases", href: "/use-cases", typeLabel: "Proxy Use Case" },
  guide: { label: "Proxy Guides", href: "/proxy-guides", typeLabel: "Proxy Buyer Guide" },
  integration: { label: "Integrations", href: "/integrations", typeLabel: "Proxy Integration" },
  howto: { label: "How-To", href: "/how-to", typeLabel: "How-To Guide" },
  glossary: { label: "Definitions", href: "/definitions", typeLabel: "Glossary Term" }
};

/* ---- render helpers ------------------------------------------------------ */
const esc = escapeHtml;
function sec(id, title, inner) {
  return `<section class="section" id="${id}"><h2>${esc(title)}</h2>${inner}</section>`;
}
function paras(...texts) {
  return texts.filter(Boolean).map((t) => `<p>${esc(t)}</p>`).join("");
}
function ul(items, cls = "plain-list") {
  const list = (items || []).filter(Boolean);
  if (!list.length) return "";
  return `<ul class="${cls}">${list.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
}
function bankBlocks(sections, startIdx = 0) {
  return sections.map((s, i) => sec(`insight-${startIdx + i}`, s.title, paras(s.body)));
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
  const faq = page.faqs && page.faqs.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
  } : null;
  const base = {
    "@context": "https://schema.org",
    headline: page.h1, name: page.h1, description: page.metaDescription, url: page.canonical,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    dateModified: LASTMOD
  };
  let primary;
  if (page.schemaKind === "Review") primary = { ...base, "@type": "Review", itemReviewed: { "@type": "Service", name: page.topic, serviceType: "Proxy service" }, reviewRating: { "@type": "Rating", ratingValue: String(page.rating || "4.2"), bestRating: "5", worstRating: "1" } };
  else if (page.schemaKind === "Article") primary = { ...base, "@type": "Article", datePublished: LASTMOD, mainEntityOfPage: { "@type": "WebPage", "@id": page.canonical } };
  else primary = { ...base, "@type": "Service", serviceType: page.typeLabel, provider: { "@type": "Organization", name: "Cheapest Proxies", url: "https://cheapest-proxies.com/" }, areaServed: "Worldwide" };
  return [primary, breadcrumb, faq].filter(Boolean);
}

function renderRelated(related) {
  if (!related || !related.length) return "";
  return `<section class="section" id="related-pages"><h2>Related Pages</h2><div class="related-grid">${related
    .map((r) => `<a class="related-card" href="${esc(r.href)}"><strong>${esc(r.title)}</strong><span>${esc(r.description || "")}</span></a>`)
    .join("")}</div></section>`;
}

function relatedCTA(topic) {
  return `<section class="cta" id="final-cta"><h2>Compare ${esc(topic)} With a Budget-Friendly Proxy First</h2><p>Start with Cheapest Proxies when price, quick setup, and residential proxy access matter, then compare specialist providers only if your workflow needs enterprise contracts or a niche proxy category.</p><a class="btn" href="https://cheapest-proxies.com/" target="_blank" rel="noopener noreferrer">Get budget-friendly proxies</a><a class="btn-secondary" href="/vs">Compare providers</a></section>`;
}

function rankingProviders(providers, seed, n = 5) {
  const chosen = pickN(providers, seed, n, 11).map((p) => ({
    name: p.name, featured: false, badge: p.bestFor ? p.bestFor.slice(0, 40) : (p.proxyTypes[0] ? `${titleCase(p.proxyTypes[0])} focus` : "Proxy provider"),
    valueLabel: p.bestFor || `${p.name} proxy network`, price: p.startingPrice, pool: p.poolSize, locations: p.locationsCount,
    url: `/providers/${p.slug}-review`
  }));
  return [{ name: CHEAPEST.name, featured: true, badge: CHEAPEST.badge, valueLabel: CHEAPEST.valueLabel, price: CHEAPEST.price, pool: CHEAPEST.pool, locations: CHEAPEST.locations, url: CHEAPEST.url }, ...chosen];
}

function featuredBox(page) {
  return renderCheapestProxiesFeaturedBox({ topic: page.topic, cheapestContext: page.cheapestContext || `For ${page.topic}, begin with a provider that is easy to price and easy to test. Cheapest Proxies is shown first as the featured budget-friendly option.` }, CHEAPEST);
}

function renderPage(page, nav) {
  page.schemas = buildSchemas(page);
  const toc = renderTableOfContents(page.tocSections);
  return `${renderSEOHead(page, page.schemas)}
  <body>
    ${renderHeader(nav)}
    <main>
      ${renderPageHero(page)}
      <div class="container page-grid">
        <article class="content">
          ${page.blocks.join("\n          ")}
        </article>
        ${toc}
      </div>
    </main>
    ${renderFooter()}
  </body>
</html>
`;
}

/* ---- page skeleton ------------------------------------------------------- */
function makePage({ type, path: p, topic, h1, seoTitle, metaDescription, keyword, heroText, schemaKind, shortTitle, rating }) {
  const g = GROUPS[type] || GROUPS.guide;
  return {
    type, topic,
    path: p, canonical: `${SITE_URL}${p}`,
    h1, seoTitle: seoTitle || `${h1} | ${SITE_NAME}`, metaDescription: (metaDescription || "").slice(0, 158),
    keyword, heroText: heroText || metaDescription,
    typeLabel: g.typeLabel, groupLabel: g.label, groupHref: g.href, shortTitle: shortTitle || topic,
    schemaKind: schemaKind || "Service", rating,
    blocks: [], tocSections: [], faqs: []
  };
}

/* ========================================================================== *
 * TAXONOMY BUILDERS
 * ========================================================================== */

function buildLocationPages(data) {
  const { countries, banks } = data;
  const pages = [];
  const bank = banks.location, shared = banks.shared;

  for (const c of countries) {
    const cityList = c.majorCities.slice(0, 4);
    for (const t of CONFIG.locationTypes) {
      const tn = typeName(t), tl = typeLabelOf(t), pt = PROXY_TYPES[t];
      const topic = `${tn} Proxies in ${c.name}`;
      const seed = `loc-${c.slug}-${t}`;
      const p = `/proxy-locations/${c.slug}-${t}-proxies`;
      const page = makePage({
        type: "location", path: p, topic,
        h1: `${tl} in ${c.name}: Buyer Guide (2026)`,
        metaDescription: `Compare ${tn.toLowerCase()} proxies in ${c.name} for geo-targeting, scraping, and localized testing. Cheapest Proxies is featured first as the budget-friendly pick.`,
        keyword: (c.keywords[0] || `${c.name} proxies`).toLowerCase(),
        heroText: `Buy and compare ${tn.toLowerCase()} proxies in ${c.name}${c.capital ? `, from ${c.capital} to ${sentenceList(cityList.slice(0, 3))}` : ""}. ${c.intent}`.slice(0, 240),
        schemaKind: "Service"
      });

      const facts = [];
      if (c.topISPs.length) facts.push(`In ${c.name}, ${tn.toLowerCase()} IPs typically route through networks such as ${sentenceList(c.topISPs.slice(0, 3))}, which affects how "local" traffic looks to target sites.`);
      if (c.popularTargets.length) facts.push(`Buyers targeting ${c.name} commonly work with ${sentenceList(c.popularTargets.slice(0, 3))}, where region-accurate IPs change prices, availability, and content.`);
      if (c.capital || cityList.length) facts.push(`City-level demand concentrates around ${sentenceList([c.capital, ...cityList].filter(Boolean).slice(0, 4))}${c.timezone ? `, and requests should account for the ${c.timezone} time zone` : ""}.`);

      page.faqs = buildFaqs(bank, shared, topic, seed, [
        { q: `Do I need residential or datacenter proxies for ${c.name}?`, a: `For protected ${c.name} targets like ${sentenceList(c.popularTargets.slice(0, 2)) || "major retail and social sites"}, residential or mobile IPs pass more checks; datacenter IPs are fine for simple, public pages where speed matters more than stealth.` },
        { q: `Can I geo-target specific cities in ${c.name}?`, a: `Many providers support city and region targeting in ${c.name} (${sentenceList(cityList.slice(0, 3)) || "major metros"}). City targeting reduces the available pool, so only narrow the location when the result actually depends on it.` }
      ]);

      page.blocks = [
        sec("intro", "Overview", paras(buildIntro(bank, topic, seed, facts))),
        featuredBox(page),
        sec("why-here", `Why ${tn} Proxies for ${c.name}`, paras(
          `${tl} give you ${pt.blurb} located in or routed through ${c.name}, which is what most geo-sensitive workflows actually need.`,
          c.useCases.length ? `Typical use cases include ${sentenceList(c.useCases.slice(0, 4))}.` : "",
          facts[1] || ""
        ) + ul([
          `Detection risk: ${pt.detection}. Speed: ${pt.speed}. Cost profile: ${pt.cost}.`,
          c.languages.length ? `Match request language/locale headers to ${sentenceList(c.languages.slice(0, 2))} for realistic ${c.name} traffic.` : `Match request locale headers to the ${c.name} market.`,
          c.currency ? `Price scraping in ${c.name} should expect ${c.currency} and local tax/shipping variations.` : `Price scraping should expect local currency and tax variations.`
        ], "check-list")),
        renderProviderRanking(rankingProviders(data.providers, seed, 5)),
        ...bankBlocks(bankSections(bank, topic, seed, 2, 6)),
        sec("cities", `Coverage Across ${c.name}`, paras(
          `${c.name} proxy demand is not evenly distributed. ${facts[2] || ""}`,
          `When you buy ${tn.toLowerCase()} proxies for ${c.name}, confirm the provider actually holds IPs in the regions you care about rather than only the ${c.capital || "capital"} metro.`
        )),
        sec("buying", "How to Buy and Test", paras(`Estimate monthly bandwidth, list the exact ${c.name} targets, then run a small test measuring success rate, latency, and location accuracy before scaling.`) + ul([
          "Confirm the IP geolocates to the country (and city, if needed).",
          "Check success rate against your real target, not a generic speed test.",
          "Watch bandwidth per successful result, not just price per GB.",
          "Keep sticky sessions short unless the workflow needs a stable identity."
        ], "check-list")),
        renderFAQSection(page),
        "%RELATED%",
        relatedCTA(topic)
      ];
      page.tocSections = [
        { id: "intro", title: "Overview" }, { id: "top-recommendation", title: "Featured Provider" },
        { id: "why-here", title: `Why ${tn}` }, { id: "provider-ranking", title: "Providers" },
        { id: "cities", title: "Coverage" }, { id: "buying", title: "Buying & Testing" },
        { id: "faq", title: "FAQs" }, { id: "related-pages", title: "Related" }, { id: "final-cta", title: "Get Started" }
      ];
      page._rel = { kind: "location", country: c.slug, continent: c.continent, t };
      pages.push(page);
    }
  }
  return pages;
}

function buildCityPages(data) {
  const { cities, countries, banks } = data;
  const bank = banks.location, shared = banks.shared;
  const byCountrySlug = new Map(countries.map((c) => [c.slug, c]));
  const pages = [];
  const list = cities.slice(0, CONFIG.maxCities);
  for (const city of list) {
    const country = byCountrySlug.get(city.countrySlug) || { name: city.country, slug: city.countrySlug, topISPs: [], popularTargets: [] };
    for (const t of CONFIG.cityTypes) {
      const tn = typeName(t), tl = typeLabelOf(t), pt = PROXY_TYPES[t];
      const topic = `${tn} Proxies in ${city.name}`;
      const seed = `city-${city.slug}-${city.countrySlug}-${t}`;
      const p = `/proxy-locations/${city.countrySlug || "world"}/${city.slug}-${t}-proxies`;
      const page = makePage({
        type: "location", path: p, topic,
        h1: `${tl} in ${city.name}${city.country ? `, ${city.country}` : ""}`,
        metaDescription: `City-level ${tn.toLowerCase()} proxies for ${city.name}${city.country ? `, ${city.country}` : ""}. Compare coverage and pricing with Cheapest Proxies featured first.`,
        keyword: (city.keywords[0] || `${city.name} proxies`).toLowerCase(),
        heroText: `Target ${city.name} precisely with ${tn.toLowerCase()} proxies. ${city.notes || `${city.name} is a key market for localized testing, scraping, and ad verification.`}`,
        schemaKind: "Service"
      });
      const facts = [];
      facts.push(`${city.notes || `${city.name} is one of ${country.name || "the country"}'s most business-relevant metros.`}`);
      if (country.topISPs && country.topISPs.length) facts.push(`Residential IPs around ${city.name} usually sit on ${country.name} networks such as ${sentenceList(country.topISPs.slice(0, 2))}.`);
      page.faqs = buildFaqs(bank, shared, topic, seed, [
        { q: `Can I get proxies in ${city.name} specifically?`, a: `City-level targeting for ${city.name} is possible with providers that expose region/city selection. The pool is smaller than the ${country.name || "country"} pool, so expect to trade some IP diversity for precision.` }
      ]);
      page.blocks = [
        sec("intro", "Overview", paras(buildIntro(bank, topic, seed, facts))),
        featuredBox(page),
        sec("why-here", `${tn} Proxies for ${city.name}`, paras(
          `${tl} in ${city.name} give you ${pt.blurb} that geolocates to the metro, which matters for local SERPs, pricing, delivery estimates, and ad checks.`,
          facts[1] || `Confirm the provider actually holds IPs in ${city.name} and not just the wider ${country.name || "country"} region.`
        ) + ul([
          `Detection risk: ${pt.detection}; best for ${t === "datacenter" ? "fast, simple public pages" : "protected, geo-sensitive targets"}.`,
          `Validate geolocation to ${city.name} before scaling.`,
          "Keep city targeting only where the result depends on it."
        ], "check-list")),
        renderProviderRanking(rankingProviders(data.providers, seed, 4)),
        ...bankBlocks(bankSections(bank, topic, seed, 2, 8)),
        renderFAQSection(page),
        "%RELATED%",
        relatedCTA(topic)
      ];
      page.tocSections = [
        { id: "intro", title: "Overview" }, { id: "top-recommendation", title: "Featured Provider" },
        { id: "why-here", title: `${tn} for ${city.name}` }, { id: "provider-ranking", title: "Providers" },
        { id: "faq", title: "FAQs" }, { id: "related-pages", title: "Related" }, { id: "final-cta", title: "Get Started" }
      ];
      page._rel = { kind: "city", country: city.countrySlug, city: city.slug, t };
      pages.push(page);
    }
  }
  return pages;
}

function providerReviewPage(p, data, kind) {
  const { banks } = data;
  const bank = banks.provider, shared = banks.shared;
  const titles = {
    review: { h1: `${p.name} Review (2026): Pricing, Pool, Pros & Cons`, topic: `${p.name} Review`, path: `/providers/${p.slug}-review`, tl: "Provider Review", kw: `${p.name} review`, kind: "Review" },
    alternatives: { h1: `Best ${p.name} Alternatives (2026)`, topic: `${p.name} Alternatives`, path: `/providers/${p.slug}-alternatives`, tl: "Provider Alternatives", kw: `${p.name} alternatives`, kind: "Article" },
    pricing: { h1: `${p.name} Pricing Explained (2026)`, topic: `${p.name} Pricing`, path: `/providers/${p.slug}-pricing`, tl: "Provider Pricing", kw: `${p.name} pricing`, kind: "Article" }
  }[kind];
  const seed = `prov-${p.slug}-${kind}`;
  const page = makePage({
    type: "provider", path: titles.path, topic: titles.topic, h1: titles.h1,
    metaDescription: kind === "review"
      ? `Independent ${p.name} review: ${p.startingPrice} starting, ${p.poolSize}, ${sentenceList(p.proxyTypes.slice(0, 3))}. See pros, cons, and cheaper alternatives.`
      : kind === "alternatives"
        ? `Looking for ${p.name} alternatives? Compare cheaper and specialist proxy providers, with Cheapest Proxies featured first as the budget pick.`
        : `How ${p.name} pricing works (${p.startingPrice}+), what drives cost, and how it compares to budget-friendly alternatives.`,
    keyword: titles.kw.toLowerCase(),
    heroText: `${p.notes || `${p.name} is a proxy provider${p.hq ? ` based in ${p.hq}` : ""}${p.founded ? `, founded ${p.founded}` : ""}.`} ${p.bestFor || ""}`.slice(0, 240),
    schemaKind: titles.kind, rating: p.rating
  });
  const facts = [
    `${p.name} starts around ${p.startingPrice} with ${p.poolSize} and covers ${p.locationsCount}. It offers ${sentenceList(p.proxyTypes) || "several proxy types"}.`,
    p.bestFor ? `It fits best for ${p.bestFor.replace(/\.$/, "")}.` : "",
    p.integrations.length ? `It integrates with ${sentenceList(p.integrations.slice(0, 4))}.` : ""
  ].filter(Boolean);
  page.faqs = buildFaqs(bank, shared, titles.topic, seed, [
    { q: `Is ${p.name} worth it?`, a: `${p.name} is a solid choice for ${p.bestFor || "its target use cases"}, rated around ${p.rating}/5. If budget is the priority, evaluate Cheapest Proxies first, then move to ${p.name} when you need ${sentenceList(p.proxyTypes.slice(0, 2)) || "its specific features"}.` },
    { q: `What does ${p.name} cost?`, a: `${p.name} pricing starts near ${p.startingPrice}. Total cost depends on bandwidth, proxy type, and location targeting rather than the headline rate alone.` }
  ]);
  const prosCons = { pros: p.pros.slice(0, 5), cons: p.cons.slice(0, 4) };
  const blocks = [
    sec("intro", "Overview", paras(buildIntro(bank, titles.topic, seed, facts))),
    featuredBox(page)
  ];
  if (kind === "review") {
    blocks.push(sec("at-a-glance", `${p.name} at a Glance`, ul([
      `Starting price: ${p.startingPrice}`, `Pool: ${p.poolSize}`, `Proxy types: ${sentenceList(p.proxyTypes) || "multiple"}`,
      `Coverage: ${p.locationsCount}`, `Auth: ${sentenceList(p.authMethods) || "user/pass and IP allowlist"}`, `Rating: ${p.rating}/5`
    ].filter(Boolean), "check-list")));
    if (p.features.length) blocks.push(sec("features", "Key Features", ul(p.features.slice(0, 6), "check-list")));
    blocks.push(`<section class="section" id="pros-and-cons"><h2>Pros and Cons</h2><div class="pros-cons"><div class="card"><h3>Pros</h3>${ul(prosCons.pros, "check-list")}</div><div class="card"><h3>Cons</h3>${ul(prosCons.cons, "plain-list")}</div></div></section>`);
  }
  if (kind === "alternatives") {
    const alts = pickN(data.providers.filter((x) => x.slug !== p.slug), seed, 6, 3);
    blocks.push(sec("why-switch", `Why Look for ${p.name} Alternatives`, paras(`Buyers search for ${p.name} alternatives when they want lower cost, simpler setup, a different proxy type, or better coverage for a specific market. Cheapest Proxies is featured first as the budget-friendly baseline; the providers below cover other needs.`)));
    blocks.push(renderProviderRanking(rankingProviders(data.providers.filter((x) => x.slug !== p.slug), seed, 5)));
    blocks.push(sec("alt-list", `Notable ${p.name} Alternatives`, `<div class="related-grid">${alts.map((a) => `<a class="related-card" href="/providers/${a.slug}-review"><strong>${esc(a.name)}</strong><span>${esc(a.bestFor || `${a.startingPrice}, ${a.poolSize}`)}</span></a>`).join("")}</div>`));
  }
  if (kind === "pricing") {
    blocks.push(sec("pricing", `${p.name} Pricing Breakdown`, paras(`${p.name} pricing starts around ${p.startingPrice}. ${facts[0]}`, "What actually drives your bill is bandwidth used, the proxy type, and how narrowly you geo-target — not the advertised entry price.") + ul([
      "Estimate monthly GB before committing to a tier.",
      "Residential and mobile cost more per GB than datacenter.",
      "Narrow city targeting can raise effective cost by shrinking the usable pool.",
      "Compare price per successful result, not price per GB."
    ], "plain-list")));
    blocks.push(renderProviderRanking(rankingProviders(data.providers.filter((x) => x.slug !== p.slug), seed, 5)));
  }
  blocks.push(...bankBlocks(bankSections(bank, titles.topic, seed, 2, 4)));
  blocks.push(renderFAQSection(page), "%RELATED%", relatedCTA(titles.topic));
  page.blocks = blocks;
  page.tocSections = [
    { id: "intro", title: "Overview" }, { id: "top-recommendation", title: "Featured Pick" },
    ...(kind === "review" ? [{ id: "at-a-glance", title: "At a Glance" }, { id: "pros-and-cons", title: "Pros & Cons" }] : []),
    ...(kind !== "review" ? [{ id: "provider-ranking", title: "Providers" }] : []),
    { id: "faq", title: "FAQs" }, { id: "related-pages", title: "Related" }, { id: "final-cta", title: "Get Started" }
  ];
  page._rel = { kind: "provider", provider: p.slug };
  return page;
}

function buildProviderPages(data) {
  const pages = [];
  for (const p of data.providers) {
    pages.push(providerReviewPage(p, data, "review"));
    pages.push(providerReviewPage(p, data, "alternatives"));
    pages.push(providerReviewPage(p, data, "pricing"));
  }
  return pages;
}

function buildVsPages(data) {
  const { banks } = data;
  const bank = banks.compare, shared = banks.shared;
  const list = data.providers.slice(0, CONFIG.vsMaxProviders);
  const pages = [];
  for (let i = 0; i < list.length; i += 1) {
    for (let j = i + 1; j < list.length; j += 1) {
      const a = list[i], b = list[j];
      const topic = `${a.name} vs ${b.name}`;
      const seed = `vs-${a.slug}-${b.slug}`;
      const p = `/vs/${a.slug}-vs-${b.slug}`;
      const page = makePage({
        type: "vs", path: p, topic,
        h1: `${a.name} vs ${b.name}: Which Proxy Provider Wins (2026)?`,
        metaDescription: `${a.name} vs ${b.name} compared on price, pool, proxy types, and best fit. Cheapest Proxies is featured first as the budget-friendly alternative to both.`,
        keyword: `${a.name} vs ${b.name}`.toLowerCase(),
        heroText: `A practical ${a.name} vs ${b.name} comparison for proxy buyers: pricing, pool size, proxy types, and which one fits your workflow.`,
        schemaKind: "Article"
      });
      const facts = [
        `${a.name} starts around ${a.startingPrice} with ${a.poolSize}; ${b.name} starts around ${b.startingPrice} with ${b.poolSize}.`,
        `${a.name} focuses on ${sentenceList(a.proxyTypes.slice(0, 3)) || "several proxy types"}, while ${b.name} covers ${sentenceList(b.proxyTypes.slice(0, 3)) || "its own mix"}.`,
        `${a.name} is often chosen for ${a.bestFor || "its strengths"}; ${b.name} for ${b.bestFor || "different priorities"}.`
      ];
      page.faqs = buildFaqs(bank, shared, topic, seed, [
        { q: `${a.name} or ${b.name} — which is cheaper?`, a: `${a.name} starts near ${a.startingPrice} and ${b.name} near ${b.startingPrice}, but real cost depends on bandwidth and proxy type. For the lowest entry cost overall, many buyers test Cheapest Proxies first.` },
        { q: `Is ${a.name} better than ${b.name} for scraping?`, a: `It depends on the target. ${a.name} suits ${a.bestFor || "its use cases"}; ${b.name} suits ${b.bestFor || "others"}. Match the proxy type to the target's anti-bot strength before picking a brand.` }
      ]);
      const cmpRow = (label, av, bv) => `<tr><td>${esc(label)}</td><td>${esc(av)}</td><td>${esc(bv)}</td></tr>`;
      const table = `<section class="section" id="comparison-table"><h2>${esc(a.name)} vs ${esc(b.name)}: Side by Side</h2><div class="table-wrap"><table><thead><tr><th>Factor</th><th>${esc(a.name)}</th><th>${esc(b.name)}</th></tr></thead><tbody>${[
        cmpRow("Starting price", a.startingPrice, b.startingPrice),
        cmpRow("Pool size", a.poolSize, b.poolSize),
        cmpRow("Proxy types", sentenceList(a.proxyTypes) || "-", sentenceList(b.proxyTypes) || "-"),
        cmpRow("Coverage", a.locationsCount, b.locationsCount),
        cmpRow("Rating", `${a.rating}/5`, `${b.rating}/5`),
        cmpRow("Best for", a.bestFor || "-", b.bestFor || "-")
      ].join("")}</tbody></table></div></section>`;
      page.blocks = [
        sec("intro", "Overview", paras(buildIntro(bank, topic, seed, facts))),
        featuredBox(page),
        table,
        sec("a-strengths", `Where ${a.name} Wins`, ul(a.pros.slice(0, 4), "check-list")),
        sec("b-strengths", `Where ${b.name} Wins`, ul(b.pros.slice(0, 4), "check-list")),
        sec("verdict", "Verdict", paras(
          `${facts[2]} If your top priority is a low, predictable bill with residential access, test Cheapest Proxies first, then choose ${a.name} or ${b.name} based on the specific feature you still need.`
        )),
        ...bankBlocks(bankSections(bank, topic, seed, 1, 7)),
        renderFAQSection(page),
        "%RELATED%",
        relatedCTA(topic)
      ];
      page.tocSections = [
        { id: "intro", title: "Overview" }, { id: "top-recommendation", title: "Featured Pick" },
        { id: "comparison-table", title: "Side by Side" }, { id: "a-strengths", title: `${a.name} Wins` },
        { id: "b-strengths", title: `${b.name} Wins` }, { id: "verdict", title: "Verdict" },
        { id: "faq", title: "FAQs" }, { id: "related-pages", title: "Related" }, { id: "final-cta", title: "Get Started" }
      ];
      page._rel = { kind: "vs", a: a.slug, b: b.slug };
      pages.push(page);
    }
  }
  return pages;
}

function usecasePage(target, data, variant) {
  const { banks } = data;
  const bank = banks.usecase, shared = banks.shared;
  const rt = target.recommendedProxyType || "residential";
  const spec = {
    proxies: { h1: `Best Proxies for ${target.name} (2026)`, topic: `Proxies for ${target.name}`, path: `/use-cases/${target.slug}-proxies`, kw: `${target.name} proxies` },
    "best-proxies-for": { h1: `Best Proxies for ${target.name}: Buyer Guide`, topic: `Best Proxies for ${target.name}`, path: `/use-cases/best-proxies-for-${target.slug}`, kw: `best proxies for ${target.name}` },
    scrape: { h1: `How to Scrape ${target.name} With Proxies (2026)`, topic: `Scraping ${target.name}`, path: `/use-cases/scrape-${target.slug}-with-proxies`, kw: `scrape ${target.name}` }
  }[variant];
  const seed = `uc-${target.slug}-${variant}`;
  const page = makePage({
    type: "usecase", path: spec.path, topic: spec.topic, h1: spec.h1,
    metaDescription: `${variant === "scrape" ? `Scrape ${target.name}` : `Choose proxies for ${target.name}`} the right way: ${rt} proxies handle its ${target.difficulty} anti-bot defenses. Cheapest Proxies featured first.`,
    keyword: (target.keywords[0] || spec.kw).toLowerCase(),
    heroText: `${target.whyProxies || `${target.name} needs the right proxy type to avoid blocks.`} Recommended: ${rt} proxies. Anti-bot difficulty: ${target.difficulty}.`.slice(0, 240),
    schemaKind: variant === "scrape" ? "Article" : "Service"
  });
  const facts = [
    `${target.name} sits in the ${target.category}${target.subcategory ? ` (${target.subcategory})` : ""} category with ${target.difficulty} anti-bot difficulty, so ${rt} proxies are usually the right fit.`,
    target.commonBlocks.length ? `Expect defenses like ${sentenceList(target.commonBlocks.slice(0, 3))}.` : "",
    target.whyProxies || ""
  ].filter(Boolean);
  page.faqs = buildFaqs(bank, shared, spec.topic, seed, [
    { q: `What proxies work best for ${target.name}?`, a: `${titleCase(rt)} proxies are the safest default for ${target.name} given its ${target.difficulty} anti-bot strength. Datacenter proxies may work for lighter, public endpoints but get blocked faster on protected pages.` },
    { q: `Is it legal to scrape ${target.name}?`, a: `Scraping public data is generally permissible in many contexts, but you must respect ${target.name}'s Terms of Service, robots directives, rate limits, and any personal-data laws. This page is educational, not legal advice.` }
  ]);
  const blocks = [
    sec("intro", "Overview", paras(buildIntro(bank, spec.topic, seed, facts))),
    featuredBox(page),
    sec("why", `Why ${target.name} Needs the Right Proxies`, paras(facts[0], facts[1] || "", target.notes || "") ),
    sec("proxy-type", "Which Proxy Type to Use", ul([
      `Recommended: ${typeLabelOf(rt)} (${PROXY_TYPES[rt] ? PROXY_TYPES[rt].detection : "low"} detection risk).`,
      `Anti-bot difficulty: ${target.difficulty}.`,
      target.commonBlocks.length ? `Common blocks: ${sentenceList(target.commonBlocks)}.` : "Common blocks: rate limiting and IP bans.",
      ...(target.tips || []).slice(0, 3)
    ], "check-list")),
    renderProviderRanking(rankingProviders(data.providers, seed, 5))
  ];
  if (variant === "scrape") {
    blocks.push(renderStepGuide({ steps: [
      { title: "Pick the right proxy type", description: `Use ${typeLabelOf(rt).toLowerCase()} for ${target.name} to match its ${target.difficulty} defenses.` },
      { title: "Set rotation and sessions", description: "Rotate IPs per request or per short session; keep pacing human and vary user agents." },
      { title: "Handle blocks gracefully", description: `Detect ${sentenceList(target.commonBlocks.slice(0, 2)) || "bans and CAPTCHAs"}, back off, and retry on a fresh IP.` },
      { title: "Validate and scale", description: "Confirm data quality on a small run, then scale bandwidth while monitoring success rate." }
    ] }));
  }
  blocks.push(...bankBlocks(bankSections(bank, spec.topic, seed, 2, 5)));
  blocks.push(renderFAQSection(page), "%RELATED%", relatedCTA(spec.topic));
  page.blocks = blocks;
  page.tocSections = [
    { id: "intro", title: "Overview" }, { id: "top-recommendation", title: "Featured Pick" },
    { id: "why", title: "Why Proxies" }, { id: "proxy-type", title: "Proxy Type" },
    { id: "provider-ranking", title: "Providers" },
    ...(variant === "scrape" ? [{ id: "step-by-step-guide", title: "Steps" }] : []),
    { id: "faq", title: "FAQs" }, { id: "related-pages", title: "Related" }, { id: "final-cta", title: "Get Started" }
  ];
  page._rel = { kind: "usecase", target: target.slug, category: target.category };
  return page;
}

function buildUsecasePages(data) {
  const pages = [];
  for (const target of data.targets) {
    for (const variant of CONFIG.targetVariants) pages.push(usecasePage(target, data, variant));
  }
  return pages;
}

function buildTypeUsecasePages(data) {
  const { banks } = data;
  const bank = banks.usecase, shared = banks.shared;
  const targets = data.targets.slice(0, CONFIG.typeUsecaseTargets);
  const pages = [];
  for (const t of CONFIG.typeUsecaseTypes) {
    const tn = typeName(t), tl = typeLabelOf(t), pt = PROXY_TYPES[t];
    for (const target of targets) {
      const topic = `${tn} Proxies for ${target.name}`;
      const seed = `tu-${t}-${target.slug}`;
      const p = `/proxy-guides/${t}-proxies-for-${target.slug}`;
      const page = makePage({
        type: "guide", path: p, topic,
        h1: `${tl} for ${target.name}: Do They Work? (2026)`,
        metaDescription: `Are ${tn.toLowerCase()} proxies right for ${target.name}? ${target.name} has ${target.difficulty} anti-bot defenses. See fit, setup, and cheaper options.`,
        keyword: `${tn} proxies for ${target.name}`.toLowerCase(),
        heroText: `Whether ${tn.toLowerCase()} proxies fit ${target.name} depends on its ${target.difficulty} defenses and your budget. Here is the practical answer.`,
        schemaKind: "Article"
      });
      const fit = pt.detection === "lowest" || pt.detection === "very low" ? "a strong fit" : (target.difficulty === "very high" || target.difficulty === "high") ? "risky for the hardest pages but usable for lighter endpoints" : "a reasonable fit";
      const facts = [
        `${target.name} has ${target.difficulty} anti-bot difficulty and generally prefers ${typeLabelOf(target.recommendedProxyType || "residential").toLowerCase()}.`,
        `${tl} are ${fit} here: ${pt.blurb}, with ${pt.detection} detection risk and ${pt.speed} speed.`
      ];
      page.faqs = buildFaqs(bank, shared, topic, seed, [
        { q: `Do ${tn.toLowerCase()} proxies work for ${target.name}?`, a: `${facts[1]} For ${target.name}, ${target.recommendedProxyType || "residential"} proxies are the safest default, but ${tn.toLowerCase()} proxies can work for ${t === "datacenter" ? "simple, public endpoints" : "many workflows"} if you tune rotation and pacing.` }
      ]);
      page.blocks = [
        sec("intro", "Overview", paras(buildIntro(bank, topic, seed, facts))),
        featuredBox(page),
        sec("verdict", "Quick Verdict", paras(facts[1], `Recommended type for ${target.name}: ${typeLabelOf(target.recommendedProxyType || "residential")}.`) + ul([
          target.commonBlocks.length ? `Watch for ${sentenceList(target.commonBlocks.slice(0, 3))}.` : "Watch for rate limiting and IP bans.",
          ...(target.tips || []).slice(0, 2)
        ], "check-list")),
        renderProviderRanking(rankingProviders(data.providers, seed, 4)),
        ...bankBlocks(bankSections(bank, topic, seed, 2, 9)),
        renderFAQSection(page),
        "%RELATED%",
        relatedCTA(topic)
      ];
      page.tocSections = [
        { id: "intro", title: "Overview" }, { id: "top-recommendation", title: "Featured Pick" },
        { id: "verdict", title: "Verdict" }, { id: "provider-ranking", title: "Providers" },
        { id: "faq", title: "FAQs" }, { id: "related-pages", title: "Related" }, { id: "final-cta", title: "Get Started" }
      ];
      page._rel = { kind: "typeusecase", target: target.slug, t };
      pages.push(page);
    }
  }
  return pages;
}

function buildIntegrationPages(data) {
  const { banks } = data;
  const bank = banks.integration, shared = banks.shared;
  const pages = [];
  for (const tool of data.tools) {
    for (const variant of CONFIG.integrationVariants) {
      const spec = {
        proxies: { h1: `How to Use Proxies With ${tool.name} (2026)`, topic: `Proxies with ${tool.name}`, path: `/integrations/${tool.slug}-proxies`, kw: `${tool.name} proxy` },
        "rotating-proxies": { h1: `Rotating Proxies in ${tool.name}: Setup Guide`, topic: `Rotating Proxies in ${tool.name}`, path: `/integrations/${tool.slug}-rotating-proxies`, kw: `${tool.name} rotating proxies` },
        "proxy-errors": { h1: `${tool.name} Proxy Errors: Causes & Fixes`, topic: `${tool.name} Proxy Errors`, path: `/integrations/${tool.slug}-proxy-errors`, kw: `${tool.name} proxy error` }
      }[variant];
      const seed = `int-${tool.slug}-${variant}`;
      const page = makePage({
        type: "integration", path: spec.path, topic: spec.topic, h1: spec.h1,
        metaDescription: `${spec.topic}: ${tool.proxySupport || `configure proxies in ${tool.name}`}. Auth, rotation, and error handling explained, with a budget-friendly proxy featured first.`,
        keyword: (tool.keywords[0] || spec.kw).toLowerCase(),
        heroText: `${tool.proxySupport || `${tool.name} supports HTTP/HTTPS proxies.`} ${tool.configNote || ""}`.slice(0, 240),
        schemaKind: "Article"
      });
      const facts = [
        `${tool.name}${tool.language ? ` (${tool.language})` : ""} is a ${tool.category.toLowerCase()}. ${tool.proxySupport || ""}`,
        tool.configNote || "",
        tool.commonErrors.length ? `Common proxy errors include ${sentenceList(tool.commonErrors.slice(0, 3))}.` : ""
      ].filter(Boolean);
      page.faqs = buildFaqs(bank, shared, spec.topic, seed, [
        { q: `How do I set a proxy in ${tool.name}?`, a: `${tool.configNote || `You point ${tool.name} at the proxy host:port and supply username/password or allowlist your IP.`} Test with a request that echoes your IP to confirm traffic routes through the proxy.` },
        { q: `Why do I get proxy errors in ${tool.name}?`, a: `${tool.commonErrors.length ? `Common causes: ${sentenceList(tool.commonErrors.slice(0, 3))}.` : "Common causes are bad credentials, an expired IP allowlist, or the wrong protocol (HTTP vs SOCKS5)."} Verify auth, protocol, and that the proxy is live.` }
      ]);
      const blocks = [
        sec("intro", "Overview", paras(buildIntro(bank, spec.topic, seed, facts))),
        featuredBox(page),
        sec("setup", `Configuring Proxies in ${tool.name}`, paras(facts[1] || `Set the proxy endpoint, add authentication, and route requests through it.`) + ul([
          `Category: ${tool.category}${tool.language ? ` · Language: ${tool.language}` : ""}.`,
          "Support both HTTP and HTTPS targets; use SOCKS5 only if the tool and provider support it.",
          "Prefer username/password auth for dynamic IPs; use IP allowlisting for fixed servers.",
          ...(tool.tips || []).slice(0, 2)
        ], "check-list"))
      ];
      if (variant === "proxy-errors" && tool.commonErrors.length) {
        blocks.push(sec("errors", `${tool.name} Proxy Errors and Fixes`, ul(tool.commonErrors.map((e) => `${e} — check credentials, protocol, and that the proxy IP is active.`), "plain-list")));
      }
      blocks.push(renderProviderRanking(rankingProviders(data.providers, seed, 4)));
      blocks.push(...bankBlocks(bankSections(bank, spec.topic, seed, 2, 12)));
      blocks.push(renderFAQSection(page), "%RELATED%", relatedCTA(spec.topic));
      page.blocks = blocks;
      page.tocSections = [
        { id: "intro", title: "Overview" }, { id: "top-recommendation", title: "Featured Pick" },
        { id: "setup", title: "Setup" },
        ...(variant === "proxy-errors" ? [{ id: "errors", title: "Errors & Fixes" }] : []),
        { id: "provider-ranking", title: "Providers" }, { id: "faq", title: "FAQs" },
        { id: "related-pages", title: "Related" }, { id: "final-cta", title: "Get Started" }
      ];
      page._rel = { kind: "integration", tool: tool.slug, language: tool.language };
      pages.push(page);
    }
  }
  return pages;
}

function buildHowtoPages(data) {
  const { banks } = data;
  const bank = banks.howto, shared = banks.shared;
  const pages = [];
  for (const h of data.howtos) {
    const topic = h.title.replace(/^how to /i, "");
    const seed = `howto-${h.slug}`;
    const p = `/how-to/${h.slug}`;
    const page = makePage({
      type: "howto", path: p, topic: h.title, h1: h.title,
      metaDescription: (h.intent || `${h.title}: a practical, step-by-step proxy guide.`).slice(0, 158),
      keyword: (h.keywords[0] || h.title).toLowerCase(),
      heroText: h.intent || `${h.title} — practical steps, prerequisites, and pitfalls for proxy and scraping workflows.`,
      schemaKind: "Article"
    });
    page.faqs = buildFaqs(bank, shared, h.title, seed, [
      { q: `${h.title.replace(/\?$/, "")}?`, a: (h.intent || `Follow the steps below; the key is matching your proxy type to the target and handling errors with retries on fresh IPs.`).slice(0, 320) }
    ]);
    const steps = (h.stepsOutline.length ? h.stepsOutline : ["Choose the right proxy type for your target.", "Configure the proxy endpoint and authentication.", "Add rotation and sensible request pacing.", "Test on a small sample, then scale while monitoring success rate."]).slice(0, 7).map((s, i) => ({ title: `Step ${i + 1}`, description: s }));
    page.blocks = [
      sec("intro", "Overview", paras(buildIntro(bank, h.title, seed, [h.intent].filter(Boolean)))),
      renderStepGuide({ steps }),
      featuredBox(page),
      h.pitfalls.length ? sec("pitfalls", "Common Pitfalls", ul(h.pitfalls, "plain-list")) : "",
      ...bankBlocks(bankSections(bank, h.title, seed, 2, 15)),
      renderFAQSection(page),
      "%RELATED%",
      relatedCTA(h.title)
    ].filter(Boolean);
    page.tocSections = [
      { id: "intro", title: "Overview" }, { id: "step-by-step-guide", title: "Steps" },
      { id: "top-recommendation", title: "Featured Pick" },
      ...(h.pitfalls.length ? [{ id: "pitfalls", title: "Pitfalls" }] : []),
      { id: "faq", title: "FAQs" }, { id: "related-pages", title: "Related" }, { id: "final-cta", title: "Get Started" }
    ];
    page._rel = { kind: "howto", category: h.category };
    pages.push(page);
  }
  return pages;
}

function buildGlossaryPages(data) {
  const { banks } = data;
  const shared = banks.shared;
  const pages = [];
  for (const g of data.glossary) {
    const topic = g.term;
    const seed = `def-${g.slug}`;
    const p = `/definitions/${g.slug}`;
    const page = makePage({
      type: "glossary", path: p, topic, h1: `${g.term}: Definition and Proxy Context`,
      metaDescription: (g.short || `${g.term} explained for proxy and web-data teams.`).slice(0, 158),
      keyword: (g.keywords[0] || g.term).toLowerCase(),
      heroText: g.short || `${g.term} — a plain-English definition for proxy users, scraping teams, and data collection projects.`,
      schemaKind: "Article"
    });
    page.faqs = uniqueBy([
      { q: `What does ${g.term} mean?`, a: g.long || g.short || `${g.term} is a term used in proxy and web-data workflows.` },
      { q: `Why does ${g.term} matter for proxies?`, a: `Understanding ${g.term} helps you choose the right proxy type, avoid blocks, and troubleshoot scraping and automation workflows.` },
      ...pickN(shared.faqs, seed, 3, 2).map((f) => ({ q: interp(f.q, topic), a: interp(f.a, topic) }))
    ], (f) => f.q).slice(0, 6);
    page.blocks = [
      sec("definition", "Definition", paras(g.long || g.short || `${g.term} is a concept relevant to proxy and web-scraping workflows.`)),
      g.short ? sec("in-short", "In Short", paras(g.short)) : "",
      sec("why", `${g.term} and Proxies`, paras(`In proxy and scraping contexts, ${g.term.toLowerCase()} influences how requests are routed, detected, or blocked. Knowing it helps you match proxy type, rotation, and session strategy to the target.`)),
      g.related.length ? sec("related-terms", "Related Terms", ul(g.related.map((r) => `${r}`), "plain-list")) : "",
      featuredBox(page),
      renderFAQSection(page),
      "%RELATED%",
      relatedCTA(topic)
    ].filter(Boolean);
    page.tocSections = [
      { id: "definition", title: "Definition" }, { id: "why", title: "Proxy Context" },
      { id: "top-recommendation", title: "Featured Pick" }, { id: "faq", title: "FAQs" },
      { id: "related-pages", title: "Related" }, { id: "final-cta", title: "Get Started" }
    ];
    page._rel = { kind: "glossary" };
    pages.push(page);
  }
  return pages;
}

function buildCountryTargetPages(data) {
  const { banks } = data;
  const bank = banks.usecase, shared = banks.shared;
  const countries = sortedCountries(data.countries).slice(0, CONFIG.countryTargetCountries);
  const targets = data.targets.slice(0, CONFIG.countryTargetTargets);
  const pages = [];
  for (const c of countries) {
    for (const target of targets) {
      const rt = target.recommendedProxyType || "residential";
      const topic = `Proxies for ${target.name} in ${c.name}`;
      const seed = `ct-${c.slug}-${target.slug}`;
      const p = `/use-cases/${target.slug}-proxies-in-${c.slug}`;
      const page = makePage({
        type: "usecase", path: p, topic,
        h1: `Proxies for ${target.name} in ${c.name} (2026)`,
        metaDescription: `Target ${target.name} from ${c.name} with ${rt} proxies. ${target.name} has ${target.difficulty} anti-bot defenses; use in-country IPs. Cheapest Proxies featured first.`,
        keyword: `${target.name} proxies ${c.name}`.toLowerCase(),
        heroText: `To work with ${target.name} as a ${c.name} user, you need ${rt} proxies that geolocate to ${c.name}. Anti-bot difficulty: ${target.difficulty}.`.slice(0, 240),
        schemaKind: "Service"
      });
      const facts = [
        `Reaching ${target.name} as a local ${c.name} visitor needs IPs that geolocate there${c.topISPs.length ? `, ideally on networks like ${sentenceList(c.topISPs.slice(0, 2))}` : ""}.`,
        `${target.name} applies ${target.difficulty} anti-bot defenses, so ${typeLabelOf(rt).toLowerCase()} are the safer choice over datacenter IPs for ${c.name} traffic.`,
        target.commonBlocks.length ? `Expect defenses such as ${sentenceList(target.commonBlocks.slice(0, 3))}.` : ""
      ].filter(Boolean);
      page.faqs = buildFaqs(bank, shared, topic, seed, [
        { q: `Do I need ${c.name} proxies for ${target.name}?`, a: `If ${target.name} shows different prices, content, or availability in ${c.name}, then yes — use ${rt} proxies that geolocate to ${c.name}. Otherwise a general ${rt} pool may be enough.` },
        { q: `What proxy type works for ${target.name} in ${c.name}?`, a: `${titleCase(rt)} proxies are the safest default given ${target.name}'s ${target.difficulty} anti-bot strength. Confirm the provider holds IPs inside ${c.name}.` }
      ]);
      page.blocks = [
        sec("intro", "Overview", paras(buildIntro(bank, topic, seed, facts))),
        featuredBox(page),
        sec("why", `Why Localized Proxies for ${target.name} in ${c.name}`, paras(facts[0], facts[1], facts[2] || "")),
        sec("setup", "Setup Checklist", ul([
          `Use ${typeLabelOf(rt)} that geolocate to ${c.name}.`,
          `Validate the IP resolves to ${c.name} before scaling.`,
          target.commonBlocks.length ? `Handle ${sentenceList(target.commonBlocks.slice(0, 2))} with retries on fresh IPs.` : "Handle blocks with retries on fresh IPs.",
          `Match locale/language headers to the ${c.name} market.`
        ], "check-list")),
        renderProviderRanking(rankingProviders(data.providers, seed, 4)),
        ...bankBlocks(bankSections(bank, topic, seed, 1, 21)),
        renderFAQSection(page),
        "%RELATED%",
        relatedCTA(topic)
      ];
      page.tocSections = [
        { id: "intro", title: "Overview" }, { id: "top-recommendation", title: "Featured Pick" },
        { id: "why", title: "Why Local IPs" }, { id: "setup", title: "Setup" },
        { id: "provider-ranking", title: "Providers" }, { id: "faq", title: "FAQs" },
        { id: "related-pages", title: "Related" }, { id: "final-cta", title: "Get Started" }
      ];
      page._rel = { kind: "usecase", target: target.slug, category: target.category, country: c.slug };
      pages.push(page);
    }
  }
  return pages;
}

function buildProviderUsecasePages(data) {
  const { banks } = data;
  const bank = banks.provider, shared = banks.shared;
  const providers = data.providers.slice(0, CONFIG.providerUsecaseProviders);
  const targets = data.targets.slice(0, CONFIG.providerUsecaseTargets);
  const pages = [];
  for (const pr of providers) {
    for (const target of targets) {
      const rt = target.recommendedProxyType || "residential";
      const covers = pr.proxyTypes.some((x) => (x || "").toLowerCase().includes(rt.split("-")[0]));
      const topic = `${pr.name} for ${target.name}`;
      const seed = `pu-${pr.slug}-${target.slug}`;
      const p = `/providers/${pr.slug}-for-${target.slug}`;
      const page = makePage({
        type: "provider", path: p, topic,
        h1: `Is ${pr.name} Good for ${target.name}? (2026)`,
        metaDescription: `${pr.name} for ${target.name}: ${target.name} needs ${rt} proxies (${target.difficulty} difficulty). See if ${pr.name} fits and cheaper options.`,
        keyword: `${pr.name} for ${target.name}`.toLowerCase(),
        heroText: `${target.name} has ${target.difficulty} anti-bot defenses and prefers ${rt} proxies. Here's whether ${pr.name} is a good fit.`,
        schemaKind: "Article"
      });
      const facts = [
        `${pr.name} offers ${sentenceList(pr.proxyTypes) || "several proxy types"} starting at ${pr.startingPrice}, with ${pr.poolSize}.`,
        `${target.name} prefers ${typeLabelOf(rt).toLowerCase()} due to ${target.difficulty} anti-bot difficulty, and ${pr.name} ${covers ? "does offer that type" : "may not fully cover that type"}.`,
        pr.bestFor ? `${pr.name} is generally best for ${pr.bestFor.replace(/\.$/, "")}.` : ""
      ].filter(Boolean);
      page.faqs = buildFaqs(bank, shared, topic, seed, [
        { q: `Is ${pr.name} good for ${target.name}?`, a: `${facts[1]} ${covers ? `That makes ${pr.name} a plausible fit for ${target.name}.` : `You may get better results from a provider focused on ${rt} proxies.`} For the lowest-cost baseline, test Cheapest Proxies first.` },
        { q: `What does ${pr.name} cost for this?`, a: `${pr.name} starts near ${pr.startingPrice}. Real cost for ${target.name} depends on bandwidth, retries from its ${target.difficulty} defenses, and whether you geo-target.` }
      ]);
      page.blocks = [
        sec("intro", "Overview", paras(buildIntro(bank, topic, seed, facts))),
        sec("verdict", "Quick Verdict", paras(facts[1], facts[2] || "") + ul([
          `${target.name} anti-bot difficulty: ${target.difficulty}. Recommended type: ${typeLabelOf(rt)}.`,
          `${pr.name} proxy types: ${sentenceList(pr.proxyTypes) || "multiple"}.`,
          `${covers ? "Fit: reasonable" : "Fit: check a smaller specialist first"} — always validate on a small run.`
        ], "check-list")),
        featuredBox(page),
        renderProviderRanking(rankingProviders(data.providers.filter((x) => x.slug !== pr.slug), seed, 4)),
        ...bankBlocks(bankSections(bank, topic, seed, 1, 23)),
        renderFAQSection(page),
        "%RELATED%",
        relatedCTA(topic)
      ];
      page.tocSections = [
        { id: "intro", title: "Overview" }, { id: "verdict", title: "Verdict" },
        { id: "top-recommendation", title: "Featured Pick" }, { id: "provider-ranking", title: "Alternatives" },
        { id: "faq", title: "FAQs" }, { id: "related-pages", title: "Related" }, { id: "final-cta", title: "Get Started" }
      ];
      page._rel = { kind: "provider", provider: pr.slug, target: target.slug };
      pages.push(page);
    }
  }
  return pages;
}

/* ========================================================================== *
 * HUBS
 * ========================================================================== */
function renderHubPage(hub, nav) {
  const page = makePage({
    type: hub.type, path: hub.path, topic: hub.title, h1: hub.title,
    metaDescription: hub.description, keyword: hub.keyword || hub.title.toLowerCase(),
    heroText: hub.description, schemaKind: "Article"
  });
  page.faqs = hub.faqs || [];
  const secs = hub.sections.map((s, i) => `<section class="section" id="sec-${i}"><h2>${esc(s.title)}</h2><div class="related-grid">${s.items.map((it) => `<a class="related-card" href="${esc(it.href)}"><strong>${esc(it.title)}</strong><span>${esc(it.desc || "")}</span></a>`).join("")}</div></section>`);
  page.blocks = [sec("intro", "Overview", paras(hub.intro || hub.description)), featuredBox(page), ...secs];
  if (page.faqs.length) page.blocks.push(renderFAQSection(page));
  page.blocks.push(relatedCTA(hub.title));
  page.tocSections = [{ id: "intro", title: "Overview" }, ...hub.sections.map((s, i) => ({ id: `sec-${i}`, title: s.title })), ...(page.faqs.length ? [{ id: "faq", title: "FAQs" }] : [])];
  return { path: hub.path, canonical: `${SITE_URL}${hub.path}`, html: renderPage(page, nav) };
}

function buildHubs(data, pages, nav) {
  const hubs = [];
  const card = (title, href, desc) => ({ title, href, desc });

  // country + city grouping
  const locByCountry = new Map();
  for (const p of pages) {
    if (p._rel && (p._rel.kind === "location" || p._rel.kind === "city")) {
      const k = p._rel.country || "world";
      if (!locByCountry.has(k)) locByCountry.set(k, []);
      locByCountry.get(k).push(p);
    }
  }

  // Locations category hub
  const byContinent = new Map();
  for (const c of data.countries) {
    if (!byContinent.has(c.continent)) byContinent.set(c.continent, []);
    byContinent.get(c.continent).push(c);
  }
  hubs.push(renderHubPage({
    type: "location", path: "/proxy-locations",
    title: "Proxy Locations: Country & City Proxy Guides",
    description: "Browse residential, datacenter, mobile, and ISP proxy guides for 190+ countries and 300+ cities. Cheapest Proxies featured first.",
    intro: "Location decides what the internet shows you. Pick a country or city below to compare proxy types, coverage, and pricing for that market.",
    sections: Array.from(byContinent.entries()).sort().map(([cont, cs]) => ({
      title: cont, items: cs.map((c) => card(`${c.name} Proxies`, `/proxy-locations/${c.slug}`, `${c.capital ? `${c.capital} + ` : ""}${c.majorCities.slice(0, 2).join(", ")}`))
    })),
    faqs: [
      { q: "Which countries do you cover?", a: "This hub links to proxy guides for 190+ countries and 300+ major cities, each with residential, datacenter, mobile, and ISP options." },
      { q: "How do I pick a location?", a: "Choose the country or city your data actually depends on. Localized prices, search results, and content only require in-market IPs where geography changes the result." }
    ]
  }, nav));

  // Country hubs
  for (const c of data.countries) {
    const kids = (locByCountry.get(c.slug) || []).sort((a, b) => a.path.localeCompare(b.path));
    if (!kids.length) continue;
    const countryPages = kids.filter((p) => p._rel.kind === "location");
    const cityPages = kids.filter((p) => p._rel.kind === "city");
    const sections = [{ title: `${c.name} Proxy Types`, items: countryPages.map((p) => card(p.h1, p.path, p.metaDescription.slice(0, 80))) }];
    if (cityPages.length) sections.push({ title: `Cities in ${c.name}`, items: cityPages.slice(0, 120).map((p) => card(p.h1, p.path, "")) });
    hubs.push(renderHubPage({
      type: "location", path: `/proxy-locations/${c.slug}`,
      title: `${c.name} Proxies: Types, Cities & Providers`,
      description: `Compare ${c.name} residential, datacenter, mobile, and ISP proxies. ${c.intent}`.slice(0, 158),
      intro: c.intent || `Compare proxy types and coverage across ${c.name}.`,
      keyword: `${c.name.toLowerCase()} proxies`,
      sections
    }, nav));
  }

  // simple listing hubs
  const listingHub = (type, path, title, description, intro, items, chunkTitle) => {
    const sections = [];
    for (let i = 0; i < items.length; i += CONFIG.hubChunk) {
      sections.push({ title: sections.length ? `${chunkTitle} (cont.)` : chunkTitle, items: items.slice(i, i + CONFIG.hubChunk) });
    }
    hubs.push(renderHubPage({ type, path, title, description, intro, sections: sections.length ? sections : [{ title: chunkTitle, items: [] }] }, nav));
  };

  listingHub("provider", "/providers", "Proxy Provider Reviews & Alternatives",
    "In-depth reviews, pricing breakdowns, and alternatives for 45+ proxy providers, with Cheapest Proxies featured first.",
    "Compare proxy providers head to head. Pick a provider for its review, pricing, and cheaper alternatives.",
    data.providers.map((p) => card(`${p.name} Review`, `/providers/${p.slug}-review`, p.bestFor || `${p.startingPrice}, ${p.poolSize}`)), "All Providers");

  const vsPages = pages.filter((p) => p._rel && p._rel.kind === "vs");
  listingHub("vs", "/vs", "Proxy Provider Comparisons (Head to Head)",
    "1,000+ side-by-side proxy provider comparisons on price, pool, proxy type, and best fit.",
    "See how the major proxy providers stack up against each other. Browse popular head-to-head comparisons below.",
    pickN(vsPages, "vs-hub", Math.min(240, vsPages.length), 0).map((p) => card(p.topic, p.path, "")), "Popular Comparisons");

  const byCat = new Map();
  for (const t of data.targets) { if (!byCat.has(t.category)) byCat.set(t.category, []); byCat.get(t.category).push(t); }
  hubs.push(renderHubPage({
    type: "usecase", path: "/use-cases", title: "Proxies by Use Case & Target Site",
    description: "Which proxies work best for Amazon, Instagram, sneakers, SEO, travel, and 100+ other targets. Cheapest Proxies featured first.",
    intro: "Match your target to the right proxy type. Pick a site or use case below for anti-bot difficulty, recommended proxies, and setup tips.",
    sections: Array.from(byCat.entries()).map(([cat, ts]) => ({ title: cat, items: ts.map((t) => card(`Proxies for ${t.name}`, `/use-cases/${t.slug}-proxies`, `${t.difficulty} difficulty · ${t.recommendedProxyType}`)) }))
  }, nav));

  const guidePages = pages.filter((p) => p._rel && p._rel.kind === "typeusecase");
  listingHub("guide", "/proxy-guides", "Proxy Type Guides by Use Case",
    "Do residential, datacenter, mobile, or ISP proxies work for your target? Straight answers for hundreds of use cases.",
    "Wondering if a specific proxy type fits your target? Browse the guides below.",
    pickN(guidePages, "guide-hub", Math.min(360, guidePages.length), 0).map((p) => card(p.topic, p.path, "")), "Proxy Type Guides");

  const byLang = new Map();
  for (const t of data.tools) { const l = t.language || "Other"; if (!byLang.has(l)) byLang.set(l, []); byLang.get(l).push(t); }
  hubs.push(renderHubPage({
    type: "integration", path: "/integrations", title: "Proxy Integrations for Tools & Languages",
    description: "How to configure proxies in Python, Node.js, cURL, Scrapy, Selenium, Playwright, and 40+ tools. Setup, rotation, and error fixes.",
    intro: "Set up proxies in your favorite language or tool. Pick one below for configuration, rotation, and error handling.",
    sections: Array.from(byLang.entries()).map(([lang, ts]) => ({ title: lang, items: ts.map((t) => card(`Proxies with ${t.name}`, `/integrations/${t.slug}-proxies`, t.category)) }))
  }, nav));

  const byHowCat = new Map();
  for (const h of data.howtos) { if (!byHowCat.has(h.category)) byHowCat.set(h.category, []); byHowCat.get(h.category).push(h); }
  hubs.push(renderHubPage({
    type: "howto", path: "/how-to", title: "Proxy & Web Scraping How-To Guides",
    description: "Step-by-step how-tos for proxy setup, rotation, anti-bot handling, and web scraping. Practical and tool-specific.",
    intro: "Practical, step-by-step guides for proxies and scraping. Pick a topic below.",
    sections: Array.from(byHowCat.entries()).map(([cat, hs]) => ({ title: cat, items: hs.map((h) => card(h.title, `/how-to/${h.slug}`, "")) }))
  }, nav));

  hubs.push(renderHubPage({
    type: "glossary", path: "/definitions", title: "Proxy & Web Scraping Glossary",
    description: "Plain-English definitions of proxy, scraping, and web-data terms, from residential proxy to JA3 fingerprinting.",
    intro: "Clear definitions of the terms you'll meet when buying proxies or building scrapers.",
    sections: [{ title: "All Terms", items: data.glossary.map((g) => card(g.term, `/definitions/${g.slug}`, g.short.slice(0, 70))) }]
  }, nav));

  return hubs;
}

/* ========================================================================== *
 * RELATED (entity-aware) + NAV
 * ========================================================================== */
function relKey(page) {
  const r = page._rel || {};
  switch (r.kind) {
    case "location": return `loc:${r.country}`;
    case "city": return `loc:${r.country}`;
    case "vs": return `vs:${r.a}`;
    case "provider": return `prov:${r.provider}`;
    case "usecase": return `uc:${r.category}`;
    case "typeusecase": return `tu:${r.t}`;
    case "integration": return `int:${r.language || "x"}`;
    case "howto": return `howto:${r.category}`;
    default: return `${page.type}`;
  }
}

function resolveRelated(pages) {
  const buckets = new Map();
  for (const p of pages) {
    const k = relKey(p);
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k).push(p);
  }
  for (const p of pages) {
    const sibs = (buckets.get(relKey(p)) || []).filter((x) => x.path !== p.path);
    const chosen = pickN(sibs, p.path, 5, 0).map((x) => ({ title: x.h1, href: x.path, description: (x.metaDescription || "").slice(0, 90) }));
    const g = GROUPS[p.type] || GROUPS.guide;
    chosen.push({ title: `Browse all ${g.label}`, href: g.href, description: `Explore the ${g.label} hub.` });
    const relHtml = renderRelated(chosen.slice(0, 6));
    p.blocks = p.blocks.map((b) => (b === "%RELATED%" ? relHtml : b));
  }
}

function buildNav(data, pages) {
  const vsPages = pages.filter((p) => p._rel && p._rel.kind === "vs");
  return [
    { label: "Locations", href: "/proxy-locations", items: pickN(data.countries, "nav-loc", 16, 0).map((c) => ({ title: `${c.name} Proxies`, href: `/proxy-locations/${c.slug}` })) },
    { label: "Providers", href: "/providers", items: data.providers.slice(0, 16).map((p) => ({ title: `${p.name} Review`, href: `/providers/${p.slug}-review` })) },
    { label: "Comparisons", href: "/vs", items: pickN(vsPages, "nav-vs", 16, 0).map((p) => ({ title: p.topic, href: p.path })) },
    { label: "Use Cases", href: "/use-cases", items: pickN(data.targets, "nav-uc", 16, 0).map((t) => ({ title: `Proxies for ${t.name}`, href: `/use-cases/${t.slug}-proxies` })) },
    { label: "Integrations", href: "/integrations", items: data.tools.slice(0, 16).map((t) => ({ title: `${t.name} Proxies`, href: `/integrations/${t.slug}-proxies` })) },
    { label: "How-To", href: "/how-to", items: pickN(data.howtos, "nav-how", 16, 0).map((h) => ({ title: h.title, href: `/how-to/${h.slug}` })) },
    { label: "Definitions", href: "/definitions", items: pickN(data.glossary, "nav-def", 16, 0).map((g) => ({ title: g.term, href: `/definitions/${g.slug}` })) }
  ];
}

/* ========================================================================== *
 * WRITE + SITEMAP + MANIFEST
 * ========================================================================== */
const MANIFEST_PATH = path.join(ROOT, "src", "data", "mass-manifest.json");

function writeFile(routePath, html, usedPaths) {
  if (usedPaths.has(routePath)) return false;
  usedPaths.add(routePath);
  const outputDir = path.join(ROOT, ...routePath.split("/").filter(Boolean));
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "index.html"), html, "utf8");
  return true;
}

function removeRoute(routePath) {
  const outputDir = path.join(ROOT, ...routePath.split("/").filter(Boolean));
  const filePath = path.join(outputDir, "index.html");
  if (!fs.existsSync(filePath)) return;
  fs.rmSync(filePath);
  let current = outputDir;
  while (current.startsWith(ROOT) && current !== ROOT) {
    try { fs.rmdirSync(current); current = path.dirname(current); } catch { break; }
  }
}

function cleanupStale(currentPaths) {
  if (!fs.existsSync(MANIFEST_PATH)) return;
  try {
    const prev = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
    for (const p of prev.paths || []) if (!currentPaths.has(p)) removeRoute(p);
  } catch { /* ignore */ }
}

function writeSitemaps(allPaths) {
  const CHUNK = 45000;
  const chunks = [];
  for (let i = 0; i < allPaths.length; i += CHUNK) chunks.push(allPaths.slice(i, i + CHUNK));
  const chunkFiles = [];
  chunks.forEach((chunk, idx) => {
    const file = `sitemap-mass-${idx + 1}.xml`;
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${chunk
      .map((p) => `  <url><loc>${SITE_URL}${p}</loc><lastmod>${LASTMOD}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`)
      .join("\n")}\n</urlset>\n`;
    fs.writeFileSync(path.join(ROOT, file), xml, "utf8");
    chunkFiles.push(file);
  });
  const children = ["sitemap.xml", ...chunkFiles];
  const index = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${children
    .map((f) => `  <sitemap><loc>${SITE_URL}/${f}</loc><lastmod>${LASTMOD}</lastmod></sitemap>`)
    .join("\n")}\n</sitemapindex>\n`;
  fs.writeFileSync(path.join(ROOT, "sitemap-index.xml"), index, "utf8");
  fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap-index.xml\nSitemap: ${SITE_URL}/sitemap.xml\n`, "utf8");
  return chunkFiles.length;
}

async function main() {
  console.log("Loading mass data...");
  const data = await loadData();
  console.log(`  countries=${data.countries.length} cities=${data.cities.length} providers=${data.providers.length} targets=${data.targets.length} tools=${data.tools.length} howtos=${data.howtos.length} glossary=${data.glossary.length}`);

  console.log("Building pages...");
  let pages = [
    ...buildLocationPages(data),
    ...buildCityPages(data),
    ...buildProviderPages(data),
    ...buildVsPages(data),
    ...buildUsecasePages(data),
    ...buildTypeUsecasePages(data),
    ...buildCountryTargetPages(data),
    ...buildProviderUsecasePages(data),
    ...buildIntegrationPages(data),
    ...buildHowtoPages(data),
    ...buildGlossaryPages(data)
  ];
  // dedupe by path
  const seenPath = new Set();
  pages = pages.filter((p) => (seenPath.has(p.path) ? false : (seenPath.add(p.path), true)));

  const byType = {};
  for (const p of pages) byType[p.type] = (byType[p.type] || 0) + 1;
  console.log("  page counts by type:", JSON.stringify(byType));

  const nav = buildNav(data, pages);
  resolveRelated(pages);

  console.log("Building hubs...");
  const hubs = buildHubs(data, pages, nav);

  console.log("Rendering + writing...");
  const usedPaths = new Set();
  let written = 0;
  const allPaths = [];
  for (const p of pages) {
    if (writeFile(p.path, renderPage(p, nav), usedPaths)) { written += 1; allPaths.push(p.path); }
  }
  for (const h of hubs) {
    if (writeFile(h.path, h.html, usedPaths)) { written += 1; allPaths.push(h.path); }
  }

  cleanupStale(usedPaths);
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify({ generatedAt: LASTMOD, count: allPaths.length, paths: allPaths }, null, 0), "utf8");
  const chunks = writeSitemaps(allPaths);

  console.log(`\nDONE. Wrote ${written} mass pages (${pages.length} content + ${hubs.length} hubs).`);
  console.log(`Sitemap: ${chunks} mass chunk(s) + sitemap-index.xml. robots.txt updated.`);
}

export { buildLocationPages, buildCityPages, buildProviderPages, buildVsPages, buildUsecasePages, buildTypeUsecasePages, buildIntegrationPages, buildHowtoPages, buildGlossaryPages, renderPage, renderRelated, GROUPS, CONFIG, makePage, sec, ul, paras, esc, main };

main();
