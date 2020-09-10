import subcomissoes from "./subRotaComissoes";

const rotasComissoes = [
    {
        path: '/comissoes/aprovar',
        name: 'comissoes-aprovar',
        component: () => import('@/views/comissoes/Aprovar.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Comissões'},
                {title: 'Aprovar', active: true},
            ],
            pageTitle: 'Comissões a aprovar',
            rule: 'editor',
            pai: 'comissoes',
            subTitle: 'Comissões',
            submenu: subcomissoes
        },
    },
];

export default rotasComissoes