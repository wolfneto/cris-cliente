import Vue from 'vue'
import axios from 'axios'

const apiBaseUrl = process.env.VUE_APP_URL_SERVIDOR_DADOS

const api = axios.create({
	baseURL: apiBaseUrl,
	timeout: 60000,
	withCredentials: true,
})

Vue.prototype.$http = api

export default api
