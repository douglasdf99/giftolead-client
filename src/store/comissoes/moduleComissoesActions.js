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
    getPreCom(_, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/pre_comissaos`, {params: dados.params})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getCom(_, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/comissaos`, {params: dados.params})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    action(_, obj) {
        return new Promise((resolve, reject) => {
            axios.get(`pre_comissaos/${obj.method}/${obj.id}`, {params: {ids: obj.ids}}).then(() => {
                resolve();
            }).catch(erro => {
                reject(erro);
            });
        });
    },
    diagnosticar(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`pre_comissao_diagnosticos`, dados).then(response => {
                resolve(response.data);
            }).catch(erro => {
                reject(erro);
            });
        });
    },
    storeOrdens(_, ids) {
        return new Promise((resolve, reject) => {
            axios.post(`comissaos/gerarordens`, {ids: ids}).then(() => {
                resolve();
            }).catch(erro => {
                reject(erro);
            });
        });
    },
    searchTrans(_, obj) {
        return new Promise((resolve, reject) => {
            axios.get(`transacaos`, {params: obj}).then(response => {
                resolve(response.data.data);
            }).catch(erro => {
                reject(erro);
            });
        });
    },
    storeTrans(_, obj) {
        return new Promise((resolve, reject) => {
            axios.post(`transacaos`, obj).then(() => {
                resolve();
            }).catch(erro => {
                reject(erro);
            });
        });
    },
};
