import React from 'react';
import {
    SafeAreaView, StatusBar, Text, View
} from 'react-native';

import SplashScreen from './src/screens/Splash';

function App() {
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
                        fontSize: 48
                    }}
                >
                    kwChat
                </Text>
            </View>
            {/* <SplashScreen /> */}
        </SafeAreaView>
        
    )
}

export default App;
