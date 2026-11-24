/* ============================================================
   App Messages — daftar chat, percakapan, balasan interaktif,
   pesan masuk terjadwal, notifikasi lock screen + banner.
   Datanya dari data/messages.js.
   ============================================================ */
(() => {
  "use strict";

  const iOS = window.iOS;
  const D = window.MESSAGES || {};
  const { h, esc } = iOS;
  const ICON = iOS.appIcon("messages");

  const svg = (inner, extra = "") =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${inner}</svg>`;

  const I = {
    back: '<svg class="chev" viewBox="0 0 12 21" fill="none" stroke="currentColor" stroke-width="2.600" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2 2 10.500 10 19"/></svg>',
    chev: '<svg viewBox="0 0 8 14" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.500 1.500 6.500 7l-5 5.500"/></svg>',
    search: svg('<circle cx="10.500" cy="10.500" r="6.500"/><path d="m15.500 15.500 5 5"/>', 'stroke-width="2.200"'),
    mic: svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.500 11.500a6.500 6.500 0 0 0 13 0M12 18v3"/>'),
    compose: svg('<path d="M19.500 13v5.500a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2H11"/><path d="M20.300 3.700a1.800 1.800 0 0 0-2.500 0L10.500 11l-.8 3.300 3.300-.8 7.300-7.300a1.800 1.800 0 0 0 0-2.500Z"/>'),
    video: svg('<rect x="2.500" y="6.500" width="13" height="11" rx="3"/><path d="m15.500 11 5.200-3.200a.5.500 0 0 1 .8.400v7.600a.5.500 0 0 1-.8.400L15.500 13"/>', 'class="cam"'),
    plus: svg('<path d="M12 5v14M5 12h14"/>', 'stroke-width="2.400"'),
  };

  /* ---------------------------------------------------------- data & state */

  const norm = ([k, p]) => {
    if (k === "d") return { k, text: String(p || "") };
    if (p && typeof p === "object") return { k, text: p.text || "", img: p.img || "" };
    return { k, text: String(p || ""), img: "" };
  };

  const chats = (D.chats || []).map((c) => ({
    id: c.id,
    name: c.name || c.id,
    avatar: c.avatar || "",
    unread: c.unread || 0,
    time: c.time || "",
    status: c.status || "",
    log: (c.messages || []).map(norm),
    script: c.script || [],
    step: 0,
    busy: false,
    typing: false,
  }));

  const byId = (id) => chats.find((c) => c.id === id);
  const label = (m) => (m.img && !m.text ? "Attachment: 1 Image" : m.text);
  const totalUnread = () => chats.reduce((n, c) => n + c.unread, 0);

  function preview(c) {
    for (let i = c.log.length - 1; i >= 0; i--) if (c.log[i].k !== "d") return label(c.log[i]);
    return "";
  }

  let ui = null; // ada hanya selama app terbuka

  /* angka merah di ikon + notifikasi di lock screen */
  function refreshShell() {
    iOS.setBadge("messages", totalUnread());
    const notifs = [];
    for (const c of chats) {
      if (!c.unread) continue;
      for (const m of c.log.filter((x) => x.k === "t").slice(-c.unread)) {
        notifs.push({ icon: ICON, title: c.name, text: label(m), time: m.at || c.time || "now", launch: ["messages", { chat: c.id }] });
      }
    }
    iOS.setLockNotifs(notifs);
  }

  /* pesan baru masuk ke sebuah chat (dari dia atau dari kamu) */
  function deliver(c, m) {
    m.at = "now";
    m.fresh = true;
    c.log.push(m);
    c.time = iOS.fmtTime(iOS.now(), true);
    c.status = m.k === "m" ? "Delivered" : "";
    chats.splice(chats.indexOf(c), 1);
    chats.unshift(c);

    const reading = ui && ui.chat === c;
    if (!reading && m.k === "t") {
      c.unread++;
      if (!iOS.isLocked()) {
        iOS.banner({ icon: ICON, title: c.name, text: label(m), onTap: () => iOS.launch("messages", { chat: c.id }) });
      }
    }
    refreshShell();
    if (ui) ui.changed(c);
  }

  /* ---- balasan interaktif ---- */
  function nextStep(c, choice) {
    if (choice.goto === "end") return -1;
    if (choice.goto != null) return c.script.findIndex((s) => s.id === choice.goto);
    return c.step + 1 < c.script.length ? c.step + 1 : -1;
  }

  function setTyping(c, on) {
    c.typing = on;
    if (ui) ui.changed(c);
  }

  function choose(c, choice) {
    if (c.busy) return;
    c.busy = true;
    deliver(c, { k: "m", text: choice.say, img: "" });

    let t = 1100;
    for (const r of choice.reply || []) {
      const m = norm(["t", r]);
      const typing = Math.min(2400, 800 + m.text.length * 38);
      setTimeout(() => setTyping(c, true), t);
      t += typing;
      setTimeout(() => {
        c.typing = false;
        deliver(c, m);
      }, t);
      t += 650;
    }
    setTimeout(() => {
      c.busy = false;
      c.step = nextStep(c, choice);
      if (ui) ui.changed(c);
    }, t);
  }

  /* pesan terjadwal: mulai dihitung saat HP pertama kali dibuka */
  iOS.onUnlock((first) => {
    if (!first) return;
    for (const n of D.incoming || []) {
      const c = byId(n.chat);
      if (!c) continue;
      setTimeout(() => deliver(c, norm(["t", n.img ? { img: n.img, text: n.text } : n.text])), (n.after || 5) * 1000);
    }
  });

  /* ---------------------------------------------------------- tampilan */

  function listView() {
    const v = h("div", "nv-view msg-list");
    v._bar = "dark";
    v.innerHTML = `
      <div class="nv-scroll">
        <h1 class="ui-large">Messages</h1>
        <div class="ui-search">${I.search}<span>Search</span>${I.mic}</div>
        <div class="msg-rows"></div>
      </div>
      <div class="ui-bar">
        <button type="button" class="ui-btn">Edit</button>
        <span class="ttl">Messages</span>
        <button type="button" class="ui-btn" aria-label="Compose">${I.compose}</button>
      </div>`;
    const rows = v.querySelector(".msg-rows");
    v._render = () => {
      rows.innerHTML = chats
        .map(
          (c) => `<button type="button" class="msg-row" data-chat="${esc(c.id)}">
            <i class="dot${c.unread ? " on" : ""}"></i>${iOS.avatar(c.avatar, c.name, 45)}
            <span class="tx"><b><span>${esc(c.name)}</span><small>${esc(c.time)}${I.chev}</small></b><em>${esc(preview(c))}</em></span>
          </button>`,
        )
        .join("");
    };
    v._render();
    v._onShow = v._render;
    rows.addEventListener("click", (e) => {
      const r = e.target.closest(".msg-row");
      if (r) openChat(r.dataset.chat);
    });
    iOS.watchScroll(v.querySelector(".nv-scroll"), v.querySelector(".ui-bar"));
    return v;
  }

  const stamp = (text) => {
    const m = /^(.*?)(\d{1,2}[:.]\d{2}.*)$/.exec(text);
    return `<div class="stamp">${m ? `<b>${esc(m[1])}</b>${esc(m[2])}` : `<b>${esc(text)}</b>`}</div>`;
  };

  function threadHTML(c) {
    let out = "";
    const log = c.log;
    for (let i = 0; i < log.length; i++) {
      const m = log[i];
      if (m.k === "d") {
        out += stamp(m.text);
        continue;
      }
      const prev = log[i - 1];
      const next = log[i + 1];
      const gap = prev && prev.k !== "d" && prev.k !== m.k ? " gap" : "";
      const last = !next || next.k !== m.k;
      const fresh = m.fresh ? " new" : "";
      m.fresh = false;
      if (m.img) {
        out += `<div class="bub pic ${m.k}${gap}${fresh}"><img src="${esc(m.img)}" alt="" draggable="false"></div>`;
      }
      if (m.text) {
        const tail = last && !(c.typing && i === log.length - 1 && m.k === "t") ? " tail" : "";
        out += `<div class="bub ${m.k}${m.img ? "" : gap}${tail}${fresh}">${esc(m.text)}</div>`;
      }
    }
    const lastMsg = log[log.length - 1];
    if (c.status && lastMsg && lastMsg.k === "m") out += `<div class="msg-status">${esc(c.status)}</div>`;
    if (c.typing) {
      const gap = lastMsg && lastMsg.k === "m" ? " gap" : "";
      out += `<div class="bub t tail typing${gap}"><i></i><i></i><i></i></div>`;
    }
    return out;
  }

  function chatView(c) {
    const v = h("div", "nv-view msg-chat");
    v._bar = "dark";
    v.innerHTML = `
      <div class="nv-scroll"><div class="thread"></div></div>
      <div class="msg-head">
        <button type="button" class="ui-btn" data-back aria-label="Back">${I.back}<span class="cnt"></span></button>
        <div class="who">${iOS.avatar(c.avatar, c.name, 48)}<span>${esc(c.name)}${I.chev}</span></div>
        <button type="button" class="ui-btn" aria-label="FaceTime">${I.video}</button>
      </div>
      <div class="msg-foot">
        <div class="msg-choices"></div>
        <div class="msg-input"><span class="plus">${I.plus}</span><span class="field">iMessage${I.mic}</span></div>
      </div>`;

    const sc = v.querySelector(".nv-scroll");
    const thread = v.querySelector(".thread");
    const foot = v.querySelector(".msg-foot");
    const choices = v.querySelector(".msg-choices");
    const cnt = v.querySelector(".cnt");
    let shown = "";

    const toBottom = (smooth) => sc.scrollTo({ top: sc.scrollHeight, behavior: smooth ? "smooth" : "auto" });

    v._render = (smooth) => {
      thread.innerHTML = threadHTML(c);

      const step = c.busy ? null : c.script[c.step];
      const key = step ? String(c.step) : "";
      if (key !== shown) {
        shown = key;
        choices.innerHTML = step
          ? step.choices.map((o, i) => `<button type="button" data-i="${i}">${esc(o.say)}</button>`).join("")
          : "";
      }
      thread.style.setProperty("--foot", foot.offsetHeight + "px");

      const others = totalUnread() - c.unread;
      cnt.textContent = others > 0 ? others : "";
      toBottom(smooth);
    };

    choices.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      const step = c.script[c.step];
      if (b && step && !c.busy) choose(c, step.choices[+b.dataset.i]);
    });

    v._onPop = () => {
      ui.chat = null;
    };
    return v;
  }

  function openChat(id, instant) {
    const c = byId(id);
    if (!c || !ui) return;
    if (ui.chat === c) return;
    if (ui.chat) ui.nav.pop();
    c.unread = 0;
    ui.chat = c;
    refreshShell();
    const v = chatView(c);
    ui.chatView = v;
    ui.nav.push(v, instant);
    v._render(false);
    /* foto mengubah tinggi isi setelah termuat → gulir lagi ke bawah */
    v.querySelectorAll(".thread img").forEach((im) =>
      im.addEventListener("load", () => v.querySelector(".nv-scroll").scrollTo({ top: 1e6 }), { once: true }),
    );
  }

  /* ---------------------------------------------------------- daftar ke iOS */

  iOS.registerApp("messages", {
    bar: "dark",

    mount(root, arg) {
      const wrap = h("div", "nv msg");
      root.append(wrap);
      const nav = iOS.createStack(wrap);
      const list = listView();
      ui = {
        nav,
        list,
        chat: null,
        chatView: null,
        /* dipanggil setiap ada pesan / status baru di chat `c` */
        changed(c) {
          list._render();
          if (ui.chat === c) {
            c.unread = 0;
            ui.chatView._render(true);
          } else if (ui.chat) {
            ui.chatView._render(false);
          }
        },
      };
      nav.root(list);
      if (arg && arg.chat) openChat(arg.chat, true);
    },

    open(arg) {
      if (arg && arg.chat) openChat(arg.chat);
    },

    unmount() {
      ui = null;
    },

    back() {
      return ui ? ui.nav.pop() : false;
    },
  });

  refreshShell();
})();
