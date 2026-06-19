function startMoviePlayer(source) {
  var video = document.getElementById("movie-video");
  var overlay = document.getElementById("play-overlay");
  var hls = null;
  var loaded = false;

  function attach() {
    if (loaded || !video || !source) {
      return;
    }
    loaded = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({ enableWorker: true });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }
  }

  function play() {
    attach();
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
    video.controls = true;
    var action = video.play();
    if (action && typeof action.catch === "function") {
      action.catch(function () {});
    }
  }

  if (overlay) {
    overlay.addEventListener("click", play);
  }

  if (video) {
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });
  }

  window.addEventListener("pagehide", function () {
    if (hls) {
      hls.destroy();
    }
  });
}
