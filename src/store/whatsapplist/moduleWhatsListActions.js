import axios from "@/axios.js";

export default {
    getId(_, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/whatsapplists/${id}`)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    get() {
        return new Promise((resolve, reject) => {
            axios.get(`/whatsapplists`, {params: {status: 1}})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    setFilter({commit}, val) {
        return new Promise((resolve) => {
            commit('SET_FILTER', val);
            resolve();
        });
    },
    getVarios(_, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/whatsapplists`, {params: dados})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getCampanhas(_, val) {
        return new Promise((resolve, reject) => {
            axios.get(`/${val}`, {params: {}})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    pushMsg({commit}, dados) {
        return new Promise((resolve) => {
            commit('PUSH_MSG', dados);
            resolve();
        });
    },
    emptyChat({commit}) {
        commit('EMPTY_CHAT');
    },
    sendMsg({commit}, dados) {
        return new Promise((resolve) => {
            axios.post(`/${dados.rota}/${dados.id}`, dados)
                .then((response) => {
                    commit('PUSH_MSG', {isSent: true, textContent: response.data.data.mensagem, avatar: dados.avatar || null});
                    resolve(response.data.data.url);
                });
        });
    },
    transformar(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/whatsapplists_trasform/${dados.id}`, dados)
                .then((response) => {
                    resolve(response);

                }).catch(err => {
                    reject(err);
            });
        });
    },
};
