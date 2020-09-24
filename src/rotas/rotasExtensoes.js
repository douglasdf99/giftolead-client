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
            rule: 'editor',
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
            rule: 'editor',
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
            rule: 'editor',
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
                {title: 'Zenvia', active: true},
            ],
            pageTitle: 'Instalação do Slack',
            rule: 'editor',
            pai: 'extensoes',
            subTitle: 'Extensões',
            //subIcon: 'settings',
            submenu: subextensoes
        },
    },
]

export default rotasExtensoes