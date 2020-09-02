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
        path: '/brindes/solicitacoes',
        name: 'brindes-solicitacoes',
        component: () => import('@/views/solicitacao_brinde/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Brindes'},
                {title: 'Solicitações de Brindes', active: true},
            ],
            pageTitle: 'Solicitações de Brindes',
            rule: 'editor',
            pai: 'brindes',
            subTitle: 'Brindes',
            submenu: subbrindes
        },
    },
    {
        path: '/brindes/expedicoes',
        name: 'brindes-expedicoes',
        component: () => import('@/views/expedicoes/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Brindes'},
                {title: 'Expedição de Objetos', active: true},
            ],
            pageTitle: 'Expedição de Objetos',
            rule: 'editor',
            pai: 'brindes',
            subTitle: 'Brindes',
            submenu: subbrindes
        },
    },
    {
        path: '/brindes/expedicoes/:id',
        name: 'brindes-expedicoes-detalhe',
        component: () => import('@/views/expedicoes/ListDetal.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Brindes'},
                {title: 'Detalhe da Expedição', active: true},
            ],
            pageTitle: 'Detalhe da Expedição',
            rule: 'editor',
            pai: 'brindes',
            subTitle: 'Brindes',
            submenu: subbrindes
        },
    }
];

export default rotasBrindes;
