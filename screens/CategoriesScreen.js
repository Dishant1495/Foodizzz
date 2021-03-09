import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import styles from '../styles/Categories';
import {getRecipes} from '../data/MockDataAPI';
import axios from 'axios';
const recipetypes = ['Vegan', 'Vegetarion', 'Non-Veg', 'eggetarion'];
import {Rating} from 'react-native-rating-element';
import NetInfo from '@react-native-community/netinfo';
import {baseUrl} from '../baseUrl';
import ImageLoad from 'react-native-image-placeholder';

const CategoriesScreen = (props) => {
  const onPressCategory = (item) => {
    const title = item.name;
    const category = item;
    props.navigation.navigate('Search', {category, title});
  };
  const [fetchdata, setfetchdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [netInfo, setNetInfo] = useState('');

  useEffect(() => {
    setLoading(true);
    const recipeCategoryData = async () => {
      await axios
        .get(`${baseUrl}/recipes/AllRecipe?limit=50 `)
        .then((responseJson) => {
          setfetchdata(responseJson.data);
          setLoading(false);
        })
        .catch((error) => setLoading(false));
    };
    recipeCategoryData();
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
  }, [fetchdata]);

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
  const renderCategory = ({item}) => {
    const recipesArray = getRecipes(item, fetchdata.data);

    return (
      <TouchableOpacity
        underlayColor="rgba(73,182,77,0.9)"
        onPress={() => onPressCategory(item)}>
        <View style={styles.direction}>
          <Text style={styles.categoriesName}>{item}</Text>
          <TouchableOpacity onPress={() => onPressCategory(item)}>
            <Text style={styles.allbutton}>View More</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={recipesArray}
          renderItem={({item}) => (
            <TouchableOpacity
              underlayColor="rgba(73,182,77,0.9)"
              onPress={() => onPressRecipe(item._id)}>
              <View style={styles.categoriesItemContainer}>
                <ImageLoad
                  style={{width: 160, height: 150, borderRadius: 10}}
                  source={{
                    uri: item?.documents[0]?.image,
                  }}
                  loadingStyle={{size: 'large', color: 'blue'}}
                  isShowActivity={true}
                />
                <Text style={styles.title}>{item.title}</Text>
                <View style={{flexDirection: 'row', bottom: 10}}>
                  <Rating
                    rated={item?.avaragerating}
                    totalCount={5}
                    cleam
                    ratingColor="#f1c644"
                    ratingBackgroundColor="#d4d4d4"
                    size={18}
                    readonly // by default is false
                    icon="ios-star"
                    direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
                  />
                </View>
              </View>
              {setLoading(false)}
            </TouchableOpacity>
          )}
          keyExtractor={(item) => `${item._id}`}
        />
      </TouchableOpacity>
    );
  };
  return (
    <View>
      {loading == true ? (
        <ActivityIndicator size="small" color="#999" style={{marginTop: 15}} />
      ) : null}
      <StatusBar backgroundColor="orange" />
      <FlatList data={recipetypes} renderItem={renderCategory} />
    </View>
  );
};

export default CategoriesScreen;
