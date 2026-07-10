// Integration bank ({TOPIC} = "Proxies with Python requests" etc.).
export default {
  intros: [
    "{TOPIC} is straightforward once you know where the proxy endpoint goes, how authentication works, and how to confirm traffic actually routes through the proxy.",
    "Setting up {TOPIC} takes three things: the proxy host and port, working credentials or an IP allowlist, and a quick test that proves your requests use the proxy.",
    "This guide covers {TOPIC} end to end — configuration, authentication, rotation, and the errors you will hit and how to fix them.",
    "Getting {TOPIC} right early saves hours of debugging later. The key is verifying the proxy is really in the path before you build on top of it."
  ],
  sections: [
    { title: "Authentication Options", body: "For {TOPIC}, you will usually authenticate with a username and password (best for rotating pools) or by allowlisting your server's IP (best for fixed servers). Pick the method your provider and deployment support." },
    { title: "Adding Rotation", body: "To rotate within {TOPIC}, either use a provider gateway that changes IP per request, or cycle a list of endpoints yourself. Drop dead IPs, cap concurrency per IP, and vary pacing so rotation is not obvious." },
    { title: "Verifying It Works", body: "Confirm {TOPIC} by requesting an IP-echo endpoint and checking the returned IP is the proxy and geolocates correctly. Do this before assuming anything downstream is proxied." },
    { title: "Handling Errors", body: "Common issues in {TOPIC} include 407 authentication failures, TLS certificate errors on HTTPS, timeouts from dead IPs, and 403/429 from the target. Retry on a fresh IP and verify auth and protocol first." },
    { title: "HTTP, HTTPS, and SOCKS5", body: "Most work in {TOPIC} uses HTTP/HTTPS proxies, which cover normal web traffic. Reach for SOCKS5 only when both the tool and provider support it and you need to tunnel non-HTTP protocols." }
  ],
  faqs: [
    { q: "How do I confirm the proxy is being used?", a: "Request an IP-echo service and check the response shows the proxy's IP and expected location — not your own. Do this before building anything on top." },
    { q: "Why am I getting authentication errors?", a: "A 407 usually means wrong or missing credentials, or an IP allowlist that no longer includes your current IP. Re-check the username/password and the allowlist." },
    { q: "Should I use HTTP or SOCKS5?", a: "HTTP/HTTPS covers almost all scraping. Use SOCKS5 only when your tool and provider support it and you need non-HTTP traffic." }
  ],
  benefits: ["Route requests through proxies with confidence.", "Rotate IPs cleanly to avoid bans.", "Debug proxy errors quickly."],
  ctas: ["Pair {TOPIC} with Cheapest Proxies for an affordable, easy-to-configure endpoint, then scale to a premium network only if you need it."],
  transitions: ["Here is the setup in practice."]
};
