import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import styles from '../styles/Signup';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import {baseUrl} from '../baseUrl';
import Loader from '../components/Loader';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FormInputCity from '../components/FormInputCity';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';

const config = {headers: {'Content-Type': 'multipart/form-data'}};

const Profile = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [firstName, setFirstName] = useState();
  const [city, setcity] = useState();
  const [loading, setLoading] = useState(false);
  const [fileImage, setFileImage] = useState(null);
  const [netInfo, setNetInfo] = useState('');
  useEffect(() => {
    getNetInfo();
    const fetchData = async () => {
      const UserId = await AsyncStorage.getItem('UserId');
      await axios
        .get(`${baseUrl}/user/userGetById/${UserId}`)
        .then((userDetails) => {
          setFileImage(userDetails?.data?.data?.userimage);
          setFirstName(userDetails?.data?.data?.Firstname);
          setEmail(userDetails?.data?.data?.Email);
          setcity(userDetails?.data?.data?.City);
        })
        .catch((e) => {
          console.log('e', e);
        })
        .catch((error) => console.log('e', error));
    };
    fetchData();
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

  const Submit = () => {
    // if (password !== confirmPassword) {
    //   Toast.show('Password does not match');
    // } else {
    //   const formdata = new FormData();
    //   formdata.append('Email', email);
    //   formdata.append('Password', password);
    //   formdata.append('City', city);
    //   formdata.append('Firstname', firstName);
    //   fileImage === null
    //     ? null
    //     : formdata.append('userimage', {
    //         uri: fileImage?.uri,
    //         type: fileImage?.type,
    //         name: fileImage?.fileName,
    //       });
    //   setLoading(true);
    //   try {
    //     axios
    //       .post(`${baseUrl}/user/register`, formdata, {
    //         config,
    //       })
    //       .then(async (response) => {
    //         setLoading(false);
    //         if (response.data.status == 'success') {
    //           Toast.show('Signup Succesfully', Toast.LONG);
    //           navigation.navigate('Login');
    //         } else {
    //           Toast.show(response.data.error, Toast.LONG);
    //         }
    //       })
    //       .catch((e) => {
    //         setLoading(false);
    //       });
    //   } catch (error) {
    //     setLoading(false);
    //   }
    // }
  };

  const chooseImage = () => {
    let options = {
      title: 'Select Avatar',
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        setFileImage(response);
      }
    });
  };

  return (
    <>
      <StatusBar backgroundColor="orange" />
      <View style={styles.container}>
        <View
          style={{
            alignSelf: 'center',
            marginTop: 35,
            marginBottom: 20,
          }}>
          <Image
            style={{height: 100, width: 100, borderRadius: 50}}
            source={
              fileImage === null
                ? {
                    uri:
                      'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png',
                  }
                : {uri: fileImage}
            }
          />
          <TouchableOpacity
            style={{
              height: 30,
              width: 30,
              backgroundColor: '#fff',
              borderRadius: 50,
              position: 'absolute',
              left: 65,
              top: 75,
              justifyContent: 'center',
              alignItems: 'center',
              alignItems: 'center',
            }}
            onPress={chooseImage}>
            <Icon name="camera" size={20} />
          </TouchableOpacity>
        </View>

        <FormInput
          labelValue={firstName}
          onChangeText={(firstName) => setFirstName(firstName)}
          placeholderText="Name"
          iconType="user"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <FormInput
          labelValue={email}
          onChangeText={(email) => setEmail(email)}
          placeholderText="Email"
          iconType="mail"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <FormInputCity
          labelValue={city}
          onChangeText={(city) => setcity(city)}
          placeholderText="City"
          iconType="city"
        />

        <FormButton buttonTitle="Submit" onPress={() => Submit()} />
        <Loader loading={loading} />
      </View>
    </>
  );
};

export default Profile;
