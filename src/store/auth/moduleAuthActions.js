import jwt from "../../http/requests/auth/jwt/index.js";
import firebase from 'firebase/app';
import 'firebase/auth';
import router from '@/router';
import axios from "@/axios.js";
import { AclRule } from "vue-acl";
import axiosRaiz from "axios";
import saveleadsConfig from "../../../saveleadsConfig";

export default {
  registerUser({ dispatch }, payload) {

    // create user using firebase
    firebase.auth().createUserWithEmailAndPassword(payload.userDetails.email, payload.userDetails.password)
      .then(() => {
        payload.notify({
          title: 'Account Created',
          text: 'You are successfully registered!',
          iconPack: 'feather',
          icon: 'icon-check',
          color: 'success'
        });

        const newPayload = {
          userDetails: payload.userDetails,
          notify: payload.notify,
          updateUsername: true
        };
        dispatch('login', newPayload);
      }, (error) => {
        payload.notify({
          title: 'Error',
          text: error.response.data.message,
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'danger'
        });
      });
  },
  updateUsername({ commit }, payload) {
    payload.user.updateProfile({
      displayName: payload.displayName
    }).then(() => {

      // If username update is success
      // update in localstorage
      let newUserData = Object.assign({}, payload.user.providerData[0]);
      newUserData.displayName = payload.displayName;
      commit('UPDATE_USER_INFO', newUserData, { root: true });

      // If reload is required to get fresh data after update
      // Reload current page
      if (payload.isReloadRequired) {
        router.push(router.currentRoute.query.to || '/');
      }
    }).catch((err) => {
      payload.notify({
        time: 8800,
        title: 'Error',
        text: err.message,
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'danger'
      });
    });
  },

  // JWT
  loginJWT({ commit }, payload) {

    return new Promise((resolve, reject) => {
      jwt.login(payload.userDetails.email, payload.userDetails.password)
        .then(response => {
          if (response.data.access_token) {
            localStorage.setItem("accessToken", response.data.access_token);
            commit("SET_BEARER", response.data.access_token);
            resolve(response.data.access_token);
          } else {
            reject({ message: "E-mail ou senha incorretos." });
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  setBearer({ commit }, token) {
    commit("SET_BEARER", token);
  },

  getUser({ commit }) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('accessToken');
      if (!token)
        return reject();
      //Getting user data
      axios.get("/user").then((response) => {
        // Update user details
        // const usuario = {};
        // usuario.uid = response.data.user.id;
        // usuario.displayName = response.data.user.name;
        // usuario.photoURL = response.data.user.avatar;
        // usuario.status = response.data.user.status ? "online" : "offline";
        // usuario.userRole = "Administrador";
        // usuario.permissoes = response.data.permissions;
        // usuario.autenticado = true;
        // usuario.ramal = response.data.user.ramal;
        // commit('UPDATE_USER_INFO', usuario, {root: true});
        resolve(response);
      }).catch((error) => {
        reject(error);
      });
    });
  },

  getUserLogin({ commit }, token2) {
    return new Promise((resolve, reject) => {
      //Getting user data
      const config = {
        headers: { Authorization: `Bearer ${token2}` }
      };

      let domain = saveleadsConfig.url_api;

      axios.get('/user').then((response) => {
        console.log('user',response.data);
        // Update user details
        const usuario = {};
        usuario.uid = response.data.id;
        usuario.displayName = response.data.name;
        usuario.email = response.data.email;
        usuario.photoURL = response.data.avatar;
        usuario.status = response.data.status ? "online" : "offline";
        usuario.userRole = response.data.role_name;
        usuario.permissoes = response.data.permissions;
        usuario.autenticado = true;
        usuario.ramal = response.data.ramal;
        usuario.menu_rapido = response.data.menu_rapido;
        usuario.companies = response.data.companies;
        commit('UPDATE_USER_INFO', usuario, { root: true });
        resolve(response.data.user);
      }).catch((error) => {

        localStorage.removeItem('userInfo');
        localStorage.removeItem("permissoes");

        reject(error);
      });
    });
  },


  getPermissoes(_, token2) {
    return new Promise((resolve) => {
      let permissoes = {};
      //Getting user data
      const config = {
        headers: { Authorization: `Bearer ${token2}` }
      };

      let domain = saveleadsConfig.url_api + saveleadsConfig.identity;
      axiosRaiz.get(domain + '/permissions', config).then(response => {
        response.data.data.forEach(item => {
          if (item.permission_role.length > 0) {
            var ac = new AclRule('Administrador');
            item.permission_role.forEach(perfil => {
              ac = ac.or(perfil.role.nome);
            });
            permissoes[item.name] = ac.generate();
          } else {
            permissoes[item.name] = new AclRule('Administrador').generate();
          }
        });

        axiosRaiz.get(domain + '/roles', config).then(response => {
          var ac = new AclRule('Administrador');
          response.data.data.forEach(role => {
            ac = ac.or(role.nome);
          });
          permissoes['public'] = ac.generate();
          localStorage.setItem("permissoes", JSON.stringify(permissoes));
   
          resolve(permissoes);
        });

      });
      
       
      
    });
  },

  registerUserJWT({ commit }, payload) {
    const { displayName, email, password, confirmPassword } = payload.userDetails;

    return new Promise((resolve, reject) => {

      // Check confirm password
      if (password !== confirmPassword) {
        reject({ message: "Password doesn't match. Please try again." });
      }

      jwt.registerUser(displayName, email, password)
        .then(response => {
          // Redirect User
          router.push(router.currentRoute.query.to || '/');

          // Update data in localStorage
          localStorage.setItem("accessToken", response.data.accessToken);
          commit('UPDATE_USER_INFO', response.data.userData, { root: true });

          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  fetchAccessToken() {
    return new Promise((resolve) => {
      jwt.refreshToken().then(response => {
        resolve(response);
      });
    });
  }
};
