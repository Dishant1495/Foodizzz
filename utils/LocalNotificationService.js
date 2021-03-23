import PushNotification from 'react-native-push-notification';
import {Platform} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

class LocalNotificationService {
  configure = (onOpenNotification) => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('Local Notification service On Register', token);
      },
      onNotification: (notification) => {
        console.log('Local Notification service onNotification', notification);
        if (!notification?.data) {
          return;
        }
        notification.userInteraction = true;
        onOpenNotification(
          Platform.OS === 'ios' ? notification.data.item : notification.data,
        );
        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  };
  unregister = () => {
    PushNotification.unregister();
  };

  showNotification = (id, title, message, data = {}, options = {}) => {
    PushNotification.localNotification({
      ...this.buildNotification(id, title, message, data, options),
      ...this.buildIOSNotification(id, title, message, data, options),
      title: title || '',
      message: message || '',
      playSound: options.playSound || false,
      soundName: options.soundName || 'default',
      userInteraction: false,
    });
  };

  buildNotification = (id, title, message, data = {}, options = {}) => {
    return {
      id: id,
      autoCancel: true,
      largeIcon: options.largeIcon || 'ic_launcher',
      smallIcon: options.smallIcon || 'ic_notification',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || 'high',
      importance: options.importance,
      data: data,
    };
  };
  buildIOSNotification = (id, title, message, data = {}, options = {}) => {
    return {
      alertAction: options.alertAction || 'view',
      category: options.category || '',
      userInfo: {
        id: id,
        item: data,
      },
    };
  };
  cancelAllNotification = () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };
  removeDeliveredNotificationByID = (notificationId) => {
    PushNotification.cancelLocalNotifications({id: `${notificationId}`});
  };

  scheduleNotification = (id, title, message, date) => {
    PushNotification.localNotificationSchedule({
      title: title,
      id: id,
      message: message,
      date: new Date(),
    });
  };
}

export const localNotificationService = new LocalNotificationService();
