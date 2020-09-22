import subdashboard from "@/rotas/subRotaDashboard";
const rotasDashboard = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/DashboardAnalytics.vue'),
        meta: {
            rule: 'editor',
            subTitle: 'Home',
            submenu: subdashboard
        }
    },
    {
        path: '/minhas-comissoes',
        name: 'minhas-comissoes',
        component: () => import('@/views/minhasComissoes/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Tickets'},
                {title: 'Meus atendimentos comissionados', active: true},
            ],
            pageTitle: 'Meus atendimentos comissionados',
            rule: 'editor',
            pai: 'tickets',
            subTitle: 'Home',
            //subIcon: 'settings',
            submenu: subdashboard
        },
    },
];

export default rotasDashboard;