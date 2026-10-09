#!/usr/bin/env python3
"""Check that every YouTube video linked from the lessons still exists.

  python tools/check_videos.py

Uses YouTube's public oEmbed endpoint (no API key). A video that was deleted,
made private or blocked from embedding info returns an error and is listed.
Run it before every release; replace any video it reports.
"""
import json
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ID_RE = re.compile(r"(?:youtube\.com/watch\?v=|youtu\.be/|i\.ytimg\.com/vi/)([\w-]{11})")


def main() -> int:
    uses: dict[str, set[str]] = {}
    for page in sorted((ROOT / "lessons").glob("week-*.html")):
        for vid in ID_RE.findall(page.read_text(encoding="utf-8")):
            uses.setdefault(vid, set()).add(page.stem.replace("week-", ""))
    bad = []
    for i, (vid, weeks) in enumerate(sorted(uses.items())):
        url = "https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=" + vid
        try:
            with urllib.request.urlopen(url, timeout=15) as r:
                json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            bad.append(f"{vid}  HTTP {e.code}  used in {', '.join(sorted(weeks))}")
        except Exception as e:
            print(f"Can't reach YouTube ({e.__class__.__name__}). Check your connection and try again.")
            return 2
        if i % 10 == 9:
            time.sleep(1)
    print(f"Checked {len(uses)} videos in {len({w for s in uses.values() for w in s})} weeks.")
    if bad:
        print("Unavailable videos (replace them):")
        print("\n".join("  " + b for b in bad))
        return 1
    print("All videos are available.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
