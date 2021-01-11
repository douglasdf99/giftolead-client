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
import axiosRaiz from "axios"

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
        let rota = '/automacao_emails/';
        if(dados.id != null){
            dados._method = 'PUT';
            rota += dados.id;
        }
        return new Promise((resolve, reject) => {
            axios.post(rota, dados)
                .then((response) => {
                    console.log('email criado', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getEmails({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/automacao_emails`, {params: {brinde_id: id}})
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
    },
    store({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/automacaos`, dados)
                .then((response) => {
                    console.log('Automacao inserida', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    deleteItem({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/automacaos/arquivar/${id}`)
                .then((response) => {
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    restaurarItem({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/automacaos/restaurar/${id}`)
                .then((response) => {
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    enviarEmail({commit}, obj) {
        return new Promise((resolve, reject) => {
            axios.post(`/automacao_enviar_email`, obj)
                .then((response) => {
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
  adiconarCarrinho({commit}, obj) {
        return new Promise((resolve, reject) => {
            axios.post(`/automacaos/adiconar_carrinho/${obj}`, obj)
                .then((response) => {
                    resolve(response.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
  login({commit}, dados) {
    return new Promise((resolve, reject) => {
      console.log('dados enviados', dados)
      axiosRaiz.defaults.headers.common = dados.config.headers
      axiosRaiz.get(`https://www.melhorenvio.com.br/api/v2/me`, dados.params)
        .then((response) => {
          console.log('resposta melhorenvio', response);
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  verificaLimite({commit}, dados) {
    return new Promise((resolve, reject) => {
      console.log('dados enviados', dados)
      axiosRaiz.defaults.headers.common = dados.config.headers
      axiosRaiz.get(`https://www.melhorenvio.com.br/api/v2/me/limits`, dados.params)
        .then((response) => {
          console.log('resposta melhorenvio', response);
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}
