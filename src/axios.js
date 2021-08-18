import axios from 'axios'

// Vuex Store
import store from './store/store'
import saveleadsConfig from "../saveleadsConfig";

var domain = saveleadsConfig.url_api

export default axios.create({
  baseURL: domain,
  headers: {Authorization: `Bearer ${store.getters.getToken}`}
});

