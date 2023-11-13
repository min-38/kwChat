import { useState } from "react"
import { View, TouchableOpacity, Pressable } from 'react-native';
import { Button, Menu, Divider, Provider } from 'react-native-paper';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"

function ChatroomMenu() {

    const [visible, setVisible] = useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

	return (
        <Provider
            style={{ 
                width: 100
            }}
        >
				<Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <Pressable 
                            onPress={openMenu}
                        >
                            <FontAwesomeIcon
                                icon='ellipsis'
                                color='#000000'
                                size={30}
                            />
                        </Pressable>
                    }>
                    <Menu.Item onPress={() => {}} title="메모장" />
                </Menu>
			{/* </TouchableOpacity> */}
        </Provider>
	)
}

export default ChatroomMenu