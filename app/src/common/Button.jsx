import { Text, TouchableOpacity } from "react-native"

function Button({ title }) {
    return (
        <TouchableOpacity
            style={{
                backgroundColor: '#202020',
                height: 52,
                borderRadius: 26,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 25
            }}
        >
            <Text
                style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 'bold'
                }}
            >
                { title }
            </Text>
        </TouchableOpacity>
    )
}

export default Button