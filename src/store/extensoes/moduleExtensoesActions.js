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
    get({commit}, subdomain) {
        if(!subdomain)
            subdomain = 'app';
        return new Promise((resolve, reject) => {
            axios.get(`/extensoes/company`, {params: {subdomain: subdomain}})
                .then((response) => {
                    console.log('extensões', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    ativa({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/extensoes/company/${dados.id}`, dados.dados)
                .then((response) => {
                    console.log('campanha alterada', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getZenviaHistorico({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/extensoes/totalvoice`, {params: dados})
                .then((response) => {
                    console.log('resposta zenvia', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}
