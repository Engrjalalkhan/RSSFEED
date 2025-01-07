import React, {useEffect, useRef} from 'react';
import {View, Animated, Easing, StyleSheet} from 'react-native';

const CustomLoadingSpinner = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous spin animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 0.5,
        duration: 700, // Spin duration in milliseconds
        easing: Easing.linear, // Explicitly import and use Easing.linear
        useNativeDriver: true,
      }),
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 0.8],
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
                  {translateY: -13},
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    margin: 30,
  },
  loader: {
    width: 3,
    height: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#DF4B38', // Gray color for dots
  },
});

export default CustomLoadingSpinner;
