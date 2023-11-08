import { useState, useLayoutEffect } from "react"
import { SafeAreaView, Text, View, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from "react-native"
import Input from "../common/Input"
import Button from "../common/Button"

function SignUpScreen({ navigation }) {

    const [userId, setUserId] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')

    const [userIdError, setUserIdError] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [password2Error, setPassword2Error] = useState('')

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    }, [])

    function onSignUp() {
        // 아이딘 확인
        const failUserId = !userId || userId.length < 5
        if (failUserId) {
            setUserIdError('아이디를 입력해주세요!\n(아이디는 5글자 이상 입력해주셔야 합니다.)')
        }
        // 유저명 확인
        const failUsername = !username;
        if (failUsername) {
            setUsernameError('이름을 입력해주세요!')
        }
        // 유저 패스워드 확인
        const failPassword = !password || password.length < 10;
        if (failPassword) {
            setPasswordError('패스워드를 입력해주세요!\n(패스워드는 10글자 이상 입력해주서야 합니다)')
        }
        // 유저 패스워드 재입력 확인
        const failPassword2 = password != password2;
        if (failPassword2) {
            setPassword2Error("패스워드가 일치하지 않습니다!")
        }

        const failEmail = !email;
        if (failEmail) {
            setEmailError("이메일을 입력해주세요")
        }

        if(failUserId ||
            failUsername ||
            failPassword ||
            failPassword2 ||
            failEmail) {
            return
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View 
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            paddingHorizontal: 16
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                marginBottom: 24,
                                fontSize: 36,
                                fontWeight: 'bold',
                            }}
                        >
                            회원가입
                        </Text>

                        <Input
                            title="아이디"
                            value={userId}
                            error={userIdError}
                            setValue={setUserId}
                            setError={setUserIdError}
                        />
                        <Input
                            title="이름"
                            value={username}
                            error={usernameError}
                            setValue={setUsername}
                            setError={setUsernameError}
                        />
                        <Input
                            title="비밀번호"
                            value={password}
                            error={passwordError}
                            setValue={setPassword}
                            setError={setPasswordError}
                            secureTextEntry={true}
                        />
                        <Input
                            title="비밀번호 재확인"
                            value={password2}
                            error={password2Error}
                            setValue={setPassword2}
                            setError={setPassword2Error}
                            secureTextEntry={true}
                        />
                        <Input
                            title="이메일"
                            value={email}
                            error={emailError}
                            setValue={setEmail}
                            setError={setEmailError}
                        />

                        <Button title="회원가입" onPress={ onSignUp }/>

                        <Text style={{ textAlign: 'center', marginTop: 40 }}>
                            이미 회원이시라구요? <Text
                                style={{ color: 'blue' }}
                                onPress={() => navigation.goBack()}
                            >
                                로그인
                            </Text>
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default SignUpScreen