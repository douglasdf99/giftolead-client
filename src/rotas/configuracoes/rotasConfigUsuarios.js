import subRotaConfiguracoes from "../subRotaConfiguracoes";

const rotasConfigUsuarios = [
    {
        path: '/configuracoes/usuarios',
        name: 'configuracoes-usuarios',
        component: () => import('@/views/configuracoes/Usuarios.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Usuários', active: true},
            ],
            pageTitle: 'Configurações de Usuários',
            rule: 'editor',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/usuarios/list',
        name: 'usuarios',
        component: () => import('@/views/usuarios/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Geral', url: '/configuracoes/geral'},
                {title: 'Usuários', active: true},
            ],
            pageTitle: 'Listagem de Usuários',
            rule: 'editor',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/usuarios/criar',
        name: 'usuario-criar',
        component: () => import('@/views/usuarios/AddEdit.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Geral', url: '/configuracoes/geral'},
                {title: 'Usuários', url: '/configuracoes/usuarios'},
                {title: 'Criar', active: true},
            ],
            pageTitle: 'Configurar novo usuário',
            rule: 'editor',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/usuarios/editar/:id',
        name: 'usuario-editar',
        component: () => import('@/views/usuarios/AddEdit.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Geral', url: '/configuracoes/geral'},
                {title: 'Usuários', url: '/configuracoes/usuarios'},
                {title: 'Criar', active: true},
            ],
            pageTitle: 'Editar usuário',
            rule: 'editor',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/conquistas',
        name: 'conquistas',
        component: () => import('@/views/configuracoes/Conquistas.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Conquistas', active: true},
            ],
            pageTitle: 'Conquistas',
            rule: 'editor',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/conquistas/nova',
        name: 'conquista-nova',
        component: () => import('@/views/conquistas/AddEdit.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Conquistas', url: '/configuracoes/conquistas'},
                {title: 'Nova Conquista', active: true},
            ],
            pageTitle: 'Nova Conquista',
            rule: 'editor',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/conquistas/editar/:id',
        name: 'conquista-editar',
        component: () => import('@/views/conquistas/AddEdit.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Conquistas', url: '/configuracoes/conquistas'},
                {title: 'Editar Conquista', active: true},
            ],
            pageTitle: 'Editar Conquista',
            rule: 'editor',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/funcoes',
        name: 'funcoes',
        component: () => import('@/views/configuracoes/Funcoes.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Funções', active: true},
            ],
            pageTitle: 'Configurações das Funções',
            rule: 'editor',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/funcoes/criar',
        name: 'funcoes-criar',
        component: () => import('@/views/funcoes/AddEdit'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Funções', url: '/configuracoes/funcoes'},
                {title: 'Criar', active: true},
            ],
            pageTitle: 'Criar função',
            rule: 'editor',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
    {
        path: '/configuracoes/funcoes/editar/:id',
        name: 'funcoes-editar',
        component: () => import('@/views/funcoes/AddEdit'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Configurações'},
                {title: 'Funções', url: '/configuracoes/funcoes'},
                {title: 'Editar', active: true},
            ],
            pageTitle: 'Editar função',
            rule: 'editor',
            pai: 'configuracoes',
            subTitle: 'Configurações',
            subIcon: 'settings',
            submenu: subRotaConfiguracoes
        },
    },
];

export default rotasConfigUsuarios