/* ART MORINA ENTERPRISES™ — the code that runs the empire */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode: the empire forgets */ }
    },
  };

  /* ───── Toast + big banner ───── */
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
  }
  const bannerEl = $('#bigBanner');
  function banner(text) {
    bannerEl.textContent = text;
    bannerEl.classList.remove('show');
    void bannerEl.offsetWidth; // restart animation
    bannerEl.classList.add('show');
  }
  document.querySelectorAll('[data-toast]').forEach(b => b.addEventListener('click', () => toast(b.dataset.toast)));

  /* ───── Sound: a synthesized "bawk" ───── */
  let audio;
  function ctx() {
    if (!audio) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audio = new AC();
    }
    if (audio.state === 'suspended') audio.resume();
    return audio;
  }
  function bawk() {
    const ac = ctx();
    if (!ac) return;
    const t = ac.currentTime;
    [0, 0.16].forEach((off, i) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(i ? 700 : 950, t + off);
      o.frequency.exponentialRampToValueAtTime(i ? 380 : 520, t + off + 0.13);
      g.gain.setValueAtTime(0.0001, t + off);
      g.gain.exponentialRampToValueAtTime(0.12, t + off + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + off + 0.14);
      o.connect(g).connect(ac.destination);
      o.start(t + off);
      o.stop(t + off + 0.15);
    });
  }

  /* ───── Loader ───── */
  const loader = $('#loader');
  const loaderMsgs = ['Loading 11 herbs & spices…', 'Adding the 12th spice (aura)…', 'Polishing the crown…',
    'Calibrating The Hand Sign™…', 'Booting localhost:6767…', 'Mirë se vini! Welcome, peasant.'];
  let li = 0;
  const loaderTick = setInterval(() => { $('#loaderMsg').textContent = loaderMsgs[++li % loaderMsgs.length]; }, 420);
  function hideLoader() { clearInterval(loaderTick); loader.classList.add('done'); }
  setTimeout(hideLoader, reduceMotion ? 300 : 2500);
  loader.addEventListener('click', hideLoader);

  /* ───── Hero ───── */
  $('#hostLabel').textContent = location.host ? `${location.protocol}//${location.host}` : 'http://localhost:6767';

  const kfcMeanings = ['Kentucky Fried Chicken', 'King of Fried Chicken', 'Keeps Fingers Crispy', 'Kinda Feeling Cringe',
    "Krispy Fella's Castle", 'Kosmic Fried Champion', 'Knows Freaky Chickens', 'Kid From Class'];
  let km = 0;
  const kfcEl = $('#kfcMeans');
  setInterval(() => {
    kfcEl.classList.add('swap');
    setTimeout(() => { kfcEl.textContent = kfcMeanings[++km % kfcMeanings.length]; kfcEl.classList.remove('swap'); }, 250);
  }, 2000);

  const quotes = [
    "I don't chase the bag. I chase the bucket.",
    "They said I couldn't own KFC. So I simply said I do.",
    "Eleven herbs and spices? I added a twelfth. It's called aura.",
    "A real CEO never reveals the secret recipe. Mostly because I forgot it.",
    "I am not just the owner. I am also the local host.",
    "My hand sign is trademarked. Please do not do it without a license.",
    "Sigma rule number one: always say finger lickin' with your chest.",
    "The secret ingredient is me.",
    "I put the K in KFC. I also put the F and the C.",
    "Some people have a five year plan. I have a five piece plan.",
    "Rise and grind. Mostly grind. The pepper, I mean.",
    "Never let anyone tell you what you don't own.",
  ];
  const bubble = $('#quoteBubble');
  function sayQuote() {
    const q = pick(quotes);
    bubble.textContent = `"${q}" — Art`;
    bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop');
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(q);
      u.pitch = 0.4; u.rate = 0.85; // deep CEO voice
      speechSynthesis.speak(u);
    }
  }
  $('#speakBtn').addEventListener('click', sayQuote);

  const jobRejections = ['Application rejected. Reason: you are not Art.', 'We will get back to you (we will not).',
    'Position filled. By Art. All positions are filled by Art.', 'Please do The Hand Sign first, then reapply.'];
  $('#jobBtn').addEventListener('click', () => { toast(pick(jobRejections)); bawk(); });

  /* ───── Things falling from the sky ───── */
  function rain(items = ['🍗', '🍗', '🍗', '🍟', '🪣', '👑', '💸', '✨'], count = 40) {
    if (reduceMotion) count = 6;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        let el;
        const item = pick(items);
        if (item === 'FACE') {
          el = document.createElement('img');
          el.src = 'img/face.png'; el.alt = ''; el.className = 'faller face';
        } else {
          el = document.createElement('span');
          el.className = 'faller'; el.textContent = item;
        }
        el.style.left = `${Math.random() * 100}vw`;
        el.style.fontSize = `${24 + Math.random() * 36}px`;
        el.style.setProperty('--spin', `${(Math.random() - 0.5) * 1440}deg`);
        el.style.animationDuration = `${2.2 + Math.random() * 2.5}s`;
        document.body.appendChild(el);
        el.addEventListener('animationend', () => el.remove());
      }, i * 45);
    }
  }
  $('#rainBtn').addEventListener('click', () => { rain(); bawk(); });
  $('#artPhoto').addEventListener('click', () => { rain(['🍗'], 25); bawk(); toast(pick(['ok you clicked the owner. bold.', 'he felt that.', '+1 aura', 'do NOT touch the crown'])); });

  /* ───── Sparkle cursor trail ───── */
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    let last = 0;
    window.addEventListener('pointermove', e => {
      const now = performance.now();
      if (now - last < 60) return;
      last = now;
      const s = document.createElement('span');
      s.className = 'trail';
      s.textContent = pick(['✨', '🍗', '⭐', '✨']);
      s.style.left = `${e.clientX + 8}px`;
      s.style.top = `${e.clientY + 8}px`;
      document.body.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
    });
  }

  /* ───── Rizz-o-meter ───── */
  const rizzFill = $('#rizzFill'), rizzVal = $('#rizzVal');
  function measureRizz() {
    rizzFill.classList.remove('overflow');
    rizzFill.style.transition = 'none'; rizzFill.style.width = '0';
    rizzVal.textContent = 'calculating…';
    void rizzFill.offsetWidth;
    rizzFill.style.transition = '';
    setTimeout(() => { rizzFill.style.width = '100%'; }, 50);
    setTimeout(() => {
      rizzVal.textContent = `${pick([112, 167, 404, 6767, 9001])}% — ERROR: RIZZ OVERFLOW`;
      rizzFill.classList.add('overflow');
    }, 2300);
  }
  $('#rizzBtn').addEventListener('click', measureRizz);
  const about = $('#about');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { measureRizz(); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(about);
  } else measureRizz();

  /* ───── Gallery ───── */
  const art = [
    ['morina-lisa', 'Morina Lisa', "Da Vinci's lost masterpiece. The drumstick was in the original sketch. Historians simply ignored it.", '3 buckets'],
    ['colonel-art', 'Colonel Art', "After a hostile takeover (he said 'mine' really loud), Art inherited the suit, the glasses and the beard.", '1 company (allegedly)'],
    ['one-small-bite', 'One Small Bite', 'First man to try eating fried chicken through a space helmet. Did not work. Still iconic.', '1 moon'],
    ['king-of-wings', 'King of Wings', 'Coronation day, 2026. Throne made from 100% recycled buckets. Scepter is edible.', '7 kingdoms + fries'],
    ['fine-dining', 'Fine Dining', 'One nugget. One candle. One monocle. Pinky up. This is what peak performance looks like.', '€0.67'],
    ['morina-money', 'Morina Money', 'Official currency of the KFC Empire. Accepted at 0 locations worldwide.', '100 nuggets'],
    ['extra-crispy', 'Extra Crispy (Deluxe)', "Debut album. Tracklist: 1. Finger Lickin' (feat. Gravy) 2. Localhost Freestyle 3. 67 4. Bucket Interlude", '6.7M streams (in his head)'],
    ['bucket-spa', "Art's Chicken Spa", 'Self-care Sunday. Gravy bath, cucumber eyes, rubber chicken. You deserve this, king.', 'priceless'],
  ];
  const grid = $('#galleryGrid');
  art.forEach(([slug, title, desc, value], i) => {
    const fig = document.createElement('figure');
    fig.tabIndex = 0;
    fig.setAttribute('role', 'button');
    fig.setAttribute('aria-label', `Open ${title}`);
    fig.innerHTML = `<img src="img/art/${slug}.jpg" alt="${title}: Art Morina" loading="lazy" width="800" height="800">
      <figcaption><b>${title}</b><small>Art Intelligence™ · No. ${String(i + 1).padStart(3, '0')}</small></figcaption>`;
    const open = () => openLightbox(slug, title, desc, value);
    fig.addEventListener('click', open);
    fig.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    grid.appendChild(fig);
  });
  const lb = $('#lightbox');
  function openLightbox(slug, title, desc, value) {
    $('#lbImg').src = `img/art/${slug}.jpg`;
    $('#lbImg').alt = `${title}: Art Morina`;
    $('#lbTitle').textContent = title;
    $('#lbDesc').textContent = desc;
    $('#lbValue').textContent = value;
    $('#lbDownload').href = `img/art/${slug}.jpg`;
    $('#lbDownload').setAttribute('download', `art-morina-${slug}.jpg`);
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
  }
  $('#lbClose').addEventListener('click', () => lb.close ? lb.close() : lb.removeAttribute('open'));
  lb.addEventListener('click', e => { if (e.target === lb && lb.close) lb.close(); });

  /* ───── Menu ───── */
  const menu = [
    ['🪣', 'The Morina Bucket', '11 herbs, 12 spices, 1 hand sign. Comes with aura.', '€67.00'],
    ['🖥️', 'Localhost Wings', 'Only available on 127.0.0.1. Cannot be delivered outside Art\'s laptop.', '€4.04'],
    ['❓', '404 Nuggets', 'Not found. Never were. Still charged.', '€0.00'],
    ['💪', 'Sigma Strips', 'Grindset-marinated. Wakes up at 4am. Goes back to sleep at 4:01.', '€6.70'],
    ['🤝', 'The CEO Combo', 'A drumstick, a firm handshake, and 45 minutes of unsolicited business advice.', '€99.99'],
    ['🍚', 'Rizzotto', 'Chicken risotto, but it flirts with you.', '€12.00'],
    ['🥣', 'Gravy (Just Gravy)', 'A cup. Of gravy. Do not ask questions.', '€1.50'],
    ['👑', 'The Royal Feast', 'Everything on the menu, served on a crown. Art watches you eat it.', '€6,767'],
  ];
  const orderReplies = ['Order sent to localhost. ETA: never 💀', 'Art has received your order and is ignoring it professionally.',
    'Added to cart. Cart is also on localhost.', 'Your order is being prepared by Art personally (he is asleep).'];
  let cart = 0;
  const cartEl = $('#cartCount'), cartBox = cartEl.parentElement;
  const menuGrid = $('#menuGrid');
  menu.forEach(([emoji, name, desc, price]) => {
    const el = document.createElement('article');
    el.className = 'menu-item';
    el.innerHTML = `<span class="emoji" aria-hidden="true">${emoji}</span><h3></h3><p></p>
      <div class="menu-foot"><span class="price"></span><button class="btn yellow" type="button">ADD TO CART</button></div>`;
    $('h3', el).textContent = name;
    $('p', el).textContent = desc;
    $('.price', el).textContent = price;
    $('button', el).addEventListener('click', () => {
      cartEl.textContent = ++cart;
      cartBox.classList.remove('bump'); void cartBox.offsetWidth; cartBox.classList.add('bump');
      toast(pick(orderReplies));
      bawk();
    });
    menuGrid.appendChild(el);
  });

  /* ───── Secret recipe ───── */
  const recipe = [
    ['Chicken', false], ['More chicken', false],
    ['One (1) hand sign, performed sideways', true], ['A pinch of aura', true],
    ["Saying 'I own KFC' three times into a mirror", true], ['Port 6767, finely chopped', true],
    ['Main character energy', true], ['The smirk (see photo)', true],
    ['Gravy. So much gravy.', true], ['A brown hoodie, for flavour', true],
    ['Love ❤️ (cringe, we know)', true], ['BONUS 12th SPICE: rizz', true],
  ];
  const recipeList = $('#recipeList');
  recipe.forEach(([text, secret]) => {
    const li = document.createElement('li');
    if (secret) {
      const span = document.createElement('span');
      span.className = 'redacted';
      span.textContent = text;
      span.tabIndex = 0;
      span.setAttribute('role', 'button');
      span.setAttribute('aria-label', 'Redacted. Activate to declassify.');
      const reveal = () => { if (!span.classList.contains('open')) { span.classList.add('open'); span.removeAttribute('aria-label'); bawk(); } };
      span.addEventListener('click', reveal);
      span.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); } });
      li.appendChild(span);
    } else li.textContent = text;
    recipeList.appendChild(li);
  });
  $('#declassifyAll').addEventListener('click', () => {
    recipeList.querySelectorAll('.redacted').forEach(s => { s.classList.add('open'); s.removeAttribute('aria-label'); });
    banner('🚨 LEAKED 🚨');
    toast('The Colonel has been notified. Run.');
  });

  /* ───── Hand Sign Academy ───── */
  const signLines = ['Certified. You are now 3% Art.', 'Close enough. You are now 7% Art.', 'Weak. Art felt that from localhost.',
    'Perfect form. A crown is being shipped to you (it is not).', 'The Sign has been registered on the blockchain (a piece of paper).'];
  $('#signBtn').addEventListener('click', () => {
    $('#signResult').textContent = pick(signLines);
    rain(['✋', '🤙', '👑', '✨'], 26);
    bawk();
  });

  /* ───── Guestbook ───── */
  const seed = [
    { name: 'xX_Nugget_Slayer_Xx', msg: 'first!!1! art pls hire me', t: '2026-01-04' },
    { name: "The Colonel's Ghost", msg: "I'm not mad. I'm just disappointed. Nice suit though.", t: '2026-02-11' },
    { name: 'Chicken #4067', msg: 'please let us go', t: '2026-03-30' },
    { name: 'Art Morina', msg: 'great website. 10/10. who made this. (me, i own it)', t: '2026-06-07' },
  ];
  const gbList = $('#gbList');
  function renderGuestbook() {
    const entries = [...store.get('art-guestbook', []), ...seed];
    gbList.textContent = '';
    entries.forEach(({ name, msg, t }) => {
      const li = document.createElement('li');
      const b = document.createElement('b'); b.textContent = name;
      const time = document.createElement('time'); time.textContent = t;
      const p = document.createElement('div'); p.textContent = msg;
      li.append(b, time, p);
      gbList.appendChild(li);
    });
  }
  renderGuestbook();
  $('#gbForm').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = String(fd.get('name') || '').trim().slice(0, 32);
    const msg = String(fd.get('msg') || '').trim().slice(0, 140);
    if (!name || !msg) return;
    const mine = store.get('art-guestbook', []);
    mine.unshift({ name, msg, t: new Date().toISOString().slice(0, 10) });
    store.set('art-guestbook', mine.slice(0, 50));
    renderGuestbook();
    e.target.reset();
    toast('Signed! Art will frame it (he will not).');
    bawk();
  });

  /* ───── Visitor counter ───── */
  const visits = store.get('art-visits', 66) + 1;
  store.set('art-visits', visits);
  $('#visitorCounter').textContent = String(visits).padStart(6, '0');

  /* ───── Theme song (8-bit, original, extremely catchy) ───── */
  const N = { C4: 261.6, D4: 293.7, E4: 329.6, F4: 349.2, G4: 392, A4: 440, B4: 493.9, C5: 523.3, D5: 587.3, E5: 659.3, F5: 698.5, G5: 784, A5: 880, C6: 1046.5 };
  const melody = ['C5', 'E5', 'G5', 'E5', 'F5', 'A5', 'G5', null, 'E5', 'G5', 'C6', 'A5', 'G5', 'F5', 'E5', null,
    'D5', 'F5', 'A5', 'F5', 'E5', 'G5', 'C5', null, 'D5', 'E5', 'F5', 'D5', 'C5', null, 'C5', null];
  const bass = ['C4', 'G4', 'F4', 'C4', 'D4', 'A4', 'G4', 'C4'];
  let musicTimer = null, step = 0;
  const musicBtn = $('#musicBtn');
  function blip(freq, when, dur, type, vol) {
    const ac = audio, o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    o.connect(g).connect(ac.destination);
    o.start(when); o.stop(when + dur + 0.02);
  }
  function toggleMusic() {
    if (musicTimer) {
      clearInterval(musicTimer); musicTimer = null;
      musicBtn.classList.remove('on'); musicBtn.textContent = '🎵 Theme song';
      return;
    }
    if (!ctx()) { toast('Your browser cannot handle this much music.'); return; }
    const beat = 0.16;
    step = 0;
    musicTimer = setInterval(() => {
      const t = audio.currentTime + 0.05;
      const note = melody[step % melody.length];
      if (note) blip(N[note], t, beat * 0.9, 'square', 0.05);
      if (step % 4 === 0) blip(N[bass[(step / 4) % bass.length]] / 2, t, beat * 3.5, 'triangle', 0.12);
      step++;
    }, beat * 1000);
    musicBtn.classList.add('on'); musicBtn.textContent = '🔇 STOP (pls)';
    toast('Now playing: "Bucket Anthem" by Art Morina 🎶');
  }
  musicBtn.addEventListener('click', toggleMusic);

  /* ───── Easter eggs: type "kfc", "67", or the Konami code ───── */
  let typed = '';
  const konami = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba';
  let keys = '';
  window.addEventListener('keydown', e => {
    if (e.target.closest('input, textarea')) return;
    typed = (typed + e.key.toLowerCase()).slice(-10);
    keys = (keys + e.key).slice(-konami.length);
    if (typed.endsWith('kfc')) {
      document.body.classList.toggle('chicken-mode');
      const on = document.body.classList.contains('chicken-mode');
      banner(on ? 'CHICKEN MODE 🐔' : 'normal mode (boring)');
      bawk();
      typed = '';
    } else if (typed.endsWith('67')) {
      banner('SIX SEVEEEN 🤲');
      rain(['6️⃣', '7️⃣', '🤲'], 30);
      typed = '';
    }
    if (keys === konami) {
      banner('ART RAIN');
      rain(['FACE'], 30);
      keys = '';
    }
  });

  console.log('%c🍗 ART MORINA ENTERPRISES™ 🍗', 'font-size:28px;font-weight:bold;color:#e4002b;text-shadow:2px 2px 0 #ffe600');
  console.log('%cIf you are reading this, you are hired. (You are not hired.)', 'font-size:14px');
})();
