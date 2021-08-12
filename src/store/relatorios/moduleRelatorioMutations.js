/*=========================================================================================
  File Name: moduleAuthMutations.js
  Description: Auth Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

export default {
    SET_LOADING(state, payload){
        state.loading = {...payload}
    },
    SET_REL_VENDAS(state, payload){
        state.vendas = {...payload}
    }
}
