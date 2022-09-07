export default {
    SET_ROTA_ATUAL(state, val) {
        state.rotaAtual = val;
    },
    PUSH_MSG(state, dados) {
        state.chatData.msg.push(dados);
    },
    EMPTY_CHAT(state) {
        state.chatData.msg = [];
    },
    SET_TICKET_VERIFICADO(state, val) {
        state.ticketVerificado = val;
    },
    SET_TICKET_ATENDIDO(state, ticket) {
        ticket.ticket_id = ticket.id;
        state.ticketAtendimento = ticket;
    }
};
