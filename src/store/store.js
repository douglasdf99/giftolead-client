/*=========================================================================================
  File Name: store.js
  Description: Vuex store
==========================================================================================*/


import Vue from 'vue';
import Vuex from 'vuex';

import state from "./state";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";
import moduleAuth from './auth/moduleAuth.js';
import users from './usuarios/moduleUsuario';
import moduleDashboard from "@/store/dashboard/moduleDashboard";
import moduleTickets from '@/store/tickets/moduleTickets.js';
import moduleOrigens from '@/store/origens/moduleOrigens.js';
import moduleDuvidas from '@/store/tipoDuvida/moduleDuvidas.js';
import moduleProdutos from '@/store/produtos/moduleProdutos.js';
import moduleCampCheckouts from "@/store/campanha_checkout/moduleCampCheckouts";
import moduleCampWhatsapp from "@/store/campanha_whatsapp/moduleCampWhatsapp";
import moduleWhatsList from "@/store/whatsapplist/moduleWhatsList";
import moduleComissoes from "@/store/comissoes/moduleComissoes";


Vue.use(Vuex);

export default new Vuex.Store({
    getters,
    mutations,
    state,
    actions,
    modules: {
        auth: moduleAuth,
        users,
        dashboard:moduleDashboard,
        tickets:moduleTickets,
        produtos:moduleProdutos,
        origens:moduleOrigens,
        duvidas:moduleDuvidas,
        campaign_checkout: moduleCampCheckouts,
        campaign_whatsapp: moduleCampWhatsapp,
        whatsapplist: moduleWhatsList,
        comissoes: moduleComissoes,
    },
    strict: process.env.NODE_ENV !== 'production'
});
