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
        url: '/tickets',
        name: "Tickets",
        slug: 'tickets',
        icon: "all_inbox",
    },
    {
        url: '/comissoes/aprovar',
        name: "Comissões",
        slug: 'comissoes',
        icon: "monetization_on",
    },
    {
        url: '/planos/meus-planos',
        name: "Planos",
        slug: 'planos',
        icon: "extension",
    },
    {
        url: '/leads/listagem',
        name: "Leads",
        slug: 'leads',
        icon: "person_outline",
    },
    {
        url: '/whatsapplist/listagem',
        name: "WhatsappList",
        icon: "favorite_border",
        slug: 'whatsapplist',
    },
    {
        url: '/brindes/campanhas',
        name: "Brindes",
        icon: "redeem",
        slug: 'brindes',
    },
    {
        url: '/extensoes/instalar',
        name: "Extensões",
        icon: "developer_board",
        slug: 'extensoes',
    },
    {
        url: '/configuracoes/geral',
        name: "Configurações",
        icon: "settings",
        slug: 'configuracoes',
    },
]

