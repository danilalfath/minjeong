/* ============================================================
   App Photos — library, Recent Days, Albums, halaman album,
   dan penampil foto. Datanya dari data/photos.js.
   ============================================================ */
(() => {
  "use strict";

  const iOS = window.iOS;
  const DATA = window.PHOTOS || {};
  const SITE = window.SITE || {};
  const W = iOS.W;

  /* harus sama dengan css/photos.css */
  const SLIDE_GAP = 24; // .pv-track gap
  const PAD_TOP = 108; // .pv-slide padding
  const PAD_BOTTOM = 152;
  const PAD_INFO = 440; // .pv.info .pv-slide padding-bottom

  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const h = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  /* ---------------------------------------------------------- ikon */

  const svg = (inner) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

  const I = {
    back: svg('<path d="M14.500 4.500 7 12l7.500 7.500" stroke-width="2.4"/>'),
    chev:
      '<svg viewBox="0 0 8 14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.500 1.500 6.500 7l-5 5.500"/></svg>',
    more:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5.500" cy="12" r="1.900"/><circle cx="12" cy="12" r="1.900"/><circle cx="18.500" cy="12" r="1.900"/></svg>',
    search:
      '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.900" stroke-linecap="round" aria-hidden="true"><circle cx="5.900" cy="5.900" r="4.300"/><path d="M9.200 9.200 12.600 12.600"/></svg>',
    share: svg(
      '<path d="M12 14.500V3.200M8 6.800l4-4 4 4M8.500 10H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1.500"/>',
    ),
    heart: svg(
      '<path d="M12 20.300c-.3 0-.6-.1-.8-.3-4-3.200-7.700-6.400-7.700-10.400 0-2.700 2-4.800 4.600-4.800 1.600 0 3 .8 3.900 2.100.9-1.300 2.300-2.100 3.900-2.100 2.600 0 4.600 2.100 4.600 4.800 0 4-3.700 7.200-7.700 10.400-.2.200-.5.300-.8.300Z"/>',
    ),
    info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5.500"/><circle cx="12" cy="7.700" r="0.600" fill="currentColor"/>'),
    adjust: svg(
      '<path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h10M18 17h2"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="16" cy="17" r="2"/>',
    ),
    trash: svg(
      '<path d="M4.500 6.500h15M9.500 6.500V5A1.500 1.500 0 0 1 11 3.500h2A1.500 1.500 0 0 1 14.500 5v1.500M6.500 6.500l.8 12.100a2 2 0 0 0 2 1.900h5.400a2 2 0 0 0 2-1.900l.8-12.100M10 10.500v6M14 10.500v6"/>',
    ),
    eyeOff: svg(
      '<path d="M4 4l16 16M9.900 5.300A9.800 9.800 0 0 1 12 5c5 0 8.500 4.500 9.500 7-.4 1-1.200 2.300-2.400 3.500M6.200 7.300C4.300 8.700 3 10.700 2.500 12c1 2.500 4.500 7 9.500 7 1.500 0 2.900-.4 4.100-1"/><path d="M9.900 9.900a3 3 0 0 0 4.200 4.200"/>',
    ),
    lock: '<svg viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M4.300 5.800V4.300a2.700 2.700 0 0 1 5.400 0v1.500h.4c.7 0 1.200.5 1.200 1.200v4.300c0 .7-.5 1.200-1.200 1.200H3.900c-.7 0-1.200-.5-1.200-1.200V7c0-.7.5-1.200 1.200-1.200h.4Zm1.300 0h2.800V4.300a1.400 1.400 0 0 0-2.800 0v1.500Z"/></svg>',
    pin: svg('<path d="M12 21s-6.500-5.900-6.500-11a6.500 6.500 0 0 1 13 0c0 5.100-6.500 11-6.500 11Z"/><circle cx="12" cy="10" r="2.400"/>'),
  };

  /* ---------------------------------------------------------- data */

  const hash = (s) => {
    let x = 0;
    for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0;
    return x;
  };

  /* urut dari foto terlama → terbaru (yang terbaru ada di bawah, seperti iOS) */
  const pad2 = (n) => String(n).padStart(2, "0");
  const all = (DATA.photos || [])
    .map(([src, when, album, meta]) => {
      const date = iOS.parseDate(when);
      if (!/\d:\d\d/.test(String(when))) {
        const x = hash(src); // tanpa jam → jam dibuat otomatis, selalu sama untuk foto yang sama
        date.setHours(9 + (x % 13), (x >>> 5) % 60);
      }
      const m = meta || {};
      return {
        src,
        album: album || "",
        date,
        day: `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`,
        caption: m.caption || "",
        place: m.place || "",
        hidden: !!m.hidden,
        deleted: !!m.deleted,
      };
    })
    .sort((a, b) => a.date - b.date);
  all.forEach((p, i) => (p.id = i));

  const items = all.filter((p) => !p.hidden && !p.deleted); // library biasa
  const hiddenItems = all.filter((p) => p.hidden && !p.deleted);
  const deletedItems = all.filter((p) => p.deleted);

  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  function dayLabel(d, long) {
    const now = iOS.now();
    const n = Math.round((startOfDay(now) - startOfDay(d)) / 864e5);
    if (n === 0) return "Today";
    if (n === 1) return "Yesterday";
    const m = MONTHS[d.getMonth()];
    const year = d.getFullYear() !== now.getFullYear() ? `, ${d.getFullYear()}` : "";
    return `${long ? m : m.slice(0, 3)} ${d.getDate()}${year}`;
  }

  /* hari, dari yang terbaru */
  function days() {
    const map = new Map();
    for (const p of items) {
      if (!map.has(p.day)) map.set(p.day, []);
      map.get(p.day).push(p);
    }
    return [...map.entries()].map(([day, list]) => ({ day, list, date: list[0].date })).reverse();
  }

  function albums() {
    const names =
      DATA.albums && DATA.albums.length ? DATA.albums : [...new Set(items.map((p) => p.album).filter(Boolean))];
    return names.map((name) => ({ name, list: items.filter((p) => p.album === name) })).filter((a) => a.list.length);
  }

  const FAV_KEY = "photos-favorites";
  const favs = new Set();
  try {
    JSON.parse(localStorage.getItem(FAV_KEY) || "[]").forEach((s) => favs.add(s));
  } catch {}
  const saveFavs = () => {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify([...favs]));
    } catch {}
  };

  /* ---------------------------------------------------------- state */

  let wrap = null;
  let stack = [];
  let viewer = null;
  let edge = null;
  let swallowClick = false;
  const lists = new WeakMap(); // grid → daftar foto yang dibuka saat fotonya diketuk

  const img = (p) => `<img src="${esc(p.src)}" alt="" loading="lazy" decoding="async" draggable="false">`;
  const cell = (p) => `<button type="button" class="ph-cell" data-id="${p.id}">${img(p)}</button>`;
  const count = (n) => `${n} Photo${n === 1 ? "" : "s"}`;

  function syncChrome() {
    if (!wrap) return;
    if (viewer) {
      const im = viewer.immersive;
      iOS.setChrome({ bar: im ? "light" : "dark", hideStatus: im, homebar: im ? "light" : "dark" });
    } else {
      const top = stack[stack.length - 1];
      iOS.setChrome({ bar: top._bar || "dark", homebar: top._homebar || "dark" });
    }
  }

  /* ---------------------------------------------------------- halaman utama */

  function recentDaysHTML() {
    const cards = days()
      .slice(0, 12)
      .map((d) => {
        const cover = d.list[d.list.length - 1];
        return `<button type="button" class="ph-day" data-day="${esc(d.day)}" data-id="${cover.id}">${img(cover)}<span>${esc(
          dayLabel(d.date),
        )}</span></button>`;
      })
      .join("");
    return `<button type="button" class="ph-sec-h" data-go="days">Recent Days ${I.chev}</button><div class="ph-row">${cards}</div>`;
  }

  function albumsHTML() {
    const al = albums();
    if (!al.length) return "";
    const tiles = al
      .map((a) => {
        const cover = a.list[a.list.length - 1];
        return `<button type="button" class="ph-album" data-album="${esc(a.name)}">${img(cover)}<div><b>${esc(
          a.name,
        )}</b><small>${a.list.length}</small></div></button>`;
      })
      .join("");
    return `<button type="button" class="ph-sec-h" data-go="albums">Albums ${I.chev}</button><div class="ph-albums">${tiles}</div>`;
  }

  /* Favorites + dua album terkunci (Hidden, Recently Deleted) */
  const favList = () => items.filter((p) => favs.has(p.src));

  function utilitiesHTML() {
    const row = (key, icon, name, right) =>
      `<button type="button" class="ph-util" data-util="${key}">${icon}<b>${name}</b><small>${right}</small>${I.chev}</button>`;
    return `<div class="ph-sec-h">Utilities</div><div class="ph-utils">${row(
      "favorites",
      I.heart,
      "Favorites",
      favList().length,
    )}${row("hidden", I.eyeOff, "Hidden", I.lock)}${row("deleted", I.trash, "Recently Deleted", I.lock)}</div>`;
  }

  function openUtil(key) {
    if (key === "favorites") return push(collectionView("Favorites", [{ list: favList() }]));
    const hiddenAlbum = key === "hidden";
    const title = hiddenAlbum ? "Hidden" : "Recently Deleted";
    iOS.askCode({
      title: "Enter Passcode",
      sub: `to view “${title}”`,
      code: SITE.photosCode || SITE.passcode,
      hint: SITE.photosHint || "",
    }).then((ok) => {
      if (!ok || !wrap) return;
      push(
        collectionView(title, [{ list: hiddenAlbum ? hiddenItems : deletedItems }], {
          days: !hiddenAlbum,
          note: hiddenAlbum
            ? "These photos are hidden from your library and other albums."
            : "Photos show the days remaining before deletion. After that time, items will be permanently deleted.",
        }),
      );
    });
  }

  function mainView() {
    const v = h("div", "ph-view ph-main");
    const sc = h("div", "ph-scroll");
    const lib = h("div", "ph-grid ph-lib", items.map(cell).join(""));
    lists.set(lib, items);
    /* seperti iOS: baris terbawah (foto terbaru) selalu penuh, sisanya di baris teratas */
    const lead = (3 - (items.length % 3)) % 3;
    if (lead) lib.firstElementChild.style.gridColumnStart = String(lead + 1);
    const coll = h(
      "div",
      "ph-coll",
      (items.length ? recentDaysHTML() + albumsHTML() : '<div class="ph-empty">No Photos</div>') + utilitiesHTML(),
    );
    sc.append(lib, coll);

    const owner = SITE.owner || {};
    const avatar = owner.avatar ? `<img src="${esc(owner.avatar)}" alt="">` : esc(owner.initials || "");
    const head = h(
      "header",
      "ph-head",
      `<h1>Photos</h1><div class="ph-actions"><button type="button" class="ph-search" aria-label="Search">${I.search}</button><button type="button" class="ph-pill">Select</button><span class="ph-avatar">${avatar}</span></div>`,
    );
    const seg = h("div", "ph-seg", '<span>Years</span><span>Months</span><span class="on">All</span>');
    v.append(sc, head, seg);

    let base = 0;
    const sync = () => {
      const libBottom = lib.offsetHeight - sc.scrollTop;
      const solid = libBottom < 104;
      head.classList.toggle("solid", solid);
      seg.classList.toggle("show", sc.scrollTop < base - 60);
      v._bar = solid ? "dark" : "light";
      v._homebar = libBottom > iOS.H - 30 ? "light" : "dark";
      if (stack[stack.length - 1] === v) syncChrome();
    };
    sc.addEventListener("scroll", sync, { passive: true });

    /* buka di batas library ↔ koleksi: 3,5 baris foto terbaru terlihat,
       gulir ke atas = foto lama, gulir ke bawah = Recent Days & Albums */
    v._init = () => {
      const peek = Math.min(461, Math.round(iOS.H * 0.55));
      base = Math.max(0, lib.offsetHeight - peek);
      sc.scrollTop = base;
      sync();
    };
    return v;
  }

  /* ---------------------------------------------------------- halaman album / hari */

  function shell(title) {
    const v = h("div", "ph-view cv");
    v._bar = "dark";
    const sc = h("div", "ph-scroll", `<div class="cv-title"><h2>${esc(title)}</h2></div>`);
    const bar = h(
      "div",
      "cv-bar",
      `<button type="button" class="circ" data-back aria-label="Back">${I.back}</button><span class="t">${esc(title)}</span><span></span>`,
    );
    sc.addEventListener("scroll", () => bar.classList.toggle("scrolled", sc.scrollTop > 50), { passive: true });
    v.append(sc, bar);
    return { v, sc };
  }

  /* sections: [{ title?, list, viewList? }]
     opts.days : tampilkan sisa hari di tiap foto (Recently Deleted)
     opts.note : teks kecil di bawah jumlah foto */
  function collectionView(title, sections, opts = {}) {
    const { v, sc } = shell(title);
    const one = (p) =>
      opts.days
        ? `<button type="button" class="ph-cell" data-id="${p.id}">${img(p)}<i class="ph-left">${5 + (hash(p.src) % 25)} days</i></button>`
        : cell(p);
    let total = 0;
    for (const s of sections) {
      if (s.title) sc.append(h("h3", "cv-sec", esc(s.title)));
      const g = h("div", "ph-grid", s.list.map(one).join(""));
      lists.set(g, s.viewList || s.list);
      sc.append(g);
      total += s.list.length;
    }
    sc.append(
      h(
        "div",
        "cv-foot",
        (total ? count(total) : '<span class="none">No Photos</span>') + (opts.note ? `<small>${esc(opts.note)}</small>` : ""),
      ),
    );
    return v;
  }

  function albumsView() {
    const { v, sc } = shell("Albums");
    const cards = albums()
      .map((a) => {
        const cover = a.list[a.list.length - 1];
        return `<button type="button" class="al-card" data-album="${esc(a.name)}">${img(cover)}<b>${esc(a.name)}</b><small>${
          a.list.length
        }</small></button>`;
      })
      .join("");
    sc.append(h("div", "al-grid", cards));
    return v;
  }

  const daysView = () =>
    collectionView(
      "Recent Days",
      days().map((d) => ({ title: dayLabel(d.date, true), list: d.list, viewList: items })),
    );

  function openDay(day, node) {
    const d = days().find((x) => x.day === day);
    if (!d) return;
    if (d.list.length === 1) openViewer(items, d.list[0].id, node);
    else push(collectionView(dayLabel(d.date, true), [{ list: d.list }]));
  }

  function openAlbum(name) {
    const a = albums().find((x) => x.name === name);
    if (a) push(collectionView(a.name, [{ list: a.list }]));
  }

  /* ---------------------------------------------------------- navigasi (push / pop) */

  function push(v) {
    const under = stack[stack.length - 1];
    v.classList.add("is-enter");
    wrap.append(v);
    stack.push(v);
    v.offsetWidth; // paksa layout supaya transisinya jalan
    v.classList.remove("is-enter");
    under.classList.add("is-under");
    syncChrome();
  }

  function pop() {
    if (stack.length < 2) return false;
    const v = stack.pop();
    const under = stack[stack.length - 1];
    v.classList.add("is-enter");
    under.classList.remove("is-under");
    setTimeout(() => v.remove(), 480);
    syncChrome();
    return true;
  }

  /* swipe dari tepi kiri untuk kembali */
  function edgeDown(e) {
    if (viewer || stack.length < 2 || (e.pointerType === "mouse" && e.button !== 0)) return;
    const x = (e.clientX - iOS.screen.getBoundingClientRect().left) / iOS.scale;
    if (x > 30) return;
    edge = {
      id: e.pointerId,
      x: e.clientX,
      dx: 0,
      t: performance.now(),
      v: stack[stack.length - 1],
      under: stack[stack.length - 2],
      moved: false,
    };
  }

  function edgeMove(e) {
    if (!edge || e.pointerId !== edge.id) return;
    const dx = Math.max(0, (e.clientX - edge.x) / iOS.scale);
    if (!edge.moved) {
      if (dx < 8) return;
      edge.moved = true;
      edge.v.style.transition = edge.under.style.transition = "none";
      try {
        wrap.setPointerCapture(e.pointerId);
      } catch {}
    }
    edge.dx = dx;
    edge.v.style.transform = `translateX(${dx}px)`;
    edge.under.style.transform = `translateX(${-28 * (1 - dx / W)}%)`;
    edge.under.style.filter = `brightness(${0.86 + 0.14 * Math.min(1, dx / W)})`;
  }

  function edgeUp(e) {
    if (!edge || e.pointerId !== edge.id) return;
    const { v, under, dx, t, moved } = edge;
    edge = null;
    if (!moved) return;
    swallowClick = true;
    setTimeout(() => (swallowClick = false), 60);
    for (const n of [v, under]) {
      n.style.transition = "";
      n.style.transform = "";
      n.style.filter = "";
    }
    const speed = dx / Math.max(1, performance.now() - t);
    if (e.type === "pointerup" && (dx > W * 0.35 || speed > 0.5)) pop();
  }

  function onClick(e) {
    if (swallowClick) {
      swallowClick = false;
      return;
    }
    if (viewer) return;
    const t = e.target;
    let n;
    if (t.closest("[data-back]")) return void pop();
    if ((n = t.closest(".ph-cell"))) {
      const list = lists.get(n.parentNode) || items;
      return void openViewer(list, +n.dataset.id, n);
    }
    if ((n = t.closest(".ph-day"))) return void openDay(n.dataset.day, n);
    if ((n = t.closest("[data-album]"))) return void openAlbum(n.dataset.album);
    if ((n = t.closest("[data-util]"))) return void openUtil(n.dataset.util);
    if ((n = t.closest("[data-go]"))) return void push(n.dataset.go === "albums" ? albumsView() : daysView());
  }

  /* ---------------------------------------------------------- penampil foto */

  /* kotak foto saat tampil penuh (aspect-fit di antara bar atas & bawah) */
  function fitRect(nw, nh, immersive, bottom = PAD_BOTTOM) {
    const top = immersive ? 0 : PAD_TOP;
    const ah = iOS.H - top - (immersive ? 0 : bottom);
    const k = Math.min(W / nw, ah / nh);
    const w = nw * k;
    const hh = nh * k;
    return { x: (W - w) / 2, y: top + (ah - hh) / 2, w, h: hh };
  }

  const FULL = { transform: "translate(0px, 0px) scale(1)", clipPath: "inset(0px 0px round 0px)" };

  /* keadaan "menempel di thumbnail": foto dikecilkan + dipotong seperti object-fit: cover */
  function thumbState(F, T, radius) {
    const k = Math.max(T.w / F.w, T.h / F.h);
    const ix = Math.max(0, (F.w - T.w / k) / 2);
    const iy = Math.max(0, (F.h - T.h / k) / 2);
    const dx = T.x + T.w / 2 - (F.x + F.w / 2);
    const dy = T.y + T.h / 2 - (F.y + F.h / 2);
    return {
      transform: `translate(${dx}px, ${dy}px) scale(${k})`,
      clipPath: `inset(${iy}px ${ix}px round ${radius / k}px)`,
    };
  }

  function heroEl(src, F) {
    const n = h("img", "pv-hero");
    n.src = src;
    n.draggable = false;
    n.style.cssText = `left:${F.x}px;top:${F.y}px;width:${F.w}px;height:${F.h}px`;
    wrap.append(n);
    return n;
  }

  /* isi panel info (tombol ⓘ): caption, tanggal, data kamera, lokasi */
  function infoHTML(p, im) {
    const d = p.date;
    const x = hash(p.src);
    const dims = im.naturalWidth > im.naturalHeight ? "4032 × 3024" : "3024 × 4032";
    return `<div class="grab"></div>
      <p class="cap${p.caption ? "" : " empty"}">${esc(p.caption || "Add a Caption")}</p>
      <p class="when"><b>${iOS.WEEKDAYS[d.getDay()]}</b> · ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()} · ${iOS.fmtTime(d, true)}</p>
      <p class="file">IMG_${1000 + (x % 8999)}.HEIC</p>
      <div class="cam">
        <div><b>Apple iPhone 15 Pro</b><i>HEIF</i></div>
        <span>Main Camera — 24 mm ƒ1.78</span>
        <span>12 MP · ${dims} · ${(1.4 + (x % 20) / 10).toFixed(1)} MB</span>
        <div class="exif"><i>ISO ${[50, 64, 80, 125, 250, 400][x % 6]}</i><i>24 mm</i><i>0 ev</i><i>ƒ1.78</i><i>1/${[60, 120, 250, 500, 1000][x % 5]} s</i></div>
      </div>
      ${p.place ? `<div class="place">${I.pin}<span>${esc(p.place)}</span></div>` : ""}`;
  }

  const onScreen = (r) => r.y + r.h > 70 && r.y < iOS.H - 40 && r.x + r.w > 0 && r.x < W;
  const radiusOf = (n) => parseFloat(getComputedStyle(n).borderTopLeftRadius) || 0;

  function openViewer(list, id, origin) {
    if (viewer || !list.length) return;
    const index = Math.max(0, list.findIndex((p) => p.id === id));

    const pv = h("div", "pv busy");
    pv.innerHTML = `
      <div class="pv-bg"></div>
      <div class="pv-track">${list.map((p) => `<div class="pv-slide">${img(p)}</div>`).join("")}</div>
      <div class="pv-top">
        <button type="button" class="circ" data-close aria-label="Back">${I.back}</button>
        <div class="pv-title"><b></b><small></small></div>
        <button type="button" class="circ" aria-label="More">${I.more}</button>
      </div>
      <div class="pv-info"></div>
      <div class="pv-bottom">
        <div class="pv-strip">${list.map((p, i) => `<button type="button" data-i="${i}">${img(p)}</button>`).join("")}</div>
        <div class="pv-tools">
          <button type="button" class="circ" aria-label="Share">${I.share}</button>
          <div class="pv-group">
            <button type="button" data-fav aria-label="Favorite">${I.heart}</button>
            <button type="button" data-info aria-label="Info">${I.info}</button>
            <button type="button" aria-label="Edit">${I.adjust}</button>
          </div>
          <button type="button" class="circ" aria-label="Delete">${I.trash}</button>
        </div>
      </div>`;
    wrap.append(pv);

    const track = pv.querySelector(".pv-track");
    const strip = pv.querySelector(".pv-strip");
    const bg = pv.querySelector(".pv-bg");
    const V = (viewer = {
      pv,
      track,
      strip,
      list,
      index: -1,
      immersive: false,
      info: false,
      fromGrid: !!(origin && origin.classList.contains("ph-cell")),
      title: pv.querySelector(".pv-title b"),
      sub: pv.querySelector(".pv-title small"),
      fav: pv.querySelector("[data-fav]"),
      infoBtn: pv.querySelector("[data-info]"),
      infoEl: pv.querySelector(".pv-info"),
    });
    V.setInfo = (on) => {
      V.info = on;
      if (on) V.infoEl.innerHTML = infoHTML(list[V.index], track.children[V.index].firstElementChild);
      pv.classList.toggle("info", on);
      V.infoBtn.classList.toggle("fav-on", on);
    };
    V.infoBtn.addEventListener("click", () => V.setInfo(!V.info));
    V.infoEl.addEventListener("click", () => V.setInfo(false));
    const pitch = () => track.clientWidth + SLIDE_GAP;
    V.pitch = pitch;

    track.scrollLeft = index * pitch();
    setIndex(index, true);

    /* geser → ganti foto */
    let raf = 0;
    track.addEventListener(
      "scroll",
      () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (viewer === V) setIndex(Math.round(track.scrollLeft / pitch()));
        });
      },
      { passive: true },
    );

    strip.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (b) track.scrollTo({ left: +b.dataset.i * pitch(), behavior: "auto" });
    });

    pv.querySelector("[data-close]").addEventListener("click", closeViewer);
    V.fav.addEventListener("click", () => {
      const p = list[V.index];
      if (favs.has(p.src)) favs.delete(p.src);
      else favs.add(p.src);
      saveFavs();
      V.fav.classList.toggle("fav-on", favs.has(p.src));
      const n = wrap.querySelector('[data-util="favorites"] small');
      if (n) n.textContent = favList().length;
    });

    /* ketuk = sembunyikan tombol · tarik ke bawah = tutup · (mouse) tarik ke samping = ganti foto */
    let g = null;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      g = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        mode: "",
        mouse: e.pointerType === "mouse",
        left: track.scrollLeft,
        t: performance.now(),
        dy: 0,
      };
    });

    track.addEventListener("pointermove", (e) => {
      if (!g || e.pointerId !== g.id) return;
      const dx = (e.clientX - g.x) / iOS.scale;
      const dy = (e.clientY - g.y) / iOS.scale;
      if (!g.mode) {
        if (Math.abs(dx) < 7 && Math.abs(dy) < 7) return;
        if (Math.abs(dy) > Math.abs(dx)) g.mode = dy > 0 ? "dismiss" : "none";
        else g.mode = g.mouse ? "page" : "none";
        if (g.mode !== "none") {
          try {
            track.setPointerCapture(e.pointerId);
          } catch {}
        }
        if (g.mode === "page") track.style.scrollSnapType = "none";
        if (g.mode === "dismiss") {
          g.img = track.children[V.index].firstElementChild;
          g.img.style.transition = "none";
          bg.style.transition = "none";
          pv.classList.add("dragging");
        }
      }
      if (g.mode === "page") track.scrollLeft = g.left - dx;
      if (g.mode === "dismiss") {
        g.dy = Math.max(0, dy);
        g.img.style.transform = `translate(${dx}px, ${g.dy}px) scale(${Math.max(0.55, 1 - g.dy / 900)})`;
        bg.style.opacity = String(Math.max(0, 1 - g.dy / 300));
      }
    });

    const up = (e) => {
      if (!g || e.pointerId !== g.id) return;
      const s = g;
      g = null;
      if (s.mode === "page") {
        const dx = (e.clientX - s.x) / iOS.scale;
        let target = Math.round(s.left / pitch());
        if (Math.abs(dx) > 50) target += dx < 0 ? 1 : -1;
        track.scrollTo({ left: clamp(target, 0, list.length - 1) * pitch(), behavior: "smooth" });
        setTimeout(() => (track.style.scrollSnapType = ""), 450);
      } else if (s.mode === "dismiss") {
        const speed = s.dy / Math.max(1, performance.now() - s.t);
        if (e.type === "pointerup" && (s.dy > 110 || (s.dy > 30 && speed > 0.5))) {
          closeViewer();
        } else {
          s.img.style.transition = "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)";
          s.img.style.transform = "";
          bg.style.transition = "";
          bg.style.opacity = "";
          pv.classList.remove("dragging");
        }
      } else if (!s.mode && e.type === "pointerup") {
        if (V.info) {
          V.setInfo(false); // ketuk foto saat panel info terbuka → tutup panelnya
        } else {
          V.immersive = !V.immersive;
          pv.classList.toggle("immersive", V.immersive);
          syncChrome();
        }
      }
    };
    track.addEventListener("pointerup", up);
    track.addEventListener("pointercancel", up);

    /* foto "terbang" dari thumbnail ke posisi penuh */
    const oimg = origin && origin.querySelector("img");
    const slideImg = track.children[index].firstElementChild;
    if (oimg && oimg.naturalWidth) {
      const F = fitRect(oimg.naturalWidth, oimg.naturalHeight, false);
      const from = thumbState(F, iOS.rect(origin), radiusOf(origin));
      const hero = heroEl(list[index].src, F);
      slideImg.style.visibility = "hidden";
      origin.style.visibility = "hidden";
      pv.offsetWidth;
      pv.classList.remove("busy");
      hero.animate([from, FULL], { duration: 420, easing: "cubic-bezier(0.25, 0.85, 0.25, 1)" }).onfinish = () => {
        hero.remove();
        slideImg.style.visibility = "";
        origin.style.visibility = "";
      };
    } else {
      pv.offsetWidth;
      pv.classList.remove("busy");
    }
    syncChrome();
  }

  function setIndex(i, instant) {
    const V = viewer;
    if (!V || i === V.index || i < 0 || i >= V.list.length) return;
    const prev = V.strip.children[V.index];
    if (prev) prev.classList.remove("on");
    V.index = i;

    const p = V.list[i];
    const b = V.strip.children[i];
    const im = V.track.children[i].firstElementChild;
    const ratio = im.naturalWidth ? im.naturalWidth / im.naturalHeight : 0.8;
    b.style.setProperty("--w", clamp(40 * ratio, 26, 64) + "px");
    b.classList.add("on");
    V.strip.scrollTo({
      left: b.offsetLeft + b.offsetWidth / 2 - V.strip.clientWidth / 2,
      behavior: instant ? "auto" : "smooth",
    });

    V.title.textContent = dayLabel(p.date, true);
    V.sub.textContent = iOS.fmtTime(p.date, true);
    V.fav.classList.toggle("fav-on", favs.has(p.src));
    if (V.info) V.infoEl.innerHTML = infoHTML(p, im);
  }

  function closeViewer() {
    const V = viewer;
    if (!V) return;
    viewer = null;

    const p = V.list[V.index];
    const im = V.track.children[V.index].firstElementChild;
    const top = stack[stack.length - 1];
    V.pv.style.pointerEvents = "none";
    V.pv.classList.remove("dragging");
    V.pv.classList.add("busy");
    V.pv.querySelector(".pv-bg").style.cssText = "";
    syncChrome();

    if (!im.naturalWidth) {
      setTimeout(() => V.pv.remove(), 320);
      return;
    }

    /* cari thumbnail foto ini di halaman di bawahnya */
    const found = [...top.querySelectorAll(`[data-id="${p.id}"]`)];
    let target = found.find((n) => onScreen(iOS.rect(n)));
    if (!target && V.fromGrid) {
      target = found.find((n) => n.classList.contains("ph-cell"));
      const sc = target && target.closest(".ph-scroll");
      if (sc) {
        const r = iOS.rect(target);
        sc.scrollTop += r.y - (iOS.H - r.h) / 2;
      } else {
        target = null;
      }
    }

    const F = fitRect(im.naturalWidth, im.naturalHeight, V.immersive, V.info ? PAD_INFO : PAD_BOTTOM);
    const hero = heroEl(p.src, F);
    const start = { transform: im.style.transform || FULL.transform, clipPath: FULL.clipPath };
    im.style.visibility = "hidden";

    const done = () => {
      hero.remove();
      V.pv.remove();
      if (target) target.style.visibility = "";
    };

    if (target) {
      target.style.visibility = "hidden";
      hero.animate([start, thumbState(F, iOS.rect(target), radiusOf(target))], {
        duration: 380,
        easing: "cubic-bezier(0.3, 0.75, 0.2, 1)",
        fill: "forwards",
      }).onfinish = done;
    } else {
      hero.animate(
        [
          { transform: start.transform, opacity: 1 },
          { transform: "translate(0px, 70px) scale(0.78)", opacity: 0 },
        ],
        { duration: 280, easing: "ease-out", fill: "forwards" },
      ).onfinish = done;
    }
  }

  function onKey(e) {
    if (!viewer || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
    const i = clamp(viewer.index + (e.key === "ArrowRight" ? 1 : -1), 0, viewer.list.length - 1);
    viewer.track.scrollTo({ left: i * viewer.pitch(), behavior: "auto" });
  }

  /* muat lebih dulu foto yang langsung terlihat saat Photos dibuka, supaya tidak ada kotak abu-abu */
  const warm = () =>
    [...items.slice(-15), ...albums().map((a) => a.list[a.list.length - 1])].forEach((p) => (new Image().src = p.src));
  if (document.readyState === "complete") setTimeout(warm, 400);
  else window.addEventListener("load", () => setTimeout(warm, 400));

  /* ---------------------------------------------------------- daftar ke iOS */

  iOS.registerApp("photos", {
    bar: "light",

    mount(root) {
      wrap = h("div", "ph");
      root.append(wrap);
      viewer = null;
      edge = null;
      const main = mainView();
      wrap.append(main);
      stack = [main];
      main._init();

      wrap.addEventListener("click", onClick);
      wrap.addEventListener("pointerdown", edgeDown);
      wrap.addEventListener("pointermove", edgeMove);
      wrap.addEventListener("pointerup", edgeUp);
      wrap.addEventListener("pointercancel", edgeUp);
      document.addEventListener("keydown", onKey);
    },

    unmount() {
      document.removeEventListener("keydown", onKey);
      wrap = null;
      stack = [];
      viewer = null;
    },

    /* tombol Escape: tutup foto → kembali satu halaman → (false) tutup app */
    back() {
      if (viewer) {
        closeViewer();
        return true;
      }
      return pop();
    },
  });
})();
