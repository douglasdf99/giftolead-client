/*=========================================================================================
  File Name: moduleAuthGetters.js
  Description: Auth Module Getters
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {
    coorecuperadosObject: state => {
        let obj = {
            agendamento: state.vendas.statistics.valor_coorecuperado['App\\Models\\CampanhaAgendamento'],
            boleto: state.vendas.statistics.valor_coorecuperado['App\\Models\\CampanhaBoleto'],
            cancelado: state.vendas.statistics.valor_coorecuperado['App\\Models\\CampanhaCancelado'],
            checkout: state.vendas.statistics.valor_coorecuperado['App\\Models\\CampanhaCheckout'],
            whatsapp: state.vendas.statistics.valor_coorecuperado['App\\Models\\CampanhaWhatsapp'],
            link: state.vendas.statistics.valor_coorecuperado['App\\Models\\Link'],
            user: state.vendas.statistics.valor_coorecuperado['App\\Models\\User'],
        }

        return obj
    },
    automaticasObject: state => {
        let obj = {
            boleto: state.vendas.statistics.valor_recuperado_direto_campanhas['saveleads-recovery-billet'],
            carrinho: state.vendas.statistics.valor_recuperado_direto_campanhas['saveleads-recovery-cart'],
            colaborador: state.vendas.statistics.valor_recuperado_direto_campanhas['saveleads-user']
        }

        return obj
    }
}
