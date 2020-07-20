/*=========================================================================================
  File Name: saveleadsConfig.js
  Description: Configurações globais programáveis do sistema
  ----------------------------------------------------------------------------------------
  Author: Lucas e Douglas
==========================================================================================*/

// MAIN COLORS - VUESAX THEME COLORS

// CONFIGS
var subdomain =  window.location.host.split('.')[1] ? window.location.host.split('.')[0] : false;
var domain = '';
if(subdomain)
    domain = "https://api.saveleads.com.br/" + subdomain;
else
    domain = "https://api.saveleads.com.br/app";

const saveleadsConfig = {
    token : localStorage.getItem("accessToken")|| null,
    url_api: domain,
    url_normal: 'https://api.saveleads.com.br/',
    variaveis: [
        {nome: 'Nome do Lead', value: '[NOME_LEAD]'},
        {nome: 'E-mails do Lead', value: '[EMAIL_LEAD]'},
        {nome: 'Nome do Atendente', value: '[NOME_ATENDENTE]'},
        {nome: 'Nome do Produto', value: '[NOME_PRODUTO]'},
    ],
    lengths: [10, 25, 50, 100]
};

export default saveleadsConfig
