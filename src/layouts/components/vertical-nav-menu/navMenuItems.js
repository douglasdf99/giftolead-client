/*=========================================================================================
  File Name: sidebarItems.js
  Description: Sidebar Items list. Add / Remove menu items from here.
  Strucutre:
          url     => router path
          name    => name to display in sidebar
          slug    => router path name
          icon    => Feather Icon component/icon name
          tag     => text to display on badge
          tagColor  => class to apply on badge element
          i18n    => Internationalization
          submenu   => submenu of current item (current item will become dropdown )
                NOTE: Submenu don't have any icon(you can add icon if u want to display)
          isDisabled  => disable sidebar item/group
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default [
    // {
    //   url: "/apps/email",
    //   name: "Email",
    //   slug: "email",
    //   icon: "MailIcon",
    //   i18n: "Email",
    // },
    {
        url: '/dashboard',
        name: "Dashboard",
        tag: "2",
        tagColor: "warning",
        icon: "dashboard",
        slug: 'dashboard'
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
    {
        url: null,
        name: "Configurações",
        icon: "toggle_off",
        submenu: [
            {
                url: '/configuracoes/geral',
                name: "Geral",
                slug: "configuracoes-geral",
                icon: 'view_module'
            },
        ]
    },
]

