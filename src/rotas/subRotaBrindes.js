const subbrindes = [
    {
        url: 'brindes',
        name: "Listagem",
        slug: "brindes",
        icon: 'redeem',
        can: 'configuracao_brinde_incluir'
    },
    {
        url: 'brindes/embalagens',
        name: "Embalagens",
        slug: "embalagens",
        icon: 'redeem',
        can: 'configuracao_embalagens'
    },
    {
        url: 'brindes/campanhas',
        name: "Campanhas",
        slug: "brindes-campanhas",
        icon: 'redeem',
        can: 'brinde_campanha'
    },
    {
        url: 'brindes/solicitacoes',
        name: "Solicitações",
        slug: "brindes-solicitacoes",
        icon: 'contact_mail',
        can: 'brinde_solicitacao'
    },
    {
        url: 'brindes/automacao',
        name: "Entregas",
        slug: "brindes-automacao",
        icon: 'local_shipping',
        can: 'brinde_automacao'
    },
    {
        url: 'brindes/expedicoes-escolha',
        name: "Expedições",
        slug: "brindes-expedicoes-escolha",
        icon: 'local_shipping',
        can: 'brinde_expedicao'
    },
    // {
    //     url: 'brindes/expedicoes-melhor-envio',
    //     name: "Expedições Melhor Envio",
    //     slug: "brindes-expedicoes-melhorenvio",
    //     icon: 'local_shipping',
    //     can: 'brinde_expedicao'
    // },
    {
        url: 'brindes/automacao/emails',
        name: "Configurar e-mails",
        slug: "brindes-expedicoes",
        icon: 'email',
        can: 'brinde_automacao_email'
    },
];

export default subbrindes;
