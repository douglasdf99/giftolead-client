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
import defaultAxios from "axios"

let urlMelhorEnvio = 'https://sandbox.melhorenvio.com.br/api/v2/me';

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
        if (dados.id != null) {
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
    adicionarCarrinho({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.post(`/automacaos/adiconar_carrinho/${id}`, id)
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
            defaultAxios.defaults.headers.common = dados.config.headers
            defaultAxios.get(`${urlMelhorEnvio}`, dados.params)
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
            console.log('dados enviados', dados);
            defaultAxios.defaults.headers.common = dados.config.headers;
            defaultAxios.get(`${urlMelhorEnvio}/limits`, dados.params)
                .then((response) => {
                    console.log('resposta melhorenvio', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    calcular({commit}, dados) {
        return new Promise((resolve, reject) => {
            defaultAxios.defaults.headers.common = dados.headers;
            defaultAxios.post(`${urlMelhorEnvio}/shipment/calculate`, dados.payload)
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    saldo({commit}, dados) {
        return new Promise((resolve, reject) => {
            console.log('buscando saldo')
            defaultAxios.defaults.headers.common = dados.headers;
            defaultAxios.get(`${urlMelhorEnvio}/balance?pretty`)
                .then((response) => {
                    resolve(response.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    geraEtiqueta({commit}, dados) {
      return new Promise((resolve, reject) => {
        defaultAxios.defaults.headers.common = dados.headers;
        defaultAxios.post(`${urlMelhorEnvio}/shipment/generate`, {orders: dados.ids})
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
  imprmirMelhorEnvio({commit}, dados) {
      return new Promise((resolve, reject) => {
        defaultAxios.defaults.headers.common = dados.headers;
        defaultAxios.post(`${urlMelhorEnvio}/shipment/print`, {mode: "public",orders: dados.ids})
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    geraEtiquetas({commit}, dados) {
        return new Promise((resolve, reject) => {
            defaultAxios.defaults.headers.common = dados.headers;
            defaultAxios.post(`${urlMelhorEnvio}/shipment/generate`, {orders: dados.ids})
                .then((response) => {
                    resolve(response.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    finalizar({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/automacaos/finalizar_carrinho`, dados)
                .then((response) => {
                    resolve(response.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    removerCarrinho({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/automacaos/remover_carrinho/${dados.id}`)
                .then((response) => {
                    resolve(response.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    comprar({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post("/automacaos/comprarEtiquetas/", dados)
                .then((response) => {
                    console.log('arquivar 2', response)
                    resolve(response.data);
                })
                .catch((error) => {
                    console.log('error', error)
                    reject(error)
                })
        })
    },
    cancelar({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post("/automacaos/cancelarCompra/", dados)
                .then((response) => {
                    console.log('cancelarCompra 2', response)
                    resolve(response.data);
                })
                .catch((error) => {
                    console.log('error', error)
                    reject(error)
                })
        })
    },
}
