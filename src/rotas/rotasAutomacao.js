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
];

export default rotasAutomacao