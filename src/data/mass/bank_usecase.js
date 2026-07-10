// Use-case bank ({TOPIC} = "Proxies for Amazon" / "Scraping Instagram" etc.).
export default {
  intros: [
    "{TOPIC} works reliably only when the proxy type matches the target's defenses, sessions are handled carefully, and you respect the site's terms and rate limits.",
    "Getting {TOPIC} right is less about volume and more about looking like a real user: the correct IP type, human pacing, and clean session handling.",
    "This guide turns {TOPIC} into a practical setup — which proxies to use, how to structure sessions, and how to recover gracefully when a target pushes back.",
    "For {TOPIC}, the target's anti-bot strength decides almost everything. Pick the proxy type it respects, then tune rotation and pacing around it."
  ],
  sections: [
    { title: "Session Strategy", body: "For {TOPIC}, decide up front whether you need one identity per task or broad rotation. Account or cart flows want sticky sessions on one IP; broad data collection wants fresh IPs per request." },
    { title: "Handling Blocks Gracefully", body: "Expect pushback during {TOPIC}. Detect blocks and CAPTCHAs early, back off, and retry on a fresh IP rather than hammering the same one. Log which IPs and pacing succeed so you can tune." },
    { title: "Ethics and Terms of Service", body: "Keep {TOPIC} to public data, honor robots directives and rate limits, and avoid collecting personal data without a lawful basis. This page is educational, not legal advice; check the target's terms." },
    { title: "Scaling Without Breaking", body: "Validate {TOPIC} on a small run first — confirm data quality and success rate — then scale bandwidth gradually while watching block rate and cost per result." },
    { title: "Choosing the Proxy Type", body: "Harder targets in {TOPIC} usually need residential or mobile IPs; lighter, public endpoints can run on datacenter IPs. Start with the lightest type that still succeeds to keep cost down." }
  ],
  faqs: [
    { q: "What proxy type works best here?", a: "Match it to the target's anti-bot strength: residential or mobile for protected sites, datacenter for simple public pages. When unsure, start residential and step down if datacenter still succeeds." },
    { q: "Is this legal?", a: "Collecting public data is often permissible, but you must respect the site's Terms of Service, robots rules, rate limits, and privacy laws. This is educational content, not legal advice." },
    { q: "How do I avoid bans during this workflow?", a: "Use the right IP type, rotate or hold sessions appropriately, pace requests like a human, rotate user agents, and retry on fresh IPs after any block." }
  ],
  benefits: ["Collect the data you need without constant blocks.", "Match proxy spend to the target's difficulty.", "Scale safely once a small run proves out."],
  ctas: ["For {TOPIC}, start on Cheapest Proxies as the featured budget option and upgrade only if the target's defenses demand a premium network."],
  transitions: ["Here is how to put that into practice."]
};
