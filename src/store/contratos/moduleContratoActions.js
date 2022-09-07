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
    update({commit}, dados) {
        return new Promise((resolve, reject) => {
            dados._method = 'PUT';
            axios.post(`/correios/${dados.id}`, dados.dados)
                .then((response) => {
                    commit('UPDATE_EMPRESA', response.data.data);
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    store(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/correios/`, dados)
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
            axios.get(`/correios/${id}`)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    logar(_, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/correios-logar`, {params: dados})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    logarind(_, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/correios-logarind`, {params: dados})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    servicos(_, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/correios-servicos`, {params: dados})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    addexcecao(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/config_correios`, dados)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    editexcecao(_, dados) {
        return new Promise((resolve, reject) => {
            axios.put(`/config_correios/${dados.id}`, dados)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    removeexcecao(_, dados) {
        return new Promise((resolve, reject) => {
            axios.delete(`/config_correios/${dados}`, dados)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    ativar(_, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/correios-${dados.rota}/${dados.id}`)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    get(_, params) {
        return new Promise((resolve, reject) => {
            axios.get(`/correios`, params)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
};
