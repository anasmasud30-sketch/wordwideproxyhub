// Targets / use-cases dataset. Compact real tuples expanded to the Target schema.
// tuple: [name, category, difficulty, recommendedProxyType, subcategory]
const T = [
  // E-commerce & retail
  ["Amazon", "E-commerce", "very high", "residential", "Marketplace"],
  ["Walmart", "E-commerce", "high", "residential", "Marketplace"],
  ["eBay", "E-commerce", "high", "residential", "Marketplace"],
  ["Target", "E-commerce", "high", "residential", "Retail"],
  ["Best Buy", "E-commerce", "high", "residential", "Electronics"],
  ["AliExpress", "E-commerce", "medium", "residential", "Marketplace"],
  ["Alibaba", "E-commerce", "medium", "residential", "B2B"],
  ["Etsy", "E-commerce", "medium", "residential", "Handmade"],
  ["Shopify stores", "E-commerce", "medium", "residential", "Storefronts"],
  ["Idealo", "E-commerce", "medium", "residential", "Price comparison"],
  ["Zalando", "E-commerce", "high", "residential", "Fashion"],
  ["Otto", "E-commerce", "medium", "residential", "Retail"],
  ["Rakuten", "E-commerce", "medium", "residential", "Marketplace"],
  ["MercadoLibre", "E-commerce", "high", "residential", "Marketplace"],
  ["Flipkart", "E-commerce", "high", "residential", "Marketplace"],
  ["Wayfair", "E-commerce", "high", "residential", "Home goods"],
  ["Home Depot", "E-commerce", "high", "residential", "Home improvement"],
  ["Costco", "E-commerce", "high", "residential", "Wholesale"],
  ["Newegg", "E-commerce", "medium", "residential", "Electronics"],
  ["Macy's", "E-commerce", "medium", "residential", "Department store"],
  ["ASOS", "E-commerce", "high", "residential", "Fashion"],
  ["Shein", "E-commerce", "high", "mobile", "Fast fashion"],
  ["Temu", "E-commerce", "high", "mobile", "Marketplace"],
  ["Chewy", "E-commerce", "medium", "residential", "Pet retail"],
  ["Overstock", "E-commerce", "medium", "residential", "Home goods"],

  // Social media & UGC
  ["Instagram", "Social Media", "very high", "mobile", "Photo/UGC"],
  ["TikTok", "Social Media", "very high", "mobile", "Short video"],
  ["Facebook", "Social Media", "very high", "mobile", "Social network"],
  ["X (Twitter)", "Social Media", "high", "residential", "Microblog"],
  ["LinkedIn", "Social Media", "very high", "residential", "Professional"],
  ["Reddit", "Social Media", "medium", "residential", "Forums"],
  ["YouTube", "Social Media", "high", "residential", "Video"],
  ["Pinterest", "Social Media", "medium", "residential", "Visual discovery"],
  ["Snapchat", "Social Media", "high", "mobile", "Messaging"],
  ["Threads", "Social Media", "high", "mobile", "Microblog"],
  ["Discord", "Social Media", "medium", "residential", "Chat"],
  ["Telegram", "Social Media", "medium", "residential", "Messaging"],
  ["Tinder", "Social Media", "high", "mobile", "Dating"],
  ["Quora", "Social Media", "medium", "residential", "Q&A"],
  ["Twitch", "Social Media", "high", "residential", "Live streaming"],

  // Sneakers, tickets & limited drops
  ["Nike SNKRS", "Sneakers & Retail", "very high", "residential", "Sneakers"],
  ["Footlocker", "Sneakers & Retail", "very high", "residential", "Sneakers"],
  ["Adidas", "Sneakers & Retail", "high", "residential", "Sneakers"],
  ["Supreme", "Sneakers & Retail", "very high", "residential", "Streetwear"],
  ["StockX", "Sneakers & Retail", "high", "residential", "Resale"],
  ["GOAT", "Sneakers & Retail", "high", "residential", "Resale"],
  ["Ticketmaster", "Sneakers & Retail", "very high", "residential", "Tickets"],
  ["StubHub", "Sneakers & Retail", "high", "residential", "Tickets"],
  ["SeatGeek", "Sneakers & Retail", "high", "residential", "Tickets"],
  ["End Clothing", "Sneakers & Retail", "very high", "residential", "Streetwear"],
  ["Pokemon Center", "Sneakers & Retail", "high", "residential", "Collectibles"],
  ["BestBuy PS5/GPU drops", "Sneakers & Retail", "very high", "residential", "Restocks"],

  // Travel & hospitality
  ["Booking.com", "Travel", "high", "residential", "Hotels"],
  ["Expedia", "Travel", "high", "residential", "OTA"],
  ["Airbnb", "Travel", "very high", "residential", "Short-term rental"],
  ["Kayak", "Travel", "medium", "residential", "Meta search"],
  ["Skyscanner", "Travel", "medium", "residential", "Flight meta"],
  ["Google Flights", "Travel", "high", "residential", "Flights"],
  ["Tripadvisor", "Travel", "medium", "residential", "Reviews"],
  ["Hotels.com", "Travel", "medium", "residential", "Hotels"],
  ["Agoda", "Travel", "high", "residential", "Hotels"],
  ["Trip.com", "Travel", "high", "residential", "OTA"],
  ["Vrbo", "Travel", "medium", "residential", "Rentals"],
  ["Ryanair", "Travel", "high", "residential", "Airline"],
  ["United Airlines", "Travel", "high", "residential", "Airline"],
  ["Marriott", "Travel", "medium", "residential", "Hotels"],

  // SEO & marketing
  ["Google Search (SERP)", "SEO & Marketing", "high", "datacenter", "Search"],
  ["Google Maps", "SEO & Marketing", "high", "residential", "Local"],
  ["Google Shopping", "SEO & Marketing", "high", "residential", "Shopping"],
  ["Bing", "SEO & Marketing", "medium", "datacenter", "Search"],
  ["Yandex", "SEO & Marketing", "high", "residential", "Search"],
  ["Baidu", "SEO & Marketing", "high", "residential", "Search"],
  ["DuckDuckGo", "SEO & Marketing", "low", "datacenter", "Search"],
  ["Google Ads transparency", "SEO & Marketing", "medium", "residential", "Ads"],
  ["Google Trends", "SEO & Marketing", "medium", "datacenter", "Trends"],
  ["Google My Business", "SEO & Marketing", "high", "residential", "Local"],
  ["YouTube search", "SEO & Marketing", "high", "residential", "Video SEO"],
  ["Apple App Store", "SEO & Marketing", "medium", "residential", "ASO"],
  ["Google Play Store", "SEO & Marketing", "medium", "residential", "ASO"],

  // Ad verification & streaming
  ["Ad networks", "Ad Tech", "medium", "residential", "Ad verification"],
  ["Programmatic DSPs", "Ad Tech", "medium", "residential", "Ad verification"],
  ["Netflix", "Ad Tech", "very high", "residential", "Streaming"],
  ["Hulu", "Ad Tech", "high", "residential", "Streaming"],
  ["Disney+", "Ad Tech", "high", "residential", "Streaming"],
  ["Spotify", "Ad Tech", "high", "residential", "Music"],
  ["BBC iPlayer", "Ad Tech", "high", "residential", "Streaming"],
  ["DAZN", "Ad Tech", "high", "residential", "Sports streaming"],
  ["Hotstar", "Ad Tech", "high", "residential", "Streaming"],

  // Gaming & finance/crypto
  ["Steam", "Gaming & Finance", "medium", "residential", "Game store"],
  ["Epic Games Store", "Gaming & Finance", "medium", "residential", "Game store"],
  ["Roblox", "Gaming & Finance", "high", "residential", "Gaming"],
  ["Betting odds sites", "Gaming & Finance", "high", "residential", "Sportsbook"],
  ["Bet365", "Gaming & Finance", "very high", "residential", "Sportsbook"],
  ["DraftKings", "Gaming & Finance", "high", "residential", "Sportsbook"],
  ["Coinbase", "Gaming & Finance", "high", "residential", "Crypto"],
  ["Binance", "Gaming & Finance", "high", "residential", "Crypto"],
  ["CoinMarketCap", "Gaming & Finance", "low", "datacenter", "Crypto data"],
  ["Yahoo Finance", "Gaming & Finance", "low", "datacenter", "Market data"],
  ["TradingView", "Gaming & Finance", "medium", "residential", "Charts"],
  ["Nasdaq", "Gaming & Finance", "low", "datacenter", "Market data"],

  // Jobs, real estate & business data
  ["Indeed", "Jobs & Real Estate", "high", "residential", "Jobs"],
  ["LinkedIn Jobs", "Jobs & Real Estate", "very high", "residential", "Jobs"],
  ["Glassdoor", "Jobs & Real Estate", "high", "residential", "Reviews"],
  ["ZipRecruiter", "Jobs & Real Estate", "medium", "residential", "Jobs"],
  ["Zillow", "Jobs & Real Estate", "high", "residential", "Real estate"],
  ["Realtor.com", "Jobs & Real Estate", "high", "residential", "Real estate"],
  ["Redfin", "Jobs & Real Estate", "high", "residential", "Real estate"],
  ["Rightmove", "Jobs & Real Estate", "high", "residential", "Real estate UK"],
  ["Zoopla", "Jobs & Real Estate", "medium", "residential", "Real estate UK"],
  ["Yelp", "Jobs & Real Estate", "high", "residential", "Local reviews"],
  ["Yellow Pages", "Jobs & Real Estate", "low", "datacenter", "Directory"],
  ["Crunchbase", "Jobs & Real Estate", "high", "residential", "Company data"],
  ["Google Reviews", "Jobs & Real Estate", "high", "residential", "Reviews"],
  ["Trustpilot", "Jobs & Real Estate", "medium", "residential", "Reviews"],
  ["Companies House", "Jobs & Real Estate", "low", "datacenter", "Registry"],

  // Misc / data
  ["Wikipedia", "Data", "low", "datacenter", "Reference"],
  ["Weather sites", "Data", "low", "datacenter", "Weather"],
  ["News sites", "Data", "medium", "residential", "Publishing"],
  ["Public APIs", "Data", "low", "datacenter", "APIs"],
  ["Government portals", "Data", "medium", "residential", "Gov data"],
  ["Job boards", "Data", "medium", "residential", "Jobs"],
  ["Directory sites", "Data", "low", "datacenter", "Directories"],
  ["Review aggregators", "Data", "medium", "residential", "Reviews"]
];

