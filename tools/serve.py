#!/usr/bin/env python3
"""FDE Preparation: local server with automatic updates.

Started by start.sh / start.bat. Uses only the Python standard library.

  python tools/serve.py                 serve on http://localhost:8765 and keep the platform up to date
  python tools/serve.py --no-update     serve only, never check for updates
  python tools/serve.py --port 9000     use another port (the next free one is picked if it is busy)
  python tools/serve.py --check-now     check for an update once, print the result and exit

How updating works
  * At startup, then every 24 hours while the server runs, a background thread checks GitHub.
  * In a git clone on the main branch, it runs `git fetch` and then `git merge --ff-only`.
    A fast-forward can only move to newer commits: it never merges, never rewrites history
    and never touches files git ignores, so your work in code/ is safe.
  * It skips the update (and says why) when git is missing, a platform file was edited,
    another branch is checked out, there are local commits not on GitHub, or you are offline.
  * In a ZIP download it only tells you a newer version exists.
  * Every check is written to .fde/update.log. The page can read the latest result from
    /__fde/status.json (used by Settings and the "refresh" banner).
"""

from __future__ import annotations

import argparse
import functools
import http.server
import json
import os
import shutil
import socket
import subprocess
import sys
import threading
import time
import urllib.request
import webbrowser
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STATE_DIR = ROOT / ".fde"
LOG_FILE = STATE_DIR / "update.log"
LOG_MAX_BYTES = 200_000
BRANCH = "main"
REMOTE = "origin"
RAW_RELEASES = ("https://raw.githubusercontent.com/starskrime/"
                "from_zero_to_forward_deployed_engineer/main/releases.json")
REPO_URL = "https://github.com/starskrime/from_zero_to_forward_deployed_engineer"
STATUS_PATH = "/__fde/status.json"

_status_lock = threading.Lock()
_status: dict = {
    "auto_update": True,
    "mode": None,            # "git" | "zip"
    "state": "starting",     # starting | checking | up_to_date | updated | update_available | skipped | error | off
    "message": "",
    "version": None,         # latest version in the local releases.json
    "last_check": None,
    "next_check": None,
}


# ---------------------------------------------------------------- helpers
def now_iso() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


def log(msg: str) -> None:
    line = f"{now_iso()}  {msg}"
    print("  [update] " + msg, flush=True)
    try:
        STATE_DIR.mkdir(exist_ok=True)
        if LOG_FILE.exists() and LOG_FILE.stat().st_size > LOG_MAX_BYTES:
            LOG_FILE.replace(LOG_FILE.with_suffix(".log.1"))
        with LOG_FILE.open("a", encoding="utf-8") as f:
            f.write(line + "\n")
    except OSError:
        pass  # logging must never stop the server


def set_status(**kw) -> None:
    with _status_lock:
        _status.update(kw)


def get_status() -> dict:
    with _status_lock:
        return dict(_status)


def local_version() -> str | None:
    try:
        data = json.loads((ROOT / "releases.json").read_text(encoding="utf-8"))
        return data["releases"][0]["version"]
    except (OSError, ValueError, KeyError, IndexError):
        return None


def version_key(v: str) -> tuple:
    """'2026.10.08' < '2026.10.08.1' < '2026.10.09'."""
    return tuple(int(p) for p in v.split("."))


def git(*args: str, timeout: int = 60) -> subprocess.CompletedProcess:
    env = dict(os.environ, GIT_TERMINAL_PROMPT="0", GIT_ASKPASS="echo", LC_ALL="C")
    # BatchMode stops ssh from asking for a password or host-key confirmation in the background
    env.setdefault("GIT_SSH_COMMAND", "ssh -o BatchMode=yes")
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True,
                          timeout=timeout, env=env)


# ---------------------------------------------------------------- one check
def check_once() -> dict:
    """Check for an update once and apply it if it is safe. Returns the new status."""
    set_status(state="checking", message="Checking for updates…", last_check=now_iso())
    try:
        if (ROOT / ".git").exists() and shutil.which("git"):
            result = _check_git()
        elif (ROOT / ".git").exists():
            result = {"mode": "git", "state": "skipped",
                      "message": "Git is not installed, so updates can't be applied. Install git, or download the latest ZIP from GitHub."}
        else:
            result = _check_zip()
    except subprocess.TimeoutExpired:
        result = {"state": "error", "message": "Git took too long to answer (slow or no internet). Will try again later."}
    except Exception as e:  # never let the thread die
        result = {"state": "error", "message": f"Update check failed: {e.__class__.__name__}: {e}"}
    result.setdefault("mode", "git" if (ROOT / ".git").exists() else "zip")
    detail = result.pop("detail", "")
    set_status(version=local_version(), **result)
    log(f"{result['state']}: {result['message']}" + (f"  [{detail}]" if detail else ""))
    return get_status()


