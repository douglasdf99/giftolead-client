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
            axios.post(`/campanha_whatsapps/${dados.id}`, dados.dados)
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    updateEmail({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/campanha_carrinho_emails/${dados.id}`, dados.dados)
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    store({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/campanha_whatsapps`, dados)
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    storeEmail({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/campanha_carrinho_emails`, dados)
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getId({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanha_whatsapps/${id}`)
                .then((response) => {
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    get({commit}) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanha_whatsapps`, {params: {}})
                .then((response) => {
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getContatos({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanha_whatsapps_contatos`, {params: dados.params})
                .then((response) => {
                    resolve(response.data.data)
                })
        });
    }
}
