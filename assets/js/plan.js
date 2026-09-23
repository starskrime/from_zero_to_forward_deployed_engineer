/* ==========================================================================
   Plan page
   ========================================================================== */
(function () {
  const F = window.FDE, U = window.UI, S = window.Store;
  U.header("plan");
  U.footer();

  const state = { phase: "all", q: "", open: new Set() };

  /* ---------------- facts ---------------- */
  function facts() {
    const total = F.weeks.length;
    const pace = S.pace();
    const f = [
      [U.fmt(S.startDate(), { month: "short", day: "numeric", year: "numeric" }), "Your start date"],
      [U.fmt(U.programEnd(), { month: "short", day: "numeric", year: "numeric" }), "Planned finish at your pace"],
      [total + " program weeks", "3 foundation + 23 core + buffer & exam week"],
      [pace.name + " · ~" + pace.hours + " h/week", "~" + U.plannedHours() + " hours in total · <a href=\"settings.html\">change</a>"],
      [F.projects.length + " projects", "8 guided + 2 capstones"],
      ["1 certification", "Claude Certified Architect – Foundations"]
    ];
    document.getElementById("facts").innerHTML = f.map(x => '<div class="fact"><b>' + x[0] + '</b><span>' + x[1] + '</span></div>').join("");
  }

  /* ---------------- overview ---------------- */
  function overview() {
    document.getElementById("principles").innerHTML = F.principles.map((p, i) =>
      '<div class="card principle"><div class="num">0' + (i + 1) + '</div><h3>' + U.esc(p.t) + '</h3><p>' + U.esc(p.d) + '</p></div>').join("");

    const counted = F.phases.filter(p => p.id !== "pb");
    document.getElementById("phase-strip").innerHTML = counted.map(p => {
      const ws = F.weeks.filter(w => w.phase === p.id);
      return '<button type="button" class="phase-seg ph-' + p.color + '" style="flex:' + ws.length + '" data-phase="' + p.id + '">' +
        '<b>' + U.esc(p.short) + '</b><span>' + ws[0].id + (ws.length > 1 ? '–' + ws[ws.length - 1].id : '') + '</span></button>';
    }).join("");
    document.querySelectorAll(".phase-seg").forEach(b => b.addEventListener("click", () => {
      setPhase(b.dataset.phase);
      document.getElementById("timeline").scrollIntoView();
    }));

    document.getElementById("phase-cards").innerHTML = counted.map(p => {
      const ws = F.weeks.filter(w => w.phase === p.id);
      const a = U.weekIndex(ws[0].id), b = U.weekIndex(ws[ws.length - 1].id);
      const range = U.fmt(U.weekStart(a)) + " – " + U.fmt(U.weekEnd(b));
      return '<div class="card ph-' + p.color + '" style="border-top:3px solid var(--ph)">' +
        '<div class="eyebrow">Phase ' + p.n + ' · ' + range + '</div><h3>' + U.esc(p.name) + '</h3>' +
        '<p class="small" style="color:var(--ink-2);margin:0">' + U.esc(p.summary) + '</p></div>';
    }).join("");
  }

  /* ---------------- tracks ---------------- */
  function tracks() {
    const on = U.tracksOn();
    const hrs = { core: 22, cert: 6.5, ent: 6.5 };
    const out = {
      core: "10 portfolio projects and a production-grade engineering habit",
      cert: "Ready to pass the Claude Certified Architect – Foundations exam (booked for exam week, B2)",
      ent: "Fluency in security reviews, compliance, identity, integrations, reliability, cost and adoption"
    };
    const links = { core: "#timeline", cert: "certification.html", ent: "#timeline" };
    document.getElementById("track-cards").innerHTML = F.tracks.map(t => {
      const active = t.id === "core" || on[t.id];
      return '<div class="card track-card tc-' + t.id + (active ? '' : ' off') + '">' +
        '<div class="eyebrow">' + (t.id === "core" ? "Track A" : t.id === "cert" ? "Track B" : "Track C") + ' · ~' + hrs[t.id] + ' h/week' + (active ? '' : ' · switched off') + '</div>' +
        '<h3>' + U.esc(t.name) + '</h3><p class="small" style="color:var(--ink-2)">' + U.esc(t.d) + '</p>' +
        '<p class="small"><b>You finish with:</b> ' + out[t.id] + '</p>' +
        '<a class="small" href="' + links[t.id] + '">' + (t.id === "cert" ? "Certification details →" : "See it in the timeline →") + '</a></div>';
    }).join("");
    document.getElementById("tracks-note").innerHTML = (on.cert && on.ent ? "All tracks on" : "Some tracks are off") + ' · <a href="settings.html">change in Settings</a>';
    document.getElementById("matrix").innerHTML =
      '<thead><tr><th>Week</th><th>Core build</th><th>Certification</th><th>Enterprise FDE</th></tr></thead><tbody>' +
      F.weeks.map(w => {
        const p = U.phaseOf(w);
        return '<tr class="ph-' + p.color + '"><td><a href="#week-' + w.id + '" data-jump="' + w.id + '"><span class="ph-badge">' + w.id + '</span></a></td>' +
          '<td>' + U.esc(w.title) + (w.project ? ' <span class="chip">' + w.project + '</span>' : '') + '</td>' +
          '<td class="small">' + (w.cert ? U.esc(w.cert.focus) + (w.cert.mock ? ' <span class="chip">Mock ' + w.cert.mock + '</span>' : '') :
                                 w.id === "B2" ? "<b>Take the exam</b>" : '<span class="muted">' + U.esc((w.deep || "—").replace(/^Deep practice: /, "")) + '</span>') + '</td>' +
          '<td class="small">' + (w.ent ? U.esc(w.ent.theme) : '<span class="muted">—</span>') + '</td></tr>';
      }).join("") + '</tbody>';
    document.querySelectorAll("#matrix [data-jump]").forEach(a => a.addEventListener("click", () => openWeek(a.dataset.jump)));
  }

  /* ---------------- timeline ---------------- */
  function filters() {
    const opts = [{ id: "all", name: "All weeks" }].concat(F.phases);
    document.getElementById("filters").innerHTML =
      opts.map(p => '<button type="button" class="filter' + (p.color ? ' ph-' + p.color : '') + '" data-f="' + p.id + '" aria-pressed="' + (state.phase === p.id) + '">' +
        (p.color ? '<i class="ph-dot"></i>' : '') + U.esc(p.short || p.name) + '</button>').join("") +
      '<input class="search" id="search" type="search" placeholder="Search topics or tools, e.g. MCP, RAG, Streamlit" aria-label="Search the timeline">';
    document.querySelectorAll("[data-f]").forEach(b => b.addEventListener("click", () => setPhase(b.dataset.f)));
    document.getElementById("search").addEventListener("input", e => { state.q = e.target.value.trim().toLowerCase(); weeks(); });
  }

  function setPhase(id) {
    state.phase = id;
    document.querySelectorAll("[data-f]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.f === id)));
    weeks();
  }

  function matches(w) {
    if (state.phase !== "all" && w.phase !== state.phase) return false;
    if (!state.q) return true;
    const proj = w.project ? U.projectOf(w.project) : null;
    const hay = [w.id, w.title, w.goal, w.weekend, w.dsa || "", w.learn.join(" "), w.tools.join(" "),
      w.cert ? w.cert.focus : "", w.ent ? w.ent.theme : "", w.deep || "",
      proj ? proj.name + " " + proj.domain + " " + proj.skills.join(" ") : ""].join(" ").toLowerCase();
    return hay.includes(state.q);
  }

  function weekHTML(w) {
    const i = U.weekIndex(w.id), p = U.phaseOf(w);
    const proj = w.project ? U.projectOf(w.project) : null;
    const done = !!S.get().weeksDone[w.id];
    const now = i === U.currentWeekIndex();
    const open = state.open.has(w.id);
    return '<article class="week ph-' + p.color + (open ? ' open' : '') + (now ? ' is-now' : '') + '" id="week-' + w.id + '">' +
      '<button class="week-head" type="button" aria-expanded="' + open + '" data-toggle="' + w.id + '">' +
        '<span class="ph-badge">' + w.id + '</span>' +
        '<span class="week-title"><b>' + U.esc(w.title) + '</b><span>' + U.weekRange(i) + (now ? ' · <strong style="color:var(--ph)">this week</strong>' : '') + '</span></span>' +
        '<span class="week-meta">' +
          (w.lesson ? '<span class="chip" style="color:var(--accent)">Lesson ready</span>' : '') +
          (proj ? '<span class="chip">' + proj.id + ' · ' + U.esc(proj.domain) + '</span>' : '') +
          (done ? '<span class="status shipped">Done</span>' : '') +
        '</span>' +
        '<span class="caret" aria-hidden="true">▶</span>' +
      '</button>' +
      '<div class="week-body">' +
        '<p class="goal">' + U.esc(w.goal) + '</p>' +
        '<div class="wb-grid"><div>' +
          (w.learn.length ? '<div class="wb-block"><p class="wb-label">What you will learn</p><ul class="learn-list">' + w.learn.map(x => '<li>' + U.esc(x) + '</li>').join("") + '</ul></div>' : '') +
          '<div class="wb-block"><p class="wb-label">Weekend</p><div class="weekend">' +
            (proj && w.weekend.indexOf(proj.id) < 0 ? '<b>' + proj.id + ' · ' + U.esc(proj.name) + '.</b> ' : '') + U.esc(w.weekend) + '</div></div>' +
        '</div><div>' +
          (w.tools.length ? '<div class="wb-block"><p class="wb-label">Tools</p><div class="chips">' + w.tools.map(t => '<span class="chip tool">' + U.esc(t) + '</span>').join("") + '</div></div>' : '') +
          (w.links.length ? '<div class="wb-block"><p class="wb-label">Resources: docs, videos, papers</p><div class="links">' + w.links.map(k => U.link(k)).join("") + '</div></div>' : '') +
          (w.cert ? '<div class="wb-block track-block tb-cert"><p class="wb-label">Certification track</p><b>' + U.esc(w.cert.focus) + '</b>' +
            (w.cert.tasks.length ? '<div class="small muted">Exam tasks ' + w.cert.tasks.join(", ") + '</div>' : '') +
            (w.cert.mock ? '<div><a class="small" href="practice.html#mock">Mock exam ' + w.cert.mock + ' this week →</a></div>' : '') +
            '<div class="links" style="margin-top:6px">' + w.cert.links.map(k => U.link(k)).join("") + '</div></div>' :
           w.deep ? '<div class="wb-block track-block tb-deep"><p class="wb-label">Deep practice</p>' + U.esc(w.deep) + '</div>' : '') +
          (w.ent ? '<div class="wb-block track-block tb-ent"><p class="wb-label">Enterprise track</p><b>' + U.esc(w.ent.theme) + '</b>' +
            '<div class="links" style="margin-top:6px">' + w.ent.links.map(k => U.link(k)).join("") + '</div></div>' : '') +
          (w.dsa ? '<div class="wb-block"><p class="wb-label">DSA practice</p><span class="chip">' + U.esc(w.dsa) + '</span></div>' : '') +
          (w.rhythm ? '<div class="wb-block"><p class="wb-label">Time</p><span class="small muted">~' + U.totalHours(w) + ' hours in ' + U.sessionsOf(w).length + ' sessions · ' + U.esc(F.rhythms[w.rhythm].name) + '</span></div>' : '') +
          (w.lesson ? '<div class="wb-block"><a class="btn btn-primary" href="' + w.lesson + '">Open lesson pack →</a></div>' : '') +
          '<div class="wb-block"><label class="done-toggle"><input type="checkbox" data-done="' + w.id + '"' + (done ? ' checked' : '') + '> Mark week complete</label></div>' +
        '</div></div>' +
      '</div>' +
    '</article>';
  }

  function weeks() {
    const list = F.weeks.filter(matches);
    const el = document.getElementById("weeks");
    el.innerHTML = list.length ? list.map(weekHTML).join("") : '<div class="empty">No weeks match that search.</div>';
    el.querySelectorAll("[data-toggle]").forEach(b => b.addEventListener("click", () => {
      const id = b.dataset.toggle;
      state.open.has(id) ? state.open.delete(id) : state.open.add(id);
      const art = document.getElementById("week-" + id);
      art.classList.toggle("open");
      b.setAttribute("aria-expanded", String(art.classList.contains("open")));
    }));
    el.querySelectorAll("[data-done]").forEach(cb => cb.addEventListener("change", e => {
      const id = e.target.dataset.done;
      S.update(s => { if (e.target.checked) s.weeksDone[id] = true; else delete s.weeksDone[id]; });
      U.toast(e.target.checked ? id + " marked complete" : id + " marked not complete");
      weeks();
    }));
    const allOpen = list.length && list.every(w => state.open.has(w.id));
    document.getElementById("expand-all").textContent = allOpen ? "Collapse all" : "Expand all";
  }

  document.getElementById("expand-all").addEventListener("click", () => {
    const list = F.weeks.filter(matches);
    const allOpen = list.every(w => state.open.has(w.id));
    list.forEach(w => allOpen ? state.open.delete(w.id) : state.open.add(w.id));
    weeks();
  });

  /* ---------------- rhythm ---------------- */
  let rhythmKey = "learn";
  function rhythm() {
    const keys = Object.keys(F.rhythms);
    document.getElementById("rhythm-tabs").innerHTML = keys.map(k =>
      '<button class="tab" role="tab" type="button" aria-selected="' + (k === rhythmKey) + '" data-r="' + k + '">' + U.esc(F.rhythms[k].name) + '</button>').join("");
    document.querySelectorAll("[data-r]").forEach(b => b.addEventListener("click", () => { rhythmKey = b.dataset.r; rhythm(); }));
    const pace = S.pace();
    const sample = F.weeks.find(w => w.rhythm === rhythmKey && w.cert) || F.weeks.find(w => w.rhythm === rhythmKey);
    const TR = { core: "Core", cert: "Certification", ent: "Enterprise", deep: "Deep practice" };
    document.getElementById("rhythm-rows").innerHTML = F.rhythms[rhythmKey].sessions.map(d => {
      const parts = U.partsOf({ cert: { focus: "this week's exam skills" }, ent: { theme: "this week's theme" } }, d);
      const h = parts.reduce((a, p) => a + p.h, 0);
      return '<div class="r-row"><span class="r-day">' + (d.id.startsWith("d") ? "Day " + d.id.slice(1) : "Wknd " + d.id.slice(1)) + '</span>' +
        '<span class="r-hours"><span class="hb" style="width:' + (h * 10) + 'px"></span>' + h + 'h' + (pace.id === "fulltime" ? ' · ' + d.day : '') + '</span>' +
        '<span class="r-what"><ul class="parts">' + parts.map(p => '<li class="part part-' + p.track + '"><span class="part-tag">' + TR[p.track] + ' · ' + p.h + 'h</span>' +
          U.esc(p.track === "core" ? p.what : p.track === "cert" ? "Certification: this week's exam skills" : "Enterprise: this week's theme") + '</li>').join("") + '</ul></span></div>';
    }).join("");
    document.getElementById("rhythm-note").innerHTML = pace.id === "fulltime"
      ? "On your <b>Full-time</b> pace, sessions map to Monday–Sunday: 4 hours each weekday, 7.5 hours each weekend day."
      : "On your <b>" + pace.name + "</b> pace (" + pace.weekday + "h weekdays, " + pace.weekend + "h weekend days), just do the next session whenever you sit down. The dashboard tracks where you are and whether you're on schedule.";
  }

  /* ---------------- projects ---------------- */
  function projects() {
    const st = S.get();
    document.getElementById("ptbody").innerHTML = F.projects.map(p => {
      const status = U.projectStatus(p.id);
      const pf = st.portfolio[p.id] || {};
      const pfDone = F.portfolio.filter(x => pf[x.id]).length;
      return '<tr id="proj-' + p.id + '">' +
        '<td><b>' + p.id + '</b></td>' +
        '<td><b>' + U.esc(p.name) + '</b><div class="orig">Built with: ' + U.esc(p.provider || "") + '</div>' +
          '<p class="small" style="margin:6px 0;color:var(--ink-2)">' + U.esc(p.pitch) + '</p>' +
          '<div class="chips">' + p.skills.map(s => '<span class="chip tool">' + U.esc(s) + '</span>').join("") + '</div>' +
          '<details class="pf"><summary>Portfolio checklist · ' + pfDone + '/' + F.portfolio.length + '</summary>' +
            F.portfolio.map(x => '<label class="check' + (pf[x.id] ? ' is-done' : '') + '"><input type="checkbox" data-pf="' + p.id + '|' + x.id + '"' + (pf[x.id] ? ' checked' : '') + '><span class="check-text">' + U.esc(x.t) + '</span></label>').join("") +
          '</details></td>' +
        '<td>' + U.esc(p.domain) + '</td>' +
        '<td><a href="#week-' + p.week.split("–")[0] + '" data-jump="' + p.week.split("–")[0] + '">' + p.week + '</a></td>' +
        '<td><select data-status="' + p.id + '" aria-label="Status of ' + p.id + '">' +
          U.STATUS.map(s => '<option value="' + s.id + '"' + (s.id === status ? ' selected' : '') + '>' + s.label + '</option>').join("") +
        '</select></td>' +
      '</tr>';
    }).join("");

    document.querySelectorAll("[data-status]").forEach(sel => sel.addEventListener("change", e => {
      S.update(s => { s.projects[e.target.dataset.status] = e.target.value; });
      U.toast(e.target.dataset.status + " → " + e.target.selectedOptions[0].textContent);
    }));
    document.querySelectorAll("[data-pf]").forEach(cb => cb.addEventListener("change", e => {
      const [pid, key] = e.target.dataset.pf.split("|");
      S.update(s => { s.portfolio[pid] = s.portfolio[pid] || {}; s.portfolio[pid][key] = e.target.checked; });
      const det = e.target.closest("details"); const wasOpen = det.open;
      projects();
      const again = document.querySelector('#proj-' + pid + ' details'); if (again) again.open = wasOpen;
    }));
    document.querySelectorAll("[data-jump]").forEach(a => a.addEventListener("click", () => openWeek(a.dataset.jump)));
  }

  /* ---------------- stack ---------------- */
  function stack() {
    document.getElementById("stack-grid").innerHTML = F.stack.map(c =>
      '<div class="card stack-cat"><h3>' + U.esc(c.cat) + '</h3><div class="links">' + c.items.map(k => U.link(k)).join("") + '</div></div>').join("");
    document.getElementById("cloud-map").innerHTML =
      '<table class="compare"><thead><tr><th>Capability</th><th>AWS (primary)</th><th>Azure</th><th>Google Cloud</th></tr></thead><tbody>' +
      F.cloudMap.map(r => '<tr>' + r.map(c => '<td>' + U.esc(c) + '</td>').join("") + '</tr>').join("") + '</tbody></table>';
  }

  /* ---------------- setup ---------------- */
  function setup() {
    const st = S.get();
    const done = F.setup.filter(x => st.setup[x.id]).length;
    const el = document.getElementById("setup-list");
    el.innerHTML = '<div class="section-head" style="margin-bottom:6px"><h3 style="margin:0">Accounts & tools</h3><span class="chip">' + done + ' / ' + F.setup.length + '</span></div>' +
      F.setup.map(x => '<label class="check' + (st.setup[x.id] ? ' is-done' : '') + '"><input type="checkbox" data-setup="' + x.id + '"' + (st.setup[x.id] ? ' checked' : '') + '>' +
        '<span class="check-text">' + U.esc(x.t) + '<br>' + U.link(x.link) + '</span></label>').join("");
    el.querySelectorAll("[data-setup]").forEach(cb => cb.addEventListener("change", e => {
      S.update(s => { s.setup[e.target.dataset.setup] = e.target.checked; }); setup();
    }));
    document.getElementById("pf-standard").innerHTML = F.portfolio.map(x => '<li>' + U.esc(x.t) + '</li>').join("");
  }

  /* ---------------- deep links + subnav highlight ---------------- */
  function openWeek(id) {
    if (!F.weeks.some(w => w.id === id)) return;
    if (state.phase !== "all" || state.q) { state.q = ""; document.getElementById("search").value = ""; setPhase("all"); }
    state.open.add(id); weeks();
    const el = document.getElementById("week-" + id);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
  }
  function handleHash() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h.startsWith("week-")) openWeek(h.slice(5));
  }
  window.addEventListener("hashchange", handleHash);

  function subnavSpy() {
    const links = [...document.querySelectorAll("#subnav a")];
    const secs = links.map(a => document.querySelector(a.getAttribute("href")));
    const onScroll = () => {
      let idx = 0;
      secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < 140) idx = i; });
      links.forEach((a, i) => a.classList.toggle("active", i === idx));
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- boot ---------------- */
  facts(); overview(); tracks(); filters(); weeks(); rhythm(); projects(); stack(); setup(); subnavSpy();
  const ci = U.currentWeekIndex();
  if (!location.hash) { state.open.add(F.weeks[Math.max(0, Math.min(ci, F.weeks.length - 1))].id); weeks(); }
  handleHash();
})();
