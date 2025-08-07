// intro.js - drop-in onboarding that injects its own CSS and requires no HTML changes
(function(){
  const css = `
  .sotd-highlight-glow {
    box-shadow: 0 0 20px rgba(222,184,135,.9) !important;
    border-color: rgba(222,184,135,.85) !important;
  }
  .sotd-highlight-ring {
    outline: 2px solid rgba(222,184,135,.6);
    outline-offset: 8px;
    border-radius: 12px;
    transition: outline-color .25s ease;
  }
  .sotd-overlay-label {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    pointer-events: none;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem;
    color: rgba(255,255,255,.85);
    text-shadow: 0 6px 18px rgba(0,0,0,.55);
    opacity: 0;
    transition: opacity .35s ease;
  }
  .sotd-overlay-label.sotd-show { opacity: 1; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function highlight(selector, opts = {}) {
    const el = document.querySelector(selector);
    if (!el) return () => {};
    if (opts.ring) el.classList.add('sotd-highlight-ring');
    else el.classList.add('sotd-highlight-glow');
    return () => el && el.classList.remove('sotd-highlight-ring','sotd-highlight-glow');
  }

  function showOverlayLabel(selector, text) {
    const host = document.querySelector(selector);
    if (!host) return () => {};
    if (getComputedStyle(host).position === 'static') {
      host.setAttribute('data-sotd-pos-static','');
      host.style.position = 'relative';
    }
    const label = document.createElement('div');
    label.className = 'sotd-overlay-label';
    label.textContent = text;
    host.appendChild(label);
    requestAnimationFrame(()=>label.classList.add('sotd-show'));
    return () => {
      label.classList.remove('sotd-show');
      setTimeout(()=>label.remove(), 350);
      if (host.hasAttribute('data-sotd-pos-static')) {
        host.style.position = '';
        host.removeAttribute('data-sotd-pos-static');
      }
    };
  }

  function runIntroSequence() {
    const log = document.getElementById('log');
    const headers = document.querySelectorAll('.section-header');
    headers.forEach(h => h.classList.add('hidden'));

    const steps = [
      { text: "Welcome to the game!", effect: () => () => {} },
      { text: "Play cards in your hand to gain Focus and movement.",
        effect: () => { const off1 = highlight('#player-hand',{ring:true}); const off2 = showOverlayLabel('#player-hand','Your Hand'); return ()=>{off1();off2();}; } },
      { text: "Buy new cards from the market to grow your deck.",
        effect: () => { const off1 = highlight('#market',{ring:true}); const off2 = showOverlayLabel('#market','Market'); return ()=>{off1();off2();}; } },
      { text: "Find five fragments on the Dream Map.",
        effect: () => { const off1 = highlight('#frags'); const off2 = highlight('#map',{ring:true}); const off3 = showOverlayLabel('#map','Dream Map'); return ()=>{off1();off2();off3();}; } },
      { text: "Do it before the Cruxflare runs out of cards.",
        effect: () => highlight('#crux-remaining') }
    ];

    let i = 0, cleanup = () => {};
    const tick = () => {
      cleanup();
      if (i >= steps.length) {
        headers.forEach(h => h.classList.remove('hidden'));
        if (log) log.textContent = "Good hunting.";
        return;
      }
      const s = steps[i++];
      if (log) log.textContent = s.text;
      cleanup = s.effect?.() || (()=>{});
      setTimeout(tick, 2800);
    };
    tick();
  }

  window.addEventListener('load', () => setTimeout(runIntroSequence, 150));
})();