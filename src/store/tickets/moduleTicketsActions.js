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

export default {
    get() {
        return new Promise((resolve, reject) => {
            axios.get(`/api/contas`, {params: {all: true}})
                .then((response) => {
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    getOpcoes({commit}) {
        return new Promise((resolve, reject) => {
            let origens = [];
            axios.get(`/api/origems`, {params: {all: true}})
                .then((response) => {
                    opcoes.origens = response.data.data;
                })
                .catch((error) => {
                    reject(error)
                })
            axios.get(`/api/tipo_de_duvidas`, {params: {all: true}})
                .then((response) => {
                    console.log('duvidas', response)
                    opcoes.duvidas = response.data.data;
                })
                .catch((error) => {
                    reject(error)
                })
            axios.get(`/api/produtos`, {params: {all: true}})
                .then((response) => {
                    console.log('produtos', response)
                    opcoes.produtos = response.data.data;
                })
                .catch((error) => {
                    reject(error)
                })
            resolve(opcoes)
        })
    },
    getTickets({commit}, dados) {
        let rota = '';
        if (dados.tipo == 'todos') {
            return new Promise((resolve, reject) => {
                axios.get(`/api/tickets`, {params: dados.params})
                    .then((response) => {
                        console.log('todos', response.data)
                        resolve(response.data.data)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        } else {
            switch (dados.tipo) {
                case 'abertos':
                    rota = 'ticketsAbertos';
                    break;
                case 'fechados':
                    rota = 'ticketsFechados';
                    break;
                default:
                    rota = 'ticketsAbertos'
            }
            return new Promise((resolve, reject) => {
                axios.get(`/api/${rota}`, {params: dados.params})
                    .then((response) => {
                        console.log('abertos', response.data)
                        resolve(response.data.data)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        }
    },
    getNums({commit}) {
        return new Promise((resolve, reject) => {
            axios.get('/api/ticketsNum').then(response => {
                resolve(response.data)
            })
        })
    },
    verificaLead({commit}, dados){
        return new Promise((resolve, reject) => {
            axios.get('/api/verificaTicketProduto', {params: dados}).then(response => {
                resolve(response.data)
            })
        })
    },
    getAgenda({commit}, rota){
        return new Promise((resolve, reject) => {
            axios.get('/api/agendamentos').then(response => {
                console.log('agendados', response);
                resolve(response.data.data);
            }).catch(erro => reject(erro));
        });
    },
}
