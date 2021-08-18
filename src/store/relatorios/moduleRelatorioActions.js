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
    get({commit}, payload) {
        commit('SET_LOADING', {vendas: true})
        return new Promise((resolve, reject) => {
            axios.get(`/${payload.route}`, {params: payload})
                .then((response) => {
                    commit('SET_REL_VENDAS', response.data)
                    resolve()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
}