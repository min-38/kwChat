import { ActivityIndicator, FlatList, View, Text, TouchableOpacity } from "react-native"
import useGlobal from "../core/global"
import Empty from "../common/Empty"
import Thumbnail from "../common/Thumbnail"
import utils from "../core/utils"

function RequestAccept({ item }) {
	const requestAccept = useGlobal(state => state.requestAccept)

    // Show loading indicator
    if(requestList === null) {
        return (
            <ActivityIndicator style={{ flex: 1 }} />
        )
    }

	return (
		<TouchableOpacity
			style={{
				backgroundColor: '#202020',
				paddingHorizontal: 14,
				height: 36,
				borderRadius: 18,
				alignItems: 'center',
				justifyContent: 'center'
			}}
			onPress={() => requestAccept(item.sender.username)}
		>
			<Text style={{ color: 'white', fontWeight: 'bold' }}>Accept</Text>
		</TouchableOpacity>
	)
}

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
                            fontWeight: 'bold',
                            color: '#202020',
                            marginBottom: 4
                        }}
                    >
                        {user.name}
                    </Text>
                    <Text
                        style={{
                            color: '#606060',
                        }}
                    >
                        {user.username}
                    </Text>
                </View>
			<SearchButton user={user} />
		</Cell>
	)
}

function RequestsScreen() {
	const requestList = useGlobal(state => state.requestList)

	// Show loading indicator
	if (requestList === null) {
		return  (
			<ActivityIndicator style={{ flex: 1 }} />
		)
	}

	// Show empty if no requests
	if (requestList.length === 0) {
		return (
			<Empty icon='bell' image="../assets/images/cry.png" type='request' message='이런,,, 당신과 친구하고 싶어하는 사람이 없어요' />
		)
	}

	// Show request list
	return (
		<View style={{ flex: 1 }}>
			<FlatList
				data={requestList}
				renderItem={({ item }) => (
					<RequestRow item={item} />
				)}
				keyExtractor={item => item.sender.userid}
			/>
		</View>
	)
}

export default RequestsScreen