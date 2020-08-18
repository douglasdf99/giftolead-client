import subbrindes from "./subRotaBrindes";

const rotasBrindes = [
    {
        path: '/brindes/campanhas',
        name: 'brindes-campanhas',
        component: () => import('@/views/brindes/Campanhas.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Brindes'},
                {title: 'Campanhas', active: true},
            ],
            pageTitle: 'Campanhas',
            rule: 'editor',
            pai: 'brindes',
            subTitle: 'Brindes',
            submenu: subbrindes
        },
    },
    {
        path: '/brindes/campanhas/criar',
        name: 'brindes-campanhas-criar',
        component: () => import('@/views/brindes/AddConfig.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Brindes'},
                {title: 'Campanhas', url: '/brindes/campanhas'},
                {title: 'Criar', active: true},
            ],
            pageTitle: 'Configuração da campanha de Brinde',
            rule: 'editor',
            pai: 'brindes',
            subTitle: 'Brindes',
            submenu: subbrindes
        },
    },
    {
        path: '/brindes/campanhas/editar/:id',
        name: 'brindes-campanhas-editar',
        component: () => import('@/views/brindes/AddConfig.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Brindes'},
                {title: 'Campanhas', url: '/brindes/campanhas'},
                {title: 'Editar', active: true},
            ],
            pageTitle: 'Configuração da campanha de Brinde',
            rule: 'editor',
            pai: 'brindes',
            subTitle: 'Brindes',
            submenu: subbrindes
        },
    },
    {
        path: '/brindes/campanhas/config/:id',
        name: 'brindes-campanhas-config',
        component: () => import('@/views/brindes/Condicoes.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Brindes'},
                {title: 'Campanhas', url: '/brindes/campanhas'},
                {title: 'Configurar', active: true},
            ],
            pageTitle: 'Configuração da campanha de Brinde',
            rule: 'editor',
            pai: 'brindes',
            subTitle: 'Brindes',
            submenu: subbrindes
        },
    },
    {
        path: '/brindes/listagem-entregas',
        name: 'brindes-listagem-entregas',
        component: () => import('@/views/brindes/Entrega.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Brindes'},
                {title: 'Listagem de Entrega', active: true},
            ],
            pageTitle: 'Automação de entrega de Brinde',
            rule: 'editor',
            pai: 'brindes',
            subTitle: 'Brindes',
            submenu: subbrindes
        },
    }
];

export default rotasBrindes;
