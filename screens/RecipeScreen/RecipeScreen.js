import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  Dimensions,
  FlatList,
  StatusBar,
  Share,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import styles from './styles';
import Carousel, {Pagination} from 'react-native-snap-carousel';
const {width: viewportWidth} = Dimensions.get('window');
import SegmentedControlTab from 'react-native-segmented-control-tab';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {InteractionWrapper, Interaction} from '../../styles/FeedStyles';
import Tooltip from 'rn-tooltip';
import styleshome from '../../styles/Home';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {Rating} from 'react-native-rating-element';
import Toast from 'react-native-simple-toast';
import VideoPlayer from 'react-native-video-player';
import {windowHeight} from '../../utils/Dimentions';
import NetInfo from '@react-native-community/netinfo';
import {baseUrl} from '../../baseUrl';
const deviceWidth = Dimensions.get('window').width;
const RecipeScreen = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fetchdata, setfetchdata] = useState([]);
  const [activeSlide, setActiveIndex] = useState(0);
  const [userDetails, setUserData] = useState();
  const [taste, setaste] = useState(0.0);
  const [presentation, setpresentation] = useState(0.0);
  const [look, setlook] = useState(0.0);
  const [colour, setcolor] = useState(0.0);
  const [total, setTotal] = useState();
  const [netInfo, setNetInfo] = useState('');
  const [count, setCount] = useState(0);
  const getNetInfo = () => {
    // To get the network state once
    NetInfo.fetch().then((state) => {
      state.isConnected === true
        ? null
        : Alert.alert('Foodizz', 'No Internet Conection');
    });
  };
  useEffect(() => {
    const item = props?.route?.params?.item;
    const fetchData = async () => {
      const UserId = await AsyncStorage.getItem('UserId');
      axios
        .get(`${baseUrl}/recipes/FindById/${item}/${UserId}`)
        .then(async (responseJson) => {
          setfetchdata(responseJson.data);
          const UserId = responseJson.data.data.UserId;
          await axios
            .get(`${baseUrl}/user/userGetById/${UserId}`)
            .then((userDetails) => {
              setUserData(userDetails);
            })
            .catch((e) => {
              console.log('e', e);
            });
        })
        .catch((error) => console.log('e', error));
    };
    fetchData();
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

  const handleCustomIndexSelect = (index) => {
    setSelectedIndex(index);
  };
  const item = props?.route?.params?.item;
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onCook = () => {
    alert('Yummy');
  };

  const title = fetchdata?.data?.title;
  const ingredientsArray = fetchdata?.data?.ingredients;

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
            source={{uri: `${baseUrl}` + item.image}}
            style={{
              ...StyleSheet.absoluteFillObject,
              width: '100%',
              height: 250,
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
                video={{uri: `${baseUrl}` + item.video}}
                videoWidth={deviceWidth * 0.75}
                videoHeight={windowHeight * 0.3}
                autoplay={false}
                resizeMode="cover"
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
            onPress: () => props.navigation.navigate('RecipeScreen'),
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
            onPress: () => props.navigation.navigate('RecipeScreen'),
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
            onPress: () => props.navigation.navigate('RecipeScreen'),
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
        .post(`${baseUrl}/rating/addrating`, data)
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
            onPress: () => props.navigation.navigate('RecipeScreen'),
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

  const deleteLike = async (recipeId) => {
    const UserId = await AsyncStorage.getItem('UserId');
    await axios
      .delete(`${baseUrl}/like/deletelike/${UserId}/${recipeId.recipeId}`)
      .then(async (res) => {
        console.log('ress', res);
        //  Toast.show('Delete Like Successfully', Toast.LONG);
        await getLoadMore();
      })
      .catch((e) => {
        console.log('error', e);
      });
  };
  const addLike = async (recipeId) => {
    console.log('recipe', recipeId);
    setCount((prevCount) => prevCount + 1);
    console.log('video', count);
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
            setCount(0);
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
  const getLoadMore = () => {
    const item = props?.route?.params?.item;
    const fetchData = async () => {
      const UserId = await AsyncStorage.getItem('UserId');
      axios
        .get(`${baseUrl}/recipes/FindById/${item}/${UserId}`)
        .then(async (responseJson) => {
          setfetchdata(responseJson.data);
          const UserId = responseJson.data.data.UserId;
          await axios
            .get(`${baseUrl}/user/userGetById/${UserId}`)
            .then((userDetails) => {
              setUserData(userDetails);
            })
            .catch((e) => {
              console.log('e', e);
            });
        })
        .catch((error) => console.log('e', error));
    };
    fetchData();
  };

  const renderFirst = () => {
    return (
      <>
        <View style={styles.infoContainer}>
          <Text style={styles.infoDescriptionRecipe}>
            {fetchdata?.data?.directions}
          </Text>
        </View>
        <InteractionWrapper>
          <Interaction>
            <TouchableOpacity
              onPress={() =>
                fetchdata?.data?.islike === 'true'
                  ? deleteLike({
                      recipeId: fetchdata?.data?._id,
                    })
                  : addLike({
                      recipeId: fetchdata?.data?._id,
                    })
              }>
              <Ionicons
                name={'heart-outline'}
                size={25}
                color={'black'}
                color={fetchdata?.data?.islike === 'true' ? 'red' : 'black'}
              />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 14,
                paddingLeft: 10,
                marginTop: 5,
              }}>
              {fetchdata?.data?.likes}
            </Text>
          </Interaction>
          <Interaction>
            <Ionicons
              name="md-chatbubble-outline"
              size={25}
              onPress={() =>
                props.navigation.navigate('CommentScreen', {
                  postId: fetchdata?.data?._id,
                })
              }
            />
          </Interaction>
          <Interaction>
            <Tooltip
              width={300}
              height={150}
              onOpen={() =>
                handleOpen({
                  recipeId: fetchdata?.data?._id,
                })
              }
              containerStyle={{marginLeft: 20}}
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
                    <Text style={styleshome.totalrating}>
                      {' '}
                      {total?.toFixed(1) === null ? 0.0 : total?.toFixed(1)} out
                      of 5
                    </Text>
                  </View>
                  <View style={styleshome.spacecontainer}>
                    <View style={styleshome.rowcontainer}>
                      <Text style={styleshome.middlecontainer}>Taste</Text>
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
                      <Text style={styleshome.totalrating}>
                        {' '}
                        {taste === null ? 0.0 : taste.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styleshome.rowcontainer}>
                      <Text style={styleshome.middlecontainer}>
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
                      <Text style={styleshome.totalrating}>
                        {presentation === null ? 0.0 : presentation.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styleshome.rowcontainer}>
                      <Text style={styleshome.middlecontainer}>Look</Text>
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
                      <Text style={styleshome.totalrating}>
                        {' '}
                        {look === null ? 0.0 : look.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styleshome.rowcontainer}>
                      <Text style={styleshome.middlecontainer}>Color</Text>
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
                              recipeId: fetchdata?.data?._id,
                            })
                          }
                          icon="ios-star"
                          direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                        />
                      </View>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          marginLeft: 5,
                        }}>
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
            <AntDesign name="sharealt" size={25} onPress={onShare} />
          </Interaction>
          <Interaction>
            <Entypo name="bowl" size={25} onPress={onCook} />
          </Interaction>
        </InteractionWrapper>
      </>
    );
  };
  const renderIngredient = ({item}) => {
    return (
      <View style={{marginVertical: 10}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{marginTop: 2, marginHorizontal: 10}}>{item} </Text>
          <Text> &nbsp;</Text>
        </View>
      </View>
    );
  };

  const renderSecond = () => {
    return (
      <FlatList
        vertical
        showsVerticalScrollIndicator={false}
        numColumns={1}
        data={ingredientsArray}
        renderItem={renderIngredient}
        keyExtractor={(item) => `${fetchdata.data._id}`}
      />
    );
  };
  return (
    <>
      <StatusBar backgroundColor="orange" />
      <Text style={styles.infoRecipeName}>{title}</Text>
      <View style={styles.inforating}>
        <Text style={styles.infoRecipeTime}>{fetchdata?.data?.type}</Text>
      </View>
      <Text style={styles.infoRecipeUserName}>
        {userDetails?.data?.data?.Firstname}
      </Text>
      <ScrollView style={styles.container}>
        <View style={styles.carouselContainer}>
          <View style={styles.carousel}>
            <Carousel
              data={fetchdata?.data?.documents}
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
              dotsLength={fetchdata?.data?.documents?.length}
              activeDotIndex={activeSlide}
              containerStyle={styles.paginationContainer}
              dotColor="rgba(255, 255, 255, 0.92)"
              dotStyle={styles.paginationDot}
              inactiveDotColor="white"
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
          </View>
        </View>
        <View style={styles.infoRecipeContainer}>
          <SegmentedControlTab
            values={['Recipe', 'Ingredients']}
            selectedIndex={selectedIndex}
            onTabPress={handleCustomIndexSelect}
            borderRadius={0}
            tabsContainerStyle={{height: 50, backgroundColor: '#F2F2F2'}}
            tabStyle={{
              backgroundColor: '#F2F2F2',
              borderWidth: 0,
              borderColor: 'transparent',
            }}
            activeTabStyle={{
              backgroundColor: 'white',
              borderBottomWidth: 3,
              borderBottomColor: '#FD5944',
              marginTop: 2,
            }}
            tabTextStyle={{
              color: '#444444',
            }}
            activeTabTextStyle={{color: '#FD5944'}}
          />
          {selectedIndex === 0 && renderFirst()}
          {selectedIndex === 1 && renderSecond()}
        </View>
      </ScrollView>
    </>
  );
};

export default RecipeScreen;
