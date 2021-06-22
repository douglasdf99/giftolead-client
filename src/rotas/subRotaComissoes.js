const subcomissoes = [
    {
        url: '/comissoes/todas',
        name: "Todas as Comissões",
        slug: "comissoes-todas",
        icon: 'assignment_turned_in',
        can: 'comissao_pendente'
    },
    {
        url: '/comissoes/aprovar',
        name: "Aprovar",
        slug: "comissoes-aprovar",
        icon: 'assignment_turned_in',
        can: 'comissao_pendente'
    },
    {
        url: '/comissoes/comissionar',
        name: "Comissionar",
        slug: "comissoes-comissionar",
        icon: 'attach_money',
        can: 'comissao'
    },
    {
        url: '/comissoes/pagamentos',
        name: "Pagamentos",
        slug: "comissoes-pagamentos",
        icon: 'monetization_on',
        can: 'comissao_pagamento'
    },
];

export default subcomissoes
