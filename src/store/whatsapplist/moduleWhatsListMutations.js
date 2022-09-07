/*=========================================================================================
  File Name: moduleAuthMutations.js
  Description: Auth Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

export default {
    SET_FILTER(state, val) {
        state.campanha_whatsapp = val;
    },
    PUSH_MSG(state, dados) {
        state.chatData.msg.push(dados);
    },
    EMPTY_CHAT(state) {
        state.chatData.msg = [];
    }
};
