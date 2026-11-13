/* ============================================================
   iOS shell — skala bingkai, jam, lock screen, passcode, home
   screen, buka/tutup app, banner notifikasi, dan alat bantu
   yang dipakai semua app (navigasi halaman, layar kode).

   App didaftarkan dari file lain lewat:
     iOS.registerApp("photos", { bar, mount(root, arg), unmount(), back(), open(arg) })
   ============================================================ */
(() => {
  "use strict";

  const SITE = window.SITE || {};
  const $ = (sel, root = document) => root.querySelector(sel);

  const device = $("#device");
  const screen = $("#screen");
  const lock = $("#lock");
  const home = $("#home");
  const grid = $("#grid");
  const dock = $("#dock");
  const appEl = $("#app");
  const homebar = $("#homebar");

  const W = 393;
  const iOS = (window.iOS = { W, H: 852, scale: 1, apps: {}, screen });

  /* app yang filenya baru dimuat setelah HP dibuka (supaya halaman awal ringan) */
  const LAZY = {
    notes: ["css/notes.css", "js/notes.js"],
    phone: ["css/phone.css", "js/phone.js"],
    instagram: ["css/instagram.css", "js/instagram.js"],
  };

  /* ---------------------------------------------------------- alat bantu */

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const h = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  iOS.esc = esc;
  iOS.h = h;

  const initials = (name) =>
    String(name || "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0] || "")
      .join("")
      .toUpperCase();

  /* foto profil bulat; tanpa foto → inisial di lingkaran abu-abu */
  iOS.avatar = (src, name, size, cls = "") =>
    `<span class="ui-avatar ${cls}" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.4)}px">${
      src ? `<img src="${esc(src)}" alt="" draggable="false">` : esc(initials(name))
    }</span>`;

  iOS.appIcon = (id) => (SITE.apps && SITE.apps[id] && SITE.apps[id][1]) || "";

  /* ---------------------------------------------------------- waktu */

  const clockCfg = SITE.clock || {};
  const fixed = clockCfg.fixed ? new Date(String(clockCfg.fixed).trim().replace(" ", "T")) : null;
  const hasFixed = fixed && !isNaN(fixed);

  const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  iOS.WEEKDAYS = WEEKDAYS;
  iOS.MONTHS = MONTHS;

  iOS.hour12 = clockCfg.hour12 !== false;
  iOS.now = () => (hasFixed ? new Date(fixed) : new Date());
  iOS.fmtTime = (d, withAmPm) => {
    const m = String(d.getMinutes()).padStart(2, "0");
    if (!iOS.hour12) return `${String(d.getHours()).padStart(2, "0")}:${m}`;
    const hh = d.getHours() % 12 || 12;
    return `${hh}:${m}${withAmPm ? (d.getHours() < 12 ? " AM" : " PM") : ""}`;
  };

  /* "2026-11-08 21:14" → Date.  "-1 21:14" → kemarin jam 21:14 (dihitung dari hari ini) */
  iOS.parseDate = (s) => {
    s = String(s || "").trim();
    const rel = /^-(\d+)(?:[ T](\d{1,2}):(\d{2}))?$/.exec(s);
    if (rel) {
      const n = iOS.now();
      return new Date(n.getFullYear(), n.getMonth(), n.getDate() - +rel[1], rel[2] ? +rel[2] : 12, rel[3] ? +rel[3] : 0);
    }
    const [day, time] = s.split(/[ T]/);
    const [y, m, d] = day.split("-").map(Number);
    const [hh, mm] = (time || "0:0").split(":").map(Number);
    return new Date(y || 2000, (m || 1) - 1, d || 1, hh || 0, mm || 0);
  };

  /* selisih hari dari "hari ini" (0 = hari ini, 1 = kemarin) */
  iOS.daysAgo = (d) => {
    const a = iOS.now();
    return Math.round((new Date(a.getFullYear(), a.getMonth(), a.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 864e5);
  };

  /* gaya daftar iOS: jam (hari ini) · Yesterday · nama hari · 11/4/26 */
  iOS.listDate = (d) => {
    const n = iOS.daysAgo(d);
    if (n <= 0) return iOS.fmtTime(d, true);
    if (n === 1) return "Yesterday";
    if (n < 7) return WEEKDAYS[d.getDay()];
    return `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(2)}`;
  };

  /* posisi elemen dalam koordinat layar HP (sebelum di-scale) */
  iOS.rect = (node) => {
    const r = node.getBoundingClientRect();
    const s = screen.getBoundingClientRect();
    const k = iOS.scale;
    return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
  };

  /* warna status bar: "light" = putih, "dark" = hitam */
  iOS.setChrome = ({ bar, hideStatus = false, homebar: hb = "" } = {}) => {
    if (bar) screen.dataset.bar = bar;
    screen.dataset.homebar = hb || "";
    screen.classList.toggle("hide-status", !!hideStatus);
  };

  iOS.registerApp = (id, app) => {
    iOS.apps[id] = app;
  };

  /* ---------------------------------------------------------- skala */

  function fit() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const framed = !(vw < 560 && vh > vw); // HP potret: tanpa bingkai, layar penuh
    let H = 852;
    let s;
    let pad = 0;

    if (framed) {
      pad = 12;
      s = Math.min((vw - 32) / (W + 32), (vh - 32) / (H + 32), 1.25);
    } else {
      s = vw / W;
      H = vh / s;
      if (H > 900) H = 900;
      if (H < 660) {
        H = 660;
        s = Math.min(s, vh / H);
      }
      H = Math.round(H);
    }

    iOS.scale = s;
    iOS.H = H;
    device.classList.toggle("framed", framed);
    device.style.setProperty("--H", H + "px");

    const w = (W + 2 * pad) * s;
    const hh = (H + 2 * pad) * s;
    device.style.transform = `translate(${Math.round((vw - w) / 2)}px, ${Math.round((vh - hh) / 2)}px) scale(${s})`;

    layoutHome();
    device.classList.add("ready");
  }

  /* jarak baris ikon menyesuaikan tinggi layar (98pt di iPhone 15) */
  function layoutHome() {
    const rows = getComputedStyle(grid).gridTemplateRows.split(" ").filter(Boolean).length || 1;
    const p = rows > 1 ? (iOS.H - 318) / (rows - 1) : 98;
    device.style.setProperty("--P", Math.max(72, Math.min(98, p)) + "px");
  }

  /* ---------------------------------------------------------- jam */

  const sbTime = $("#sb-time");
  const lockTime = $("#lock-time");
  const lockDate = $("#lock-date");
  let lastMinute = "";

  function tick() {
    const d = iOS.now();
    const t = iOS.fmtTime(d);
    if (t !== lastMinute) {
      lastMinute = t;
      sbTime.textContent = t;
      lockTime.textContent = t;
      lockDate.textContent = `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
      document.querySelectorAll(".cal").forEach((c) => {
        c.firstElementChild.textContent = WEEKDAYS[d.getDay()].slice(0, 3).toUpperCase();
        c.lastElementChild.textContent = d.getDate();
      });
    }
    const sec = d.getSeconds();
    const min = d.getMinutes() + sec / 60;
    const hr = (d.getHours() % 12) + min / 60;
    document.querySelectorAll(".clk").forEach((c) => {
      c.querySelector(".clk-h").setAttribute("transform", `rotate(${hr * 30} 30 30)`);
      c.querySelector(".clk-m").setAttribute("transform", `rotate(${min * 6} 30 30)`);
      c.querySelector(".clk-s").setAttribute("transform", `rotate(${sec * 6} 30 30)`);
    });
  }

  /* ---------------------------------------------------------- home screen */

  function clockArt() {
    let nums = "";
    for (let n = 1; n <= 12; n++) {
      const a = (n * 30 * Math.PI) / 180;
      const x = 30 + Math.sin(a) * 20.800;
      const y = 30 - Math.cos(a) * 20.800 + 2;
      nums += `<text x="${x.toFixed(2)}" y="${y.toFixed(2)}">${n}</text>`;
    }
    return `<svg class="clk" viewBox="0 0 60 60" aria-hidden="true">
      <rect width="60" height="60" fill="#111"/>
      <circle cx="30" cy="30" r="26.500" fill="#fff"/>
      <g font-size="5.600" font-weight="600" text-anchor="middle" fill="#111" font-family="inherit">${nums}</g>
      <g class="clk-h"><path d="M30 31.500V16.500" stroke="#111" stroke-width="2.200" stroke-linecap="round"/></g>
      <g class="clk-m"><path d="M30 31.500V7.500" stroke="#111" stroke-width="1.600" stroke-linecap="round"/></g>
      <circle cx="30" cy="30" r="1.900" fill="#111"/>
      <g class="clk-s"><path d="M30 35.500V6.500" stroke="#ff9500" stroke-width="0.800" stroke-linecap="round"/></g>
      <circle cx="30" cy="30" r="1.100" fill="#ff9500"/>
      <circle cx="30" cy="30" r="0.450" fill="#fff"/>
    </svg>`;
  }

  function iconEl(id, inDock) {
    const [label, src] = (SITE.apps && SITE.apps[id]) || [id, ""];
    const b = document.createElement("button");
    b.type = "button";
    b.className = "icon";
    b.dataset.app = id;
    b.setAttribute("aria-label", label);

    let art = src ? `<img src="${esc(src)}" alt="" draggable="false">` : "";
    if (id === "calendar") art = '<span class="cal"><i></i><b></b></span>';
    if (id === "clock") art = clockArt();

    const badge = SITE.badges && SITE.badges[id];
    b.innerHTML =
      `<span class="icon-img">${art}</span>` +
      (badge ? `<span class="badge">${esc(badge)}</span>` : "") +
      (inDock ? "" : `<span class="icon-label">${esc(label)}</span>`);
    return b;
  }

  function widgetEl(w) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "widget";
    b.dataset.app = w.app || "photos";
    b.setAttribute("aria-label", w.label || "Photo widget");
    b.innerHTML =
      `<span class="widget-img"><img src="${esc(w.widget)}" alt="" draggable="false"></span>` +
      (w.label ? `<span class="icon-label">${esc(w.label)}</span>` : "");
    return b;
  }

  function buildHome() {
    grid.replaceChildren(...(SITE.home || []).map((it) => (typeof it === "string" ? iconEl(it) : widgetEl(it))));
    dock.replaceChildren(...(SITE.dock || []).slice(0, 4).map((id) => iconEl(id, true)));
  }

  /* angka merah di pojok ikon (0 = hilang) */
  iOS.setBadge = (id, n) => {
    home.querySelectorAll(`.icon[data-app="${id}"]`).forEach((b) => {
      let badge = b.querySelector(".badge");
      if (!n) {
        if (badge) badge.remove();
        return;
      }
      if (!badge) {
        badge = h("span", "badge");
        b.querySelector(".icon-img").after(badge);
      }
      badge.textContent = n;
    });
  };

  home.addEventListener("click", (e) => {
    const b = e.target.closest("[data-app]");
    if (b) openApp(b.dataset.app, b);
  });

  /* ---------------------------------------------------------- state: lock → pass → home */

  let state = "lock";
  let pending = null; // app yang dibuka otomatis setelah kode benar (dari notifikasi)
  const unlockHooks = [];
  let everUnlocked = false;

  iOS.isLocked = () => state !== "home";
  iOS.onUnlock = (fn) => unlockHooks.push(fn);

  function setState(s) {
    state = s;
    screen.classList.remove("is-lock", "is-pass", "is-home");
    screen.classList.add("is-" + s);
    $("#passcode").setAttribute("aria-hidden", s === "pass" ? "false" : "true");
  }

  /* ---- notifikasi di lock screen ---- */
  let appNotifs = [];
  let shownNotifs = [];

  function renderLockNotifs() {
    const manual = (SITE.lockNotifications || []).map((n) => ({
      icon: iOS.appIcon(n.app),
      title: n.title || "",
      text: n.text || "",
      time: n.time || "now",
      launch: n.app && (iOS.apps[n.app] || LAZY[n.app]) ? [n.app] : null,
    }));
    shownNotifs = [...manual, ...appNotifs].slice(-4);
    $("#lock-notifs").innerHTML = shownNotifs
      .map(
        (n, i) =>
          `<div class="notif" data-i="${i}">${n.icon ? `<img src="${esc(n.icon)}" alt="">` : ""}<div><b>${esc(
            n.title,
          )}<small>${esc(n.time || "now")}</small></b><span>${esc(n.text)}</span></div></div>`,
      )
      .join("");
  }

  /* dipanggil app (mis. Messages) untuk menampilkan pesan yang belum dibaca */
  iOS.setLockNotifs = (list) => {
    appNotifs = list || [];
    renderLockNotifs();
  };

  /* ---- swipe ke atas di lock screen ---- */
  let drag = null;

  lock.addEventListener("pointerdown", (e) => {
    if (state !== "lock" || e.target.closest(".lock-btn")) return;
    drag = { id: e.pointerId, y: e.clientY, dy: 0, t: performance.now(), notif: e.target.closest(".notif") };
    lock.setPointerCapture(e.pointerId);
    lock.style.transition = "none";
  });

  lock.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    drag.dy = Math.min(0, (e.clientY - drag.y) / iOS.scale);
    lock.style.transform = `translateY(${drag.dy}px)`;
    lock.style.opacity = String(Math.max(0, 1 + drag.dy / 420));
  });

  function endLockDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const { dy, t, notif } = drag;
    drag = null;
    const speed = dy / Math.max(1, performance.now() - t); // pt per ms
    lock.style.transition = "";
    lock.style.transform = "";
    lock.style.opacity = "";
    if (dy < -110 || (dy < -24 && speed < -0.45)) {
      toPass();
    } else if (notif && dy > -8 && e.type === "pointerup") {
      /* ketuk notifikasi → masukkan kode → langsung buka app-nya */
      const n = shownNotifs[+notif.dataset.i];
      pending = (n && n.launch) || null;
      toPass();
    }
  }

  lock.addEventListener("pointerup", endLockDrag);
  lock.addEventListener("pointercancel", endLockDrag);
  $("#lock-hint").addEventListener("click", () => state === "lock" && toPass());

  lock.querySelectorAll(".lock-btn[data-toggle]").forEach((b) =>
    b.addEventListener("click", () => b.classList.toggle("on")),
  );

  /* ---- keypad kode (dipakai lock screen dan iOS.askCode) ---- */
  const LETTERS = ["", "", "ABC", "DEF", "GHI", "JKL", "MNO", "PQRS", "TUV", "WXYZ"];
  const PAD_HTML = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, ""]
    .map((n) =>
      n === ""
        ? '<span class="pc-key gap"></span>'
        : `<button type="button" class="pc-key" data-n="${n}"><b>${n}</b><small>${LETTERS[n]}</small></button>`,
    )
    .join("");

  function makePad(el, { code, onOk, onCancel, hint = "", hintAfter = 2 }) {
    const dots = $(".pc-dots", el);
    const pad = $(".pc-pad", el);
    const cancel = $(".pc-cancel", el);
    const hintEl = $(".pc-hint", el);
    let entered = "";
    let busy = false;
    let fails = 0;

    pad.innerHTML = PAD_HTML;

    const render = () => {
      [...dots.children].forEach((d, i) => d.classList.toggle("on", i < entered.length));
      cancel.textContent = entered ? "Delete" : "Cancel";
    };

    const press = (n) => {
      if (busy || entered.length >= code.length) return;
      entered += n;
      render();
      if (entered.length < code.length) return;
      busy = true;
      setTimeout(() => {
        if (entered === code) {
          busy = false;
          onOk();
          return;
        }
        fails++;
        if (hint && hintEl && fails >= hintAfter) {
          hintEl.textContent = hint;
          hintEl.classList.add("show");
        }
        dots.classList.add("shake");
        setTimeout(() => {
          dots.classList.remove("shake");
          entered = "";
          busy = false;
          render();
        }, 440);
      }, 160);
    };

    pad.addEventListener("pointerdown", (e) => {
      const k = e.target.closest("button.pc-key");
      if (!k) return;
      k.classList.add("down");
      const up = () => k.classList.remove("down");
      k.addEventListener("pointerup", up, { once: true });
      k.addEventListener("pointerleave", up, { once: true });
      k.addEventListener("pointercancel", up, { once: true });
    });

    pad.addEventListener("click", (e) => {
      const k = e.target.closest("button.pc-key");
      if (k) press(k.dataset.n);
    });

    cancel.addEventListener("click", () => {
      if (busy) return;
      if (entered) {
        entered = entered.slice(0, -1);
        render();
      } else {
        onCancel();
      }
    });

    const api = {
      press,
      back: () => cancel.click(),
      reset() {
        entered = "";
        busy = false;
        dots.innerHTML = "<i></i>".repeat(code.length);
        render();
      },
    };
    api.reset();
    return api;
  }

  const code = String(SITE.passcode || "");
  const lockPad = code
    ? makePad($("#passcode"), {
        code,
        onOk: unlock,
        onCancel: () => {
          pending = null;
          setState("lock");
        },
        hint: SITE.passcodeHint || "",
      })
    : null;

  function toPass() {
    if (!lockPad) return unlock();
    lockPad.reset();
    setState("pass");
  }

  function unlock() {
    setState("home");
    home.classList.add("arrive");
    setTimeout(() => home.classList.remove("arrive"), 800);

    const first = !everUnlocked;
    everUnlocked = true;
    unlockHooks.forEach((fn) => fn(first));
    if (first) setTimeout(preloadApps, 900);

    if (pending) {
      const [id, arg] = pending;
      pending = null;
      setTimeout(() => iOS.launch(id, arg), 450);
    }
  }

  function lockPhone() {
    closeSheet();
    if (current) finishClose();
    drag = null;
    pending = null;
    setState("lock");
    iOS.setChrome({ bar: "light" });
  }

  $("#power").addEventListener("click", lockPhone);

  /* ---- layar kode di dalam app (album Hidden, catatan terkunci, …) ----
     iOS.askCode({ title, sub, code, hint }) → Promise<boolean> */
  let sheet = null; // { pad, done }

  function closeSheet() {
    if (sheet) sheet.done(false);
  }

  iOS.askCode = ({ title = "Enter Passcode", sub = "", code: want = code, hint = "" } = {}) =>
    new Promise((resolve) => {
      want = String(want || "");
      if (!want) return resolve(true);
      closeSheet();

      const el = h(
        "div",
        "codesheet",
        `<div class="pc-body"><div class="pc-title">${esc(title)}</div>${
          sub ? `<div class="pc-sub">${esc(sub)}</div>` : ""
        }<div class="pc-dots"></div><div class="pc-hint"></div><div class="pc-pad"></div></div>
         <div class="pc-foot"><span></span><button type="button" class="pc-cancel">Cancel</button></div>`,
      );
      const prev = {
        bar: screen.dataset.bar,
        homebar: screen.dataset.homebar,
        hideStatus: screen.classList.contains("hide-status"),
      };
      const done = (ok) => {
        if (!sheet || sheet.el !== el) return;
        sheet = null;
        el.classList.remove("show");
        if (current) iOS.setChrome(prev);
        setTimeout(() => el.remove(), 320);
        resolve(ok);
      };
      sheet = { el, done, pad: makePad(el, { code: want, hint, onOk: () => done(true), onCancel: () => done(false) }) };
      screen.append(el);
      el.offsetWidth;
      el.classList.add("show");
      iOS.setChrome({ bar: "light", homebar: "light" });
    });

  /* ---------------------------------------------------------- banner notifikasi */

  let bannerTimer = 0;

  iOS.banner = ({ icon = "", title = "", text = "", onTap } = {}) => {
    let b = $("#banner");
    if (!b) {
      b = h("button");
      b.id = "banner";
      b.type = "button";
      screen.append(b);
    }
    const hide = () => b.classList.remove("show");
    b.innerHTML = `${icon ? `<img src="${esc(icon)}" alt="">` : ""}<span><b>${esc(title)}<small>now</small></b><i>${esc(
      text,
    )}</i></span>`;
    b.onclick = () => {
      hide();
      if (onTap) onTap();
    };
    b.classList.remove("show");
    b.offsetWidth;
    b.classList.add("show");
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(hide, 4600);
  };

  /* ---------------------------------------------------------- muat app belakangan */

  const loading = {};

  function loadFile(src) {
    return new Promise((resolve, reject) => {
      const isCss = /\.css$/.test(src);
      const n = document.createElement(isCss ? "link" : "script");
      if (isCss) {
        n.rel = "stylesheet";
        n.href = src;
      } else {
        n.src = src;
      }
      n.onload = resolve;
      n.onerror = reject;
      (isCss ? document.head : document.body).append(n);
    });
  }

  function loadApp(id) {
    if (iOS.apps[id]) return Promise.resolve(true);
    if (!LAZY[id]) return Promise.resolve(false);
    if (!loading[id]) {
      loading[id] = Promise.all(LAZY[id].map(loadFile)).then(
        () => !!iOS.apps[id],
        () => {
          delete loading[id];
          return false;
        },
      );
    }
    return loading[id];
  }

  /* setelah HP dibuka: muat app yang ada di home screen satu per satu, di waktu senggang */
  function preloadApps() {
    const onHome = new Set([...(SITE.home || []), ...(SITE.dock || [])].filter((x) => typeof x === "string"));
    Object.keys(LAZY)
      .filter((id) => onHome.has(id))
      .reduce((p, id) => p.then(() => loadApp(id)).then(() => new Promise((r) => setTimeout(r, 300))), Promise.resolve());
  }

  /* ---------------------------------------------------------- buka / tutup app */

  let current = null; // { id, app, from }
  let closing = false;

  /* app membesar dari kotak ikon: scale + clip-path yang menyamakan
     kotak W x W di dalam app dengan kotak ikon di home screen */
  function iconGeom(node) {
    const H = iOS.H;
    if (!node) return { k: 0.2, T: (H - W) / 2, B: (H - W) / 2, ox: W / 2, oy: H / 2, round: 70 };
    const r = iOS.rect(node);
    const k = r.w / W;
    const T = Math.max(0, Math.min(H - W, (r.y / Math.max(1, H - r.h)) * (H - W)));
    return {
      k,
      T,
      B: H - T - W,
      ox: r.x / (1 - k),
      oy: (r.y - T * k) / (1 - k),
      round: (parseFloat(getComputedStyle(node).borderTopLeftRadius) || 13.500) / k,
    };
  }

  const appFrames = (g) => [
    { transform: `scale(${g.k})`, clipPath: `inset(${g.T}px 0px ${g.B}px 0px round ${g.round}px)` },
    { transform: "scale(1)", clipPath: "inset(0px 0px 0px 0px round 0px)" },
  ];

  function openApp(id, node, arg) {
    if (current || state !== "home") return;
    const app = iOS.apps[id];
    if (!app) {
      if (LAZY[id]) loadApp(id).then((ok) => ok && openApp(id, node, arg));
      return;
    }
    const from = node ? node.querySelector(".icon-img, .widget-img") || node : null;
    const g = iconGeom(from);
    const c = from ? iOS.rect(from) : { x: 0, y: 0, w: W, h: iOS.H };

    current = { id, app, from };
    appEl.hidden = false;
    appEl.replaceChildren();
    appEl.style.transformOrigin = `${g.ox}px ${g.oy}px`;
    home.style.transformOrigin = `${c.x + c.w / 2}px ${c.y + c.h / 2}px`;
    iOS.setChrome({ bar: app.bar || "dark" });
    app.mount(appEl, arg);
    screen.classList.add("in-app");

    appEl.animate(appFrames(g), { duration: 540, easing: "cubic-bezier(0.22, 0.9, 0.28, 1)" });
    appEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: "ease-out" });
  }

  function finishClose() {
    appEl.getAnimations().forEach((a) => a.cancel());
    if (current && current.app.unmount) current.app.unmount();
    appEl.replaceChildren();
    appEl.hidden = true;
    screen.classList.remove("in-app");
    current = null;
    closing = false;
  }

  function closeApp() {
    if (!current || closing) return;
    closeSheet();
    closing = true;
    const g = iconGeom(current.from);
    appEl.style.transformOrigin = `${g.ox}px ${g.oy}px`;
    screen.classList.remove("in-app");
    iOS.setChrome({ bar: "light" });

    const opts = { duration: 460, easing: "cubic-bezier(0.3, 0.75, 0.2, 1)", fill: "forwards" };
    const a = appEl.animate(appFrames(g).reverse(), opts);
    appEl.animate([{ opacity: 1 }, { opacity: 1, offset: 0.72 }, { opacity: 0 }], opts);
    a.onfinish = finishClose;
  }

  iOS.closeApp = closeApp;
  iOS.currentApp = () => (current ? current.id : "");

  /* buka app dari kode (banner, notifikasi, tombol di app lain) */
  iOS.launch = (id, arg) => {
    if (state !== "home") {
      pending = [id, arg];
      return;
    }
    if (current) {
      if (current.id === id && !closing) {
        if (current.app.open) current.app.open(arg);
        return;
      }
      finishClose();
      iOS.setChrome({ bar: "light" });
    }
    openApp(id, home.querySelector(`.icon[data-app="${id}"]`), arg);
  };

  /* garis home: ketuk atau swipe ke atas untuk kembali ke home */
  let hb = null;
  homebar.addEventListener("pointerdown", (e) => {
    hb = { id: e.pointerId, y: e.clientY };
    homebar.setPointerCapture(e.pointerId);
  });
  homebar.addEventListener("pointerup", (e) => {
    if (!hb || e.pointerId !== hb.id) return;
    const dy = (e.clientY - hb.y) / iOS.scale;
    hb = null;
    if (dy < 12) closeApp(); // ketuk (dy ≈ 0) atau swipe ke atas
  });
  homebar.addEventListener("pointercancel", () => (hb = null));

  /* ---------------------------------------------------------- navigasi halaman di dalam app
     const nav = iOS.createStack(wrap)
       nav.root(view) · nav.push(view, instant?) · nav.pop() · nav.top()
     view._bar / view._homebar : warna status bar & garis home ("light" | "dark")
     view._onPop()  : dipanggil saat halaman ditutup
     view._onShow() : dipanggil saat halaman terlihat lagi
     Tombol dengan atribut data-back otomatis memanggil nav.pop().        */

  iOS.createStack = (wrap) => {
    const stack = [];
    let edge = null;
    let swallow = false;

    const top = () => stack[stack.length - 1];
    const sync = () => {
      const t = top();
      if (t && !api.paused) iOS.setChrome({ bar: t._bar || "dark", homebar: t._homebar || "dark" });
    };

    const api = {
      stack,
      top,
      sync,
      paused: false, // true selama ada lapisan lain di atas (mis. story) yang mengatur status bar sendiri

      root(v) {
        wrap.append(v);
        stack.length = 0;
        stack.push(v);
        sync();
      },

      push(v, instant) {
        const under = top();
        v.classList.add("is-pushed");
        if (instant) {
          under.style.transition = "none";
          under.classList.add("is-under");
          wrap.append(v);
          under.offsetWidth;
          under.style.transition = "";
        } else {
          v.classList.add("is-enter");
          wrap.append(v);
          v.offsetWidth; // paksa layout supaya transisinya jalan
          v.classList.remove("is-enter");
          under.classList.add("is-under");
        }
        stack.push(v);
        sync();
      },

      pop() {
        if (stack.length < 2) return false;
        const v = stack.pop();
        const under = top();
        v.classList.add("is-enter");
        under.classList.remove("is-under");
        if (v._onPop) v._onPop();
        if (under._onShow) under._onShow();
        setTimeout(() => v.remove(), 480);
        sync();
        return true;
      },
    };

    /* swipe dari tepi kiri untuk kembali */
    wrap.addEventListener("pointerdown", (e) => {
      if (api.paused || stack.length < 2 || (e.pointerType === "mouse" && e.button !== 0)) return;
      const x = (e.clientX - screen.getBoundingClientRect().left) / iOS.scale;
      if (x > 30) return;
      edge = { id: e.pointerId, x: e.clientX, dx: 0, t: performance.now(), v: top(), under: stack[stack.length - 2], moved: false };
    });

    wrap.addEventListener("pointermove", (e) => {
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
    });

    const edgeUp = (e) => {
      if (!edge || e.pointerId !== edge.id) return;
      const { v, under, dx, t, moved } = edge;
      edge = null;
      if (!moved) return;
      swallow = true;
      setTimeout(() => (swallow = false), 60);
      for (const n of [v, under]) {
        n.style.transition = "";
        n.style.transform = "";
        n.style.filter = "";
      }
      const speed = dx / Math.max(1, performance.now() - t);
      if (e.type === "pointerup" && (dx > W * 0.35 || speed > 0.5)) api.pop();
    };
    wrap.addEventListener("pointerup", edgeUp);
    wrap.addEventListener("pointercancel", edgeUp);

    wrap.addEventListener(
      "click",
      (e) => {
        if (swallow) {
          swallow = false;
          e.stopPropagation();
          return;
        }
        if (e.target.closest("[data-back]")) {
          e.stopPropagation();
          api.pop();
        }
      },
      true,
    );

    return api;
  };

  /* bar atas jadi buram setelah isi halaman digulir */
  iOS.watchScroll = (sc, bar, y = 36) => {
    const f = () => bar.classList.toggle("scrolled", sc.scrollTop > y);
    sc.addEventListener("scroll", f, { passive: true });
    f();
  };

  /* ---------------------------------------------------------- keyboard (desktop) */

  document.addEventListener("keydown", (e) => {
    const pad = sheet ? sheet.pad : state === "pass" ? lockPad : null;
    if (pad) {
      if (/^\d$/.test(e.key)) pad.press(e.key);
      else if (e.key === "Backspace" || e.key === "Escape") pad.back();
    } else if (state === "lock" && (e.key === "Enter" || e.key === " " || e.key === "ArrowUp")) {
      e.preventDefault();
      toPass();
    } else if (e.key === "Escape" && current) {
      if (!(current.app.back && current.app.back())) closeApp();
    }
  });

  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("dragstart", (e) => e.preventDefault());

  /* ---------------------------------------------------------- mulai */

  const wp = SITE.wallpaper || {};
  const cssUrl = (u) => `url("${String(u).replace(/"/g, "%22")}")`;
  if (wp.home) $("#wall-home").style.backgroundImage = cssUrl(wp.home);
  if (wp.lock || wp.home) {
    $("#wall-lock").style.backgroundImage = cssUrl(wp.lock || wp.home);
    $("#pc-bg").style.backgroundImage = cssUrl(wp.lock || wp.home);
  }

  const level = Math.max(0, Math.min(100, Number(SITE.battery ?? 100))) / 100;
  $("#sb-batt-fill").style.setProperty("--level", level);

  buildHome();
  renderLockNotifs();
  fit();
  tick();
  setInterval(tick, 1000);
  window.addEventListener("resize", fit);
  window.addEventListener("orientationchange", fit);
})();
