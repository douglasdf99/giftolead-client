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
            axios.get(`/contas`, {params: {all: true}})
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
            axios.get(`/origems`, {params: {all: true}})
                .then((response) => {
                    opcoes.origens = response.data.data;
                })
                .catch((error) => {
                    reject(error)
                })
            axios.get(`/tipo_de_duvidas`, {params: {all: true}})
                .then((response) => {
                    console.log('duvidas', response)
                    opcoes.duvidas = response.data.data;
                })
                .catch((error) => {
                    reject(error)
                })
            axios.get(`/produtos`, {params: {all: true}})
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
                axios.get(`/tickets`, {params: dados.params})
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
                axios.get(`/${rota}`, {params: dados.params})
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
            axios.get('/ticketsNum').then(response => {
                resolve(response.data)
            })
        })
    },
    verificaLead({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.get('/verificaTicketProduto', {params: dados}).then(response => {
                resolve(response.data)
            })
        })
    },
    getAgenda({commit}, rota) {
        return new Promise((resolve, reject) => {
            axios.get(`/${rota}`).then(response => {
                console.log('agendados', response);
                resolve(response.data.data);
            }).catch(erro => reject(erro));
        });
    },
    reagendar({commit}, obj) {
        return new Promise((resolve, reject) => {
            obj._method = 'PUT'
            axios.post(`/agendamentos/${obj.id}`, obj).then(response => {
                console.log('reagendado', response);
                resolve()
            }).catch(erro => {
                console.log('erro', erro);
            });
        });
    },
    rotaAtual({commit}, val) {
        commit('SET_ROTA_ATUAL', val);
    },
    getId({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/tickets/${id}`)
                .then((response) => {
                    console.log('ticket resgatado', response);
                    commit('SET_TICKET_ATENDIDO', response.data.data)
                    resolve(response.data.data)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    chamaNumero({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/chamadas`, {ticket_id: dados.ticket.id, lead_id: dados.ticket.lead_id, chamada_id: dados.chamada_id})
                .then((response) => {
                    console.log('chamada realizada', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    console.log('chamada não realizada', error);
                    reject(error)
                })
        })
    },
    consultaChamada({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/chamadas/${dados.identificacao}`)
                .then((response) => {
                    console.log('consultaChamada', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    console.log('consultaChamada não roloou', error);
                    reject(error)
                })
        })
    },
    desligaChamada({commit}, chamada) {
        return new Promise((resolve, reject) => {
            axios.post(`/desligarchamada/${chamada.id}`)
                .then((response) => {
                    console.log('chamada desligada', response);
                    resolve(response.data.data)
                })
                .catch((error) => {
                    console.log('chamada não desligada', error);
                    reject(error)
                })
        })
    },
    verificaDisponibilidade({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.post(`/atender-ticket`, {id: id}).then(response => {
                console.log('resposta', response.data)
                if (response.data.status == 'ok'){
                    commit('SET_TICKET_VERIFICADO', id);
                }

                if (response.data.status == 'jaatendendo')
                    commit('SET_TICKET_VERIFICADO', response.data.id)

                resolve(response.data)
            }).catch(erro => console.log(erro));
        });
    },
    pushMsg({commit}, dados) {
        commit('PUSH_MSG', dados);
    },
    emptyChat({commit}) {
        commit('EMPTY_CHAT');
    },
    sendMsg({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/ticket-enviar-whatsapp/`, {id: dados.id, mensagem: dados.mensagem})
                .then((response) => {
                    commit('PUSH_MSG', {isSent: true, textContent: response.data.data.mensagem});
                    resolve(response.data.data.url);
                })
        });
    },
    sendEmail({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/ticket-enviar-email`, dados)
                .then((response) => {
                    console.log(response.data)
                    resolve(response.data.data);
                })
        });
    },
    cancelar({commit}, id){
        return new Promise((resolve, reject) => {
            axios.post(`/cancelar-atendimento-ticket`, {id: id})
                .then((response) => {
                    console.log(response.data)
                    resolve(response.data);
                })
        });
    },
    finalizar({commit}, obj){
        return new Promise((resolve, reject) => {
            axios.post(`/atendimentos`, obj)
                .then((response) => {
                    console.log(response.data)
                    commit('SET_TICKET_ATENDIDO', {})
                    commit('SET_TICKET_VERIFICADO', '')
                    resolve(response.data);
                })
        });
    },
    transferir({commit}, obj){
        return new Promise((resolve, reject) => {
            axios.post(`/ticketsTransferir`, obj)
                .then((response) => {
                    console.log(response.data)
                    commit('SET_TICKET_ATENDIDO', {})
                    commit('SET_TICKET_VERIFICADO', '')
                    resolve(response.data);
                })
        });
    },
    reabrir({commit}, obj){
        return new Promise((resolve, reject) => {
            axios.post(`/ticketsReabrir`, obj)
                .then((response) => {
                    console.log(response.data)
                    commit('SET_TICKET_ATENDIDO', {})
                    commit('SET_TICKET_VERIFICADO', '')
                    resolve(response.data);
                }).catch((error)=>{
                    reject(error);
                })
        });
    }
}
