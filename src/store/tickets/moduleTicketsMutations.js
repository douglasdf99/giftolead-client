/*=========================================================================================
  File Name: moduleAuthMutations.js
  Description: Auth Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import axios from "../../http/axios/index.js"

export default {
    SET_ROTA_ATUAL(state, val){
        state.rotaAtual = val;
    },
    PUSH_MSG(state, dados) {
        state.chatData.msg.push(dados);
    },
    EMPTY_CHAT(state){
        state.chatData.msg = [];
    },
    SET_TICKET_VERIFICADO(state, val){
        state.ticketVerificado = val;
    }
}
