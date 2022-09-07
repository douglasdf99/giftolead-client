import subRotaRelatorios from "./subRotaRelatorios";

const rotasRelatorios = [
    {
        path: 'relatorios/vendas-recuperadas',
        name: 'relatorio-vendas-recuperadas',
        component: () => import('@/views/relatorios/vendas/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Relatórios'},
                {title: 'Vendas Recuperadas', active: true},
            ],
            pageTitle: 'Relatório de Vendas Recuperadas',
            rule: 'relatorios',
            pai: 'relatorios',
            submenu: subRotaRelatorios
        },
    },
    {
        path: 'relatorios/vendas-usuario',
        name: 'relatorio-usuario',
        component: () => import('@/views/relatorios/vendas/Usuario.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Relatórios'},
                {title: 'Vendas Recuperadas por Usuário', active: true},
            ],
            pageTitle: 'Relatório de Vendas Recuperadas por Usuário',
            rule: 'relatorios',
            pai: 'relatorios',
            submenu: subRotaRelatorios
        },
    },
    {
        path: 'relatorios/tickets',
        name: 'relatorio-tickets',
        component: () => import('@/views/relatorios/Tickets.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Relatórios'},
                {title: 'Tickets', active: true},
            ],
            pageTitle: 'Relatório de Tickets',
            rule: 'relatorios',
            pai: 'relatorios',
            submenu: subRotaRelatorios
        },
    },
];

export default rotasRelatorios;
