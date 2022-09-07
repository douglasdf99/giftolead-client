/*=========================================================================================
  File Name: moduleAuthActions.js
  Description: Auth Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import 'firebase/auth';
import axios from "@/axios.js";

export default {
    get() {
        return new Promise((resolve, reject) => {
            axios.get(`/brindes`, {params: {}})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getArraySelect() {
        return new Promise((resolve, reject) => {
            axios.get(`/selects/brindes`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getEmbalagems() {
        return new Promise((resolve, reject) => {
            axios.get(`/embalagems`)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getProdutos() {
        return new Promise((resolve, reject) => {
            axios.get(`/produtos`)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getContratos() {
        return new Promise((resolve, reject) => {
            axios.get(`/selects/correios`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getCampanhas(_, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanha_brindes`, {params: dados}).then((response) => {
                resolve(response.data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },
    getCampanha(_, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanha_brindes/${id}`).then((response) => {
                resolve(response.data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },
    storeCampanha(_, dados) {
        let rota = '/campanha_brindes';
        if (dados.id != null) {
            rota = '/campanha_brindes/' + dados.id;
            dados._method = 'PUT';
        }
        return new Promise((resolve, reject) => {
            axios.post(rota, dados).then((response) => {
                resolve(response.data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },
    storeCondicao(_, dados) {
        let rota = '/config_brindes';
        if (dados.id != null) {
            rota = '/config_brindes/' + dados.id;
            dados._method = 'PUT';
        }
        return new Promise((resolve, reject) => {
            axios.post(rota, dados).then((response) => {
                resolve(response.data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },
    deleteCondicao(_, id) {
        let dados = {};
        dados._method = 'DELETE';
        dados.id = id;
        return new Promise((resolve, reject) => {
            axios.post('/config_brindes/' + id, dados).then((response) => {
                resolve(response.data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },
};
