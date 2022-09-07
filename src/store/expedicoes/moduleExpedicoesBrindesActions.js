import 'firebase/auth';
import axios from "@/axios.js";
import defaultAxios from "axios";
import saveleadsConfig from "../../../saveleadsConfig";

let {url_melhorenvio} = saveleadsConfig;

export default {
    get(_, dados) {
        return new Promise((resolve, reject) => {
            axios.get(`/expedicaos`, {params: dados})
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getId(_, id) {
        return new Promise((resolve, reject) => {
            axios.get(`/expedicaos/${id}`)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    aprovarVarias(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/expedicaos/${dados.rota}`, {expedicaos: dados.arr})
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    tranferir(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post(`/automacaos/transferir/${dados.id}`, {expedicao : dados.expedicao_id})
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    store(_, dados) {
        let rota = '/expedicaos';
        if (dados.id != null) {
            rota = '/expedicaos/' + dados.id;
            dados._method = 'PUT';
        }
        return new Promise((resolve, reject) => {
            axios.post(rota, dados).then((response) => {
                resolve(response.data.data);
            }).catch((error) => {
                reject(error);
            });
        });
    },
    rastreio(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post("https://api.saveleads.com.br/weentrega/rastreio", dados)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    imprimirEtiquetas(_, dados) {
        return new Promise((resolve, reject) => {
            axios.get("/expedicaos/imprimiretiqueta", {params: dados, responseType: 'arraybuffer'})
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    gerarEtiquetas(_, id) {
        return new Promise((resolve, reject) => {
            axios.get("/expedicaos/gerar_etiquetas/" + id)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    gerarPlp(_, id) {
        return new Promise((resolve, reject) => {
            axios.get("/expedicaos/fechar/" + id)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    enviarRastreio(_, dados) {
        return new Promise((resolve, reject) => {
            axios.get("expedicaos/enviaremailrastreio", {params: dados})
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    storeEndereco(_, dados) {
        return new Promise((resolve, reject) => {
            axios.put("/automacao_enderecos/" + dados.id, dados)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    storeEnderecoNovo(_, dados) {
        return new Promise((resolve, reject) => {
            axios.post("/automacao_enderecos/", dados)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    getEndereco(_, id) {
        return new Promise((resolve, reject) => {
            axios.get("/automacao_enderecos/" + id)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    arquivar(_, id) {
        return new Promise((resolve, reject) => {
            axios.get("/automacaos/arquivar/" + id)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    refreshStatus(_, id) {
        return new Promise((resolve, reject) => {
            axios.post("/expedicaos/rastreio_melhor_envio/" + id)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    tracking(_, dados) {
        return new Promise((resolve, reject) => {
            defaultAxios.defaults.headers.common = dados.headers;
            defaultAxios.post(`${url_melhorenvio}/api/v2/me/shipment/tracking`, {orders: [dados.token]})
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    itensCarrinho(_, {headers}) {
        return new Promise((resolve, reject) => {
            defaultAxios.defaults.headers.common = headers;
            defaultAxios.get(`${url_melhorenvio}/api/v2/me/cart`)
                .then((response) => {
                    resolve(response.data.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
};
