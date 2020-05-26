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
            axios.post(`/api/conquistas/${dados.id}`, dados)
                .then((response) => {
                    console.log('conquista alterada', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    store({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/conquistas/`, dados)
                .then((response) => {
                    console.log('conquista criada', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getId({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/conquistas/${id}`)
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
            axios.get(`/api/conquistas`, {params: {}})
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
