const rotasWhatsapplist = [
    {
        path: '/whatsapplist/listagem',
        name: 'whatsapplist-list',
        component: () => import('@/views/whatsapplist/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'WhatsappList'},
                {title: 'Listagem', active: true},
            ],
            pageTitle: 'Contatos da Whatsapplist',
            rule: 'whatsapplist',
            pai: 'whatsapplist',
            subTitle: 'WhatsappList',
            submenu: [{
                url: '/whatsapplist/listagem',
                name: "Listagem",
                slug: "whatsapplist",
                icon: 'favorite_border'
            }],
        },
    },
]

export default rotasWhatsapplist
