import {StyleSheet, Dimensions} from 'react-native';
const {width: viewportWidth} = Dimensions.get('window');
const styles = StyleSheet.create({
  totalrating: {
    fontWeight: 'bold',
    marginLeft: 5,
  },

  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: 250,
    //flexDirection:'row'
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    width: viewportWidth,
    height: 250,
  },

  spacecontainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  rowcontainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },

  middlecontainer: {
    color: 'gray',
    flex: 0.4,
  },

  paginationContainer: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
    paddingVertical: 8,
    marginTop: 300,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 0,
  },
});

export default styles;
