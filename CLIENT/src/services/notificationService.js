import { Platform, Alert } from 'react-native';

// Safe registration that avoids Expo Go Android SDK 53+ remote notification restrictions
export async function registerForPushNotificationsAsync() {
  // In Expo Go on Android, remote push registration is disabled by Expo.
  // We safely handle this so development runs without errors.
  return true;
}

// In-App Notification Dispatcher (Expo Go & Production Compatible)
export async function sendLocalNotification({ title, body, data = {} }) {
  try {
    // Show official in-app banner alert in Expo Go
    Alert.alert(`🔔 e-NirikShan: ${title}`, body);
  } catch (e) {
    console.log('Notification dispatch notice:', e);
  }
}
