import axios from "@/axios.js";

export default {
    update(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/users/${dados.id}`, dados.dados)
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
            axios.post(`/users/`, dados)
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
            axios.get(`/users/` + id)
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
            axios.get(`/users`, {params: {status: 1, admin: true}})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch(() => {
                    reject();
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
            axios.get(`/user`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
};
