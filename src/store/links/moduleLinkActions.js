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
    update({commit}, dados) {
        return new Promise((resolve, reject) => {
            dados._method = 'PUT';
            axios.post(`/api/links/${dados.id}`, dados)
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
    store({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/links/`, dados)
                .then((response) => {
                    console.log('produto criado', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getId({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/links/${id}`)
                .then((response) => {
                    console.log('link resgatado', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    get({commit}) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/links`, {params: {}})
                .then((response) => {
                    console.log('produtos resgatado', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    gerarlink({commit}, dados) {
        return new Promise((resolve, reject) => {
          axios.post(`/api/link-store/`, dados)
            .then((response) => {
              console.log('link externo gerado', response);
              resolve(response)
            })
            .catch((error) => {
              reject(error)
            })
        })
      },

}
