import subdashboard from "@/rotas/subRotaDashboard";
const rotasDashboard = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
            rule: 'public',
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
            rule: 'public',
            pai: 'dashboard',
            subTitle: 'Home',
            //subIcon: 'settings',
            submenu: subdashboard
        },
    },
    {
        path: '/todas-notificacoes',
        name: 'todas-notificacoes',
        component: () => import('@/views/ListNotificacoes.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Todas as Notificações', active: true},
            ],
            pageTitle: 'Notificações da última semana',
            rule: 'public',
            pai: 'dashboard',
            subTitle: 'Savelinks',
            subIcon: 'notifications_active',
            submenu: subdashboard
        },
    },
    {
        path: '/meus-links',
        name: 'meus-links',
        component: () => import('@/views/links/MeusLinks.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Dashboard', url: '/dashboard'},
                {title: 'Meus links', active: true},
            ],
            pageTitle: 'Meus Links',
            rule: 'public',
            pai: 'dashboard',
            subTitle: 'Savelinks',
            subIcon: 'bell',
            submenu: subdashboard
        },
    },
];

export default rotasDashboard;
