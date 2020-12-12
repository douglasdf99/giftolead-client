/*=========================================================================================
  File Name: moduleAuthActions.js
  Description: Auth Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import axios from "@/axios.js"
import axiosRaiz from "axios"

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
    },
    storeRamal({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/extensoes/totalvoice`, dados)
                .then((response) => {
                    console.log('resposta zenvia', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    storeSlack({commit}, dados) {
        return new Promise((resolve, reject) => {
            dados._method = 'PUT';
            axios.post(`/extensoes/slack/${dados.id}`, dados)
                .then(() => {
                    resolve()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    storeMelhorEnvio({commit}, dados) {
        return new Promise((resolve, reject) => {
            dados._method = 'PUT';
            axios.post(`/extensoes/slack/${dados.id}`, dados)
                .then(() => {
                    resolve()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    updateRamal({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/extensoes/totalvoice/`, dados)
                .then((response) => {
                    console.log('resposta zenvia', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    instalar({commit}, dados){
        return new Promise((resolve, reject) => {
            axios.post(`/extensoes/company`, dados)
                .then((response) => {
                    console.log('resposta zenvia', response);
                    resolve(response.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    MelhorInfo({commit}, dados){

        return new Promise((resolve, reject) => {
          console.log('dados enviados',dados)
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
    MelhorServices({commit}, dados){
        return new Promise((resolve, reject) => {
          axios.get(`/extensoes/melhor_envio/services`, {params: dados})
            .then(response => {
              console.log('servicos Melhor envio', response.data)
              resolve(response)
            }).catch(erro => reject(erro))
        })
    },
    setPadrao({commit}, dados){
        return new Promise((resolve, reject) => {
          axios.post(`/extensoes/melhor_envio/setPadrao`, dados)
            .then(response => {
              console.log('servicos Melhor envio', response.data)
              resolve(response)
            }).catch(erro => reject(erro))
        })
    },
    deletarRamal({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.delete(`/extensoes/totalvoice/${dados.ramal_id}`, {params: dados})
                .then(response => {
                    console.log('deletado', response)
                    resolve(response)
                }).catch(erro => reject(erro))
        });
    },
    switchExt({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/extensoes/company/${dados.id}`, dados.dados)
                .then((response) => {
                    console.log('resposta zenvia', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
}
