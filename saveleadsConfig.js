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
};

export default saveleadsConfig
