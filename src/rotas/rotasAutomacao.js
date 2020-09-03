import subbrindes from "./subRotaBrindes";

const rotasAutomacao = [
    {
        path: '/brindes/automacao',
        name: 'brindes-automacao',
        component: () => import('@/views/automacao/Automacao.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Brindes'},
                {title: 'Automação de entrega', active: true},
            ],
            pageTitle: 'Automação de entrega de Brinde',
            rule: 'editor',
            pai: 'brindes',
            subTitle: 'Brindes',
            submenu: subbrindes
        },
    },
    {
        path: '/brindes/automacao/emails',
        name: 'brindes-automacao-emails',
        component: () => import('@/views/automacao/Emails.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Brindes'},
                {title: 'Automação de entrega', url: '/brindes/automacao'},
                {title: 'Configuração de E-mails', active: true},
            ],
            pageTitle: 'Configuração de envio de E-mails',
            rule: 'editor',
            pai: 'brindes',
            subTitle: 'Brindes',
            submenu: subbrindes
        },
    },
    {
        path: '/brindes/automacao/emails/criar/:tipo',
        name: 'brindes-automacao-emails-criar',
        component: () => import('@/views/automacao/EmailsCriar.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Brindes'},
                {title: 'Automação de entrega', url: '/brindes/automacao'},
                {title: 'Criar novo e-mail', active: true},
            ],
            pageTitle: 'Criar novo e-mail',
            rule: 'editor',
            pai: 'brindes',
            subTitle: 'Brindes',
            submenu: subbrindes
        },
    },
    {
        path: '/brindes/automacao/emails/editar/:id/:tipo',
        name: 'brindes-automacao-emails-editar',
        component: () => import('@/views/automacao/EmailsCriar.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Brindes'},
                {title: 'Automação de entrega', url: '/brindes/automacao'},
                {title: 'Criar novo e-mail', active: true},
            ],
            pageTitle: 'Criar novo e-mail',
            rule: 'editor',
            pai: 'brindes',
            subTitle: 'Brindes',
            submenu: subbrindes
        },
    },
];

export default rotasAutomacao