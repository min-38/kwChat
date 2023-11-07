import { useLayoutEffect } from "react"
import { SafeAreaView, Text, View } from "react-native"
import Input from "../common/Input"
import Button from "../common/Button"

function SignUpScreen({ navigation }) {
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

                <Input title="아이디" />
                <Input title="이름" />
                <Input title="비밀번호" />
                <Input title="비밀번호 재확인" />
                <Input title="이메일" />

                <Button title="회원가입" />

                <Text style={{ textAlign: 'center', marginTop: 40 }}>
                    이미 회원이시라구요? <Text
                        style={{ color: 'blue' }}
                        onPress={() => navigation.goBack()}
                    >
                        로그인
                    </Text>
                </Text>
            </View>
        </SafeAreaView>
    )
}

export default SignUpScreen