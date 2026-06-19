@echo off
setlocal

echo.
echo =========================================
echo   Extension Build — Chrome Web Store
echo =========================================
echo.

cd /d "%~dp0"

:: Check for missing icons
if not exist "icons\icon16.png" (
  echo.
  echo ❌ חסר icons\icon16.png
  echo.
  echo    1. פתח בדפדפן Chrome: icon-generator.html
  echo       (לחץ ימנית על הקובץ → Open with Chrome)
  echo    2. לחץ "הורד את כל האייקונים"
  echo    3. שמור את כל ה-PNG בתיקיית icons\
  echo    4. הרץ שוב: build.bat
  echo.
  pause
  exit /b 1
)

:: Read version from manifest
for /f "usebackq tokens=*" %%v in (`powershell -NoProfile -Command ^
  "(Get-Content 'manifest.json' ^| ConvertFrom-Json).version"`) do set VERSION=%%v

echo Version: %VERSION%
set OUTFILE=teshuva-algorithm-v%VERSION%.zip

echo [1/2] Removing old build...
if exist "%OUTFILE%" del /f "%OUTFILE%"

echo [2/2] Creating zip...
powershell -NoProfile -Command ^
  "$src = Get-Location;" ^
  "$files = @('manifest.json','background.js','api.js');" ^
  "$files += (Get-ChildItem 'icons','popup','content' -Recurse -File).FullName;" ^
  "Compress-Archive -Force -Path $files -DestinationPath '%OUTFILE%';"

if not exist "%OUTFILE%" (
  echo.
  echo ERROR: zip failed. Trying 7-Zip...
  where 7z >nul 2>&1 && (
    7z a -tzip "%OUTFILE%" manifest.json background.js api.js icons\ popup\ content\
  ) || (
    echo 7-Zip לא נמצא. התקן מ: https://7-zip.org
    pause & exit /b 1
  )
)

echo.
echo =========================================
echo   ✅ נוצר: %OUTFILE%
echo =========================================
echo.
echo   שלבים לפרסום בחנות:
echo.
echo   1. גלוש ל: https://chrome.google.com/webstore/devconsole
echo      (תשלם $5 חד-פעמי לרישום מפתח אם עדיין לא)
echo   2. לחץ "Add new item" → העלה את %OUTFILE%
echo   3. מלא פרטים מ: store-listing.md
echo   4. העלה צילומי מסך (1280×800 PNG)
echo   5. הוסף קישור ל-privacy-policy.html
echo      (העלה אותה לאתר או ל-GitHub Pages)
echo   6. לחץ "Submit for review"
echo   7. המתן 3-7 ימי עסקים
echo.
pause
