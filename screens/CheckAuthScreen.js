import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {View} from 'react-native';

const CheckAuthScreen = (props) => {
  useEffect(() => {
    _bootAsync();
  }, []);
  const _bootAsync = async () => {
    const user = await AsyncStorage.getItem('user');
    if (user) {
      props.navigation.navigate('AppStack');
    } else {
      props.navigation.navigate('Onboarding');
    }
  };

  return <View style={{flex: 1}} />
};

export default CheckAuthScreen;
