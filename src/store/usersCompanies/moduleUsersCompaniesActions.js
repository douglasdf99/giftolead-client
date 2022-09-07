import axios from "@/axios.js";

export default {
    delete({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.delete(`/users_companies/${dados.id}`)
                .then((response) => {
                    commit("REMOVE_USER",response.data.data);
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    update(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/users_companies/${dados.id}`, dados.dados)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    store({commit}, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/users_companies/`, dados)
                .then((response) => {
                    commit('SET_USER',response.data.data);
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getId(_, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/users_companies/` + id)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    get({commit},data) {
        return new Promise((resolve, reject) => {
            axios.get(`/users_companies`, data)
                .then((response) => {
                    commit('SET_USERS',response.data.data.data );
                    resolve(response.data.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    getArraySelect() {
        return new Promise((resolve, reject) => {
            axios.get(`/selects/usuarios`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch(() => {
                    reject();
                });
        });
    },
    getUserAuth() {
        return new Promise((resolve, reject) => {
            axios.get(`/users_companies`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    sendInvite(_,dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/users_companies/send_invite/${dados.id}`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
};
