import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  BackHandler,
} from 'react-native';
import Amplify from 'aws-amplify';
import PushNotification from '@aws-amplify/pushnotification';
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import styles from '../styles/Login';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import {baseUrl} from '../baseUrl';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
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
    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert('Exit App', 'Do you want to EXIT?', [
          {
            text: 'No',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'YES', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      // Unsubscribe to network state updates
      unsubscribe();
      backHandler.remove();
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

  const SignIn = () => {
    const userData = {
      Email: email,
      Password: password,
    };
    setLoading(true);
    try {
      axios.post(`${baseUrl}/user/login`, userData).then(async (response) => {
        setLoading(false);
        if (response.data.status == 'Fail') {
          Toast.show(response.data.message, Toast.LONG);
        } else if (response.data.error) {
          Toast.show(response.data.error, Toast.LONG);
        } else {
          await AsyncStorage.setItem('user', JSON.stringify(response.data));
          PushNotification.onRegister((token) => {
            console.log('onRegister', token);
            const body = {
              OwnerRecipeUserId: response.data.UserId,
              Devicetoken: token.token,
            };
            axios
              .post(`${baseUrl}/notifiction/inserttoken`, body)
              .then(async (response) => {
                console.log('sd');
              });
          });
          const UserId = response.data.UserId;
          await AsyncStorage.setItem('UserId', UserId);
          Toast.show('Login Succesfully', Toast.LONG);
          navigation.navigate('AppStack');
          setEmail('');
          setPassword('');
        }
      });
    } catch (error) {
      console.log('error', error);
      setLoading(false);
    }
  };
  return (
    <>
      <StatusBar backgroundColor="orange" />
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../assets/rn-social-logo.png')}
          style={styles.logo}
        />
        <FormInput
          labelValue={email}
          onChangeText={(email) => setEmail(email)}
          placeholderText="Email"
          iconType="user"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <FormInput
          labelValue={password}
          onChangeText={(password) => setPassword(password)}
          placeholderText="Password"
          iconType="lock"
          secureTextEntry={true}
        />

        <FormButton buttonTitle="Sign In" onPress={() => SignIn()} />
        <Loader loading={loading} />

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.navButtonText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.navButtonText}>
            Don't have an acount? Create here
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate('AppStack')}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default LoginScreen;
