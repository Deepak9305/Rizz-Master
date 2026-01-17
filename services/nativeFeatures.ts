
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { SplashScreen } from '@capacitor/splash-screen';
import { Share } from '@capacitor/share';

// Helper to check if we are running natively
const isNative = Capacitor.isNativePlatform();

export const Native = {
  // --- LIFECYCLE & UI ---
  initialize: async () => {
    if (!isNative) return;

    try {
      // 1. Lock Orientation to Portrait
      await ScreenOrientation.lock({ orientation: 'portrait' });

      // 2. Set Status Bar to Dark (Light text)
      await StatusBar.setStyle({ style: Style.Dark });
      // On Android, make it transparent to see the background gradient
      if (Capacitor.getPlatform() === 'android') {
        await StatusBar.setOverlaysWebView({ overlay: true });
      }

      // 3. Hide the Native Splash Screen (We use our own HTML one for smooth transition)
      await SplashScreen.hide();
    } catch (e) {
      console.warn('Native init failed', e);
    }
  },

  // --- HAPTICS (Vibration) ---
  hapticSuccess: async () => {
    if (!isNative) return;
    await Haptics.notification({ type: NotificationType.Success });
  },

  hapticLight: async () => {
    if (!isNative) return;
    await Haptics.impact({ style: ImpactStyle.Light });
  },

  hapticMedium: async () => {
    if (!isNative) return;
    await Haptics.impact({ style: ImpactStyle.Medium });
  },

  // --- SHARE ---
  share: async (title: string, text: string) => {
    if (isNative) {
      await Share.share({
        title: title,
        text: text,
        dialogTitle: 'Share Rizz',
      });
    } else {
      // Fallback for Web
      if (navigator.share) {
        await navigator.share({ title, text });
      } else {
        await navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
      }
    }
  }
};
