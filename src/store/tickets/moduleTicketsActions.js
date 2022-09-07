import 'firebase/auth';
import axios from "@/axios.js";

export default {
    get() {
        return new Promise((resolve, reject) => {
            axios.get(`/contas`, {params: {all: true}})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getOpcoes() {
        return new Promise((resolve, reject) => {
            let opcoes = [];
            axios.get(`/origems`, {params: {all: true}})
                .then((response) => {
                    opcoes.origens = response.data.data;
                })
                .catch((error) => {
                    reject(error);
                });
            axios.get(`/tipo_de_duvidas`, {params: {all: true}})
                .then((response) => {
                    opcoes.duvidas = response.data.data;
                })
                .catch((error) => {
                    reject(error);
                });
            axios.get(`/produtos`, {params: {all: true}})
                .then((response) => {
                    opcoes.produtos = response.data.data;
                })
                .catch((error) => {
                    reject(error);
                });
            resolve(opcoes);
        });
    },
    getTickets(_, dados) {
        let rota = '';
        if (dados.tipo == 'todos') {
            return new Promise((resolve, reject) => {
                axios.get(`/tickets`, {params: dados.params})
                    .then((response) => {
                        resolve(response.data.data);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        } else {
            switch (dados.tipo) {
                case 'abertos':
                    rota = 'ticketsAbertos';
                    break;
                case 'fechados':
                    rota = 'ticketsFechados';
                    break;
                default:
                    rota = 'ticketsAbertos';
            }
            return new Promise((resolve, reject) => {
                axios.get(`/${rota}`, {params: dados.params})
                    .then((response) => {
                        resolve(response.data.data);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        }
    },
    getNums(_, dados) {
        return new Promise((resolve) => {
            axios.get('/ticketsNum', {params: dados}).then(response => {
                resolve(response.data);
            });
        });
    },
    verificaLead(_, dados) {
        return new Promise((resolve) => {
            axios.get('/verificaTicketProduto', {params: dados}).then(response => {
                resolve(response.data);
            });
        });
    },
    getAgenda(_, rota) {
        return new Promise((resolve, reject) => {
            axios.get(`/${rota}`).then(response => {
                resolve(response.data.data);
            }).catch(erro => reject(erro));
        });
    },
    reagendar(_, obj) {
        return new Promise((resolve) => {
            obj._method = 'PUT';
            axios.post(`/agendamentos/${obj.id}`, obj).then(() => {
                resolve();
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
                    commit('SET_TICKET_ATENDIDO', response.data.data);
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    chamaNumero(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/chamadas`, {ticket_id: dados.ticket.id, lead_id: dados.ticket.lead_id, chamada_id: dados.chamada_id})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    consultaChamada(_, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/chamadas/${dados.identificacao}`)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    desligaChamada(_, chamada) {
        return new Promise((resolve, reject) => {
            axios.post(`/desligarchamada/${chamada.id}`)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    verificaDisponibilidade({commit}, id) {
        return new Promise((resolve, reject) => {
            axios.post(`/atender-ticket`, {id: id}).then(response => {
                if (response.data.status == 'ok') {
                    commit('SET_TICKET_VERIFICADO', id);
                }

                if (response.data.status == 'jaatendendo')
                    commit('SET_TICKET_VERIFICADO', response.data.id);

                resolve(response.data);
            }).catch(erro => reject(erro));
        });
    },
    pushMsg({commit}, dados) {
        commit('PUSH_MSG', dados);
    },
    emptyChat({commit}) {
        commit('EMPTY_CHAT');
    },
    sendMsg({commit}, dados) {
        return new Promise((resolve) => {
            axios.post(`/ticket-send-whatsapp`, {id: dados.id, mensagem: dados.mensagem})
                .then((response) => {
                    commit('PUSH_MSG', {isSent: true, textContent: response.data.data.mensagem});
                    resolve(response.data.data.url);
                });
        });
    },
    sendEmail(_, dados) {
        return new Promise((resolve) => {
            axios.post(`/ticket-send-email`, dados)
                .then((response) => {
                    resolve(response.data.data);
                });
        });
    },
    cancelar(_, id) {
        return new Promise((resolve) => {
            axios.post(`/cancelar-atendimento-ticket`, {id: id})
                .then((response) => {
                    resolve(response.data);
                });
        });
    },
    finalizar({commit}, obj) {
        return new Promise((resolve) => {
            axios.post(`/atendimentos`, obj)
                .then((response) => {
                    commit('SET_TICKET_ATENDIDO', {});
                    commit('SET_TICKET_VERIFICADO', '');
                    resolve(response.data);
                });
        });
    },
    transferir({commit}, obj) {
        return new Promise((resolve) => {
            axios.post(`/ticketsTransferir`, obj)
                .then((response) => {
                    commit('SET_TICKET_ATENDIDO', {});
                    commit('SET_TICKET_VERIFICADO', '');
                    resolve(response.data);
                });
        });
    },
    reabrir({commit}, obj) {
        return new Promise((resolve, reject) => {
            axios.post(`/ticketsReabrir`, obj)
                .then((response) => {
                    commit('SET_TICKET_ATENDIDO', {});
                    commit('SET_TICKET_VERIFICADO', '');
                    resolve(response.data);
                }).catch((error)=>{
                    reject(error);
                });
        });
    }
};
