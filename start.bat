@echo off
REM FDE Preparation: start the learning platform (Windows)
REM Double-click this file. Close the window to stop.
cd /d "%~dp0"
set PORT=8765
where py >nul 2>nul && (set PY=py) || (set PY=python)
%PY% --version >nul 2>nul || (echo Python 3 is not installed. Get it from https://www.python.org/downloads/ & pause & exit /b 1)
echo.
echo   FDE Preparation platform
echo   Open: http://localhost:%PORT%/index.html
echo   Stop: close this window
echo.
start "" "http://localhost:%PORT%/index.html"
%PY% -m http.server %PORT% --bind 127.0.0.1
