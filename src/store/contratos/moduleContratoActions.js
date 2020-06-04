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
            axios.post(`/api/correios/`, dados)
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
    },
    logar({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/correios-logar`, {params: dados})
                .then((response) => {
                    console.log('contrato resgatado', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    servicos({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/correios-servicos`, {params: dados})
                .then((response) => {
                    console.log('contrato servicos', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    addexcecao({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/config_correios`, dados)
                .then((response) => {
                    console.log('contrato excecao', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    editexcecao({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.put(`/api/config_correios/${dados.id}`, dados)
                .then((response) => {
                    console.log('contrato excecao', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    removeexcecao({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.delete(`/api/config_correios/${dados}`, dados)
                .then((response) => {
                    console.log('contrato excecao', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    ativar({commit}, dados){
        return new Promise((resolve, reject) => {
            axios.get(`/api/correios-${dados.rota}/${dados.id}`)
                .then((response) => {
                    console.log('contrato ativado', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}
