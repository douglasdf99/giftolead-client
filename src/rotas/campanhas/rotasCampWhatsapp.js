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
            rule: 'editor',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
]

export default rotasCampWhats