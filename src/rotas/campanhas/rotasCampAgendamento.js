import subRotaPlanos from "../subRotaPlanos";

const rotasCampAgendamento = [
    {
        path: 'campanha/configurar-agendamento/:id',
        name: 'campanha-config-agendamento',
        component: () => import('@/views/campanhas/agendamento/Agendamento.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
                {title: 'Planos de Recuperação', url: 'meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Configurar Campanha', active: true},
            ],
            pageTitle: 'Configuração da Campanha de agendamento',
            rule: 'planos_campanhas',
            pai: 'planos',
            subTitle: 'Planos',
            submenu: subRotaPlanos
        },
    },
    {
        path: 'campanha/configurar-agendamento/:id/contatos-pendentes',
        name: 'campanha-config-agendamento-contatos-pendentes',
        component: () => import('@/views/campanhas/agendamento/Contatos.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
                {title: 'Planos de Recuperação', url: 'meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Contatos Ativos', active: true}
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
        path: 'campanha/configurar-agendamento/:id/contatos-fechados',
        name: 'campanha-config-agendamento-contatos-fechados',
        component: () => import('@/views/campanhas/agendamento/Contatos.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
                {title: 'Planos de Recuperação', url: 'meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Contatos Ativos', active: true}
            ],
            pageTitle: 'Contatos fechados da campanha',
            rule: 'planos_campanhas',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: 'campanha/configurar-agendamento/:id/contatos-todos',
        name: 'campanha-config-agendamento-contatos-todos',
        component: () => import('@/views/campanhas/agendamento/Contatos.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
                {title: 'Planos de Recuperação', url: 'meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Contatos Ativos', active: true}
            ],
            pageTitle: 'Contatos todos da campanha',
            rule: 'planos_campanhas',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
];

export default rotasCampAgendamento;