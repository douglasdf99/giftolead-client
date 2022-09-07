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
		icon: "fa-solid fa-gauge-max",
		slug: 'dashboard',
		can: 'public',
		submenu: subDashboard
	},
	{
		url: 'tickets',
		name: "Tickets",
		slug: 'tickets',
		icon: "fa-solid fa-ticket",
		can: 'ticket',
		submenu: subTickets
	},
	{
		url: 'comissoes/todas',
		name: "Comissões",
		slug: 'comissoes',
		icon: "fa-solid fa-trophy-star",
		can: 'comissao',
		submenu: subComissoes
	},
	{
		url: 'planos/meus-planos',
		name: "Planos",
		slug: 'meus-planos',
		icon: "fa-solid fa-bullseye-arrow",
		can: 'planos',
	},
	{
		url: 'leads/listagem',
		name: "Leads",
		slug: 'leads',
		icon: "fa-solid fa-address-book",
		can: 'leads',
		submenu: subLeads
	},
	{
		url: 'whatsapplist/listagem',
		name: "WhatsappList",
		icon: "fa-brands fa-whatsapp",
		slug: 'whatsapplist-list',
		can: 'whatsapplist',
	},
	{
		url: 'brindes/campanhas',
		name: "Brindes",
		icon: "fa-solid fa-gifts",
		slug: 'brindes',
		can: 'brinde',
		submenu: subBrindes
	},
	{
		url: 'extensoes',
		name: "Extensões",
		icon: "fa-solid fa-puzzle",
		slug: 'extensoes',
		can: 'extensao'
	},
	{
		url: 'configuracoes/geral',
		name: "Configurações",
		icon: "fa-solid fa-gear",
		slug: 'configuracoes',
		can: 'configuracao',
		submenu: subConfig
	},
	{
		url: 'relatorios/geral',
		name: "Relatórios",
		icon: "fa-solid fa-memo",
		slug: 'relatorios',
		can: 'relatorios',
		submenu: subRelatorios
	},
];
