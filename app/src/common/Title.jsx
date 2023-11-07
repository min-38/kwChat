import { Text } from "react-native"

function Title({ text, color }) {
    return (
        <Text
            style={{ 
                color: color,
                textAlign: 'center',
                fontSize: 48,
                fontFamily: 'Sunflower-Light',
                marginBottom: 30
            }}
        >
            { text }
        </Text>
    )
}

export default Title