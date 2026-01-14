@REM Maven Wrapper batch script for Windows
@REM Download and run Maven wrapper

@echo off
setlocal

set MAVEN_VERSION=3.9.6
set DOWNLOAD_URL=https://archive.apache.org/dist/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.zip

echo Maven is not installed on this system.
echo.
echo To run the backend, please install Maven:
echo   1. Download from: https://maven.apache.org/download.cgi
echo   2. Extract and add bin folder to PATH
echo   3. Run: mvn spring-boot:run
echo.
echo Alternatively, use an IDE like IntelliJ IDEA or VS Code with Java extensions.
echo.
pause
