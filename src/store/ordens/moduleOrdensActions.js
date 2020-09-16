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
        console.log('atualizando', dados)
        return new Promise((resolve, reject) => {
            axios.post(`/${dados.rota}/${dados.id}`, dados.dados)
                .then((response) => {
                    console.log('campanha alterada', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getId({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanhas/${id}`)
                .then((response) => {
                    console.log('campanha resgatada', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    get({commit}) {
        return new Promise((resolve, reject) => {
            axios.get(`/ordems`, {params: {}})
                .then((response) => {
                    console.log('ordems', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    payOrdens({commit}, ids){
        return new Promise((resolve, reject) => {
            axios.post(`ordems/setpago`, {ids: ids}).then(response => {
                console.log(response);
                resolve();
            }).catch(erro => {
                console.log('erro', erro);
                reject();
            })
        });
    },
    getOrdens({commit}, dados){
        return new Promise((resolve, reject) => {
            axios.get(`/ordems`, {params: dados})
                .then((response) => {
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
}
