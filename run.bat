@echo off
echo ===================================================
echo Starting Orange Solar E-Warranty System
echo ===================================================
echo Starting Spring Boot Backend on http://localhost:8085...
start "Orange Solar Backend (Spring Boot)" cmd /k "cd /d "%~dp0backend" && ..\maven\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run"

echo Starting Vite React Frontend on http://localhost:5173...
start "Orange Solar Frontend (Vite)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo ===================================================
echo Both Backend and Frontend launched in separate windows!
echo Backend:  http://localhost:8085
echo Frontend: http://localhost:5173
echo ===================================================
