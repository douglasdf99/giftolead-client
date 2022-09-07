/*=========================================================================================
  File Name: moduleAuthActions.js
  Description: Auth Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import axios,  {changeBaseUrl}  from "@/axios.js";

export default {
    getData(_, dados) {
        return new Promise((resolve, reject) => {
            changeBaseUrl();
            axios.get(`dashboard/${dados.rota}`, {params: dados.params})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
};
