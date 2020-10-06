import subRotaConfiguracoes from "../subRotaConfiguracoes";

const rotasExpedicoesContratos = [
    {
        path: '/configuracoes/expedicoes',
        name: 'configuracoes-expedicoes',
        component: () => import('@/views/configuracoes/Expedicoes.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Expedições', active: true},
            ],
            pageTitle: 'Configurações de Expedições',
            rule: 'configuracao',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/embalagens',
        name: 'embalagens',
        component: () => import('@/views/embalagens/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Geral', url: '/configuracoes/geral'},
                {title: 'Embalagens', active: true},
            ],
            pageTitle: 'Embalagens',
            rule: 'configuracao_embalagens',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/contratos',
        name: 'contratos',
        component: () => import('@/views/contratos/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Expedições', url: '/configuracoes/expedicoes'},
                {title: 'Contrato', active: true},
            ],
            pageTitle: 'Contrato',
            rule: 'configuracao_contrato',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/contratos/criar',
        name: 'contratos-criar',
        component: () => import('@/views/contratos/AddEdit.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Expedições', url: '/configuracoes/expedicoes'},
                {title: 'Contratos', url: '/configuracoes/contratos'},
                {title: 'Criar', active: true},
            ],
            pageTitle: 'Novo Contrato',
            rule: 'configuracao_contrato_incluir',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/contratos/editar/:id',
        name: 'contratos-editar',
        component: () => import('@/views/contratos/AddEdit.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Expedições', url: '/configuracoes/expedicoes'},
                {title: 'Contratos', url: '/configuracoes/contratos'},
                {title: 'Editar', active: true},
            ],
            pageTitle: 'Editar Contrato',
            rule: 'configuracao_contrato_editar',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/contratos/servicos/:id',
        name: 'contratos-servicos',
        component: () => import('@/views/contratos/Servicos.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Expedições', url: '/configuracoes/expedicoes'},
                {title: 'Contratos', url: '/configuracoes/contratos'},
                {title: 'Serviços', active: true},
            ],
            pageTitle: 'Configurar Contrato',
            rule: 'configuracao_contrato_frete',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
]

export default rotasExpedicoesContratos
