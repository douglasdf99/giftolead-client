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
            axios.post(`/api/campanha_carrinhos/${dados.id}`, dados.dados)
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
            axios.post(`/api/campanha_carrinho_emails/${dados.id}`, dados.dados)
                .then((response) => {
                    console.log('email alterado', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    updateSms({commit}, dados) {
        console.log('atualizando', dados)
        return new Promise((resolve, reject) => {
            axios.post(`/api/campanha_carrinho_sms/${dados.id}`, dados.dados)
                .then((response) => {
                    console.log('sms alterado', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    store({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/campanha_carrinhos`, dados)
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
            axios.post(`/api/campanha_carrinho_emails`, dados)
                .then((response) => {
                    console.log('email criado', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    storeSms({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/campanha_carrinho_sms`, dados)
                .then((response) => {
                    console.log('sms criado', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getId({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/campanha_carrinhos/${id}`)
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
            axios.get(`/api/campanha_carrinho_emails`, {params: {campanha_id: id}})
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
            axios.get(`/api/campanha_carrinho_emails/${id}`)
                .then((response) => {
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getSms({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/campanha_carrinho_sms`, {params: {campanha_id: id}})
                .then((response) => {
                    console.log('emails resgatados', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getSmsId({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/campanha_carrinho_sms/${id}`)
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
            axios.get(`/api/campanha_carrinhos`, {params: {}})
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
            axios.get(`/api/campanha_carrinho_historicos`, {params: {campanha_id: dados.id, ...dados.params}})
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
            axios.post(`/api/campanha_carrinho_emails_posicao`, {posicoes: dados})
                .then((response) => {
                    console.log('posição atualizada', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    reorganizarSms({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/campanha_carrinho_sms_posicao`, {posicoes: dados})
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
            axios.get(`/api/campanha_carrinho_contatos`, {params: dados.params})
                .then((response) => {
                    console.log('contatos resgatado', response);
                    resolve(response.data.data)
                })
        });
    }
}
