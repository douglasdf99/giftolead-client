/*=========================================================================================
  File Name: moduleAuthActions.js
  Description: Auth Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import axios from "@/axios.js";
import axiosRaiz from "axios";
import saveleadsConfig from "../../../saveleadsConfig";

let { url_melhorenvio } = saveleadsConfig;

export default {
  get({ commit, state }) {

    return new Promise((resolve, reject) => {
      if (state && state.extensoes.length > 0) {
        resolve(state.extensoes);
      } else {
        axios.get(`/extensoes/company`)
          .then((response) => {
            resolve(response.data.data);
            commit('UPDATE_EXTENSIONS_COMPANY', response.data.data);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });

  },
  ativa(_, dados) {
    return new Promise((resolve, reject) => {
      axios.post(`/extensoes/company/${dados.id}`, dados.dados)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getZenviaHistorico(_, dados) {
    return new Promise((resolve, reject) => {
      axios.get(`/extensoes/totalvoice`, { params: dados })
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  storeRamal(_, dados) {
    return new Promise((resolve, reject) => {
      axios.post(`/extensoes/totalvoice`, dados)
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  storeSlack(_, dados) {
    return new Promise((resolve, reject) => {
      dados._method = 'PUT';
      axios.post(`/extensoes/slack/${dados.id}`, dados)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  storeMelhorEnvio(_, dados) {
    return new Promise((resolve, reject) => {
      dados._method = 'PUT';
      axios.post(`/extensoes/slack/${dados.id}`, dados)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  updateRamal(_, dados) {
    return new Promise((resolve, reject) => {
      axios.post(`/extensoes/totalvoice/`, dados)
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  instalar(_, dados) {
    return new Promise((resolve, reject) => {
      axios.post(`/extensoes/company`, dados)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  desinstalar(_, dados) {
    return new Promise((resolve, reject) => {
      axios.delete(`/extensoes/company/${dados.id}`, { params: dados })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  MelhorInfo(_, dados) {

    return new Promise((resolve, reject) => {
      axiosRaiz.defaults.headers.common = dados.config.headers;
      axiosRaiz.get(url_melhorenvio + '/api/v2/me', dados.params)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  MelhorServices(_, dados) {
    return new Promise((resolve, reject) => {
      axios.get(`/extensoes/melhor_envio/services`, { params: dados })
        .then(response => {
          resolve(response);
        }).catch(erro => reject(erro));
    });
  },
  setPadrao(_, dados) {
    return new Promise((resolve, reject) => {
      axios.post(`/extensoes/melhor_envio/setPadrao`, dados)
        .then(response => {
          resolve(response);
        }).catch(erro => reject(erro));
    });
  },
  MelhorEnvioEditExcecao(_, dados) {
    return new Promise((resolve, reject) => {
      axios.post(`/extensoes/melhor_envio/editConfig`, dados)
        .then(response => {
          resolve(response);
        }).catch(erro => reject(erro));
    });
  },
  MelhorEnvioAddExcecao(_, dados) {
    return new Promise((resolve, reject) => {
      axios.post(`/extensoes/melhor_envio/addConfig`, dados)
        .then(response => {
          resolve(response);
        }).catch(erro => reject(erro));
    });
  },
  MelhorEnvioDeleteExcecao(_, dados) {
    return new Promise((resolve, reject) => {
      axios.post(`/extensoes/melhor_envio/deleteConfig`, dados)
        .then(response => {
          resolve(response);
        }).catch(erro => reject(erro));
    });
  },
  deletarRamal(_, dados) {
    return new Promise((resolve, reject) => {
      axios.delete(`/extensoes/totalvoice/${dados.ramal_id}`, { params: dados })
        .then(response => {
          resolve(response);
        }).catch(erro => reject(erro));
    });
  },
  switchExt(_, dados) {
    return new Promise((resolve, reject) => {
      axios.post(`/extensoes/company/${dados.id}`, dados.dados)
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
