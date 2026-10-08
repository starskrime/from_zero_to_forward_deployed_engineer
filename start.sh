#!/usr/bin/env bash
# FDE Preparation: start the learning platform (macOS / Linux)
# Run from Terminal:  bash start.sh
# Stop it with Ctrl+C.
#
# The platform keeps itself up to date: it checks GitHub when it starts and
# once a day while it runs (see tools/serve.py). Your work in code/ is never touched.
# To turn automatic updates off:  bash start.sh --no-update

cd "$(dirname "$0")" || exit 1

PY=""
for c in python3 python; do
  if command -v "$c" >/dev/null 2>&1 && "$c" -c 'import sys; sys.exit(sys.version_info < (3, 8))' 2>/dev/null; then
    PY="$c"; break
  fi
done
if [ -z "$PY" ]; then
  echo "Python 3.8 or newer is not installed. Install it from https://www.python.org/downloads/ and try again."
  exit 1
fi

exec "$PY" tools/serve.py "$@"
