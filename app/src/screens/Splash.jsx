import { useEffect } from 'react';
import {
    Animated, SafeAreaView, StatusBar, View
} from 'react-native';
import Title from "../common/Title"

function SplashScreen() {

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
                <Title text='광운토크' color='white'></Title>
            </Animated.View>
            {/* <SplashScreen /> */}
        </SafeAreaView>
    )
}

export default SplashScreen