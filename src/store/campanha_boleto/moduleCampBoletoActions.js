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
            axios.post(`/campanha_boletos/${dados.id}`, dados.dados)
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
            axios.post(`/campanha_boleto_emails/${dados.id}`, dados.dados)
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
            axios.post(`/campanha_boleto_sms/${dados.id}`, dados.dados)
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
            axios.post(`/campanha_boletos`, dados)
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
            axios.post(`/campanha_boleto_emails`, dados)
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
            axios.post(`/campanha_boleto_sms`, dados)
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
            axios.get(`/campanha_boletos/${id}`)
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
            axios.get(`/campanha_boleto_emails`, {params: {campanha_id: id}})
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
            axios.get(`/campanha_boleto_emails/${id}`)
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
            axios.get(`/campanha_boleto_sms`, {params: {campanha_id: id}})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getSmsId(_, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanha_boleto_sms/${id}`)
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
            axios.get(`/campanha_boletos`, {params: {}})
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
            axios.get(`/campanha_boleto_historicos`, {params: {campanha_id: dados.id, ...dados.params}})
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
      axios.get(`/campanha_boleto_rastreio/${dados.id}`, {params: {campanha_id: dados.id, ...dados.params}})
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
            axios.post(`/campanha_boleto_emails_posicao`, {posicoes: dados})
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
            axios.post(`/campanha_boleto_sms_posicao`, {posicoes: dados})
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
            axios.get(`/campanha_boleto_contatos`, {params: dados.params})
                .then((response) => {
                    resolve(response.data.data);
                });
        });
    }
};
