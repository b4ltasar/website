document.querySelectorAll('.cards-marquee').forEach(m => {
  const pause = () => m.classList.add('is-paused');
  const play  = () => m.classList.remove('is-paused');

  m.addEventListener('pointerenter', pause);
  m.addEventListener('pointerleave', play);

  m.addEventListener('touchstart', pause, {passive:true});
  m.addEventListener('touchend',   play,  {passive:true});
  m.addEventListener('touchcancel',play,  {passive:true});
});
