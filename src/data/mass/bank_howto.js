// How-to bank ({TOPIC} = the guide title/task).
export default {
  intros: [
    "This walkthrough for {TOPIC} keeps things practical: the prerequisites, the steps that matter, the mistakes to avoid, and how to confirm it worked.",
    "{TOPIC} is easier than it looks once you break it into a few reliable steps and match your proxy setup to the target.",
    "Follow the steps below for {TOPIC}. The order matters: pick the right proxy type first, then configure, then test on a small sample before scaling.",
    "Most trouble with {TOPIC} comes from skipping the test step or using the wrong proxy type. This guide handles both."
  ],
  sections: [
    { title: "Prerequisites", body: "Before starting {TOPIC}, have your proxy credentials ready, know your target and the fields you need, and decide whether the workflow needs rotating IPs or a sticky session." },
    { title: "Common Pitfalls", body: "The usual failure modes for {TOPIC} are using datacenter IPs on protected targets, rotating too aggressively, ignoring rate limits, and skipping a small validation run before scaling." },
    { title: "Verifying It Worked", body: "Confirm {TOPIC} succeeded by checking success rate on a small sample, validating that the data is complete and correct, and watching for silent blocks that return empty pages." },
    { title: "Scaling Up", body: "Once {TOPIC} works on a small run, increase volume gradually. Monitor block rate, bandwidth per result, and retries so cost and reliability stay under control." },
    { title: "Troubleshooting", body: "If {TOPIC} starts failing, isolate the cause: is it auth, proxy type, pacing, or a target change? Test one variable at a time and retry failed requests on a fresh IP." }
  ],
  faqs: [
    { q: "Do I need special software for this?", a: "Usually not — a standard HTTP client or browser-automation tool plus a proxy is enough. The key is matching the proxy type to the target." },
    { q: "How do I know it worked?", a: "Validate on a small sample: check success rate, confirm the data is complete, and watch for empty or block pages that indicate a silent failure." },
    { q: "What if I still get blocked?", a: "Switch to residential or mobile IPs, slow the request rate, rotate user agents, and retry on a fresh IP. Layer these techniques rather than relying on one." }
  ],
  benefits: ["Get a working setup without trial and error.", "Avoid the mistakes that cause blocks.", "Scale with confidence once it is verified."],
  ctas: ["To complete {TOPIC} affordably, start with Cheapest Proxies and upgrade only if the target requires a premium network."],
  transitions: ["Here are the steps in order."]
};
