import Vue from 'vue'
import axios from 'axios'

const apiBaseUrl = process.env.VUE_APP_URL_SERVIDOR_DADOS || '204.157.124.146:3000'

const api = axios.create({
	baseURL: apiBaseUrl,
	timeout: 60000,
	withCredentials: true,
})

Vue.prototype.$http = api
Vue.prototype.$axios = api

export default api
