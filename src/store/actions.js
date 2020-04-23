/*=========================================================================================
  File Name: actions.js
  Description: Vuex Store - actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import axios from "@/axios.js"

const actions = {

    // /////////////////////////////////////////////
    // COMPONENTS
    // /////////////////////////////////////////////

    // Vertical NavMenu
    updateVerticalNavMenuWidth({ commit }, width) {
      commit('UPDATE_VERTICAL_NAV_MENU_WIDTH', width)
    },

    // VxAutoSuggest
    updateStarredPage({ commit }, payload) {
      commit('UPDATE_STARRED_PAGE', payload)
    },

    // The Navbar
    arrangeStarredPagesLimited({ commit }, list) {
      commit('ARRANGE_STARRED_PAGES_LIMITED', list)
    },
    arrangeStarredPagesMore({ commit }, list) {
      commit('ARRANGE_STARRED_PAGES_MORE', list)
    },

    // /////////////////////////////////////////////
    // UI
    // /////////////////////////////////////////////

    toggleContentOverlay({ commit }) {
      commit('TOGGLE_CONTENT_OVERLAY')
    },
    updateTheme({ commit }, val) {
      commit('UPDATE_THEME', val)
    },

    // /////////////////////////////////////////////
    // User/Account
    // /////////////////////////////////////////////

    updateUserInfo({ commit }, payload) {
      commit('UPDATE_USER_INFO', payload)
    },
    updateUserRole({ dispatch }, payload) {
      // Change client side
      payload.aclChangeRole(payload.userRole)

      // Make API call to server for changing role

      // Change userInfo in localStorage and store
      dispatch('updateUserInfo', {userRole: payload.userRole})
    },

    ativarMenu( {commit}, e){
        commit('CHANGE_MENU', e);
    },
    submenu({commit}, obj) {
        commit('SET_OBJ_SUBMENU', obj)
        localStorage.setItem('submenu', JSON.stringify(obj))
    },

    /* CRUD básico */
    getVarios({commit}, rota){
        return new Promise((resolve, reject) => {
            axios.get(`/api/${rota}`)
                .then((response) => {
                    console.log('retorno', response)
                    commit('SET_VARIOS', response.data.data);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    addItem({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/${dados.rota}`, dados.item)
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    updateItem({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.put(`/api/${dados.rota}/${dados.item.id}`, dados.item)
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    delete({commit}, dados){
        let obj = {id: dados.id, _method: 'DELETE'}
        return new Promise((resolve, reject) => {
            axios.post(`/api/${dados.rota}/${dados.id}`, obj)
                .then(response => resolve(response)).catch(erro => reject(erro))
        });
    }
    /* Fim*/
};

export default actions
