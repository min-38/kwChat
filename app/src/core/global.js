import { create } from 'zustand'
import secure from './secure'
import api, { ADDRESS } from './api'
import utils from './utils'

//-------------------------------------
//   Socket receive message handlers
//-------------------------------------

function responseFriendList(set, get, friendList) {
	set((state) => ({
		friendList: friendList
	}))
}

function responseFriendNew(set, get, friend) {
	const friendList = [friend, ...get().friendList]
	set((state) => ({
		friendList: friendList
	}))
}

function responseMessageList(set, get, data) {
	set((state) => ({
		messagesList: [...get().messagesList, ...data.messages],
		messagesNext: data.next,
		messagesUsername: data.friend.username
	}))
}

function responseMessageSend(set, get, data) {
	const username = data.friend.username
	// Move friendList item for this friend to the start of 
	// list, update the preview text and update the time stamp
	const friendList = [...get().friendList]
	const friendIndex = friendList.findIndex(
		item => item.friend.username === username
	)
	if (friendIndex >= 0) {
		const item = friendList[friendIndex]
		item.preview = data.message.text
		item.updated = data.message.created
		friendList.splice(friendIndex, 1)
		friendList.unshift(item)
		set((state) => ({
			friendList: friendList
		}))
	}
	// If the message data does not belong to this friend then 
	// dont update the message list, as a fresh messageList will 
	// be loaded the next time the user opens the correct chat window
	if (username !== get().messagesUsername) {
		return
	}
	const messagesList = [data.message, ...get().messagesList]
	set((state) => ({
		messagesList: messagesList,
		messagesTyping: null
	}))
}

function responseMessageType(set, get, data) {
	if (data.username !== get().messagesUsername) return
	set((state) => ({
		messagesTyping: new Date()
	}))
}

function responseRequestAccept(set, get, connection) {
	const user = get().user
	// If I was the one that accepted the request, remove 
	// request from the  requestList
	if (user.userid === connection.receiver.userid) {
		const requestList = [...get().requestList]
		const requestIndex = requestList.findIndex(
			request => request.id === connection.id
		)
		if (requestIndex >= 0) {
			requestList.splice(requestIndex, 1)
			set((state) => ({
				requestList: requestList
			}))
		}
	} 
	// If the corresponding user is contained within the  
	// searchList for the  acceptor or the  acceptee, update 
	// the state of the searchlist item
	const sl = get().searchList
	if (sl === null) {
		return
	}
	const searchList = [...sl]

	let  searchIndex = -1
	// If this user  accepted
	if (user.userid === connection.receiver.userid) {
		searchIndex = searchList.findIndex(
			user => user.userid === connection.sender.userid
		)
	// If the other user accepted
	} else {
		searchIndex = searchList.findIndex(
			user => user.userid === connection.receiver.userid
		)
	}
	if (searchIndex >= 0) {
		searchList[searchIndex].status = 'connected'
		set((state) => ({
			searchList: searchList
		}))
	}
}

function responseRequestConnect(set, get, connection) {
	const user = get().user
	// 요청하면 검색 다시 업데이트
	if (user.userid === connection.sender.userid) {
		const searchList = get().searchList
		const searchIndex = searchList.findIndex(
			request => request.userid === connection.receiver.userid
		)
		if (searchIndex >= 0) {
			searchList[searchIndex].status = ''
			set((state) => ({
				searchList: searchList
			}))
		}
	} else {
		const requestList = [...get().requestList]
		const requestIndex = requestList.findIndex(
			request => request.sender.userid === connection.sender.userid
		)
		if(requestIndex === -1) {
			requestList.unshift(connection)
			set((state) => ({
				requestList: requestList
			}))
		}
	}
}

function responseRequestList(set, get, requestList) {
	set((state) => ({
		requestList: requestList
	}))
}

function responseSearch(set, get, data) {
	set((state) => ({
		searchList: data
	}))
}

function responseThumbnail(set, get, data) {
	set((state) => ({
		user: data
	}))
}

