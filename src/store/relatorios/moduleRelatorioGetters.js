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
            agendamento: state.vendas.valor_coorecuperado['App\\Models\\CampanhaAgendamento'],
            boleto: state.vendas.valor_coorecuperado['App\\Models\\CampanhaBoleto'],
            cancelado: state.vendas.valor_coorecuperado['App\\Models\\CampanhaCancelado'],
            checkout: state.vendas.valor_coorecuperado['App\\Models\\CampanhaCheckout'],
            whatsapp: state.vendas.valor_coorecuperado['App\\Models\\CampanhaWhatsapp'],
            link: state.vendas.valor_coorecuperado['App\\Models\\Link'],
            user: state.vendas.valor_coorecuperado['App\\Models\\User'],
        }

        return obj
    },
    automaticasObject: state => {
        let obj = {
            boleto: state.vendas.valor_recuperado_direto_campanhas['saveleads-recovery-billet'],
            carrinho: state.vendas.valor_recuperado_direto_campanhas['saveleads-recovery-cart'],
            colaborador: state.vendas.valor_recuperado_direto_campanhas['saveleads-user']
        }

        return obj
    }
}
