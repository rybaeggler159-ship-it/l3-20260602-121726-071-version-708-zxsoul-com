(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var button = document.querySelector('.menu-button');
    var nav = document.querySelector('.mobile-nav');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  function setupHero() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function start() {
      if (slides.length <= 1) {
        return;
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(i);
        start();
      });
    });

    show(0);
    start();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll('.filter-panel'));
    panels.forEach(function (panel) {
      var input = panel.querySelector('.catalog-search');
      var select = panel.querySelector('.catalog-filter');
      var scope = panel.parentElement ? panel.parentElement.querySelector('.filter-scope') : null;
      if (!scope) {
        return;
      }
      var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));

      function apply() {
        var query = normalize(input ? input.value : '');
        var category = normalize(select ? select.value : '');
        cards.forEach(function (card) {
          var text = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-tags'),
            card.getAttribute('data-category'),
            card.getAttribute('data-year')
          ].join(' '));
          var cardCategory = normalize(card.getAttribute('data-category'));
          var matchedQuery = !query || text.indexOf(query) !== -1;
          var matchedCategory = !category || cardCategory === category;
          card.classList.toggle('is-filtered-out', !(matchedQuery && matchedCategory));
        });
      }

      if (input) {
        input.addEventListener('input', apply);
      }
      if (select) {
        select.addEventListener('change', apply);
      }
    });
  }

  window.initVideoPlayer = function (sourceUrl) {
    var video = document.getElementById('movie-video');
    var overlay = document.getElementById('play-overlay');
    if (!video || !sourceUrl) {
      return;
    }

    var attached = false;
    var hlsInstance = null;

    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 60
        });
        hlsInstance.loadSource(sourceUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = sourceUrl;
      }
    }

    function reveal() {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    }

    function play() {
      attach();
      reveal();
      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', reveal);
    video.addEventListener('ended', function () {
      if (overlay) {
        overlay.classList.remove('is-hidden');
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
      }
    });
  };

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
}());
