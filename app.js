// The section rail. The page works without this file: the rail links still jump and the CSS fill
// still runs on a linear scroll timeline. With it, the rail marks the current section, the fill reaches each
// node exactly when its section arrives, and on phones a drag along the bar scrubs the page.
const rail = document.querySelector('.rail');
if (rail) {
  const links = [...rail.querySelectorAll('a[href^="#"]')];
  const targets = links.map((a) => document.getElementById(a.hash.slice(1)));
  const keyframes = document.head.appendChild(document.createElement('style'));
  const phone = matchMedia('(max-width: 1023px)');
  const last = links.length - 1;
  let anchors = [];
  let stops = [];
  let max = 1;
  let current = -1;

  const measure = () => {
    max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    let prev = 0;
    anchors = targets.map((t) => {
      const y = t.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(t).scrollMarginTop);
      return (prev = Math.min(max, Math.max(prev, y)));
    });
    stops = anchors.map((y, i) => (i === 0 ? 0 : i === last ? max : y));
    const frames = stops.map((y, i) => `${((y / max) * 100).toFixed(3)}% { --rail-p: ${i / last}; }`);
    keyframes.textContent = `@keyframes rail-fill { ${frames.join(' ')} }`;
    current = -1;
    update();
  };

  // a section is current once its top passes the upper third of the screen, so the marked node matches what you read
  const update = () => {
    let k = 0;
    anchors.forEach((y, i) => { if (y <= scrollY + innerHeight / 3) k = i; });
    if (scrollY >= max - 2) k = last;
    if (k === current) return;
    current = k;
    links.forEach((a, i) => (i === k ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current')));
    rail.querySelector('.rail__list').style.setProperty('--rail-at', k / last);
  };

  const scrub = (x) => {
    const a = links[0].getBoundingClientRect();
    const b = links[last].getBoundingClientRect();
    const x0 = a.left + a.width / 2;
    const x1 = b.left + b.width / 2;
    const f = Math.min(1, Math.max(0, (x - x0) / (x1 - x0))) * last;
    const i = Math.min(Math.floor(f), last - 1);
    scrollTo({ top: stops[i] + (f - i) * (stops[i + 1] - stops[i]), behavior: 'instant' });
  };

  let drag = null;
  let swallowClick = false;
  rail.addEventListener('pointerdown', (e) => {
    swallowClick = false;
    if (phone.matches && e.isPrimary) drag = { id: e.pointerId, x: e.clientX, on: false };
  });
  rail.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.on) {
      if (Math.abs(e.clientX - drag.x) < 10) return;
      drag.on = true;
      rail.setPointerCapture(e.pointerId);
      rail.classList.add('is-scrubbing');
    }
    scrub(e.clientX);
  });
  const end = () => {
    if (drag?.on) swallowClick = true;
    drag = null;
    rail.classList.remove('is-scrubbing');
  };
  rail.addEventListener('pointerup', end);
  rail.addEventListener('pointercancel', end);
  rail.addEventListener('click', (e) => {
    if (!swallowClick) return;
    swallowClick = false;
    e.preventDefault();
  }, true);

  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', measure);
  new ResizeObserver(measure).observe(document.body);
}
