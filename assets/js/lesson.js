/* ==========================================================================
   Lesson page components (shared by every weekly lesson pack)
   - day progress + sidebar scroll-spy
   - stepped hints (concept → pseudocode → snippet → full solution)
   - exercise / readiness / acceptance checkboxes
   - quiz with instant feedback
   - reflection journal with download
   - copy buttons on code blocks
   Page markup declares: <body data-week="0A">
   ========================================================================== */
(function () {
  const F = window.FDE, U = window.UI, S = window.Store;
  const WEEK = document.body.dataset.week;
  const week = F.weeks.find(w => w.id === WEEK);

  U.header("lessons", "../");
  U.footer();

  /* ---------------- generic keyed checkboxes ---------------- */
  // data-check="bucket|key"  → S.get()[bucket][key] = true/false
  function bindChecks(root) {
    (root || document).querySelectorAll("[data-check]").forEach(cb => {
      const [bucket, key] = cb.dataset.check.split("|");
      const st = S.get();
      cb.checked = !!(st[bucket] && st[bucket][key]);
      const row = cb.closest(".check"); if (row) row.classList.toggle("is-done", cb.checked);
      cb.addEventListener("change", () => {
        S.update(s => {
          s[bucket] = s[bucket] || {};
          // sessions remember the day they were finished (used for the streak)
          if (cb.checked) s[bucket][key] = bucket === "lessonDays" ? U.isoDay(U.todayNoon()) : true;
          else delete s[bucket][key];
        });
        if (row) row.classList.toggle("is-done", cb.checked);
        paintProgress();
      });
    });
  }

  /* ---------------- week + day progress ---------------- */
  const dayIds = [...document.querySelectorAll("[data-day]")].map(el => el.dataset.day);
  function paintProgress() {
    const st = S.get();
    const done = dayIds.filter(d => st.lessonDays[WEEK + "-" + d]).length;
    const bar = document.getElementById("week-bar");
    if (bar) bar.style.width = Math.round(done / dayIds.length * 100) + "%";
    const txt = document.getElementById("week-bar-text");
    if (txt) txt.textContent = done + " of " + dayIds.length + " sessions done";
    document.querySelectorAll(".toc a[data-toc]").forEach(a => {
      a.classList.toggle("is-done", !!st.lessonDays[WEEK + "-" + a.dataset.toc]);
    });
    // mark the whole week complete in the plan once every day is done
    if (done === dayIds.length && dayIds.length && !st.weeksDone[WEEK]) {
      S.update(s => { s.weeksDone[WEEK] = true; });
      U.toast("Week " + WEEK + " complete. Great work!");
    }
  }

  /* ---------------- sidebar TOC + scroll spy ---------------- */
  function toc() {
    const links = [...document.querySelectorAll(".toc a[href^='#']")];
    const secs = links.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
    const onScroll = () => {
      let idx = 0;
      secs.forEach((s, i) => { if (s.getBoundingClientRect().top < 160) idx = i; });
      links.forEach((a, i) => a.classList.toggle("active", i === idx));
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    // highlight today's day on load
    const next = U.nextSession();
    const t = next && next.week.id === WEEK ? document.querySelector('.toc a[data-toc="' + next.session.id + '"]') : null;
    if (t) t.classList.add("today");
  }

  /* ---------------- stepped hints ---------------- */
  function hints() {
    document.querySelectorAll(".hints").forEach(box => {
      const id = box.dataset.hints;
      const steps = [...box.querySelectorAll(".hint")];
      const ctrl = document.createElement("div");
      ctrl.className = "hint-ctrl";
      box.appendChild(ctrl);

      function shown() { return Math.min(S.get().hints[id] || 0, steps.length); }
      function paint() {
        const n = shown();
        steps.forEach((s, i) => { s.hidden = i >= n; });
        ctrl.innerHTML = "";
        if (n >= steps.length) {
          const b = btn("Hide all hints", "btn-ghost");
          b.onclick = () => { S.update(s => { s.hints[id] = 0; }); paint(); };
          ctrl.appendChild(b);
          return;
        }
        const next = steps[n];
        const isSolution = next.classList.contains("solution");
        const hintCount = steps.filter(x => !x.classList.contains("solution")).length;
        const label = (isSolution ? "Show full solution" : "Show hint " + (n + 1) + " of " + hintCount) +
          " · " + next.dataset.level;
        if (isSolution) {
          const wrap = document.createElement("label");
          wrap.className = "tried";
          wrap.innerHTML = '<input type="checkbox"> I tried on my own first (at least 15 minutes)';
          const b = btn(label, "btn-ghost");
          b.disabled = true;
          wrap.querySelector("input").addEventListener("change", e => { b.disabled = !e.target.checked; });
          b.onclick = () => { S.update(s => { s.hints[id] = n + 1; }); paint(); };
          ctrl.appendChild(wrap); ctrl.appendChild(b);
        } else {
          const b = btn(label, "btn-ghost");
          b.onclick = () => { S.update(s => { s.hints[id] = n + 1; }); paint(); };
          ctrl.appendChild(b);
        }
        if (n > 0) {
          const r = btn("Hide hints", "btn-link");
          r.onclick = () => { S.update(s => { s.hints[id] = 0; }); paint(); };
          ctrl.appendChild(r);
        }
      }
      paint();
    });
  }
  function btn(text, cls) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "btn " + cls; b.textContent = text;
    return b;
  }

  /* ---------------- copy buttons ---------------- */
  function copyButtons() {
    document.querySelectorAll("pre > code").forEach(code => {
      const pre = code.parentElement;
      if (pre.classList.contains("no-copy")) return;
      const b = document.createElement("button");
      b.type = "button"; b.className = "copy-btn"; b.textContent = "Copy";
      b.addEventListener("click", () => {
        const text = code.innerText.replace(/\n$/, "");
        const done = () => { b.textContent = "Copied"; setTimeout(() => (b.textContent = "Copy"), 1400); };
        if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
        else fallback();
        function fallback() {
          const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta);
          ta.select(); try { document.execCommand("copy"); done(); } catch (e) {} ta.remove();
        }
      });
      pre.appendChild(b);
    });
  }

  /* ---------------- quiz ---------------- */
  /* ---------------- quizzes (weekly + mini) ----------------
     Markup: <div class="quiz" data-quiz="0A-weekly"></div>
             <script type="application/json" data-quiz-for="0A-weekly">[...]</script>
     Each question: { id, q, options, answer (index), why }                     */
  function quiz() {
    document.querySelectorAll("[data-quiz]").forEach(root => {
      const qid = root.dataset.quiz;
      const dataEl = document.querySelector('script[data-quiz-for="' + qid + '"]');
      if (!dataEl) return;
      const qs = JSON.parse(dataEl.textContent);
      const mini = root.classList.contains("mini");
      const pass = Math.ceil(qs.length * 0.8);

      function answers() { return (S.get().quiz[qid] || {}); }
      function render() {
        const a = answers();
        const answered = qs.filter(q => a[q.id] !== undefined).length;
        const correct = qs.filter(q => a[q.id] === q.answer).length;
        root.innerHTML =
          '<div class="quiz-score"><div>' + (mini ? '<b>Mini-quiz</b> · ' : '') + '<b>' + correct + ' / ' + qs.length + '</b> correct · ' + answered + ' answered</div>' +
          (answered ? '<button type="button" class="btn btn-ghost" data-reset>Retake</button>' : '') + '</div>' +
          (!mini && answered === qs.length
            ? '<div class="note" style="margin-bottom:14px">' + (correct >= pass
                ? '<b>Ready for the weekend.</b> You scored ' + correct + '/' + qs.length + '. Review any misses below, then go build.'
                : '<b>Not yet.</b> Aim for ' + pass + '+. Re-read the sections the explanations point to, then retake.') + '</div>'
            : '') +
          qs.map((q, qi) => {
            const chosen = a[q.id];
            const locked = chosen !== undefined;
            const name = qid + "-" + q.id;
            return '<fieldset class="q' + (locked ? (chosen === q.answer ? ' right' : ' wrong') : '') + '">' +
              '<legend><span class="q-num">' + (qi + 1) + '</span>' + q.q + '</legend>' +
              q.options.map((o, oi) => {
                let cls = "opt";
                if (locked && oi === q.answer) cls += " is-answer";
                if (locked && oi === chosen && chosen !== q.answer) cls += " is-wrong";
                return '<label class="' + cls + '"><input type="radio" name="' + name + '" data-q="' + q.id + '" value="' + oi + '"' +
                  (oi === chosen ? ' checked' : '') + (locked ? ' disabled' : '') + '> <span>' + o + '</span></label>';
              }).join("") +
              (locked ? '<p class="explain"><b>' + (chosen === q.answer ? "Correct." : "Not quite.") + '</b> ' + q.why + '</p>' : '') +
            '</fieldset>';
          }).join("");

        root.querySelectorAll("input[type=radio]").forEach(r => r.addEventListener("change", e => {
          const id = e.target.dataset.q, val = Number(e.target.value);
          S.update(s => { s.quiz[qid] = s.quiz[qid] || {}; s.quiz[qid][id] = val; });
          const y = window.scrollY; render(); window.scrollTo(0, y);
        }));
        const reset = root.querySelector("[data-reset]");
        if (reset) reset.addEventListener("click", () => { S.update(s => { s.quiz[qid] = {}; }); render(); });
      }
      render();
    });
  }
  /* ---------------- reflection journal ---------------- */
  function reflection() {
    const fields = [...document.querySelectorAll("[data-reflect]")];
    if (!fields.length) return;
    const st = S.get();
    const saved = (st.reflections[WEEK] || {});
    let t;
    fields.forEach(f => {
      f.value = saved[f.dataset.reflect] || "";
      f.addEventListener("input", () => {
        clearTimeout(t);
        t = setTimeout(() => {
          S.update(s => {
            s.reflections[WEEK] = s.reflections[WEEK] || {};
            s.reflections[WEEK][f.dataset.reflect] = f.value;
          });
          const m = document.getElementById("reflect-saved");
          if (m) m.textContent = "Saved " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
        }, 400);
      });
    });
    const dl = document.getElementById("reflect-download");
    if (dl) dl.addEventListener("click", () => {
      const r = S.get().reflections[WEEK] || {};
      const body = fields.map(f => {
        const label = f.closest("label") ? f.closest("label").querySelector(".rq").textContent : f.dataset.reflect;
        return "<h2>" + U.esc(label) + "</h2><p>" + U.esc(r[f.dataset.reflect] || "").replace(/\n/g, "<br>") + "</p>";
      }).join("");
      const html = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Reflection · Week ' + WEEK + '</title>' +
        '<style>body{font:16px/1.6 -apple-system,Segoe UI,Arial,sans-serif;max-width:720px;margin:40px auto;padding:0 16px;color:#16191f}' +
        'h1{font-size:26px}h2{font-size:17px;margin-top:28px;color:#444b57}.meta{color:#6b7280}</style></head><body>' +
        '<h1>Week ' + WEEK + ' reflection · ' + U.esc(week ? week.title : "") + '</h1>' +
        '<p class="meta">Written ' + new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) + '</p>' +
        body + '</body></html>';
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
      a.download = "reflection-week-" + WEEK + ".html";
      document.body.appendChild(a); a.click(); a.remove();
    });
  }

  /* ---------------- dates in the header ---------------- */
  function dates() {
    const el = document.getElementById("week-dates");
    const i = U.weekIndex(WEEK);
    if (el && i >= 0) el.textContent = U.weekRange(i) + ", " + U.weekStart(i).getFullYear();
  }

  /* hide optional-track content the learner switched off (deep practice rides on the cert slot) */
  function tracksVisibility() {
    const on = U.tracksOn();
    document.querySelectorAll("[data-track]").forEach(el => { el.hidden = !on[el.dataset.track]; });
  }

  tracksVisibility(); dates(); bindChecks(); hints(); copyButtons(); quiz(); reflection(); toc(); paintProgress();
})();
