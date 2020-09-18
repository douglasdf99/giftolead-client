import subtickets from "./subRotaTicket";

const rotasTickets = [
    {
        path: '/tickets',
        name: 'tickets-list',
        component: () => import('@/views/tickets/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Tickets'},
                {title: 'Listagem', active: true},
            ],
            pageTitle: 'Tickets de Recuperação',
            rule: 'editor',
            pai: 'tickets',
            subTitle: 'Tickets',
            //subIcon: 'settings',
            submenu: subtickets
        },
    },
    {
        path: '/tickets/atender/:id',
        name: 'tickets-atender',
        component: () => import('@/views/tickets/Atender.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Tickets'},
                {title: 'Listagem', url: '/tickets'},
                {title: 'Atender', active: true},
            ],
            pageTitle: 'Atendendo Ticket',
            rule: 'editor',
            pai: 'tickets',
            subTitle: 'Tickets',
            //subIcon: 'settings',
            submenu: subtickets
        },
    },
    {
        path: '/agenda',
        name: 'agenda',
        component: () => import('@/views/tickets/Agenda.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Tickets'},
                {title: 'Agenda', active: true},
            ],
            pageTitle: 'Agenda',
            rule: 'editor',
            pai: 'tickets',
            subTitle: 'Tickets',
            //subIcon: 'settings',
            submenu: subtickets
        },
    },
    {
        path: '/minhas-comissoes',
        name: 'minhas-comissoes',
        component: () => import('@/views/minhasComissoes/Index.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Tickets'},
                {title: 'Meus atendimentos comissionados', active: true},
            ],
            pageTitle: 'Meus atendimentos comissionados',
            rule: 'editor',
            pai: 'tickets',
            subTitle: 'Tickets',
            //subIcon: 'settings',
            submenu: subtickets
        },
    },
]

export default rotasTickets