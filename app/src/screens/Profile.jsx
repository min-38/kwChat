const { View, Text, Image, TouchableOpacity, Alert } = require("react-native");
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import useGlobal from "../core/global"
import utils from "../core/utils"

function ProfileLogout() {
    const logout = useGlobal(state => state.logout)

    goAlert = () =>
        Alert.alert("로그아웃할까요?", '',
            [
                { text: "아니요", onPress: () => {}, style: 'cancel' },
                {
                    text: "로그아웃",
                    onPress: logout,
                    style: 'destructive'
                }
                
            ],
            {
                cancelable: true,
                onDismiss: () => {},
            },
        )

    return (
        <TouchableOpacity
            onPress={ this.goAlert }
            style={{ 
                flexDirection: 'row',
                height: 52,
                borderRadius: 26,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 26,
                backgroundColor: '#202020',
                marginTop: 40
            }}
        >
            <FontAwesomeIcon
				icon='right-from-bracket'
				size={20}
				color='#d0d0d0'
				style={{ marginRight: 12}}
			/>
            <Text
                style={{ 
                    fontWeight: 'bold',
                    color: "#d0d0d0",

                }}
            >
                로그아웃
            </Text>
        </TouchableOpacity>
    )
}

function ProfileScreen() {
    const user = useGlobal(state => state.user)
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                paddingTop: 100
            }}
        >
            <Image
                source={require('../assets/images/default-user-avartar.png')}
                style={{ width: 180, height: 180, borderRadius: 90, backgroundColor: '#e0e0e0', marginBottom: 20 }}
            />
            <Text
                style={{ 
                    textAlign: 'center',
                    color: '#303030',
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginBottom: 6,
                }}
            >
                {user.username}
            </Text>

            <Text
                style={{ 
                    textAlign: 'center',
                    color: '#606060',
                    fontSize: 14,
                    // fontWeight: 'bold',
                    // marginTop: 6,
                }}
            >
                ID: @{user.userid}
            </Text>
            
            <ProfileLogout />
        </View>
    )
}

export default ProfileScreen