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
        return new Promise((resolve, reject) => {
            axios.put(`/confignotifications/1`, dados)
                .then((response) => {
                    console.log('usuário alterado', response);
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getId({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/notifications/1`)
                .then((response) => {
                    console.log('produto resgatado', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    get({commit}) {
        return new Promise((resolve, reject) => {
            axios.get(`/notifications/nlidas`)
                .then((response) => {
                    console.log('notificações', response);
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error)
                })
        });
    },
    getAll({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/notifications/todas`, {params: dados})
                .then((response) => {
                    console.log('notificações', response);
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error)
                })
        });
    },
    setread({commit}) {
        return new Promise((resolve, reject) => {
            axios.get(`/notifications/setlidas`)
                .then((response) => {
                    console.log('notificações', response);
                    resolve();
                })
                .catch((error) => {
                    console.log('erro', error);
                    reject()
                })
        });
    }
}
