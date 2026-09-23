/* ==========================================================================
   Progress store: everything is saved in THIS browser only (localStorage).
   Nothing is sent anywhere. Export / Import makes a backup file.
   ========================================================================== */

window.Store = (function () {
  const KEY = "fde-platform.v2";
  const blank = () => ({
    profile: { name: "", startDate: "", pace: "fulltime", tracks: { cert: true, ent: true } },
    weeksDone: {}, projects: {}, sessions: {},
    setup: {}, portfolio: {}, lessonDays: {}, exercises: {}, hints: {},
    quiz: {}, miniquiz: {}, practice: {}, mocks: [], readiness: {}, accept: {}, reflections: {}, updatedAt: null
  });
  let mem = null;
  let persistent = true;

  function load() {
    if (mem) return mem;
    mem = blank();
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        Object.assign(mem, parsed);
        mem.profile = Object.assign(blank().profile, parsed.profile || {});
        mem.profile.tracks = Object.assign({ cert: true, ent: true }, mem.profile.tracks || {});
      }
    } catch (e) { persistent = false; }
    return mem;
  }

  function save() {
    mem.updatedAt = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(mem)); persistent = true; }
    catch (e) { persistent = false; }
    document.dispatchEvent(new CustomEvent("store:change"));
  }

  function get() { return load(); }
  function update(fn) { load(); fn(mem); save(); }
  function isPersistent() { load(); return persistent; }
  function hasProfile() { return !!load().profile.name; }

  /* next Monday (or today if today is Monday), as YYYY-MM-DD */
  function nextMonday() {
    const t = new Date();
    const add = (8 - t.getDay()) % 7;
    const d = new Date(t.getFullYear(), t.getMonth(), t.getDate() + add, 12);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function startDate() {
    const s = load().profile.startDate || nextMonday();
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d, 12);            // noon avoids DST edge cases
  }

  function pace() {
    const id = load().profile.pace;
    return window.FDE.paces.find(p => p.id === id) || window.FDE.paces[0];
  }

  function exportFile() {
    const data = JSON.stringify(load(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    a.href = URL.createObjectURL(blob);
    a.download = "fde-progress-" + today + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function importFile(file) {
    return file.text().then(txt => {
      const parsed = JSON.parse(txt);
      if (typeof parsed !== "object" || parsed === null || !parsed.profile) throw new Error("Not a progress file");
      mem = Object.assign(blank(), parsed);
      mem.profile = Object.assign(blank().profile, parsed.profile);
      save();
    });
  }

  function reset() {
    mem = blank();
    try { localStorage.removeItem(KEY); } catch (e) {}
    document.dispatchEvent(new CustomEvent("store:change"));
  }

  return { get, update, save, startDate, pace, nextMonday, hasProfile, exportFile, importFile, reset, isPersistent };
})();
