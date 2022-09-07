/*=========================================================================================
  File Name: moduleAuthActions.js
  Description: Auth Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import axios from "@/axios.js";

export default {
	//Old
	getEmpresa({commit}, dados) {
		return new Promise((resolve, reject) => {
			axios.get("/empresas", {params: dados})
				.then((response) => {
					commit('SET_EMPRESA', response.data.data);
					resolve(response.data.data);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},
	updateEmpresa({commit}, dados) {
		return new Promise((resolve, reject) => {
			axios.post(`/empresas/${dados.id}`, dados.dados)
				.then((response) => {
					commit('UPDATE_EMPRESA', response.data.data);
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	//New
	getMyCompany({commit}, dados) {
		return new Promise((resolve, reject) => {
			axios.get("/my_company", {params: dados})
				.then((response) => {
					commit('SET_EMPRESA', response.data);
					resolve(response.data);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},
	getMyPlan() {
		return new Promise((resolve, reject) => {
			axios.get("/my_plan").then(response => {
					resolve(response.data);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},
	updateCompany({commit}, dados) {
		return new Promise((resolve, reject) => {
			axios.post(`/my_company`, dados)
				.then((response) => {
					commit('UPDATE_EMPRESA', response.data.data);
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},
};
