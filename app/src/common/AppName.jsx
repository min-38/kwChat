import { Fragment } from "react"
import { Text, Image } from "react-native"
import Logo from "./Logo"

function AppName({logoVisible = 1, descVisible = 1}) {
    return (
        <Fragment>
            <Logo style={{ 
                opacity: logoVisible,
            }} />
            <Text
                style={{
                    color: "#202020",
                    textAlign: 'center',
                    fontSize: 48,
                    fontFamily: 'Sunflower-Light',
                }}
            >
                Relation
                <Text
                    style={{
                        color: 'red',
                        textAlign: 'center',
                        fontSize: 48,
                        fontFamily: 'Sunflower-Light',
                        fontWeight: 'bold',
                    }}
                >
                    Ship
                </Text>
            </Text>
            <Text
                style={{
                    opacity: descVisible,
                    textAlign: 'center',
                    fontSize: 18,
                    fontFamily: 'Sunflower-Light',
                    fontWeight: 'bold',
                    marginBottom: 30
                }}
            >
                Relationship-focused chat app
            </Text>
        </Fragment>
    )
}

export default AppName