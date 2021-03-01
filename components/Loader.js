import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
const Loader = (props) => {
  const {loading} = props;
  return (
    <View style={styles.modalBackground}>
      <View style={styles.activityIndicatorWrapper}>
        <ActivityIndicator animating={loading} color="#0000ff" size="small" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  activityIndicatorWrapper: {
    alignSelf: 'center',
    marginTop: 20,
    justifyContent: 'space-around',
  },
});

export default Loader;
