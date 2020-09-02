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
    get({commit}) {
        return new Promise((resolve, reject) => {
            axios.get(`/expedicaos`, {params: {}})
                .then((response) => {
                    console.log('regatadas', response);
                    resolve(response.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getId({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/expedicaos/${id}`)
                .then((response) => {
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    aprovarVarias({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/expedicaos/${dados.rota}`, {expedicaos: dados.arr})
                .then((response) => {
                    console.log('aprovadas', response);
                    resolve(response.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    store({commit}, dados) {
        let rota = '/expedicaos';
        if (dados.id != null) {
            rota = '/expedicaos/' + dados.id;
            dados._method = 'PUT';
        }
        return new Promise((resolve, reject) => {
            axios.post(rota, dados).then((response) => {
                resolve(response.data.data);
            }).catch((error) => {
                reject(error);
            });
        })
    },
    rastreio({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post("https://api.saveleads.com.br/weentrega/rastreio", dados)
                .then((response) => {
                    console.log('rastreio', response)
                    resolve(response.data);
                })
                .catch((error) => {
                    console.log('error', error)
                    reject(error)
                })
        })
    },
    imprimirEtiqueta({commit}, dados ) {
        return new Promise((resolve, reject) => {
            axios.get("expedicao/imprimiretiqueta", {params: dados, responseType: 'arraybuffer'})
                .then((response) => {
                    console.log('deu certo', response);
                    resolve(response)
                })
                .catch((error) => {
                    console.log('error', error)
                    reject(error)
                })
        })
    },

}
