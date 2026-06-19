package com.teshuva;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

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
}
