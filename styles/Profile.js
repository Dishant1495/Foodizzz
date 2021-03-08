import {StyleSheet, Dimensions} from 'react-native';
import {windowHeight} from '../utils/Dimentions';
const {width: viewportWidth} = Dimensions.get('window');
const deviceWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  maincontainer: {
    alignSelf: 'flex-start',
    marginTop: windowHeight / 22,
    paddingHorizontal: 10,
  },

  topcontainer: {
    flexDirection: 'row',
  },

  textcontainer: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  textcontainer11: {
    fontSize: 16,
  },

  middleContainer: {
    flexDirection: 'column',
    marginTop: windowHeight / 16,
    marginLeft: 10,
  },

  editprofilecontainer: {
    marginTop: windowHeight / 27,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: '#666',
    borderWidth: 1,
    padding: 10,
    width: '31%',
    marginLeft: 15,
  },

  directionsStyle: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    paddingLeft: 15,
    paddingRight: 15,
    color: '#666',
    marginTop: 15,
    fontWeight: 'bold',
  },

  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
  toolbar: {},
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
    justifyContent: 'center',
  },

  totalrating: {
    fontWeight: 'bold',
    marginLeft: 5,
    bottom: 5,
  },

  totalrating44: {
    fontWeight: 'bold',
    marginLeft: 7,
    fontSize: 14,
    marginTop: 1,
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

  imageContainer44: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
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
