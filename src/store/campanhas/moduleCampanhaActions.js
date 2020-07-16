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
            axios.post(`/api/${dados.rota}/${dados.id}`, dados.dados)
                .then((response) => {
                    console.log('campanha alterada', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    store({commit}, dados) {
        let rota = '';
        switch (dados.tipo) {
            case 'checkout':
                rota = 'campanha_carrinhos';
                break;
            case 'cancelado':
                dados.status = 0;
                rota = 'campanha_cancelados';
                break;
            case 'whatsapp':
                rota = 'campanha_whatsapps';
                break;
            case 'boleto':
                rota = 'campanha_boletos';
                break;
            case 'agendamento':
                rota = 'campanha_agendamentos';
                break;
        }
        return new Promise((resolve, reject) => {
            axios.post(`/api/${rota}`, dados)
                .then((response) => {
                    console.log('campanha criada', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getId({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/campanhas/${id}`)
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
            axios.get(`/api/campanhas`, {params: {}})
                .then((response) => {
                    console.log('campanhas', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    ativaEspecifica({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/${dados.rota}/`, dados)
                .then((response) => {
                    console.log('campanha alterada', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
}
