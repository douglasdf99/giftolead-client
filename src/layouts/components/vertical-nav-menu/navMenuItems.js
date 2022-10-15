import subDashboard from "@/rotas/subRotaDashboard";
import subTickets from "@/rotas/subRotaTicket";
import subComissoes from "@/rotas/subRotaComissoes";
import subLeads from "@/rotas/subRotaLeads";
import subBrindes from "@/rotas/subRotaBrindes";
import subConfig from "@/rotas/subRotaConfiguracoes";
import subRelatorios from "../../../rotas/subRotaRelatorios";

export default [
	{
		url: 'dashboard',
		name: "Dashboard",
		icon: "dashboard",
		slug: 'dashboard',
		can: 'public',
		submenu: subDashboard
	},
	{
		url: 'tickets-list',
		name: "Tickets",
		slug: 'tickets-list',
		icon: "all_inbox",
		can: 'ticket',
		submenu: subTickets
	},
	{
		url: 'comissoes-todas',
		name: "Comissões",
		slug: 'comissoes-todas',
		icon: "monetization_on",
		can: 'comissao_pendente',
		submenu: subComissoes
	},
	{
		url: 'meus-planos',
		name: "Planos",
		slug: 'meus-planos',
		icon: "extension",
		can: 'planos',
	},
	{
		url: 'leads-list',
		name: "Leads",
		slug: 'leads-list',
		icon: "person_outline",
		can: 'leads',
		submenu: subLeads
	},
	{
		url: 'whatsapplist-list',
		name: "WhatsappList",
		icon: "favorite_border",
		slug: 'whatsapplist-list',
		can: 'whatsapplist',
	},
	{
		url: 'brindes',
		name: "Brindes",
		icon: "redeem",
		slug: 'brindes',
		can: 'brinde',
		submenu: subBrindes
	},
	{
		url: 'extensoes',
		name: "Extensões",
		icon: "developer_board",
		slug: 'extensoes',
		can: 'extensao'
	},
	{
		url: 'configuracoes-geral',
		name: "Configurações",
		icon: "settings",
		slug: 'configuracoes-geral',
		can: 'configuracao',
		submenu: subConfig
	},
	{
		url: 'relatorio-vendas-recuperadas',
		name: "Relatórios",
		icon: "toggle_off",
		slug: 'relatorio-vendas-recuperadas',
		can: 'relatorios',
		submenu: subRelatorios
	},
];
