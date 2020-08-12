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
            pai: 'tickets',
            subTitle: 'Extensões',
            //subIcon: 'settings',
            submenu: subextensoes
        },
    },
]

export default rotasExtensoes