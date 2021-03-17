import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {windowHeight, windowWidth} from '../utils/Dimentions';
const HomeHeaderLeft = (props) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = await AsyncStorage.getItem('user');
      setUsers(user);
    };
    fetchData();
  });

  return (
    <View
      style={{
        backgroundColor: 'orange',
        flex: 0.12,
        flexDirection: 'row',
      }}>
      <View
        style={{
          marginHorizontal: windowWidth * 0.025,
          marginVertical: windowHeight * 0.025,
        }}>
        <MaterialCommunityIcons
          name="logout"
          size={24}
          backgroundColor="#fff"
          color="white"
          onPress={async () => {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('UserId');
            setUsers({
              users: [],
            });
            props.navigation.navigate('Login');
          }}
        />
      </View>
      <Text
        style={{
          color: 'white',
          fontFamily: 'Kufam',
          fontSize: 18,
          alignItems: 'flex-start',
          marginVertical: windowHeight * 0.023,
        }}>
        Feed
      </Text>
      <View style={{marginLeft: windowWidth / 1.5, marginTop: 15}}>
        <FontAwesome5
          name="plus"
          size={20}
          backgroundColor="#fff"
          color="white"
          onPress={() => props.navigation.navigate('AddPost')}
        />
      </View>
    </View>
  );
};

export default HomeHeaderLeft;
