import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#ffffff',
    marginBottom: 45,
  },
  inputs: {
    height: 45,
    width: '85%',
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
    position: 'absolute',
    bottom: 0,
    paddingRight: 20,
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#808080',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postButtonContainer: {
    position: 'absolute',
    right: 2,
    height: 60,
    width: '25%',
    backgroundColor: 'orange',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    paddingLeft: 12,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    marginLeft: 10
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 20,
  },
  time: {
    fontSize: 11,
    color: '#808080',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
