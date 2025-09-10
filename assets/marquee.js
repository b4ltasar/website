(function () {
  const track = document.getElementById('cardsTrack');
  if (!track) return;

  let x = 0;
  let speed = 0.35;      // px pr. frame (~ 21px/s ved 60fps) – justér efter smag
  let paused = false;

  // Auto scroll via RAF
  function loop() {
    if (!paused) {
      x -= speed;
      // reset cirka halv længde (fordi vi duplikerede items én gang)
      const half = track.scrollWidth / 2;
      if (-x >= half) x += half;
      track.style.setProperty('--x', x + 'px');
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // Pause ved hover
  const marquee = track.closest('.cards-marquee');
  if (marquee) {
    marquee.addEventListener('mouseenter', () => paused = true);
    marquee.addEventListener('mouseleave', () => paused = false);
  }

  // Drag / swipe for manuel scroll
  let dragging = false, startX = 0, startOffset = 0;

  function onDown(e) {
    dragging = true;
    paused = true;
    startX = (e.touches ? e.touches[0].clientX : e.clientX);
    startOffset = x;
  }
  function onMove(e) {
    if (!dragging) return;
    const clientX = (e.touches ? e.touches[0].clientX : e.clientX);
    const dx = clientX - startX;
    x = startOffset + dx;
    track.style.setProperty('--x', x + 'px');
  }
  function onUp() {
    if (!dragging) return;
    dragging = false;
    paused = false;
  }

  track.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);

  track.addEventListener('touchstart', onDown, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onUp);
})();
