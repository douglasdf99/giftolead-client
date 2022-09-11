let subdomain = window.location.pathname.split('/')[1] ? window.location.host.split('.')[0] : false;
let api = '';
// let identity = (subdomain || process.env.VUE_APP_COMPANY_IDENTITY);

api = process.env.VUE_APP_BASE_URL_API;

const saveleadsConfig = {
   token: localStorage.getItem("accessToken") || null,
	subdomain: subdomain,
   identity: 'master',
   url_api: api,
   url_socket: process.env.VUE_APP_URL_SOCKET,
   url_app: process.env.VUE_APP_BASE_URL,
   url_melhorenvio: process.env.VUE_APP_URL_MELHOR_ENVIO,
   url_cdn: process.env.VUE_APP_URL_CDN,
   url_entrega: process.env.VUE_APP_URL_ENTREGA,
   url_shortened_link: process.env.VUE_APP_URL_SHORTENED_LINK,
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
   phoneNumberInputTranslations: {
      countrySelectorLabel: 'Codigo do Pais',
      countrySelectorError: 'Selecione um Pais',
      phoneNumberLabel: 'Número do telefone',
      example: 'Exemplo :'
   }
};

export default saveleadsConfig;
