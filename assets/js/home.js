/* ==========================================================================
   Home dashboard
   ========================================================================== */
(function () {
  const F = window.FDE, U = window.UI, S = window.Store;

  U.header("home");
  U.footer();

  function greeting() {
    const h = new Date().getHours();
    const part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
    document.getElementById("greeting").textContent = part + ", " + U.userName();
  }

  /* ---------------- hero status + overall progress ---------------- */
  function heroStatus() {
    const ci = U.currentWeekIndex();
    const total = F.weeks.length;
    const done = F.weeks.filter(w => S.get().weeksDone[w.id]).length;
    const el = document.getElementById("hero-status");
    const pace = S.pace();

    if (ci < 0) {
      const n = U.daysUntilStart();
      el.innerHTML = "Your program starts on <b>" + U.fmt(S.startDate(), { weekday: "long", month: "long", day: "numeric" }) +
        "</b>, " + (n === 1 ? "tomorrow" : "in " + n + " days") + ". Finish your setup checklist before then.";
    } else if (ci >= total) {
      el.innerHTML = "The calendar for all " + total + " program weeks has passed. Finish what's left, ship the portfolio, and start interviewing.";
    } else {
      const w = F.weeks[ci], p = U.phaseOf(w);
      el.innerHTML = "On the calendar: <b>week " + w.id + "</b> of " + total + " · " + U.esc(p.name) + " · " + U.esc(w.title);
    }
    document.getElementById("overall-bar").style.width = Math.round(done / total * 100) + "%";
    document.getElementById("overall-text").textContent =
      done + " of " + total + " weeks complete · " + pace.name + " pace (~" + pace.hours + " h/week) · planned finish " +
      U.fmt(U.programEnd(), { month: "long", day: "numeric", year: "numeric" });
  }

  /* ---------------- next session ---------------- */
  function nextCard() {
    const el = document.getElementById("today-card");
    const ci = U.currentWeekIndex();
    const next = U.nextSession();

    if (!next) {
      el.className = "card today-card ph-green";
      el.innerHTML = '<div class="eyebrow">Program complete</div><p class="today-what">Every session is done. Congratulations!</p>';
      return;
    }
    const w = next.week, s = next.session, p = U.phaseOf(w);
    el.className = "card today-card ph-" + p.color;

    // on track?  compare the calendar week with the week of the next session
    let track = "";
    if (ci >= 0) {
      if (next.index < ci) track = '<span class="status in-progress">Behind by ' + (ci - next.index) + (ci - next.index === 1 ? ' week' : ' weeks') + '</span>';
      else if (next.index > ci) track = '<span class="status shipped">Ahead of schedule</span>';
      else track = '<span class="status shipped">On track</span>';
    } else {
      track = '<span class="status">Starts ' + U.fmt(S.startDate()) + '</span>';
    }
    const lessonUrl = w.lesson ? w.lesson + "#" + s.id : null;
    const pace = S.pace();
    const hrs = U.sessionHours(w, s), weekend = s.id.startsWith("w");
    const perSitting = weekend ? pace.weekend : pace.weekday;
    const sittings = hrs <= perSitting ? "" :
      '<p class="small muted" style="margin:6px 0 0">At your pace this is about ' + (Math.round(hrs / perSitting * 10) / 10) + ' sittings.</p>';
    const TR = { core: "Core", cert: "Certification", ent: "Enterprise", deep: "Deep practice" };
    const parts = U.partsOf(w, s).map(p =>
      '<li class="part part-' + p.track + '"><span class="part-tag">' + TR[p.track] + ' · ' + p.h + 'h</span>' + U.esc(p.what) + '</li>').join("");

    el.innerHTML =
      '<div class="eyebrow">Next session · Week ' + U.esc(w.id) + ' · ' + U.esc(p.short) + '</div>' +
      '<div class="today-day"><strong>' + (s.id.startsWith("d") ? "Day " + s.id.slice(1) : "Weekend " + s.id.slice(1)) + '</strong>' +
        '<span class="chip">' + hrs + ' hours</span>' + track + '</div>' +
      '<p class="today-what" style="margin-bottom:8px">' + U.esc(w.title) + '</p>' +
      '<ul class="parts">' + parts + '</ul>' + sittings +
      '<div class="today-actions">' +
        (lessonUrl ? '<a class="btn btn-primary" href="' + lessonUrl + '">Open this session</a>'
                   : '<button class="btn btn-primary" id="session-btn" type="button">Mark session done</button>') +
        '<a class="btn btn-ghost" href="plan.html#week-' + w.id + '">Week ' + w.id + ' in the plan</a>' +
      '</div>' +
      (lessonUrl ? '<p class="small muted" style="margin:12px 0 0">Tick "Session done" at the end of the session in the lesson.</p>'
                 : '<p class="small muted" style="margin:12px 0 0">This week\'s lesson pack is published before it starts.</p>');

    const b = document.getElementById("session-btn");
    if (b) b.addEventListener("click", () => {
      S.update(st => { st.lessonDays[U.sessionKey(w, s)] = U.isoDay(U.todayNoon()); });
      U.toast("Session logged. Nice work.");
      renderAll();
    });
  }

  /* ---------------- stats ---------------- */
  function activeDays() {
    const st = S.get(), set = new Set();
    Object.values(st.lessonDays).forEach(v => { if (typeof v === "string") set.add(v); });
    Object.keys(st.sessions || {}).forEach(k => set.add(k));
    return set;
  }
  function streak(days) {
    let d = U.todayNoon();
    if (!days.has(U.isoDay(d))) d = U.addDays(d, -1);
    let n = 0;
    while (days.has(U.isoDay(d))) { n++; d = U.addDays(d, -1); }
    return n;
  }

  function stats() {
    const st = S.get();
    const weeksDone = F.weeks.filter(w => st.weeksDone[w.id]).length;
    const shipped = F.projects.filter(p => U.projectStatus(p.id) === "shipped").length;
    const hours = U.hoursDone(), planned = U.plannedHours();
    const days = activeDays();

    const dots = [];
    const today = U.todayNoon();
    for (let i = 13; i >= 0; i--) {
      const d = U.addDays(today, -i), k = U.isoDay(d);
      dots.push('<i class="' + (days.has(k) ? "on" : "") + (i === 0 ? " today" : "") + '" title="' + U.fmt(d, { weekday: "short", month: "short", day: "numeric" }) + (days.has(k) ? " · studied" : "") + '"></i>');
    }

    document.getElementById("stats").innerHTML =
      '<div class="card stat"><span class="stat-label">Weeks complete</span><span class="stat-num">' + weeksDone + ' <small>/ ' + F.weeks.length + '</small></span>' +
        '<div class="bar"><span style="width:' + Math.round(weeksDone / F.weeks.length * 100) + '%"></span></div></div>' +
      '<div class="card stat"><span class="stat-label">Projects shipped</span><span class="stat-num">' + shipped + ' <small>/ ' + F.projects.length + '</small></span>' +
        '<div class="bar"><span style="width:' + Math.round(shipped / F.projects.length * 100) + '%;background:var(--ok)"></span></div></div>' +
      '<div class="card stat"><span class="stat-label">Current streak</span><span class="stat-num">' + streak(days) + ' <small>days</small></span>' +
        '<div class="streak" aria-label="Last 14 days">' + dots.join("") + '</div></div>' +
      '<div class="card stat"><span class="stat-label">Hours completed</span><span class="stat-num">' + hours + ' <small>/ ~' + planned + '</small></span>' +
        '<div class="bar"><span style="width:' + Math.min(100, Math.round(hours / planned * 100)) + '%"></span></div></div>';
  }

  /* ---------------- ribbon ---------------- */
  function ribbon() {
    const ci = U.currentWeekIndex();
    const st = S.get();
    document.getElementById("ribbon").innerHTML = F.weeks.map((w, i) => {
      const p = U.phaseOf(w);
      const cls = ["ph-" + p.color, st.weeksDone[w.id] ? "done" : "", i === ci ? "now" : ""].join(" ");
      return '<a class="' + cls + '" href="plan.html#week-' + w.id + '" title="' + U.esc(w.id + " · " + w.title + " · " + U.weekRange(i)) + '">' + w.id + '</a>';
    }).join("");
    document.getElementById("legend").innerHTML = F.phases.map(p =>
      '<span class="ph-' + p.color + '"><i class="ph-dot"></i>' + U.esc(p.name) + '</span>').join("") +
      '<span class="muted">▼ marks the calendar week · filled = complete</span>';
  }

  /* ---------------- this week ---------------- */
  function thisWeek() {
    const next = U.nextSession();
    const i = next ? next.index : F.weeks.length - 1;
    const w = F.weeks[i], p = U.phaseOf(w);
    const proj = w.project ? U.projectOf(w.project) : null;
    const el = document.getElementById("this-week");
    const sess = U.sessionsOf(w);
    const doneCount = sess.filter(s => U.isSessionDone(w, s)).length;
    el.className = "card ph-" + p.color;
    el.innerHTML =
      '<div class="eyebrow">Your current week · ' + U.weekRange(i) + '</div>' +
      '<h3><span class="ph-badge">' + w.id + '</span> ' + U.esc(w.title) + '</h3>' +
      '<p class="muted" style="margin-bottom:12px">' + U.esc(w.goal) + '</p>' +
      (sess.length ? '<div class="session-dots">' + sess.map(s =>
        '<span class="sd' + (U.isSessionDone(w, s) ? ' on' : '') + '" title="' + U.esc(s.what) + '">' + (s.id.startsWith("d") ? "D" + s.id.slice(1) : "W" + s.id.slice(1)) + '</span>').join("") +
        '<span class="small muted">' + doneCount + ' / ' + sess.length + ' sessions</span></div>' : '') +
      (w.learn.length ? '<p class="wb-label" style="margin-top:14px">You will learn</p><ul class="learn-list">' + w.learn.map(x => '<li>' + U.esc(x) + '</li>').join("") + '</ul>' : '') +
      '<div class="wb-block" style="margin-top:14px"><p class="wb-label">Weekend project</p><div class="weekend">' +
        (proj && w.weekend.indexOf(proj.id) < 0 ? '<b>' + proj.id + ' · ' + U.esc(proj.name) + '.</b> ' : '') + U.esc(w.weekend) + '</div></div>' +
      (w.cert ? '<div class="wb-block"><p class="wb-label">Certification focus</p><div class="weekend">' + U.esc(w.cert.focus) + '</div></div>' : '') +
      (w.ent ? '<div class="wb-block"><p class="wb-label">Enterprise theme</p><div class="weekend">' + U.esc(w.ent.theme) + '</div></div>' : '') +
      (w.links.length ? '<div class="wb-block"><p class="wb-label">Resources</p><div class="links">' + w.links.map(k => U.link(k)).join("") + '</div></div>' : '');
  }

  /* ---------------- setup checklist ---------------- */
  function setupCard() {
    const st = S.get();
    const done = F.setup.filter(x => st.setup[x.id]).length;
    const el = document.getElementById("setup-card");
    el.innerHTML =
      '<div class="section-head" style="margin-bottom:6px"><h3 style="margin:0">Setup checklist</h3><span class="chip">' + done + ' / ' + F.setup.length + '</span></div>' +
      '<p class="small muted">Accounts and tools you will need. Set spending limits first. Nothing here is stored except your ticks.</p>' +
      F.setup.map(x => {
        const on = !!st.setup[x.id];
        return '<label class="check' + (on ? ' is-done' : '') + '"><input type="checkbox" data-setup="' + x.id + '"' + (on ? ' checked' : '') + '>' +
          '<span class="check-text">' + U.esc(x.t) + '<br>' + U.link(x.link) + '</span></label>';
      }).join("");
    el.querySelectorAll("[data-setup]").forEach(cb => cb.addEventListener("change", e => {
      S.update(s => { s.setup[e.target.dataset.setup] = e.target.checked; });
      setupCard();
    }));
  }

  /* ---------------- projects ---------------- */
  function projects() {
    document.getElementById("projects").innerHTML = F.projects.map(p => {
      const st = U.projectStatus(p.id);
      const label = U.STATUS.find(s => s.id === st).label;
      return '<a class="card proj" href="plan.html#proj-' + p.id + '" style="color:inherit;text-decoration:none">' +
        '<div class="proj-top"><span class="proj-id">' + p.id + ' · ' + p.week + '</span><span class="status ' + st + '">' + label + '</span></div>' +
        '<h3>' + U.esc(p.name) + '</h3>' +
        '<p>' + U.esc(p.pitch) + '</p>' +
        '<div class="chips"><span class="chip">' + U.esc(p.domain) + '</span></div>' +
      '</a>';
    }).join("");
  }

  function renderAll() {
    greeting(); heroStatus(); nextCard(); stats(); ribbon(); thisWeek(); setupCard(); projects();
  }
  renderAll();
})();
