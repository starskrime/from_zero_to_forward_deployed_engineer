"""Turn each lesson's "Read" items into "Watch" cards from the approved video picks.

Usage: python tools/apply_videos.py lessons [WEEK ...]
Idempotent: a page that already has video cards for a slot is left alone.
Re-run after re-assembling a week page from its parts.
"""
import html
import json
import re
import sys
from pathlib import Path

VIDEOS = Path(__file__).parent / "videos"
WEEK_ORDER = ["0A", "0B", "0C", "W1", "W2", "W3", "W4", "W5"]
WEEK_NAME = {w: "Week " + w.lstrip("W") for w in WEEK_ORDER}
READING_RE = re.compile(r'<div class="reading"><span class="kind ([a-z ]+)">([^<]*)</span><div>(.*?)</div></div>', re.S)
SECTION_RE = re.compile(r'<section class="day"[^>]*\bid="([^"]+)"')


def esc(t):
    return html.escape(str(t or ""), quote=True)


def vid_of(url):
    return re.search(r"v=([\w-]{11})", url).group(1)


def secs(ts):
    p = [int(x) for x in ts.strip().split(":")]
    return sum(v * 60 ** i for i, v in enumerate(reversed(p)))


def minutes_label(m):
    m = max(1, int(round(m)))
    return f"{m // 60} h {m % 60:02d} min" if m >= 60 else f"{m} min"


def length_text(v):
    eff = v.get("effective_minutes")
    if v.get("segment"):
        seg = v["segment"].replace("-", "–")
        return f"watch {seg} ({minutes_label(eff)})" if eff else f"watch {seg}"
    return v.get("duration", "")


def card(v, rewatch_of):
    vid = vid_of(v["url"])
    url = v["url"].replace("&amp;", "&")
    if v.get("segment") and "t=" not in url:
        start = secs(re.split(r"[–-]", v["segment"])[0])
        if start:
            url += f"&t={start}s"
    year = str(v.get("published", ""))[:4]
    badge = minutes_label(v["effective_minutes"]) if v.get("effective_minutes") else v.get("duration", "")
    notes = []
    if rewatch_of:
        notes.append(f"Rewatch: you saw this in {rewatch_of}.")
    if v.get("alternative"):
        notes.append(v["alternative"])
    if v.get("over_25_no_segment"):
        notes.append("Long video with no chapters: focus on what's described here and skim the rest.")
    if v.get("code_note"):
        notes.append(v["code_note"])
    return (
        '<div class="reading video"><span class="kind must">Watch</span><div class="vbody">'
        f'<a class="vthumb" href="{esc(url)}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">'
        f'<img src="https://i.ytimg.com/vi/{vid}/mqdefault.jpg" alt="" loading="lazy" width="160" height="90" onerror="this.remove()">'
        f'<span class="vlen">{esc(badge)}</span></a>'
        f'<div class="vtext"><a href="{esc(url)}" target="_blank" rel="noopener">{esc(v["oembed_title"])} ↗</a>'
        f'<p class="vmeta">{esc(v["channel"])}{" · " + year if year else ""} · {esc(length_text(v))}</p>'
        f'<p>{esc(v["watch_for"])}</p>'
        + "".join(f'<p class="vnote">{esc(n)}</p>' for n in notes)
        + "</div></div></div>"
    )


def reference(links):
    if not links:
        return ""
    items = "".join(f'<li><a href="{esc(u)}" target="_blank" rel="noopener">{t} ↗</a></li>' for u, t in links)
    return ('<details class="reading ref-opt"><summary>Reference (optional)</summary>'
            f'<ul>{items}</ul></details>')


def main():
    lessons = Path(sys.argv[1])
    weeks = sys.argv[2:] or WEEK_ORDER
    seen = {}  # (video id, segment) -> week name, in program order
    report = []
    for wk in WEEK_ORDER:
        data = json.loads((VIDEOS / f"week-{wk}.json").read_text())
        page_path = lessons / f"week-{wk}.html"
        page = page_path.read_text()
        sections = [(m.start(), m.group(1)) for m in SECTION_RE.finditer(page)]
        slots = {}
        for s in data["slots"]:
            slots.setdefault((s["section"], tuple(s["current_links"])), []).append(s)
        out, pos, done, missing = [], 0, 0, 0
        for m in READING_RE.finditer(page):
            sec = next((sid for p, sid in reversed(sections) if p < m.start()), None)
            links = re.findall(r'<a href="([^"]+)"[^>]*>(.*?)</a>', m.group(3), re.S)
            key = (sec, tuple(html.unescape(u) for u, _ in links))
            cand = slots.get(key)
            if not cand:
                key = (sec, tuple(u for u, _ in links))
                cand = slots.get(key)
            if not cand:
                missing += 1
                continue
            s = cand.pop(0)
            if not s.get("videos"):
                continue
            titles = {html.unescape(u): t.replace(" ↗", "").strip() for u, t in links}
            cards = []
            for v in s["videos"]:
                k = (vid_of(v["url"]), v.get("segment"))
                prev = seen.get(k)
                cards.append(card(v, prev))
                seen.setdefault(k, WEEK_NAME[wk])
            refs = [(u, titles.get(u, esc(u))) for u in s.get("reference_keep", [])]
            out.append((m.start(), m.end(), "\n        ".join(cards) + ("\n        " + reference(refs) if refs else "")))
            done += 1
        if wk not in weeks:
            continue
        new = []
        for a, b, rep in out:
            new.append(page[pos:a]); new.append(rep); pos = b
        new.append(page[pos:])
        page_path.write_text("".join(new))
        report.append(f"{wk}: {done} slots converted, {missing} reading blocks without a matching slot")
    print("\n".join(report))


if __name__ == "__main__":
    main()
