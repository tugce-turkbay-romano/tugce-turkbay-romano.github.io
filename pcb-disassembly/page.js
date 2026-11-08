/* Page-only behaviour: the evidence stamp (signature move) and the day-log loops. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // ---- evidence stamp ---------------------------------------------------
  var stamp = document.querySelector('.stamp');
  var tEl = stamp.querySelector('.stamp__time');
  var fEl = stamp.querySelector('.stamp__file');
  var items = Array.prototype.map.call(document.querySelectorAll('[data-rec]'), function (el) {
    var m = el.getAttribute('data-rec').match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)/);
    return {
      el: el,
      base: (+m[4]) * 3600 + (+m[5]) * 60 + (+m[6]),
      date: (+m[3]) + ' ' + MONTHS[+m[2] - 1] + ' ' + m[1],
      file: el.getAttribute('data-file'),
      video: el.hasAttribute('data-rec-video') ? el.querySelector('video') : null
    };
  });
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  var last = '';
  function tick() {
    var vw = innerWidth, vh = innerHeight, best = null, bestD = Infinity;
    for (var i = 0; i < items.length; i++) {
      var r = items[i].el.getBoundingClientRect();
      if (r.width === 0) continue;
      var ix = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0));
      var iy = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
      if (ix * iy < 0.35 * Math.min(r.width * r.height, vw * vh)) continue;
      var dx = (r.left + r.right) / 2 - vw / 2, dy = (r.top + r.bottom) / 2 - vh / 2;
      var d = dx * dx + dy * dy;
      if (d < bestD) { bestD = d; best = items[i]; }
    }
    if (!best) {
      if (last !== '') { stamp.classList.remove('on'); last = ''; }
    } else {
      var s = best.base + Math.floor(best.video && best.video.readyState > 0 ? best.video.currentTime : 0);
      var txt = best.date + '  ' + pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s / 60) % 60) + ':' + pad(s % 60);
      var key = txt + best.file;
      if (key !== last) {
        tEl.textContent = txt;
        fEl.textContent = best.file;
        stamp.classList.add('on');
        last = key;
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // ---- day-log loops: load and play only while on screen -----------------
  var loops = document.querySelectorAll('video[data-loop]');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (!v.src) v.src = v.getAttribute('data-src');
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else if (!v.paused) v.pause();
      });
    }, { rootMargin: '0px 200px 0px 200px' });
    Array.prototype.forEach.call(loops, function (v) { io.observe(v); });
  }
})();
