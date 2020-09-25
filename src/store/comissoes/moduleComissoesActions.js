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
            axios.post(`/${dados.rota}/${dados.id}`, dados.dados)
                .then((response) => {
                    console.log('campanha alterada', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getId({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanhas/${id}`)
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
            axios.get(`/campanhas`, {params: {}})
                .then((response) => {
                    console.log('campanhas', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getPreCom({commit}, dados){
        return new Promise((resolve, reject) => {
            axios.get(`/pre_comissaos`, {params: dados.params})
                .then((response) => {
                    console.log('abertos', response.data)
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getCom({commit}, dados){
        return new Promise((resolve, reject) => {
            axios.get(`/comissaos`, {params: dados.params})
                .then((response) => {
                    console.log('abertos', response.data)
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    action({commit}, obj){
        console.log('array aí', obj);
        return new Promise((resolve, reject) => {
            axios.get(`pre_comissaos/${obj.method}/${obj.id}`, {params: {ids: obj.ids}}).then(response => {
                console.log(response);
                resolve();
            }).catch(erro => {
                reject(erro);
            })
        });
    },
    storeOrdens({commit}, ids){
        return new Promise((resolve, reject) => {
            axios.post(`comissaos/gerarordens`, {ids: ids}).then(response => {
                console.log(response);
                resolve();
            }).catch(erro => {
                console.log('erro', erro);
                reject();
            })
        });
    },
    searchTrans({commit}, obj){
        return new Promise((resolve, reject) => {
            axios.get(`transacaos`, {params: obj}).then(response => {
                console.log(response);
                resolve(response.data.data);
            }).catch(erro => {
                console.log('erro', erro);
                reject();
            })
        });
    },
    storeTrans({commit}, obj){
        return new Promise((resolve, reject) => {
            axios.post(`transacaos`, obj).then(response => {
                console.log(response);
                resolve();
            }).catch(erro => {
                console.log('erro', erro);
                reject();
            })
        });
    },
}
