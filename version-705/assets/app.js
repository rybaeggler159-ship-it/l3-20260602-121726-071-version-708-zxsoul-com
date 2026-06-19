(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var navToggle = document.querySelector("[data-nav-toggle]");
    var navPanel = document.querySelector("[data-nav-panel]");
    if (navToggle && navPanel) {
      navToggle.addEventListener("click", function () {
        navPanel.classList.toggle("is-open");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
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
        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === index);
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5000);
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          show(i);
          restart();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          restart();
        });
      }

      show(0);
      restart();
    }

    var filterPanel = document.querySelector("[data-filter-panel]");
    var cardList = document.querySelector("[data-card-list]");
    if (filterPanel && cardList) {
      var filterInput = filterPanel.querySelector("[data-filter-input]");
      var filterYear = filterPanel.querySelector("[data-filter-year]");
      var cards = Array.prototype.slice.call(cardList.querySelectorAll(".movie-card"));

      function applyFilter() {
        var q = filterInput ? filterInput.value.trim().toLowerCase() : "";
        var year = filterYear ? filterYear.value : "";
        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title") || "",
            card.getAttribute("data-region") || "",
            card.getAttribute("data-genre") || ""
          ].join(" ").toLowerCase();
          var matchesText = !q || haystack.indexOf(q) !== -1;
          var matchesYear = !year || card.getAttribute("data-year") === year;
          card.classList.toggle("is-filtered-out", !(matchesText && matchesYear));
        });
      }

      if (filterInput) {
        filterInput.addEventListener("input", applyFilter);
      }
      if (filterYear) {
        filterYear.addEventListener("change", applyFilter);
      }
      applyFilter();
    }

    var searchForm = document.querySelector("[data-search-form]");
    var searchInput = document.querySelector("[data-search-input]");
    var searchResults = document.querySelector("[data-search-results]");
    if (searchForm && searchInput && searchResults && window.SEARCH_MOVIES) {
      var params = new URLSearchParams(window.location.search);
      searchInput.value = params.get("q") || "";

      function escapeHtml(value) {
        return String(value).replace(/[&<>\"']/g, function (character) {
          return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quot;",
            "'": "&#39;"
          }[character];
        });
      }

      function card(movie) {
        var title = escapeHtml(movie.title);
        var region = escapeHtml(movie.region);
        var type = escapeHtml(movie.type);
        var oneLine = escapeHtml(movie.oneLine);
        return [
          "<a class=\"movie-card\" href=\"./" + movie.file + "\">",
          "<span class=\"poster-wrap\"><img src=\"" + movie.cover + "\" alt=\"" + title + "\" loading=\"lazy\"><span class=\"year-pill\">" + movie.year + "</span></span>",
          "<span class=\"card-copy\"><strong>" + title + "</strong><span class=\"tag-line\"><span>" + region + "</span><span>" + type + "</span></span><em>" + oneLine + "</em></span>",
          "</a>"
        ].join("");
      }

      function render() {
        var q = searchInput.value.trim().toLowerCase();
        var pool = window.SEARCH_MOVIES;
        var list = q ? pool.filter(function (movie) {
          return [movie.title, movie.region, movie.type, movie.genre, movie.tags, movie.oneLine].join(" ").toLowerCase().indexOf(q) !== -1;
        }) : pool.slice(0, 40);
        searchResults.innerHTML = list.slice(0, 120).map(card).join("");
      }

      searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var q = searchInput.value.trim();
        var next = q ? "./search.html?q=" + encodeURIComponent(q) : "./search.html";
        window.history.replaceState(null, "", next);
        render();
      });

      searchInput.addEventListener("input", render);
      render();
    }
  });
})();
