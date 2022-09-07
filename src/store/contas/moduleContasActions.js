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
            axios.get(`/integracoes`)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
};
