import subRotaPlanos from "../subRotaPlanos";

const rotasCampCheckout = [
    {
        path: 'campanha/configurar-checkout/:id',
        name: 'campanha-config-checkout',
        component: () => import('@/views/campanhas/checkout/Checkout.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Configurar Campanha', active: true},
            ],
            pageTitle: 'Configuração da Campanha de recuperação de carrinho',
            rule: 'planos_campanhas',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: 'campanha/configurar-checkout/:id/historico-envios',
        name: 'campanha-config-checkout-historico',
        component: () => import('@/views/campanhas/checkout/Historico.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Campanha de Carrinho'},
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
        path: 'campanha/configurar-checkout/:id/agendados',
        name: 'campanha-config-checkout-agendados',
        component: () => import('@/views/campanhas/checkout/Agendado.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Histórico de Envios', active: true}
            ],
            pageTitle: 'Lista de agendamentos de envios',
            rule: 'planos_campanhas',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: 'campanha/configurar-checkout/:id/contatos-ativos',
        name: 'campanha-config-checkout-contatos-ativos',
        component: () => import('@/views/campanhas/checkout/Contatos.vue'),
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
        path: 'campanha/configurar-checkout/:id/contatos-inativos',
        name: 'campanha-config-checkout-contatos-inativos',
        component: () => import('@/views/campanhas/checkout/Contatos.vue'),
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
        path: 'campanha/configurar-checkout/:id/contatos-todos',
        name: 'campanha-config-checkout-contatos-todos',
        component: () => import('@/views/campanhas/checkout/Contatos.vue'),
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
        path: 'campanha/configurar-checkout/:id/emails',
        name: 'campanha-config-checkout-emails',
        component: () => import('@/views/campanhas/checkout/Emails.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Configurar E-mails', active: true}
            ],
            pageTitle: 'Configuração de E-mails',
            rule: 'planos_campanhas_config',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: 'campanha/configurar-checkout/:id/emails/criar',
        name: 'campanha-config-checkout-emails-criar',
        component: () => import('@/views/campanhas/checkout/EmailsCriar.vue'),
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
        path: 'campanha/configurar-checkout/:id/emails/editar/:idEmail',
        name: 'campanha-config-checkout-emails-editar',
        component: () => import('@/views/campanhas/checkout/EmailsCriar.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Configurar E-mails'},
                {title: 'Criar configuração de e-mail', active: true},
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
        path: 'campanha/configurar-checkout/:id/sms',
        name: 'campanha-config-checkout-sms',
        component: () => import('@/views/campanhas/checkout/Sms.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Configurar SMS', active: true}
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
        path: 'campanha/configurar-checkout/:id/sms/criar',
        name: 'campanha-config-checkout-sms-criar',
        component: () => import('@/views/campanhas/checkout/SmsCriar.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Configurar SMS'},
                {title: 'Criar configuração de SMS', active: true},
            ],
            pageTitle: 'Configurar novo SMS',
            rule: 'planos_campanhas_sms',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: 'campanha/configurar-checkout/:id/sms/editar/:idEmail',
        name: 'campanha-config-checkout-sms-editar',
        component: () => import('@/views/campanhas/checkout/SmsCriar.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar', url: 'planos-gerenciar'},
                {title: 'Configurar SMSs'},
                {title: 'Editar configuração de SMS', active: true},
            ],
            pageTitle: 'Editar configuração de SMS',
            rule: 'planos_campanhas_sms',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
];

export default rotasCampCheckout;
