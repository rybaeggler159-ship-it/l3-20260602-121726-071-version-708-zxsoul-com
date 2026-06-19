(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');
    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var current = 0;
    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('active', i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === current);
        });
    }
    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            showSlide(i);
        });
    });
    if (slides.length > 1) {
        setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var searchInput = document.querySelector('[data-filter-input]');
    var yearSelect = document.querySelector('[data-filter-year]');
    var typeSelect = document.querySelector('[data-filter-type]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
    var emptyTip = document.querySelector('.empty-tip');
    function filterCards() {
        if (!cards.length) {
            return;
        }
        var q = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var year = yearSelect ? yearSelect.value : '';
        var type = typeSelect ? typeSelect.value : '';
        var visible = 0;
        cards.forEach(function (card) {
            var text = [
                card.getAttribute('data-title') || '',
                card.getAttribute('data-region') || '',
                card.getAttribute('data-type') || '',
                card.getAttribute('data-genre') || ''
            ].join(' ').toLowerCase();
            var ok = (!q || text.indexOf(q) !== -1) && (!year || card.getAttribute('data-year') === year) && (!type || card.getAttribute('data-type') === type);
            card.style.display = ok ? '' : 'none';
            if (ok) {
                visible += 1;
            }
        });
        if (emptyTip) {
            emptyTip.style.display = visible ? 'none' : 'block';
        }
    }
    if (searchInput) {
        searchInput.addEventListener('input', filterCards);
    }
    if (yearSelect) {
        yearSelect.addEventListener('change', filterCards);
    }
    if (typeSelect) {
        typeSelect.addEventListener('change', filterCards);
    }
    var query = new URLSearchParams(window.location.search).get('q');
    if (query && searchInput) {
        searchInput.value = query;
        filterCards();
    }
}());

function initMoviePlayer(url, videoId, coverId, buttonId) {
    var video = document.getElementById(videoId);
    var cover = document.getElementById(coverId);
    var button = document.getElementById(buttonId);
    if (!video || !url) {
        return;
    }
    var loaded = false;
    function loadVideo() {
        if (loaded) {
            return;
        }
        loaded = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
        } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
        } else {
            video.src = url;
        }
    }
    function start() {
        loadVideo();
        if (cover) {
            cover.classList.add('hidden');
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {});
        }
    }
    if (cover) {
        cover.addEventListener('click', start);
    }
    if (button) {
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            start();
        });
    }
    video.addEventListener('click', function () {
        if (video.paused) {
            start();
        }
    });
}
