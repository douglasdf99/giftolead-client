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
            axios.post(`/api/correios/${dados.id}`, dados.dados)
                .then((response) => {
                    console.log('contrato alterada', response);
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
            axios.post(`/api/correios/`, dados.dados)
                .then((response) => {
                    console.log('contrato criado', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getId({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/correios/${id}`)
                .then((response) => {
                    console.log('contrato resgatado', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

}
