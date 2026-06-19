import { H as Hls } from './hls-dru42stk.js';

function initializePlayer(shell) {
  var video = shell.querySelector('video');
  var button = shell.querySelector('[data-play-button]');
  var source = shell.dataset.source;
  var initialized = false;

  function bindSource() {
    if (initialized || !video || !source) {
      return;
    }
    initialized = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }

    if (Hls && Hls.isSupported()) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return;
    }

    video.src = source;
  }

  function startPlayback() {
    bindSource();
    shell.classList.add('is-playing');
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        shell.classList.remove('is-playing');
      });
    }
  }

  if (button) {
    button.addEventListener('click', startPlayback);
  }

  if (video) {
    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
    });
    video.addEventListener('pause', function () {
      shell.classList.remove('is-playing');
    });
    video.addEventListener('click', function () {
      bindSource();
    });
  }
}

document.querySelectorAll('[data-hls-player]').forEach(initializePlayer);
