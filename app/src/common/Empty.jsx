const { FontAwesomeIcon } = require("@fortawesome/react-native-fontawesome");
const { View, Text, Image } = require("react-native");

function Empty({ icon, message, type, centered=true }) {

    const picture = type == "request" ?
        <Image 
            source={require("../assets/images/cry.png")}
            style={{ 
                width: 50, 
                height: 50,
                marginBottom: 10
            }}
        /> :
        <FontAwesomeIcon
            icon={icon}
            color='#d0d0d0'
            size={90}
            style={{
                marginBottom: 16
            }}
        />
        
	return (
		<View
			style={{
				flex: 1,
				justifyContent: centered ? 'center' : 'flex-start',
				alignItems: 'center',
				paddingVertical: 120
			}}
		>
			{ picture }
			<Text
				style={{
					color: '#c3c3c3',
					fontSize: 16
				}}
			>
				{message}
			</Text>
		</View>
	)
}

export default Empty