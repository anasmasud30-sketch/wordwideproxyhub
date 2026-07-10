import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SITE_URL = "https://affordableproxyhub.com";
const mappingPath = path.join(ROOT, "src", "data", "pageMapping.json");
const summaryPath = path.join(ROOT, "src", "data", "generatedSummary.json");
const navigationPath = path.join(ROOT, "src", "data", "navigationGroups.json");
const sitemapPath = path.join(ROOT, "sitemap.xml");
const robotsPath = path.join(ROOT, "robots.txt");
const indexPath = path.join(ROOT, "index.html");

function fail(message, details = []) {
  console.error(message);
  for (const detail of details.slice(0, 20)) console.error(`- ${detail}`);
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function routeToFile(route) {
  return path.join(ROOT, ...route.split("/").filter(Boolean), "index.html");
}

function textBetween(html, startRe, endRe) {
  const start = html.search(startRe);
  if (start === -1) return "";
  const sliced = html.slice(start);
  const end = sliced.search(endRe);
  return end === -1 ? sliced : sliced.slice(0, end);
}

const requiredFiles = [
  mappingPath,
  summaryPath,
  sitemapPath,
  robotsPath,
  indexPath,
  path.join(ROOT, "src", "data", "seoPages.js"),
  path.join(ROOT, "src", "data", "providers.js"),
  navigationPath,
  path.join(ROOT, "assets", "seo-pages.css"),
  path.join(ROOT, "assets", "home-seo-expansion.css"),
  path.join(ROOT, "assets", "home-seo-nav.js")
];

const missingFiles = requiredFiles.filter((filePath) => !fs.existsSync(filePath));
if (missingFiles.length) fail("Missing required generated/static files.", missingFiles);

const mapping = readJson(mappingPath);
const summary = readJson(summaryPath);
const navigationGroups = readJson(navigationPath);
const sitemap = fs.readFileSync(sitemapPath, "utf8");
const robots = fs.readFileSync(robotsPath, "utf8");
const indexHtml = fs.readFileSync(indexPath, "utf8");
const generated = mapping.generated || [];

if (!generated.length) fail("No generated pages found in pageMapping.json.");
if (summary.generatedCount !== generated.length) {
  fail("Generated summary count does not match mapping count.", [
    `summary=${summary.generatedCount}`,
    `mapping=${generated.length}`
  ]);
}

if (/Disallow:\s*\/api/i.test(robots)) {
  fail("robots.txt still contains an API disallow directive for this static site.");
}

const homeSectionCount = (indexHtml.match(/class="home-seo-section/g) || []).length;
if (homeSectionCount < 20) {
  fail("Home page SEO expansion has fewer than 20 sections.", [`sections=${homeSectionCount}`]);
}

const navLinkCount = navigationGroups.reduce((sum, group) => sum + group.items.length, 0);
if (navLinkCount !== generated.length) {
  fail("Navigation tab inventory does not include every generated page.", [
    `navLinks=${navLinkCount}`,
    `generated=${generated.length}`
  ]);
}

const missingHomeNavLinks = generated
  .filter((page) => !indexHtml.includes(`href="${page.newPagePath}"`))
  .map((page) => page.newPagePath);
if (missingHomeNavLinks.length) {
  fail("Home page header tabs are missing generated page links.", missingHomeNavLinks);
}

const titleSet = new Set();
const descSet = new Set();
const h1Set = new Set();
const errors = [];
let sampleGeneratedHtml = "";

for (const page of generated) {
  const filePath = routeToFile(page.newPagePath);
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing HTML for ${page.newPagePath}`);
    continue;
  }

  const html = fs.readFileSync(filePath, "utf8");
  if (!sampleGeneratedHtml) sampleGeneratedHtml = html;
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="(.*?)"/)?.[1];
  const h1 = html.match(/<h1>(.*?)<\/h1>/)?.[1];

  if (!title || title !== page.seoTitle.replaceAll("&", "&amp;")) errors.push(`Title mismatch on ${page.newPagePath}`);
  if (!description) errors.push(`Missing meta description on ${page.newPagePath}`);
  if (!h1) errors.push(`Missing H1 on ${page.newPagePath}`);
  if (!html.includes(`<link rel="canonical" href="${page.newPageUrl}"`)) errors.push(`Missing canonical on ${page.newPagePath}`);
  if (!html.includes('property="og:title"')) errors.push(`Missing Open Graph tags on ${page.newPagePath}`);
  if (!html.includes('name="twitter:card"')) errors.push(`Missing Twitter card tags on ${page.newPagePath}`);
  if (!html.includes('"@type":"FAQPage"')) errors.push(`Missing FAQ schema on ${page.newPagePath}`);
  if (!html.includes('"@type":"BreadcrumbList"')) errors.push(`Missing BreadcrumbList schema on ${page.newPagePath}`);
  if (/TODO|lorem ipsum/i.test(html)) errors.push(`Placeholder text found on ${page.newPagePath}`);
  if (!sitemap.includes(`<loc>${page.newPageUrl}</loc>`)) errors.push(`Sitemap missing ${page.newPageUrl}`);

  const providerSection = textBetween(html, /id="provider-ranking"/, /id="key-benefits"/);
  const tableSection = textBetween(html, /id="comparison-table"/, /id="pricing-value"/);
  const cheapestProviderIndex = providerSection.indexOf("Cheapest Proxies");
  const brightProviderIndex = providerSection.indexOf("Bright Data");
  const cheapestTableIndex = tableSection.indexOf("Cheapest Proxies");
  const brightTableIndex = tableSection.indexOf("Bright Data");

  if (cheapestProviderIndex === -1) errors.push(`Provider grid missing Cheapest Proxies on ${page.newPagePath}`);
  if (brightProviderIndex !== -1 && cheapestProviderIndex > brightProviderIndex) {
    errors.push(`Cheapest Proxies is not first in provider grid on ${page.newPagePath}`);
  }
  if (cheapestTableIndex === -1) errors.push(`Comparison table missing Cheapest Proxies on ${page.newPagePath}`);
  if (brightTableIndex !== -1 && cheapestTableIndex > brightTableIndex) {
    errors.push(`Cheapest Proxies is not first in comparison table on ${page.newPagePath}`);
  }

  if (titleSet.has(page.seoTitle)) errors.push(`Duplicate title: ${page.seoTitle}`);
  if (descSet.has(page.metaDescription)) errors.push(`Duplicate meta description: ${page.metaDescription}`);
  if (h1Set.has(h1)) errors.push(`Duplicate H1: ${h1}`);
  titleSet.add(page.seoTitle);
  descSet.add(page.metaDescription);
  h1Set.add(h1);
}

const hubRoutes = ["/proxy-library", ...(summary.routeGroups || []).map((group) => `/${group}`)];
for (const hubRoute of hubRoutes) {
  const filePath = routeToFile(hubRoute);
  if (!fs.existsSync(filePath)) errors.push(`Missing hub page ${hubRoute}`);
  if (!sitemap.includes(`<loc>${SITE_URL}${hubRoute}</loc>`)) errors.push(`Sitemap missing hub ${hubRoute}`);
}

if (errors.length) fail("Static SEO verification failed.", errors);

const missingGeneratedHeaderLinks = generated
  .filter((page) => !sampleGeneratedHtml.includes(`href="${page.newPagePath}"`))
  .map((page) => page.newPagePath);
if (missingGeneratedHeaderLinks.length) {
  fail("Generated page header tabs are missing generated page links.", missingGeneratedHeaderLinks);
}

console.log(`Verified ${generated.length} generated SEO pages.`);
console.log(`Verified ${hubRoutes.length} SEO hub pages.`);
console.log(`Verified home page SEO expansion with ${homeSectionCount} sections.`);
console.log(`Verified ${navLinkCount} generated links in header tab inventory.`);
console.log("Static SEO build passed.");
