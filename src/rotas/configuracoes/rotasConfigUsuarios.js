import subRotaConfiguracoes from "../subRotaConfiguracoes";

const rotasConfigUsuarios = [
    {
        path: 'configuracoes/usuarios',
        name: 'configuracoes-usuarios',
        component: () => import('@/views/configuracoes/Usuarios.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
                {title: 'Configurações de Usuários', active: true},
            ],
            pageTitle: 'Configurações de Usuários',
            rule: 'configuracao_usuario',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: 'configuracoes/usuarios/list',
        name: 'usuarios',
        component: () => import('@/views/usuarios/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
                {title: 'Configurações de Usuários', url: 'configuracoes-usuarios'},
                {title: 'Usuários', active: true},
            ],
            pageTitle: 'Listagem de Usuários',
            rule: 'configuracao_usuario',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: 'configuracoes/usuarios/criar',
        name: 'usuario-criar',
        component: () => import('@/views/usuarios/AddEdit.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
                {title: 'Configurações de Usuários', url: 'configuracoes-usuarios'},
                {title: 'Usuários', url: 'usuarios'},
                {title: 'Criar', active: true},
            ],
            pageTitle: 'Configurar novo usuário',
            rule: 'configuracao_usuario_incluir',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: 'configuracoes/usuarios/editar/:id',
        name: 'usuario-editar',
        component: () => import('@/views/usuarios/AddEdit.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
                {title: 'Configurações de Usuários', url: 'configuracoes-usuarios'},
                {title: 'Usuários', url: 'usuarios'},
                {title: 'Editar', active: true},
            ],
            pageTitle: 'Editar usuário',
            rule: 'configuracao_usuario_editar',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: 'configuracoes/conquistas',
        name: 'conquistas',
        component: () => import('@/views/configuracoes/Conquistas.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
                {title: 'Configurações de Usuários', url: 'configuracoes-usuarios'},
                {title: 'Conquistas', active: true},
            ],
            pageTitle: 'Conquistas',
            rule: 'configuracao_conquista',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: 'configuracoes/conquistas/nova',
        name: 'conquista-nova',
        component: () => import('@/views/conquistas/AddEdit.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
                {title: 'Configurações de Usuários', url: 'configuracoes-usuarios'},
                {title: 'Conquistas', url: 'conquistas'},
                {title: 'Nova Conquista', active: true},
            ],
            pageTitle: 'Nova Conquista',
            rule: 'configuracao_conquista_incluir',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: 'configuracoes/conquistas/editar/:id',
        name: 'conquista-editar',
        component: () => import('@/views/conquistas/AddEdit.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
                {title: 'Configurações de Usuários', url: 'configuracoes-usuarios'},
                {title: 'Conquistas', url: 'conquistas'},
                {title: 'Editar Conquista', active: true},
            ],
            pageTitle: 'Editar Conquista',
            rule: 'configuracao_conquista_editar',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: 'configuracoes/funcoes',
        name: 'funcoes',
        component: () => import('@/views/configuracoes/Funcoes.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
                {title: 'Configurações de Usuários', url: 'configuracoes-usuarios'},
                {title: 'Funções', active: true},
            ],
            pageTitle: 'Configurações das Funções',
            rule: 'configuracao_funcao',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: 'configuracoes/funcoes/criar',
        name: 'funcoes-criar',
        component: () => import('@/views/funcoes/AddEdit'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
                {title: 'Configurações de Usuários', url: 'configuracoes-usuarios'},
                {title: 'Funções', url: 'funcoes'},
                {title: 'Criar', active: true},
            ],
            pageTitle: 'Criar função',
            rule: 'configuracao_funcao_incluir',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: 'configuracoes/funcoes/editar/:id',
        name: 'funcoes-editar',
        component: () => import('@/views/funcoes/AddEdit'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: 'dashboard'},
                {title: 'Configurações de Usuários', url: 'configuracoes-usuarios'},
                {title: 'Funções', url: 'funcoes'},
                {title: 'Editar', active: true},
            ],
            pageTitle: 'Editar função',
            rule: 'configuracao_funcao_editar',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
];

export default rotasConfigUsuarios;
