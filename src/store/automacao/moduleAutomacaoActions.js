import 'firebase/auth';
import axios from "@/axios.js";
import defaultAxios from "axios";
import saveleadsConfig from "../../../saveleadsConfig";

let {url_melhorenvio} = saveleadsConfig;

export default {
    get(_, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/automacaos`, {params: dados})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    storeEmail(_, dados) {
        let rota = '/automacao_emails/';
        if (dados.id != null) {
            dados._method = 'PUT';
            rota += dados.id;
        }
        return new Promise((resolve, reject) => {
            axios.post(rota, dados)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getEmails(_, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/automacao_emails`, {params: {brinde_id: id}})
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getEmailId(_, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/automacao_emails/${id}`)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    store(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/automacaos`, dados)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    deleteItem(_, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/automacaos/arquivar/${id}`)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    restaurarItem(_, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/automacaos/restaurar/${id}`)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    enviarEmail(_, obj) {
        return new Promise((resolve, reject) => {
            axios.post(`/automacao_enviar_email`, obj)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    adicionarCarrinho(_, id) {
        return new Promise((resolve, reject) => {
            axios.post(`/automacaos/adiconar_carrinho/${id}`, id)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    login(_, dados) {
        return new Promise((resolve, reject) => {
            defaultAxios.defaults.headers.common = dados.config.headers;
            defaultAxios.get(`${url_melhorenvio}`, dados.params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    verificaLimite(_, dados) {
        return new Promise((resolve, reject) => {
            defaultAxios.defaults.headers.common = dados.config.headers;
            defaultAxios.get(`${url_melhorenvio}/api/v2/me/limits`, dados.params)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    calcular(_, dados) {
        return new Promise((resolve, reject) => {
            defaultAxios.defaults.headers.common = dados.headers;
            defaultAxios.post(`${url_melhorenvio}/api/v2/me/shipment/calculate`, dados.payload)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    saldo(_, dados) {
        return new Promise((resolve, reject) => {
            defaultAxios.defaults.headers.common = dados.headers;
            defaultAxios.get(`${url_melhorenvio}/api/v2/me/balance?pretty`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    geraEtiqueta(_, dados) {
        return new Promise((resolve, reject) => {
            defaultAxios.defaults.headers.common = dados.headers;
            defaultAxios.post(`${url_melhorenvio}/api/v2/me/shipment/generate`, {orders: dados.ids})
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    imprmirMelhorEnvio(_, dados) {
        return new Promise((resolve, reject) => {
            defaultAxios.defaults.headers.common = dados.headers;
            defaultAxios.post(`${url_melhorenvio}/api/v2/me/shipment/print`, {mode: "public", orders: dados.ids})
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    geraEtiquetas(_, dados) {
        return new Promise((resolve, reject) => {
            defaultAxios.defaults.headers.common = dados.headers;
            defaultAxios.post(`${url_melhorenvio}/api/v2/me/shipment/generate`, {orders: dados.ids, pretty: 1})
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    finalizar(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/automacaos/finalizar_carrinho`, dados)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    removerCarrinho(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/automacaos/remover_carrinho/${dados.id}`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    comprar(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post("/automacaos/comprarEtiquetas/", dados)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    cancelar(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post("/automacaos/cancelarCompra/", dados)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    checkCancel(_, dados) {
        return new Promise((resolve, reject) => {
            defaultAxios.defaults.headers.common = dados.headers;
            defaultAxios.post(`${url_melhorenvio}/api/v2/me/shipment/cancellable`, {orders: dados.ids})
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    validarAutomacao(_, id) {
        return new Promise((resolve, reject) => {
            axios.post(`automacaos/validaInfor/${id}`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
};
