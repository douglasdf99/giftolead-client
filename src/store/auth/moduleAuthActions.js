/*=========================================================================================
  File Name: moduleAuthActions.js
  Description: Auth Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import jwt from "../../http/requests/auth/jwt/index.js"


import firebase from 'firebase/app'
import 'firebase/auth'
import router from '@/router'
import axios from "@/axios.js"
import {AclRule} from "vue-acl";
import axiosRaiz from "axios";
import saveleadsConfig from "../../../saveleadsConfig";

export default {
  loginAttempt({dispatch}, payload) {

    // New payload for login action
    const newPayload = {
      userDetails: payload.userDetails,
      notify: payload.notify,
      closeAnimation: payload.closeAnimation
    }

    // If remember_me is enabled change firebase Persistence
    if (!payload.checkbox_remember_me) {

      // Change firebase Persistence
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)

      // If success try to login
        .then(function () {
          dispatch('login', newPayload)
        })

        // If error notify
        .catch(function (err) {

          // Close animation if passed as payload
          if (payload.closeAnimation) payload.closeAnimation()

          payload.notify({
            time: 2500,
            title: 'Error',
            text: err.message,
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          })
        })
    } else {
      // Try to login
      dispatch('login', newPayload)
    }
  },
  login({commit, state, dispatch}, payload) {

    // If user is already logged in notify and exit
    if (state.isUserLoggedIn()) {
      // Close animation if passed as payload
      if (payload.closeAnimation) payload.closeAnimation()

      payload.notify({
        title: 'Login Attempt',
        text: 'You are already logged in!',
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'warning'
      })

      return false
    }

    // Try to sigin
    firebase.auth().signInWithEmailAndPassword(payload.userDetails.email, payload.userDetails.password)

      .then((result) => {

        // Set FLAG username update required for updating username
        let isUsernameUpdateRequired = false

        // if username is provided and updateUsername FLAG is true
        // set local username update FLAG to true
        // try to update username
        if (payload.updateUsername && payload.userDetails.displayName) {

          isUsernameUpdateRequired = true

          dispatch('updateUsername', {
            user: result.user,
            username: payload.userDetails.displayName,
            notify: payload.notify,
            isReloadRequired: true
          })
        }

        // Close animation if passed as payload
        if (payload.closeAnimation) payload.closeAnimation()

        // if username update is not required
        // just reload the page to get fresh data
        // set new user data in localstorage
        if (!isUsernameUpdateRequired) {
          router.push(router.currentRoute.query.to || '/')
          commit('UPDATE_USER_INFO', result.user.providerData[0], {root: true})
        }
      }, (err) => {

        // Close animation if passed as payload
        if (payload.closeAnimation) payload.closeAnimation()

        payload.notify({
          time: 2500,
          title: 'Error',
          text: err.message,
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'danger'
        })
      })
  },

  // Google Login
  loginWithGoogle({commit, state}, payload) {
    if (state.isUserLoggedIn()) {
      payload.notify({
        title: 'Login Attempt',
        text: 'You are already logged in!',
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'warning'
      })
      return false
    }
    const provider = new firebase.auth.GoogleAuthProvider()

    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        router.push(router.currentRoute.query.to || '/')
        commit('UPDATE_USER_INFO', result.user.providerData[0], {root: true})
      }).catch((err) => {
      payload.notify({
        time: 2500,
        title: 'Error',
        text: err.message,
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'danger'
      })
    })
  },

  // Facebook Login
  loginWithFacebook({commit, state}, payload) {
    if (state.isUserLoggedIn()) {
      payload.notify({
        title: 'Login Attempt',
        text: 'You are already logged in!',
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'warning'
      })
      return false
    }
    const provider = new firebase.auth.FacebookAuthProvider()

    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        router.push(router.currentRoute.query.to || '/')
        commit('UPDATE_USER_INFO', result.user.providerData[0], {root: true})
      }).catch((err) => {
      payload.notify({
        time: 2500,
        title: 'Error',
        text: err.message,
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'danger'
      })
    })
  },

  // Twitter Login
  loginWithTwitter({commit, state}, payload) {
    if (state.isUserLoggedIn()) {
      payload.notify({
        title: 'Login Attempt',
        text: 'You are already logged in!',
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'warning'
      })
      return false
    }
    const provider = new firebase.auth.TwitterAuthProvider()

    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        router.push(router.currentRoute.query.to || '/')
        commit('UPDATE_USER_INFO', result.user.providerData[0], {root: true})
      }).catch((err) => {
      payload.notify({
        time: 2500,
        title: 'Error',
        text: err.message,
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'danger'
      })
    })
  },

  // Github Login
  loginWithGithub({commit, state}, payload) {
    if (state.isUserLoggedIn()) {
      payload.notify({
        title: 'Login Attempt',
        text: 'You are already logged in!',
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'warning'
      })
      return false
    }
    const provider = new firebase.auth.GithubAuthProvider()

    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        router.push(router.currentRoute.query.to || '/')
        commit('UPDATE_USER_INFO', result.user.providerData[0], {root: true})
      }).catch((err) => {
      payload.notify({
        time: 2500,
        title: 'Error',
        text: err.message,
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'danger'
      })
    })
  },

  registerUser({dispatch}, payload) {

    // create user using firebase
    firebase.auth().createUserWithEmailAndPassword(payload.userDetails.email, payload.userDetails.password)
      .then(() => {
        payload.notify({
          title: 'Account Created',
          text: 'You are successfully registered!',
          iconPack: 'feather',
          icon: 'icon-check',
          color: 'success'
        })

        const newPayload = {
          userDetails: payload.userDetails,
          notify: payload.notify,
          updateUsername: true
        }
        dispatch('login', newPayload)
      }, (error) => {
        payload.notify({
          title: 'Error',
          text: error.message,
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'danger'
        })
      })
  },
  updateUsername({commit}, payload) {
    payload.user.updateProfile({
      displayName: payload.displayName
    }).then(() => {

      // If username update is success
      // update in localstorage
      let newUserData = Object.assign({}, payload.user.providerData[0])
      newUserData.displayName = payload.displayName
      commit('UPDATE_USER_INFO', newUserData, {root: true})

      // If reload is required to get fresh data after update
      // Reload current page
      if (payload.isReloadRequired) {
        router.push(router.currentRoute.query.to || '/')
      }
    }).catch((err) => {
      payload.notify({
        time: 8800,
        title: 'Error',
        text: err.message,
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'danger'
      })
    })
  },


  // JWT
  loginJWT({commit}, payload) {

    return new Promise((resolve, reject) => {
      jwt.login(payload.userDetails.email, payload.userDetails.password)
        .then(response => {
          console.log(response)
          // If there's user data in response
          if (response.data.access_token) {
            // Set accessToken
            localStorage.setItem("accessToken", response.data.access_token);
            //this.getPermissoes();
            // Set bearer token in axios
            commit("SET_BEARER", response.data.access_token);
            resolve(response.data.access_token)
          } else {
            reject({message: "E-mail ou senha incorretos."})
          }

        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getUser({commit}) {
    return new Promise((resolve, reject) => {
      console.log('chamoou getUser novo');
      const token = localStorage.getItem('accessToken');
      if (!token)
        return reject();
      //Getting user data
      axios.get("/user").then((response) => {
        // Update user details
        // const usuario = {}
        // usuario.uid = response.data.user.id;
        // usuario.displayName = response.data.user.name;
        // usuario.photoURL = response.data.user.avatar;
        // usuario.status = response.data.user.status ? "online" : "offline";
        // usuario.userRole = "Administrador";
        // usuario.permissoes = response.data.permissions;
        // usuario.autenticado = true;
        // usuario.ramal = response.data.user.ramal;
        // commit('UPDATE_USER_INFO', usuario, {root: true});
        // resolve(response)
      }).catch((error) => {
        console.log('retonou erro getUser');
        localStorage.removeItem('userInfo');
        localStorage.removeItem("permissoes");
        reject(error)
      }).finally(() => {
        console.log('final getUser');
      });
    });
  },

  getUserLogin({commit}, token2) {
    return new Promise((resolve, reject) => {
      console.log('chamoou getUser novo');
      const token = localStorage.getItem('accessToken');
      if (!token)
        return reject();
      //Getting user data
      const config = {
        headers: {Authorization: `Bearer ${token2}`}
      };

      const bodyParameters = {
        key: "value"
      };
      let domain = saveleadsConfig.url_api

      axiosRaiz.get(
        domain + '/user',
        config
      ).then((response) => {
        // Update user details
        console.log('usuario', response);

        const usuario = {}
        usuario.uid = response.data.user.id;
        usuario.displayName = response.data.user.name;
        usuario.photoURL = response.data.user.avatar;
        usuario.status = response.data.user.status ? "online" : "offline";
        usuario.userRole = response.data.user.roles.nome;
        usuario.permissoes = response.data.permissions;
        usuario.autenticado = true;
        usuario.ramal = response.data.user.ramal;
        usuario.menu_rapido = response.data.user.menu_rapido;
        commit('UPDATE_USER_INFO', usuario, {root: true});
        resolve(response)
      }).catch((error) => {
        console.log('retonou erro getUser');
        localStorage.removeItem('userInfo');
        localStorage.removeItem("permissoes");

        reject(error)
      }).finally(() => {
        console.log('final getUser');
      });
    });
  },


  getPermissoes({commit}, token2) {
    return new Promise((resolve, reject) => {
      let permissoes = {};
      //Getting user data
      const config = {
        headers: {Authorization: `Bearer ${token2}`}
      };

      const bodyParameters = {
        key: "value"
      };
      let domain = saveleadsConfig.url_api

      if (token2){
        axiosRaiz.get(domain + '/permissions', config).then(response => {
          console.log('permissions_banco', response.data);
          response.data.data.forEach(item => {
            if (item.permission_role.length > 0) {
              var ac = new AclRule('Administrador');
              item.permission_role.forEach(perfil => {
                ac = ac.or(perfil.role.nome)
              });
              permissoes[item.name] = ac.generate();
              //permissoes.push({'permissao':item.name, 'funcoes':ac.generate()});
            } else {
              permissoes[item.name] = new AclRule('Administrador').generate();
              //permissoes.push({'permissao':item.name, 'funcoes':new AclRule('Administrador').generate()});
            }
          });

          axiosRaiz.get(domain + '/roles', config).then(response => {
            console.log('funcoes', response.data);
            var ac = new AclRule('Administrador');
            response.data.data.forEach(role => {
              ac = ac.or(role.nome)
            });
            permissoes['public'] = ac.generate();
            console.log('permissoes', permissoes);
            localStorage.setItem("permissoes", JSON.stringify(permissoes));
            resolve(permissoes)
          })

        })
      }
      else{
        axios.get(domain + '/permissions').then(response => {
          console.log('permissions_banco', response.data);
          response.data.data.forEach(item => {
            if (item.permission_role.length > 0) {
              var ac = new AclRule('Administrador');
              item.permission_role.forEach(perfil => {
                ac = ac.or(perfil.role.nome)
              });
              permissoes[item.name] = ac.generate();
              //permissoes.push({'permissao':item.name, 'funcoes':ac.generate()});
            } else {
              permissoes[item.name] = new AclRule('Administrador').generate();
              //permissoes.push({'permissao':item.name, 'funcoes':new AclRule('Administrador').generate()});
            }
          });

          axios.get(domain + '/roles').then(response => {
            console.log('funcoes', response.data);
            var ac = new AclRule('Administrador');
            response.data.data.forEach(role => {
              ac = ac.or(role.nome)
            });
            permissoes['public'] = ac.generate();
            resolve(permissoes)
          })

        })
      }
    })
  },


  registerUserJWT({commit}, payload) {

    const {displayName, email, password, confirmPassword} = payload.userDetails

    return new Promise((resolve, reject) => {

      // Check confirm password
      if (password !== confirmPassword) {
        reject({message: "Password doesn't match. Please try again."})
      }

      jwt.registerUser(displayName, email, password)
        .then(response => {
          // Redirect User
          router.push(router.currentRoute.query.to || '/')

          // Update data in localStorage
          localStorage.setItem("accessToken", response.data.accessToken)
          commit('UPDATE_USER_INFO', response.data.userData, {root: true})

          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  fetchAccessToken() {
    return new Promise((resolve) => {
      jwt.refreshToken().then(response => {
        resolve(response)
      })
    })
  }
}
