import Vue from 'vue'
import axios from 'axios'

const configuredApiUrl = process.env.VUE_APP_URL_SERVIDOR_DADOS
const apiBaseUrl = configuredApiUrl &&
	configuredApiUrl.startsWith('http') &&
	!configuredApiUrl.includes('.vercel.app')
	? configuredApiUrl
	: 'https://cris-servidor-production.up.railway.app'

const api = axios.create({
	baseURL: apiBaseUrl,
	timeout: 60000,
	withCredentials: true,
})

Vue.prototype.$http = api
Vue.prototype.$axios = api

export default api
