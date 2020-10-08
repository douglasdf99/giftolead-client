import subRotaPlanos from "../subRotaPlanos";

const rotasCampWhats = [
    {
        path: '/campanha/configurar-whatsapp/:id',
        name: 'campanha-config-whatsapp',
        component: () => import('@/views/campanhas/whatsapp/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar'},
                {title: 'Configurar Campanha', active: true},
            ],
            pageTitle: 'Configuração da Campanha de recuperação de Whatsapp',
            rule: 'planos_campanhas',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: '/campanha/configurar-whatsapp/:id/contatos-respondidos',
        name: 'campanha-config-whatsapp-contatos-respondidos',
        component: () => import('@/views/campanhas/whatsapp/Contatos.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar'},
                {title: 'Contatos Ativos', active: true}
            ],
            pageTitle: 'Contatos respondidos da campanha',
            rule: 'planos_campanhas',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: '/campanha/configurar-whatsapp/:id/contatos-pendentes',
        name: 'campanha-config-whatsapp-contatos-pendentes',
        component: () => import('@/views/campanhas/whatsapp/Contatos.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar'},
                {title: 'Contatos Inativos', active: true}
            ],
            pageTitle: 'Contatos pendentes da campanha',
            rule: 'planos_campanhas',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: '/campanha/configurar-whatsapp/:id/contatos-todos',
        name: 'campanha-config-whatsapp-contatos-todos',
        component: () => import('@/views/campanhas/whatsapp/Contatos.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar'},
                {title: 'Todos os contatos', active: true}
            ],
            pageTitle: 'Todos os contatos da campanha',
            rule: 'planos_campanhas',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
]

export default rotasCampWhats