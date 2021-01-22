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
            axios.post(`/campanha_boletos/${dados.id}`, dados.dados)
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    updateEmail({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/campanha_boleto_emails/${dados.id}`, dados.dados)
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    updateSms({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/campanha_boleto_sms/${dados.id}`, dados.dados)
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    store({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/campanha_boletos`, dados)
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    storeEmail({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/campanha_boleto_emails`, dados)
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    storeSms({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/campanha_boleto_sms`, dados)
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getId({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanha_boletos/${id}`)
                .then((response) => {
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getEmails({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanha_boleto_emails`, {params: {campanha_id: id}})
                .then((response) => {
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getEmailId({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanha_boleto_emails/${id}`)
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
            axios.get(`/campanha_boleto_sms`, {params: {campanha_id: id}})
                .then((response) => {
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getSmsId({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanha_boleto_sms/${id}`)
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
            axios.get(`/campanha_boletos`, {params: {}})
                .then((response) => {
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getHistorico({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanha_boleto_historicos`, {params: {campanha_id: dados.id, ...dados.params}})
                .then((response) => {
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    reorganizarEmails({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/campanha_boleto_emails_posicao`, {posicoes: dados})
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    reorganizarSms({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/campanha_boleto_sms_posicao`, {posicoes: dados})
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getContatos({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanha_boleto_contatos`, {params: dados.params})
                .then((response) => {
                    resolve(response.data.data)
                })
        });
    }
}
