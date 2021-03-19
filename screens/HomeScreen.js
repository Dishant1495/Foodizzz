import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Container} from '../styles/FeedStyles';
import Toast from 'react-native-simple-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import ImageLoad from 'react-native-image-placeholder';
import {
  Card,
  UserInfo,
  UserImg,
  UserName,
  Usertime,
  UserInfoText,
  PostText,
  InteractionWrapper,
  Interaction,
  PostTiime,
} from '../styles/FeedStyles';
import {Rating} from 'react-native-rating-element';
import Tooltip from 'rn-tooltip';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  RefreshControl,
  Alert,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
const {width: viewportWidth} = Dimensions.get('window');
const deviceWidth = Dimensions.get('window').width;
import TimeAgo from 'react-native-timeago';
import AsyncStorage from '@react-native-community/async-storage';
import VideoPlayer from 'react-native-video-player';
import {windowHeight} from '../utils/Dimentions';
import HomeHeaderLeft from '../components/HomeHeaderLeft';
import {baseUrl} from '../baseUrl';
import {ShareDialog} from 'react-native-fbsdk';
import Icon from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import ImagePicker from 'react-native-image-crop-picker';
import Amplify from 'aws-amplify';
import Spinner from 'react-native-loading-spinner-overlay';
import PushNotification from '@aws-amplify/pushnotification';
import awsconfig from '../src/aws-exports';
Amplify.configure(awsconfig);
PushNotification.onRegister((token) => {
  console.log('onRegister', token);
});
PushNotification.onNotification((notification) => {
  if (notification.foreground) {
    console.log('onNotification foreground', notification);
    alert(notification.body);
  } else {
    console.log('onNotification background or closed', notification);
  }
  // extract the data passed in the push notification
});
PushNotification.onNotificationOpened((notification) => {
  console.log('onNotificationOpened', notification);
});
const HomeScreen = (props) => {
  const [fetchdata, setfetchdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [taste, setaste] = useState(0.0);
  const [presentation, setpresentation] = useState(0.0);
  const [look, setlook] = useState(0.0);
  const [colour, setcolor] = useState(0.0);
  const [total, setTotal] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [count, setCount] = useState(0);
  const [value, setValue] = useState('Recent');
  const [filter, setfilter] = useState('All');
  const [visible, setvisible] = useState(false);
  const [image, setImage] = useState([]);
  const [cookdata, setcookData] = useState([]);
  const [items, setItems] = useState([
    {
      label: 'Recent',
      value: 'Recent',
      icon: () => <Entypo name="select-arrows" size={18} color="#900" />,
    },
    {
      label: 'Rating',
      value: 'Rating',
      icon: () => <Entypo name="select-arrows" size={18} color="#900" />,
    },
  ]);
  let controller;
  useEffect(() => {
    getData();
    const backAction = () => {
      if (props.navigation.isFocused()) {
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
      backHandler.remove();
    };
  }, [value, filter]);
  const getData = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem('UserId');
    //Service to get the data from the server to render
    if (value === 'Recent' && filter === 'All') {
      await axios
        .get(`${baseUrl}/recipes/Feed/${userId}?page=` + page)
        //Sending the currect page  with get request
        .then((responseJson) => {
          //Successful response
          setPage(page + 1);
          //Increasing the page for the next API call
          setfetchdata([...fetchdata, ...responseJson.data.data]);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    } else if (value === 'Rating' && filter === 'All') {
      await axios
        .get(`${baseUrl}/recipes/recentpost/${userId}?page=` + page)
        //Sending the currect page  with get request
        .then((responseJson) => {
          //Successful response
          setPage(page + 1);
          //Increasing the page for the next API call
          setfetchdata([...fetchdata, ...responseJson.data.data]);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    } else if (value === 'Recent' && filter === 'Meat') {
      await axios
        .get(`${baseUrl}/recipes/meetwithrecent/${userId}?page=` + page)
        //Sending the currect page  with get request
        .then((responseJson) => {
          //Successful response
          setPage(page + 1);
          //Increasing the page for the next API call
          setfetchdata([...fetchdata, ...responseJson.data.data]);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    } else if (value === 'Recent' && filter === 'Non Meat') {
      await axios
        .get(`${baseUrl}/recipes/nonmeetwithrecent/${userId}?page=` + page)
        //Sending the currect page  with get request
        .then((responseJson) => {
          //Successful response
          setPage(page + 1);
          //Increasing the page for the next API call
          setfetchdata([...fetchdata, ...responseJson.data.data]);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    } else if (value === 'Rating' && filter === 'Meat') {
      await axios
        .get(`${baseUrl}/recipes/meetwithrating/${userId}?page=` + page)
        //Sending the currect page  with get request
        .then((responseJson) => {
          //Successful response
          setPage(page + 1);
          //Increasing the page for the next API call
          setfetchdata([...fetchdata, ...responseJson.data.data]);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    } else if (value === 'Rating' && filter === 'Non Meat') {
      await axios
        .get(`${baseUrl}/recipes/notmeetwithrating/${userId}?page=` + page)
        //Sending the currect page  with get request
        .then((responseJson) => {
          //Successful response
          setPage(page + 1);
          //Increasing the page for the next API call
          setfetchdata([...fetchdata, ...responseJson.data.data]);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    } else if (value === 'Recent' && filter === 'Following') {
      await axios
        .get(`${baseUrl}/follow/follower/${userId}?page=` + page)
        //Sending the currect page  with get request
        .then((responseJson) => {
          //Successful response
          setPage(page + 1);
          //Increasing the page for the next API call
          setfetchdata([...fetchdata, ...responseJson.data.data]);
          console.log('recent', fetchdata);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    } else if (value === 'Rating' && filter === 'Following') {
      if (page === 2) {
        setLoading(false);
        return;
      } else {
        await axios
          .get(`${baseUrl}/follow/followerrating/${userId}`)
          //Sending the currect page  with get request
          .then((responseJson) => {
            //Successful response
            //Increasing the page for the next API call
            //  return
            setPage(page + 1);
            setfetchdata(responseJson.data.data);
            console.log('rating', fetchdata);
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
          });
      }
    }
  };

  const getLoadMore = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem('UserId');
    //Service to get the data from the server to render
    await axios
      .get(`${baseUrl}/recipes/Feed/${userId}?page=` + 1)
      //Sending the currect page  with get request
      .then(async (responseJson) => {
        //Successful response
        setPage(page);
        setCount(0);
        //Increasing the page for the next API call
        setfetchdata(responseJson.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  const onRefresh = async () => {
    setRefreshing(true);
    const userId = await AsyncStorage.getItem('UserId');
    //Service to get the data from the server to render
    await axios
      .get(`${baseUrl}/recipes/Feed/${userId}?page=` + 1)
      //Sending the currect page  with get request
      .then((responseJson) => {
        //Successful response
        setPage(2);
        //Increasing the page for the next API call
        setfetchdata(responseJson.data.data);
        setRefreshing(false);
      })
      .catch((error) => {
        setRefreshing(false);
      });
  };

  const onShare = async ({item}) => {
    const shareContent = {
      contentType: 'link',
      contentTitle: `${item.title}`,
      contentUrl: `${item.documents[0].image}`,
      imageUrl: `${item.documents[0].image}`,
    };
    ShareDialog.canShow(shareContent).then((canShow) => {
      canShow && ShareDialog.show(shareContent);
    });
  };

  const deleteLike = async (recipeId) => {
    const UserId = await AsyncStorage.getItem('UserId');
    await axios
      .delete(`${baseUrl}/like/deletelike/${UserId}/${recipeId.recipeId}`)
      .then(async (res) => {
        await getLoadMore();
      })
      .catch((e) => {
        console.log('error', e);
      });
  };
  const addLike = async (recipeId) => {
    setCount((prevCount) => prevCount + 1);
    if (count === 0) {
      const UserId = await AsyncStorage.getItem('UserId');
      if (UserId) {
        const data = {
          UserId: UserId,
          recipeId: recipeId.recipeId,
        };
        await axios
          .post(`${baseUrl}/like/addlike`, data)
          .then(async (res) => {
            await getLoadMore();
          })
          .catch((e) => {
            console.log('error', e);
          });
      } else {
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
      }
    } else {
      console.log('ee');
    }
  };

  //render Image
  const renderImage = ({item}) => {
    if (item.type === 'image') {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            width: viewportWidth,
            height: 250,
          }}>
          <ImageLoad
            source={{uri: item.image}}
            loadingStyle={{size: 'large', color: 'blue'}}
            isShowActivity={true}
            style={{
              ...StyleSheet.absoluteFillObject,
              width: '100%',
              height: '100%',
            }}
          />
        </View>
      );
    } else if (item.video) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            width: viewportWidth,
            height: 250,
          }}>
          <>
            <VideoPlayer
              video={{uri: item.video}}
              videoWidth={deviceWidth * 0.8}
              videoHeight={windowHeight * 0.4}
              autoplay={false}
              resizeMode="cover"
              customStyles={{
                wrapper: {
                  marginLeft: 20,
                },
              }}
              thumbnail={{
                uri:
                  'https://cdn.theculturetrip.com/wp-content/uploads/2019/05/ia_0488_indian-cookbooks_jw_header-1024x576.jpg',
              }}
            />
          </>
        </View>
      );
    } else {
    }
  };

  const handleTaste = async (val) => {
    const UserId = await AsyncStorage.getItem('UserId');
    if (UserId) {
      setaste(val);
    } else {
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
    }
  };

  const handlePresentation = async (val) => {
    const UserId = await AsyncStorage.getItem('UserId');
    if (UserId) {
      setpresentation(val);
    } else {
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
    }
  };

  const handleLook = async (val) => {
    const UserId = await AsyncStorage.getItem('UserId');
    if (UserId) {
      setlook(val);
    } else {
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
    }
  };

  const handleColor = async (val) => {
    setcolor(val.colour);
    const UserId = await AsyncStorage.getItem('UserId');
    if (UserId) {
      const data = {
        UserId: UserId,
        recipeId: val.recipeId,
        presention: presentation,
        taste: taste,
        look: look,
        color: val.colour,
      };
      await axios
        .post(`${baseUrl}/rating/addrating `, data)
        .then((res) => {
          Toast.show('Rating add Successfully', Toast.LONG);
        })
        .catch((e) => {
          console.log('e', e);
        });
    } else {
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
    }
  };

  const handleOpen = async (val) => {
    const recipeId = val.recipeId;
    await axios.get(`${baseUrl}/rating/getratings/${recipeId}`).then((res) => {
      setcolor(res.data.data[0].color);
      setpresentation(res.data.data[0].presention);
      setaste(res.data.data[0].taste);
      setlook(res.data.data[0].look);
      setTotal(res.data.data[0].avarage_rating);
    });
  };

  const onPressUser = (item) => {
    props.navigation.navigate('RecipeOwner', {item});
  };

  const onNavigate = async (item) => {
    console.log('item', item);
    const userId = await AsyncStorage.getItem('UserId');
    const recipeId = item.recipeId;
    if (userId === item.userId) {
      Toast.show("you can't cook own recipe", Toast.LONG);
    } else {
      setvisible(!visible);
      await axios
        .get(`${baseUrl}/cook/getByRecipeId/${recipeId}`)
        .then((res) => {
          console.log('res', res);
          setcookData(res.data.data);
        })
        .catch((e) => {
          console.log('e', e);
        });
    }
  };

  const choosePhotoFromLibrary = (newValue) => {
    const recipeId = newValue;
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      includeBase64: true,
      multiple: true,
    }).then((image) => {
      const multipleImage = [];
      image.map(async (item, index) => {
        if (
          item.mime === 'image/jpeg' ||
          item.mime === 'image/jpg' ||
          item.mime === 'image/png'
        ) {
          multipleImage.push(item);
          setImage(multipleImage);
          const userId = await AsyncStorage.getItem('UserId');
          const formdata = new FormData();
          image.map((item, index) => {
            formdata.append('recipeImage', {
              uri: item.path,
              type: item.mime,
              name: item.path.substr(item.path.lastIndexOf('/') + 1),
            });
          });
          console.log('recipeId', recipeId);
          formdata.append('UserId', userId);
          formdata.append('recipeId', recipeId);
          const config = {headers: {'Content-Type': 'multipart/form-data'}};
          console.log('formdata', formdata);
          axios
            .post(`${baseUrl}/cook/addCook`, formdata, {
              config,
            })
            .then((res) => {
              console.log('ress', res);
              Toast.show('Cook Added Successfully', Toast.LONG);
              setvisible(visible);
            })
            .catch((e) => {
              console.log('error', e);
            });
        } else {
          setImage([]);
        }
      });
    });
  };

  return (
    <>
      <StatusBar backgroundColor="orange" />
      <HomeHeaderLeft {...props} />
      {loading == true ? (
        <Spinner
          visible={loading}
          textContent={'Loading...'}
          textStyle={styles.textcontainer22}
        />
      ) : null}

      <View style={{flexDirection: 'row'}}>
        <DropDownPicker
          items={items}
          defaultValue={value}
          controller={(instance) => (controller = instance)}
          onChangeList={(items, callback) => {
            new Promise((resolve, reject) => resolve(setItems(items)))
              .then(() => {
                callback();
              })
              .catch(() => {});
          }}
          onChangeItem={async (item) => {
            if (value === item.value) {
              return;
            } else {
              setValue(item.value);
              setPage(1);
              setfetchdata([]);
              await getData();
            }
          }}
          itemStyle={{
            justifyContent: 'flex-start',
            marginHorizontal: 10,
          }}
          dropDownStyle={{backgroundColor: '#fafafa'}}
          containerStyle={{height: deviceWidth * 0.1, width: deviceWidth * 0.5}}
        />
        <DropDownPicker
          items={[
            {
              label: 'All Recipes',
              value: 'All',
              icon: () => <Icon name="filter" size={18} color="#900" />,
            },
            {
              label: 'Meat',
              value: 'Meat',
              icon: () => <Icon name="filter" size={18} color="#900" />,
            },
            {
              label: 'Non Meat',
              value: 'Non Meat',
              icon: () => <Icon name="filter" size={18} color="#900" />,
            },
            {
              label: 'Following',
              value: 'Following',
              icon: () => <Icon name="filter" size={18} color="#900" />,
            },
          ]}
          defaultValue={filter}
          onChangeItem={async (item) => {
            if (filter === item.value) {
              return;
            } else {
              setPage(1);
              setfetchdata([]);
              setfilter(item.value);
            }
          }}
          containerStyle={{
            height: deviceWidth * 0.1,
            width: deviceWidth * 0.49,
          }}
          itemStyle={{
            justifyContent: 'flex-start',
            marginHorizontal: 10,
          }}
          dropDownStyle={{backgroundColor: '#fafafa'}}
        />
      </View>
      <Container>
        {loading == false && fetchdata.length === 0 ? (
          <View>
            <View>
              <Text>No Data Available </Text>
            </View>
          </View>
        ) : null}
        <FlatList
          data={fetchdata}
          onEndReached={getData}
          onEndReachedThreshold={0.8}
          keyExtractor={(item, index) => index.toString()}
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
          renderItem={({item}) => {
            return (
              <Card>
                <UserInfo>
                  <TouchableOpacity onPress={() => onPressUser(item.UserId)}>
                    <UserImg
                      source={{
                        uri:
                          item?.userimage === null
                            ? 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png'
                            : item?.userimage,
                      }}
                    />
                  </TouchableOpacity>
                  <UserInfoText>
                    <UserName>{item?.Firstname}</UserName>
                  </UserInfoText>
                  <Usertime>
                    <PostTiime>
                      <TimeAgo time={item.time} />
                    </PostTiime>
                    {item.type[0] === 'Vegan' ? (
                      <Entypo name="dot-single" color="green" size={25} />
                    ) : <Entypo name="dot-single" color="red" size={25} /> &&
                      item.type[0] === 'Vegetarion' ? (
                      <Entypo name="dot-single" color="green" size={25} />
                    ) : <Entypo name="dot-single" color="red" size={25} /> &&
                      item.type[0] === 'Eggetarian' ? (
                      <Entypo name="dot-single" color="green" size={25} />
                    ) : (
                      <Entypo name="dot-single" color="red" size={25} />
                    )}
                  </Usertime>
                </UserInfo>

                <FlatList
                  data={item.documents}
                  style={{flexDirection: 'row'}}
                  horizontal={true}
                  renderItem={renderImage}
                  keyExtractor={(item, index) => index.toString()}
                />

                <Text numberOfLines={4} style={styles.directionsStyle}>
                  {item.directions}
                </Text>

                <PostText>{item.title}</PostText>
                <InteractionWrapper>
                  <Interaction active="1">
                    <TouchableOpacity
                      onPress={() =>
                        item.islike === 'true'
                          ? deleteLike({
                              recipeId: item._id,
                            })
                          : addLike({
                              recipeId: item._id,
                            })
                      }>
                      <Ionicons
                        name={'heart-outline'}
                        size={25}
                        color={item.islike === 'true' ? 'red' : 'black'}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 14,
                        paddingLeft: 10,
                        marginTop: 5,
                      }}>
                      {item.likes}
                    </Text>
                  </Interaction>
                  <Interaction>
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('CommentScreen', {
                          postId: item._id,
                        })
                      }>
                      <Ionicons name="md-chatbubble-outline" size={25} />
                    </TouchableOpacity>
                  </Interaction>
                  <Interaction>
                    <Tooltip
                      width={300}
                      height={150}
                      containerStyle={{marginLeft: 20}}
                      onOpen={() =>
                        handleOpen({
                          recipeId: item._id,
                        })
                      }
                      popover={
                        <>
                          <View style={{flexDirection: 'row', bottom: 10}}>
                            <Rating
                              rated={total}
                              totalCount={5}
                              ratingColor="#f1c644"
                              ratingBackgroundColor="#d4d4d4"
                              size={18}
                              readonly // by default is false
                              icon="ios-star"
                              direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                            />
                            <Text style={styles.totalrating44}>
                              {total?.toFixed(1) === null
                                ? 0.0
                                : total?.toFixed(1)}{' '}
                              out of 5
                            </Text>
                          </View>
                          <View style={styles.spacecontainer}>
                            <View style={styles.rowcontainer}>
                              <Text style={styles.middlecontainer}>Taste</Text>
                              <View style={{flex: 0.4}}>
                                <Rating
                                  rated={taste}
                                  totalCount={5}
                                  ratingColor="#f1c644"
                                  ratingBackgroundColor="#d4d4d4"
                                  size={15}
                                  onIconTap={(val) => handleTaste(val)}
                                  icon="ios-star"
                                  direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                                />
                              </View>
                              <Text style={styles.totalrating}>
                                {taste === null ? 0.0 : taste.toFixed(2)}
                              </Text>
                            </View>
                            <View style={styles.rowcontainer}>
                              <Text style={styles.middlecontainer}>
                                Presentation
                              </Text>
                              <View style={{flex: 0.4}}>
                                <Rating
                                  rated={presentation}
                                  totalCount={5}
                                  ratingColor="#f1c644"
                                  ratingBackgroundColor="#d4d4d4"
                                  size={15}
                                  onIconTap={(val) => handlePresentation(val)}
                                  icon="ios-star"
                                  direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                                />
                              </View>
                              <Text style={styles.totalrating}>
                                {presentation === null
                                  ? 0.0
                                  : presentation.toFixed(2)}
                              </Text>
                            </View>
                            <View style={styles.rowcontainer}>
                              <Text style={styles.middlecontainer}>Look</Text>
                              <View style={{flex: 0.4}}>
                                <Rating
                                  rated={look}
                                  totalCount={5}
                                  ratingColor="#f1c644"
                                  ratingBackgroundColor="#d4d4d4"
                                  size={15}
                                  onIconTap={(val) => handleLook(val)}
                                  icon="ios-star"
                                  direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                                />
                              </View>
                              <Text style={styles.totalrating}>
                                {look === null ? 0.0 : look.toFixed(2)}
                              </Text>
                            </View>
                            <View style={styles.rowcontainer}>
                              <Text style={styles.middlecontainer}>Color</Text>
                              <View style={{flex: 0.4}}>
                                <Rating
                                  rated={colour}
                                  totalCount={5}
                                  ratingColor="#f1c644"
                                  ratingBackgroundColor="#d4d4d4"
                                  size={15}
                                  onIconTap={(val) =>
                                    handleColor({
                                      colour: val,
                                      recipeId: item._id,
                                    })
                                  }
                                  icon="ios-star"
                                  direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                                />
                              </View>
                              <Text style={styles.totalrating}>
                                {colour === null ? 0.0 : colour.toFixed(2)}
                              </Text>
                            </View>
                          </View>
                        </>
                      }
                      backgroundColor="white">
                      <Ionicons name="md-star-outline" size={25} />
                    </Tooltip>
                  </Interaction>
                  <Interaction>
                    <AntDesign
                      name="sharealt"
                      size={25}
                      onPress={() =>
                        onShare({
                          item: item,
                        })
                      }
                    />
                  </Interaction>
                  <Dialog
                    visible={visible}
                    width={0.9}
                    rounded
                    actionsBordered
                    overlayBackgroundColor={'#333'}
                    onTouchOutside={() => {
                      setvisible(false);
                      setImage([]);
                    }}>
                    <DialogContent style={{backgroundColor: '#fff'}}>
                      <>
                        <View style={{flexDirection: 'row'}}>
                          <FlatList
                            horizontal
                            pagingEnabled={true}
                            data={cookdata}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item}) => {
                              return (
                                <>
                                  <View style={{flexDirection: 'row'}}>
                                    {item.documents.map((val, index) => {
                                      return (
                                        <ImageLoad
                                          source={{uri: val.image}}
                                          loadingStyle={{
                                            size: 'large',
                                            color: 'blue',
                                          }}
                                          isShowActivity={true}
                                          style={{
                                            width: deviceWidth * 0.8,
                                            height: windowHeight * 0.4,
                                            borderRadius: 9,
                                            marginTop: 50,
                                          }}
                                        />
                                      );
                                    })}
                                  </View>
                                </>
                              );
                            }}
                          />
                        </View>
                        <TouchableOpacity
                          style={{
                            paddingHorizontal: 10,
                            padding: 10,
                            width: '60%',
                            marginTop: 25,
                          }}
                          onPress={() => choosePhotoFromLibrary(item._id)}>
                          <Text
                            style={{
                              borderWidth: 1,
                              borderRadius: 10,
                              borderColor: '#ccc',
                              color: 'gray',
                              padding: 8,
                            }}>
                            Attach From Gallery
                          </Text>
                        </TouchableOpacity>
                      </>
                    </DialogContent>
                  </Dialog>

                  <Interaction>
                    <TouchableOpacity
                      underlayColor="rgba(73,182,77,0.9)"
                      onPress={() =>
                        onNavigate({
                          userId: item.UserId,
                          recipeId: item._id,
                        })
                      }>
                      <Entypo name="bowl" size={25} />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 14,
                        paddingLeft: 10,
                        marginTop: 5,
                      }}>
                      {item.cookcount}
                    </Text>
                  </Interaction>
                </InteractionWrapper>
              </Card>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </Container>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  textcontainer22: {
    color: '#999',
  },

  directionsStyle: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    paddingLeft: 15,
    paddingRight: 15,
    color: '#666',
    marginTop: 15,
    fontWeight: 'bold',
  },

  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
  toolbar: {},
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
    justifyContent: 'center',
  },

  totalrating: {
    fontWeight: 'bold',
    marginLeft: 5,
    bottom: 5,
  },

  totalrating44: {
    fontWeight: 'bold',
    marginLeft: 7,
    fontSize: 14,
    marginTop: 1,
  },

  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: 250,
    //flexDirection:'row'
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    width: viewportWidth,
    height: 250,
  },

  imageContainer44: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: 250,
  },

  spacecontainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  rowcontainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },

  middlecontainer: {
    color: 'gray',
    flex: 0.4,
  },

  paginationContainer: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
    paddingVertical: 8,
    marginTop: 300,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 0,
  },
});
