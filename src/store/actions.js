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
    updateVerticalNavMenuWidth({commit}, width) {
        commit('UPDATE_VERTICAL_NAV_MENU_WIDTH', width)
    },

    // VxAutoSuggest
    updateStarredPage({commit}, payload) {
        commit('UPDATE_STARRED_PAGE', payload)
    },

    // The Navbar
    arrangeStarredPagesLimited({commit}, list) {
        commit('ARRANGE_STARRED_PAGES_LIMITED', list)
    },
    arrangeStarredPagesMore({commit}, list) {
        commit('ARRANGE_STARRED_PAGES_MORE', list)
    },

    // /////////////////////////////////////////////
    // UI
    // /////////////////////////////////////////////

    toggleContentOverlay({commit}) {
        commit('TOGGLE_CONTENT_OVERLAY')
    },
    updateTheme({commit}, val) {
        commit('UPDATE_THEME', val)
    },

    // /////////////////////////////////////////////
    // User/Account
    // /////////////////////////////////////////////

    updateUserInfo({commit}, payload) {
        commit('UPDATE_USER_INFO', payload)
    },
    updateUserRole({dispatch}, payload) {
        // Change client side
        payload.aclChangeRole(payload.userRole)

        // Make API call to server for changing role

        // Change userInfo in localStorage and store
        dispatch('updateUserInfo', {userRole: payload.userRole})
    },

    ativarMenu({commit}, e) {
        commit('CHANGE_MENU', e);
    },
    submenu({commit}, obj) {
        commit('SET_OBJ_SUBMENU', obj)
        localStorage.setItem('submenu', JSON.stringify(obj))
    },

  selectResponsaveis({commit},) {
    return new Promise((resolve, reject) => {
      axios.get(`/selects/responsaveis`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
    /* CRUD básico */
    getVarios({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/${dados.rota}`, {params: dados.params})
                .then((response) => {
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
            axios.post(`/${dados.rota}`, dados.item)
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
            axios.put(`/${dados.rota}/${dados.item.id}`, dados.item)
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    deleteItem({commit}, dados) {
        const formData = new FormData();
        formData.append('_method', 'DELETE');
        formData.append('id', dados.id);
        return new Promise((resolve, reject) => {
            axios.post(`/${dados.rota}/${dados.id}`, formData)
                .then(response => resolve(response)).catch(erro => reject(erro))
        });
    },
    /* Fim*/
    getLinks({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/links`, {params: {produto: id}})
                .then((response) => {
                    resolve(response.data.data)
                })
                .catch(erro => {
                    reject(erro)
                });
        });
    },
    /* Fim*/
    getLinksCamp({commit}, params) {
        return new Promise((resolve, reject) => {
            axios.get(`/links`, {params: params})
                .then((response) => {
                    resolve(response.data.data)
                })
                .catch(erro => {
                    reject(erro)
                });
        });
    },
    globalSearchParams({commit}, val) {
        return new Promise((resolve) => {
            commit('SET_GLOBAL_SEARCH', val)
            resolve();
        });
    },
    getMainMenu({commit}){
        return new Promise((resolve, reject) => {
            axios.get('/menus').then(response => {
                resolve(response.data.data)
            }).catch(erro => {reject(erro)});
        })
    },
    setExtensao({commit}, extensao) {
        commit('SET_EXTENSAO', extensao)
    },
};

export default actions
