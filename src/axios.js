import axios from "axios";
// import Vue from 'vue';
import store from "./store/store";
import saveleadsConfig from "../saveleadsConfig";
import router from "./router";
import { removeCompanyContext } from "./components/producer";

let headers = {};
if (store.getters.getToken)
	headers = { Authorization: `Bearer ${store.getters.getToken}` };

const instance = axios.create({
	headers,
});
instance.interceptors.request.use((config) => {
	config.baseURL = changeBaseUrl();
	return config;
});
instance.interceptors.response.use(
	(response) => {
		// intercept the global error
		return response;
	},
	function (error) {
		let originalRequest = error.config;

		if (error.response.status === 404) {
			// if the error is 401 and hasent already been retried
			originalRequest._retry = true;
			if (
				error.response.data &&
				error.response.data.error == "company.not_found"
			) {
				router.push("/404-company");
			}
			//return;
		}

		if (error.response.status === 401 && !originalRequest._retry) {
			if (
				error.response.data &&
				error.response.data.message == "Unauthenticated."
			) {
				router.push("/login");
			}
			originalRequest._retry = true;
			// return;
		}
		if (error.response.status === 429 && !originalRequest._retry) {
			originalRequest._retry = true;
			// Vue.swal({
			//   title: "Muitas requisições em um curto periodo",
			//   text: "Identificamos uma grande quantidade de requisições em um curto periodo, por isso sua últioma requisição foi interrompida por questões de segurança, para continuar a utilizar o sistema, basta atualizar a sua página.",
			//   type: "warning",
			//   showCancelButton: false,
			//   confirmButtonColor: "#8d83f3",
			//   confirmButtonText: "OK",
			//   closeOnConfirm: false
			// }).then(() => {
			//   document.location.reload(true);
			// });
			return;
		}

		if (error.response.status === 403 && !originalRequest._retry) {
			if (error.response.data.error == "not.access.in.company") {
				router.push("/company-not-authorized");
			} else {
				router.push("/nao-autorizado");
			}

			originalRequest._retry = true;
			// Vue.swal({
			//   title: "Sem Permissão",
			//   text: "Parece que você não tem permissão para realizar a ação atual. Contate um administrador do sistema.",
			//   type: "warning",
			//   showCancelButton: false,
			//   confirmButtonColor: "#8d83f3",
			//   confirmButtonText: "OK",
			//   closeOnConfirm: false
			// }).then(() => {
			//   window.history.back();
			// });
			return;
		} else if (error.response.status === 405 && !originalRequest._retry) {
			originalRequest._retry = true;
			//self.$vs.loading.close();
			// Vue.swal({
			//   title: "Upgrade necessário",
			//   text: error.response.data.message,
			//   type: "warning",
			//   showCancelButton: false,
			//   confirmButtonColor: "#8d83f3",
			//   confirmButtonText: "OK",
			//   closeOnConfirm: false
			// }).then(() => {
			//   document.location.reload(true);
			// });
			return;
		} else if (error.response.status === 500 && !originalRequest._retry) {
			originalRequest._retry = true;
			// router.push({ name: "page-error-500" });
		}
		// Do something with response error
		return Promise.reject(error);
	}
);

export default instance;

export const changeBaseUrl = (identity) => {
	if (identity) {
		saveleadsConfig.identity = identity;
	}
  if (saveleadsConfig.identity == 'master') {
    removeCompanyContext();
  }

	let baseURL = saveleadsConfig.url_api + saveleadsConfig.identity;
	return baseURL;
};
