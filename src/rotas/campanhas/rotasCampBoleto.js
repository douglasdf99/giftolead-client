import subRotaPlanos from "../subRotaPlanos";
const rotasCampBoleto = [
    {
        path: 'campanha/configurar-boleto/:id',
        name: 'campanha-configurar-boleto',
        component: () => import('@/views/campanhas/boleto/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Configurar Campanha', active: true},
            ],
            pageTitle: 'Configuração da Campanha de recuperação de Boletos',
            rule: 'planos_campanhas',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: 'campanha/configurar-boleto/:id/historico-envios',
        name: 'campanha-config-boleto-historico',
        component: () => import('@/views/campanhas/boleto/Historico.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Camapnha de Boleto'},
                {title: 'Histórico de Envios', active: true}
            ],
            pageTitle: 'Histórico de envios dos e-mails',
            rule: 'planos_campanhas',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: 'campanha/configurar-boleto/:id/agendados',
        name: 'campanha-config-boleto-agendados',
        component: () => import('@/views/campanhas/boleto/Agendado.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Histórico de Envios', active: true}
            ],
            pageTitle: 'Agendamentos de envios',
            rule: 'planos_campanhas',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: 'campanha/configurar-boleto/:id/contatos-ativos',
        name: 'campanha-config-boleto-contatos-ativos',
        component: () => import('@/views/campanhas/boleto/Contatos.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Contatos Ativos', active: true}
            ],
            pageTitle: 'Contatos ativos da campanha',
            rule: 'planos_campanhas',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: 'campanha/configurar-boleto/:id/contatos-inativos',
        name: 'campanha-config-boleto-contatos-inativos',
        component: () => import('@/views/campanhas/boleto/Contatos.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Contatos Inativos', active: true}
            ],
            pageTitle: 'Contatos inativos da campanha',
            rule: 'planos_campanhas',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: 'campanha/configurar-boleto/:id/contatos-todos',
        name: 'campanha-config-boleto-contatos-todos',
        component: () => import('@/views/campanhas/boleto/Contatos.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
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
    {
        path: 'campanha/configurar-boleto/:id/emails',
        name: 'campanha-config-boleto-emails',
        component: () => import('@/views/campanhas/boleto/Emails.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Configurar E-mails', active: true}
            ],
            pageTitle: 'Configuração de E-mails',
            rule: 'planos_campanhas_config_email',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: 'campanha/configurar-boleto/:id/emails/criar',
        name: 'campanha-config-boleto-emails-criar',
        component: () => import('@/views/campanhas/boleto/EmailsCriar.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Configurar E-mails'},
                {title: 'Criar configuração de e-mail', active: true},
            ],
            pageTitle: 'Configurar novo E-mail',
            rule: 'planos_campanhas_config_email',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: 'campanha/configurar-boleto/:id/emails/editar/:idEmail',
        name: 'campanha-config-boleto-emails-editar',
        component: () => import('@/views/campanhas/boleto/EmailsCriar.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Configurar E-mails'},
                {title: 'Editar configuração de e-mail', active: true},
            ],
            pageTitle: 'Editar configuração do E-mail',
            rule: 'planos_campanhas_config_email',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: 'campanha/configurar-boleto/:id/sms',
        name: 'campanha-config-boleto-sms',
        component: () => import('@/views/campanhas/boleto/Sms.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Configurar E-mails', active: true}
            ],
            pageTitle: 'Configuração de SMSs',
            rule: 'planos_campanhas_sms',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: 'campanha/configurar-boleto/:id/sms/criar',
        name: 'campanha-config-boleto-sms-criar',
        component: () => import('@/views/campanhas/boleto/SmsCriar.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Configurar E-mails'},
                {title: 'Criar configuração de e-mail', active: true},
            ],
            pageTitle: 'Configurar novo E-mail',
            rule: 'planos_campanhas_sms',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: 'campanha/configurar-boleto/:id/sms/editar/:idEmail',
        name: 'campanha-config-boleto-sms-editar',
        component: () => import('@/views/campanhas/boleto/SmsCriar.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Configurar SMSs'},
                {title: 'Criar configuração de SMS', active: true},
            ],
            pageTitle: 'Editar configuração do SMS',
            rule: 'planos_campanhas_sms',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
];

export default rotasCampBoleto;
