// Tools / languages / libraries dataset. tuple: [name, language, category, proxyNote]
const T = [
  ["Python requests", "Python", "HTTP client", "accepts an HTTP/HTTPS proxy via a proxies dict on each request or session"],
  ["Python httpx", "Python", "HTTP client", "supports sync and async proxies, including per-transport mounts"],
  ["Python aiohttp", "Python", "HTTP client", "routes async requests through a proxy passed to the request or connector"],
  ["Python urllib", "Python", "HTTP client", "uses a ProxyHandler installed on the opener"],
  ["Scrapy", "Python", "Scraping framework", "sets proxies per request via meta or a downloader middleware"],
  ["Selenium", "Python", "Browser automation", "launches the browser with proxy arguments or a proxy capability"],
  ["Selenium Wire", "Python", "Browser automation", "adds authenticated proxy support on top of Selenium"],
  ["undetected-chromedriver", "Python", "Browser automation", "runs a stealth Chrome that accepts standard proxy flags"],
  ["Playwright", "JavaScript", "Browser automation", "accepts a proxy object at browser or context launch, with auth"],
  ["Playwright Python", "Python", "Browser automation", "accepts a proxy at launch or per browser context"],
  ["Puppeteer", "JavaScript", "Browser automation", "passes a --proxy-server launch flag and authenticates on the page"],
  ["Puppeteer Extra Stealth", "JavaScript", "Browser automation", "adds stealth plugins while keeping standard proxy launch flags"],
  ["Node axios", "JavaScript", "HTTP client", "takes a proxy config object or an https-proxy-agent"],
  ["Node got", "JavaScript", "HTTP client", "uses an agent such as hpagent or https-proxy-agent"],
  ["node-fetch", "JavaScript", "HTTP client", "routes through an https-proxy-agent passed as the agent option"],
  ["Cheerio", "JavaScript", "Scraping framework", "parses HTML you fetch through a proxied HTTP client"],
  ["Crawlee", "JavaScript", "Scraping framework", "rotates a configured proxy pool across requests automatically"],
  ["cURL", "Shell", "Tool", "takes -x/--proxy with -U for credentials"],
  ["wget", "Shell", "Tool", "reads proxy settings from flags or environment variables"],
  ["HTTPie", "Shell", "Tool", "accepts a --proxy flag per scheme"],
  ["Go net/http", "Go", "HTTP client", "sets a Transport.Proxy function on the client"],
  ["Go Colly", "Go", "Scraping framework", "supports a proxy switcher for round-robin rotation"],
  ["Ruby Net::HTTP", "Ruby", "HTTP client", "opens the connection through a proxy host, port, user, and pass"],
  ["Ruby HTTParty", "Ruby", "HTTP client", "accepts http_proxyaddr and related options"],
  ["PHP cURL", "PHP", "HTTP client", "sets CURLOPT_PROXY and CURLOPT_PROXYUSERPWD"],
  ["PHP Guzzle", "PHP", "HTTP client", "takes a proxy request option per scheme"],
  ["Java HttpClient", "Java", "HTTP client", "builds a ProxySelector or per-request proxy"],
  ["Java Jsoup", "Java", "Scraping framework", "connects through a java.net.Proxy on the connection"],
  ["OkHttp", "Java", "HTTP client", "sets a Proxy and an Authenticator on the client"],
  ["C# HttpClient", "C#", "HTTP client", "assigns a WebProxy to the HttpClientHandler"],
  ["Postman", "Tool", "Tool", "configures a global or per-request proxy in settings"],
  ["Insomnia", "Tool", "Tool", "sets an HTTP/HTTPS proxy in preferences"],
  ["Chrome browser", "Browser", "Tool", "uses system proxy settings or a launch flag"],
  ["Firefox browser", "Browser", "Tool", "sets a manual proxy in network settings"],
  ["Android device", "Mobile", "Tool", "sets a proxy per Wi-Fi network in advanced settings"],
  ["iOS device", "Mobile", "Tool", "sets an HTTP proxy per Wi-Fi network"],
  ["BeautifulSoup", "Python", "Scraping framework", "parses HTML fetched through a proxied requests session"],
  ["lxml", "Python", "Scraping framework", "parses documents you download via a proxied client"],
  ["pandas read_html", "Python", "Data", "reads tables from pages fetched through a proxy"],
  ["Apify SDK", "JavaScript", "Scraping framework", "manages proxy configuration and rotation for actors"],
  ["Selenium Grid", "Java", "Browser automation", "passes proxy capabilities to remote browser nodes"],
  ["Katalon", "Tool", "Browser automation", "sets a proxy in project or execution settings"],
  ["ScrapingBee client", "Multi", "Scraper API", "handles proxies and rendering on the API side"],
  ["Zyte API client", "Multi", "Scraper API", "manages smart proxy rotation and bans server-side"],
  ["Bright Data SDK", "Multi", "Scraper API", "exposes zone-based proxy endpoints and unlocker"],
  ["Requests-HTML", "Python", "Scraping framework", "renders JS while using a proxied session"],
  ["Nightmare.js", "JavaScript", "Browser automation", "passes a switches proxy-server option to Electron"],
  ["Mechanize", "Python", "Scraping framework", "sets proxies on the browser object"],
  ["Colly proxy switcher", "Go", "Scraping framework", "rotates proxies round-robin per request"],
  ["Splash", "Python", "Browser automation", "renders pages through a configured upstream proxy"]
];

export default T.map(([name, language, category, note]) => {
  const slug = name.toLowerCase().replace(/[()#.]/g, "").replace(/\+/g, "plus").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return {
    name, slug, language, category,
    proxySupport: `${name} ${note}.`,
    configNote: `In ${name}, you set the proxy endpoint (host:port), choose HTTP/HTTPS or SOCKS5, and add username/password credentials or allowlist your server IP.`,
    commonErrors: [
      "407 Proxy Authentication Required (wrong or missing credentials)",
      "SSL/TLS certificate errors when tunnelling HTTPS through the proxy",
      "Connection timeouts from a dead or overloaded proxy IP",
      "403/429 responses when the target detects the proxy or rate"
    ],
    tips: [
      `Test ${name} against an IP-echo endpoint to confirm traffic actually routes through the proxy.`,
      `Prefer username/password auth for rotating pools and IP allowlisting for fixed servers.`,
      `Handle proxy errors with retries on a fresh IP rather than failing the whole job.`
    ],
    notes: `${name} is a ${category.toLowerCase()}${language && language !== "Multi" && language !== "Tool" && language !== "Browser" && language !== "Mobile" ? ` for ${language}` : ""}.`,
    keywords: [
      `${name.toLowerCase()} proxy`,
      `${name.toLowerCase()} proxy setup`,
      `use proxies with ${name.toLowerCase()}`,
      `${name.toLowerCase()} rotating proxies`
    ]
  };
});
