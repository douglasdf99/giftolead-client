/*=========================================================================================
  File Name: moduleAuthActions.js
  Description: Auth Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import axios from "@/axios.js";

export default {
    update(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/${dados.rota}/${dados.id}`, dados.dados)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    store(_, dados) {
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
            axios.post(`/${rota}`, dados)
                .then((response) => {
                    if(response != undefined)
                        resolve(response);
                    else
                        reject(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getId(_, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanhas/${id}`)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    get() {
        return new Promise((resolve, reject) => {
            axios.get(`/campanhas`, {params: {}})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    ativaEspecifica(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/${dados.rota}/`, dados)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
};
