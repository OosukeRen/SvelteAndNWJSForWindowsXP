@echo off
setlocal enabledelayedexpansion

:: Read APPLICATION_NAME from appname.txt (must be in SourceCode)
for /f "delims=" %%a in (%~dp0\..\appname.txt) do set APPLICATION_NAME=%%a

:: Navigate to correct package.nw folder
cd /d "%~dp0\..\..\BuiltApp\%APPLICATION_NAME%\package.nw"
echo Installing into: %cd%

:: Install dependencies
call npm install
