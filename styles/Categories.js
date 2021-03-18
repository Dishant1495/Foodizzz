import {StyleSheet} from 'react-native';
import {windowWidth} from '../utils/Dimentions';

const styles = StyleSheet.create({
  categoriesItemContainer: {
    flex: 1,
    margin: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
    height: 215,
    borderColor: '#cccccc',
    width: windowWidth * 0.4,
    //  flexDirection: 'row',
  },

  textcontainer22: {
    color: '#999',
  },
  title: {
    flex: 1,
    fontSize: 14,
    textAlign: 'left',
    color: '#333333',
    marginTop: 4,
  },
  rowcontainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  totalrating: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
  middlecontainer: {
    color: 'gray',
    flex: 0.6,
  },

  categoriesPhoto: {
    width: '100%',
    height: 155,
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: 'blue',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 3,
  },
  categoriesName: {
    flex: 0.8,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 8,
    alignItems: 'flex-start',
    marginLeft: windowWidth * 0.05,
  },
  allbutton: {
    fontSize: 14,
    color: '#666',
    marginTop: 13,
    alignItems: 'flex-end',
    marginLeft: windowWidth * 0.4,
    // textDecorationColor:'blue'
    textDecorationLine: 'underline',
  },
  viewbutton: {
    color: '#333333',
    borderBottomWidth: 1,
    borderColor: 'blue',
  },
  direction: {
    flexDirection: 'row',
  },
  categoriesInfo: {
    marginTop: 3,
    marginBottom: 5,
  },
});

export default styles;
