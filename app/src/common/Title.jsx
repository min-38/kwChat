import { Text } from "react-native"

function Title({ text, color }) {
    return (
        <Text
            style={{ 
                color: color,
                textAlign: 'center',
                fontSize: 48,
                fontFamily: 'Sunflower-Light'
            }}
        >
            { text }
        </Text>
    )
}

export default Title