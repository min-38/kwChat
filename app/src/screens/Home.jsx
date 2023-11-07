import { useLayoutEffect } from "react"
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import RequestsScreen from "./Requests"
import FriendsScreen from "./Friends"
import ProfileScreen from "./Profile"

const Tab = createBottomTabNavigator()

function HomeScreen({ navigation }) {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    }, [])
    
    return (
        <Tab.Navigator
            screenOptions={({ route, navigation }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    const icons = {
						Requests: 'bell',
						Friends: 'inbox',
						Profile: 'user'
					}
                    const icon = icons[route.name]
                    return (
                        <FontAwesomeIcon icon={icon} size={28} color={color} />
                    )
                },
                // tabBarActiveTintColor: 'dark'
            })}
        >
            <Tab.Screen name="Requests" component={RequestsScreen}></Tab.Screen>
            <Tab.Screen name="Friends" component={FriendsScreen}></Tab.Screen>
            <Tab.Screen name="Profile" component={ProfileScreen}></Tab.Screen>
        </Tab.Navigator>
    )
}

export default HomeScreen