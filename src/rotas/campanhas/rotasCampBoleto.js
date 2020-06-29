import subRotaPlanos from "../subRotaPlanos";
const rotasCampBoleto = [
    {
        path: '/campanha/configurar-boleto/:id',
        name: 'campanha-configurar-boleto',
        component: () => import('@/views/campanhas/boleto/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar'},
                {title: 'Configurar Campanha', active: true},
            ],
            pageTitle: 'Configuração da Campanha de recuperação de Boletos',
            rule: 'editor',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: '/campanha/configurar-boleto/:id/historico-envios',
        name: 'campanha-config-boleto-historico',
        component: () => import('@/views/campanhas/boleto/Historico.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar'},
                {title: 'Histórico de Envios', active: true}
            ],
            pageTitle: 'Histórico de envios dos e-mails',
            rule: 'editor',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: '/campanha/configurar-boleto/:id/contatos-ativos',
        name: 'campanha-config-boleto-contatos-ativos',
        component: () => import('@/views/campanhas/boleto/Contatos.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar'},
                {title: 'Contatos Ativos', active: true}
            ],
            pageTitle: 'Contatos ativos da campanha',
            rule: 'editor',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: '/campanha/configurar-boleto/:id/contatos-inativos',
        name: 'campanha-config-boleto-contatos-inativos',
        component: () => import('@/views/campanhas/boleto/Contatos.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar'},
                {title: 'Contatos Inativos', active: true}
            ],
            pageTitle: 'Contatos inativos da campanha',
            rule: 'editor',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: '/campanha/configurar-boleto/:id/contatos-todos',
        name: 'campanha-config-boleto-contatos-todos',
        component: () => import('@/views/campanhas/boleto/Contatos.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar'},
                {title: 'Todos os contatos', active: true}
            ],
            pageTitle: 'Todos os contatos da campanha',
            rule: 'editor',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: '/campanha/configurar-boleto/:id/emails/criar',
        name: 'campanha-config-boleto-emails-criar',
        component: () => import('@/views/campanhas/boleto/EmailsCriar.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar'},
                {title: 'Configurar E-mails'},
                {title: 'Criar configuração de e-mail', active: true},
            ],
            pageTitle: 'Configurar novo E-mail',
            rule: 'editor',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
    {
        path: '/campanha/configurar-boleto/:id/emails/editar/:idEmail',
        name: 'campanha-config-boleto-emails-editar',
        component: () => import('@/views/campanhas/boleto/EmailsCriar.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar'},
                {title: 'Configurar E-mails'},
                {title: 'Editar configuração de e-mail', active: true},
            ],
            pageTitle: 'Editar configuração do E-mail',
            rule: 'editor',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
]

export default rotasCampBoleto