(function () {
  "use strict";

  var root = document.documentElement;

  // Theme toggle: follows the system until the visitor picks one, then remembers it.
  var toggle = document.querySelector(".theme-toggle");
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set === "light" || set === "dark") return set;
    return media && media.matches ? "dark" : "light";
  }

  function labelToggle() {
    var next = currentTheme() === "dark" ? "light" : "dark";
    toggle.setAttribute("aria-label", "Switch to " + next + " theme");
    toggle.setAttribute("title", "Switch to " + next + " theme");
  }

  if (toggle) {
    labelToggle();
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      labelToggle();
    });
    if (media && media.addEventListener) media.addEventListener("change", labelToggle);
  }

  // Home page: highlight the nav link for the section being read.
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href*="#"]'));
  if (document.body.classList.contains("home") && "IntersectionObserver" in window && navLinks.length) {
    var linkFor = {};
    navLinks.forEach(function (a) {
      linkFor[a.hash.slice(1)] = a;
    });

    var setCurrent = function (link) {
      navLinks.forEach(function (a) {
        if (a !== link) a.removeAttribute("aria-current");
      });
      if (link) link.setAttribute("aria-current", "true");
    };

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          if (id === "about") setCurrent(null);
          else if (linkFor[id]) setCurrent(linkFor[id]);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    Array.prototype.forEach.call(document.querySelectorAll("main section[id]"), function (section) {
      observer.observe(section);
    });
  }

  // Contact: copy the email address.
  var copyButton = document.querySelector(".copy-email");
  if (copyButton) {
    var copyLabel = copyButton.querySelector("span");
    copyButton.addEventListener("click", function () {
      var email = copyButton.getAttribute("data-email");
      var reset = function () {
        copyLabel.textContent = "Copy email";
      };
      var show = function (text) {
        copyLabel.textContent = text;
        window.setTimeout(reset, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(
          function () {
            show("Copied");
          },
          function () {
            show(email);
          }
        );
      } else {
        show(email);
      }
    });
  }

  // Projects page: filter cards by area. The hash (#cloud, #ai, ...) selects a filter on load.
  var filters = Array.prototype.slice.call(document.querySelectorAll(".filter"));
  var cards = Array.prototype.slice.call(document.querySelectorAll(".project"));
  var resultCount = document.querySelector(".result-count");

  function applyFilter(key, updateHash) {
    var active = null;
    filters.forEach(function (button) {
      if (button.getAttribute("data-filter") === key) active = button;
    });
    if (!active) {
      key = "all";
      active = filters[0];
    }

    var shown = 0;
    cards.forEach(function (card) {
      var categories = (card.getAttribute("data-categories") || "").split(" ");
      var visible = key === "all" || categories.indexOf(key) !== -1;
      card.hidden = !visible;
      if (visible) shown += 1;
    });

    filters.forEach(function (button) {
      button.setAttribute("aria-pressed", button === active ? "true" : "false");
    });

    if (resultCount) {
      var name = active.querySelector("span").textContent;
      resultCount.textContent =
        key === "all"
          ? "Showing all " + shown + " projects"
          : "Showing " + shown + " " + name + " project" + (shown === 1 ? "" : "s");
    }

    if (updateHash && window.history && window.history.replaceState) {
      window.history.replaceState(null, "", key === "all" ? window.location.pathname : "#" + key);
    }
  }

  if (filters.length) {
    filters.forEach(function (button) {
      button.addEventListener("click", function () {
        applyFilter(button.getAttribute("data-filter"), true);
      });
    });

    var hash = window.location.hash.slice(1);
    var target = hash ? document.getElementById(hash) : null;
    if (hash && !(target && target.classList.contains("project"))) applyFilter(hash, false);
  }
})();
