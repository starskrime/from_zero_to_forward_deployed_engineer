# Videos in lessons

Learners would rather watch than read, so each lesson's learning items are YouTube videos where a good one exists. Docs stay as a collapsed "Reference (optional)" line under the videos, for exact API details while coding.

## How a video is chosen

- **It covers what that day teaches**, not just the topic in general. If only part of a long video matters, the card says which part (`watch 12:52–21:31`) and the link starts there.
- **Trusted channels first:** official ones (Anthropic, OpenAI, Google, LangChain, Microsoft, GitHub, the tool makers) and proven teachers (Andrej Karpathy, 3Blue1Brown, Corey Schafer, IBM Technology, ArjanCodes, Data School…). No clickbait, no course sales, no AI-voiced filler.
- **Current enough:** for fast-moving APIs, recent videos; if the code shown is older than the lesson's, the card says "watch for the idea, not the code". Stable concepts can use older classics.
- **Short:** 25 minutes or less, or a chaptered segment. A longer video without chapters is kept only when nothing shorter from a trusted channel exists, and the card says so.
- **Honest gaps:** when no good video exists (job postings, interactive tools, legal texts, the newest API details), the doc stays as the main item.
- **Verified:** every video is checked to exist, and its length, date and views come from YouTube itself.

## Files

- `tools/videos/week-XX.json`: the approved picks per week (slot, videos, segment, what to watch for, references to keep).
- `tools/apply_videos.py lessons`: turns the matching "Read" items in `lessons/week-XX.html` into Watch cards. Safe to re-run; run it again after rebuilding a week's page.
- `tools/check_videos.py`: checks that every linked video still exists. Run it before each release and replace anything it reports.

A video shown again in a later week is marked "Rewatch: you saw this in Week X".
