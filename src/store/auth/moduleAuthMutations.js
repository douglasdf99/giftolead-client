/*=========================================================================================
  File Name: moduleAuthMutations.js
  Description: Auth Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

//import axios from "../../http/axios/index.js"
import axios from "@/axios.js";
import saveleadsConfig from "../../../saveleadsConfig";


export default {
  SET_BEARER(state, accessToken) {
    localStorage.setItem("accessToken", accessToken);
    state.token = accessToken;
    saveleadsConfig.token = accessToken;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
  }
};
