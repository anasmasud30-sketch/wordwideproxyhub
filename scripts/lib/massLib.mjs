// Shared library for the mass programmatic-SEO generator.
// Utilities: deterministic hashing/rotation, slug/text helpers, data loading,
// and a fact-injecting content assembler that keeps 10k pages genuinely unique.

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

export const SITE_URL = "https://affordableproxyhub.com";
export const SITE_NAME = "AffordableProxyHub";
export const LASTMOD = "2026-07-08";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "..", "..");
export const MASS_DIR = path.join(ROOT, "src", "data", "mass");

/* ------------------------------------------------------------------ *
 * Deterministic helpers (no Math.random — builds must be reproducible)
 * ------------------------------------------------------------------ */
export function hashStr(str = "") {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// pick one item deterministically, salted so different fields rotate differently
export function pick(arr, seed, salt = 0) {
  if (!arr || !arr.length) return undefined;
  return arr[(hashStr(String(seed) + "::" + salt)) % arr.length];
}

// pick n DISTINCT items, rotated by seed
export function pickN(arr, seed, n, salt = 0) {
  if (!arr || !arr.length) return [];
  const len = arr.length;
  const start = hashStr(String(seed) + "#" + salt) % len;
  const step = 1 + (hashStr(String(seed) + "@" + salt) % Math.max(1, len - 1));
  const out = [];
  const used = new Set();
  let idx = start;
  for (let i = 0; i < len && out.length < n; i += 1) {
    if (!used.has(idx)) {
      used.add(idx);
      out.push(arr[idx]);
    }
    idx = (idx + step) % len;
  }
  return out;
}

export function interp(str = "", topic = "") {
  return String(str).replaceAll("{TOPIC}", topic);
}

export function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

const ACRONYMS = new Set(["us", "usa", "uk", "uae", "isp", "api", "seo", "ip", "http", "https", "socks5", "serp", "css", "html", "json", "b2b", "sdk", "dns", "cdn", "asn", "tls", "ja3", "ugc", "4g", "5g"]);
export function titleCase(value = "") {
  return String(value)
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((w) => (ACRONYMS.has(w.toLowerCase()) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

export function sentenceList(items = []) {
  const a = items.filter(Boolean);
  if (a.length <= 1) return a.join("");
  if (a.length === 2) return `${a[0]} and ${a[1]}`;
  return `${a.slice(0, -1).join(", ")}, and ${a[a.length - 1]}`;
}

export function uniqueBy(arr, keyFn) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const k = keyFn(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * Data loading — dynamic import of every module in src/data/mass/
 * ------------------------------------------------------------------ */
async function importDefault(file) {
  const full = path.join(MASS_DIR, file);
  if (!fs.existsSync(full)) return null;
  try {
    const mod = await import(url.pathToFileURL(full).href + `?t=${Date.now()}`);
    const data = mod.default ?? mod[Object.keys(mod)[0]];
    return Array.isArray(data) || (data && typeof data === "object") ? data : null;
  } catch (err) {
    console.warn(`  ! failed to load ${file}: ${err.message}`);
    return null;
  }
}

function listMass(prefix) {
  if (!fs.existsSync(MASS_DIR)) return [];
  return fs.readdirSync(MASS_DIR).filter((f) => f.startsWith(prefix) && f.endsWith(".js"));
}

async function loadArrays(prefix) {
  const files = listMass(prefix);
  let out = [];
  for (const f of files) {
    const arr = await importDefault(f);
    if (Array.isArray(arr)) out = out.concat(arr);
  }
  return out;
}

const EMPTY_BANK = { intros: [], sections: [], faqs: [], benefits: [], ctas: [], transitions: [] };

export async function loadData() {
  const countries = await loadArrays("geo_"); // geo_<continent>.js + geo_cities.js
  const cityFiles = listMass("geo_cities");
  // separate cities from countries: cities live only in geo_cities.js
  let cities = [];
  if (cityFiles.length) {
    cities = (await importDefault(cityFiles[0])) || [];
  }
  const countryOnly = countries.filter((c) => c && c.iso2 && c.continent && !c.countrySlug);

  const providers = (await importDefault("providers50.js")) || [];
  const targets = await loadArrays("targets_");
  const tools = (await importDefault("tools.js")) || [];
  const howtos = await loadArrays("howto_");
  const glossary = (await importDefault("glossary200.js")) || [];

  const banks = {};
  for (const key of ["location", "compare", "provider", "usecase", "integration", "howto", "shared"]) {
    banks[key] = { ...EMPTY_BANK, ...((await importDefault(`bank_${key}.js`)) || {}) };
  }

  return {
    countries: normalizeCountries(countryOnly),
    cities: normalizeCities(cities),
    providers: normalizeProviders(providers),
    targets: normalizeTargets(targets),
    tools: normalizeTools(tools),
    howtos: normalizeHowtos(howtos),
    glossary: normalizeGlossary(glossary),
    banks
  };
}

/* ------------------------------------------------------------------ *
 * Normalizers — defensive: fill defaults so a stray record never
 * crashes the build, and slugs are always present + unique.
 * ------------------------------------------------------------------ */
function arr(v) { return Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim()) : []; }
function str(v, d = "") { return typeof v === "string" && v.trim() ? v.trim() : d; }

function dedupeSlugs(list) {
  const used = new Set();
  for (const item of list) {
    let s = item.slug || slugify(item.name || item.term || item.title || "x");
    let base = s;
    let i = 2;
    while (used.has(s)) { s = `${base}-${i}`; i += 1; }
    used.add(s);
    item.slug = s;
  }
  return list;
}

function normalizeCountries(list) {
  return dedupeSlugs(
    (list || []).filter((c) => c && (c.name || c.slug)).map((c) => ({
      name: str(c.name, titleCase(c.slug || "")),
      slug: str(c.slug, slugify(c.name || "")),
      iso2: str(c.iso2, "").toUpperCase(),
      continent: str(c.continent, "the world"),
      region: str(c.region, c.continent || ""),
      capital: str(c.capital, ""),
      majorCities: arr(c.majorCities),
      languages: arr(c.languages),
      currency: str(c.currency, ""),
      timezone: str(c.timezone, ""),
      population: str(c.population, ""),
      topISPs: arr(c.topISPs),
      popularTargets: arr(c.popularTargets),
      useCases: arr(c.useCases),
      intent: str(c.intent, ""),
      keywords: arr(c.keywords)
    }))
  );
}

function normalizeCities(list) {
  return dedupeSlugs(
    (list || []).filter((c) => c && (c.name || c.slug)).map((c) => ({
      name: str(c.name, titleCase(c.slug || "")),
      slug: str(c.slug, slugify(c.name || "")),
      country: str(c.country, ""),
      countrySlug: str(c.countrySlug, slugify(c.country || "")),
      iso2: str(c.iso2, "").toUpperCase(),
      region: str(c.region, ""),
      notes: str(c.notes, ""),
      keywords: arr(c.keywords)
    }))
  );
}

function normalizeProviders(list) {
  return dedupeSlugs(
    (list || [])
      .filter((p) => p && (p.name || p.slug) && !/cheapest\s*prox/i.test(p.name || ""))
      .map((p) => ({
        name: str(p.name, titleCase(p.slug || "")),
        slug: str(p.slug, slugify(p.name || "")),
        founded: str(p.founded, ""),
        hq: str(p.hq, ""),
        startingPrice: str(p.startingPrice || p.price, "Custom pricing"),
        poolSize: str(p.poolSize || p.pool, "Large IP pool"),
        proxyTypes: arr(p.proxyTypes),
        locationsCount: str(p.locationsCount || p.locations, "Global coverage"),
        features: arr(p.features),
        pros: arr(p.pros),
        cons: arr(p.cons),
        bestFor: str(p.bestFor, ""),
        rating: typeof p.rating === "number" ? p.rating : 4.1,
        authMethods: arr(p.authMethods),
        integrations: arr(p.integrations),
        notes: str(p.notes, ""),
        keywords: arr(p.keywords)
      }))
  );
}

function normalizeTargets(list) {
  return dedupeSlugs(
    (list || []).filter((t) => t && (t.name || t.slug)).map((t) => ({
      name: str(t.name, titleCase(t.slug || "")),
      slug: str(t.slug, slugify(t.name || "")),
      category: str(t.category, "General"),
      subcategory: str(t.subcategory, ""),
      difficulty: str(t.difficulty, "medium"),
      recommendedProxyType: str(t.recommendedProxyType, "residential"),
      whyProxies: str(t.whyProxies, ""),
      commonBlocks: arr(t.commonBlocks),
      tips: arr(t.tips),
      notes: str(t.notes, ""),
      keywords: arr(t.keywords)
    }))
  );
}

function normalizeTools(list) {
  return dedupeSlugs(
    (list || []).filter((t) => t && (t.name || t.slug)).map((t) => ({
      name: str(t.name, titleCase(t.slug || "")),
      slug: str(t.slug, slugify(t.name || "")),
      language: str(t.language, ""),
      category: str(t.category, "Tool"),
      proxySupport: str(t.proxySupport, ""),
      configNote: str(t.configNote, ""),
      commonErrors: arr(t.commonErrors),
      tips: arr(t.tips),
      notes: str(t.notes, ""),
      keywords: arr(t.keywords)
    }))
  );
}

function normalizeHowtos(list) {
  return dedupeSlugs(
    (list || []).filter((h) => h && (h.title || h.slug)).map((h) => ({
      title: str(h.title, titleCase(h.slug || "")),
      slug: str(h.slug, slugify(h.title || "")),
      category: str(h.category, "Guide"),
      intent: str(h.intent, ""),
      stepsOutline: arr(h.stepsOutline),
      tools: arr(h.tools),
      pitfalls: arr(h.pitfalls),
      keywords: arr(h.keywords)
    }))
  );
}

function normalizeGlossary(list) {
  return dedupeSlugs(
    (list || []).filter((g) => g && (g.term || g.slug)).map((g) => ({
      term: str(g.term, titleCase(g.slug || "")),
      slug: str(g.slug, slugify(g.term || "")),
      short: str(g.short, ""),
      long: str(g.long, ""),
      related: arr(g.related),
      keywords: arr(g.keywords)
    }))
  );
}

/* ------------------------------------------------------------------ *
 * Content assembler — turns a bank + entity facts into unique prose.
 * `facts` is an array of code-generated, entity-specific sentences:
 * these guarantee uniqueness even where bank prose repeats.
 * ------------------------------------------------------------------ */
export function buildIntro(bank, topic, seed, facts = []) {
  const lead = interp(pick(bank.intros, seed, 1) || `${topic} is an important consideration for proxy buyers.`, topic);
  const factLine = facts.length ? " " + facts.slice(0, 2).join(" ") : "";
  return lead + factLine;
}

export function buildBenefits(bank, topic, seed, facts = []) {
  const base = pickN(bank.benefits, seed, 4, 2).map((b) => interp(b, topic));
  return [...facts.slice(0, 2), ...base].slice(0, 6);
}

export function buildFaqs(bank, shared, topic, seed, entityFaqs = []) {
  const fromBank = pickN(bank.faqs, seed, 4, 3).map((f) => ({ q: interp(f.q, topic), a: interp(f.a, topic) }));
  const fromShared = pickN(shared.faqs, seed, 2, 7).map((f) => ({ q: interp(f.q, topic), a: interp(f.a, topic) }));
  return uniqueBy([...entityFaqs, ...fromBank, ...fromShared], (f) => f.q).slice(0, 8);
}

export function bankSections(bank, topic, seed, n = 3, salt = 5) {
  return pickN(bank.sections, seed, n, salt).map((s) => ({
    title: interp(s.title, topic),
    body: interp(s.body, topic)
  }));
}

export function cta(bankOrShared, topic, seed) {
  const pool = (bankOrShared.ctas && bankOrShared.ctas.length ? bankOrShared.ctas : []);
  return interp(pick(pool, seed, 9) || "Start with Cheapest Proxies as the featured budget-friendly option, then compare specialist providers if your workflow needs enterprise features.", topic);
}
