import React from 'react';
import Providers from './navigation';
console.disableYellowBox = true;
import {LogBox} from 'react-native';
import {SafeAreaView} from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications


const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Providers />
    </SafeAreaView>
  );
};

export default App;
