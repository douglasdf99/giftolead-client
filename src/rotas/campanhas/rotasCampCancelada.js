import subRotaPlanos from "../subRotaPlanos";
const rotasCampCancelada = [
    {
        path: '/campanha/configurar-canceladas/:id',
        name: 'campanha-config-canceladas',
        component: () => import('@/views/campanhas/cancelada/Canceladas.vue'),
        meta: {
            breadcrumb: [
                {title: 'Home', url: '/'},
                {title: 'Planos', url: '/planos/meus-planos'},
                {title: 'Gerenciar'},
                {title: 'Configurar Campanha', active: true},
            ],
            pageTitle: 'Configuração da campanha de recuperação de canceladas',
            rule: 'editor',
            pai: 'planos',
            subTitle: 'Planos',
            //subIcon: 'settings',
            submenu: subRotaPlanos
        },
    },
  {
    path: '/campanha/configurar-canceladas/:id/contatos-ativos',
    name: 'campanha-config-canceladas-contatos-ativos',
    component: () => import('@/views/campanhas/cancelada/Contatos.vue'),
    meta: {
      breadcrumb: [
        {title: 'Home', url: '/'},
        {title: 'Planos', url: '/planos/meus-planos'},
        {title: 'Gerenciar'},
        {title: 'Contatos Ativos', active: true}
      ],
      pageTitle: 'Contatos ativos da campanha',
      rule: 'editor',
      pai: 'planos',
      subTitle: 'Planos',
      //subIcon: 'settings',
      submenu: subRotaPlanos
    },
  },
  {
    path: '/campanha/configurar-canceladas/:id/contatos-inativos',
    name: 'campanha-config-canceladas-contatos-inativos',
    component: () => import('@/views/campanhas/cancelada/Contatos.vue'),
    meta: {
      breadcrumb: [
        {title: 'Home', url: '/'},
        {title: 'Planos', url: '/planos/meus-planos'},
        {title: 'Gerenciar'},
        {title: 'Contatos Inativos', active: true}
      ],
      pageTitle: 'Contatos inativos da campanha',
      rule: 'editor',
      pai: 'planos',
      subTitle: 'Planos',
      //subIcon: 'settings',
      submenu: subRotaPlanos
    },
  },
  {
    path: '/campanha/configurar-canceladas/:id/contatos-todos',
    name: 'campanha-config-canceladas-contatos-todos',
    component: () => import('@/views/campanhas/cancelada/Contatos.vue'),
    meta: {
      breadcrumb: [
        {title: 'Home', url: '/'},
        {title: 'Planos', url: '/planos/meus-planos'},
        {title: 'Gerenciar'},
        {title: 'Todos os contatos', active: true}
      ],
      pageTitle: 'Todos os contatos da campanha',
      rule: 'editor',
      pai: 'planos',
      subTitle: 'Planos',
      //subIcon: 'settings',
      submenu: subRotaPlanos
    },
  },
]

export default rotasCampCancelada
