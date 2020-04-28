/*=========================================================================================
  File Name: moduleAuth.js
  Description: Auth Module
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import state from './moduleProdutos.js'
import mutations from './moduleProdutoMutations.js'
import actions from './moduleProdutoActions.js'
import getters from './moduleProdutoGetters.js'

export default {
	namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions,
    getters: getters
}
