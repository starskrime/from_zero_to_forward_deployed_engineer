#!/usr/bin/env bash
# FDE Preparation: start the learning platform (macOS / Linux)
# Run from Terminal:  bash start.sh
# Stop it with Ctrl+C.

cd "$(dirname "$0")" || exit 1
PORT=8765

if command -v python3 >/dev/null 2>&1; then PY=python3
elif command -v python >/dev/null 2>&1; then PY=python
else
  echo "Python 3 is not installed. Install it from https://www.python.org/downloads/ and try again."
  exit 1
fi

# If the port is busy, try the next few
while lsof -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; do PORT=$((PORT+1)); done

URL="http://localhost:$PORT/index.html"
echo ""
echo "  FDE Preparation platform"
echo "  Open: $URL"
echo "  Stop: press Ctrl+C in this window"
echo ""

( sleep 1
  if command -v open >/dev/null 2>&1; then open "$URL"
  elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$URL"
  fi ) &

exec "$PY" -m http.server "$PORT" --bind 127.0.0.1
