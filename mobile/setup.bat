@echo off
setlocal

echo.
echo =========================================
echo   האלגוריתם שחזר בתשובה - Mobile Setup
echo =========================================
echo.

cd /d "%~dp0"

echo [1/4] Installing npm dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
  echo ERROR: npm install failed.
  pause & exit /b 1
)

echo.
echo [2/4] Downloading Gradle wrapper jar...
if not exist "android\gradle\wrapper\gradle-wrapper.jar" (
  powershell -Command ^
    "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/gradle/gradle/v8.6.0/gradle/wrapper/gradle-wrapper.jar' -OutFile 'android\gradle\wrapper\gradle-wrapper.jar'" ^
    2>nul
  if %ERRORLEVEL% neq 0 (
    echo WARNING: Could not download gradle-wrapper.jar automatically.
    echo          If Android build fails, run: gradle wrapper --gradle-version 8.6
  ) else (
    echo OK: gradle-wrapper.jar downloaded.
  )
) else (
  echo OK: gradle-wrapper.jar already present.
)

echo.
echo [3/4] Checking Java...
java -version 2>nul
if %ERRORLEVEL% neq 0 (
  echo WARNING: Java not found. Install JDK 17 from https://adoptium.net
)

echo.
echo [4/4] Setup complete.
echo.
echo =========================================
echo   Next steps:
echo =========================================
echo.
echo   # Start the brain-api dev server (separate terminal):
echo   node src\api\brain-server-stub.js
echo.
echo   # Start Metro bundler:
echo   npm start
echo.
echo   # Run on Android emulator (separate terminal):
echo   npm run android
echo.
echo   # Run on iOS (Mac only):
echo   cd ios ^&^& pod install ^&^& cd ..
echo   npm run ios
echo.
echo   # Build release APK:
echo   cd android ^&^& gradlew.bat assembleRelease
echo.
pause
