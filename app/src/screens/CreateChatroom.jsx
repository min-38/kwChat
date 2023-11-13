import { useEffect, useState } from "react"
import { 
	FlatList,
	SafeAreaView, 
	Text, 
	TextInput, 
	View,
} from "react-native"

import Empty from "../common/Empty"
import Thumbnail from "../common/Thumbnail"
import useGlobal from "../core/global"
import Cell from "../common/Cell"

function SearchRow({ user }) {

	return (
		<Cell>
			<Thumbnail
				url={user.thumbnail}
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
						fontSize: 20,
						marginBottom: 4
					}}
				>
					{user.username}
				</Text>
				<Text
					style={{ 
						color: '#606060',
					}}
				>
					@{user.userid}
				</Text>
			</View>
		</Cell>
	)
}

function CreateChatroomScreen() {
	const [query, setQuery] = useState('')

	const friendList = useGlobal(state => state.friendList)
	const searchUsers = useGlobal(state => state.searchUsers)

	useEffect(() => {
		searchUsers(query)
	}, [query]) 

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View
				style={{
					padding: 16,
					borderBottomWidth: 1,
					borderColor: '#f0f0f0'
				}}
			>
				<View>
					<TextInput
						style={{
							backgroundColor: '#e1e2e4',
							height: 52,
							borderRadius: 26,
							padding: 16,
							fontSize: 16,
						}}
						value={query}
						onChangeText={setQuery}
						placeholder='채팅방 이름'
						placeholderTextColor='#b0b0b0'
					/>
				</View>
			</View>

			<View>
				<Text
					style={{ 
						color: '#606060',
						fontSize: 18,
						paddingTop: 10,
						paddingLeft: 10
					}}
				>
					친구 목록
				</Text>
			</View>
			{friendList == null ||friendList.length === 0 ? (
				<Empty
					icon='triangle-exclamation'
					message={'이야기를 나눌 친구가 없어요.\n친구를 추가해주세요'}
					centered={false}
				/>
			) : (
				<FlatList
					data={friendList}
					renderItem={({ item }) => (
						<SearchRow user={item} />
					)}
					keyExtractor={item => item.userid}
				/>
			)}
		</SafeAreaView>
	)
}

export default CreateChatroomScreen