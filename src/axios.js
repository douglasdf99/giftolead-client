import axios from 'axios'
// Vuex Store
import store from './store/store'
//const domain = "http://127.0.0.1:8000";
const domain = "https://api.saveleads.com.br";



export default axios.create({
  baseURL: domain,
  headers: { Authorization: `Bearer ${store.getters.getToken}` }
});

