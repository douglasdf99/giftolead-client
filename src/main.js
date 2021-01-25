/*=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import VueEcho from 'vue-echo-laravel';
import * as io from 'socket.io-client'

window.io = io


import Vue from 'vue'
import App from './App.vue'

// Vuesax Component Framework
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css'; // Vuesax
Vue.use(Vuesax)

// axios
import axios from "./axios.js"

Vue.prototype.$http = axios

// API Calls
import "./http/requests"

// mock
import "./fake-db/index.js"

// Theme Configurations
import '../themeConfig.js'

// Configurações gerais
import '../saveleadsConfig.js'


// Firebase
import '@/firebase/firebaseConfig'


// Auth0 Plugin
import AuthPlugin from "./plugins/auth";

Vue.use(AuthPlugin);


// ACL
import acl from './acl/acl'

//maks
import VueTheMask from 'vue-the-mask'

Vue.use(VueTheMask)

// only as a filter
import {VueMaskFilter} from 'v-mask'

Vue.filter('VMask', VueMaskFilter)

import money from 'v-money'
// register directive v-money and component <money>
Vue.use(money, {precision: 4})

import VueSimpleContextMenu from 'vue-simple-context-menu'

Vue.component('vue-simple-context-menu', VueSimpleContextMenu)

// Globally Registered Components
import './globalComponents.js'


// Styles: SCSS
import './assets/scss/main.scss'
import './assets/css/base.css'

// Tailwind
import '@/assets/css/main.css'


// Vue Router
import router from './router'


// Vuex Store
import store from './store/store'

Vue.use(VueEcho, {
    broadcaster: 'socket.io',
    host: 'https://api.saveleads.com.br:2083',
    auth: {
        headers: {
            Authorization: `Bearer ${store.getters.getToken}`
        }
    }
});

// i18n
import i18n from './i18n/i18n'


// Vuexy Admin Filters
import './filters/filters'


// Clipboard
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard);


// Tour
import VueTour from 'vue-tour'

Vue.use(VueTour)
require('vue-tour/dist/vue-tour.css')


// VeeValidate
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);

// Google Maps
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
    load: {
        // Add your API key here
        key: 'YOUR_API_KEY',
        libraries: 'places', // This is required if you use the Auto complete plug-in
    },
})
Vue.mixin({
    methods: {...methods}
});

// Vuejs - Vue wrapper for hammerjs
import {VueHammer} from 'vue2-hammer'

Vue.use(VueHammer)

// PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

import VueMoment from 'vue-moment'
import saveleadsConfig from "../saveleadsConfig";

const moment = require('moment/moment');
require('moment/locale/pt-br');
Vue.use(VueMoment, {
    moment
});

Vue.filter('formatDate', function (value) {
    if (value) {
        return moment(String(value)).format('DD/MM/YYYY')
    }
});

Vue.filter('formatDateTime', function (value) {
    if (value) {
        return moment(String(value)).format('DD/MM/YYYY H:mm')
    }
});

Vue.filter('formatDateHumanize', function (value) {
    if (value) {
        let end = moment();
        value = moment(value);
        return moment.duration(end.diff(value)).humanize();
    }
});

Vue.filter('showDateMonth', function (value) {
    if (value) {
        return moment(String(value)).format('MMM YYYY')
    }
});

// Feather font icon
require('./assets/css/iconfont.css')


// Vue select css
// Note: In latest version you have to add it separately
// import 'vue-select/dist/vue-select.css';


Vue.config.productionTip = false
import VueSweetalert2 from 'vue-sweetalert2';
import methods from "@/globalMethods";


Vue.use(VueSweetalert2);
let self = this;
axios.interceptors.response.use((response) => { // intercept the global error
    return response
}, function (error) {
    let originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) { // if the error is 401 and hasent already been retried
        originalRequest._retry = true // now it can be retried
        Vue.swal({
            title: "Sessão expirada",
            text: "Sua sessão foi expirada, para continuar será nescessário realizar login novamente",
            type: "warning",
            showCancelButton: false,
            confirmButtonColor: "#8d83f3",
            confirmButtonText: "OK",
            closeOnConfirm: false
        }).then((result) => {
            localStorage.removeItem('userInfo');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('permissoes');
            window.location = '/login';
        });
        return
    }
    if (error.response.status === 429 && !originalRequest._retry) {
        originalRequest._retry = true
        Vue.swal({
            title: "Muitas requisições em um curto periodo",
            text: "Identificamos uma grande quantidade de requisições em um curto periodo, por isso sua últioma requisição foi interrompida por questões de segurança, para continuar a utilizar o sistema, basta atualizar a sua página.",
            type: "warning",
            showCancelButton: false,
            confirmButtonColor: "#8d83f3",
            confirmButtonText: "OK",
            closeOnConfirm: false
        }).then((result) => {
            document.location.reload(true);
        });
        return
    }
    if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true
        Vue.swal({
            title: "Sem Permissão",
            text: "Parece que você não tem permissão para realizar a ação atual. Contate um administrador do sistema.",
            type: "warning",
            showCancelButton: false,
            confirmButtonColor: "#8d83f3",
            confirmButtonText: "OK",
            closeOnConfirm: false
        }).then((result) => {
            window.history.back();
        });
        return
    } else if (error.response.status === 405 && !originalRequest._retry) {
        originalRequest._retry = true
        //self.$vs.loading.close();
        Vue.swal({
            title: "Upgrade necessário",
            text: error.response.data.message,
            type: "warning",
            showCancelButton: false,
            confirmButtonColor: "#8d83f3",
            confirmButtonText: "OK",
            closeOnConfirm: false
        }).then((result) => {
            document.location.reload(true);
        });
        return
    }
    // Do something with response error
    return Promise.reject(error)
})
new Vue({
    router,
    store,
    i18n,
    acl,
    render: h => h(App)
}).$mount('#app')

/*

*/
