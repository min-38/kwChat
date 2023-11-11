import { Platform } from "react-native"
import ProfileImage from '../assets/images/default-user-avartar.png'
import { ADDRESS } from "./api"

function log() {
	for (let i = 0; i < arguments.length; i++) {
		let arg = arguments[i]
		// Stringify and indent object
		if (typeof arg === 'object') {
			arg = JSON.stringify(arg, null, 2)
		}
		console.log(`[${Platform.OS}]`, arg)
	}
}

function thumbnail(url) {
	if (!url) {
		return ProfileImage
	}
	return {
		uri: 'http://' + ADDRESS + url
	}
}

function formatTime(date, text = "") {
	if (date === null)  {
		return '-'
	}
	const now = new Date()
	const s = Math.abs(now - new Date(date)) / 1000
	// Seconds
	if (s < 60) {
		return '온라인'
	}
	// Minutes
	if (s < 60*60) {
		const m = Math.floor(s / 60)
		return `${text}${m}분 전`
	}
	// Hours
	if (s < 60*60*24)  {
		const h = Math.floor(s / (60*60))
		return `${text}${h}시간 전`
	}
	// Days
	if (s < 60*60*24*7)  {
		const d = Math.floor(s / (60*60*24))
		return `${text}${d}일 전`
	}
	// Weeks
	if (s < 60*60*24*7*4)  {
		const w = Math.floor(s / (60*60*24*7))
		return `${text}${w}주 전`
	}
	// Years
	const y = Math.floor(s / (60*60*24*365))
	return `${text}${y}년 전`
}

export default { log, thumbnail, formatTime }