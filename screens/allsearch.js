import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import styles from '../styles/Search';
import axios from 'axios';
import {Rating} from 'react-native-rating-element';
import NetInfo from '@react-native-community/netinfo';
import {baseUrl} from '../baseUrl';
import ImageLoad from 'react-native-image-placeholder';
import Searchbar from '../components/Searchbar/Searchbar';

const SearchScreen = (props) => {
  const [data, setData] = useState([]);
  const [value, setvalue] = useState();
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

  const onPressRecipe = (item) => {
    props.navigation.navigate('RecipeScreen', {item});
  };
  const searchFilterFunction = (text) => {
    axios
      .all([
        axios.get(`${baseUrl}/recipes/searchtitle/${text}`),
        axios.get(`${baseUrl}/recipes/searchkeyword/${text}`),
      ])
      .then((responseArr) => {
        var array1 = responseArr[0]?.data?.data;
        var array2 = responseArr[1]?.data?.data;
        if (array1.length >= array2.length) {
          const res = array1.filter((x) => !array2.includes(x));
          setData(res);
        } else {
          const res = array2.filter((x) => !array1.includes(x));
          setData(res);
        }
      });
  };

  const renderRecipes = ({item}) => {
    return (
      <TouchableOpacity
        underlayColor="rgba(73,182,77,0.9)"
        onPress={() => onPressRecipe(item._id)}>
        <View style={{flexDirection: 'row'}}>
          <ImageLoad
            style={styles.recipeImage}
            source={{
              uri: item?.documents[0]?.image,
            }}
            loadingStyle={{size: 'large', color: 'blue'}}
            isShowActivity={true}
          />
          <View style={{flexDirection: 'column', width: '64%'}}>
            <Text style={{fontSize: 14, fontWeight: 'bold'}}>{item.title}</Text>
            <View style={{flexDirection: 'row'}}>
              <Rating
                rated={item?.avaragerating}
                totalCount={5}
                ratingColor="#f1c644"
                ratingBackgroundColor="#d4d4d4"
                size={18}
                readonly // by default is false
                icon="ios-star"
                direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
              />
            </View>
            <Text style={{fontSize: 13, width: '75%'}} numberOfLines={4}>
              {item.directions}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar backgroundColor="orange" />
      <View style={{flex: 1}}>
        <Searchbar
          value={value}
          onChangeText={(value) => searchFilterFunction(value)}
        />
        <FlatList
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          data={data}
          renderItem={renderRecipes}
          keyExtractor={(item) => `${item.recipeId}`}
        />
      </View>
    </>
  );
};

export default SearchScreen;
