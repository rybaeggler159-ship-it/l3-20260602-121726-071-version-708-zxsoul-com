(function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("[data-hero]").forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  });

  document.querySelectorAll("[data-filter-form]").forEach(function (form) {
    var root = form.parentElement;
    var scope = root ? root.querySelector("[data-filter-scope]") : null;
    var cards = scope ? Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]")) : [];
    var search = form.querySelector("[data-filter-search]");
    var year = form.querySelector("[data-filter-year]");
    var type = form.querySelector("[data-filter-type]");
    var empty = root ? root.querySelector("[data-empty-state]") : null;

    function valueOf(input) {
      return input ? input.value.trim().toLowerCase() : "";
    }

    function update() {
      var query = valueOf(search);
      var selectedYear = valueOf(year);
      var selectedType = valueOf(type);
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-region") || "",
          card.getAttribute("data-type") || "",
          card.getAttribute("data-genre") || ""
        ].join(" ").toLowerCase();
        var cardYear = (card.getAttribute("data-year") || "").toLowerCase();
        var cardType = (card.getAttribute("data-type") || "").toLowerCase();
        var matched = true;

        if (query && haystack.indexOf(query) === -1) {
          matched = false;
        }

        if (selectedYear && cardYear !== selectedYear) {
          matched = false;
        }

        if (selectedType && cardType !== selectedType) {
          matched = false;
        }

        card.hidden = !matched;

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    [search, year, type].forEach(function (input) {
      if (input) {
        input.addEventListener("input", update);
        input.addEventListener("change", update);
      }
    });
  });
})();
