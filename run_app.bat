@echo off
chcp 65001 > nul
title Aethera App Launcher
echo ==========================================
echo    جاري تشغيل تطبيق Aethera...
echo ==========================================
cd /d "%~dp0Aethera\backend"
start http://localhost:34567
node server.js
pause
