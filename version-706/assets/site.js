(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var current = 0;

    var showSlide = function (index) {
      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5600);
    }
  }

  var filterInputs = Array.prototype.slice.call(document.querySelectorAll('[data-filter-target]'));

  filterInputs.forEach(function (input) {
    var target = document.querySelector(input.getAttribute('data-filter-target'));

    if (!target) {
      return;
    }

    var cards = Array.prototype.slice.call(target.querySelectorAll('.movie-card'));

    input.addEventListener('input', function () {
      var query = input.value.trim().toLowerCase();

      cards.forEach(function (card) {
        var haystack = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
        card.classList.toggle('is-filtered-out', query && haystack.indexOf(query) === -1);
      });
    });
  });

  var searchResults = document.getElementById('searchResults');
  var searchTitle = document.getElementById('searchTitle');
  var searchPageInput = document.getElementById('searchPageInput');

  if (searchResults && Array.isArray(window.SITE_SEARCH_DATA)) {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();

    if (searchPageInput && query) {
      searchPageInput.value = query;
    }

    if (query) {
      var normalized = query.toLowerCase();
      var matches = window.SITE_SEARCH_DATA.filter(function (item) {
        return item.k.toLowerCase().indexOf(normalized) !== -1;
      }).slice(0, 120);

      if (searchTitle) {
        searchTitle.textContent = '搜索结果：' + query + '（' + matches.length + '）';
      }

      searchResults.innerHTML = matches.map(function (item) {
        return [
          '<article class="movie-card" data-search="' + escapeHtml(item.k) + '">',
          '<a class="movie-cover" href="./' + item.u + '" aria-label="' + escapeHtml(item.t) + '">',
          '<img src="' + item.c + '" alt="' + escapeHtml(item.t) + '" loading="lazy">',
          '<span class="cover-shade"></span>',
          '</a>',
          '<div class="movie-info">',
          '<div class="movie-meta"><a href="./category-' + item.s + '.html">' + escapeHtml(item.g) + '</a><span>' + item.y + '年</span></div>',
          '<h2><a href="./' + item.u + '">' + escapeHtml(item.t) + '</a></h2>',
          '<p>' + escapeHtml(item.o) + '</p>',
          '<div class="tag-row"><span>' + escapeHtml(item.r) + '</span><span>' + escapeHtml(item.m) + '</span></div>',
          '</div>',
          '</article>'
        ].join('');
      }).join('') || '<div class="content-card"><h2>未找到匹配影片</h2><p>请尝试输入其他标题、地区、年份或类型关键词。</p></div>';
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}());

function initVideoPlayer(source) {
  var video = document.getElementById('videoPlayer');
  var button = document.getElementById('playButton');
  var attached = false;
  var hls = null;

  if (!video || !button || !source) {
    return;
  }

  var attach = function () {
    if (attached) {
      return;
    }

    attached = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }

    video.controls = true;
  };

  var start = function () {
    attach();
    button.classList.add('is-hidden');
    var promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        button.classList.remove('is-hidden');
      });
    }
  };

  button.addEventListener('click', start);
  video.addEventListener('click', function () {
    if (video.paused) {
      start();
    }
  });
  video.addEventListener('play', function () {
    button.classList.add('is-hidden');
  });
  video.addEventListener('pause', function () {
    if (!video.ended) {
      button.classList.remove('is-hidden');
    }
  });
  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
}
