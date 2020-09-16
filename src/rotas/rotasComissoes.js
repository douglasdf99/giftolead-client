import subcomissoes from "./subRotaComissoes";

const rotasComissoes = [
    {
        path: '/comissoes/aprovar',
        name: 'comissoes-aprovar',
        component: () => import('@/views/comissoes/Aprovar.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Comissões'},
                {title: 'Aprovar', active: true},
            ],
            pageTitle: 'Comissões a aprovar',
            rule: 'editor',
            pai: 'comissoes',
            subTitle: 'Comissões',
            submenu: subcomissoes
        },
    },
    {
        path: '/comissoes/comissionar',
        name: 'comissoes-comissionar',
        component: () => import('@/views/comissoes/Comissionar.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Comissões'},
                {title: 'Comissionar', active: true},
            ],
            pageTitle: 'Comissionar Vendas',
            rule: 'editor',
            pai: 'comissoes',
            subTitle: 'Comissões',
            submenu: subcomissoes
        },
    },
    {
        path: '/comissoes/pagamentos',
        name: 'comissoes-pagamentos',
        component: () => import('@/views/ordens/Ordens.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Comissões'},
                {title: 'Pagamentos', active: true},
            ],
            pageTitle: 'Pagamentos',
            rule: 'editor',
            pai: 'comissoes',
            subTitle: 'Comissões',
            submenu: subcomissoes
        },
    },
];

export default rotasComissoes