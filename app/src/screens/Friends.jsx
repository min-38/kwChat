import { useState } from "react"
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native"
import Cell from "../common/Cell"
import Empty from "../common/Empty"
import useGlobal from "../core/global"
import Thumbnail from "../common/Thumbnail"
import utils from "../core/utils"

function FriendRow({ navigation, item }) {
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
							paddingBottom: 4
						}}
					>
						{item.friend.username}
					</Text>
					<Text
						numberOfLines={1}
						style={{
							color: '#606060',
							paddingBottom: 10
						}}
					>
						{item.preview}
					</Text>
					<Text style={{ color: '#909090', fontSize: 13 }}>
						{utils.formatTime(item.updated)}
					</Text>
				</View>
			</Cell>
		</TouchableOpacity>
	)
}

function FriendsScreen({ navigation }) {
	const friendList = useGlobal(state => state.friendList)

	// Show loading indicator
	if (friendList === null) {
		return  (
			<ActivityIndicator style={{ flex: 1 }} />
		)
	}

	// Show empty if no requests
	if (friendList.length === 0) {
		return (
			<Empty icon='face-smile' message='친구를 추가하고 대화를 나눠보세요.' />
		)
	}

	// Show request list
	return (
		<View style={{ flex: 1 }}>
			<FlatList
				data={friendList}
				renderItem={({ item }) => (
					<FriendRow navigation={navigation} item={item} />
				)}
				keyExtractor={item => item.id}
			/>
		</View>
	)
}

export default FriendsScreen