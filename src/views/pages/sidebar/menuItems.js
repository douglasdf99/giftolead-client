export default [
    {
        url: '/dashboard/analytics',
        name: "Dashboard",
        tag: "2",
        tagColor: "warning",
        icon: "dashboard",
        slug: 'dashboard-analytics'
    },
    {
        url: null,
        name: "Tickets",
        icon: "all_inbox",
        submenu: [
            {
                url: '/tickets/atender',
                name: "Atender",
                slug: "ticket-atender",
                icon: 'call'
            },
            {
                url: '/tickets/minhas-comissoes',
                name: "Minhas Comissões",
                slug: "ticket-minhas-comissoes",
                icon: 'monetization_on'
            },
        ]
    },
    {
        url: null,
        name: "Planos",
        icon: "extension",
        submenu: [
            {
                url: '/planos/meus-planos',
                name: "Meus Planos",
                slug: "planos-meus-planos",
                icon: 'apps'
            },
        ]
    },
];