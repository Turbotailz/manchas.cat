import axios from 'axios';

const { VUE_APP_API_URL } = process.env;

const instance = axios.create({
  baseURL: VUE_APP_API_URL,
  withCredentials: true,
});

export default instance;