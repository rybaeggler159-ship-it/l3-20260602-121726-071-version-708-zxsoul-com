(function() {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();
    var input = document.getElementById('searchInput');
    var result = document.getElementById('searchResult');

    if (input) {
        input.value = query;
    }

    function normalize(text) {
        return String(text || '').toLowerCase();
    }

    function renderCard(movie) {
        var tags = (movie.tags || []).slice(0, 3).map(function(tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');
        return '<article class="movie-card">' +
            '<a class="poster-link" href="' + movie.file + '">' +
            '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
            '<span class="poster-shade"></span><span class="play-dot">▶</span></a>' +
            '<div class="movie-info"><a class="movie-title" href="' + movie.file + '">' + escapeHtml(movie.title) + '</a>' +
            '<p>' + escapeHtml(movie.one) + '</p>' +
            '<div class="meta-line"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.type) + '</span></div>' +
            '<div class="tag-row">' + tags + '</div></div></article>';
    }

    function escapeHtml(text) {
        return String(text || '').replace(/[&<>"']/g, function(ch) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[ch];
        });
    }

    if (!result || !window.MOVIES) {
        return;
    }

    var words = normalize(query).split(/\s+/).filter(Boolean);
    var list = window.MOVIES.filter(function(movie) {
        if (!words.length) {
            return true;
        }
        var haystack = normalize([
            movie.title,
            movie.region,
            movie.type,
            movie.year,
            movie.genre,
            (movie.tags || []).join(' '),
            movie.one
        ].join(' '));
        return words.every(function(word) {
            return haystack.indexOf(word) > -1;
        });
    }).slice(0, 120);

    result.innerHTML = list.map(renderCard).join('');
}());
