import {StyleSheet, View} from 'react-native';
import React from 'react';
import RSSFeedScreen from './src/screens/RssFeedScreen';
import RssFeedScreen from './src/screens/CommonScreen';

const App = () => {
  return (
    <View style={styles.container}>
      <RssFeedScreen />
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
