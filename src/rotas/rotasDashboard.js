import subdashboard from "@/rotas/subRotaDashboard";
const rotasDashboard = [
    {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
            rule: 'public',
            subTitle: 'Home',
            submenu: subdashboard
        }
    },
    {
        path: 'minhas-comissoes',
        name: 'minhas-comissoes',
        component: () => import('@/views/minhasComissoes/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
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
        path: 'todas-notificacoes',
        name: 'todas-notificacoes',
        component: () => import('@/views/ListNotificacoes.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
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
        path: 'meus-links',
        name: 'meus-links',
        component: () => import('@/views/links/MeusLinks.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
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
    {
        path: 'perfil',
        name: 'perfil',
        component: () => import('@/views/usuarios/Perfil.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
                {title: 'Meu perfil', active: true},
            ],
            pageTitle: 'Meu perfil',
            rule: 'public',
            pai: 'dashboard',
            subTitle: 'Meu perfil',
            subIcon: 'bell',
        },
    },
];

export default rotasDashboard;
