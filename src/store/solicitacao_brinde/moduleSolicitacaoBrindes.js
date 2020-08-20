/*=========================================================================================
  File Name: moduleAuth.js
  Description: Auth Module
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import state from './moduleSolicitacaoBrindesState.js'
import mutations from './moduleSolicitacaoBrindesMutations.js'
import actions from './moduleSolicitacaoBrindesActions.js'
import getters from './moduleSolicitacaoBrindesGetters.js'

export default {
	namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions,
    getters: getters
}
