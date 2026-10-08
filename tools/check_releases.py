#!/usr/bin/env python3
"""Check releases.json, the platform's release notes.

  python tools/check_releases.py            validate releases.json
  python tools/check_releases.py --staged   also fail if staged learner-visible changes
                                            have no release note (used by the pre-commit hook)
  python tools/check_releases.py --markdown 2026.10.08
                                            print that release as Markdown, for the GitHub Release text

Maintainers: enable the hook once per clone with
  git config core.hooksPath tools/hooks
See docs/releases.md for how to write a release note.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VERSION_RE = re.compile(r"^(\d{4})\.(\d{2})\.(\d{2})(?:\.(\d+))?$")
PAGES = {"home", "plan", "lessons", "certification", "practice", "settings", "whats-new"}
KINDS = ("new", "changed", "fixed")
# Changes a learner can see. Docs, tools other than the server, and the README don't need a note.
VISIBLE = re.compile(r"^(lessons/|assets/|[^/]+\.html$|start\.sh$|start\.bat$|tools/serve\.py$)")


def week_ids() -> set[str]:
    src = (ROOT / "assets/js/curriculum.js").read_text(encoding="utf-8")
    return set(re.findall(r'\{\s*id:\s*"((?:0[A-C])|(?:W\d+)|(?:B\d+))",\s*phase:', src))


def vkey(v: str) -> tuple[int, ...]:
    return tuple(int(p) for p in v.split("."))


def validate(data: dict, weeks: set[str]) -> list[str]:
    errs: list[str] = []
    if data.get("schema") != 1:
        errs.append('"schema" must be 1')
    rels = data.get("releases")
    if not isinstance(rels, list) or not rels:
        return errs + ['"releases" must be a non-empty list, newest first']
    seen: set[str] = set()
    prev = None
    for i, r in enumerate(rels):
        where = f"releases[{i}] ({r.get('version', '?')})"
        v = r.get("version", "")
        m = VERSION_RE.match(v)
        if not m:
            errs.append(f"{where}: version must look like 2026.10.08 or 2026.10.08.1")
            continue
        if v in seen:
            errs.append(f"{where}: duplicate version")
        seen.add(v)
        if r.get("date") != f"{m[1]}-{m[2]}-{m[3]}":
            errs.append(f"{where}: date must be {m[1]}-{m[2]}-{m[3]} to match the version")
        if prev and vkey(v) >= vkey(prev):
            errs.append(f"{where}: releases must be newest first ({v} comes after {prev})")
        prev = v
        if not str(r.get("title", "")).strip():
            errs.append(f"{where}: missing title")
        items = 0
        for k in KINDS:
            lst = r.get(k, [])
            if not isinstance(lst, list) or not all(isinstance(t, str) and t.strip() for t in lst):
                errs.append(f'{where}: "{k}" must be a list of non-empty strings')
            else:
                items += len(lst)
        if not items:
            errs.append(f"{where}: needs at least one item in new, changed or fixed")
        for j, a in enumerate(r.get("affects", [])):
            aw = f"{where} affects[{j}]"
            if not str(a.get("note", "")).strip():
                errs.append(f"{aw}: missing note")
            if "week" in a:
                if a["week"] not in weeks:
                    errs.append(f"{aw}: unknown week {a['week']!r}")
            elif a.get("page") not in PAGES:
                errs.append(f"{aw}: needs a week id or one of the pages {sorted(PAGES)}")
    return errs


def git(*args: str) -> subprocess.CompletedProcess:
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True)


def check_staged() -> list[str]:
    staged = [f for f in git("diff", "--cached", "--name-only").stdout.splitlines() if f]
    visible = [f for f in staged if VISIBLE.match(f)]
    if not visible:
        return []
    if "releases.json" not in staged:
        return ["These staged files change what learners see, but releases.json isn't staged:",
                *[f"  {f}" for f in visible[:10]],
                "Add or extend a release note (see docs/releases.md), then stage releases.json."]
    head = git("show", "HEAD:releases.json")
    if head.returncode == 0:
        try:
            old_top = json.loads(head.stdout)["releases"][0]["version"]
            new_top = json.loads(git("show", ":releases.json").stdout)["releases"][0]["version"]
            if vkey(new_top) < vkey(old_top):
                return [f"The newest release in releases.json ({new_top}) is older than the last committed one ({old_top})."]
        except (ValueError, KeyError, IndexError):
            pass
    return []


def markdown(r: dict) -> str:
    out = [f"## {r['title']}", ""]
    for k, label in (("new", "New"), ("changed", "Changed"), ("fixed", "Fixed")):
        if r.get(k):
            out += [f"### {label}", *[f"- {t}" for t in r[k]], ""]
    if r.get("affects"):
        out += ["### If you already started", *[
            f"- **{('Week ' + a['week'].lstrip('W')) if 'week' in a else a['page'].replace('-', ' ').capitalize()}:** {a['note']}" for a in r["affects"]], ""]
    return "\n".join(out).rstrip() + "\n"


def main(argv: list[str]) -> int:
    try:
        data = json.loads((ROOT / "releases.json").read_text(encoding="utf-8"))
    except (OSError, ValueError) as e:
        print(f"releases.json: {e}")
        return 1
    errs = validate(data, week_ids())
    if "--markdown" in argv:
        i = argv.index("--markdown")
        want = argv[i + 1] if i + 1 < len(argv) else data["releases"][0]["version"]
        rel = next((r for r in data["releases"] if r["version"] == want), None)
        if rel is None or errs:
            print(f"No valid release {want} in releases.json" + ("".join("\n  " + e for e in errs)))
            return 1
        sys.stdout.write(markdown(rel))
        return 0
    if "--staged" in argv:
        errs += check_staged()
    if errs:
        print("Release notes check failed:")
        for e in errs:
            print("  " + e)
        return 1
    print(f"releases.json OK: {len(data['releases'])} releases, newest {data['releases'][0]['version']}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
