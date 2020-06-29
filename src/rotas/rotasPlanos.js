import subRotaPlanos from "./subRotaPlanos";
const rotasPlanos = [
    {
        path: '/planos/meus-planos',
        name: 'meus-planos',
        component: () => import('@/views/planos/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos'},
                {title: 'Listagem', active: true},
            ],
            pageTitle: 'Planos de Recuperação',
            rule: 'editor',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: '/planos/criar',
        name: 'planos-criar',
        component: () => import('@/views/planos/AddEdit.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Criar', active: true},
            ],
            pageTitle: 'Criar Plano de Recuperação',
            rule: 'editor',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: '/planos/gerenciar/:id',
        name: 'planos-gerenciar',
        component: () => import('@/views/planos/Gerenciar.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', active: true},
            ],
            pageTitle: 'Gerenciar Plano de Recuperação',
            rule: 'editor',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: '/planos/gerenciar/:id/campanha/criar',
        name: 'campanha-criar',
        component: () => import('@/views/campanhas/Add.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar'},
                {title: 'Criar Campanha', active: true},
            ],
            pageTitle: 'Nova Campanha de recuperação de venda',
            rule: 'editor',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
]

export default rotasPlanos