function difficultyBlocks(difficulty) {
  const map = {
    low: ["basic rate limiting", "occasional IP throttling"],
    medium: ["rate limiting", "IP bans on bursts", "simple bot checks"],
    high: ["aggressive rate limiting", "IP and ASN bans", "CAPTCHA challenges", "TLS/JA3 fingerprinting"],
    "very high": ["device and browser fingerprinting", "behavioral bot detection", "frequent CAPTCHAs", "instant datacenter-IP bans", "account-level flagging"]
  };
  return map[difficulty] || map.medium;
}

export default T.map(([name, category, difficulty, recommendedProxyType, subcategory]) => {
  const slug = name.toLowerCase().replace(/[()]/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const rt = recommendedProxyType;
  return {
    name, slug, category, subcategory, difficulty, recommendedProxyType: rt,
    whyProxies: `${name} applies ${difficulty} anti-bot defenses, so requests from a single IP or from obvious datacenter ranges get throttled or blocked quickly. ${rt.charAt(0).toUpperCase() + rt.slice(1)} proxies spread traffic across trusted IPs so ${category.toLowerCase()} data collection on ${name} stays reliable.`,
    commonBlocks: difficultyBlocks(difficulty),
    tips: [
      `Use ${rt} proxies with per-request or short-session rotation for ${name}.`,
      `Match request headers, locale, and pacing to a real ${name} visitor to avoid fingerprint flags.`,
      `Back off and retry on a fresh IP whenever ${name} returns a block or CAPTCHA.`
    ],
    notes: `${name} sits in the ${category}${subcategory ? ` (${subcategory})` : ""} space. Difficulty and recommended proxy type reflect how strict its bot defenses typically are.`,
    keywords: [
      `${name.toLowerCase()} proxies`,
      `scrape ${name.toLowerCase()}`,
      `${name.toLowerCase()} scraping proxies`,
      `best proxies for ${name.toLowerCase()}`
    ]
  };
});
