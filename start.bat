@echo off
REM FDE Preparation: start the learning platform (Windows)
REM Double-click this file. Close the window to stop.
REM
REM The platform keeps itself up to date: it checks GitHub when it starts and
REM once a day while it runs (see tools\serve.py). Your work in code\ is never touched.
REM To turn automatic updates off, run from a Command Prompt:  start.bat --no-update
cd /d "%~dp0"
set "PY="
where py >nul 2>nul && set "PY=py -3"
if not defined PY (
  where python >nul 2>nul && set "PY=python"
)
if not defined PY goto nopython
%PY% -c "import sys; sys.exit(sys.version_info < (3, 8))" >nul 2>nul || goto nopython
%PY% tools\serve.py %*
if errorlevel 1 pause
exit /b

:nopython
echo Python 3.8 or newer is not installed. Get it from https://www.python.org/downloads/
pause
exit /b 1
