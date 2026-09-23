/* ==========================================================================
   Shared UI: header, footer, onboarding, theme, pace-aware dates, sessions.
   ========================================================================== */

window.UI = (function () {
  const F = window.FDE;
  const DAY = 86400000;

  /* ---------- text helpers ---------- */
  const esc = s => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  const KIND = { doc: "Docs", video: "Video", paper: "Paper", article: "Article", tool: "Tool" };
  function link(key, cls) {
    const l = F.L[key];
    if (!l) return "";
    return '<a class="' + (cls || "doc-link") + (l.k ? " k-" + l.k : "") + '" href="' + esc(l.u) +
      '" target="_blank" rel="noopener">' + (l.k && l.k !== "doc" ? '<span class="lk">' + KIND[l.k] + '</span>' : '') +
      esc(l.t) + '<span class="ext" aria-hidden="true">↗</span></a>';
  }

  /* ---------- dates (pace-aware) ---------- */
  const fmt = (d, opts) => d.toLocaleDateString("en-US", opts || { month: "short", day: "numeric" });
  const addDays = (d, n) => new Date(d.getTime() + n * DAY);
  /* each program week lasts (its hours ÷ your weekly hours) calendar weeks; buffers last one week */
  function spanDays(w) { const h = totalHours(w); return h ? 7 * h / Store.pace().hours : 7; }
  function weekStart(i) {
    let d = 0;
    for (let j = 0; j < i && j < F.weeks.length; j++) d += spanDays(F.weeks[j]);
    if (i > F.weeks.length) d += (i - F.weeks.length) * 7;
    return addDays(Store.startDate(), Math.round(d));
  }
  function weekEnd(i) { return addDays(weekStart(i + 1), -1); }
  function weekRange(i) { return fmt(weekStart(i)) + " – " + fmt(weekEnd(i)); }
  function programEnd() { return weekEnd(F.weeks.length - 1); }
  function todayNoon() { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate(), 12); }
  function isoDay(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  /* index of the calendar's current program week (negative before start, >= length after end) */
  function currentWeekIndex() {
    const t = todayNoon();
    if (t < Store.startDate()) return -1;
    let i = 0;
    while (i < F.weeks.length && weekStart(i + 1) <= t) i++;
    return i;
  }
  function daysUntilStart() { return Math.round((Store.startDate() - todayNoon()) / DAY); }

  function phaseOf(week) { return F.phases.find(p => p.id === week.phase); }
  function projectOf(id) { return F.projects.find(p => p.id === id); }
  function weekIndex(id) { return F.weeks.findIndex(w => w.id === id); }

  /* ---------- sessions ---------- */
  function sessionsOf(week) { return week.rhythm ? F.rhythms[week.rhythm].sessions : []; }
  function tracksOn() { return Store.get().profile.tracks || { cert: true, ent: true }; }
  /* the parts of a session that apply to this week and to the learner's chosen tracks */
  function partsOf(week, s) {
    const on = tracksOn(), out = [];
    s.parts.forEach(p => {
      if (p.track === "core") out.push(p);
      else if (p.track === "cert" && on.cert) {
        if (week.cert) out.push({ track: "cert", h: p.h, what: (p.h > 1 ? "Lab or mock block: " : "") + week.cert.focus });
        else if (week.deep) { const t = week.deep.replace(/^Deep practice: /, ""); out.push({ track: "deep", h: p.h, what: t.charAt(0).toUpperCase() + t.slice(1) }); }
      } else if (p.track === "ent" && on.ent && week.ent) {
        out.push({ track: "ent", h: p.h, what: (p.h > 1 ? "Case study or interview practice: " : "") + week.ent.theme });
      }
    });
    return out;
  }
  function sessionHours(week, s) { return partsOf(week, s).reduce((a, p) => a + p.h, 0); }
  function totalHours(week) { return sessionsOf(week).reduce((a, x) => a + sessionHours(week, x), 0); }
  function sessionKey(week, s) { return week.id + "-" + s.id; }
  function isSessionDone(week, s) { return !!Store.get().lessonDays[sessionKey(week, s)]; }
  /* first unfinished session in program order (skips buffer weeks) */
  function nextSession() {
    for (let i = 0; i < F.weeks.length; i++) {
      const w = F.weeks[i];
      if (Store.get().weeksDone[w.id]) continue;
      for (const s of sessionsOf(w)) if (!isSessionDone(w, s)) return { week: w, index: i, session: s };
    }
    return null;
  }
  function hoursDone() {
    let h = 0;
    F.weeks.forEach(w => sessionsOf(w).forEach(s => { if (isSessionDone(w, s)) h += sessionHours(w, s); }));
    return h;
  }
  function plannedHours() { return F.weeks.reduce((a, w) => a + totalHours(w), 0); }

  /* ---------- theme ---------- */
  const THEME_KEY = "fde-platform.theme";
  function applyTheme(t) {
    if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
  }
  function getTheme() { try { return localStorage.getItem(THEME_KEY) || "auto"; } catch (e) { return "auto"; } }
  function setTheme(t) { try { localStorage.setItem(THEME_KEY, t); } catch (e) {} applyTheme(t); }
  applyTheme(getTheme());

  /* ---------- header + footer ---------- */
  const NAV = [
    { href: "index.html", label: "Home", id: "home" },
    { href: "plan.html", label: "Plan", id: "plan" },
    { href: "lessons.html", label: "Lessons", id: "lessons" },
    { href: "certification.html", label: "Certification", id: "cert" },
    { href: "practice.html", label: "Practice", id: "practice" },
    { label: "Projects", soon: true },
    { label: "Glossary", soon: true },
    { href: "settings.html", label: "Settings", id: "settings" }
  ];
  let BASE = "";

  function header(active, base) {
    BASE = base || "";
    const el = document.getElementById("site-header");
    if (!el) return;
    const items = NAV.map(n => n.soon
      ? '<span class="nav-item soon" title="Coming soon">' + n.label + '</span>'
      : '<a class="nav-item' + (n.id === active ? ' active" aria-current="page' : '') + '" href="' + BASE + n.href + '">' + n.label + '</a>'
    ).join("");
    el.innerHTML =
      '<div class="header-inner">' +
        '<a class="brand" href="' + BASE + 'index.html"><span class="brand-mark" aria-hidden="true">FDE</span><span class="brand-text">Preparation</span></a>' +
        '<nav class="nav" aria-label="Main">' + items + '</nav>' +
        '<button class="icon-btn" id="theme-btn" type="button" aria-label="Change theme"></button>' +
      '</div>';
    const btn = document.getElementById("theme-btn");
    const labels = { auto: "Theme: Auto", light: "Theme: Light", dark: "Theme: Dark" };
    const order = ["auto", "light", "dark"];
    const paint = () => { btn.textContent = labels[getTheme()]; };
    paint();
    btn.addEventListener("click", () => {
      const next = order[(order.indexOf(getTheme()) + 1) % order.length];
      setTheme(next); paint();
    });
    if (!Store.hasProfile() && active !== "settings") onboarding();
  }

  function footer() {
    const el = document.getElementById("site-footer");
    if (!el) return;
    el.innerHTML =
      '<div class="footer-inner">' +
        '<div class="footer-tools">' +
          '<button class="btn btn-ghost" id="export-btn" type="button">Export my progress</button>' +
          '<label class="btn btn-ghost" for="import-input">Import progress</label>' +
          '<input id="import-input" type="file" accept="application/json" hidden>' +
          '<span class="save-state" id="save-state"></span>' +
        '</div>' +
        '<p class="footer-note">FDE Preparation: an open, self-paced program for becoming a Forward Deployed Engineer. ' +
        'Your name and progress are stored only in this browser and are never sent anywhere.</p>' +
      '</div>';
    document.getElementById("export-btn").addEventListener("click", Store.exportFile);
    document.getElementById("import-input").addEventListener("change", e => {
      const f = e.target.files[0];
      if (!f) return;
      Store.importFile(f).then(() => location.reload())
        .catch(() => toast("That file isn't a valid progress export."));
    });
    const paintSave = () => {
      const s = document.getElementById("save-state");
      if (!s) return;
      s.textContent = Store.isPersistent()
        ? "Progress saves automatically in this browser"
        : "Progress can't be saved here. Open the platform with the start script.";
      s.className = "save-state" + (Store.isPersistent() ? "" : " warn");
    };
    paintSave();
    document.addEventListener("store:change", paintSave);
  }

  /* ---------- profile form (used by onboarding + settings) ---------- */
  function finishDateFor(startIso, pace, tracks) {
    const [y, m, d] = startIso.split("-").map(Number);
    const start = new Date(y, m - 1, d, 12);
    const prof = Store.get().profile, saved = { pace: prof.pace, tracks: prof.tracks };
    prof.pace = pace.id; prof.tracks = tracks;           // temporarily, to reuse the calendar math
    const days = (weekStart(F.weeks.length) - Store.startDate()) / DAY;
    prof.pace = saved.pace; prof.tracks = saved.tracks;
    return addDays(start, Math.round(days) - 1);
  }
  function profileFormHTML(p) {
    return '<label class="field"><span>Your first name</span>' +
        '<input type="text" id="pf-name" maxlength="40" autocomplete="given-name" placeholder="e.g. Alex" value="' + esc(p.name) + '"></label>' +
      '<label class="field"><span>Start date <small>(a Monday works best)</small></span>' +
        '<input type="date" id="pf-start" value="' + esc(p.startDate || Store.nextMonday()) + '"></label>' +

      '<fieldset class="field"><legend>Tracks <small>(the core build track is always on)</small></legend>' +
        '<label class="check"><input type="checkbox" id="pf-cert"' + (!p.tracks || p.tracks.cert ? ' checked' : '') + '><span class="check-text"><b>Claude Certified Architect prep</b>: about 6.5h a week, from Week 2</span></label>' +
        '<label class="check"><input type="checkbox" id="pf-ent"' + (!p.tracks || p.tracks.ent ? ' checked' : '') + '><span class="check-text"><b>Enterprise FDE</b>: about 6.5h a week: security, compliance, identity, integrations, adoption</span></label>' +
      '</fieldset>' +
      '<fieldset class="field pace-field"><legend>Your pace</legend>' +
        F.paces.map(pc => '<label class="pace-card"><input type="radio" name="pf-pace" value="' + pc.id + '"' + (p.pace === pc.id ? ' checked' : '') + '>' +
          '<span class="pace-body"><b>' + pc.name + ' · ~' + pc.hours + ' h/week</b><span>' + esc(pc.blurb) + '</span>' +
          '<span class="pace-finish" data-finish="' + pc.id + '"></span></span></label>').join("") +
      '</fieldset>';
  }
  function bindProfileForm(root) {
    const paintFinish = () => {
      const s = root.querySelector("#pf-start").value || Store.nextMonday();
      const tr = { cert: root.querySelector("#pf-cert").checked, ent: root.querySelector("#pf-ent").checked };
      root.querySelectorAll("[data-finish]").forEach(el => {
        const pc = F.paces.find(x => x.id === el.dataset.finish);
        el.textContent = "Finishes around " + fmt(finishDateFor(s, pc, tr), { month: "short", day: "numeric", year: "numeric" });
      });
    };
    ["#pf-start", "#pf-cert", "#pf-ent"].forEach(sel => root.querySelector(sel).addEventListener("change", paintFinish));
    paintFinish();
  }
  function readProfileForm(root) {
    const name = root.querySelector("#pf-name").value.trim();
    const startDate = root.querySelector("#pf-start").value || Store.nextMonday();
    const checked = root.querySelector('input[name="pf-pace"]:checked');
    return { name, startDate, pace: checked ? checked.value : "fulltime",
      tracks: { cert: root.querySelector("#pf-cert").checked, ent: root.querySelector("#pf-ent").checked } };
  }

  /* ---------- onboarding (first visit) ---------- */
  function onboarding() {
    const wrap = document.createElement("div");
    wrap.className = "modal-backdrop";
    wrap.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="ob-title">' +
        '<div class="eyebrow">Welcome</div>' +
        '<h2 id="ob-title">Let\'s set up your program</h2>' +
        '<p class="muted small">A 28-week, hands-on path to becoming an enterprise-ready Forward Deployed Engineer, with optional Claude Certified Architect preparation. Everything you enter stays in this browser.</p>' +
        '<form id="ob-form">' + profileFormHTML({ name: "", startDate: "", pace: "fulltime", tracks: { cert: true, ent: true } }) +
          '<p class="form-error" id="ob-error" hidden>Please enter your name.</p>' +
          '<button class="btn btn-primary" type="submit">Start my program</button>' +
        '</form>' +
      '</div>';
    document.body.appendChild(wrap);
    document.body.classList.add("modal-open");
    bindProfileForm(wrap);
    wrap.querySelector("#pf-name").focus();
    wrap.querySelector("#ob-form").addEventListener("submit", e => {
      e.preventDefault();
      const p = readProfileForm(wrap);
      if (!p.name) { wrap.querySelector("#ob-error").hidden = false; return; }
      Store.update(s => { s.profile = p; });
      location.reload();
    });
  }

  /* ---------- toast ---------- */
  function toast(msg) {
    let t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ---------- project status ---------- */
  const STATUS = [
    { id: "not-started", label: "Not started" },
    { id: "in-progress", label: "In progress" },
    { id: "shipped", label: "Shipped" }
  ];
  function projectStatus(id) { return Store.get().projects[id] || "not-started"; }
  function userName() { return Store.get().profile.name || "there"; }

  return {
    esc, link, fmt, addDays, weekStart, weekEnd, weekRange, programEnd, todayNoon, isoDay,
    currentWeekIndex, daysUntilStart, phaseOf, projectOf, weekIndex,
    sessionsOf, partsOf, sessionHours, tracksOn, totalHours, sessionKey, isSessionDone, nextSession, hoursDone, plannedHours,
    header, footer, toast, STATUS, projectStatus, userName,
    profileFormHTML, bindProfileForm, readProfileForm, DAY
  };
})();
