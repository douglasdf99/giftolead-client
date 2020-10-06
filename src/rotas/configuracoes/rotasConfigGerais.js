import subRotaConfiguracoes from "../subRotaConfiguracoes";
const rotasConfigGerais = [
    {
        path: '/configuracoes/',
        redirect: '/configuracoes/geral',
        rule: 'editor'
    },
    {
        path: '/configuracoes/geral',
        name: 'configuracoes-geral',
        component: () => import('@/views/configuracoes/Geral.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Geral', active: true},
            ],
            pageTitle: 'Configurações Gerais',
            rule: 'configuracao',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/tickets',
        name: 'configuracoes-tickets',
        component: () => import('@/views/configuracoes/Tickets.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Tickets', active: true},
            ],
            pageTitle: 'Configurações de Tickets',
            rule: 'configuracao',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/empresa',
        name: 'dados-empresa',
        component: () => import('@/views/empresa/Show.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Geral', url: '/configuracoes/geral'},
                {title: 'Dados da Empresa', active: true},
            ],
            pageTitle: 'Dados da Empresa',
            rule: 'configuracao_empresa',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/contas',
        name: 'contas',
        component: () => import('@/views/contas/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Geral', url: '/configuracoes/geral'},
                {title: 'Contas', active: true},
            ],
            pageTitle: 'Contas',
            rule: 'configuracao_conta',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/brindes',
        name: 'brindes',
        component: () => import('@/views/brindes/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Geral', url: '/configuracoes/geral'},
                {title: 'Brindes', active: true},
            ],
            pageTitle: 'Brindes',
            rule: 'configuracao_brinde',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/produtos',
        name: 'produtos',
        component: () => import('@/views/produtos/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Geral', url: '/configuracoes/geral'},
                {title: 'Produtos', active: true},
            ],
            pageTitle: 'Produtos',
            rule: 'configuracao_produto',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/produtos/criar',
        name: 'produto-criar',
        component: () => import('@/views/produtos/AddEdit.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Geral', url: '/configuracoes/geral'},
                {title: 'Produtos', url: '/configuracoes/produtos'},
                {title: 'Criar', active: true},
            ],
            pageTitle: 'Configurar novo produto',
            rule: 'configuracao_produto_incluir',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/produtos/editar/:id',
        name: 'produto-editar',
        component: () => import('@/views/produtos/AddEdit.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Geral', url: '/configuracoes/geral'},
                {title: 'Produtos', url: '/configuracoes/produtos'},
                {title: 'Criar', active: true},
            ],
            pageTitle: 'Configurar novo produto',
            rule: 'configuracao_produto_editar',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/links',
        name: 'links',
        component: () => import('@/views/links/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Geral', url: '/configuracoes/geral'},
                {title: 'Links', active: true},
            ],
            pageTitle: 'Configurações de links e ofertas',
            rule: 'configuracao_link',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/links/produto/:id',
        name: 'links-produto',
        component: () => import('@/views/links/Lista.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Geral', url: '/configuracoes/geral'},
                {title: 'Links', active: true},
            ],
            pageTitle: 'Configurações de links e ofertas',
            rule: 'configuracao_link',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/links/produto/:id/editar/:link',
        name: 'links-produto-editar',
        component: () => import('@/views/links/AddEdit.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Geral', url: '/configuracoes/geral'},
                {title: 'Links', url: '/configuracoes/links'},
                {title: 'Editar', active: true},
            ],
            pageTitle: 'Configurações de links e ofertas',
            rule: 'configuracao_link_editar',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/links/produto/:id/criar',
        name: 'links-produto-criar',
        component: () => import('@/views/links/AddEdit.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Geral', url: '/configuracoes/geral'},
                {title: 'Links', url: '/configuracoes/links'},
                {title: 'Criar', active: true},
            ],
            pageTitle: 'Configurações de links e ofertas',
            rule: 'configuracao_link_incluir',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/origens',
        name: 'origens',
        component: () => import('@/views/origens/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Tickets', url: '/configuracoes/tickets'},
                {title: 'Origens', active: true},
            ],
            pageTitle: 'Origens',
            rule: 'configuracao_origem',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/tipo-de-duvida',
        name: 'TipoDeDuvida',
        component: () => import('@/views/tipoDuvida/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Tickets', url: '/configuracoes/tickets'},
                {title: 'Tipo de Dúvidas', active: true},
            ],
            pageTitle: 'Tipo de Dúvidas',
            rule: 'configuracao_tipoduvida',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/motivo-de-perda',
        name: 'motivoDePerda',
        component: () => import('@/views/motivoPerda/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Tickets', url: '/configuracoes/tickets'},
                {title: 'Motivo de Perda', active: true},
            ],
            pageTitle: 'Motivo de Perda',
            rule: 'configuracao_perda',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/status-de-finalizacao',
        name: 'statusDeFinalizacao',
        component: () => import('@/views/statusFinalizacao/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Tickets', url: '/configuracoes/tickets'},
                {title: 'Status de Finalização', active: true},
            ],
            pageTitle: 'Status de Finalização',
            rule: 'configuracao_status',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/mensagem-padrao',
        name: 'mensagem-padrao',
        component: () => import('@/views/mensagemPadrao/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Tickets', url: '/configuracoes/tickets'},
                {title: 'Mensagem Padrão', active: true},
            ],
            pageTitle: 'Mensagem Padrão',
            rule: 'configuracao_mensagem',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/mensagem-padrao/criar',
        name: 'mensagem-padrao-criar',
        component: () => import('@/views/mensagemPadrao/AddEdit.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Geral', url: '/configuracoes/geral'},
                {title: 'Mensagem Padrão', url: '/configuracoes/mensagem-padrao'},
                {title: 'Criar', active: true},
            ],
            pageTitle: 'Configurar mensagem padrão',
            rule: 'configuracao_mensagem_incluir',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/mensagem-padrao/editar/:id',
        name: 'mensagem-padrao-editar',
        component: () => import('@/views/mensagemPadrao/AddEdit.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Geral', url: '/configuracoes/geral'},
                {title: 'Mensagem Padrão', url: '/configuracoes/mensagem-padrao'},
                {title: 'Criar', active: true},
            ],
            pageTitle: 'Editar usuário',
            rule: 'configuracao_mensagem_editar',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/notificacoes',
        name: 'notificacoes',
        component: () => import('@/views/configuracoes/Notificacoes.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Notificações', active: true},
            ],
            pageTitle: 'Notificações',
            rule: 'configuracao',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
];

export default rotasConfigGerais
