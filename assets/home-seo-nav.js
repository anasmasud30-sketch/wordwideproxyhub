(function () {
  function closeOtherTabs(current) {
    document.querySelectorAll(".aph-home-tab[open], .aph-home-nav-tab[open]").forEach(function (tab) {
      if (tab !== current) tab.removeAttribute("open");
    });
  }

  function wireTabs(root) {
    root.querySelectorAll(".aph-home-tab, .aph-home-nav-tab").forEach(function (tab) {
      tab.addEventListener("toggle", function () {
        if (tab.open) closeOtherTabs(tab);
      });
    });
  }

  function buildInjectedTabs(groups) {
    var wrapper = document.createElement("div");
    wrapper.className = "aph-home-nav-tabs-injected";
    wrapper.setAttribute("aria-label", "Generated SEO page header tabs");
    wrapper.innerHTML = groups
      .map(function (group) {
        return [
          '<details class="aph-home-nav-tab">',
          "<summary>" + group.label + " <span>" + group.items.length + "</span></summary>",
          '<div class="aph-home-nav-panel">',
          '<div class="aph-home-panel-head"><strong>' + group.label + '</strong><a href="' + group.href + '">Open hub</a></div>',
          '<div class="aph-home-panel-links">',
          group.items
            .map(function (item) {
              return '<a href="' + item.href + '">' + item.title + "</a>";
            })
            .join(""),
          "</div></div></details>"
        ].join("");
      })
      .join("");
    return wrapper;
  }

  function injectIntoExistingHeader(groups) {
    var existing = document.querySelector("[data-aph-injected-nav='true']");
    if (existing) return true;

    var header = document.querySelector("#root header");
    if (!header) return false;

    var nav = document.createElement("nav");
    nav.className = "aph-home-existing-header-tabs";
    nav.dataset.aphInjectedNav = "true";
    nav.appendChild(buildInjectedTabs(groups));
    header.appendChild(nav);
    wireTabs(nav);
    return true;
  }

  function readGroups() {
    var node = document.getElementById("aph-seo-nav-data");
    if (!node) return [];
    try {
      return JSON.parse(node.textContent || "[]");
    } catch (error) {
      return [];
    }
  }

  function start() {
    var groups = readGroups();
    if (!groups.length) return;
    wireTabs(document);

    var attempts = 0;
    var timer = window.setInterval(function () {
      attempts += 1;
      if (injectIntoExistingHeader(groups) || attempts > 40) {
        window.clearInterval(timer);
      }
    }, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
