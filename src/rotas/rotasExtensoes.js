import subextensoes from "./subRotaExtensoes";

const rotasExtensoes = [
    {
        path: '/extensoes/instalar',
        name: 'extensoes-instalar',
        component: () => import('@/views/extensoes/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Extensões'},
                {title: 'Instalar', active: true},
            ],
            pageTitle: 'Extensões',
            rule: 'extensao',
            pai: 'extensoes',
            subTitle: 'Extensões',
            //subIcon: 'settings',
            submenu: subextensoes
        },
    },
    {
        path: '/extensoes/relatorio',
        name: 'extensoes-relatorio',
        component: () => import('@/views/extensoes/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Extensões'},
                {title: 'Instalar', active: true},
            ],
            pageTitle: 'Extensões',
            rule: 'extensao',
            pai: 'extensoes',
            subTitle: 'Extensões',
            //subIcon: 'settings',
            submenu: subextensoes
        },
    },
    {
        path: '/extensoes/zenvia',
        name: 'extensoes-zenvia-config',
        component: () => import('@/views/extensoes/instalacoes/Zenvia.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Extensões'},
                {title: 'Instalar'},
                {title: 'Zenvia', active: true},
            ],
            pageTitle: 'Instalação do Zenvia',
            rule: 'extensao_zenvia',
            pai: 'extensoes',
            subTitle: 'Extensões',
            //subIcon: 'settings',
            submenu: subextensoes
        },
    },
    {
        path: '/extensoes/slack',
        name: 'extensoes-slack-config',
        component: () => import('@/views/extensoes/instalacoes/Slack.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Extensões'},
                {title: 'Instalar'},
                {title: 'Slack', active: true},
            ],
            pageTitle: 'Instalação do Slack',
            rule: 'extensao_slack',
            pai: 'extensoes',
            subTitle: 'Extensões',
            //subIcon: 'settings',
            submenu: subextensoes
        },
    },
    {
        path: '/extensoes/melhor-envio',
        name: 'extensoes-melhor-envio-config',
        component: () => import('@/views/extensoes/instalacoes/MelhorEnvio.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Extensões'},
                {title: 'Instalar'},
                {title: 'Melhor Envio', active: true},
            ],
            pageTitle: 'Extensão Melhor Envio',
            rule: 'extensao_slack',
            pai: 'extensoes',
            subTitle: 'Extensões',
            //subIcon: 'settings',
            submenu: subextensoes
        },
    },
]

export default rotasExtensoes
