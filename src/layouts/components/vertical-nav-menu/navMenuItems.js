import subDashboard from "@/rotas/subRotaDashboard";
import subLeads from "@/rotas/subRotaLeads";
import subBrindes from "@/rotas/subRotaBrindes";
import subConfig from "@/rotas/subRotaConfiguracoes";

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
		url: 'leads-list',
		name: "Leads",
		slug: 'leads-list',
		icon: "person_outline",
		can: 'leads',
		submenu: subLeads
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
];
