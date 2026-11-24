@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Hero Squad - Server fuer iPads
echo.
echo  =====================================================
echo    HERO SQUAD - Escape from The Glitch
echo    Server fuer iPads im selben WLAN
echo  =====================================================
echo.
where npm >nul 2>nul
if errorlevel 1 (
  echo  Node.js ist nicht installiert. Bitte von https://nodejs.org installieren.
  pause
  exit /b 1
)
if not exist node_modules (
  echo  Erster Start: Pakete werden installiert ^(dauert ca. 1 Minute^) ...
  call npm install
  if errorlevel 1 ( pause & exit /b 1 )
)
echo  Spiel wird gebaut ...
call npm run build
if errorlevel 1 ( pause & exit /b 1 )
echo.
echo  -----------------------------------------------------
echo   Gleich erscheinen unten die Adressen.
echo   Auf dem iPad in Safari die Adresse hinter "Network:"
echo   eintippen, die mit 192.168. beginnt, z. B.
echo       http://192.168.178.60:4173
echo.
echo   Fragt Windows nach der Firewall: "Zugriff zulassen"
echo   ^(private Netzwerke^) anklicken.
echo   Dieses Fenster offen lassen, solange gespielt wird.
echo   Beenden: Fenster schliessen.
echo  -----------------------------------------------------
echo.
call npx vite preview --host --port 4173 --strictPort
pause
