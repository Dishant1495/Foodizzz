import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

class FCMService {
  register = (onRegister, onNotification, onOpenNotification) => {
    console.log('onRegister');
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission = (onRegister) => {
    messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          //user has permission
          console.log('onRegister 1');
          this.getToken(onRegister);
        } else {
          //user don't have permission
          this.requestPermission(onRegister);
        }
      })
      .catch((error) => {
        console.log('Permission rejected', error);
      });
  };

  getToken = (onRegister) => {
    messaging()
      .getToken()
      .then((fcmToken) => {
        console.log('onRegister 2');
        if (fcmToken) {
          onRegister(fcmToken);
        } else {
          console.log('User does not have a device token');
        }
      })
      .catch((error) => {
        console.log('getToken rejected ', error);
      });
  };

  requestPermission = (onRegister) => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch((error) => {
        console.log('Requested persmission rejected ', error);
      });
  };

  deletedToken = () => {
    messaging()
      .deleteToken()
      .catch((error) => {
        console.log('Delected token error ', error);
      });
  };

  createNotificationListeners = (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(remoteMessage);
      if (remoteMessage) {
        const notification = remoteMessage.notification;
        onOpenNotification(notification);
      }
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log(remoteMessage, 'remoteMessage ,1 ');
        if (remoteMessage) {
          const notification = remoteMessage.notification;
          onOpenNotification(notification);
        }
      });

    this.messageListener = messaging().onMessage(async (remoteMessage) => {
      console.log(remoteMessage, 'remoteMessage , 2');
      if (remoteMessage) {
        let notification = null;
        if (Platform.OS === 'ios') {
          notification = remoteMessage.data.notification;
        } else {
          notification = remoteMessage.notification;
        }
        onNotification(notification);
      }
    });

    messaging().onTokenRefresh((fcmToken) => {
      console.log(fcmToken, 'fcmToken, 5');
      onRegister(fcmToken);
    });

    
  };

  unRegister = () => {
    this.messageListener();
    
  };
}

export const fcmService = new FCMService();