def _check_git() -> dict:
    branch = git("rev-parse", "--abbrev-ref", "HEAD").stdout.strip()
    if branch != BRANCH:
        return {"state": "skipped",
                "message": f"You're on the branch '{branch}', not '{BRANCH}', so updates are paused. Run `git switch {BRANCH}` to resume them."}

    changed = [ln for ln in git("status", "--porcelain", "--untracked-files=no").stdout.splitlines() if ln.strip()]
    if changed:
        files = [ln[3:] for ln in changed][:5]
        return {"state": "skipped",
                "message": "Platform files were edited here (" + ", ".join(files) +
                           "), so updates are paused to protect your changes. Undo them with `git restore .` to resume updates."}

    fetch = git("fetch", "--quiet", REMOTE, BRANCH, timeout=120)
    if fetch.returncode != 0:
        detail = " ".join((fetch.stderr or fetch.stdout).split())[:300]
        return {"state": "error", "detail": detail,
                "message": "Couldn't reach GitHub (no internet, or GitHub is down). Will try again later."}

    head = git("rev-parse", "HEAD").stdout.strip()
    remote = git("rev-parse", f"{REMOTE}/{BRANCH}").stdout.strip()
    if head == remote:
        return {"state": "up_to_date", "message": "You have the latest version."}

    if git("merge-base", "--is-ancestor", head, remote).returncode != 0:
        return {"state": "skipped",
                "message": "This copy has commits that aren't on GitHub, so it can't be fast-forwarded. Push or remove them to resume updates."}

    before = local_version()
    merge = git("merge", "--ff-only", "--quiet", f"{REMOTE}/{BRANCH}")
    if merge.returncode != 0:
        detail = (merge.stderr or merge.stdout).strip().splitlines()
        return {"state": "error", "message": "Update failed: " + (detail[-1] if detail else "unknown error")}
    after = local_version()
    if after and after != before:
        return {"state": "updated", "message": f"Updated to {after}. Refresh the page to see what's new."}
    return {"state": "updated", "message": "Updated to the latest version. Refresh the page to see it."}


def _check_zip() -> dict:
    mine = local_version()
    try:
        with urllib.request.urlopen(RAW_RELEASES, timeout=15) as r:
            latest = json.loads(r.read().decode("utf-8"))["releases"][0]["version"]
    except Exception:
        return {"mode": "zip", "state": "error",
                "message": "Couldn't reach GitHub to check for a newer version. Will try again later."}
    if mine and version_key(latest) <= version_key(mine):
        return {"mode": "zip", "state": "up_to_date", "message": "You have the latest version."}
    return {"mode": "zip", "state": "update_available",
            "message": f"Version {latest} is available. This copy was downloaded as a ZIP, so it can't update itself: "
                       f"download the new ZIP from {REPO_URL}, or clone the repository with git to get automatic updates."}


def updater_loop(interval_s: float, stop: threading.Event) -> None:
    while not stop.is_set():
        check_once()
        set_status(next_check=datetime.fromtimestamp(time.time() + interval_s).astimezone().isoformat(timespec="seconds"))
        stop.wait(interval_s)


# ---------------------------------------------------------------- server
class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self) -> None:
        # Always revalidate, so the browser never mixes old and new files after an update
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def do_GET(self) -> None:
        if self.path.split("?")[0] == STATUS_PATH:
            body = json.dumps(get_status()).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def log_message(self, fmt: str, *args) -> None:
        pass  # keep the terminal readable


def free_port(start: int) -> int:
    for port in range(start, start + 20):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    raise SystemExit(f"No free port between {start} and {start + 19}. Close other servers and try again.")


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Start the FDE Preparation platform.")
    ap.add_argument("--port", type=int, default=8765)
    ap.add_argument("--no-update", action="store_true", help="never check for updates")
    ap.add_argument("--no-browser", action="store_true", help="don't open the browser")
    ap.add_argument("--check-now", action="store_true", help="check for an update once and exit")
    ap.add_argument("--interval-hours", type=float, default=24.0, help=argparse.SUPPRESS)
    args = ap.parse_args(argv)

    if args.check_now:
        st = check_once()
        return 0 if st["state"] in ("up_to_date", "updated", "update_available") else 1

    port = free_port(args.port)
    url = f"http://localhost:{port}/index.html"
    handler = functools.partial(Handler, directory=str(ROOT))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)

    print("")
    print("  FDE Preparation platform")
    print(f"  Open: {url}")
    print("  Stop: press Ctrl+C (or close this window)")
    print("")

    stop = threading.Event()
    set_status(version=local_version())
    if args.no_update:
        set_status(auto_update=False, state="off",
                   message="Automatic updates are off (started with --no-update).")
        print("  Automatic updates are off.")
    else:
        threading.Thread(target=updater_loop, args=(args.interval_hours * 3600, stop),
                         daemon=True, name="fde-updater").start()

    if not args.no_browser:
        threading.Timer(1.0, lambda: webbrowser.open(url)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Stopped.")
    finally:
        stop.set()
        server.server_close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
