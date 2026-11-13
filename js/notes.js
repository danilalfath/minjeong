/* ============================================================
   App Notes — daftar catatan, isi catatan, catatan terkunci.
   Datanya dari data/notes.js.
   ============================================================ */
(() => {
  "use strict";

  const iOS = window.iOS;
  const SITE = window.SITE || {};
  const { h, esc, MONTHS } = iOS;

  const svg = (inner, extra = "") =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.900" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${inner}</svg>`;

  const I = {
    back: '<svg class="chev" viewBox="0 0 12 21" fill="none" stroke="currentColor" stroke-width="2.600" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2 2 10.500 10 19"/></svg>',
    search: svg('<circle cx="10.500" cy="10.500" r="6.500"/><path d="m15.500 15.500 5 5"/>', 'stroke-width="2.200"'),
    mic: svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.500 11.500a6.500 6.500 0 0 0 13 0M12 18v3"/>'),
    more: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="6" cy="12" r="1.800"/><circle cx="12" cy="12" r="1.800"/><circle cx="18" cy="12" r="1.800"/></svg>',
    compose: svg('<path d="M19.500 13v5.500a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2H11"/><path d="M20.300 3.700a1.800 1.800 0 0 0-2.500 0L10.500 11l-.8 3.300 3.300-.8 7.300-7.300a1.800 1.800 0 0 0 0-2.500Z"/>'),
    share: svg('<path d="M12 14.500V3.200M8 6.800l4-4 4 4M8.500 10H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1.500"/>'),
    lock: '<svg viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M4.300 5.800V4.300a2.700 2.700 0 0 1 5.400 0v1.500h.4c.7 0 1.200.5 1.200 1.200v4.300c0 .7-.5 1.200-1.200 1.200H3.900c-.7 0-1.200-.5-1.200-1.200V7c0-.7.5-1.200 1.200-1.200h.4Zm1.300 0h2.800V4.300a1.400 1.400 0 0 0-2.800 0v1.500Z"/></svg>',
    checklist: svg('<circle cx="6" cy="7" r="2.500"/><path d="M12 7h8M12 17h8"/><circle cx="6" cy="17" r="2.500"/><path d="m4.900 17 .8.800 1.500-1.700" stroke-width="1.400"/>'),
    camera: svg('<path d="M8.500 5.500 9.700 4h4.600l1.200 1.500H19a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7.500a2 2 0 0 1 2-2h3.500Z"/><circle cx="12" cy="12.300" r="3.500"/>'),
    pen: svg('<circle cx="12" cy="12" r="9"/><path d="m12 6.500 2.500 6.500h-5L12 6.500ZM9.500 13v3.500h5V13"/>'),
  };

  /* ---------------------------------------------------------- data */

  const notes = ((window.NOTES || {}).notes || []).map((n, i) => ({
    id: i,
    title: n.title || "New Note",
    date: iOS.parseDate(n.when),
    pinned: !!n.pinned,
    locked: !!n.locked,
    code: String(n.code || SITE.passcode || ""),
    hint: n.hint || "",
    body: String(n.body || ""),
    open: false, // sudah dibuka dengan kode selama app ini terbuka
  }));

  const clean = (line) => line.replace(/^- \[( |x)\] /i, "").replace(/^[-#] /, "");

  function previewOf(n) {
    const line = n.body.split("\n").find((l) => l.trim() && !/^!\[\]\(/.test(l));
    return line ? clean(line) : "No additional text";
  }

  function groupOf(n) {
    if (n.pinned) return "Pinned";
    const d = iOS.daysAgo(n.date);
    if (d <= 0) return "Today";
    if (d === 1) return "Yesterday";
    if (d <= 7) return "Previous 7 Days";
    if (d <= 30) return "Previous 30 Days";
    return n.date.getFullYear() === iOS.now().getFullYear() ? MONTHS[n.date.getMonth()] : String(n.date.getFullYear());
  }

  function bodyHTML(text) {
    return text
      .split("\n")
      .map((line) => {
        let m;
        if ((m = /^- \[( |x)\] (.*)$/i.exec(line))) {
          return `<div class="nt-check${m[1] === " " ? "" : " on"}"><i></i><span>${esc(m[2])}</span></div>`;
        }
        if ((m = /^- (.*)$/.exec(line))) return `<p class="li">${esc(m[1])}</p>`;
        if ((m = /^# (.*)$/.exec(line))) return `<h3>${esc(m[1])}</h3>`;
        if ((m = /^!\[\]\((.*)\)$/.exec(line.trim()))) return `<img src="${esc(m[1])}" alt="" loading="lazy" draggable="false">`;
        return `<p>${esc(line)}</p>`;
      })
      .join("");
  }

  /* ---------------------------------------------------------- tampilan */

  let nav = null;

  function listView() {
    const v = h("div", "nv-view gray nt-list");
    v._bar = "dark";

    const sorted = [...notes].sort((a, b) => b.date - a.date);
    const groups = new Map();
    for (const n of [...sorted.filter((x) => x.pinned), ...sorted.filter((x) => !x.pinned)]) {
      const g = groupOf(n);
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(n);
    }

    const row = (n) => {
      const hidden = n.locked && !n.open;
      return `<button type="button" class="nt-row" data-id="${n.id}"><b>${esc(n.title)}</b><span><i>${esc(
        iOS.listDate(n.date),
      )}</i>${hidden ? `${I.lock}<em>Locked</em>` : `<em>${esc(previewOf(n))}</em>`}</span></button>`;
    };

    const body = [...groups.entries()]
      .map(([name, list]) => `<h3 class="nt-sec">${esc(name)}</h3><div class="nt-group">${list.map(row).join("")}</div>`)
      .join("");

    v.innerHTML = `
      <div class="nv-scroll">
        <h1 class="ui-large">Notes</h1>
        <div class="ui-search">${I.search}<span>Search</span>${I.mic}</div>
        ${body}
      </div>
      <div class="ui-bar">
        <button type="button" class="ui-btn">${I.back}Folders</button>
        <span class="ttl">Notes</span>
        <button type="button" class="ui-btn" aria-label="More"><span class="nt-more">${I.more}</span></button>
      </div>
      <div class="nt-tool"><span>${notes.length} Note${notes.length === 1 ? "" : "s"}</span><i></i><button type="button" class="ui-btn" aria-label="New note">${I.compose}</button></div>`;

    v.querySelector(".nv-scroll").addEventListener("click", (e) => {
      const r = e.target.closest(".nt-row");
      if (r) openNote(notes[+r.dataset.id]);
    });
    iOS.watchScroll(v.querySelector(".nv-scroll"), v.querySelector(".ui-bar"));
    return v;
  }

  function noteView(n) {
    const v = h("div", "nv-view nt-note");
    v._bar = "dark";
    const d = n.date;
    const stamp = `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} at ${iOS.fmtTime(d, true)}`;
    v.innerHTML = `
      <div class="nv-scroll"><div class="nt-body">
        <div class="nt-date">${esc(stamp)}</div>
        <h2>${esc(n.title)}</h2>
        ${bodyHTML(n.body)}
      </div></div>
      <div class="ui-bar solid">
        <button type="button" class="ui-btn" data-back>${I.back}Notes</button>
        <span class="ui-group">
          <button type="button" class="ui-btn" aria-label="Share">${I.share}</button>
          <button type="button" class="ui-btn" aria-label="More"><span class="nt-more">${I.more}</span></button>
        </span>
      </div>
      <div class="nt-tool">
        <button type="button" class="ui-btn" aria-label="Checklist">${I.checklist}</button>
        <button type="button" class="ui-btn" aria-label="Camera">${I.camera}</button>
        <button type="button" class="ui-btn" aria-label="Markup">${I.pen}</button>
        <button type="button" class="ui-btn" aria-label="New note">${I.compose}</button>
      </div>`;
    v.querySelector(".nt-body").addEventListener("click", (e) => {
      const c = e.target.closest(".nt-check");
      if (c) c.classList.toggle("on");
    });
    return v;
  }

  function openNote(n) {
    if (!n || !nav) return;
    if (!n.locked || n.open || !n.code) return nav.push(noteView(n));
    iOS.askCode({ title: "Enter Passcode", sub: `to view “${n.title}”`, code: n.code, hint: n.hint }).then((ok) => {
      if (!ok || !nav) return;
      n.open = true;
      nav.push(noteView(n));
    });
  }

  iOS.registerApp("notes", {
    bar: "dark",

    mount(root) {
      const wrap = h("div", "nv nt");
      root.append(wrap);
      nav = iOS.createStack(wrap);
      nav.root(listView());
    },

    unmount() {
      nav = null;
      notes.forEach((n) => (n.open = false)); // terkunci lagi saat app ditutup
    },

    back() {
      return nav ? nav.pop() : false;
    },
  });
})();
