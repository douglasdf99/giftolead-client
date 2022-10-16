import VueEcho from 'vue-echo-laravel';
import * as io from 'socket.io-client';
import Vue from 'vue';
// import { VueHotmartCosmos } from '@/plugins/hotmart';

import App from "./App.vue";
import axios from "./axios.js";
import "./http/requests";
import "./fake-db/index.js";
import "../themeConfig.js";
import VueTheMask from "vue-the-mask";
import "@/firebase/firebaseConfig";


import { VueMaskFilter } from "v-mask";
import money from "v-money";
import VueSimpleContextMenu from "vue-simple-context-menu";
import "./globalComponents.js";
import "./assets/fontawesome/icons.js";
import router from "./router";
import store from "./store/store";
import i18n from "./i18n/i18n";
import "./filters/filters";
import VueClipboard from "vue-clipboard2";
// import VueTour from 'vue-tour';
import VeeValidate from "vee-validate";
import { register } from "./util/features";
import * as VueGoogleMaps from "vue2-google-maps";

import { VueHammer } from "vue2-hammer";
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";

import VueMoment from "vue-moment";
import saveleadsConfig from "../saveleadsConfig";
import VueSweetalert2 from "vue-sweetalert2";
import methods from "@/globalMethods";

import "material-icons/iconfont/material-icons.css";
import "vuesax/dist/vuesax.css";
import "./assets/scss/main.scss";
import "./assets/css/base.css";
import "@/assets/css/main.css";

window.io = io;

require("vue-tour/dist/vue-tour.css");
register([]);


// Vue.use(VueHotmartCAS);
// Vue.use(VueHotmartCosmos);

Vue.prototype.$http = axios;



let acl = {};
	acl = require('./acl/acl');

Vue.use(VueTheMask);
Vue.filter("VMask", VueMaskFilter);
Vue.use(money, { precision: 4 });
Vue.component("vue-simple-context-menu", VueSimpleContextMenu);
Vue.use(VueClipboard);
// Vue.use(VueTour);
Vue.use(VeeValidate);
Vue.use(VueGoogleMaps, {
	load: {
		key: "YOUR_API_KEY",
		libraries: "places",
	},
});
Vue.use(VueHammer);
Vue.mixin({
	methods: { ...methods },
});
Vue.use(VueEcho, {
	broadcaster: "socket.io",
	host: saveleadsConfig.url_socket,
	auth: {
		headers: {
			Authorization: `Bearer ${store.getters.getToken}`,
		},
	},
});

const moment = require("moment/moment");
require("moment/locale/pt-br");
Vue.use(VueMoment, {
	moment,
});

Vue.filter("formatDate", function (value) {
	if (value) {
		return moment(String(value)).format("DD/MM/YYYY");
	}
});

Vue.filter("formatDateTime", function (value) {
	if (value) {
		return moment(String(value)).format("DD/MM/YYYY H:mm");
	}
});
Vue.filter("formatDateTimeMili", function (value) {
	if (value) {
		return moment(value).format("DD/MM/YYYY H:mm");
	}
});

Vue.filter("formatDateHumanize", function (value) {
	if (value) {
		let end = moment();
		value = moment(value);
		return moment.duration(end.diff(value)).humanize();
	}
});

Vue.filter("showDateMonth", function (value) {
	if (value) {
		return moment(String(value)).format("MMM YYYY");
	}
});
Vue.prototype.$setLaravelValidationErrorsFromResponse = function(errorResponse) {
	// only allow this function to be run if the validator exists
	if (!this.hasOwnProperty('$validator')) {
		return;
	}

	// clear errors
	this.$validator.errors.clear();

	let errorFields = Object.keys(errorResponse);
	// insert laravel errors
	for (let i = 0; i < errorFields.length; i++) {
		let field = errorFields[i];

		let errorString = errorResponse[field].join(', ');
		this.$validator.errors.add({ field: field, msg: errorString });
	}
};

// Feather font icon
require("./assets/css/iconfont.css");

Vue.config.productionTip = false;
Vue.use(VueSweetalert2);

new Vue({
	store,
	router,
	i18n,
	acl,
	name: "Saleads-Root-Name",
	render: (h) => h(App),
}).$mount("#app");
