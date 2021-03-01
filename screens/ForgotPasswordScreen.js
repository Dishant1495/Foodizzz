import React, {useState, useEffect} from 'react';
import {View, StatusBar, Alert} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import styles from '../styles/ForgotPassword';
import {baseUrl} from '../baseUrl';
import Loader from '../components/Loader';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import Storage from 'react-native-expire-storage';
import NetInfo from '@react-native-community/netinfo';
const ForgotPasswordScreen = (props) => {
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [netInfo, setNetInfo] = useState('');

  useEffect(() => {
    getNetInfo();
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetInfo(
        `Connection type: ${state.type}
        Is connected?: ${state.isConnected}
        IP Address: ${state.details.ipAddress}`,
      );
    });

    return () => {
      // Unsubscribe to network state updates
      unsubscribe();
    };
  }, []);

  const getNetInfo = () => {
    // To get the network state once
    NetInfo.fetch().then((state) => {
      state.isConnected === true
        ? null
        : Alert.alert('Foodizz', 'No Internet Conection');
    });
  };

  const ForgotPassword = () => {
    setLoading(true);
    const data = {
      Email: email,
    };
    try {
      axios
        .post(`${baseUrl}/user/authenticate`, data)
        .then(async (response) => {
          setLoading(false);
          if (response.data.status == 'success') {
            Toast.show('Email Sent Successfully', Toast.LONG);
            await Storage.setItem('key1', {data: response.data.otp}, 60 * 60);
            await Storage.setItem('key2', {
              data: response.data.id,
            });
            props.navigation.navigate('Otp');
          } else {
            Toast.show(response.data.message, Toast.LONG);
          }
        })
        .catch((e) => {
          setLoading(false);
          Toast.show('Unable to Failed User', Toast.LONG);
        });
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar backgroundColor="orange" />
      <View style={styles.container}>
        <FormInput
          labelValue={email}
          onChangeText={(userEmail) => setEmail(userEmail)}
          placeholderText="Email"
          iconType="user"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <FormButton
          buttonTitle="Forgot Password"
          onPress={() => ForgotPassword()}
        />

        <Loader loading={loading} />
      </View>
    </>
  );
};

export default ForgotPasswordScreen;
