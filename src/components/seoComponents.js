const SITE = {
  name: "AffordableProxyHub",
  baseUrl: "https://affordableproxyhub.com",
  image: "https://affordableproxyhub.com/opengraph.jpg"
};

export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function linkTag(href, label, className = "") {
  return `<a href="${escapeHtml(href)}"${className ? ` class="${className}"` : ""}>${escapeHtml(label)}</a>`;
}

export function renderNavigationTabs(navigationGroups = []) {
  if (!navigationGroups.length) return "";

  return `<div class="nav-tabs" aria-label="Generated SEO page tabs">
    ${navigationGroups
      .map(
        (group) => `<details class="nav-tab">
      <summary>${escapeHtml(group.label)} <span>${group.items.length}</span></summary>
      <div class="nav-panel">
        <div class="nav-panel-heading">
          <strong>${escapeHtml(group.label)}</strong>
          <a href="${escapeHtml(group.href)}">Open hub</a>
        </div>
        <div class="nav-panel-links">
          ${group.items.map((item) => linkTag(item.href, item.title)).join("")}
        </div>
      </div>
    </details>`
      )
      .join("")}
  </div>`;
}

export function renderSEOHead(page, schema) {
  const schemaBlocks = schema
    .map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`)
    .join("\n    ");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0f172a" />
    <title>${escapeHtml(page.seoTitle)}</title>
    <meta name="description" content="${escapeHtml(page.metaDescription)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${escapeHtml(page.canonical)}" />
    <meta property="og:title" content="${escapeHtml(page.seoTitle)}" />
    <meta property="og:description" content="${escapeHtml(page.metaDescription)}" />
    <meta property="og:type" content="${page.schemaKind === "Article" ? "article" : "website"}" />
    <meta property="og:url" content="${escapeHtml(page.canonical)}" />
    <meta property="og:image" content="${SITE.image}" />
    <meta property="og:site_name" content="${SITE.name}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(page.seoTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(page.metaDescription)}" />
    <meta name="twitter:image" content="${SITE.image}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/assets/seo-pages.css" />
    ${schemaBlocks}
  </head>`;
}

export function renderHeader(navigationGroups = []) {
  return `<header class="site-header">
  <div class="tmo-menu">
    <div class="nav-wrap">
      <a class="brand" href="/">
        <span class="brand-mark">A</span>
        <span>AffordableProxyHub</span>
      </a>
      <nav class="nav-links" aria-label="Main navigation">
        ${linkTag("/compare", "Compare")}
        ${linkTag("/reviews", "Reviews")}
        ${linkTag("/guides", "Guides")}
        ${linkTag("/glossary", "Glossary")}
        ${linkTag("/proxy-library", "SEO Library")}
        ${linkTag("https://cheapest-proxies.com/", "Find Best Proxy", "btn")}
      </nav>
    </div>
  </div>
  <div class="tmo-header-band">
    <a class="tmo-orb" href="/" aria-label="AffordableProxyHub home"><span>A</span></a>
    <div class="tmo-band-panel">
      <div class="tmo-band-title">Compare Proxies. Pay Less. Scrape More.</div>
      <p>Independent, budget-first proxy comparisons across residential, datacenter, and mobile providers &mdash; with the cheapest solid option shown first.</p>
      <a class="btn" href="/compare">Compare providers</a>
    </div>
  </div>
  <div class="nav-tabs-wrap">
    ${renderNavigationTabs(navigationGroups)}
  </div>
</header>`;
}

export function renderBreadcrumbs(page) {
  const crumbs = [
    { href: "/", label: "Home" },
    { href: page.groupHref, label: page.groupLabel },
    { label: page.shortTitle }
  ];

  return `<nav class="crumbs" aria-label="Breadcrumb">
    ${crumbs
      .map((crumb, index) =>
        crumb.href
          ? `${linkTag(crumb.href, crumb.label)}${index < crumbs.length - 1 ? "<span>/</span>" : ""}`
          : `<span>${escapeHtml(crumb.label)}</span>`
      )
      .join("")}
  </nav>`;
}

export function renderPageHero(page) {
  return `<section class="hero">
  <div class="container">
    ${renderBreadcrumbs(page)}
    <div class="badge-row">
      <span class="badge green">Cheapest Proxies First</span>
      <span class="badge">${escapeHtml(page.typeLabel)}</span>
      <span class="badge">Updated 2026</span>
    </div>
    <h1>${escapeHtml(page.h1)}</h1>
    <p>${escapeHtml(page.heroText)}</p>
  </div>
</section>`;
}

