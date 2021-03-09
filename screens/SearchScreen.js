import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/Search';
import {baseUrl} from '../baseUrl';
import {Rating} from 'react-native-rating-element';
import NetInfo from '@react-native-community/netinfo';
import ImageLoad from 'react-native-image-placeholder';
const SearchScreen = (props) => {
  const [data, setData] = useState([]);
  const [temp, setTemp] = useState([]);
  const [value, setvalue] = useState();
  const [loading, setLoading] = useState(false);
  const [netInfo, setNetInfo] = useState('');
  useEffect(() => {
    setLoading(true);
    const recipeSearchData = async () => {
      await axios
        .get(
          `${baseUrl}/recipes/GetByCategory/` +
            props?.route?.params?.category +
            '?limit=50',
        )
        .then((responseJson) => {
          setData(responseJson?.data?.data);
          setTemp(responseJson?.data?.data);
          setLoading(false);
        })
        .catch((error) => setLoading(false));
    };
    recipeSearchData();
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

  const handleSearch = (text) => {
    const newData = temp.filter(function (item) {
      const itemData = `${item.title.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setvalue(text);
    setData(newData);
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
            <Text style={{fontSize: 14, fontWeight: 'bold'}}>
              {item?.title}
            </Text>
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
        {loading == true ? (
          <ActivityIndicator
            size="small"
            color="#999"
            style={{marginTop: 15}}
          />
        ) : null}
        <FlatList
          vertical
          ListHeaderComponent={
            <View style={styles.headercontainer}>
              <Ionicons
                name="search"
                color={'#333'}
                size={18}
                style={{marginVertical: 15, marginHorizontal: 10}}
              />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="always"
                value={value}
                onChangeText={(queryText) => handleSearch(queryText)}
                placeholder="Search"
                style={{width: '100%'}}
                placeholderTextColor="#333"
              />
            </View>
          }
          showsVerticalScrollIndicator={false}
          numColumns={1}
          data={data}
          renderItem={renderRecipes}
          keyExtractor={(item) => `${item._id}`}
        />
      </View>
    </>
  );
};

export default SearchScreen;
