import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimentions';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Inputtitle = ({
  labelValue,
  placeholderText,
  numberOfLines,
  iconType,
  ...rest
}) => {
  return (
    <View style={styles.inputContainer}>
      {!iconType ? null : (
        <View style={styles.iconStyle}>
          <AntDesign name={iconType} size={25} color="#666" />
        </View>
      )}
      <TextInput
        value={labelValue}
        style={styles.input}
        placeholder={placeholderText}
        placeholderTextColor="#666"
        numberOfLines={numberOfLines}
        {...rest}
      />
    </View>
  );
};

export default Inputtitle;

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    height: windowHeight / 15,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 5,
    marginBottom: 10,
  },
  iconStyle: {
    padding: 10,
    height: '100%',
    borderRightColor: '#ccc',
    borderRightWidth: 1,
    width: 50,
  },
  input: {
    padding: 10,
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    color: '#333',
    alignSelf: 'flex-start',
    right: 10,
    width:"100%"
  },
  inputField: {
    width: windowWidth / 1.5,
    height: windowHeight / 15,
    fontSize: 16,
    borderRadius: 8,
    borderBottomWidth: 1,
  },
});
