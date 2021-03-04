import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Container} from '../styles/FeedStyles';
import Toast from 'react-native-simple-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
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
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
const {width: viewportWidth} = Dimensions.get('window');
const deviceWidth = Dimensions.get('window').width;
import TimeAgo from 'react-native-timeago';
import AsyncStorage from '@react-native-community/async-storage';
import VideoPlayer from 'react-native-video-player';
import {windowHeight} from '../utils/Dimentions';
import HomeHeaderLeft from '../components/HomeHeaderLeft';
import {baseUrl} from '../baseUrl';
import {ShareDialog} from 'react-native-fbsdk';

const HomeScreen = (props) => {
  const [fetchdata, setfetchdata] = useState([]);
  const [activeSlide, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [taste, setaste] = useState(0.0);
  const [presentation, setpresentation] = useState(0.0);
  const [look, setlook] = useState(0.0);
  const [colour, setcolor] = useState(0.0);
  const [total, setTotal] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [count, setCount] = useState(0);
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
  }, []);
  const getData = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem('UserId');
    //Service to get the data from the server to render
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
        console.log('errror', error);
        setLoading(false);
      });
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
        console.error(error);
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
        setPage(page);
        //Increasing the page for the next API call
        setfetchdata(responseJson.data.data);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error(error);
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

  const onCook = () => {
    alert('Yummy');
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
    console.log('count', count);
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
          <Image
            source={{uri: item.image}}
            style={{
              ...StyleSheet.absoluteFillObject,
              width: '100%',
              height: '100%',
            }}
          />
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            width: viewportWidth,
            height: 250,
          }}>
          {item.video === null ? null : (
            <>
              <VideoPlayer
                video={{uri: item.video}}
                videoWidth={deviceWidth * 0.75}
                videoHeight={windowHeight * 0.3}
                autoplay={false}
                resizeMode="cover"
                customStyles={{
                  wrapper: {
                    marginRight: 20,
                  },
                }}
                thumbnail={{
                  uri:
                    'https://cdn.theculturetrip.com/wp-content/uploads/2019/05/ia_0488_indian-cookbooks_jw_header-1024x576.jpg',
                }}
              />
            </>
          )}
        </View>
      );
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

  // const onPressRecipe = (item) => {
  //   props.navigation.navigate('RecipeScreen', {item});
  // };

  return (
    <>
      <StatusBar backgroundColor="orange" />
      <HomeHeaderLeft {...props} />
      {loading == true ? (
        <ActivityIndicator size="small" color="#999" style={{marginTop: 15}} />
      ) : null}

      <Container>
        <FlatList
          data={fetchdata}
          onEndReached={getData}
          onEndReachedThreshold={0.8}
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
                  <UserImg
                    source={{
                      uri:
                        item?.userimage === 'null'
                          ? 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png'
                          : item?.userimage,
                    }}
                  />
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
                      item.type[0] === 'eggetarion' ? (
                      <Entypo name="dot-single" color="green" size={25} />
                    ) : (
                      <Entypo name="dot-single" color="red" size={25} />
                    )}
                  </Usertime>
                </UserInfo>

                {/* <TouchableOpacity
                  underlayColor="rgba(73,182,77,0.9)"
                  onPress={() => onPressRecipe(item._id)}> */}
                <Carousel
                  data={item.documents}
                  renderItem={renderImage}
                  sliderWidth={viewportWidth}
                  itemWidth={viewportWidth}
                  inactiveSlideScale={1}
                  inactiveSlideOpacity={1}
                  firstItem={0}
                  loop={false}
                  autoplay={false}
                  autoplayDelay={500}
                  autoplayInterval={3000}
                  onSnapToItem={(index) =>
                    setActiveIndex({
                      activeSlide: index,
                    })
                  }
                />
                <Pagination
                  dotsLength={item.documents.length}
                  activeDotIndex={activeSlide}
                  containerStyle={{
                    flex: 1,
                    position: 'absolute',
                    alignSelf: 'center',
                    paddingVertical: 8,
                    marginTop: 300,
                  }}
                  dotColor="rgba(255, 255, 255, 0.92)"
                  dotStyle={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    marginHorizontal: 0,
                  }}
                  inactiveDotColor="white"
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                />
                {/* </TouchableOpacity> */}
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
                  <Interaction>
                    <Entypo name="bowl" size={25} onPress={onCook} />
                  </Interaction>
                </InteractionWrapper>
              </Card>
            );
          }}
          keyExtractor={(item) => item._id}
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
