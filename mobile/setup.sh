#!/bin/bash
set -e

echo ""
echo "========================================="
echo "  האלגוריתם שחזר בתשובה — Mobile Setup"
echo "========================================="
echo ""

cd "$(dirname "$0")"

echo "[1/4] npm install..."
npm install

echo ""
echo "[2/4] Gradle wrapper jar..."
JAR="android/gradle/wrapper/gradle-wrapper.jar"
if [ ! -f "$JAR" ]; then
  curl -fsSL \
    "https://raw.githubusercontent.com/gradle/gradle/v8.6.0/gradle/wrapper/gradle-wrapper.jar" \
    -o "$JAR" 2>/dev/null \
  && echo "OK: downloaded gradle-wrapper.jar" \
  || echo "WARNING: could not download gradle-wrapper.jar. Run: gradle wrapper --gradle-version 8.6"
else
  echo "OK: gradle-wrapper.jar already present"
fi
chmod +x android/gradlew

echo ""
echo "[3/4] iOS pod install..."
if command -v pod &>/dev/null; then
  cd ios && pod install && cd ..
  echo "OK: pods installed"
else
  echo "NOTE: CocoaPods not found — skip if targeting Android only"
fi

echo ""
echo "[4/4] Done!"
echo ""
echo "========================================="
echo "  Next steps"
echo "========================================="
echo ""
echo "  # Start brain-api stub (separate tab):"
echo "  node src/api/brain-server-stub.js"
echo ""
echo "  # Start Metro:"
echo "  npm start"
echo ""
echo "  # Android:"
echo "  npm run android"
echo ""
echo "  # iOS:"
echo "  npm run ios"
echo ""
echo "  # Android release APK:"
echo "  cd android && ./gradlew assembleRelease"
echo ""
