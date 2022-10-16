import subcomissoes from "./subRotaComissoes";

const rotasComissoes = [
    {
        path: 'comissoes/todas',
        name: 'comissoes-todas',
        component: () => import('@/views/comissoes/Todas.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
                {title: 'Comissões'},
                {title: 'Todas as comissões', active: true},
            ],
            pageTitle: 'Todas as Comissões',
            rule: 'comissao_pendente',
            pai: 'comissaos',
            subTitle: 'Comissões',
            submenu: subcomissoes
        },
    },
    {
        path: 'comissoes/aprovar',
        name: 'comissoes-aprovar',
        component: () => import('@/views/comissoes/Aprovar.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
                {title: 'Comissões'},
                {title: 'Aprovar', active: true},
            ],
            pageTitle: 'Comissões a aprovar',
            rule: 'comissao_pendente',
            pai: 'comissoes',
            subTitle: 'Comissões',
            submenu: subcomissoes
        },
    },
    {
        path: 'comissoes/comissionar',
        name: 'comissoes-comissionar',
        component: () => import('@/views/comissoes/Comissionar.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
                {title: 'Comissões'},
                {title: 'Comissionar', active: true},
            ],
            pageTitle: 'Comissionar Vendas',
            rule: 'comissao',
            pai: 'comissoes',
            subTitle: 'Comissões',
            submenu: subcomissoes
        },
    },
    {
        path: 'comissoes/pagamentos',
        name: 'comissoes-pagamentos',
        component: () => import('@/views/ordens/Ordens.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
                {title: 'Comissões'},
                {title: 'Pagamentos', active: true},
            ],
            pageTitle: 'Pagamentos',
            rule: 'comissao_pagamento',
            pai: 'comissoes',
            subTitle: 'Comissões',
            submenu: subcomissoes
        },
    },
];

export default rotasComissoes;
