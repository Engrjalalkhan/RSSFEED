import React, { useEffect } from 'react';
import {
    View,
    Image,
    StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('RSSFeed');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={[styles.container]}>
            <Image
                source={require('../assets/logo.png')}
                style={[styles.logo]}
            />
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
});
