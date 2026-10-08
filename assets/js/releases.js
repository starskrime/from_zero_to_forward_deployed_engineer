/* ==========================================================================
   Release notes: the "What's new" dialog, "Updated" badges on lessons,
   the "refresh to see what's new" banner, and the What's new page.
   Data: releases.json (newest first). Loaded on every page by ui.js.
   ========================================================================== */

window.Releases = (function () {
  const SEEN_KEY = "fde-platform.seenRelease";
  const STATUS_PATH = "__fde/status.json";
  const BADGE_DAYS = 30;            // lessons show "Updated" for this long after a change
  const POLL_MS = 10 * 60 * 1000;   // how often an open page checks for a newer version

  const me = document.currentScript;
  const BASE = me ? me.src.replace(/assets\/js\/releases\.js.*$/, "") : "";
  const esc = s => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  let data = null, loadedVersion = null;

  /* ---------- versions ---------- */
  const vkey = v => String(v).split(".").map(Number);
  function newer(a, b) {            // is version a newer than b?
    const x = vkey(a), y = vkey(b);
    for (let i = 0; i < Math.max(x.length, y.length); i++) {
      const d = (x[i] || 0) - (y[i] || 0);
      if (d) return d > 0;
    }
    return false;
  }
  function getSeen() { try { return localStorage.getItem(SEEN_KEY); } catch (e) { return null; } }
  function setSeen(v) { try { localStorage.setItem(SEEN_KEY, v); } catch (e) {} }

  function load() {
    return fetch(BASE + "releases.json", { cache: "no-store" })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });
  }

  /* weeks the learner has touched: any saved key that starts with "<week>-" */
  function startedWeeks() {
    const out = new Set();
    if (!window.Store) return out;
    const s = Store.get();
    ["lessonDays", "exercises", "quiz", "miniquiz", "readiness", "accept", "hints", "reflections"].forEach(b => {
      Object.keys(s[b] || {}).forEach(k => { const m = /^([0-9A-Z]+)-/.exec(k); if (m) out.add(m[1]); });
    });
    Object.keys(s.weeksDone || {}).forEach(w => out.add(w));
    return out;
  }

  const fmtDate = iso => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d, 12).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };
  const weekName = id => "Week " + String(id).replace(/^W/, "");
  const PAGE_NAMES = { practice: "Practice", plan: "Plan", lessons: "Lessons", certification: "Certification", home: "Home", settings: "Settings", "whats-new": "What's new" };
  const target = a => a.week ? weekName(a.week) : (PAGE_NAMES[a.page] || a.page || "");

  /* ---------- rendering ---------- */
  function releaseHTML(r, mine) {
    const list = (label, cls, items) => items && items.length
      ? '<div class="rn-group"><span class="rn-kind ' + cls + '">' + label + '</span><ul>' +
        items.map(t => "<li>" + esc(t) + "</li>").join("") + "</ul></div>" : "";
    const aff = (r.affects || []);
    const yours = aff.filter(a => mine(a)), others = aff.filter(a => !mine(a));
    return '<article class="rn-release">' +
      '<header><h3>' + esc(r.title) + '</h3><span class="rn-meta">' + esc(r.version) + " · " + fmtDate(r.date) + "</span></header>" +
      (yours.length ? '<div class="rn-yours"><b>Affects your progress</b><ul>' +
        yours.map(a => "<li><b>" + esc(target(a)) + ":</b> " + esc(a.note) + "</li>").join("") + "</ul></div>" : "") +
      list("New", "new", r["new"]) + list("Changed", "changed", r.changed) + list("Fixed", "fixed", r.fixed) +
      (others.length ? '<div class="rn-group"><span class="rn-kind affects">Where</span><ul>' +
        others.map(a => "<li><b>" + esc(target(a)) + ":</b> " + esc(a.note) + "</li>").join("") + "</ul></div>" : "") +
      "</article>";
  }
  function isMine() {
    const started = startedWeeks();
    return a => (a.week && started.has(a.week)) || (a.page === "practice" && window.Store && Object.keys(Store.get().practice || {}).length > 0);
  }

  function showDialog(unseen) {
    if (document.querySelector(".modal-backdrop")) return;   // onboarding is open
    const latest = data.releases[0].version;
    const mine = isMine();
    const wrap = document.createElement("div");
    wrap.className = "modal-backdrop";
    wrap.innerHTML =
      '<div class="modal rn-modal" role="dialog" aria-modal="true" aria-labelledby="rn-title">' +
        '<div class="eyebrow">What\'s new</div>' +
        '<h2 id="rn-title">' + (unseen.length === 1 ? "The platform was updated" : unseen.length + " updates since your last visit") + "</h2>" +
        '<div class="rn-list">' + unseen.map(r => releaseHTML(r, mine)).join("") + "</div>" +
        '<div class="rn-actions"><button class="btn btn-primary" type="button" id="rn-ok">Got it</button>' +
        '<a class="btn btn-ghost" href="' + BASE + 'whats-new.html">Full history</a></div>' +
      "</div>";
    document.body.appendChild(wrap);
    document.body.classList.add("modal-open");
    const close = () => { setSeen(latest); wrap.remove(); document.body.classList.remove("modal-open"); paintNavDot(); };
    wrap.querySelector("#rn-ok").addEventListener("click", close);
    wrap.querySelector("#rn-ok").focus();
    document.addEventListener("keydown", function k(e) { if (e.key === "Escape") { close(); document.removeEventListener("keydown", k); } });
  }

  function paintNavDot() {
    const a = document.querySelector('.nav-item[data-nav="whatsnew"]');
    if (!a || !data) return;
    const seen = getSeen();
    a.classList.toggle("has-new", !!seen && newer(data.releases[0].version, seen));
  }

  /* "Updated" badges: lessons list rows and the lesson page hero */
  function recentAffects() {
    const cutoff = Date.now() - BADGE_DAYS * 86400000, out = {};
    data.releases.forEach(r => {
      const [y, m, d] = r.date.split("-").map(Number);
      if (new Date(y, m - 1, d, 12).getTime() < cutoff) return;
      (r.affects || []).forEach(a => { if (a.week && !out[a.week]) out[a.week] = { date: r.date, note: a.note, version: r.version }; });
    });
    return out;
  }
  function paintBadges() {
    const rec = recentAffects();
    document.querySelectorAll(".lesson-row .ph-badge").forEach(b => {
      const u = rec[b.textContent.trim()];
      if (!u || b.parentElement.querySelector(".rn-badge")) return;
      const t = b.parentElement.querySelector(".lr-title b");
      if (t) t.insertAdjacentHTML("beforeend", ' <span class="rn-badge" title="' + esc(u.note) + '">Updated ' + fmtDate(u.date).replace(/, \d{4}$/, "") + "</span>");
    });
    const week = document.body.dataset.week, hero = document.querySelector(".lesson-hero .lead");
    if (week && hero && rec[week] && !document.querySelector(".rn-lesson-note")) {
      hero.insertAdjacentHTML("afterend", '<div class="callout rn-lesson-note"><b>Updated ' + fmtDate(rec[week].date) + "</b>" +
        esc(rec[week].note) + ' <a href="' + BASE + 'whats-new.html">What changed</a></div>');
    }
  }

  /* banner when the server updated the files while this page was open */
  function banner(version) {
    if (document.getElementById("rn-banner")) return;
    const b = document.createElement("div");
    b.id = "rn-banner"; b.setAttribute("role", "status");
    b.innerHTML = "<span>The platform was updated" + (version ? " to " + esc(version) : "") + ".</span>" +
      '<button class="btn btn-primary" type="button">Refresh to see what\'s new</button>';
    b.querySelector("button").addEventListener("click", () => location.reload());
    document.body.appendChild(b);
  }
  function poll() {
    setInterval(() => {
      if (document.hidden) return;
      load().then(d => { const v = d.releases[0].version; if (loadedVersion && v !== loadedVersion) banner(v); }).catch(() => {});
    }, POLL_MS);
  }

  /* ---------- What's new page ---------- */
  function renderPage(el) {
    const mine = isMine();
    el.innerHTML = data.releases.map(r => releaseHTML(r, mine)).join("");
    setSeen(data.releases[0].version);
    paintNavDot();
  }
  function status() {
    return fetch(BASE + STATUS_PATH, { cache: "no-store" }).then(r => r.ok ? r.json() : null).catch(() => null);
  }

  /* ---------- start ---------- */
  function init() {
    load().then(d => {
      data = d; loadedVersion = d.releases[0].version;
      const seen = getSeen();
      const page = document.getElementById("whats-new-list");
      if (page) { renderPage(page); }
      else if (!seen) {
        // First visit, or someone who used the platform before release notes existed.
        // New learners get no backlog; existing learners see everything after launch once.
        const hasHistory = window.Store && Store.hasProfile();
        if (hasHistory) showDialog(d.releases.filter((r, i) => i < d.releases.length - 1));
        else setSeen(loadedVersion);
      } else if (newer(loadedVersion, seen)) {
        showDialog(d.releases.filter(r => newer(r.version, seen)));
      }
      paintNavDot(); paintBadges(); poll();
    }).catch(() => { /* opened without the start script, or releases.json missing: stay quiet */ });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  return { status, newer };
})();
