import React, {useEffect, useState} from 'react';
import {View, StatusBar} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import styles from '../styles/ForgotPassword';
import Storage from 'react-native-expire-storage';
import Loader from '../components/Loader';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
const OtpScreen = (props) => {
  const [otp, setotp] = useState();
  const [userdetails, setuserdetails] = useState();
  const [loading, setLoading] = useState(false);
  const [otp2, setotp2] = useState();
  const [netInfo, setNetInfo] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      const otp = await Storage.getItem('key1');
      setotp(otp?.data);
      const userDetails = await Storage.getItem('key2');
      setuserdetails(userDetails?.data);
    };
    fetchDetails();
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

  const SubmitOtp = async () => {
    setLoading(true);
    if (otp2 === undefined) {
      setLoading(false);
      Toast.show('Please Enter OTP', Toast.LONG);
    } else if (otp2 == otp) {
      setLoading(false);
      props.navigation.navigate('ConfirmPassword', {
        userDetails: userdetails,
        otp: otp2,
      });
    } else {
      setLoading(false);
      Toast.show('Otp does not match please enter valid OTP', Toast.LONG);
    }
  };

  return (
    <>
      <StatusBar backgroundColor="orange" />
      <View style={styles.container}>
        <FormInput
          labelValue={otp2}
          onChangeText={(otp2) => setotp2(otp2)}
          placeholderText="Enter the OTP"
          iconType="lock"
          secureTextEntry={true}
        />
        <FormButton buttonTitle="Submit" onPress={() => SubmitOtp()} />
        <Loader loading={loading} />
      </View>
    </>
  );
};

export default OtpScreen;
