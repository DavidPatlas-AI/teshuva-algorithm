/**
 * FloatingService — manages the floating overlay lifecycle.
 *
 * Android:
 *   Checks SYSTEM_ALERT_WINDOW permission and requests it if missing.
 *   On Android 8+, launches the app's Settings page for the user to grant it.
 *   The actual window is started via a native IntentModule.
 *
 * iOS:
 *   No special permissions needed — the FloatingBubble renders inside our
 *   own window via React Native's absolute-positioned overlay.
 */
import {Platform, Linking, Alert} from 'react-native';

const OVERLAY_SETTINGS_ACTION = 'android.settings.action.MANAGE_OVERLAY_PERMISSION';

class FloatingService {
  constructor() {
    this._active = false;
  }

  async requestPermission() {
    if (Platform.OS !== 'android') return true;

    // React Native doesn't expose canDrawOverlays directly.
    // We check via a bridge module if available, else we just try.
    try {
      const {NativeModules} = require('react-native');
      const OverlayModule   = NativeModules.OverlayPermission;
      if (OverlayModule) {
        const canDraw = await OverlayModule.isGranted();
        if (canDraw) return true;
        await this._openOverlaySettings();
        return false;
      }
    } catch (_) { /* module not available in JS-only builds */ }
    return true;
  }

  _openOverlaySettings() {
    return new Promise(resolve => {
      Alert.alert(
        'הרשאת Overlay',
        'כדי שקליפי יוכל לצוף מעל אפליקציות אחרות, יש לאשר "הצג מעל אפליקציות אחרות" בהגדרות.',
        [
          {text: 'פתח הגדרות', onPress: () => { Linking.openSettings(); resolve(false); }},
          {text: 'ביטול', style: 'cancel', onPress: () => resolve(false)},
        ],
      );
    });
  }

  async start() {
    if (this._active) return;
    const granted = await this.requestPermission();
    if (!granted) return;
    this._active = true;
  }

  stop() {
    this._active = false;
  }

  isActive() { return this._active; }
}

export const floatingService = new FloatingService();
