import {StyleSheet, View} from 'react-native';
import React from 'react';
import RssFeedScreen from './src/screens/RssFeedScreen';
import CommonScreen from './src/screens/CommonScreen';

const App = () => {
  return (
    <View style={styles.container}>
      <RssFeedScreen navigation={CommonScreen}  />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
