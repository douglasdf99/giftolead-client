import axios from 'axios'
// Vuex Store
import store from './store/store'

var subdomain = window.location.host.split('.')[1] ? window.location.host.split('.')[0] : false;
var domain = '';
if (subdomain)
    domain = "https://api.saveleads.com.br/" + subdomain;
else
    domain = "https://api.saveleads.com.br/app";

console.log('domain', subdomain, domain)

export default axios.create({
    baseURL: domain,
    headers: {
        Authorization: `Bearer ${store.getters.getToken}`,
    }
});

