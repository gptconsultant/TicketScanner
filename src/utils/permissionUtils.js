import { Camera } from 'expo-camera';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';

/**
 * Request camera permission for QR code scanning
 * @returns {Promise<boolean>} - Whether permission was granted
 */
export const requestCameraPermission = async () => {
  try {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};

/**
 * Check camera permission status
 * @returns {Promise<string>} - Permission status
 */
export const getCameraPermissionStatus = async () => {
  try {
    const { status } = await Camera.getCameraPermissionsAsync();
    return status;
  } catch (error) {
    console.error('Error getting camera permission status:', error);
    throw error;
  }
};

/**
 * Request push notification permissions
 * @returns {Promise<boolean>} - Whether permission was granted
 */
export const requestNotificationPermission = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/**
 * Check notification permission status
 * @returns {Promise<string>} - Permission status
 */
export const getNotificationPermissionStatus = async () => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  } catch (error) {
    console.error('Error getting notification permission status:', error);
    throw error;
  }
};

/**
 * Request location permission
 * @param {boolean} foreground - Whether to request foreground permission
 * @returns {Promise<boolean>} - Whether permission was granted
 */
export const requestLocationPermission = async (foreground = true) => {
  try {
    if (foreground) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } else {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      return status === 'granted';
    }
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

/**
 * Check if a permission is granted
 * @param {string} permissionType - Type of permission ('camera', 'notification', 'location')
 * @returns {Promise<boolean>} - Whether permission is granted
 */
export const isPermissionGranted = async (permissionType) => {
  try {
    switch (permissionType) {
      case 'camera':
        const cameraStatus = await getCameraPermissionStatus();
        return cameraStatus === 'granted';
        
      case 'notification':
        const notificationStatus = await getNotificationPermissionStatus();
        return notificationStatus === 'granted';
        
      case 'location':
        const { status } = await Location.getForegroundPermissionsAsync();
        return status === 'granted';
        
      default:
        throw new Error(`Unknown permission type: ${permissionType}`);
    }
  } catch (error) {
    console.error(`Error checking ${permissionType} permission:`, error);
    return false;
  }
};

/**
 * Format a user-friendly permission message
 * @param {string} permissionType - Type of permission
 * @param {string} status - Current status ('granted', 'denied', 'undetermined')
 * @returns {string} - User-friendly message
 */
export const getPermissionMessage = (permissionType, status) => {
  switch (permissionType) {
    case 'camera':
      if (status === 'denied') {
        return 'Camera permission is required to scan tickets. Please enable it in your device settings.';
      } else {
        return 'We need camera permission to scan QR codes on tickets.';
      }
      
    case 'notification':
      if (status === 'denied') {
        return 'Notification permission is denied. You won\'t receive important alerts.';
      } else {
        return 'We use notifications to alert you about important updates.';
      }
      
    case 'location':
      if (status === 'denied') {
        return 'Location permission is denied. Some features may not work correctly.';
      } else {
        return 'We use your location to verify you\'re at the event venue.';
      }
      
    default:
      return 'Permission required for app functionality.';
  }
};
