(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function initMenu() {
    var button = document.querySelector('[data-menu-button]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (!slides.length || !dots.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
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
        timer = null;
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', start);
    }
    start();
  }

  function initSearch() {
    var input = document.querySelector('[data-search-input]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]'));
    var empty = document.querySelector('[data-empty-state]');
    if (!input || !cards.length) {
      return;
    }
    var filter = 'all';

    function apply() {
      var query = input.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre')
        ].join(' ').toLowerCase();
        var inFilter = filter === 'all' || haystack.indexOf(filter.toLowerCase()) !== -1;
        var inQuery = !query || haystack.indexOf(query) !== -1;
        var ok = inFilter && inQuery;
        card.style.display = ok ? '' : 'none';
        if (ok) {
          shown += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', shown === 0);
      }
    }

    input.addEventListener('input', apply);
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (item) {
          item.classList.remove('active');
        });
        chip.classList.add('active');
        filter = chip.getAttribute('data-filter-value') || 'all';
        apply();
      });
    });
  }

  window.initPlayer = function (options) {
    ready(function () {
      var video = document.getElementById(options.videoId);
      var button = document.getElementById(options.buttonId);
      var cover = document.getElementById(options.overlayId);
      var started = false;
      var hlsInstance = null;
      if (!video) {
        return;
      }

      function begin() {
        if (cover) {
          cover.classList.add('is-hidden');
        }
        video.setAttribute('controls', 'controls');
        if (!started) {
          if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = options.src;
          } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
              enableWorker: true,
              lowLatencyMode: false
            });
            hlsInstance.loadSource(options.src);
            hlsInstance.attachMedia(video);
          } else {
            video.src = options.src;
          }
          started = true;
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {});
        }
      }

      if (button) {
        button.addEventListener('click', begin);
      }
      if (cover) {
        cover.addEventListener('click', begin);
      }
      video.addEventListener('click', function () {
        if (!started || video.paused) {
          begin();
        }
      });
      window.addEventListener('pagehide', function () {
        if (hlsInstance && typeof hlsInstance.destroy === 'function') {
          hlsInstance.destroy();
        }
      });
    });
  };

  ready(function () {
    initMenu();
    initHero();
    initSearch();
  });
})();
