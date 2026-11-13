/* ============================================================
   App Instagram — beranda (story + feed), profil, daftar post,
   DM, dan penampil story. Datanya dari data/instagram.js.
   ============================================================ */
(() => {
  "use strict";

  const iOS = window.iOS;
  const D = window.INSTAGRAM || {};
  const { h, esc } = iOS;

  const svg = (inner, extra = "") =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.900" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${inner}</svg>`;

  const HOME = '<path d="M3.500 10.300 12 3l8.500 7.300V20a1 1 0 0 1-1 1h-4.700v-6.200H9.200V21H4.500a1 1 0 0 1-1-1v-9.700Z"/>';
  const HEART =
    '<path d="M12 20.500c-.3 0-.6-.1-.8-.3-4.100-3.300-7.900-6.600-7.900-10.700 0-2.800 2.100-4.900 4.700-4.900 1.600 0 3.100.8 4 2.200.9-1.400 2.400-2.200 4-2.200 2.600 0 4.700 2.100 4.700 4.900 0 4.100-3.800 7.400-7.900 10.700-.2.200-.5.300-.8.300Z"/>';

  const I = {
    home: svg(HOME),
    homeOn: svg(HOME, 'fill="currentColor"'),
    search: svg('<circle cx="10.800" cy="10.800" r="7.300"/><path d="m16.300 16.300 4.700 4.700"/>'),
    add: svg('<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 7.800v8.400M7.800 12h8.400"/>'),
    reels: svg('<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M3 8.300h18M8.300 3l3 5.300M14 3l3 5.300"/><path d="M10.300 11.800v5l4.300-2.500-4.300-2.500Z" fill="currentColor" stroke-width="1.200"/>'),
    heart: svg(HEART),
    burst: `<svg class="ig-burst" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${HEART}</svg>`,
    comment: svg('<path d="M20.700 12a8.700 8.700 0 0 1-12.900 7.600L3.300 20.700l1.100-4.300A8.700 8.700 0 1 1 20.700 12Z"/>'),
    share: svg('<path d="M21.500 3 10.300 12.300M21.500 3l-6.800 18-4.400-8.700L2.500 9.100 21.500 3Z"/>'),
    save: svg('<path d="M19.500 21 12 14.200 4.500 21V4a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v17Z"/>'),
    messenger: svg('<path d="M12 3c5.200 0 9.200 3.800 9.200 8.800s-4 8.800-9.200 8.800c-.9 0-1.800-.1-2.700-.4l-3.400 1.700.1-3.300C4 17 2.800 14.500 2.800 11.800 2.800 6.800 6.800 3 12 3Z"/><path d="m6.800 14.200 3.600-4.300 2.900 2.600 3.900-2.700-3.600 4.300-2.900-2.600-3.900 2.700Z" fill="currentColor" stroke-width="1"/>'),
    more: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5.500" cy="12" r="1.600"/><circle cx="12" cy="12" r="1.600"/><circle cx="18.500" cy="12" r="1.600"/></svg>',
    back: svg('<path d="M15 4.500 7.500 12l7.500 7.500"/>', 'stroke-width="2.200"'),
    down: svg('<path d="m6 9.500 6 6 6-6"/>', 'stroke-width="2.400"'),
    lock: svg('<rect x="5" y="10.500" width="14" height="10" rx="2.500"/><path d="M8.500 10.500V7.800a3.500 3.500 0 0 1 7 0v2.700"/>', 'stroke-width="2.200"'),
    menu: svg('<path d="M3.500 6h17M3.500 12h17M3.500 18h17"/>'),
    grid: svg('<rect x="3" y="3" width="18" height="18" rx="1.500"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>', 'stroke-width="1.600"'),
    tagged: svg('<path d="M4 20V7.500a2 2 0 0 1 2-2h3l3-3 3 3h3a2 2 0 0 1 2 2V20Z"/><circle cx="12" cy="11.500" r="2.500"/><path d="M7.500 20c.5-2.500 2.300-4 4.500-4s4 1.500 4.500 4"/>', 'stroke-width="1.600"'),
    person: svg('<circle cx="9.500" cy="8" r="3.500"/><path d="M3 20c.6-3.500 3.200-5.500 6.500-5.500 1.500 0 2.800.4 3.900 1.100M18 13v6M15 16h6"/>'),
    compose: svg('<path d="M19.500 13v5.500a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2H11"/><path d="M20.300 3.700a1.800 1.800 0 0 0-2.500 0L10.500 11l-.8 3.300 3.300-.8 7.300-7.300a1.800 1.800 0 0 0 0-2.500Z"/>'),
    camera: svg('<path d="M8.500 5.500 9.700 4h4.600l1.200 1.500H19a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7.500a2 2 0 0 1 2-2h3.500Z"/><circle cx="12" cy="12.300" r="3.500"/>'),
    phone: svg('<path d="M6.800 3.500h2.400l1.300 4-2 1.500c1 2.300 2.700 4 5 5l1.500-2 4 1.300v2.400c0 1-.8 1.800-1.800 1.800C10.600 17.500 5 11.900 5 5.300c0-1 .8-1.800 1.800-1.800Z"/>'),
    video: svg('<rect x="2.500" y="6.500" width="13" height="11" rx="3"/><path d="m15.500 11 5.200-3.200a.5.500 0 0 1 .8.400v7.600a.5.500 0 0 1-.8.400L15.500 13"/>'),
    mic: svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.500 11.500a6.500 6.500 0 0 0 13 0M12 18v3"/>'),
    image: svg('<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.500" cy="8.500" r="1.500"/><path d="m4 17 5-5 4 4 3-3 4.500 4.500"/>'),
    close: svg('<path d="M5 5l14 14M19 5 5 19"/>', 'stroke-width="2.200"'),
    plus: svg('<path d="M12 5v14M5 12h14"/>', 'stroke-width="3"'),
  };

  /* ---------------------------------------------------------- data */

  const me = D.me || { handle: "me", name: "", avatar: "" };
  const users = D.users || {};
  const user = (id) => (id === "me" ? me : users[id] || { handle: id, name: id, avatar: "" });

  const normPost = (p) => ({
    user: p.user || "me",
    imgs: [].concat(p.img || []),
    likes: p.likes || 0,
    liked: !!p.liked,
    caption: p.caption || "",
    comments: p.comments || [],
    time: p.time || "",
  });

  const feed = (D.feed || []).map(normPost);
  const posts = (D.posts || []).map((p) => normPost({ ...p, user: "me" }));
  const stories = (D.stories || []).filter((s) => s.items && s.items.length).map((s) => ({ ...s, seen: !!s.seen }));
  const dms = (D.dms || []).map((d) => ({ ...d, unread: d.unread || 0, messages: d.messages || [] }));
  const dmUnread = () => dms.reduce((n, d) => n + d.unread, 0);

  const pic = (src) => `<img src="${esc(src)}" alt="" loading="lazy" decoding="async" draggable="false">`;
  const likesText = (p) => `${p.likes.toLocaleString("en-US")} like${p.likes === 1 ? "" : "s"}`;

  /* ---------------------------------------------------------- state */

  let root = null;
  let wrap = null;
  let nav = null;
  let sv = null; // story yang sedang terbuka: { el, si, i }

  const tabsHTML = (on) =>
    `<div class="ig-tabs">
      <button type="button" data-tab="home" aria-label="Home">${on === "home" ? I.homeOn : I.home}</button>
      <button type="button" aria-label="Search">${I.search}</button>
      <button type="button" aria-label="New post">${I.add}</button>
      <button type="button" aria-label="Reels">${I.reels}</button>
      <button type="button" data-tab="profile" class="${on === "profile" ? "on" : ""}" aria-label="Profile">${iOS.avatar(me.avatar, me.name, 26)}</button>
    </div>`;

  /* ---------------------------------------------------------- post */

  function postHTML(p, i) {
    const u = user(p.user);
    const many = p.imgs.length > 1;
    const n = p.comments.length;
    return `<article class="ig-post" data-i="${i}">
      <header>${iOS.avatar(u.avatar, u.name || u.handle, 32)}<b>${esc(u.handle)}</b><button type="button" aria-label="More">${I.more}</button></header>
      <div class="ig-media"><div class="ui-hscroll">${p.imgs.map(pic).join("")}</div>${many ? `<span class="ig-count">1/${p.imgs.length}</span>` : ""}${I.burst}</div>
      <div class="ig-actions">
        <button type="button" data-like class="${p.liked ? "on" : ""}" aria-label="Like">${I.heart}</button>
        <button type="button" aria-label="Comment">${I.comment}</button>
        <button type="button" aria-label="Share">${I.share}</button>
        ${many ? `<div class="ig-dots">${p.imgs.map((_, k) => `<i class="${k ? "" : "on"}"></i>`).join("")}</div>` : ""}
        <button type="button" class="save" aria-label="Save">${I.save}</button>
      </div>
      <div class="ig-text">
        <p><b class="likes">${likesText(p)}</b></p>
        ${p.caption ? `<p><b>${esc(u.handle)}</b> ${esc(p.caption)}</p>` : ""}
        ${n ? `<button type="button" class="more">View ${n === 1 ? "1 comment" : `all ${n} comments`}</button><div class="cmts" hidden>${p.comments
          .map(([who, text]) => `<p><b>${esc(who)}</b> ${esc(text)}</p>`)
          .join("")}</div>` : ""}
        <time>${esc(p.time)}</time>
      </div>
    </article>`;
  }

  function setLike(art, p, on, burst) {
    if (p.liked !== on) {
      p.liked = on;
      p.likes += on ? 1 : -1;
      art.querySelector("[data-like]").classList.toggle("on", on);
      art.querySelector(".likes").textContent = likesText(p);
    }
    if (burst) {
      const b = art.querySelector(".ig-burst");
      b.classList.remove("go");
      b.getBoundingClientRect();
      b.classList.add("go");
    }
  }

  /* like, ketuk dua kali, komentar, dan indikator carousel untuk semua post di `sc` */
  function bindPosts(sc, list) {
    let lastTap = 0;
    let lastEl = null;
    sc.addEventListener("click", (e) => {
      const art = e.target.closest(".ig-post");
      if (!art) return;
      const p = list[+art.dataset.i];
      if (e.target.closest("[data-like]")) return setLike(art, p, !p.liked);
      const more = e.target.closest(".more");
      if (more) {
        more.hidden = true;
        more.nextElementSibling.hidden = false;
        return;
      }
      const media = e.target.closest(".ig-media");
      if (media) {
        const now = performance.now();
        if (lastEl === media && now - lastTap < 330) setLike(art, p, true, true);
        lastTap = now;
        lastEl = media;
      }
    });
    sc.addEventListener(
      "scroll",
      (e) => {
        const row = e.target;
        if (!row.classList || !row.classList.contains("ui-hscroll") || !row.parentNode.classList.contains("ig-media")) return;
        const k = Math.round(row.scrollLeft / row.clientWidth);
        const art = row.closest(".ig-post");
        const count = art.querySelector(".ig-count");
        if (count) count.textContent = `${k + 1}/${row.children.length}`;
        art.querySelectorAll(".ig-dots i").forEach((d, j) => d.classList.toggle("on", j === k));
      },
      true,
    );
  }

  /* ---------------------------------------------------------- beranda */

  function storiesHTML() {
    const mineAt = stories.findIndex((s) => s.user === "me");
    const mine = stories[mineAt];
    let out = `<button type="button" class="ig-story-btn" data-story="${mine ? mineAt : ""}"><span class="ig-ring ${
      mine ? (mine.seen ? "seen" : "") : "none"
    }">${iOS.avatar(me.avatar, me.name, 62)}${mine ? "" : `<i class="add">${I.plus}</i>`}</span><span>Your story</span></button>`;
    stories.forEach((s, i) => {
      if (s.user === "me") return;
      const u = user(s.user);
      out += `<button type="button" class="ig-story-btn" data-story="${i}"><span class="ig-ring ${s.seen ? "seen" : ""}">${iOS.avatar(
        u.avatar,
        u.name || u.handle,
        62,
      )}</span><span>${esc(u.handle)}</span></button>`;
    });
    return out;
  }

  function homeView() {
    const v = h("div", "nv-view");
    v._bar = "dark";
    v.innerHTML = `
      <div class="nv-scroll"><div class="ig-stories ui-hscroll"></div>${feed.map(postHTML).join("")}</div>
      <div class="ig-top"><span class="ig-logo">Instagram</span><span class="ic">${I.heart}</span><button type="button" class="ic" data-dm aria-label="Messages">${I.messenger}<i class="ig-dot"></i></button></div>
      ${tabsHTML("home")}`;
    const rings = v.querySelector(".ig-stories");
    const dot = v.querySelector(".ig-dot");
    v._refresh = () => {
      rings.innerHTML = storiesHTML();
      const n = dmUnread();
      dot.textContent = n;
      dot.hidden = !n;
    };
    v._onShow = v._refresh;
    v._refresh();
    bindPosts(v.querySelector(".nv-scroll"), feed);
    return v;
  }

  /* ---------------------------------------------------------- profil */

  function profileView() {
    const v = h("div", "nv-view");
    v._bar = "dark";
    v.innerHTML = `
      <div class="nv-scroll">
        <div class="ig-prof">
          <div class="row"><span class="ig-ring none">${iOS.avatar(me.avatar, me.name, 86)}</span>
            <div class="ig-stats"><span><b>${posts.length}</b>posts</span><span><b>${esc(me.followers || 0)}</b>followers</span><span><b>${esc(me.following || 0)}</b>following</span></div>
          </div>
          <p class="name">${esc(me.name)}</p>
          <p class="bio">${esc(me.bio || "")}</p>
          <div class="ig-btns"><button type="button">Edit profile</button><button type="button">Share profile</button><button type="button" class="sq" aria-label="Discover people">${I.person}</button></div>
        </div>
        <div class="ig-seg"><span class="on">${I.grid}</span><span>${I.reels}</span><span>${I.tagged}</span></div>
        ${
          posts.length
            ? `<div class="ig-grid">${posts.map((p, i) => `<button type="button" data-post="${i}">${pic(p.imgs[0])}</button>`).join("")}</div>`
            : '<div class="ig-private">No posts yet</div>'
        }
      </div>
      <div class="ig-top"><h1 class="grow">${me.private ? I.lock : ""}${esc(me.handle)}${I.down}</h1><span class="ic">${I.add}</span><span class="ic">${I.menu}</span></div>
      ${tabsHTML("profile")}`;
    return v;
  }

  function openPosts(i) {
    const v = h("div", "nv-view");
    v._bar = "dark";
    v.innerHTML = `
      <div class="nv-scroll">${posts.map(postHTML).join("")}</div>
      <div class="ig-top line"><button type="button" class="ic" data-back aria-label="Back">${I.back}</button><h2 class="grow">Posts<small>${esc(me.handle)}</small></h2></div>`;
    const sc = v.querySelector(".nv-scroll");
    bindPosts(sc, posts);
    nav.push(v);
    const art = sc.children[i];
    if (art) sc.scrollTop = art.offsetTop - 98;
  }

  /* ---------------------------------------------------------- DM */

  const dmText = (m) => (!m ? "" : (m[0] === "m" ? "You: " : "") + (typeof m[1] === "string" ? m[1] : m[1].text || "Sent a photo"));

  function dmListView() {
    const v = h("div", "nv-view");
    v._bar = "dark";
    v.innerHTML = `
      <div class="nv-scroll"><div class="ig-search">${I.search}Search</div><div class="ig-dmh">Messages<span>Requests</span></div><div class="rows"></div></div>
      <div class="ig-top"><button type="button" class="ic" data-back aria-label="Back">${I.back}</button><h1 class="grow">${esc(me.handle)}${I.down}</h1><span class="ic">${I.compose}</span></div>`;
    const rows = v.querySelector(".rows");
    v._onShow = () => {
      rows.innerHTML = dms
        .map((d, i) => {
          const u = user(d.user);
          return `<button type="button" class="ig-dm${d.unread ? " unread" : ""}" data-dmi="${i}">${iOS.avatar(u.avatar, u.name || u.handle, 56)}<span class="tx"><b>${esc(
            u.name || u.handle,
          )}</b><small>${esc(dmText(d.messages[d.messages.length - 1]))}${d.time ? " · " + esc(d.time) : ""}</small></span>${
            d.unread ? '<i class="new"></i>' : ""
          }${I.camera}</button>`;
        })
        .join("");
    };
    v._onShow();
    return v;
  }

  function openThread(d) {
    const u = user(d.user);
    d.unread = 0;
    iOS.setBadge("instagram", dmUnread());

    const msgs = d.messages
      .map(([k, p], i) => {
        const prev = d.messages[i - 1];
        const next = d.messages[i + 1];
        const gap = prev && prev[0] !== k ? " gap" : "";
        const face = k === "t" && (!next || next[0] !== "t") ? iOS.avatar(u.avatar, u.name || u.handle, 28) : "";
        const o = typeof p === "string" ? { text: p } : p || {};
        let out = "";
        if (o.img) out += `<div class="ig-msg pic ${k}${gap}">${pic(o.img)}${o.text ? "" : face}</div>`;
        if (o.text) out += `<div class="ig-msg ${k}${o.img ? "" : gap}">${esc(o.text)}${face}</div>`;
        return out;
      })
      .join("");

    const v = h("div", "nv-view");
    v._bar = "dark";
    v.innerHTML = `
      <div class="nv-scroll"><div class="ig-thread">
        <div class="ig-who">${iOS.avatar(u.avatar, u.name || u.handle, 84)}<b>${esc(u.name || u.handle)}</b><span>${esc(u.handle)} · Instagram</span><i>View profile</i></div>
        ${msgs}
      </div></div>
      <div class="ig-top line"><button type="button" class="ic" data-back aria-label="Back">${I.back}</button>${iOS.avatar(u.avatar, u.name || u.handle, 32)}<h2 class="grow">${esc(
        u.name || u.handle,
      )}<small>${esc(d.active || "Active now")}</small></h2><span class="ic">${I.phone}</span><span class="ic">${I.video}</span></div>
      <div class="ig-input"><span class="cam">${I.camera}</span><span>Message…</span>${I.mic}${I.image}</div>`;
    nav.push(v);
    const sc = v.querySelector(".nv-scroll");
    sc.scrollTop = sc.scrollHeight;
    v.querySelectorAll(".ig-thread img").forEach((im) => im.addEventListener("load", () => (sc.scrollTop = sc.scrollHeight), { once: true }));
  }

  /* ---------------------------------------------------------- story */

  function renderStory() {
    const s = stories[sv.si];
    const u = user(s.user);
    const it = s.items[sv.i];
    sv.el.innerHTML = `
      <div class="pic"><img src="${esc(it.img)}" alt="" draggable="false"></div>
      <div class="ig-bars">${s.items.map((_, k) => `<i class="${k < sv.i ? "done" : k === sv.i ? "run" : ""}"><b></b></i>`).join("")}</div>
      <header>${iOS.avatar(u.avatar, u.name || u.handle, 32)}<b>${esc(u.handle)}</b><small>${esc(s.time || "")}</small><button type="button" data-x aria-label="Close">${I.close}</button></header>
      ${it.text ? `<p class="cap">${esc(it.text)}</p>` : ""}
      <button type="button" class="zone prev" aria-label="Previous"></button>
      <button type="button" class="zone next" aria-label="Next"></button>
      <footer><span>Send message</span>${I.heart}${I.share}</footer>`;
    sv.el.querySelector(".run b").addEventListener("animationend", () => stepStory(1));
  }

  function stepStory(d) {
    if (!sv) return;
    const s = stories[sv.si];
    const i = sv.i + d;
    if (i < 0) {
      sv.i = 0;
    } else if (i >= s.items.length) {
      s.seen = true;
      if (!stories[sv.si + 1]) return closeStory();
      sv.si++;
      sv.i = 0;
    } else {
      sv.i = i;
    }
    renderStory();
  }

  function openStory(si, from) {
    if (sv || !stories[si]) return;
    const el = h("div", "ig-sv");
    if (from) {
      const r = iOS.rect(from);
      el.style.transformOrigin = `${r.x + r.w / 2}px ${r.y + r.h / 2}px`;
    }
    root.append(el);
    sv = { el, si, i: 0 };
    nav.paused = true;
    iOS.setChrome({ bar: "light", homebar: "light" });
    renderStory();
    el.offsetWidth;
    el.classList.add("show");
  }

  function closeStory() {
    if (!sv) return;
    stories[sv.si].seen = true;
    const el = sv.el;
    sv = null;
    el.classList.remove("show");
    el.style.pointerEvents = "none";
    setTimeout(() => el.remove(), 320);
    nav.paused = false;
    nav.sync();
    const top = nav.top();
    if (top && top._refresh) top._refresh();
  }

  /* ---------------------------------------------------------- tab & klik */

  function show(tab) {
    wrap.replaceChildren();
    nav.root(tab === "profile" ? profileView() : homeView());
  }

  function onClick(e) {
    const t = e.target;
    let n;
    if (sv) {
      if (t.closest("[data-x]")) closeStory();
      else if (t.closest(".zone.prev")) stepStory(-1);
      else if (t.closest(".zone.next")) stepStory(1);
      return;
    }
    if ((n = t.closest("[data-tab]"))) return show(n.dataset.tab);
    if (t.closest("[data-dm]")) return nav.push(dmListView());
    if ((n = t.closest("[data-dmi]"))) return openThread(dms[+n.dataset.dmi]);
    if ((n = t.closest("[data-story]"))) {
      if (n.dataset.story !== "") openStory(+n.dataset.story, n.querySelector(".ig-ring"));
      return;
    }
    if ((n = t.closest("[data-post]"))) return openPosts(+n.dataset.post);
  }

  iOS.registerApp("instagram", {
    bar: "dark",

    mount(el) {
      root = h("div", "ig");
      root.innerHTML = '<div class="nv"></div>';
      el.append(root);
      wrap = root.firstElementChild;
      nav = iOS.createStack(wrap);
      root.addEventListener("click", onClick);
      sv = null;
      show("home");
    },

    unmount() {
      root = wrap = nav = sv = null;
    },

    back() {
      if (sv) {
        closeStory();
        return true;
      }
      return nav ? nav.pop() : false;
    },
  });

  iOS.setBadge("instagram", dmUnread());
})();
