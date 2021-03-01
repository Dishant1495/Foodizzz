import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingTop: 10,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardview: {
    backgroundColor: 'white',
    borderColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
    width: '95%',
  },
  title: {
    color: 'gray',
    fontSize: 16,
  },

  text: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    color: 'gray',
  },

  radiocontainer: {
    marginTop: 10,
    alignSelf: 'flex-start',
    marginHorizontal: 5,
  },

  checkboxcontainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginHorizontal: 1,
  },

  recipetext: {
    margin: 8,
    bottom: 2,
    color: 'gray',
  },
});

export default styles;
