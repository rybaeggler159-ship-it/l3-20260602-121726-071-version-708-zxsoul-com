(function() {
    var menuButton = document.querySelector('.menu-toggle');
    var mobilePanel = document.querySelector('.mobile-panel');
    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function() {
            mobilePanel.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var active = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        active = (index + slides.length) % slides.length;
        slides.forEach(function(slide, i) {
            slide.classList.toggle('is-active', i === active);
        });
        dots.forEach(function(dot, i) {
            dot.classList.toggle('is-active', i === active);
        });
    }

    dots.forEach(function(dot, i) {
        dot.addEventListener('click', function() {
            showSlide(i);
        });
    });

    if (slides.length > 1) {
        setInterval(function() {
            showSlide(active + 1);
        }, 5200);
    }

    var filterInput = document.querySelector('.local-filter');
    var filterCards = Array.prototype.slice.call(document.querySelectorAll('.filter-list .movie-card'));
    if (filterInput && filterCards.length) {
        filterInput.addEventListener('input', function() {
            var term = filterInput.value.trim().toLowerCase();
            filterCards.forEach(function(card) {
                var text = [
                    card.getAttribute('data-title') || '',
                    card.getAttribute('data-region') || '',
                    card.getAttribute('data-tags') || '',
                    card.textContent || ''
                ].join(' ').toLowerCase();
                card.style.display = text.indexOf(term) > -1 ? '' : 'none';
            });
        });
    }
}());