const useGlobal = create((set, get) => ({

	//---------------------
	//   Initialization
	//---------------------

	initialized: false,
	
	init: async () => {
		const credentials = await secure.get('credentials')
		if (credentials) {
			try {
				const response = await api({
					method: 'POST',
					url: '/chat/signin/',
					data: {
						userid: credentials.userid,
						password: credentials.password
					}
				})
				if (response.status !== 200) {
					throw 'Authentication error'
				}
				const user = response.data.user
				const tokens = response.data.tokens

				secure.set('tokens', tokens)

				set((state) => ({
					initialized: true,
					authenticated: true,
					user: user
				}))
				return
			} catch (error) {
				console.log('useGlobal.init: ', error)
			}
		}
		set((state) => ({
			initialized: true,
		}))
	},

	//---------------------
	//   Authentication
	//---------------------

	authenticated: false,
	user: {},

	login: (credentials, user, tokens) => {
		secure.set('credentials', credentials)
		secure.set('tokens', tokens)
		set((state) => ({
			authenticated: true,
			user: user
		}))
	},
	logout: () => {
		secure.wipe()
		set((state) => ({
			authenticated: false,
			user: {}
		}))
	},

	//---------------------
	//     Websocket
	//---------------------

	socket: null,

	socketConnect: async () => {
		const tokens = await secure.get('tokens')

		const url = `ws://${ADDRESS}/kwchat/?token=${tokens.access}`
		const socket = new WebSocket(url)

		socket.onopen = () => {
			utils.log('socket.onopen')
			
			socket.send(JSON.stringify({
				source: 'request.list'
			}))

			socket.send(JSON.stringify({
				source: 'friend.list'
			}))
		}
		socket.onmessage = (event) => {
			// Convert data to javascript object
			const parsed = JSON.parse(event.data)

			// Debug log formatted  data
			utils.log('onmessage:', parsed)

			const responses = {
				'friend.list':     responseFriendList,
				'friend.new':      responseFriendNew,
				'message.list':    responseMessageList,
				'message.send':    responseMessageSend,
				'message.type':    responseMessageType,
				'request.accept':  responseRequestAccept,
				'request.connect': responseRequestConnect,
				'request.list':    responseRequestList,
				'search':          responseSearch,
				'thumbnail':       responseThumbnail
			}
			const resp = responses[parsed.source]
			if (!resp) {
				utils.log('parsed.source "' + parsed.source + '" not found')
				return
			}
			// Call response function
			resp(set, get, parsed.data)
		}
		socket.onerror = (e) => {
			utils.log('socket.onerror', e.message)
		}
		socket.onclose = () => {
			utils.log('socket.onclose')
		}
		set((state) => ({
			socket: socket
		}))
	},

	socketClose: () => {
		const socket =  get().socket
		if (socket) {
			socket.close()
		}
		set((state) => ({
			socket: null
		}))
	},

	//---------------------
	//     Search
	//---------------------

	searchList: null,

	searchUsers: (query) => {
		if(query) {
			const socket = get().socket
			socket.send(JSON.stringify({
				source: 'search',
				query: query
			}))
		} else {
			set((state) => ({
				searchList: null
			}))
		}
	},

	//---------------------
	//     Messages
	//---------------------

	messagesList: [],
	messagesNext: null,
	messagesTyping: null,
	messagesUsername: null,

	messageList: (connectionId, page=0) => {
		if (page === 0) {
			set((state) => ({
				messagesList: [],
				messagesNext: null,
				messagesTyping: null,
				messagesUsername: null
			}))
		} else {
			set((state) => ({
				messagesNext: null
			}))
		}
		const socket = get().socket
		socket.send(JSON.stringify({
			source: 'message.list',
			connectionId: connectionId,
			page: page
		}))
	},

	messageSend: (connectionId, message) => {
		const socket = get().socket
		socket.send(JSON.stringify({
			source: 'message.send',
			connectionId: connectionId,
			message: message
		}))
	},

	messageType: (username) => {
		const socket = get().socket
		socket.send(JSON.stringify({
			source: 'message.type',
			username: username
		}))
	},

	//---------------------
	//     Requests
	//---------------------

	requestList: null,

	requestAccept: (userid) => {
		const socket = get().socket
		socket.send(JSON.stringify({
			source: 'request.accept',
			userid: userid
		}))
	},

	requestConnect: (userid) => {
		const socket = get().socket
		socket.send(JSON.stringify({
			source: 'request.connect',
			userid: userid
		}))
	},

	//---------------------
	//     Thumbnail
	//---------------------

	uploadThumbnail: (file) => {
		const socket = get().socket
		socket.send(JSON.stringify({
			source: 'thumbnail',
			base64: file.base64,
			filename: file.fileName
		}))
	}
}))

export default useGlobal