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
    setAnexos({commit}, obj) {
        return new Promise((resolve, reject) => {
            axios.post(`/pre_comissaos/setAnexo/`, obj)
                .then((response) => {
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    removeImagem({commit}, id) {
        const formData = new FormData();
        formData.append('_method', 'DELETE');
        formData.append('id', id);
        return new Promise((resolve, reject) => {
            axios.post(`/anexos/${id}`, formData)
                .then((response) => {
                    resolve()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}
