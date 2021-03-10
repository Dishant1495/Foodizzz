import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  CheckBox,
  ScrollView,
  Dimensions,
  StatusBar,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {RadioGroup} from 'react-native-btr';
const deviceWidth = Dimensions.get('window').width;
import {categoriesType} from '../data/dataArrays';
import InputText from '../components/InputText';
import Inputtitle from '../components/titleinput';
import FormButtonView from '../components/FormButtonView';
import styles from '../styles/AddPost';
import {windowHeight} from '../utils/Dimentions';
import VideoPlayer from 'react-native-video-player';
import TagInput from 'react-native-tags-input';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import {baseUrl} from '../baseUrl';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NetInfo from '@react-native-community/netinfo';
const AddPostScreen = (props) => {
  const postData = props?.route?.params?.postData;
  const [description, setdescription] = useState(
    postData?.ingredients[0] || null,
  );
  const [labels, setlabels] = useState(postData?.title || null);
  const [about, setabout] = useState(postData?.directions || null);
  const [image, setImage] = useState(
    props?.route?.params?.postData?.documents || [],
  );

  const [isSelected, setSelection] = useState(postData?.containrecipe || false);
  const [video, setvideo] = useState(
    props?.route?.params?.postData?.documents || null,
  );
  const [radioButtons, setRadioButton] = useState(categoriesType);
  const [state, setstate] = useState(false);
  const [userId, setUserId] = useState();
  const [tags, setTags] = useState({
    tag: '',
    tagsArray: postData?.keyword || [],
  });
  const [netInfo, setNetInfo] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchUserId = async () => {
      const UserId = await AsyncStorage.getItem('UserId');
      if (UserId) {
        setUserId(UserId);
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
    fetchUserId();
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

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 1200,
      height: 780,
      includeBase64: true,
    }).then((image) => {
      setImage([image]);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      includeBase64: true,
      multiple: true,
    }).then((image) => {
      const multipleImage = [];
      image.map((item, index) => {
        if (
          item.mime === 'image/jpeg' ||
          item.mime === 'image/jpg' ||
          item.mime === 'image/png'
        ) {
          multipleImage.push(item);
          setImage(multipleImage);
        } else {
          setImage([]);
          Toast.show('wrong file format', Toast.LONG);
        }
      });
    });
  };

  const chooseVideoFromLibrary = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
    }).then((song) => {
      if (
        song.mime === 'video/mp4' ||
        song.mime === 'video/mov' ||
        song.mime === 'video/avi' ||
        (song.mime === 'video/mkv' && size > 5000)
      ) {
        setvideo(song);
      } else {
        Toast.show('video format wrong', Toast.LONG);
      }
    });
  };

  //
  const updateTagState = (e) => {
    setTags(e);
  };
  const config = {headers: {'Content-Type': 'multipart/form-data'}};
  const onSubmit = async () => {
    if (postData) {
      if (count === 0) {
        if (labels === null) {
          Toast.show('Title is required', Toast.LONG);
        } else if (description === null) {
          Toast.show('Ingredients is required', Toast.LONG);
        } else if (about === null) {
          Toast.show('Directions is required', Toast.LONG);
        } else if (tags.tagsArray.length === 0) {
          Toast.show('Keywords is required', Toast.LONG);
        } else if (image.length === 0) {
          Toast.show('Please Upload Image', Toast.LONG), setImage([]);
        } else if (isSelected && video == null) {
          Toast.show('Please Upload Video', Toast.LONG);
          setvideo(null);
        } else if (video && video.size < 30000) {
          Toast.show('video is too  large', Toast.LONG);
        } else {
          setstate(true);
          setCount((prevCount) => prevCount + 1);

          var titles = labels;
          var descriptions = description;
          var abouts = about;
          var tag = tags.tagsArray;
          var categories = '';
          radioButtons.forEach((elemets) => {
            if (elemets.checked === true) categories = elemets.value;
          });
          const formdata = new FormData();

          var select = isSelected;

          image.map((item, index) => {
            console.log('****', item);
            if (item.path) {
              formdata.append('recipeImage', {
                uri: item.path,
                type: item.mime,
                name: item.path.substr(item.path.lastIndexOf('/') + 1),
              });
            } else {
              formdata.append('recipeImage', {
                uri: item.image,
                type: 'image/' + 'jpeg',
                name: item.image.substr(item.image.lastIndexOf('/') + 1),
              });
            }
          });

          var select = isSelected;
          if (select === true) {
            formdata.append('video', {
              uri: video.path,
              type: video.mime,
              name: video.path.substr(video.path.lastIndexOf('/') + 1),
            });
          }
          tag.map((item) => {
            formdata.append('keyword', item);
          });

          formdata.append('title', titles);
          formdata.append('directions', abouts);
          formdata.append('ingredients[]', descriptions);
          formdata.append('type', categories);
          formdata.append('containrecipe', select);
          formdata.append('UserId', userId);

          console.log('formData', formdata);

          axios
            .put(`${baseUrl}/recipes/updateRecipe/${postData._id}`, formdata, {
              config,
            })
            .then((res) => {
              console.log('response', res);
              Toast.show('Recipe Update Successfully', Toast.LONG);
              //  props.navigation.push('Feed');
              setCount(0);
              setstate(false);
            })
            .then((res) => {
              setstate(false);
              setlabels(null),
                setImage([]),
                setRadioButton(categoriesType),
                setTags({tag: '', tagsArray: []}),
                setabout(null),
                setvideo(null),
                setSelection(false),
                setdescription(null);
            })
            .catch((e) => {
              console.log('e', e);
              setstate(false);
              Toast.show('Unable to failed update recipe', Toast.LONG);
            });
        }
      } else {
        setstate(false);
        console.log('e');
      }
    } else {
      if (count === 0) {
        if (labels === null) {
          Toast.show('Title is required', Toast.LONG);
        } else if (description === null) {
          Toast.show('Ingredients is required', Toast.LONG);
        } else if (about === null) {
          Toast.show('Directions is required', Toast.LONG);
        } else if (tags.tagsArray.length === 0) {
          Toast.show('Keywords is required', Toast.LONG);
        } else if (image.length === 0) {
          Toast.show('Please Upload Image', Toast.LONG), setImage([]);
        } else if (isSelected && video == null) {
          Toast.show('Please Upload Video', Toast.LONG);
          setvideo(null);
        } else if (video && video.size < 30000) {
          Toast.show('video is too  large', Toast.LONG);
        } else {
          setstate(true);
          setCount((prevCount) => prevCount + 1);
          var titles = labels;
          var descriptions = description;
          var abouts = about;
          var tag = tags.tagsArray;
          var categories = '';
          radioButtons.forEach((elemets) => {
            if (elemets.checked === true) categories = elemets.value;
          });
          const formdata = new FormData();
          console.log('image insert', image);
          image.map((item, index) => {
            formdata.append('recipeImage', {
              uri: item.path,
              type: item.mime,
              name: item.path.substr(item.path.lastIndexOf('/') + 1),
            });
          });
          console.log('path of image', image);
          var select = isSelected;
          if (select === true) {
            formdata.append('video', {
              uri: video.path,
              type: video.mime,
              name: video.path.substr(video.path.lastIndexOf('/') + 1),
            });
          }
          tag.map((item) => {
            formdata.append('keyword', item);
          });
          formdata.append('title', titles);
          formdata.append('directions', abouts);
          formdata.append('ingredients[]', descriptions);
          formdata.append('type', categories);
          formdata.append('containrecipe', select);
          formdata.append('UserId', userId);
          console.log('Add Post formdata', formdata);
          axios
            .post(`${baseUrl}/recipes/AddRecipe`, formdata, {
              config,
            })
            .then((res) => {
              Toast.show('Recipe Added Successfully', Toast.LONG);
              props.navigation.push('Feed');
              setCount(0);
              setstate(false);
            })
            .then((responseText) => {
              setstate(false);
            })
            .then((res) => {
              setlabels(null),
                setImage([]),
                setRadioButton(categoriesType),
                setTags({tag: '', tagsArray: []}),
                setabout(null),
                setvideo(null),
                setSelection(false),
                setdescription(null);
            })
            .catch((e) => {
              setstate(false);
              setlabels(null),
                setImage([]),
                setRadioButton(categoriesType),
                setTags({tag: '', tagsArray: []}),
                setabout(null),
                setvideo(null),
                setSelection(false),
                setdescription(null);
              Toast.show('Unable to add recipe', Toast.LONG);
            });
        }
      } else {
        console.log('e');
      }
    }
  };

  const handleRemoveItem = (item) => {
    const size = item.size;
    const newList = image.filter((item) => item.size !== size);
    setImage(newList);
  };

  return (
    <>
      <StatusBar backgroundColor="orange" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.cardview}>
          <Text style={styles.title}>Title:</Text>
          <Inputtitle
            labelValue={labels}
            onChangeText={(e) => setlabels(e)}
            keyboardType="email-address"
            multiple={false}
          />
        </View>

        <View style={styles.cardview}>
          <Text style={styles.title}>Ingredients:</Text>
          <InputText
            labelValue={description}
            onChangeText={(e) => setdescription(e)}
            keyboardType="email-address"
            multiple={true}
          />
        </View>

        <View style={styles.cardview}>
          <Text style={styles.title}>Directions:</Text>
          <InputText
            labelValue={about}
            onChangeText={(e) => setabout(e)}
            keyboardType="email-address"
            multiple={true}
          />
        </View>

        <View style={styles.cardview}>
          <Text style={styles.title}>Keywords:</Text>
          <TagInput updateState={updateTagState} tags={tags} />
        </View>
        <View style={styles.cardview}>
          <View style={{flexDirection: 'row'}}>
            <View style={{}}>
              {
                <FlatList
                  horizontal
                  pagingEnabled={true}
                  data={image}
                  renderItem={({item}) => {
                    return (
                      <>
                        {item.type === 'image' ? (
                          <View style={{flexDirection: 'row'}}>
                            <Image
                              source={{uri: item.image}}
                              style={{
                                width: deviceWidth * 0.8,
                                height: windowHeight * 0.3,
                                borderRadius: 9,
                              }}
                            />
                          </View>
                        ) : (
                          <View style={{flexDirection: 'row'}}>
                            <Image
                              source={{uri: item.path}}
                              style={{
                                width: deviceWidth * 0.8,
                                height: windowHeight * 0.3,
                                borderRadius: 9,
                              }}
                            />

                            <AntDesign
                              style={{
                                top: 10,
                                right: 50,
                                color: 'black',
                              }}
                              size={25}
                              name="close"
                              onPress={() => handleRemoveItem(item)}
                            />
                          </View>
                        )}
                      </>
                    );
                  }}
                />
              }
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{marginRight: deviceWidth * 0.02, flexDirection: 'row'}}>
              <Text style={styles.text} onPress={choosePhotoFromLibrary}>
                Attach From Gallery
              </Text>
            </View>
            {/* )}   */}
            <View style={{}}>
              <Text style={styles.text} onPress={takePhotoFromCamera}>
                Attach From Camera
              </Text>
            </View>
          </View>
          <RadioGroup
            color="#009688"
            labelStyle={{fontSize: 14, color: 'gray'}}
            radioButtons={radioButtons}
            onPress={(radioButtons) => setRadioButton(radioButtons)}
            style={styles.radiocontainer}
          />
        </View>
        {state && <ActivityIndicator size="large" color="#0000ff" />}
        <View style={styles.cardview}>
          <View style={styles.checkboxcontainer}>
            <CheckBox
              value={isSelected}
              onValueChange={setSelection}
              style={{color: '#333'}}
            />
            <Text style={styles.recipetext}>Contains Recipe</Text>
          </View>
        </View>

        {isSelected ? (
          <>
            <View style={styles.cardview}>
              <View style={{marginRight: deviceWidth * 0.0}}>
                {console.log('video path', video)}
                {video ? (
                  <>
                    <VideoPlayer
                      video={{uri: video.path}}
                      videoWidth={deviceWidth * 0.75}
                      videoHeight={windowHeight * 0.3}
                      autoplay={false}
                      resizeMode="cover"
                      thumbnail={{
                        uri:
                          'https://cdn.theculturetrip.com/wp-content/uploads/2019/05/ia_0488_indian-cookbooks_jw_header-1024x576.jpg',
                      }}
                    />
                    <AntDesign
                      style={{
                        color: 'black',
                        position: 'absolute',
                        right: 14,
                        top: 10,
                      }}
                      size={25}
                      name="close"
                      onPress={() => setvideo(null)}
                    />
                  </>
                ) : (
                  <View style={{marginRight: deviceWidth * 0.4}}>
                    <Text style={styles.text} onPress={chooseVideoFromLibrary}>
                      Attach Video Recipe
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </>
        ) : null}

        <FormButtonView buttonTitle="Submit" onPress={() => onSubmit()} />
      </ScrollView>
    </>
  );
};
export default AddPostScreen;
