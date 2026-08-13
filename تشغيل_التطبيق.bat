@echo off
chcp 65001 > nul
title MindSpark App Launcher
echo ==========================================
echo    جاري تشغيل تطبيق MindSpark / Aethera...
echo ==========================================
cd /d "%~dp0Aethera\backend"
start http://localhost:34567
node server.js
pause
