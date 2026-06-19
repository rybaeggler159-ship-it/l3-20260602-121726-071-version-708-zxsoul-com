(function () {
  function initVideoPlayer(source) {
    var video = document.getElementById("movie-player");
    var cover = document.getElementById("play-cover");
    var hls = null;
    var started = false;

    if (!video || !source) {
      return;
    }

    function playVideo() {
      var result = video.play();

      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    }

    function hideCover() {
      if (cover) {
        cover.classList.add("is-hidden");
        cover.setAttribute("aria-hidden", "true");
      }
    }

    function start() {
      hideCover();

      if (started) {
        playVideo();
        return;
      }

      started = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        video.addEventListener("loadedmetadata", playVideo, { once: true });
        playVideo();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
        return;
      }

      video.src = source;
      video.addEventListener("canplay", playVideo, { once: true });
      playVideo();
    }

    if (cover) {
      cover.addEventListener("click", start);
    }

    video.addEventListener("click", function () {
      if (!started) {
        start();
      }
    });

    video.addEventListener("play", hideCover);

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  }

  window.initVideoPlayer = initVideoPlayer;
})();
