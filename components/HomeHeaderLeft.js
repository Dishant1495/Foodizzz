import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {windowWidth} from '../utils/Dimentions';
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
      <View style={{marginTop: 10, marginLeft: 20}}>
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
          marginLeft: 20,
          marginTop: 10,
        }}>
        Feed
      </Text>
      <View style={{marginLeft: windowWidth / 1.75, marginTop: 15}}>
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
