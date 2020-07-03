/*=========================================================================================
  File Name: saveleadsConfig.js
  Description: Configurações globais programáveis do sistema
  ----------------------------------------------------------------------------------------
  Author: Lucas e Douglas
==========================================================================================*/

// MAIN COLORS - VUESAX THEME COLORS

// CONFIGS
const saveleadsConfig = {
    token : localStorage.getItem("accessToken")|| null,
    url_api: 'https://api.saveleads.com.br',
    variaveis: [
        {nome: 'Nome do Lead', value: '[NOME_LEAD]'},
        {nome: 'Nome do Atendente', value: '[NOME_ATENDENTE]'},
        {nome: 'Nome do Produto', value: '[NOME_PRODUTO]'},
    ],
    lengths: [10, 25, 50, 100]
};

export default saveleadsConfig
