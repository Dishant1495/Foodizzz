/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {localNotificationService} from './utils/LocalNotificationService';
import {fcmService} from './utils/FCMService';
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log(remoteMessage, '[Index] remoteMessage');
});

function HeadlessCheck({isHeadless}) {
  fcmService.registerAppWithFCM();
  fcmService.register(onRegister, onNotification, onOpenNotification);
  localNotificationService.configure(onOpenNotification);

  if (isHeadless) {
    return null;
  }
  return <App />;
}
onRegister = (token) => {
  console.log('[Notification fcm ] onRegister:', token);
  localNotificationService.scheduleNotification();
};

onNotification = (notify) => {
  console.log('[Notification fcm ] : onNotification:', notify);
  let options = {
    soundName: 'default',
    playSound: true,
  };
  localNotificationService.showNotification(
    0,
    notify.title,
    notify.body,
    notify,
    options,
  );
};

onOpenNotification = (notify) => {
  console.log('[Notification fcm ] : onOpenNotification ', notify);
};
AppRegistry.registerComponent(appName, () => HeadlessCheck);
