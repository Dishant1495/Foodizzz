import React, {useState, useEffect} from 'react';
import {
  FlatList,
  View,
  Text,
  StatusBar,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import styles from '../styles/Profile';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';
import {baseUrl} from '../baseUrl';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageLoad from 'react-native-image-placeholder';

const Recipeowner = (props) => {
  const [netInfo, setNetInfo] = useState('');
  const [email, setEmail] = useState();
  const [firstName, setFirstName] = useState();
  const [city, setcity] = useState();
  const [fileImage, setFileImage] = useState(null);
  const [userFeed, setUserFeed] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [follow, setfollow] = useState(0);
  const [followbuttondisplay, setfollowbuttondisplay] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const item = props?.route?.params?.item;
      await axios
        .get(`${baseUrl}/user/userGetById/${item}`)
        .then((userDetails) => {
          setFileImage(userDetails?.data?.data?.userimage);
          setFirstName(userDetails?.data?.data?.Firstname);
          setEmail(userDetails?.data?.data?.Email);
          setcity(userDetails?.data?.data?.City);
        })
        .catch((e) => {
          console.log('e', e);
        });
      const UserId = await AsyncStorage.getItem('UserId');
      if (UserId === item) {
        setfollowbuttondisplay(false);
      } else {
        await axios
          .get(`${baseUrl}/follow/cheakfollower/${item}/${UserId}`)
          .then((response) => {
            setfollow(response?.data?.data);
          })
          .catch((e) => {
            console.log('e', e);
          });
      }
    };

    fetchData();
    fetchUserTimeLine();
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

  const handleEditProfile = async () => {
    const UserId = await AsyncStorage.getItem('UserId');
    if (!UserId) {
      Alert.alert(
        'Login',
        'Plese Login First',
        [
          {
            text: 'Cancel',
            onPress: () => props.navigation.navigate('Feed'),
            style: 'cancel',
          },
          {text: 'Login', onPress: () => props.navigation.navigate('Login')},
        ],
        {cancelable: false},
      );
    } else {
      if (follow === 0) {
        const item = props?.route?.params?.item;
        const UserId = await AsyncStorage.getItem('UserId');
        setLoading(true);
        const data = {
          FollowerUserId: item,
          FollowingUserId: UserId,
        };
        await axios
          .post(`${baseUrl}/follow/insertfollower`, data)
          .then((response) => {
            setfollow(response?.data?.data);
            setLoading(false);
          })
          .catch((e) => {
            console.log('e', e);
          });
      } else {
        const item = props?.route?.params?.item;
        const UserId = await AsyncStorage.getItem('UserId');
        setLoading(true);
        await axios
          .delete(`${baseUrl}/follow/deletefollow/${item}/${UserId}`)
          .then((response) => {
            setfollow(0);
            setLoading(false);
          })
          .catch((e) => {
            console.log('e', e);
          });
      }
    }
  };

  const fetchUserTimeLine = async () => {
    const item = props?.route?.params?.item;
    setLoading(true);
    await axios
      .get(`${baseUrl}/recipes/GetByUserId/${item}`)
      .then((userFeed) => {
        setUserFeed(userFeed?.data?.data);
        setLoading(false);
        setCount(0);
      })
      .catch((e) => {
        console.log('e', e);
      });
  };

  const onPressRecipe = (item) => {
    props.navigation.navigate('RecipeScreen', {item});
  };

  return (
    <>
      <StatusBar backgroundColor="orange" />
      <View style={styles.container}>
        <View style={styles.topcontainer}>
          <View style={styles.maincontainer}>
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
          </View>
          <View style={styles.middleContainer}>
            <Text style={styles.textcontainer}>{firstName}</Text>
            <Text style={styles.textcontainer11}>{email}</Text>
            <Text style={styles.textcontainer11}>{city}</Text>
          </View>
        </View>
        {followbuttondisplay == true ? (
          <TouchableOpacity
            style={styles.editfollowcontainer}
            onPress={handleEditProfile}>
            {follow === 0 ? (
              <Text style={{alignSelf: 'center'}}>Follow</Text>
            ) : (
              <Text style={{alignSelf: 'center'}}>Following</Text>
            )}
          </TouchableOpacity>
        ) : null}
        {loading == true ? (
          <Spinner
            visible={loading}
            textContent={'Loading...'}
            textStyle={styles.textcontainer22}
          />
        ) : null}
        <FlatList
          data={userFeed}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => onPressRecipe(item._id)}
                style={{
                  marginVertical: 5,
                  marginBottom: -3.5,
                  flexDirection: 'column',
                  margin: 0,
                  padding: 4,
                }}>
                <ImageLoad
                  source={{uri: item.documents[0].image}}
                  style={{
                    width: 112,
                    height: 112,
                    justifyContent: 'space-between',
                  }}
                  loadingStyle={{size: 'large', color: 'blue'}}
                  isShowActivity={true}
                />
              </TouchableOpacity>
            );
          }}
          numColumns={3}
        />
      </View>
    </>
  );
};

export default Recipeowner;
