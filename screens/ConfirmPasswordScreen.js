import React, {useState, useEffect} from 'react';
import {View, StatusBar, Alert} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import styles from '../styles/ForgotPassword';
import Loader from '../components/Loader';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import {baseUrl} from '../baseUrl';
import NetInfo from '@react-native-community/netinfo';

const ConfirmPasswordScreen = (props) => {
  const [newpassword, setnewpassword] = useState();
  const [confirmpassword, setconfirmpassword] = useState();
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

  const ConfirmPassword = async () => {
    if (newpassword !== confirmpassword) {
      Toast.show('Password does not match', Toast.LONG);
    } else {
      setLoading(true);
      const data = {
        UserId: props?.route?.params?.userDetails,
        Password: newpassword,
      };
      try {
        axios
          .put(`${baseUrl}/user/updatepassword`, data)
          .then(async (response) => {
            setLoading(false);
            if (response.data.status == 'success') {
              Toast.show('Password Sent Successfully', Toast.LONG);
              props.navigation.navigate('Login');
            } else {
              Toast.show(response.data.message, Toast.LONG);
            }
          })
          .catch((e) => {
            setLoading(false);
            Toast.show('Unable to Failed Password', Toast.LONG);
          });
      } catch (error) {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <StatusBar backgroundColor="orange" />
      <View style={styles.container}>
        <FormInput
          labelValue={newpassword}
          onChangeText={(newpassword) => setnewpassword(newpassword)}
          placeholderText="New Password"
          iconType="lock"
          secureTextEntry={true}
        />

        <FormInput
          labelValue={confirmpassword}
          onChangeText={(confirmpassword) =>
            setconfirmpassword(confirmpassword)
          }
          placeholderText="Confirm Password"
          iconType="lock"
          secureTextEntry={true}
        />

        <FormButton buttonTitle="Submit" onPress={() => ConfirmPassword()} />
        <Loader loading={loading} />
      </View>
    </>
  );
};

export default ConfirmPasswordScreen;
