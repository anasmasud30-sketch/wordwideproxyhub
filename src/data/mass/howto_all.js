// How-to dataset, generated from real query fragments and expanded to the HowTo schema.
const out = [];
const seen = new Set();
function add(title, category, tools, steps, pitfalls) {
  const slug = title.toLowerCase().replace(/[()#.]/g, "").replace(/\+/g, "plus").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (seen.has(slug)) return;
  seen.add(slug);
  out.push({
    title, slug, category,
    intent: `${title.replace(/^How to /, "This guide shows how to ")} for scraping, automation, and data-collection workflows, and where a budget-friendly proxy fits.`,
    stepsOutline: steps,
    tools: tools || [],
    pitfalls: pitfalls || ["Skipping a small test before scaling.", "Using datacenter IPs where residential is required.", "Ignoring rate limits and retry logic."],
    keywords: [title.toLowerCase().replace(/^how to /, ""), title.toLowerCase(), `${title.toLowerCase().replace(/^how to /, "")} proxy`]
  });
}

// ---- proxy setup in tools/platforms ----
const setupTargets = [
  "Python requests", "Python httpx", "Node axios", "node-fetch", "cURL", "wget",
  "Scrapy", "Selenium", "Playwright", "Puppeteer", "Postman", "Go", "Java", "PHP cURL",
  "Ruby", "Chrome", "Firefox", "Android", "iOS", "Windows", "macOS", "Docker containers"
];
for (const t of setupTargets) {
  add(`How to set up a proxy in ${t}`, "Proxy setup",
    [t], [
      `Get proxy credentials (host, port, username, password) from your provider.`,
      `Configure ${t} to route requests through that proxy endpoint.`,
      `Choose HTTP/HTTPS or SOCKS5 to match the provider and target.`,
      `Send a request to an IP-echo service to confirm ${t} uses the proxy.`,
      `Add retry logic so a dead proxy IP doesn't fail the whole job.`
    ]);
}

// ---- rotation ----
const rotateTargets = ["Python requests", "Scrapy", "Node.js", "Selenium", "Playwright", "Puppeteer", "Go", "cURL scripts", "aiohttp", "httpx", "PHP", "Java"];
for (const t of rotateTargets) {
  add(`How to rotate proxies in ${t}`, "Automation",
    [t], [
      `Load a pool of proxy endpoints (or use a rotating gateway that changes IP per request).`,
      `Pick an IP per request or per short session in ${t}.`,
      `Track failures and drop or cool down bad IPs.`,
      `Randomize pacing and headers so rotation isn't obvious.`,
      `Monitor success rate per IP and per target.`
    ], ["Rotating too fast and triggering session resets.", "Reusing one identity across requests that need separation.", "Not removing dead IPs from the pool."]);
}

// ---- anti-bot / detection ----
const antibot = [
  ["How to avoid getting blocked while scraping", ["rotate residential IPs", "randomize user agents", "respect rate limits", "handle CAPTCHAs", "vary request pacing"]],
  ["How to bypass rate limiting with proxies", ["distribute requests across many IPs", "add exponential backoff", "cap concurrency per IP", "retry on 429s with a fresh IP"]],
  ["How to solve or avoid CAPTCHAs when scraping", ["reduce request velocity", "use residential/mobile IPs", "keep sessions human-like", "integrate a solving service only when needed"]],
  ["How to rotate user agents with proxies", ["maintain a realistic UA list", "pair UA with matching headers", "rotate UA alongside IP", "avoid impossible UA/OS combos"]],
  ["How to avoid IP bans when web scraping", ["use residential proxies", "throttle per-IP request rate", "detect bans early", "cool down and rotate"]],
  ["How to reduce browser fingerprinting detection", ["use stealth plugins", "match timezone/locale to the proxy geo", "avoid headless flags", "vary viewport and fonts"]],
  ["How to handle 403 Forbidden responses when scraping", ["switch to residential IPs", "fix headers and referrers", "slow down", "retry on a fresh IP"]],
  ["How to handle 429 Too Many Requests", ["read Retry-After", "back off exponentially", "spread load across IPs", "lower concurrency"]],
  ["How to make headless browsers look human", ["disable automation flags", "add real mouse/scroll timing", "use a residential proxy", "match geo to IP"]],
  ["How to scrape JavaScript-heavy sites with proxies", ["render with Playwright/Puppeteer", "route the browser through a proxy", "wait for network idle", "extract from the DOM"]],
  ["How to scrape behind a login safely", ["reuse cookies over a sticky session", "keep one IP per account", "avoid parallel logins", "respect the site's terms"]],
  ["How to detect if a proxy is blocked", ["watch status codes and block pages", "compare success rate by IP", "flag CAPTCHA redirects", "auto-retire bad IPs"]]
];
for (const [title, steps] of antibot) add(title, "Anti-bot", [], steps, ["Assuming one technique is enough — layer them.", "Ignoring the site's Terms of Service.", "Scaling before validating on a small run."]);

// ---- scraping techniques ----
const scraping = [
  "How to scrape a website with Python and proxies",
  "How to scrape product prices with proxies",
  "How to scrape search engine results safely",
  "How to scrape at scale without getting blocked",
  "How to scrape data behind pagination",
  "How to scrape infinite-scroll pages",
  "How to extract JSON from API responses with proxies",
  "How to parse HTML tables into structured data",
  "How to scrape images and media with proxies",
  "How to build a price-monitoring scraper with proxies",
  "How to scrape reviews and ratings with proxies",
  "How to scrape job listings with proxies",
  "How to scrape real estate listings with proxies",
  "How to scrape social media profiles responsibly",
  "How to collect SERP data for SEO with proxies",
  "How to monitor competitor prices with proxies",
  "How to verify ads by location with proxies",
  "How to scrape multiple countries with geo-targeted proxies",
  "How to schedule and automate a scraping job with proxies",
  "How to store and deduplicate scraped data",
  "How to respect robots.txt while using proxies",
  "How to scrape without a headless browser",
  "How to scrape faster with concurrency and proxies",
  "How to handle cookies and sessions when scraping"
];
for (const title of scraping) add(title, "Scraping", [], [
  "Define the exact target, fields, and volume you need.",
  "Choose the proxy type that matches the target's anti-bot strength.",
  "Set rotation, pacing, and headers to look like real traffic.",
  "Parse and validate the data on a small sample.",
  "Scale gradually while monitoring success rate and cost."
]);

// ---- testing / measuring ----
const testing = [
  ["How to test if a proxy is working", ["send a request to an IP-echo endpoint", "confirm the returned IP is the proxy", "check the geolocation", "verify HTTPS works"]],
  ["How to measure proxy speed and latency", ["time requests to your real target", "measure first-byte and total time", "compare IPs", "track over time"]],
  ["How to check a proxy's location accuracy", ["query an IP geolocation API", "compare to the requested country/city", "test several IPs", "flag mismatches"]],
  ["How to choose between residential and datacenter proxies", ["assess target anti-bot strength", "weigh speed vs stealth", "estimate bandwidth cost", "test both on the target"]],
  ["How to estimate proxy bandwidth costs", ["measure GB per successful result", "multiply by monthly volume", "add retries overhead", "compare providers by cost per result"]],
  ["How to set up IP allowlist authentication", ["find your server's public IP", "add it in the provider dashboard", "connect without user/pass", "update the allowlist when the IP changes"]],
  ["How to use SOCKS5 proxies", ["confirm tool and provider support SOCKS5", "set the SOCKS5 host and port", "add auth if required", "test a request through it"]],
  ["How to set up sticky sessions with proxies", ["request a session-based endpoint", "keep the same IP for the session length", "cap session duration", "rotate when the session ends"]]
];
for (const [title, steps] of testing) add(title, "Proxy setup", [], steps);

export default out;
