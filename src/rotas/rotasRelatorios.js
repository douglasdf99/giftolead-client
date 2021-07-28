import subRotaRelatorios from "./subRotaRelatorios";

const rotasRelatorios = [
    {
        path: '/relatorios/vendas-recuperadas',
        name: 'relatorios-vendas-recuperadas',
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
        path: '/relatorios/tickets',
        name: 'relatorios-tickets',
        component: () => import('@/views/relatorios/vendas/Index.vue'),
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
]

export default rotasRelatorios
