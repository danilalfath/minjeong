/* ============================================================
   App Phone — Favorites, Recents, Contacts, Keypad, Voicemail,
   dan kartu kontak. Datanya dari data/calls.js.
   ============================================================ */
(() => {
  "use strict";

  const iOS = window.iOS;
  const SITE = window.SITE || {};
  const C = window.CALLS || {};
  const { h, esc, MONTHS } = iOS;

  const svg = (inner, extra = "") =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.900" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${inner}</svg>`;
  const fill = (inner) => `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${inner}</svg>`;

  const HANDSET =
    '<path d="M6.600 10.800c1.400 2.800 3.800 5.100 6.600 6.600l2.200-2.200c.3-.3.7-.4 1-.2 1.100.4 2.300.6 3.600.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.600 21 3 13.400 3 4c0-.6.4-1 1-1h3.500c.6 0 1 .4 1 1 0 1.300.2 2.500.6 3.600.1.3 0 .7-.2 1l-2.300 2.200Z"/>';

  const I = {
    back: '<svg class="chev" viewBox="0 0 12 21" fill="none" stroke="currentColor" stroke-width="2.600" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2 2 10.500 10 19"/></svg>',
    star: fill('<path d="m12 2.800 2.800 5.900 6.400.8-4.700 4.400 1.200 6.400L12 17.200l-5.700 3.100 1.200-6.400-4.700-4.400 6.400-.8L12 2.800Z"/>'),
    clock: fill('<path d="M12 2.500a9.500 9.500 0 1 0 0 19 9.500 9.500 0 0 0 0-19Zm.9 4.300v5l3.500 2.100-.9 1.500-4.400-2.600V6.800h1.800Z"/>'),
    person: fill('<path d="M12 2.500a9.500 9.500 0 1 0 0 19 9.500 9.500 0 0 0 0-19Zm0 4a3.300 3.300 0 1 1 0 6.600 3.300 3.300 0 0 1 0-6.600Zm0 13.200a7.600 7.600 0 0 1-5.700-2.600c1.200-1.700 3.300-2.700 5.700-2.700s4.500 1 5.700 2.700a7.600 7.600 0 0 1-5.700 2.600Z"/>'),
    keypad: fill(
      [5.500, 12, 18.500]
        .map((x) => [4.500, 10, 15.500].map((y) => `<circle cx="${x}" cy="${y}" r="1.900"/>`).join(""))
        .join("") + '<circle cx="12" cy="21" r="1.900"/>',
    ),
    voicemail: svg('<circle cx="6.500" cy="12" r="4"/><circle cx="17.500" cy="12" r="4"/><path d="M6.500 16h11"/>', 'stroke-width="2.100"'),
    info: svg('<circle cx="12" cy="12" r="9.300"/><path d="M12 11v5.500"/><circle cx="12" cy="7.600" r="0.700" fill="currentColor"/>', 'stroke-width="1.600"'),
    out: `<svg class="out" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${HANDSET.replace('d="', 'transform="scale(.78) translate(0 6)" d="')}<path d="M15 3h6v6M21 3l-6.500 6.500" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    phone: fill(HANDSET),
    video: fill('<path d="M5 6.500h8.500a2.500 2.500 0 0 1 2.500 2.500v6a2.500 2.500 0 0 1-2.500 2.500H5A2.500 2.500 0 0 1 2.500 15V9A2.500 2.500 0 0 1 5 6.500Zm12.500 4 3.200-2.300c.5-.3 1.100 0 1.100.6v6.400c0 .6-.6.9-1.100.6l-3.200-2.300v-3Z"/>'),
    message: fill('<path d="M12 3.500c5.200 0 9.500 3.500 9.500 7.900s-4.300 7.900-9.500 7.900c-.9 0-1.800-.1-2.600-.3-1.300 1-2.900 1.500-4.500 1.500.9-.9 1.500-2 1.700-3.200-1.900-1.400-3.100-3.500-3.100-5.900 0-4.400 4.300-7.900 9.500-7.900Z"/>'),
    mail: fill('<path d="M4.500 5.500h15A2 2 0 0 1 21.500 7.200L12 13 2.500 7.200a2 2 0 0 1 2-1.700Zm17 3.800V17a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2V9.300l9.500 5.800 9.500-5.800Z"/>'),
    play: fill('<path d="M7 4.300v15.400c0 .8.9 1.300 1.600.8l11.500-7.700c.6-.4.6-1.200 0-1.600L8.600 3.500C7.900 3 7 3.500 7 4.300Z"/>'),
    pause: fill('<rect x="5.500" y="4" width="4.500" height="16" rx="1.200"/><rect x="14" y="4" width="4.500" height="16" rx="1.200"/>'),
    speaker: fill('<path d="M4 9.500h3l4.200-3.600c.5-.4 1.300-.1 1.300.6v11c0 .7-.8 1-1.300.6L7 14.500H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z"/><path d="M15.500 9a4.200 4.200 0 0 1 0 6M18 6.500a7.700 7.700 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round"/>'),
    trash: svg('<path d="M4.500 6.500h15M9.500 6.500V5A1.500 1.500 0 0 1 11 3.500h2A1.500 1.500 0 0 1 14.500 5v1.500M6.500 6.500l.8 12.100a2 2 0 0 0 2 1.900h5.400a2 2 0 0 0 2-1.900l.8-12.100M10 10.500v6M14 10.500v6"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>', 'stroke-width="2.200"'),
    search: svg('<circle cx="10.500" cy="10.500" r="6.500"/><path d="m15.500 15.500 5 5"/>', 'stroke-width="2.200"'),
    del: fill('<path d="M9.300 5h9.200A2.500 2.500 0 0 1 21 7.500v9a2.500 2.500 0 0 1-2.500 2.500H9.300a2.500 2.500 0 0 1-1.900-.9l-4.100-4.700a2.100 2.100 0 0 1 0-2.800l4.100-4.700A2.500 2.500 0 0 1 9.300 5Zm1.800 3.900-1 1 2.100 2.100-2.100 2.100 1 1 2.100-2.100 2.100 2.100 1-1-2.100-2.100 2.100-2.100-1-1-2.100 2.100-2.100-2.100Z"/>'),
  };

  /* ---------------------------------------------------------- data */

  const contacts = (C.contacts || []).map((c) => ({
    id: c.id,
    name: c.name || c.id,
    number: c.number || "",
    label: c.label || "mobile",
    avatar: c.avatar || "",
    favorite: !!c.favorite,
  }));

  /* id kontak, atau nomor tak dikenal */
  const who = (id) => contacts.find((c) => c.id === id) || { id, name: id, number: id, label: "", avatar: "", unknown: true };

  const recents = (C.recents || []).map((r) => ({ ...r, date: iOS.parseDate(r.when) })).sort((a, b) => b.date - a.date);
  const voicemail = (C.voicemail || []).map((m) => ({ ...m, date: iOS.parseDate(m.when), heard: !!m.heard, pos: 0 })).sort((a, b) => b.date - a.date);

  const chatIds = new Set(((window.MESSAGES || {}).chats || []).map((c) => c.id));
  const unheard = () => voicemail.filter((m) => !m.heard).length;

  const dur = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const longDate = (d) => `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  const dayHead = (d) => (iOS.daysAgo(d) <= 0 ? "Today" : iOS.daysAgo(d) === 1 ? "Yesterday" : longDate(d));
  const CALL_KIND = { missed: "Missed Call", in: "Incoming Call", out: "Outgoing Call" };

  /* ---------------------------------------------------------- state */

  let root = null;
  let wrap = null;
  let nav = null;
  let filter = "all";
  let dial = "";
  let player = null; // { m, btn, timer, audio }

  function stopPlayer() {
    if (!player) return;
    clearInterval(player.timer);
    if (player.audio) player.audio.pause();
    player.btn.innerHTML = I.play;
    player = null;
  }

  function syncBadges() {
    const n = unheard();
    iOS.setBadge("phone", n);
    const tabBadge = root && root.querySelector(".pn-tabbadge");
    if (tabBadge) {
      tabBadge.textContent = n;
      tabBadge.hidden = !n;
    }
  }

  /* ---------------------------------------------------------- tab: Recents */

  function recentsView() {
    const v = h("div", "nv-view");
    const list = recents.filter((r) => filter === "all" || r.type === "missed");
    const rows = list
      .map((r) => {
        const c = who(r.who);
        const sub = r.kind || (c.unknown ? r.place || "unknown" : c.label);
        return `<button type="button" class="pn-row${r.type === "missed" ? " missed" : ""}" data-who="${esc(c.id)}">${
          r.type === "out" ? I.out : ""
        }<span class="mid"><span class="tx"><b>${esc(c.name)}${r.count > 1 ? ` (${r.count})` : ""}</b><small>${esc(sub)}</small></span><span class="when">${esc(
          iOS.listDate(r.date),
        )}</span><span class="info">${I.info}</span></span></button>`;
      })
      .join("");
    v.innerHTML = `
      <div class="nv-scroll"><h1 class="ui-large">Recents</h1>${rows || '<div class="pn-empty">No Items</div>'}</div>
      <div class="ui-bar solid"><span></span>
        <div class="pn-seg"><button type="button" data-f="all" class="${filter === "all" ? "on" : ""}">All</button><button type="button" data-f="missed" class="${
          filter === "missed" ? "on" : ""
        }">Missed</button></div>
        <button type="button" class="ui-btn">Edit</button>
      </div>`;
    v.addEventListener("click", (e) => {
      const f = e.target.closest("[data-f]");
      if (f) {
        filter = f.dataset.f;
        return show("recents");
      }
      const r = e.target.closest(".pn-row");
      if (r) nav.push(cardView(who(r.dataset.who), "Recents"));
    });
    return v;
  }

  /* ---------------------------------------------------------- kartu kontak */

  function cardView(c, backLabel) {
    const v = h("div", "nv-view gray");
    const calls = recents.filter((r) => r.who === c.id).slice(0, 6);
    let log = "";
    let lastDay = "";
    for (const r of calls) {
      const day = dayHead(r.date);
      if (day !== lastDay) log += `<div class="day">${esc(day)}</div>`;
      lastDay = day;
      log += `<div class="call"><i>${esc(iOS.fmtTime(r.date, true))}</i><span>${CALL_KIND[r.type] || "Call"}${
        r.count > 1 ? ` (${r.count})` : ""
      }<em>${r.kind ? " · " + esc(r.kind) : ""}</em></span></div>`;
    }
    const canText = chatIds.has(c.id);
    v.innerHTML = `
      <div class="nv-scroll"><div class="pn-card">
        ${iOS.avatar(c.avatar, c.unknown ? "" : c.name, 100)}
        <h2>${esc(c.name)}</h2>
        <div class="pn-acts">
          <button type="button" data-act="message" class="${canText ? "" : "off"}">${I.message}message</button>
          <button type="button">${I.phone}${esc(c.label || "call")}</button>
          <button type="button">${I.video}video</button>
          <button type="button" class="off">${I.mail}mail</button>
        </div>
        ${log ? `<div class="pn-box">${log}</div>` : ""}
        ${c.unknown ? "" : `<div class="pn-box"><div><small>${esc(c.label)}</small><span class="blue">${esc(c.number)}</span></div></div>`}
        <div class="pn-box"><div class="notes"><small>Notes</small></div></div>
        <div class="pn-box">
          <button type="button" data-act="message">Send Message</button>
          <button type="button">Share Contact</button>
          <button type="button">${c.unknown ? "Create New Contact" : c.favorite ? "Remove from Favorites" : "Add to Favorites"}</button>
        </div>
        <div class="pn-box"><button type="button" class="red">Block Caller</button></div>
      </div></div>
      <div class="ui-bar">
        <button type="button" class="ui-btn" data-back>${I.back}${esc(backLabel)}</button>
        <span class="ttl">${esc(c.name)}</span>
        <button type="button" class="ui-btn">${c.unknown ? "" : "Edit"}</button>
      </div>`;
    v.querySelector(".ui-bar").style.setProperty("--bar-bg", "rgba(242, 242, 247, 0.86)");
    iOS.watchScroll(v.querySelector(".nv-scroll"), v.querySelector(".ui-bar"), 150);
    v.addEventListener("click", (e) => {
      if (e.target.closest('[data-act="message"]') && canText) iOS.launch("messages", { chat: c.id });
    });
    return v;
  }

  /* ---------------------------------------------------------- tab: Voicemail */

  function voicemailView() {
    const v = h("div", "nv-view");
    const rows = voicemail
      .map((m, i) => {
        const c = who(m.who);
        return `<div class="pn-vm" data-i="${i}">
          <button type="button" class="pn-row">${m.heard ? "" : '<i class="dot"></i>'}<span class="mid"><span class="tx"><b>${esc(
            c.name,
          )}</b><small>${esc(c.unknown ? "unknown" : c.label)}</small></span><span class="when">${esc(iOS.listDate(m.date))}<br>${dur(
            m.duration,
          )}</span><span class="info">${I.info}</span></span></button>
          <div class="pn-vmx">
            <div class="stamp">${esc(longDate(m.date))} at ${esc(iOS.fmtTime(m.date, true))}</div>
            <div class="pn-track"><i></i></div>
            <div class="pn-times"><span class="cur">0:00</span><span class="rem">-${dur(m.duration)}</span></div>
            <div class="pn-ctl">
              <button type="button" class="play" aria-label="Play">${I.play}</button>
              <button type="button" class="rnd" aria-label="Speaker">${I.speaker}</button>
              <button type="button" class="rnd" aria-label="Call back">${I.phone}</button>
              <button type="button" class="rnd red" aria-label="Delete">${I.trash}</button>
            </div>
            ${m.transcript ? `<h4>Transcription</h4><p>“${esc(m.transcript)}”</p>` : ""}
          </div>
        </div>`;
      })
      .join("");
    v.innerHTML = `
      <div class="nv-scroll"><h1 class="ui-large">Voicemail</h1>${rows || '<div class="pn-empty">No Voicemail</div>'}</div>
      <div class="ui-bar"><button type="button" class="ui-btn">Greeting</button><span class="ttl">Voicemail</span><button type="button" class="ui-btn">Edit</button></div>`;
    iOS.watchScroll(v.querySelector(".nv-scroll"), v.querySelector(".ui-bar"));

    v.addEventListener("click", (e) => {
      const box = e.target.closest(".pn-vm");
      if (!box) return;
      const m = voicemail[+box.dataset.i];
      if (e.target.closest(".play")) return togglePlay(m, box);
      if (!e.target.closest(".pn-row")) return;

      /* buka / tutup satu pesan suara */
      const open = !box.classList.contains("open");
      stopPlayer();
      v.querySelectorAll(".pn-vm.open").forEach((n) => n.classList.remove("open"));
      box.classList.toggle("open", open);
      if (open && !m.heard) {
        m.heard = true;
        const dot = box.querySelector(".dot");
        if (dot) dot.remove();
        syncBadges();
      }
    });
    return v;
  }

  function togglePlay(m, box) {
    const btn = box.querySelector(".play");
    if (player && player.m === m) return stopPlayer(); // jeda, posisinya disimpan di m.pos
    stopPlayer();

    const bar = box.querySelector(".pn-track i");
    const cur = box.querySelector(".cur");
    const rem = box.querySelector(".rem");
    let audio = null;
    if (m.audio) {
      audio = new Audio(m.audio);
      audio.currentTime = m.pos;
      audio.play().catch(() => {});
    }
    const t0 = performance.now() - m.pos * 1000;
    const paint = () => {
      m.pos = Math.min(m.duration, (performance.now() - t0) / 1000);
      const done = m.pos >= m.duration;
      if (done) m.pos = 0;
      bar.style.width = (m.pos / m.duration) * 100 + "%";
      cur.textContent = dur(m.pos);
      rem.textContent = "-" + dur(m.duration - m.pos);
      if (done) stopPlayer();
    };
    player = { m, btn, audio, timer: setInterval(paint, 100) };
    btn.innerHTML = I.pause;
  }

  /* ---------------------------------------------------------- tab: Contacts & Favorites */

  function contactsView() {
    const v = h("div", "nv-view");
    const owner = SITE.owner || {};
    const sorted = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
    let body = "";
    let letter = "";
    for (const c of sorted) {
      const l = (c.name[0] || "#").toUpperCase();
      if (l !== letter) body += `<h3 class="pn-letter">${esc(l)}</h3>`;
      letter = l;
      body += `<button type="button" class="pn-name" data-who="${esc(c.id)}">${esc(c.name)}</button>`;
    }
    v.innerHTML = `
      <div class="nv-scroll"><h1 class="ui-large">Contacts</h1>
        <div class="ui-search">${I.search}<span>Search</span></div>
        <div class="pn-mycard">${iOS.avatar(owner.avatar, owner.name, 60)}<span><b>${esc(owner.name || "")}</b><small>My Card</small></span></div>
        ${body}
      </div>
      <div class="ui-bar"><button type="button" class="ui-btn">${I.back}Lists</button><span class="ttl">Contacts</span><button type="button" class="ui-btn" aria-label="Add">${I.plus}</button></div>`;
    iOS.watchScroll(v.querySelector(".nv-scroll"), v.querySelector(".ui-bar"));
    v.addEventListener("click", (e) => {
      const r = e.target.closest(".pn-name");
      if (r) nav.push(cardView(who(r.dataset.who), "Contacts"));
    });
    return v;
  }

  function favoritesView() {
    const v = h("div", "nv-view");
    const rows = contacts
      .filter((c) => c.favorite)
      .map(
        (c) =>
          `<button type="button" class="pn-row with-avatar" data-who="${esc(c.id)}">${iOS.avatar(c.avatar, c.name, 40)}<span class="mid"><span class="tx"><b>${esc(
            c.name,
          )}</b><small>${I.phone}${esc(c.label)}</small></span><span class="info">${I.info}</span></span></button>`,
      )
      .join("");
    v.innerHTML = `
      <div class="nv-scroll"><h1 class="ui-large">Favorites</h1>${rows || '<div class="pn-empty">No Favorites</div>'}</div>
      <div class="ui-bar"><button type="button" class="ui-btn" aria-label="Add">${I.plus}</button><span class="ttl">Favorites</span><button type="button" class="ui-btn">Edit</button></div>`;
    iOS.watchScroll(v.querySelector(".nv-scroll"), v.querySelector(".ui-bar"));
    v.addEventListener("click", (e) => {
      const r = e.target.closest(".pn-row");
      if (r) nav.push(cardView(who(r.dataset.who), "Favorites"));
    });
    return v;
  }

  /* ---------------------------------------------------------- tab: Keypad */

  function keypadView() {
    const v = h("div", "nv-view");
    const L = { 2: "ABC", 3: "DEF", 4: "GHI", 5: "JKL", 6: "MNO", 7: "PQRS", 8: "TUV", 9: "WXYZ", 0: "+" };
    const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"]
      .map((k) =>
        typeof k === "number"
          ? `<button type="button" data-k="${k}"><b>${k}</b><small>${L[k] || ""}</small></button>`
          : `<button type="button" data-k="${k}" class="sym${k === "*" ? " star" : ""}"><b>${k}</b></button>`,
      )
      .join("");
    v.innerHTML = `<div class="pn-keys">
        <div class="pn-num"></div>
        <div class="pn-pad">${keys}</div>
        <div class="pn-callrow"><button type="button" class="pn-call" aria-label="Call">${I.phone}</button><button type="button" class="pn-del" aria-label="Delete">${I.del}</button></div>
      </div>`;
    const num = v.querySelector(".pn-num");
    const del = v.querySelector(".pn-del");
    const paint = () => {
      num.textContent = dial;
      del.classList.toggle("show", !!dial);
    };
    paint();
    v.querySelector(".pn-pad").addEventListener("pointerdown", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      b.classList.add("down");
      const up = () => b.classList.remove("down");
      b.addEventListener("pointerup", up, { once: true });
      b.addEventListener("pointerleave", up, { once: true });
      b.addEventListener("pointercancel", up, { once: true });
      if (dial.length < 16) dial += b.dataset.k;
      paint();
    });
    del.addEventListener("click", () => {
      dial = dial.slice(0, -1);
      paint();
    });
    return v;
  }

  /* ---------------------------------------------------------- tab bar */

  const TABS = [
    ["favorites", "Favorites", I.star, favoritesView],
    ["recents", "Recents", I.clock, recentsView],
    ["contacts", "Contacts", I.person, contactsView],
    ["keypad", "Keypad", I.keypad, keypadView],
    ["voicemail", "Voicemail", I.voicemail, voicemailView],
  ];

  function show(name) {
    stopPlayer();
    const t = TABS.find((x) => x[0] === name) || TABS[1];
    wrap.replaceChildren();
    const v = t[3]();
    v._bar = "dark";
    nav.root(v);
    root.querySelectorAll(".ui-tabbar button").forEach((b) => b.classList.toggle("on", b.dataset.tab === t[0]));
  }

  iOS.registerApp("phone", {
    bar: "dark",

    mount(el) {
      root = h("div", "pn");
      root.innerHTML = `<div class="nv"></div><div class="ui-tabbar">${TABS.map(
        ([id, name, icon]) =>
          `<button type="button" data-tab="${id}">${icon}${name}${id === "voicemail" ? '<i class="pn-tabbadge" hidden></i>' : ""}</button>`,
      ).join("")}</div>`;
      el.append(root);
      wrap = root.firstElementChild;
      nav = iOS.createStack(wrap);
      root.querySelector(".ui-tabbar").addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (b) show(b.dataset.tab);
      });
      filter = "all";
      show("recents");
      syncBadges(); // membuka Phone = panggilan tak terjawab sudah dilihat; sisa angka = voicemail baru
    },

    unmount() {
      stopPlayer();
      root = wrap = nav = null;
    },

    back() {
      return nav ? nav.pop() : false;
    },
  });
})();
