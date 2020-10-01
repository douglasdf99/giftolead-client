import subdashboard from "@/rotas/subRotaDashboard";
import subRotaConfiguracoes from "@/rotas/subRotaConfiguracoes";
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
            rule: 'editor',
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
                {title: 'Configurações'},
                {title: 'Geral', url: '/configuracoes/geral'},
                {title: 'Links', url: '/configuracoes/links'},
                {title: 'Meus links', active: true},
            ],
            pageTitle: 'Meus Links',
            rule: 'editor',
            pai: 'configuracoes',
            subTitle: 'Savelinks',
            subIcon: 'bell',
            submenu: subRotaConfiguracoes
        },
    },
];

export default rotasDashboard;