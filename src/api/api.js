import axios from 'axios';

const apiBaseUrl = process.env.VUE_APP_URL_SERVIDOR_DADOS || '/erp/api';

export default axios.create({
  baseURL: apiBaseUrl,
  timeout: 60000,
  withCredentials: true,
});
