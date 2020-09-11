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
            axios.get(`/campanhas`, {params: {}})
                .then((response) => {
                    console.log('campanhas', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getPreCom({commit}, dados){
        return new Promise((resolve, reject) => {
            axios.get(`/pre_comissaos`, {params: dados.params})
                .then((response) => {
                    console.log('abertos', response.data)
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getCom({commit}, dados){
        return new Promise((resolve, reject) => {
            axios.get(`/comissaos`, {params: dados.params})
                .then((response) => {
                    console.log('abertos', response.data)
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    action({commit}, obj){
        return new Promise((resolve, reject) => {
            axios.get(`pre_comissaos/${obj.method}/${obj.id}`).then(response => {
                console.log(response);
                resolve();
            }).catch(erro => {
                console.log('erro', erro);
                reject();
            })
        });
    }
}
