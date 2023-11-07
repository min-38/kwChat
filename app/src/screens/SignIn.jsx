import { useLayoutEffect } from "react"
import { SafeAreaView, View, Text } from "react-native"
import Title from "../common/Title"
import Input from "../common/Input"
import Button from "../common/Button"

function SignInScreen({ navigation }) {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View 
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    paddingHorizontal: 20
                }}
            >
                <Title text='광운토크' color='#202020' />
                
                <Input title="아이디"/>
                <Input title="패스워드"/>

                <Button title="로그인" />

                <Text style={{ textAlign: 'center', marginTop: 40 }}>
                    이런! 계정이 없으신가요? <Text
                        style={{ color: 'blue' }}
                        onPress={() => navigation.navigate('SignUp')}
                    >
                        회원가입
                    </Text>
                </Text>
            </View>
        </SafeAreaView>
    )
}

export default SignInScreen