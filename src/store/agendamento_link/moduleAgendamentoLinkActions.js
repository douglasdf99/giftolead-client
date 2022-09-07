import 'firebase/auth';
import axios from "@/axios.js";

export default {
    store(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/agendamento_externo`, dados)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
};
