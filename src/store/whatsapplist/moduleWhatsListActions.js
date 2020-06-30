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
    getId({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/whatsapplists/${id}`)
                .then((response) => {
                    console.log('lista resgatada', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    get({commit}) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/whatsapplists`, {params: {status: 1}})
                .then((response) => {
                    console.log('lista resgatado', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    setFilter({commit}, val){
        return new Promise((resolve, reject) => {
            commit('SET_FILTER', val);
            resolve()
        })
    },
    getVarios({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/whatsapplists`, {params: dados})
                .then((response) => {
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getCampanhas({commit}, val) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/${val}`, {params: {}})
                .then((response) => {
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}
