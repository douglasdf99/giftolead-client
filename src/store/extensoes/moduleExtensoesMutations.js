/*=========================================================================================
  File Name: moduleAuthMutations.js
  Description: Auth Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

export default {
  SET_CAMPANHA(state, item) {
    state.campanha = item;
  },
  UPDATE_EMPRESA(state, empresa) {
    state.empresa = empresa;
  },
  UPDATE_EXTENSIONS_COMPANY(state, data) {
    state.extensoes = data;
  }
};
