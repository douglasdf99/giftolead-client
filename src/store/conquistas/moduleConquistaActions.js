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
    updateProduto({commit}, dados) {
        return new Promise((resolve, reject) => {
            dados._method = 'PUT';
            axios.post(`/api/produtos/${dados.id}`, dados)
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
    storeProduto({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/produtos/`, dados)
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
            axios.get(`/api/produtos/${id}`)
                .then((response) => {
                    console.log('produto resgatado', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    get({commit}) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/produtos`, {params: {}})
                .then((response) => {
                    console.log('produtos resgatado', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },

}
