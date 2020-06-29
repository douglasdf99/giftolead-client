import subRotaLeads from "./subRotaLeads";

const rotasLeads = [
    {
        path: '/leads/listagem',
        name: 'leads-list',
        component: () => import('@/views/leads/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Leads'},
                {title: 'Listagem', active: true},
            ],
            pageTitle: 'Listagem de Leads',
            rule: 'editor',
            pai: 'leads',
            subTitle: 'Leads',
            //subIcon: 'settings',
            submenu: subRotaLeads
        },
    },
    {
        path: '/leads/detalhe/:id',
        name: 'leads-detalhe',
        component: () => import('@/views/leads/Detalhe.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Leads'},
                {title: 'Listagem', url: '/leads/listagem'},
                {title: 'Detalhe', active: true},
            ],
            pageTitle: 'Detalhes do Lead',
            rule: 'editor',
            pai: 'leads',
            subTitle: 'Leads',
            //subIcon: 'settings',
            submenu: subRotaLeads
        },
    },
    {
        path: '/leads/transacoes',
        name: 'transacoes',
        component: () => import('@/views/transacoes/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Leads'},
                {title: 'Transações', active: true},
            ],
            pageTitle: 'Listagem de Transações',
            rule: 'editor',
            pai: 'leads',
            subTitle: 'Leads',
            //subIcon: 'settings',
            submenu: subRotaLeads
        },
    },
];

export default rotasLeads