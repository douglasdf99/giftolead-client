import subRotaPlanos from "../subRotaPlanos";
const rotasCampCancelada = [
    {
        path: '/campanha/configurar-canceladas/:id',
        name: 'campanha-config-canceladas',
        component: () => import('@/views/campanhas/Canceladas.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar'},
                {title: 'Configurar Campanha', active: true},
            ],
            pageTitle: 'Configuração da campanha de recuperação de canceladas',
            rule: 'editor',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
]

export default rotasCampCancelada