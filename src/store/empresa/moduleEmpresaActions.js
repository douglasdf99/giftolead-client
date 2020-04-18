/*=========================================================================================
  File Name: moduleAuthActions.js
  Description: Auth Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import axios from "@/axios.js"

export default {
  getEmpresa({commit}, dados) {
    return new Promise((resolve, reject) => {
      axios.get("/api/empresas", {params: dados})
        .then((response) => {
          console.log('empresa', response);
          commit('SET_EMPRESA', response.data.data);
          resolve(response.data.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateEmpresa({commit}, dados) {
    return new Promise((resolve, reject) => {
      axios.post(`/api/empresas/${dados.id}`, dados.dados)
        .then((response) => {
          console.log('empresa alterada', response);
          commit('UPDATE_EMPRESA', response.data.data);
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

}
