import { create } from 'zustand'
import secure from './secure'
import api, { ADDRESS } from './api'
import utils from './utils'

//-------------------------------------
//   Socket receive message handlers
//-------------------------------------

function responseRequestConnect(set, get, connection) {
	const user = get().user
	// 요청하면 검색 다시 업데이트
	if (user.userid === connection.sender.userid) {
		const searchList = get().searchList
		const searchIndex = searchList.findIndex(
			request => request.username === connection.receiver.userid
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
		}
		socket.onmessage = (event) => {
			// Convert data to javascript object
			const parsed = JSON.parse(event.data)

			// Debug log formatted  data
			utils.log('onmessage:', parsed)

			const responses = {
				'request.connect': responseRequestConnect,
				'request.list': responseRequestList,
				'search'		 : responseSearch,
				'thumbnail'		 : responseThumbnail
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
	//     Requests
	//---------------------

	requestList: null,

	requestAccept: (username) => {
		const socket = get().socket
		socket.send(JSON.stringify({
			source: 'request.accept',
			username: username
		}))
	},

	requestConnect: (username) => {
		const socket = get().socket
		socket.send(JSON.stringify({
			source: 'request.connect',
			username: username
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