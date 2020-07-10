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
]

export default rotasTickets