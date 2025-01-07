import React, {useEffect, useRef} from 'react';
import {View, Animated, Easing, StyleSheet} from 'react-native';

const Saveloader = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous spin animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000, // Spin duration in milliseconds
        easing: Easing.linear, // Explicitly import and use Easing.linear
        useNativeDriver: true,
      }),
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.loader, {transform: [{rotate: spin}]}]}>
        {Array.from({length: 12}).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                transform: [
                  {rotate: `${index * -30}deg`}, // Position dots around the circle
                  {translateY: -8},
                ],
                opacity: (12 - index) / 12, // Adjust opacity
              },
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
  },
  loader: {
    width: 2,
    height: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'white', // Gray color for dots
  },
});

export default Saveloader;
