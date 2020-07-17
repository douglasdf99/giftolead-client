import axios from 'axios'
// Vuex Store
import store from './store/store'
var subdomain =  window.location.host.split('.')[1] ? window.location.host.split('.')[0] : false;
//const domain = "https://api.saveleads.com.br/" + subdomain;
const domain = "https://api.saveleads.com.br/api";

export default axios.create({
  baseURL: domain,
  headers: { Authorization: `Bearer ${store.getters.getToken}` }
});

