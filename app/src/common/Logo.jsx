import { Image } from "react-native"

function Logo() {
    return (
        <Image
            source={require('../assets/images/logo.png')}
            style={{
                width: 70,
                height: 70,
            }}
        />
    )
}

export default Logo