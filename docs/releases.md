# Releases and updates

How the platform keeps learners up to date, and how to write a release note.

## How learners get updates

`start.sh` and `start.bat` run `tools/serve.py`. Besides serving the site on `http://localhost:8765`, it checks GitHub at startup and every 24 hours while it runs:

| Situation | What happens |
|---|---|
| Git clone on `main`, no edited platform files | `git fetch`, then `git merge --ff-only origin/main`. A fast-forward only moves to newer commits; it never merges or rewrites history, and files git ignores (such as `code/`) are never touched. |
| A platform file was edited | Skipped. The learner is told which files, and how to undo them (`git restore .`). |
| Another branch is checked out, or there are local commits not on GitHub | Skipped, with the reason. |
| Offline, or GitHub can't be reached | Tried again at the next check. |
| Downloaded as a ZIP | Compares its `releases.json` with GitHub's and says when a newer version exists. |
| Started with `--no-update` | Never checks. |

Every check is logged to `.fde/update.log` (git-ignored). The latest result is served at `/__fde/status.json`. The Settings page shows it.

In the browser, `assets/js/releases.js` (loaded on every page by `ui.js`):
- compares the newest version in `releases.json` with the version the learner last acknowledged (`localStorage` key `fde-platform.seenRelease`), and shows every release they haven't seen in one "What's new" dialog, newest first. "Got it" marks them all seen.
- does not show a backlog to a new learner: their first visit records the current version.
- lists `affects` entries for weeks the learner has started under **Affects your progress**.
- adds an "Updated" badge to lessons changed in the last 30 days, and a note at the top of those lesson pages.
- checks `releases.json` every 10 minutes on an open page and offers a refresh after a background update.

## One release per push

Every push to `main` that changes what learners see gets one release. If several commits go out in one push, they share one release entry: extend the top entry instead of adding a new one.

- **Version:** the date, `YYYY.MM.DD`. A second release on the same day is `YYYY.MM.DD.1`, then `.2`.
- **date:** the same day as `YYYY-MM-DD`.

```json
{
  "version": "2026.10.08",
  "date": "2026-10-08",
  "title": "Week 5 published",
  "new": ["Week 5: Conversational & Multimodal Agents ..."],
  "changed": ["Practice: two certification questions updated ..."],
  "fixed": [],
  "affects": [
    { "week": "W3", "note": "Quiz D3 h2 replaced. Retake it if you finished it." },
    { "page": "practice", "note": "Questions c-d2-05 and c-d4-04 changed." }
  ]
}
```

## Writing good notes

- Write for a learner, not a developer: say what they will notice, not which file changed.
- Lead with the week: "Week 3: …".
- Use `affects` whenever something a learner may already have done changes: a quiz question, an exercise, its checks, a download, a day's hours. Say what to do about it ("Retake it", "Download the zip again").
- New weeks go under `new`. Rewrites go under `changed`. Corrections of mistakes go under `fixed`.
- Docs-only or tooling-only changes need no note.

## Checks

```
python tools/check_releases.py                       # validate releases.json
python tools/check_releases.py --markdown 2026.10.08 # the GitHub Release text for one version
git config core.hooksPath tools/hooks                # once per clone: block commits that change
                                                     # lessons/, assets/ or pages without a release note
```

When pushing, create a GitHub Release tagged `v2026.10.08` with the `--markdown` output as its text, so GitHub and the in-app notes always match.
