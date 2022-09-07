/*=========================================================================================
  File Name: moduleAuthMutations.js
  Description: Auth Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

export default {
  SET_EMPRESA(state, empresa) {
    state.empresa = empresa;
  },
  UPDATE_EMPRESA(state, empresa) {
    state.empresa = empresa;
  },
  SET_USERS(state, users) {
    state.users = users;
  },
  SET_USER(state, user) {
    state.users.unshift(user);
  },
  REMOVE_USER(state, id) {
    state.users = state.users.filter((item)=>{
      return item.id != id;
    }
  );}
};
