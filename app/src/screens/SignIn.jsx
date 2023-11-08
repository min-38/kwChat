import { useState, useLayoutEffect } from "react"
import { SafeAreaView, View, Text, ImageBackground, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from "react-native"
import Title from "../common/Title"
import Input from "../common/Input"
import Button from "../common/Button"
import api from "../core/api"
import utils from "../core/utils"

function SignInScreen({ navigation }) {

    const [userId, setUserId] = useState('')
    const [password, setPassword] = useState('')

    const [userIdError, setUserIdError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    }, [])

    function onSignIn() {
        // 아이디 확인
        const failUserId = !userId;
        if (failUserId) {
            setUserIdError('아이디를 입력해주세요!')
        }
        // 유저 패스워드 확인
        const failPassword = !password;
        if (failPassword) {
            setPasswordError('패스워드를 입력해주세요!')
        }

        if(failUserId || failPassword) {
            return
        }

        // 로그인 요청
        api({
            method: 'POST',
            url: '/chat/signin/',
            data: {
                userId: userId,
                password: password
            }
        })
        .then(response => {
            utils.log('Sign In:', response)
        })
        .catch(error => {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.request);
            }
            console.log(error.config);
        })
    }

    return (
        <ImageBackground
            source={require("../assets/images/bg.png")}
            style={{
                height: null,
                resizeMode: "cover",
                overflow: "hidden",
                flex: 1
            }}>
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View 
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                paddingHorizontal: 20,
                            }}
                        >
                            <Title text='광운토크' color='#202020' />
                            
                            <Input
                                title="아이디"
                                value={userId}
                                error={userIdError}
                                setValue={setUserId}
                                setError={setUserIdError}
                            />
                            <Input 
                                title="패스워드"
                                value={password}
                                error={passwordError}
                                setValue={setPassword}
                                setError={setPasswordError}
                                secureTextEntry={true}
                            />

                            <Button
                                title="로그인"
                                onPress={onSignIn}
                            />

                            <Text style={{ textAlign: 'center', marginTop: 40 }}>
                                이런! 계정이 없으신가요? <Text
                                    style={{ color: 'blue' }}
                                    onPress={() => navigation.navigate('SignUp')}
                                >
                                    회원가입
                                </Text>
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    )
}

export default SignInScreen