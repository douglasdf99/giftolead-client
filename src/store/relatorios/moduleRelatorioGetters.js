export default {
    coorecuperadosObject: state => {
        return {
            agendamento: Number(state.vendas.statistics.valor_coorecuperado['App\\Models\\CampanhaAgendamento']),
            boleto: Number(state.vendas.statistics.valor_coorecuperado['App\\Models\\CampanhaBoleto']),
            cancelado: Number(state.vendas.statistics.valor_coorecuperado['App\\Models\\CampanhaCancelado']),
            checkout: Number(state.vendas.statistics.valor_coorecuperado['App\\Models\\CampanhaCheckout']),
            whatsapp: Number(state.vendas.statistics.valor_coorecuperado['App\\Models\\CampanhaWhatsapp']),
            link: Number(state.vendas.statistics.valor_coorecuperado['App\\Models\\Link']),
            user: Number(state.vendas.statistics.valor_coorecuperado['App\\Models\\User']),
        };
    },
    automaticasObject: state => {
        return {
            boleto: Number(state.vendas.statistics.valor_recuperado_direto_campanhas['saveleads-recovery-billet']),
            carrinho: Number(state.vendas.statistics.valor_recuperado_direto_campanhas['saveleads-recovery-cart']),
            colaborador: Number(state.vendas.statistics.valor_recuperado_direto_campanhas['saveleads-user'])
        };
    },
    paymentMethodsObject: state => {
        return state.vendas.statistics.payment_methods;
    }
};
