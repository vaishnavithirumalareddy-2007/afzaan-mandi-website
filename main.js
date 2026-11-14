/* AFZAAN MANDI — main script (classic script; Three.js loaded dynamically) */
(function () {
  const S = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const isMobile = matchMedia("(max-width: 800px)").matches || /Android|iPhone|iPad/i.test(navigator.userAgent);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = !!window.gsap;
  if (!hasGsap) document.documentElement.classList.add("no-js");
  else gsap.registerPlugin(ScrollTrigger);
  const fmtNum = n => n.toLocaleString("en-IN");
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MAPS_Q = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(S.name);

  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 3200); }
  const SNAPS = {}, SNAP_CATS = { "Chicken Mandi": "chicken", "Mutton Mandi": "mutton", "Special Mandi": "special", "Grilled Chicken": "grilled" };
  const snapFor = (cat, i) => SNAP_CATS[cat] ? SNAP_CATS[cat] + "-" + (i % 2) : "";
  const GAL_SNAPS = { 1: "chicken-1", 5: "grilled-0" };
  function media(src, label, alt, snap) {
    if (src) return `<img class="fill" src="${esc(src)}" alt="${esc(alt || label)}" loading="lazy" decoding="async">`;
    if (snap && SNAPS[snap]) return `<img class="fill" src="${SNAPS[snap]}" alt="${esc(label)} (3D rendering)" decoding="async">`;
    return `<div class="ph" role="img" aria-label="${esc(label)}"${snap ? ` data-snap="${snap}"` : ""}><span>${esc(label)}${snap ? "" : "<small>Add your photo in config.js</small>"}</span></div>`;
  }
  function paintSnaps() {
    $$(".ph[data-snap]").forEach(el => { const u = SNAPS[el.dataset.snap]; if (!u) return;
      const img = new Image(); img.className = "fill"; img.alt = (el.getAttribute("aria-label") || "") + " (3D rendering)"; img.src = u; el.replaceWith(img); });
  }

  /* ---------- Static content from config ---------- */
  $("#yr").textContent = new Date().getFullYear();
  $$("[data-count]").forEach(e => e.textContent = fmtNum(S.reviewCount));
  $("#aboutImg").innerHTML = media(S.images.about, "Afzaan Mandi", "Afzaan Mandi restaurant", "special-0");
  $("#readReviews").href = S.googleReviewsUrl || MAPS_Q;
  $("#dirBtn").href = S.googleMapsUrl || MAPS_Q;
  $("#mapBtn").href = S.googleMapsUrl || MAPS_Q;
  const PH = t => `<span class="ph-text">${t}</span>`;
  $("#addr").innerHTML = S.address ? esc(S.address) : PH("Address: add in config.js once confirmed");
  $("#phoneLine").innerHTML = S.phone ? `Phone: <a href="tel:${esc(S.phone)}">${esc(S.phone)}</a>` : PH("Phone: add in config.js");
  $("#emailLine").innerHTML = S.email ? `Email: <a href="mailto:${esc(S.email)}">${esc(S.email)}</a>` : "";
  $("#callBtn").href = S.phone ? "tel:" + S.phone : "#";
  $("#callBtn").addEventListener("click", e => { if (!S.phone) { e.preventDefault(); toast("Phone number not added yet — set it in config.js"); } });
  $("#hours").innerHTML = S.hours.map(h => `<li><span>${esc(h.day)}</span><b>${h.time ? esc(h.time) : PH("add hours")}</b></li>`).join("");
  $("#fAddr").innerHTML = S.address ? esc(S.address) : PH("Address coming soon");
  $("#fPhone").innerHTML = S.phone ? esc(S.phone) : "";
  $("#fEmail").innerHTML = S.email ? esc(S.email) : "";
  [["#fIg", S.instagram, "Instagram"], ["#fFb", S.facebook, "Facebook"]].forEach(([id, url, n]) => {
    const a = $(id); if (url) a.href = url; else a.addEventListener("click", e => { e.preventDefault(); toast(n + " link not added yet — set it in config.js"); });
  });
  const ld = { "@context": "https://schema.org", "@type": "Restaurant", name: S.name, servesCuisine: ["Yemeni", "Arabian", "Mandi"],
    aggregateRating: { "@type": "AggregateRating", ratingValue: S.rating, reviewCount: S.reviewCount, bestRating: 5 } };
  if (S.address) ld.address = S.address; if (S.phone) ld.telephone = S.phone;
  $("#ld").textContent = JSON.stringify(ld);

  /* stars */
  $$("[data-stars]").forEach(el => {
    const v = parseFloat(el.dataset.stars);
    el.setAttribute("aria-label", v + " out of 5 stars"); el.setAttribute("role", "img");
    el.innerHTML = [0, 1, 2, 3, 4].map(i => `<i style="transition-delay:${i * 0.12}s"><b style="width:${Math.max(0, Math.min(1, v - i)) * 100}%"></b></i>`).join("");
  });

  /* ---------- Menu ---------- */
  const cats = Object.keys(S.menu);
  let activeCat = cats[0];
  const cart = {};
  $("#tabs").innerHTML = cats.map((c, i) => `<button class="tab${i ? "" : " on"}" role="tab" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
  function priceHTML(p) { return p == null ? `<span class="price tbd">Price on request</span>` : `<span class="price">${esc(S.currency)}${fmtNum(p)}</span>`; }
  function renderMenu() {
    $("#menuGrid").innerHTML = S.menu[activeCat].map((d, i) => `
      <article class="glass dish">
        <div class="im">${media(d.image, d.name, d.name, snapFor(activeCat, i))}</div>
        <div class="bd"><h3>${esc(d.name)}</h3><p>${esc(d.desc)}</p>
          <div class="ft">${priceHTML(d.price)}<button class="btn btn-sm btn-gold add" data-i="${i}">Add to Cart</button></div></div>
      </article>`).join("");
    if (hasGsap && !reduced) gsap.from("#menuGrid .dish", { opacity: 0, y: 40, rotateX: -12, duration: .7, stagger: .1, ease: "power3.out", clearProps: "all" });
  }
  $("#tabs").addEventListener("click", e => {
    const b = e.target.closest(".tab"); if (!b) return;
    $$(".tab").forEach(t => t.classList.toggle("on", t === b)); activeCat = b.dataset.cat; renderMenu();
  });
  $("#menuGrid").addEventListener("click", e => {
    const b = e.target.closest(".add"); if (!b) return;
    const d = S.menu[activeCat][+b.dataset.i];
    (cart[d.name] = cart[d.name] || { name: d.name, price: d.price, qty: 0 }).qty++;
    renderCart(); toast(d.name + " added to cart");
  });
  renderMenu();

  /* ---------- Cart ---------- */
  function renderCart() {
    const items = Object.values(cart).filter(i => i.qty > 0);
    $("#cartCount").textContent = items.reduce((a, i) => a + i.qty, 0);
    $("#cartList").innerHTML = items.length ? items.map(i => `
      <li><span>${esc(i.name)}</span><span class="qty"><button data-n="${esc(i.name)}" data-d="-1" aria-label="Decrease">−</button>${i.qty}<button data-n="${esc(i.name)}" data-d="1" aria-label="Increase">+</button></span></li>`).join("")
      : `<li class="empty">Your cart is empty.</li>`;
    const priced = items.length && items.every(i => i.price != null);
    $("#cartTotal").textContent = !items.length ? "" : priced ? "Total: " + S.currency + fmtNum(items.reduce((a, i) => a + i.price * i.qty, 0)) : "Prices will be confirmed by the restaurant.";
  }
  $("#cartList").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    const it = cart[b.dataset.n]; it.qty = Math.max(0, it.qty + +b.dataset.d); renderCart();
  });
  const openCart = v => { $("#cart").classList.toggle("open", v); };
  $("#cartBtn").onclick = () => openCart(true); $("#cartClose").onclick = () => openCart(false);
  function deliver(text, msgEl, label) {
    const enc = encodeURIComponent(text), links = [];
    if (S.whatsapp) links.push(`<a class="lnk" href="https://wa.me/${S.whatsapp.replace(/\D/g, "")}?text=${enc}" target="_blank" rel="noopener">Send on WhatsApp</a>`);
    if (S.email) links.push(`<a class="lnk" href="mailto:${esc(S.email)}?subject=${encodeURIComponent(S.name + " — " + label)}&body=${enc}">Send by email</a>`);
    msgEl.innerHTML = (links.length ? `Your ${label} is ready. ${links.join(" · ")}. ` : `Your ${label} is written below but has not been sent, because the restaurant's WhatsApp number or email is not set yet. `)
      + `<button type="button" class="lnk">Copy details</button><span class="sum"></span>`;
    msgEl.querySelector(".sum").textContent = text;
    msgEl.querySelector("button").onclick = () => { try { navigator.clipboard.writeText(text).then(() => toast("Details copied"), () => toast("Copy blocked here — select the text instead")); } catch (_) { toast("Copy blocked here — select the text instead"); } };
    return links.length > 0;
  }
  $("#sendOrder").onclick = () => {
    const items = Object.values(cart).filter(i => i.qty > 0), m = $("#cartMsg");
    if (!items.length) { m.textContent = "Add something from the menu first."; return; }
    deliver(`Order enquiry — ${S.name}\n` + items.map(i => `• ${i.name} × ${i.qty}`).join("\n"), m, "order enquiry");
  };
  renderCart();

  /* ---------- 3D experience cards ---------- */
  const exp = ["Chicken Mandi", "Mutton Mandi", "Special Mandi", "Grilled Chicken"].filter(c => S.menu[c]);
  $("#expGrid").innerHTML = exp.map(c => `
    <div class="tilt" tabindex="0" data-cat="${esc(c)}"><div class="layer">${media((S.menu[c][0] || {}).image, c, c, snapFor(c, 0))}</div><div class="glow"></div>
    <div class="cap"><h3>${esc(c)}</h3><p>View in menu →</p></div></div>`).join("");
  $$(".tilt").forEach(card => {
    card.addEventListener("pointermove", e => {
      if (e.pointerType === "touch") return;
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.transform = `rotateY(${(x - .5) * 18}deg) rotateX(${(.5 - y) * 18}deg) translateZ(50px)`;
      card.style.setProperty("--mx", x * 100 + "%"); card.style.setProperty("--my", y * 100 + "%");
    });
    card.addEventListener("pointerleave", () => card.style.transform = "");
    const go = () => { activeCat = card.dataset.cat; $$(".tab").forEach(t => t.classList.toggle("on", t.dataset.cat === activeCat)); renderMenu(); $("#menu").scrollIntoView({ behavior: "smooth" }); };
    card.addEventListener("click", go); card.addEventListener("keydown", e => e.key === "Enter" && go());
  });

  /* ---------- Gallery + lightbox ---------- */
  $("#galGrid").innerHTML = S.images.gallery.map((g, i) => `<figure class="gi" data-i="${i}" tabindex="0">${media(g.src, g.label, g.label, GAL_SNAPS[i])}<figcaption class="lb">${esc(g.label)}</figcaption></figure>`).join("");
  const lb = $("#lightbox");
  const openLb = i => { const g = S.images.gallery[i]; $("#lbContent").innerHTML = media(g.src, g.label, g.label, GAL_SNAPS[i]); lb.classList.add("open"); document.body.classList.add("lock"); };
  const closeLb = () => { lb.classList.remove("open"); document.body.classList.remove("lock"); };
  $("#galGrid").addEventListener("click", e => { const f = e.target.closest(".gi"); if (f) openLb(+f.dataset.i); });
  $("#galGrid").addEventListener("keydown", e => { const f = e.target.closest(".gi"); if (f && e.key === "Enter") openLb(+f.dataset.i); });
  lb.addEventListener("click", e => { if (e.target === lb || e.target.tagName === "BUTTON") closeLb(); });
  addEventListener("keydown", e => e.key === "Escape" && (closeLb(), openCart(false)));

  /* ---------- Forms ---------- */
  const gs = $("#bookForm [name=guests]");
  gs.innerHTML = Array.from({ length: 20 }, (_, i) => `<option>${i + 1} ${i ? "guests" : "guest"}</option>`).join("") + "<option>20+ guests</option>";
  const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  $("#bookForm [name=date]").min = today.toISOString().slice(0, 10);
  function validate(form) {
    let ok = true;
    $$("[required]", form).forEach(f => { const bad = !f.value.trim(); f.classList.toggle("err", bad); if (bad) ok = false; });
    return ok;
  }
  $("#bookForm").addEventListener("submit", e => {
    e.preventDefault(); const f = e.target, m = $("#bookMsg");
    if (!validate(f)) { m.textContent = "Please fill in all required fields."; return; }
    const d = Object.fromEntries(new FormData(f));
    try { const all = JSON.parse(localStorage.getItem("afzaan_reservations") || "[]"); all.push({ ...d, at: Date.now() }); localStorage.setItem("afzaan_reservations", JSON.stringify(all)); } catch (_) {}
    deliver(`Table reservation request — ${S.name}\nName: ${d.name}\nPhone: ${d.phone}\nDate: ${d.date}\nTime: ${d.time}\nGuests: ${d.guests}\nNotes: ${d.notes || "-"}`, m, "reservation request");
  });
  $("#contactForm").addEventListener("submit", e => {
    e.preventDefault(); const f = e.target, m = $("#contactMsg");
    if (!validate(f)) { m.textContent = "Please fill in all fields."; return; }
    const d = Object.fromEntries(new FormData(f));
    deliver(`Message — ${S.name}\nFrom: ${d.name} (${d.contact})\n${d.message}`, m, "message");
  });

  /* ---------- Nav ---------- */
  const nav = $("#nav"), links = $("#links"), burger = $("#burger");
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 60), { passive: true });
  burger.onclick = () => { burger.classList.toggle("open"); links.classList.toggle("open"); };
  $$("#links a").forEach(a => a.addEventListener("click", () => { burger.classList.remove("open"); links.classList.remove("open"); }));
  const secs = $$("main section[id]");
  const spy = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) $$("#links a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach(s => spy.observe(s));

  /* ---------- Scroll animations ---------- */
  function initScroll() {
    if (!hasGsap || reduced) { $$(".stars").forEach(s => s.classList.add("on")); $$("[data-count-up]").forEach(el => el.textContent = fmtNum(+el.dataset.countUp)); return; }
    $$(".split").forEach(el => {
      el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w"><i>${esc(w)}</i></span>`).join(" ");
      gsap.to($$("i", el), { y: 0, duration: 1, stagger: .09, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 88%" } });
    });
    $$(".reveal").forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } }));
    $$(".stars").forEach(s => ScrollTrigger.create({ trigger: s, start: "top 92%", onEnter: () => s.classList.add("on") }));
    $$("[data-count-up]").forEach(el => {
      const end = +el.dataset.countUp, dec = +(el.dataset.dec || 0), o = { v: 0 };
      ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => gsap.to(o, { v: end, duration: 2, ease: "power2.out", onUpdate: () => el.textContent = dec ? o.v.toFixed(dec) : fmtNum(Math.round(o.v)) }) });
    });
    // cinematic image reveals
    $$(".gi, .frame, .tilt").forEach(el => gsap.from(el, { clipPath: "inset(100% 0% 0% 0%)", scale: 1.08, duration: 1.4, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 90%" }, clearProps: "clipPath,scale" }));
    // parallax
    if (!isMobile) {
      gsap.to(".about-media", { yPercent: -8, ease: "none", scrollTrigger: { trigger: ".about", scrub: 1 } });
      gsap.to(".badge", { y: -70, ease: "none", scrollTrigger: { trigger: ".about", scrub: 1.4 } });
      $$(".why-card").forEach((c, i) => gsap.to(c, { y: (i % 2 ? -30 : 30), ease: "none", scrollTrigger: { trigger: ".why", scrub: 1 } }));
    }
    gsap.to(".hero-copy", { yPercent: 22, opacity: 0, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom 20%", scrub: true } });
  }

  function heroIntro() {
    if (!hasGsap || reduced) return;
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".hero .eyebrow", { opacity: 0, y: 20, duration: 1 })
      .from(".hero h1", { opacity: 0, y: 60, scale: .92, letterSpacing: "0.3em", duration: 1.8 }, "-=.6")
      .from(".hero h2", { opacity: 0, y: 24, duration: 1.2 }, "-=1.1")
      .from(".hero-sub", { opacity: 0, y: 20, duration: 1.1 }, "-=.9")
      .from(".hero-cta .btn", { opacity: 0, y: 24, stagger: .15, duration: 1 }, "-=.8")
      .from(".hero-rating", { opacity: 0, duration: 1 }, "-=.6")
      .from("#nav", { opacity: 0, y: -30, duration: 1 }, "-=1");
    ScrollTrigger.create({ trigger: ".hero", start: "top top", once: true, onEnter: () => { const s = $(".hero .stars"); s && s.classList.add("on"); } });
    setTimeout(() => $$(".hero .stars").forEach(s => s.classList.add("on")), 2200);
  }

  /* ---------- Loader ---------- */
  const bar = $(".loader-bar span"); let prog = 0;
  const tick = setInterval(() => { prog = Math.min(prog + Math.random() * 12, 90); bar.style.width = prog + "%"; }, 180);
  let loaderDone = false;
  function finishLoader() {
    if (loaderDone) return; loaderDone = true; clearInterval(tick); bar.style.width = "100%";
    setTimeout(() => { $("#loader").classList.add("done"); initScroll(); heroIntro(); }, 450);
  }

  /* ---------- 3D: shared stage + procedural mandi builder ---------- */
  const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.159.0/build/three.min.js";
  function loadThree() {
    if (window.THREE) return Promise.resolve(window.THREE);
    return new Promise((res, rej) => {
      const s = document.createElement("script"); s.src = THREE_URL; s.async = true;
      s.onload = () => window.THREE ? res(window.THREE) : rej(new Error("THREE missing")); s.onerror = () => rej(new Error("Three.js failed to load"));
      document.head.appendChild(s);
    });
  }
  function soft(THREE, c1, c2) { const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d"); const r = x.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, c1); r.addColorStop(1, c2); x.fillStyle = r; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); }

  function makeStage(THREE, renderer, bg) {
    const scene = new THREE.Scene(); if (bg != null) scene.background = new THREE.Color(bg);
    const ec = document.createElement("canvas"); ec.width = 512; ec.height = 256; const g = ec.getContext("2d");
    const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#ffe2a8"); gr.addColorStop(.45, "#6b3d1a"); gr.addColorStop(1, "#0b0604");
    g.fillStyle = gr; g.fillRect(0, 0, 512, 256);
    [[120, 60], [380, 50], [256, 90]].forEach(([x, y]) => { const r = g.createRadialGradient(x, y, 0, x, y, 60); r.addColorStop(0, "rgba(255,240,200,1)"); r.addColorStop(1, "rgba(255,240,200,0)"); g.fillStyle = r; g.fillRect(x - 60, y - 60, 120, 120); });
    const et = new THREE.CanvasTexture(ec); et.mapping = THREE.EquirectangularReflectionMapping; et.colorSpace = THREE.SRGBColorSpace;
    const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromEquirectangular(et).texture; pm.dispose();
    scene.add(new THREE.AmbientLight(0xffe2bb, .35));
    const key = new THREE.SpotLight(0xffd88a, 90, 30, .6, .6, 1.4); key.position.set(3, 8, 5); key.target.position.set(0, .6, 0); scene.add(key, key.target);
    const rim = new THREE.PointLight(0xff8a3c, 40, 20, 1.6); rim.position.set(-5, 3, -4); scene.add(rim);
    const fill = new THREE.PointLight(0xd4af37, 18, 16, 1.8); fill.position.set(4, 1, 4); scene.add(fill);
    return { scene, key };
  }

  /* variant: chicken | mutton | special | grilled */
  function buildMandi(THREE, variant, mobile) {
    const food = new THREE.Group(), dummy = new THREE.Object3D(), col = new THREE.Color();
    const std = (c, r = .5, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
    const gold = std(0xd4af37, .26, 1), bone = std(0xf0e2c8);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(3, 2.5, .2, 72), gold); base.position.y = -.1; food.add(base);
    const rimT = new THREE.Mesh(new THREE.TorusGeometry(3, .09, 16, 96), gold); rimT.rotation.x = Math.PI / 2; food.add(rimT);
    const dish = new THREE.Mesh(new THREE.CylinderGeometry(2.85, 2.7, .08, 72), std(variant === "grilled" ? 0x1a0d07 : 0x2b1409, .5, .2)); dish.position.y = .02; food.add(dish);

    const R = 2.15, H = 1.25, hasRice = variant !== "grilled";
    const rh = r => .1 + H * Math.pow(Math.max(0, 1 - (r / R) ** 2), .8);
    if (hasRice) {
      const N = mobile ? 1500 : 3600;
      const rice = new THREE.InstancedMesh(new THREE.CylinderGeometry(.034, .034, .3, 5), std(0xffffff, .55), N);
      const palettes = {
        chicken: [0xfff1cf, 0xf6dd9c, 0xe9b95a, 0xf3e3b8, 0xd99a3a],
        mutton: [0xf0d79a, 0xdcae5c, 0xc58a3a, 0xe8c783, 0xb87a2e],
        special: [0xf7d36a, 0xee9f2e, 0xf6e2a0, 0xd9772a, 0xfff1cf]
      };
      const pal = palettes[variant];
      for (let i = 0; i < N; i++) {
        const r = R * Math.sqrt(Math.random()), a = Math.random() * Math.PI * 2, k = 1 - (r / R) ** 2;
        dummy.position.set(Math.cos(a) * r, .1 + H * Math.pow(k, .8) * (.75 + Math.random() * .3), Math.sin(a) * r);
        dummy.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3); dummy.scale.set(1, 1, 1); dummy.updateMatrix();
        rice.setMatrixAt(i, dummy.matrix); rice.setColorAt(i, col.set(pal[(Math.random() * pal.length) | 0]));
      }
      food.add(rice);
    }

    const skin = std(0x9a4a14, .45, .05), skin2 = std(0xb8651f, .4), char = std(0x4a1d08, .6), meat = std(0x6e3010, .5), meat2 = std(0x80401a, .45);
    function leg(angle, rad, y, mat, tilt = .35, len = 1.45) {
      const gp = new THREE.Group();
      const m = new THREE.Mesh(new THREE.SphereGeometry(.6, 28, 20), mat); m.scale.set(len, .78, .85); gp.add(m);
      const b = new THREE.Mesh(new THREE.CylinderGeometry(.07, .09, .7, 12), bone); b.rotation.z = Math.PI / 2; b.position.x = 1.05; gp.add(b);
      [-.07, .07].forEach(z => { const k = new THREE.Mesh(new THREE.SphereGeometry(.12, 12, 10), bone); k.position.set(1.4, 0, z); gp.add(k); });
      gp.position.set(Math.cos(angle) * rad, y, Math.sin(angle) * rad); gp.rotation.y = -angle; gp.rotation.z = tilt; return gp;
    }
    function chunk(angle, rad, y, mat, s = 1) {
      const gp = new THREE.Group();
      const m = new THREE.Mesh(new THREE.DodecahedronGeometry(.62, 1), mat); m.scale.set(1.2 * s, .85 * s, .95 * s); m.rotation.set(Math.random(), Math.random(), Math.random()); gp.add(m);
      const b = new THREE.Mesh(new THREE.CylinderGeometry(.08, .1, .75, 10), bone); b.rotation.z = Math.PI / 2 + .3; b.position.set(.85 * s, .1, 0); gp.add(b);
      gp.position.set(Math.cos(angle) * rad, y, Math.sin(angle) * rad); gp.rotation.y = -angle + Math.random() * .4; return gp;
    }
    const topPiece = (mat, s = 1) => { const t = new THREE.Mesh(new THREE.SphereGeometry(.75, 32, 24), mat); t.scale.set(1.2 * s, .8 * s, 1 * s); t.position.set(0, 1.45, 0); return t; };

    if (variant === "chicken") {
      for (let i = 0; i < 5; i++) food.add(leg(i / 5 * Math.PI * 2 + .3, 1.35, 1.0 + (i % 2) * .08, i % 2 ? skin : skin2));
      food.add(topPiece(skin2));
    } else if (variant === "mutton") {
      for (let i = 0; i < 6; i++) food.add(chunk(i / 6 * Math.PI * 2 + .2, 1.4, .95 + (i % 2) * .1, i % 2 ? meat : meat2));
      const big = new THREE.Mesh(new THREE.DodecahedronGeometry(.8, 1), meat2); big.scale.set(1.25, .8, 1); big.position.set(0, 1.5, 0); food.add(big);
    } else if (variant === "special") {
      for (let i = 0; i < 4; i++) food.add(leg(i / 4 * Math.PI * 2 + .3, 1.45, 1.0, i % 2 ? skin : skin2));
      food.add(topPiece(skin2, 1.1));
      for (let i = 0; i < 4; i++) {
        const a = i / 4 * Math.PI * 2 + .3 + Math.PI / 4, e = new THREE.Group();
        const w = new THREE.Mesh(new THREE.SphereGeometry(.3, 20, 14), std(0xfaf6ea, .35)); w.scale.set(1.15, .7, 1); e.add(w);
        const y = new THREE.Mesh(new THREE.SphereGeometry(.15, 16, 12), std(0xf2a900, .35)); y.position.y = .13; y.scale.set(1, .7, 1); e.add(y);
        e.position.set(Math.cos(a) * 1.95, rh(1.95) + .08, Math.sin(a) * 1.95); food.add(e);
      }
    } else {
      for (let i = 0; i < 4; i++) food.add(leg(i / 4 * Math.PI * 2 + .5, 1.15, .42, i % 2 ? char : skin, .08, 1.5));
      for (let i = 0; i < 2; i++) { const l = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .16, 28), std(0xf2d12e, .4)); const a = i * Math.PI + 1.1; l.position.set(Math.cos(a) * 2.05, .17, Math.sin(a) * 2.05); food.add(l);
        const t = new THREE.Mesh(new THREE.SphereGeometry(.34, 20, 16), std(0xb3261e, .35)); const b = a + 1.5; t.position.set(Math.cos(b) * 2.05, .32, Math.sin(b) * 2.05); t.scale.y = .8; food.add(t); }
      for (let i = 0; i < 3; i++) { const o = new THREE.Mesh(new THREE.TorusGeometry(.3 + i * .08, .035, 8, 28), std(0xd9b9d0, .5)); o.rotation.x = Math.PI / 2; o.position.set(-.2 + i * .12, .12 + i * .03, 0); food.add(o); }
    }

    if (hasRice) {
      const cnt = variant === "special" ? 110 : 70;
      const alm = new THREE.InstancedMesh(new THREE.SphereGeometry(.07, 8, 6), std(0xf2dcae, .6), cnt);
      const rai = new THREE.InstancedMesh(new THREE.SphereGeometry(.05, 8, 6), std(0x3a1d10, .5), cnt + 20);
      [alm, rai].forEach(im => { for (let i = 0; i < im.count; i++) { const r = Math.random() * 1.9, a = Math.random() * 6.28; dummy.position.set(Math.cos(a) * r, rh(r) + .06, Math.sin(a) * r); dummy.scale.set(1, im === alm ? .4 : 1, 1.6); dummy.rotation.set(0, Math.random() * 6, 0); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix); } food.add(im); });
    }
    return food;
  }

  function disposeScene(scene) {
    scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); }); });
    if (scene.environment) scene.environment.dispose();
  }

  /* ---------- Rendered dish visuals (used until real photos are set in config.js) ---------- */
  async function makeSnaps(THREE) {
    const W = isMobile ? 480 : 720, Hh = Math.round(W * .75);
    const cv = document.createElement("canvas"); cv.width = W; cv.height = Hh;
    const r = new THREE.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true });
    r.setPixelRatio(1); r.setSize(W, Hh, false); r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.15; r.outputColorSpace = THREE.SRGBColorSpace;
    const cam = new THREE.PerspectiveCamera(38, W / Hh, .1, 100); cam.position.set(0, 4.8, 10.2); cam.lookAt(0, .5, 0);
    for (const v of ["chicken", "mutton", "special", "grilled"]) {
      for (const a of [0, 1]) {
        const st = makeStage(THREE, r, 0x120a06), food = buildMandi(THREE, v, isMobile);
        food.rotation.y = a ? 2.3 : .5; food.rotation.x = .05; food.position.y = -.3; st.scene.add(food);
        r.render(st.scene, cam); SNAPS[v + "-" + a] = cv.toDataURL("image/jpeg", .88);
        disposeScene(st.scene);
        await new Promise(res => setTimeout(res, 50));
      }
      paintSnaps();
    }
    r.dispose();
  }

  /* ---------- Hero 3D ---------- */
  async function hero3D() {
    const THREE = await loadThree();
    const canvas = $("#hero3d"), hero = $("#home");
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15; renderer.outputColorSpace = THREE.SRGBColorSpace;
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
    const { scene, key } = makeStage(THREE, renderer);
    const food = buildMandi(THREE, "chicken", isMobile); food.position.y = -.6; food.rotation.x = .12; scene.add(food);

    // floating spices
    const spices = new THREE.Group(); scene.add(spices);
    const geos = [new THREE.CylinderGeometry(.05, .05, .5, 8), new THREE.OctahedronGeometry(.13), new THREE.SphereGeometry(.09, 8, 6)];
    const mats = [0x8a4b21, 0x5a2a14, 0x7a9b4a, 0xb5772a].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: .6 }));
    const nSp = isMobile ? 22 : 46, sp = [];
    for (let i = 0; i < nSp; i++) {
      const m = new THREE.Mesh(geos[i % 3], mats[i % 4]); const a = Math.random() * 6.28, r = 3 + Math.random() * 4;
      m.position.set(Math.cos(a) * r, -1 + Math.random() * 5, Math.sin(a) * r * .6 - 1.5); m.userData = { s: Math.random() * 6, v: .3 + Math.random() * .6, y: m.position.y };
      m.scale.setScalar(.8 + Math.random() * 1.2); spices.add(m); sp.push(m);
    }
    // smoke
    const smokeTex = soft(THREE, "rgba(255,235,210,.55)", "rgba(255,235,210,0)"), smoke = [];
    for (let i = 0; i < (isMobile ? 8 : 16); i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeTex, transparent: true, depthWrite: false, opacity: 0 }));
      s.userData = { t: Math.random(), x: (Math.random() - .5) * 2.4, z: (Math.random() - .5) * 1.6 }; scene.add(s); smoke.push(s);
    }
    // golden particles
    const PN = isMobile ? 220 : 520, pg = new THREE.BufferGeometry(), pos = new Float32Array(PN * 3);
    for (let i = 0; i < PN; i++) { pos[i * 3] = (Math.random() - .5) * 18; pos[i * 3 + 1] = (Math.random() - .5) * 10; pos[i * 3 + 2] = (Math.random() - .5) * 12 - 2; }
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const parts = new THREE.Points(pg, new THREE.PointsMaterial({ map: soft(THREE, "rgba(255,220,130,1)", "rgba(255,200,80,0)"), size: .16, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .9 }));
    scene.add(parts);

    let portrait = false;
    function resize() {
      const w = hero.clientWidth, h = hero.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
      portrait = w / h < .9; camera.position.set(0, portrait ? 3.4 : 3.1, portrait ? 13 : 10.2); food.scale.setScalar(portrait ? .85 : 1);
      camera.lookAt(0, portrait ? 1.6 : .9, 0); camera.updateProjectionMatrix();
    }
    resize(); addEventListener("resize", resize);

    const m = { x: 0, y: 0 }; addEventListener("pointermove", e => { m.x = e.clientX / innerWidth - .5; m.y = e.clientY / innerHeight - .5; });
    let visible = true; new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(hero);
    const clock = new THREE.Clock();
    function frame() {
      requestAnimationFrame(frame); if (!visible || document.hidden) return;
      const t = clock.getElapsedTime();
      const sy = Math.min(scrollY / innerHeight, 1.2), baseY = portrait ? -1.2 : -.6;
      food.rotation.y = t * .22 + sy * 2.2; food.position.x += (m.x * .4 - food.position.x) * .04;
      food.position.y += ((sy * 1.2 + baseY) - food.position.y) * .06;
      camera.position.x += (m.x * 1.4 - camera.position.x) * .03; camera.lookAt(0, portrait ? 1.6 : .9, 0);
      spices.rotation.y = t * .05 + m.x * .3;
      sp.forEach(s => { const u = s.userData; s.rotation.x += .004 * u.v; s.rotation.y += .007 * u.v; s.position.y = u.y + Math.sin(t * u.v + u.s) * .35; });
      smoke.forEach(s => { const u = s.userData; u.t = (u.t + .0016) % 1; const k = u.t;
        s.position.set(u.x + Math.sin(k * 6 + u.x) * .5, .9 + k * 4, u.z - 1); s.scale.setScalar(1.4 + k * 3.5); s.material.opacity = Math.sin(k * Math.PI) * .22; });
      const p = pg.attributes.position; for (let i = 0; i < PN; i++) { let y = p.getY(i) + .004 + (i % 5) * .0008; if (y > 5) y = -5; p.setY(i, y); } p.needsUpdate = true;
      parts.rotation.y = t * .015; key.intensity = 90 + Math.sin(t * 1.6) * 8;
      renderer.render(scene, camera);
    }
    frame();
    return THREE;
  }

  hero3D().then(THREE => { finishLoader(); setTimeout(() => makeSnaps(THREE).catch(e => console.warn("Dish renders unavailable:", e)), 900); })
    .catch(err => { console.warn("3D hero unavailable:", err); $("#hero3d").style.display = "none"; finishLoader(); });
  setTimeout(finishLoader, 6000); // never block the page
})();
