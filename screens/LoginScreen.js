import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
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

  const SignIn = () => {
    const userData = {
      Email: email,
      Password: password,
    };
    setLoading(true);
    try {
      axios
        .post(`${baseUrl}/user/login`, userData)
        .then(async (response) => {
          setLoading(false);
          await AsyncStorage.setItem('user', JSON.stringify(response.data));
          const UserId = response.data.UserId;
          await AsyncStorage.setItem('UserId', UserId);
          if (response.data.status == 'success') {
            Toast.show('Login Succesfully', Toast.LONG);
            navigation.navigate('AppStack');
            setEmail('');
            setPassword('');
          } else {
            Toast.show(response.data.error, Toast.LONG);
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
