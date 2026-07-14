package com.teshuva;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.util.Map;

/**
 * Exposes NativeModules.OverlayPermission to JS so FloatingService.js
 * can check canDrawOverlays without a third-party library.
 */
public class OverlayPermissionModule extends ReactContextBaseJavaModule {

    OverlayPermissionModule(ReactApplicationContext ctx) {
        super(ctx);
    }

    @Override
    public String getName() { return "OverlayPermission"; }

    @ReactMethod
    public void isGranted(Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            promise.resolve(Settings.canDrawOverlays(getReactApplicationContext()));
        } else {
            promise.resolve(true);
        }
    }

    @ReactMethod
    public void openSettings(Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Intent intent = new Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + getReactApplicationContext().getPackageName())
            );
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getReactApplicationContext().startActivity(intent);
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void startFloatingService(Promise promise) {
        Intent intent = new Intent(getReactApplicationContext(), FloatingService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            getReactApplicationContext().startForegroundService(intent);
        } else {
            getReactApplicationContext().startService(intent);
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void stopFloatingService(Promise promise) {
        Intent intent = new Intent(getReactApplicationContext(), FloatingService.class);
        getReactApplicationContext().stopService(intent);
        promise.resolve(null);
    }

    // ── feed watcher (AccessibilityService) — sideload-only, see CLAUDE.md ──

    @ReactMethod
    public void isFeedWatcherEnabled(Promise promise) {
        String expected = getReactApplicationContext().getPackageName() + "/" + FeedWatcherService.class.getName();
        String enabled = Settings.Secure.getString(
                getReactApplicationContext().getContentResolver(),
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        );
        boolean isEnabled = enabled != null && enabled.contains(expected);
        promise.resolve(isEnabled);
    }

    @ReactMethod
    public void openAccessibilitySettings(Promise promise) {
        Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getReactApplicationContext().startActivity(intent);
        promise.resolve(null);
    }

    @ReactMethod
    public void getFeedWatcherStats(Promise promise) {
        SharedPreferences prefs = getReactApplicationContext()
                .getSharedPreferences("clippy_feed_watcher", Context.MODE_PRIVATE);
        WritableMap seen = Arguments.createMap();
        WritableMap dismissed = Arguments.createMap();
        for (Map.Entry<String, ?> entry : prefs.getAll().entrySet()) {
            if (!(entry.getValue() instanceof Integer)) continue;
            int value = (Integer) entry.getValue();
            if (entry.getKey().startsWith("seen_")) {
                seen.putInt(entry.getKey().substring(5), value);
            } else if (entry.getKey().startsWith("dismissed_")) {
                dismissed.putInt(entry.getKey().substring(10), value);
            }
        }
        WritableMap result = Arguments.createMap();
        result.putMap("seen", seen);
        result.putMap("dismissed", dismissed);
        promise.resolve(result);
    }
}
