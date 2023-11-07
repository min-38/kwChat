import { View, Text, TextInput } from "react-native"

function Input({ title }) {
    return (
        <View>
            <Text
                style={{
                    color: '#707070',
                    marginVertical: 10,
                    paddingLeft: 16
                }}
            >
                { title }
            </Text>
            <TextInput
                style={{
                    backgroundColor: '#e1e2e4',
                    borderRadius: 26,
                    height: 52,
                    paddingHorizontal: 16,
                    fontSize: 16
                }}
            />
        </View>
    )
}

export default Input