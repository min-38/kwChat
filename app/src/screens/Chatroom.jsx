import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native"
import Cell from "../common/Cell"
import Empty from "../common/Empty"
import useGlobal from "../core/global"
import Thumbnail from "../common/Thumbnail"
import utils from "../core/utils"

function ChatroomRow({ navigation, item }) {
	return (
		<TouchableOpacity onPress={() => {
			navigation.navigate('Messages', item)
		}}>
			<Cell>
				<Thumbnail
					url={item.friend.thumbnail}
					size={76}
				/>
				<View
					style={{
						flex: 1,
						paddingHorizontal: 16
					}}
				>
					<Text
						style={{
							fontWeight: 'bold',
							color: '#202020',
							marginBottom: 4
						}}
					>
						{item.name}
					</Text>
				</View>
			</Cell>
		</TouchableOpacity>
	)
}

function ChatroomScreen({ navigation }) {
	const chatroomList = useGlobal(state => state.chatroomList)

	// Show loading indicator
	if (chatroomList === null) {
		return  (
			<ActivityIndicator style={{ flex: 1 }} />
		)
	}

	// Show empty if no requests
	if (chatroomList.length === 0) {
		return (
			<Empty icon='comment-dots' message='친구들과 이야기를 나눠보세요' />
		)
	}

	// Show request list
	return (
		<View
			style={{ flex: 1 }}
		>
			<FlatList
				data={chatroomList}
				renderItem={({ item }) => (
					<ChatroomRow navigation={navigation} item={item} />
				)}
				keyExtractor={item => item.id}
			/>
		</View>
	)
}

export default ChatroomScreen