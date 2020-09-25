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
    comissoes({commit}){
        return new Promise((resolve, reject) => {
            axios.get('dashboard/comissaos')
                .then((response) => {
                    console.log('comissões', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    porProduto({commit}, datas){
        return new Promise((resolve, reject) => {
            axios.get('dashboard/dados_venda_por_produto', {params: datas})
                .then((response) => {
                    console.log('vendas por produto', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    meusTickets({commit}, datas){
        return new Promise((resolve, reject) => {
            axios.get('dashboard/meus_tickets', {params: datas})
                .then((response) => {
                    console.log('meus tickets', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}