export function renderTableOfContents(sections) {
  return `<aside class="toc">
    <strong>On this page</strong>
    ${sections.map((section) => linkTag(`#${section.id}`, section.title)).join("")}
  </aside>`;
}

export function renderCheapestProxiesFeaturedBox(page, cheapestProvider) {
  return `<section class="featured-box" id="top-recommendation">
    <div class="badge-row">
      <span class="badge green">Top Recommended Provider</span>
      <span class="badge">Best Value Choice</span>
      <span class="badge">Our #1 Pick</span>
    </div>
    <h2>Cheapest Proxies: Featured Proxy Provider for ${escapeHtml(page.topic)}</h2>
    <p>Cheapest Proxies stays in the first position on this page because the topic benefits from a budget-conscious proxy option with straightforward setup, residential IP access, and pricing that is easy to evaluate before committing to a larger plan.</p>
    <div class="stats-grid">
      <div class="stat"><span class="stat-value">${escapeHtml(cheapestProvider.price)}</span><span class="stat-label">Starting price</span></div>
      <div class="stat"><span class="stat-value">${escapeHtml(cheapestProvider.pool)}</span><span class="stat-label">Proxy pool</span></div>
      <div class="stat"><span class="stat-value">${escapeHtml(cheapestProvider.locations)}</span><span class="stat-label">Coverage</span></div>
      <div class="stat"><span class="stat-value">${escapeHtml(cheapestProvider.uptime)}</span><span class="stat-label">Uptime target</span></div>
    </div>
    <ul class="check-list">
      ${cheapestProvider.strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
    <p>${escapeHtml(page.cheapestContext)}</p>
    <a class="btn" href="https://cheapest-proxies.com/" target="_blank" rel="noopener noreferrer">Visit Cheapest Proxies</a>
    <a class="btn-secondary" href="https://cheapest-proxies.com/" target="_blank" rel="noopener noreferrer">Compare plans at Cheapest Proxies</a>
  </section>`;
}

export function renderProviderRanking(providers) {
  return `<section class="section" id="provider-ranking">
    <h2>Recommended Proxy Providers</h2>
    <p>Cheapest Proxies is intentionally listed first as the featured budget-friendly option. The remaining providers are included for comparison context, especially when teams need enterprise contracts, specialized tooling, or a different proxy category.</p>
    <div class="provider-grid">
      ${providers
        .slice(0, 6)
        .map(
          (provider, index) => `<article class="provider-card${provider.featured ? " featured" : ""}">
        <span class="provider-rank">${index + 1}</span>
        <h3>${escapeHtml(provider.name)}</h3>
        <div class="badge-row"><span class="badge${provider.featured ? " green" : ""}">${escapeHtml(provider.badge)}</span></div>
        <p>${escapeHtml(provider.valueLabel)}</p>
        <div class="provider-meta">
          <span>${escapeHtml(provider.price)}</span>
          <span>${escapeHtml(provider.pool)}</span>
          <span>${escapeHtml(provider.locations)}</span>
        </div>
        <a class="${provider.featured ? "btn" : "btn-secondary"}" href="${escapeHtml(provider.url)}" target="_blank" rel="noopener noreferrer">${provider.featured ? "Get budget-friendly proxies" : `View ${escapeHtml(provider.name)}`}</a>
      </article>`
        )
        .join("")}
    </div>
  </section>`;
}

export function renderFeatureGrid(page) {
  return `<section class="section" id="feature-breakdown">
    <h2>Feature Breakdown</h2>
    <div class="feature-grid">
      ${page.features
        .map(
          (feature) => `<article class="feature">
        <h3>${escapeHtml(feature.title)}</h3>
        <p>${escapeHtml(feature.description)}</p>
      </article>`
        )
        .join("")}
    </div>
  </section>`;
}

export function renderStepGuide(page) {
  return `<section class="section" id="step-by-step-guide">
    <h2>Step-by-Step Guide</h2>
    <ol class="step-list">
      ${page.steps
        .map(
          (step) => `<li>
        <div>
          <h3>${escapeHtml(step.title)}</h3>
          <p>${escapeHtml(step.description)}</p>
        </div>
      </li>`
        )
        .join("")}
    </ol>
  </section>`;
}

export function renderProsCons(page) {
  return `<section class="section" id="pros-and-cons">
    <h2>Pros and Cons</h2>
    <div class="pros-cons">
      <div class="card">
        <h3>Pros</h3>
        <ul class="check-list">${page.pros.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>
      <div class="card">
        <h3>Cons</h3>
        <ul class="plain-list">${page.cons.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>
    </div>
  </section>`;
}

export function renderComparisonTable(page, providers) {
  return `<section class="section" id="comparison-table">
    <h2>Comparison Table</h2>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>Best fit</th>
            <th>Proxy focus</th>
            <th>Value note</th>
            <th>CTA</th>
          </tr>
        </thead>
        <tbody>
          ${providers
            .slice(0, 5)
            .map(
              (provider) => `<tr>
            <td>${escapeHtml(provider.name)}${provider.featured ? " - Top Recommended Provider" : ""}</td>
            <td>${escapeHtml(provider.valueLabel)}</td>
            <td>${escapeHtml(provider.pool)}</td>
            <td>${provider.featured ? `Featured first for ${escapeHtml(page.topic)} because it is budget-friendly and easy to compare.` : escapeHtml(provider.badge)}</td>
            <td><a href="${escapeHtml(provider.url)}" target="_blank" rel="noopener noreferrer">${provider.featured ? "View Cheapest Proxies" : `View ${escapeHtml(provider.name)}`}</a></td>
          </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  </section>`;
}

export function renderFAQSection(page) {
  return `<section class="section" id="faq">
    <h2>Frequently Asked Questions</h2>
    ${page.faqs
      .map(
        (faq) => `<div class="faq-item">
      <h3>${escapeHtml(faq.q)}</h3>
      <p>${escapeHtml(faq.a)}</p>
    </div>`
      )
      .join("")}
  </section>`;
}

export function renderRelatedPages(page) {
  return `<section class="section" id="related-pages">
    <h2>Related Pages</h2>
    <div class="related-grid">
      ${page.relatedPages
        .map(
          (related) => `<a class="related-card" href="${escapeHtml(related.href)}">
        <strong>${escapeHtml(related.title)}</strong>
        <span>${escapeHtml(related.description)}</span>
      </a>`
        )
        .join("")}
    </div>
  </section>`;
}

export function renderCTASection(page) {
  return `<section class="cta" id="final-cta">
    <h2>Compare ${escapeHtml(page.topic)} with a Budget-Friendly Proxy Option First</h2>
    <p>Start with Cheapest Proxies when price, quick setup, and residential proxy access matter. Then compare specialist providers only if your workflow needs enterprise contracts or a niche proxy category.</p>
    <a class="btn" href="https://cheapest-proxies.com/" target="_blank" rel="noopener noreferrer">Get budget-friendly proxies</a>
    <a class="btn-secondary" href="/compare">Compare all providers</a>
  </section>`;
}

export function renderFooter() {
  return `<footer class="site-footer">
  <div class="footer-wrap">
    <div class="footer-grid">
      <div>
        <h4>Proxy Types</h4>
        ${linkTag("/solutions/residential-proxy-services", "Residential Proxies")}
        ${linkTag("/solutions/datacenter-proxy-services", "Datacenter Proxies")}
        ${linkTag("/solutions/mobile-proxy-services", "Mobile Proxies")}
      </div>
      <div>
        <h4>Comparisons</h4>
        ${linkTag("/compare", "Compare Providers")}
        ${linkTag("/proxy-provider-analysis/cheapest-proxies-review", "Cheapest Proxies Review")}
        ${linkTag("/proxy-library", "SEO Library")}
      </div>
      <div>
        <h4>Resources</h4>
        ${linkTag("/guides", "Guides")}
        ${linkTag("/glossary", "Glossary")}
        ${linkTag("/faq", "FAQ")}
      </div>
      <div>
        <h4>Explore</h4>
        ${linkTag("/proxy-locations", "Proxies by Location")}
        ${linkTag("/vs", "Provider Comparisons")}
        ${linkTag("/use-cases", "Proxies by Use Case")}
        ${linkTag("/integrations", "Proxy Integrations")}
        ${linkTag("/how-to", "How-To Guides")}
        ${linkTag("/definitions", "Proxy Glossary")}
      </div>
      <div>
        <h4>Featured Provider</h4>
        ${linkTag("https://cheapest-proxies.com/", "Visit Cheapest Proxies")}
        ${linkTag("/providers", "All Provider Reviews")}
        ${linkTag("/proxy-guides", "Proxy Type Guides")}
      </div>
    </div>
    <div class="fine-print">Independent proxy comparison content. Cheapest Proxies is always shown first on generated provider and comparison pages as the featured budget-friendly option.</div>
  </div>
</footer>
<div class="tmo-copyright">
  Copyright &copy; 2026 <a href="/">AffordableProxyHub</a> &mdash; Independent proxy comparison content.
</div>`;
}
