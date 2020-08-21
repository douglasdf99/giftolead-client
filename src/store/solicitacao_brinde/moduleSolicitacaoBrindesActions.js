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
            axios.get(`/solicitacao_brindes`, {params: {}})
                .then((response) => {
                    console.log('regatadas', response);
                    resolve(response.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    aprovarVarias({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/solicitacao_brindes/${dados.rota}`, {solicitacoes: dados.arr})
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
        let rota = '/solicitacao_brindes';
        if (dados.id != null) {
            rota = '/solicitacao_brindes/' + dados.id;
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
}
