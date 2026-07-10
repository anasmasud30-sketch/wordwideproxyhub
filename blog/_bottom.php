<?php
/**
 * Central Blog — SITE FOOTER/CHROME (bottom half) for THIS website.
 * Closes the <main> content wrapper opened in _top.php, renders the site
 * footer (mirrors the homepage footer, self-contained navy palette), then
 * the end-of-body script(s) and closing tags.
 */
if (!isset($hh)) { $hh = fn($v) => htmlspecialchars((string) $v, ENT_QUOTES, 'UTF-8'); }
?>
</main>
<footer class="site-footer">
  <div class="footer-wrap">
    <div class="footer-grid">
      <div>
        <h4>Proxy Types</h4>
        <a href="/solutions/residential-proxy-services">Residential Proxies</a>
        <a href="/solutions/datacenter-proxy-services">Datacenter Proxies</a>
        <a href="/solutions/mobile-proxy-services">Mobile Proxies</a>
      </div>
      <div>
        <h4>Comparisons</h4>
        <a href="/compare">Compare Providers</a>
        <a href="/proxy-provider-analysis/cheapest-proxies-review">Cheapest Proxies Review</a>
        <a href="/proxy-library">SEO Library</a>
      </div>
      <div>
        <h4>Resources</h4>
        <a href="/guides">Guides</a>
        <a href="/glossary">Glossary</a>
        <a href="/faq">FAQ</a>
      </div>
      <div>
        <h4>Explore</h4>
        <a href="/proxy-locations">Proxies by Location</a>
        <a href="/vs">Provider Comparisons</a>
        <a href="/use-cases">Proxies by Use Case</a>
        <a href="/integrations">Proxy Integrations</a>
        <a href="/how-to">How-To Guides</a>
        <a href="/definitions">Proxy Glossary</a>
      </div>
      <div>
        <h4>Featured Provider</h4>
        <a href="https://cheapest-proxies.com/">Visit Cheapest Proxies</a>
        <a href="/providers">All Provider Reviews</a>
        <a href="/proxy-guides">Proxy Type Guides</a>
      </div>
    </div>
    <div class="fine-print">Independent proxy comparison content. Cheapest Proxies is always shown first on generated provider and comparison pages as the featured budget-friendly option.</div>
  </div>
</footer>
<div class="tmo-copyright">
  Copyright &copy; 2026 <a href="/">AffordableProxyHub</a> &mdash; Independent proxy comparison content.
</div>
<script src="/blog-nav.js" defer></script>
</body>
</html>
