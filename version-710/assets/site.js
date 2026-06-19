(function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      img.classList.add('image-missing');
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var activeSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === activeSlide);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === activeSlide);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showSlide(i);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-filter-search]');
  var yearSelect = document.querySelector('[data-filter-year]');
  var typeSelect = document.querySelector('[data-filter-type]');
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-movie-item]'));
  var empty = document.querySelector('[data-empty-state]');

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilters() {
    if (!items.length) {
      return;
    }
    var keyword = normalize(searchInput && searchInput.value);
    var year = normalize(yearSelect && yearSelect.value);
    var type = normalize(typeSelect && typeSelect.value);
    var visibleCount = 0;

    items.forEach(function (item) {
      var text = normalize([
        item.dataset.title,
        item.dataset.genre,
        item.dataset.tags,
        item.dataset.region,
        item.dataset.type
      ].join(' '));
      var itemYear = normalize(item.dataset.year);
      var itemType = normalize(item.dataset.type);
      var matched = true;

      if (keyword && text.indexOf(keyword) === -1) {
        matched = false;
      }
      if (year && itemYear !== year) {
        matched = false;
      }
      if (type && itemType.indexOf(type) === -1) {
        matched = false;
      }

      item.style.display = matched ? '' : 'none';
      if (matched) {
        visibleCount += 1;
      }
    });

    if (empty) {
      empty.style.display = visibleCount ? 'none' : 'block';
    }
  }

  [searchInput, yearSelect, typeSelect].forEach(function (control) {
    if (control) {
      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    }
  });
})();
