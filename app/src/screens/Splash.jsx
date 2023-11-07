import React from 'react';
import {
    SafeAreaView, StatusBar, Text, View
} from 'react-native';

function SplashScreen() {
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
            <View>
                <Text
                    style={{ 
                        color: 'white',
                        textAlign: 'center',
                        fontSize: 48,
                        fontFamily: 'Sunflower-Light'
                    }}
                >
                    광운토크
                </Text>
            </View>
            {/* <SplashScreen /> */}
        </SafeAreaView>
    )
}

export default SplashScreen