import subRotaPlanos from "../subRotaPlanos";

const rotasCampAgendamento = [
    {
        path: '/campanha/configurar-agendamento/:id',
        name: 'campanha-config-agendamento',
        component: () => import('@/views/campanhas/agendamento/Agendamento.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar'},
                {title: 'Configurar Campanha', active: true},
            ],
            pageTitle: 'Configuração da Campanha de agendamento',
            rule: 'editor',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
]

export default rotasCampAgendamento