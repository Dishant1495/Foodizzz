import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'contain',
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 20,
  },

  signupButton: {
    marginVertical: 5,
  },

  skipButton: {
    alignSelf: 'flex-end',
    marginVertical: 60,
    marginHorizontal: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },

  skipButtonText :{
    color:"#051d5f",
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Lato-Regular',
  },
});

export default styles;
