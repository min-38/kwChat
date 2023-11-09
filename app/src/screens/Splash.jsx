import { useEffect, useLayoutEffect } from 'react';
import {
    Animated, SafeAreaView, StatusBar, View
} from 'react-native';
import AppName from "../common/AppName"

function SplashScreen({ navigation }) {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    }, [])

    const translateY = new Animated.Value(0)
    const duration = 1000

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(translateY, {
                    toValue: -20,
                    duration: duration,
                    useNativeDriver: true
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: duration,
                    useNativeDriver: true
                })
            ])
        ).start()
    }, [])

    return (
        <SafeAreaView
            style={{ 
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'black'
            }}
        >
            <StatusBar barStyle='light-content' />
            <Animated.View style={{ transform: [{ translateY }] }}>
                <AppName logoVisible={1} descVisible={1}/>
            </Animated.View>
        </SafeAreaView>
    )
}

export default SplashScreen