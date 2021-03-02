import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import styles from '../styles/Comment';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import TimeAgo from 'react-native-timeago';
import NetInfo from '@react-native-community/netinfo';
import {baseUrl} from '../baseUrl';

const CommentScreen = (props) => {
  const [text, setText] = useState('');
  const [userId, setUserId] = useState();
  const [postId] = useState(props?.route?.params?.postId);
  const [userData, setUserData] = useState();
  const [comments, setComment] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [netInfo, setNetInfo] = useState('');

  useEffect(() => {
    setLoading(true);
    const fetchUserData = async () => {
      const UserId = await AsyncStorage.getItem('UserId');
      setUserId(userId);
      await axios
        .get(`${baseUrl}/comments/byRecipeId/${postId}`)
        .then((res) => {
          setLoading(false);
          setComment(res?.data?.data);
        })
        .catch((e) => {
          console.log('e', e);
        });

      await axios
        .get(`${baseUrl}/user/userGetById/${UserId}`)
        .then((userDetails) => {
          setUserData(userDetails);
        })
        .catch((e) => {
          console.log('e', e);
        });
    };
    fetchUserData();
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

  const createCommentHandler = async () => {
    const UserId = await AsyncStorage.getItem('UserId');
    if (UserId) {
      if (text) {
        const data = {
          title: text,
          recipeId: postId,
          UserId: userData?.data?.data?._id,
          firstname: userData?.data?.data?.Firstname,
          userImage:
            userData?.data?.data?.userimage === null
              ? 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png'
              : userData?.data?.data?.userimage,
        };
        axios
          .post(`${baseUrl}/comments/addComment `, data)
          .then(async (res) => {
            Toast.show('User add comment successfully', Toast.LONG);
            setText('');
            comments.push(data);
            await onRefresh();
          })
          .catch((e) => {
            console.log('Error comment message', e);
          });
      } else {
        Toast.show("Can't send Empty message", Toast.LONG);
      }
    } else {
      Alert.alert(
        'Login',
        'Plese Login First',
        [
          {
            text: 'Cancel',
            onPress: () => props.navigation.navigate('CommentScreen'),
            style: 'cancel',
          },
          {text: 'Login', onPress: () => props.navigation.navigate('Login')},
        ],
        {cancelable: false},
      );
    }
  };

  const renderComment = ({item}) => {
    return (
      <ScrollView>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => {}}>
            <Image
              style={styles.image}
              source={{
                uri:
                  item?.userImage ===
                  'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png'
                    ? 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png'
                    : item?.userImage,
              }}
            />
          </TouchableOpacity>
          <View style={styles.content}>
            <View style={styles.contentHeader}>
              <Text style={styles.name}>{item.firstname}</Text>
              <View style={styles.time}>
                <TimeAgo time={item.time} />
              </View>
            </View>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Text rkType="primary3 mediumLine" style={{width: '90%'}}>
                {item.title}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const fetchUserData = async () => {
      const UserId = await AsyncStorage.getItem('UserId');
      setUserId(userId);
      await axios
        .get(`${baseUrl}/comments/byRecipeId/${postId}`)
        .then((res) => {
          setComment(res?.data?.data);
          setRefreshing(false);
        })
        .catch((e) => {
          console.log('e', e);
        });

      await axios
        .get(`${baseUrl}/user/userGetById/${UserId}`)
        .then((userDetails) => {
          setUserData(userDetails);
        })
        .catch((e) => {
          console.log('e', e);
        });
    };
    fetchUserData();
  };

  return (
    <>
      <StatusBar backgroundColor="orange" />
      {loading == true ? (
        <ActivityIndicator size="small" color="#999" style={{marginTop: 15}} />
      ) : null}
      {loading == false && comments.length === 0 ? (
        <Text
          style={{
            marginTop: 20,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          No Comment Available{' '}
        </Text>
      ) : null}
      <View style={{flex: 1}}>
        <FlatList
          data={comments}
          keyExtractor={(item) => `${item._id}`}
          renderItem={renderComment}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#EBEBEB"
              title="Loading"
              titleColor="#EBEBEB"
              colors={['#2196F3']}
              progressBackgroundColor="#EBEBEB"
            />
          }
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Leave a comment"
            value={text}
            returnKeyType="send"
            autoCapitalize="none"
            style={{width: 250}}
            multiline={true}
            onChangeText={(value) => setText(value)}
          />
          <TouchableOpacity
            onPress={createCommentHandler}
            style={styles.postButtonContainer}>
            <Text style={{color: '#fff'}}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default CommentScreen;
