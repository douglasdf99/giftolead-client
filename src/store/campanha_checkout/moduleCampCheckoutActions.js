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
            axios.post(`/campanha_carrinhos/${dados.id}`, dados.dados)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    updateEmail(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/campanha_carrinho_emails/${dados.id}`, dados.dados)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    updateSms(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/campanha_carrinho_sms/${dados.id}`, dados.dados)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    store(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/campanha_carrinhos`, dados)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    storeEmail(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/campanha_carrinho_emails`, dados)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    storeSms(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/campanha_carrinho_sms`, dados)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getId(_, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanha_carrinhos/${id}`)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getEmails(_, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanha_carrinho_emails`, {params: {campanha_id: id}})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getEmailId(_, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanha_carrinho_emails/${id}`)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getSms(_, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanha_carrinho_sms`, {params: {campanha_id: id}})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject('erro aí', error);
                });
        });
    },
    getSmsId(_, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanha_carrinho_sms/${id}`)
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
            axios.get(`/campanha_carrinhos`, {params: {}})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getHistorico(_, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanha_carrinho_historicos`, {params: {campanha_id: dados.id, ...dados.params}})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getAgendados(_, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanha_carrinho_rastreio/${dados.id}`, {params: {campanha_id: dados.id, ...dados.params}})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    reorganizarEmails(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/campanha_carrinho_emails_posicao`, {posicoes: dados})
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    reorganizarSms(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/campanha_carrinho_sms_posicao`, {posicoes: dados})
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getContatos(_, dados) {
        return new Promise((resolve) => {
            axios.get(`/campanha_carrinho_contatos`, {params: dados.params})
                .then((response) => {
                    resolve(response.data.data);
                });
        });
    }
};
