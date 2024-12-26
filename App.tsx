import {StyleSheet, View} from 'react-native';
import React from 'react';
import RSSFeedScreen from './src/screens/RssFeedScreen';

const App = () => {
  return (
    <View style={styles.container}>
      <RSSFeedScreen />
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
