import campaignAborted from "@/rotas/campanhas/rotasCampCancelada";
import campaignBankslip from "@/rotas/campanhas/rotasCampBoleto";
import campaignCheckout from "@/rotas/campanhas/rotasCampCheckout";
import campaignSchedule from "@/rotas/campanhas/rotasCampAgendamento";
import campaignWhatsapp from "@/rotas/campanhas/rotasCampWhatsapp";

const rotasPlanos = [
	{
		path: "planos/meus-planos",
		name: "meus-planos",
		component: () => import("@/views/planos/Index.vue"),
		meta: {
			breadcrumb: [
				{ title: "Home", url: "dashboard" },
				{ title: "Planos de Recuperação", active: true },
			],
			pageTitle: "Planos de Recuperação",
			rule: "planos",
			pai: "planos",
			subTitle: "Planos",
		},
	},
	{
		path: "planos/criar",
		name: "planos-criar",
		component: () => import("@/views/planos/AddEdit.vue"),
		meta: {
			breadcrumb: [
				{ title: "Home", url: "dashboard" },
				{ title: "Planos de Recuperação", url: "meus-planos" },
				{ title: "Criar", active: true },
			],
			pageTitle: "Criar Plano de Recuperação",
			rule: "planos_incluir",
			pai: "planos",
			subTitle: "Planos",
		},
	},
	{
		path: "planos/:plan_id/campanha/criar",
		name: "campanha-criar",
		component: () => import("@/views/campanhas/Add.vue"),
		meta: {
			breadcrumb: [
				{ title: "Home", url: "dashboard" },
				{ title: "Planos de Recuperação", url: "meus-planos" },
				{ title: "Gerenciar", url: "planos-gerenciar" },
				{ title: "Criar Campanha", active: true },
			],
			pageTitle: "Nova Campanha de recuperação de venda",
			rule: "planos_campanhas",
			pai: "planos",
			subTitle: "Planos",
		},
	},
	{
		path: "plano/:plan_id",
		name: "planos-gerenciar",
		component: () => import("@/views/planos/Gerenciar.vue"),
		meta: {
			breadcrumb: [
				{ title: "Home", url: "dashboard" },
				{ title: "Planos de Recuperação", url: "meus-planos" },
				{ title: "Gerenciar", active: true },
			],
			pageTitle: "Gerenciar Plano de Recuperação",
			rule: "planos_gerenciar",
			pai: "planos",
			subTitle: "Planos",
		}
	},
    {
		path: "plano/:plan_id",
        component: () => import('@/layouts/main/Cosmos.vue'),
		meta: {
			breadcrumb: [
				{ title: "Home", url: "dashboard" },
				{ title: "Planos de Recuperação", url: "meus-planos" },
				{ title: "Gerenciar", active: true },
			],
			pageTitle: "Gerenciar Plano de Recuperação",
			rule: "planos_gerenciar",
			pai: "planos",
			subTitle: "Planos",
		},
		children: [
			...campaignCheckout,
			...campaignAborted,
			...campaignSchedule,
			...campaignBankslip,
			...campaignWhatsapp,
		],
	},
];

export default rotasPlanos;
