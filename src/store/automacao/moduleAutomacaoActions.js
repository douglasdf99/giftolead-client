/*=========================================================================================
  File Name: moduleAuthActions.js
  Description: Auth Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import 'firebase/auth'
import axios from "@/axios.js"

export default {
    get({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/automacaos`, {params: dados})
                .then((response) => {
                    console.log('lista atomacao', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    storeEmail({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/automacao_emails`, dados)
                .then((response) => {
                    console.log('email criado', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getEmails({commit}) {
        return new Promise((resolve, reject) => {
            axios.get(`/automacao_emails`, {params: {}})
                .then((response) => {
                    console.log('emails resgatados', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getEmailId({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/automacao_emails/${id}`)
                .then((response) => {
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}