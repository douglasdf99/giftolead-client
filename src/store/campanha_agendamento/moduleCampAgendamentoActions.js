import axios from "@/axios.js";

export default {
    update(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/campanha_agendamentos/${dados.id}`, dados.dados)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    store(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/campanha_agendamentos`, dados)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getId(_, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/campanha_agendamentos/${id}`)
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
            axios.get(`/campanha_agendamentos`, {params: {}})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getContatos(_, dados) {
        return new Promise((resolve) => {
            axios.get(`/campanha_agendamentos_contatos`, {params: dados.params})
                .then((response) => {
                    resolve(response.data.data);
                });
        });
    }
};
