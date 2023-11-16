import { useEffect, useLayoutEffect } from "react"
import { TouchableOpacity, View, Image } from "react-native"
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import RequestsScreen from "./Requests"
import FriendsScreen from "./Friends"
import ProfileScreen from "./Profile"
import ChatroomScreen from "./Chatroom"
import useGlobal from "../core/global"
import Thumbnail from "../common/Thumbnail"

const Tab = createBottomTabNavigator()

function HomeScreen({ navigation }) {
    const socketConnect = useGlobal(state => state.socketConnect)
	const socketClose = useGlobal(state => state.socketClose)
    const user = useGlobal(state => state.user)

    useLayoutEffect(() => {
		navigation.setOptions({
			headerShown: false,
			
		})
	}, [])

	useEffect(() => {
		socketConnect()
		return () => {
			socketClose()
		}
	}, [])

    function onSearch() {
		navigation.navigate('Search')
	}

	function onCreateChatroom() {
		navigation.navigate('CreateChatroom')
	}

    return (
        <Tab.Navigator
            screenOptions={({ route, navigation }) => ({
                headerLeft: () => (
					<View style={{ marginLeft: 16 }}>
						<Thumbnail
							url={user.thumbnail}
							size={28}
						/>
					</View>
				),
				headerRight: () => {
					if(route.name == "Chatrooms") {
						return (
							<TouchableOpacity
								onPress={ onCreateChatroom }
							>
								<FontAwesomeIcon
									style={{ marginRight: 16 }}
									icon='plus' 
									size={22} 
									color='#404040'
								/>
							</TouchableOpacity>
						)
					} else if(route.name == "Friends") {
						return (
							<TouchableOpacity
								onPress={ onSearch }
							>
								<FontAwesomeIcon
									style={{ marginRight: 16 }}
									icon='user-plus' 
									size={22} 
									color='#404040'
								/>
							</TouchableOpacity>
						)
					}
				},
                tabBarIcon: ({ focused, color, size }) => {
					const icons = {
						Requests: 'bell',
						Friends: 'people-group',
						Chatrooms: 'comments',
						Profile: 'user'
					}
					const icon = icons[route.name]
					return (
						<FontAwesomeIcon icon={icon} size={28} color={color} />
					)
				},
				tabBarActiveTintColor: '#202020',
				tabBarShowLabel: false
            })}
        >
            <Tab.Screen name="Requests" component={RequestsScreen} options={{ title: '친구 요청' }}></Tab.Screen>
            <Tab.Screen name="Friends" component={FriendsScreen} options={{ title: '친구 리스트' }}></Tab.Screen>
			{/* <Tab.Screen name="Chatrooms" component={ChatroomScreen} options={{ title: '채팅창' }}></Tab.Screen> */}
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: '프로필' }}></Tab.Screen>
        </Tab.Navigator>
    )
}

export default HomeScreen