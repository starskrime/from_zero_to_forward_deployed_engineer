/* ==========================================================================
   Practice & mock exams
   ========================================================================== */
(function () {
  const F = window.FDE, U = window.UI, S = window.Store, Q = window.QBANK;
  U.header("practice"); U.footer();
  const panel = document.getElementById("panel");
  const TRACK = { core: "Core", cert: "Certification", ent: "Enterprise" };
  const DOM = {}; F.cert.domains.forEach(d => { DOM[d.id] = d; });

  /* ---------- helpers ---------- */
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sameSet = (a, b) => a.length === b.length && a.every(x => b.includes(x));
  function reachedIndex() {
    const next = U.nextSession(), ci = U.currentWeekIndex();
    return Math.max(next ? next.index : F.weeks.length - 1, ci);
  }
  function record(q, correct) {
    S.update(s => {
      s.practice = s.practice || {};
      const r = s.practice[q.id] || { seen: 0, correct: 0, lastWrong: false };
      r.seen++; if (correct) r.correct++; r.lastWrong = !correct; s.practice[q.id] = r;
    });
  }
  function qHTML(q, name, chosen, locked) {
    const multi = q.type === "multi";
    const need = q.answer.length;
    return '<fieldset class="q' + (locked ? (sameSet(chosen, q.answer) ? ' right' : ' wrong') : '') + '">' +
      '<legend class="plain">' + U.esc(q.q) + (multi ? ' <span class="chip">Choose ' + need + '</span>' : '') + '</legend>' +
      '<div class="q-meta">' + TRACK[q.track] + (q.domain ? ' · ' + q.domain + ' ' + U.esc(DOM[q.domain].name) : '') + (q.task ? ' · task ' + q.task : '') + ' · taught in ' + q.week + '</div>' +
      q.options.map((o, i) => {
        let cls = "opt";
        if (locked && q.answer.includes(i)) cls += " is-answer";
        if (locked && chosen.includes(i) && !q.answer.includes(i)) cls += " is-wrong";
        return '<label class="' + cls + '"><input type="' + (multi ? 'checkbox' : 'radio') + '" name="' + name + '" value="' + i + '"' +
          (chosen.includes(i) ? ' checked' : '') + (locked ? ' disabled' : '') + '> <span>' + U.esc(o) + '</span></label>';
      }).join("") +
      (locked ? '<p class="explain"><b>' + (sameSet(chosen, q.answer) ? "Correct." : "Not quite.") + '</b> ' + U.esc(q.why) + '</p>' : '') +
    '</fieldset>';
  }
  const readChosen = (root, name) => [...root.querySelectorAll('input[name="' + name + '"]:checked')].map(x => Number(x.value));

  /* ---------- PRACTICE ---------- */
  const pstate = { track: "all", domain: "all", scope: "all", queue: [], i: 0, right: 0, done: 0 };
  function buildQueue() {
    const reached = reachedIndex(), pr = S.get().practice || {};
    let qs = Q.filter(q => (pstate.track === "all" || q.track === pstate.track) &&
      (pstate.domain === "all" || q.domain === pstate.domain));
    if (pstate.scope === "reached") qs = qs.filter(q => U.weekIndex(q.week) <= reached);
    if (pstate.scope === "missed") qs = qs.filter(q => pr[q.id] && pr[q.id].lastWrong);
    if (pstate.scope === "new") qs = qs.filter(q => !pr[q.id]);
    // unseen and previously-missed first, then the rest
    const score = q => { const r = pr[q.id]; return !r ? 0 : r.lastWrong ? 1 : 2; };
    pstate.queue = shuffle(qs).sort((a, b) => score(a) - score(b));
    pstate.i = 0; pstate.right = 0; pstate.done = 0;
  }
  function practiceView() {
    const counts = t => Q.filter(q => t === "all" || q.track === t).length;
    panel.innerHTML =
      '<div class="card practice-filters">' +
        '<label>Track <select id="f-track"><option value="all">All tracks (' + counts("all") + ')</option>' +
          ["cert", "ent", "core"].map(t => '<option value="' + t + '">' + TRACK[t] + ' (' + counts(t) + ')</option>').join("") + '</select></label>' +
        '<label>Exam domain <select id="f-domain"><option value="all">All domains</option>' +
          F.cert.domains.map(d => '<option value="' + d.id + '">' + d.id + ' ' + U.esc(d.name) + '</option>').join("") + '</select></label>' +
        '<label>Which questions <select id="f-scope"><option value="all">All weeks</option><option value="reached">Only weeks I\'ve reached</option>' +
          '<option value="new">Not answered yet</option><option value="missed">Ones I got wrong last time</option></select></label>' +
        '<button class="btn btn-primary" id="f-start" type="button">Start</button>' +
      '</div><div id="pq"></div>';
    ["track", "domain", "scope"].forEach(k => { const el = document.getElementById("f-" + k); el.value = pstate[k]; el.addEventListener("change", () => { pstate[k] = el.value; }); });
    document.getElementById("f-start").addEventListener("click", () => { buildQueue(); showQ(); });
    buildQueue(); showQ();
  }
  function showQ(locked, chosen) {
    const box = document.getElementById("pq");
    if (!pstate.queue.length) { box.innerHTML = '<div class="empty">No questions match these filters yet. The bank grows with every lesson pack.</div>'; return; }
    if (pstate.i >= pstate.queue.length) {
      box.innerHTML = '<div class="card"><h3>Round complete</h3><p>You got <b>' + pstate.right + ' of ' + pstate.done + '</b> right.</p>' +
        '<button class="btn btn-primary" id="again" type="button">Practice again</button></div>';
      document.getElementById("again").addEventListener("click", () => { buildQueue(); showQ(); });
      return;
    }
    const q = pstate.queue[pstate.i];
    box.innerHTML = '<div class="quiz-score"><div>Question <b>' + (pstate.i + 1) + '</b> of ' + pstate.queue.length + ' · ' + pstate.right + ' right so far</div></div>' +
      qHTML(q, "pq", chosen || [], !!locked) +
      '<div class="q-actions">' + (locked ? '<button class="btn btn-primary" id="next" type="button">Next question</button>'
                                          : '<button class="btn btn-primary" id="check" type="button">Check answer</button>') + '</div>';
    if (locked) { document.getElementById("next").addEventListener("click", () => { pstate.i++; showQ(); }); return; }
    document.getElementById("check").addEventListener("click", () => {
      const ch = readChosen(box, "pq");
      if (!ch.length) { U.toast("Pick an answer first."); return; }
      const ok = sameSet(ch, q.answer);
      record(q, ok); pstate.done++; if (ok) pstate.right++;
      showQ(true, ch);
    });
  }

  /* ---------- MOCK EXAM ---------- */
  let mock = null, timer = null;
  function mockIntro() {
    const pool = Q.filter(q => q.track === "cert");
    panel.innerHTML =
      '<div class="grid grid-2" style="align-items:start">' +
        '<div class="card"><h3>Mock exam</h3>' +
          '<p class="small muted">Scenario-style questions weighted like the real exam\'s domains. No feedback until you submit. The real exam has 60 questions in 120 minutes and needs a scaled 720 of 1,000 to pass.</p>' +
          '<label class="pace-card"><input type="radio" name="mlen" value="20" checked><span class="pace-body"><b>Quick mock · 20 questions · 40 minutes</b><span>Good for weekly checks.</span></span></label>' +
          '<label class="pace-card"><input type="radio" name="mlen" value="60"><span class="pace-body"><b>Full mock · 60 questions · 120 minutes</b><span>Exam conditions. Uses every certification question available if the bank has fewer than 60.</span></span></label>' +
          '<p class="small">Certification questions in the bank right now: <b>' + pool.length + '</b>. Mock exams 1–3 in Weeks 8, 12 and 17 add fresh questions.</p>' +
          '<button class="btn btn-primary" id="m-start" type="button">Start mock exam</button></div>' +
        '<div class="card"><h3>Weights</h3>' + F.cert.domains.map(d => '<div class="dom-row"><div class="dom-top"><span>' + d.id + ' · ' + U.esc(d.name) + '</span><b>' + d.weight + '%</b></div></div>').join("") +
          '<p class="small muted" style="margin:10px 0 0">Mock scores are a guide only. The real exam is scaled, so a percentage here does not convert exactly to its 100–1,000 score. Aim for 80%+ on full mocks before booking.</p></div>' +
      '</div>';
    document.getElementById("m-start").addEventListener("click", () => {
      const n = Number(panel.querySelector('input[name="mlen"]:checked').value);
      startMock(n);
    });
  }
  function pickWeighted(n) {
    const pool = Q.filter(q => q.track === "cert");
    if (pool.length <= n) return shuffle(pool);
    const out = [];
    F.cert.domains.forEach(d => {
      const k = Math.round(n * d.weight / 100);
      out.push(...shuffle(pool.filter(q => q.domain === d.id)).slice(0, k));
    });
    const rest = shuffle(pool.filter(q => !out.includes(q)));
    while (out.length < n && rest.length) out.push(rest.pop());
    return shuffle(out.slice(0, n));
  }
  function startMock(n) {
    const qs = pickWeighted(n);
    mock = { qs, answers: {}, flags: {}, i: 0, n: qs.length, end: Date.now() + (n === 60 ? 120 : 40) * 60000, started: new Date().toISOString() };
    clearInterval(timer);
    timer = setInterval(tick, 1000);
    mockQ();
  }
  function tick() {
    const el = document.getElementById("m-timer");
    if (!mock) return clearInterval(timer);
    const left = Math.max(0, mock.end - Date.now());
    if (el) el.textContent = Math.floor(left / 60000) + ":" + String(Math.floor(left / 1000) % 60).padStart(2, "0");
    if (left <= 0) { U.toast("Time's up. Submitting."); submitMock(); }
  }
  function saveCurrent() {
    const q = mock.qs[mock.i];
    mock.answers[q.id] = readChosen(panel, "mq");
  }
  function mockQ() {
    const q = mock.qs[mock.i];
    const answered = Object.values(mock.answers).filter(a => a.length).length;
    panel.innerHTML =
      '<div class="mock-bar"><span>Question <b>' + (mock.i + 1) + '</b> of ' + mock.n + ' · ' + answered + ' answered</span>' +
        '<span class="mock-timer">⏱ <b id="m-timer"></b></span></div>' +
      '<div class="mock-nav">' + mock.qs.map((x, j) => '<button type="button" data-j="' + j + '" class="mn' + (j === mock.i ? ' cur' : '') +
        ((mock.answers[x.id] || []).length ? ' ans' : '') + (mock.flags[x.id] ? ' flag' : '') + '">' + (j + 1) + '</button>').join("") + '</div>' +
      qHTML(Object.assign({}, q, { week: q.week }), "mq", mock.answers[q.id] || [], false).replace(/<div class="q-meta">.*?<\/div>/, '') +
      '<div class="q-actions">' +
        '<button class="btn btn-ghost" id="m-prev" type="button"' + (mock.i === 0 ? ' disabled' : '') + '>← Previous</button>' +
        '<button class="btn btn-ghost" id="m-flag" type="button">' + (mock.flags[q.id] ? 'Unflag' : 'Flag for review') + '</button>' +
        (mock.i < mock.n - 1 ? '<button class="btn btn-primary" id="m-next" type="button">Next →</button>' : '') +
        '<button class="btn btn-ghost" id="m-submit" type="button">Submit exam</button>' +
      '</div>';
    tick();
    const go = j => { saveCurrent(); mock.i = j; mockQ(); };
    panel.querySelectorAll("[data-j]").forEach(b => b.addEventListener("click", () => go(Number(b.dataset.j))));
    const prev = document.getElementById("m-prev"); if (prev) prev.addEventListener("click", () => go(mock.i - 1));
    const next = document.getElementById("m-next"); if (next) next.addEventListener("click", () => go(mock.i + 1));
    document.getElementById("m-flag").addEventListener("click", () => { saveCurrent(); mock.flags[q.id] = !mock.flags[q.id]; mockQ(); });
    document.getElementById("m-submit").addEventListener("click", () => {
      saveCurrent();
      const left = mock.n - Object.values(mock.answers).filter(a => a.length).length;
      if (left && !panel.querySelector("#m-confirm")) {
        const c = document.createElement("p"); c.id = "m-confirm"; c.className = "form-error";
        c.innerHTML = left + ' question' + (left > 1 ? 's are' : ' is') + ' unanswered. <button type="button" class="btn btn-link" id="m-yes">Submit anyway</button>';
        panel.appendChild(c);
        document.getElementById("m-yes").addEventListener("click", submitMock);
        return;
      }
      submitMock();
    });
  }
  function submitMock() {
    if (!mock) return;
    clearInterval(timer);
    if (panel.querySelector('input[name="mq"]')) saveCurrent();
    const per = {}; let right = 0;
    mock.qs.forEach(q => {
      const ok = sameSet(mock.answers[q.id] || [], q.answer);
      if (ok) right++;
      per[q.domain] = per[q.domain] || { n: 0, r: 0 }; per[q.domain].n++; if (ok) per[q.domain].r++;
      record(q, ok);
    });
    const pct = Math.round(right / mock.n * 100);
    const result = { date: new Date().toISOString(), n: mock.n, right, pct, per };
    S.update(s => { s.mocks = s.mocks || []; s.mocks.push(result); });
    const done = mock; mock = null;
    panel.innerHTML =
      '<div class="card"><h3>Mock result: ' + pct + '%</h3>' +
        '<p>' + right + ' of ' + done.n + ' correct. ' + (pct >= 80 ? '<b>Strong.</b> Keep this up on full mocks before booking.' : pct >= 72 ? '<b>Close.</b> Focus on your weakest domain below.' : '<b>Not yet.</b> Review the explanations, then practice your weakest domains.') + '</p>' +
        F.cert.domains.map(d => { const p = per[d.id]; if (!p) return ''; const a = Math.round(p.r / p.n * 100);
          return '<div class="dom-row"><div class="dom-top"><span>' + d.id + ' · ' + U.esc(d.name) + '</span><b>' + a + '% (' + p.r + '/' + p.n + ')</b></div>' +
            '<div class="bar"><span style="width:' + a + '%;background:' + (a >= 72 ? 'var(--ok)' : 'var(--warn)') + '"></span></div></div>'; }).join("") +
        '<button class="btn btn-primary" id="m-again" type="button" style="margin-top:14px">New mock exam</button></div>' +
      '<h3 style="margin-top:28px">Review every question</h3>' +
      done.qs.map((q, j) => qHTML(q, "r" + j, done.answers[q.id] || [], true)).join("");
    document.getElementById("m-again").addEventListener("click", mockIntro);
    window.scrollTo(0, 0);
  }

  /* ---------- HISTORY ---------- */
  function historyView() {
    const st = S.get(), pr = st.practice || {}, mocks = st.mocks || [];
    const byTrack = t => { let s = 0, r = 0; Q.filter(q => q.track === t).forEach(q => { const x = pr[q.id]; if (x) { s += x.seen; r += x.correct; } }); return s ? Math.round(r / s * 100) + '% of ' + s : 'not started'; };
    const answered = Object.keys(pr).length;
    panel.innerHTML =
      '<div class="grid grid-3">' + ["core", "cert", "ent"].map(t => '<div class="card stat"><span class="stat-label">' + TRACK[t] + ' accuracy</span><span class="stat-num" style="font-size:22px">' + byTrack(t) + '</span></div>').join("") + '</div>' +
      '<div class="card" style="margin-top:16px"><h3>Coverage</h3><p class="small">You have answered <b>' + answered + '</b> of the <b>' + Q.length + '</b> questions in the bank at least once.</p>' +
        '<div class="bar"><span style="width:' + Math.round(answered / Q.length * 100) + '%"></span></div></div>' +
      '<div class="card" style="margin-top:16px"><h3>Mock exams</h3>' + (mocks.length
        ? '<table class="compare"><thead><tr><th>Date</th><th>Questions</th><th>Score</th></tr></thead><tbody>' +
          mocks.slice().reverse().map(m => '<tr><td>' + new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + '</td><td>' + m.n + '</td><td><b>' + m.pct + '%</b></td></tr>').join("") + '</tbody></table>'
        : '<p class="small muted">No mock exams yet.</p>') + '</div>';
  }

  /* ---------- tabs ---------- */
  function setMode(m) {
    if (mock && m !== "mock") { U.toast("Finish or submit your mock exam first."); return; }
    document.querySelectorAll("[data-mode]").forEach(b => b.setAttribute("aria-selected", String(b.dataset.mode === m)));
    if (m === "practice") practiceView(); else if (m === "mock") mockIntro(); else historyView();
  }
  document.querySelectorAll("[data-mode]").forEach(b => b.addEventListener("click", () => setMode(b.dataset.mode)));
  window.addEventListener("beforeunload", e => { if (mock) { e.preventDefault(); e.returnValue = ""; } });
  const fromHash = () => setMode(location.hash === "#mock" ? "mock" : location.hash === "#history" ? "history" : "practice");
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
