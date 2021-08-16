/*=========================================================================================
  File Name: saveleadsConfig.js
  Description: Configurações globais programáveis do sistema
  ----------------------------------------------------------------------------------------
  Author: Lucas e Douglas
==========================================================================================*/

// MAIN COLORS - VUESAX THEME COLORS

// CONFIGS
var subdomain = window.location.host.split('.')[1] ? window.location.host.split('.')[0] : false;
let baseUrl = 'https://api.saveleads.com.br/'
var domain = '';
domain = baseUrl + (subdomain || 'app');


const saveleadsConfig = {
    token: localStorage.getItem("accessToken") || null,
    url_api: domain,
    url_normal: 'https://api.saveleads.com.br/',
    url_melhorenvio: 'https://www.melhorenvio.com.br',
    variaveis: [
        {nome: 'Nome do Lead', value: '[NOME_LEAD]'},
        {nome: 'E-mails do Lead', value: '[EMAIL_LEAD]'},
        {nome: 'Nome do Atendente', value: '[NOME_ATENDENTE]'},
        {nome: 'Nome do Produto', value: '[NOME_PRODUTO]'},
    ],
    lengths: [10, 25, 50, 100],
    localeData: {
        direction: 'ltr',
        format: 'dd/mm/yyyy',
        separator: ' - ',
        applyLabel: 'Aplicar',
        cancelLabel: 'Cancelar',
        weekLabel: 'M',
        customRangeLabel: 'Período',
        daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        monthNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        firstDay: 0,
        startDate: '05/26/2020',
        endDate: '05/26/2020',
    },
};

export default saveleadsConfig
