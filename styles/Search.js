import {StyleSheet} from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimentions';
const styles = StyleSheet.create({
  headercontainer: {
    backgroundColor: '#fff',
    padding: 5,
    flexDirection: 'row',
    borderRadius: 10,
    marginLeft: 10,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
  },

  recipeImage: {
    marginHorizontal: 20,
    marginVertical: 5,
    width: windowWidth * 0.35,
    height: windowHeight * 0.2,
  },

  textcontainer22: {
    color: '#999',
  },
});

export default styles;
