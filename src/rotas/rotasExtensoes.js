import subextensoes from "./subRotaExtensoes";

const rotasExtensoes = [
    {
        path: 'extensoes',
        name: 'extensoes',
        component: () => import('@/views/extensoes/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Extensões', active: true},
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
        path: 'extensoes/relatorio',
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
        path: 'extensoes/zenvia',
        name: 'extensoes-zenvia-config',
        component: () => import('@/views/extensoes/instalacoes/Zenvia.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Extensões', url: '/extensoes'},
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
        path: 'extensoes/slack',
        name: 'extensoes-slack-config',
        component: () => import('@/views/extensoes/instalacoes/Slack.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Extensões', url: '/extensoes'},
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
        path: 'extensoes/melhor-envio',
        name: 'extensoes-melhor-envio-config',
        component: () => import('@/views/extensoes/instalacoes/MelhorEnvio.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Extensões', url: '/extensoes'},
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
    {
        path: 'extensoes/correios',
        name: 'correios',
        component: () => import('@/views/contratos/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Extensões', url: '/extensoes'},
                {title: 'Correios', active: true},
            ],
            pageTitle: 'Contrato dos Correios',
            rule: 'configuracao_contrato',
            pai: 'configuracoes',
            subTitle: 'Extensões',
            subIcon: 'settings',
            submenu: subextensoes
        },
    },
    {
        path: 'extensoes/correios/contratos/criar',
        name: 'contratos-criar',
        component: () => import('@/views/contratos/AddEdit.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Extensões', url: '/extensoes'},
                {title: 'Correios', url: '/extensoes/correios'},
                {title: 'Criar', active: true},
            ],
            pageTitle: 'Novo Contrato',
            rule: 'configuracao_contrato_incluir',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subextensoes
        },
    },
    {
        path: 'extensoes/correios/contratos/editar/:id',
        name: 'contratos-editar',
        component: () => import('@/views/contratos/AddEdit.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Extensões', url: '/extensoes'},
                {title: 'Correios', url: '/extensoes/correios'},
                {title: 'Editar', active: true},
            ],
            pageTitle: 'Editar Contrato',
            rule: 'configuracao_contrato_editar',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subextensoes
        },
    },
    {
        path: 'extensoes/correios/contratos/servicos/:id',
        name: 'contratos-servicos',
        component: () => import('@/views/contratos/Servicos.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Extensões', url: '/extensoes'},
                {title: 'Correios', url: '/extensoes/correios'},
                {title: 'Serviços', active: true},
            ],
            pageTitle: 'Configurar Serviços do Contrato',
            rule: 'configuracao_contrato_frete',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subextensoes
        },
    },
];

export default rotasExtensoes;
