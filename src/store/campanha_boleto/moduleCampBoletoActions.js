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
            axios.post(`/api/campanha_boletos/${dados.id}`, dados.dados)
                .then((response) => {
                    console.log('campanha alterada', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    updateEmail({commit}, dados) {
        console.log('atualizando', dados)
        return new Promise((resolve, reject) => {
            axios.post(`/api/campanha_boleto_emails/${dados.id}`, dados.dados)
                .then((response) => {
                    console.log('email alterado', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    store({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/campanha_boletos`, dados)
                .then((response) => {
                    console.log('campanha criada', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    storeEmail({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/campanha_boleto_emails`, dados)
                .then((response) => {
                    console.log('email criado', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getId({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/campanha_boletos/${id}`)
                .then((response) => {
                    console.log('campanha resgatada', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getEmails({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/campanha_boleto_emails`, {params: {campanha_id: id}})
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
            axios.get(`/api/campanha_boleto_emails/${id}`)
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
            axios.get(`/api/campanha_boletos`, {params: {}})
                .then((response) => {
                    console.log('campanhas', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getHistorico({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/campanha_boleto_historicos`, {params: {campanha_id: dados.id, ...dados.params}})
                .then((response) => {
                    console.log('histórico resgatado', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    reorganizarEmails({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/campanha_boleto_emails_posicao`, {posicoes: dados})
                .then((response) => {
                    console.log('posição atualizada', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getContatos({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/campanha_boleto_contatos`, {params: dados.params})
                .then((response) => {
                    console.log('contatos resgatado', response);
                    resolve(response.data.data)
                })
        });
    }
}