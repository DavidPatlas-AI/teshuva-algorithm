package com.teshuva;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

public class FloatingService extends Service {

    private static final String CHANNEL_ID   = "clippy_overlay";
    private static final int    NOTIF_ID     = 1;

    private WindowManager windowManager;
    private View          floatView;
    private int           initialX, initialY;
    private float         initialTouchX, initialTouchY;

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
        startForeground(NOTIF_ID, buildNotification());

        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);

        // Inflate a minimal view — the JS layer renders the real Clippy SVG.
        // This Java view is just the draggable anchor for SYSTEM_ALERT_WINDOW.
        floatView = new View(this);
        floatView.setBackgroundResource(android.R.color.transparent);

        int overlayType = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                : WindowManager.LayoutParams.TYPE_PHONE;

        WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                84, 100,
                overlayType,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                PixelFormat.TRANSLUCENT
        );
        params.gravity  = Gravity.BOTTOM | Gravity.START;
        params.x        = 24;
        params.y        = 24;

        floatView.setOnTouchListener((v, event) -> {
            switch (event.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    initialX      = params.x;
                    initialY      = params.y;
                    initialTouchX = event.getRawX();
                    initialTouchY = event.getRawY();
                    return true;

                case MotionEvent.ACTION_MOVE:
                    params.x = initialX + (int)(event.getRawX() - initialTouchX);
                    params.y = initialY - (int)(event.getRawY() - initialTouchY);
                    windowManager.updateViewLayout(floatView, params);
                    return true;

                case MotionEvent.ACTION_UP:
                    // Tap (no significant movement) — bring app to foreground
                    if (Math.abs(event.getRawX() - initialTouchX) < 10 &&
                        Math.abs(event.getRawY() - initialTouchY) < 10) {
                        Intent intent = new Intent(FloatingService.this, MainActivity.class);
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                        startActivity(intent);
                    }
                    return true;
            }
            return false;
        });

        windowManager.addView(floatView, params);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (floatView != null && windowManager != null) {
            windowManager.removeView(floatView);
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) { return null; }

    // ── notification ────────────────────────────────────

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel ch = new NotificationChannel(
                    CHANNEL_ID,
                    "קליפי פעיל",
                    NotificationManager.IMPORTANCE_LOW
            );
            ch.setDescription("קליפי עובד ברקע ומנטר את הפיד שלך");
            NotificationManager nm = getSystemService(NotificationManager.class);
            nm.createNotificationChannel(ch);
        }
    }

    private Notification buildNotification() {
        Intent openApp = new Intent(this, MainActivity.class);
        openApp.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        PendingIntent pi = PendingIntent.getActivity(
                this, 0, openApp,
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.M
                        ? PendingIntent.FLAG_IMMUTABLE
                        : 0
        );

        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("האלגוריתם שחזר בתשובה")
                .setContentText("קליפי פעיל ומנטר את הפיד שלך")
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentIntent(pi)
                .setOngoing(true)
                .build();
    }
}
