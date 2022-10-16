import Vue from "vue";
import Router from "vue-router";

import comissions from "@/rotas/rotasComissoes";
import dashboard from "@/rotas/rotasDashboard";
import extensions from "@/rotas/rotasExtensoes";
import gifts from "@/rotas/rotasBrindes";
import leads from "@/rotas/rotasLeads";
import plans from "@/rotas/rotasPlanos";
import reports from "@/rotas/rotasRelatorios";
import settings from "@/rotas/configuracoes/rotasConfigGerais";
import tickets from "@/rotas/rotasTickets";
import users from "@/rotas/configuracoes/rotasConfigUsuarios";
import whatsapp from "@/rotas/rotasWhatsapplist";
import workflows from "@/rotas/rotasAutomacao";

import subRotaPlanos from "./rotas/subRotaPlanos";
import { initAuthSSO, traitContext } from "./components/producer";
import { changeBaseUrl } from "./axios";

const VUE_ROUTER_MODE = "history";
const VUE_BASE_URL = process.env.BASE_URL;

const scrollBehavior = function () {
	return { x: 0, y: 0 };
};
const originalPush = Router.prototype.push;

Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch((err) => err);
};

Vue.use(Router);

const PRODUCER_CONTEXT = [
	...dashboard,
	...settings,
	...users,
	...tickets,
	...plans,
	...leads,
	...whatsapp,
	...extensions,
	...gifts,
	...workflows,
	...reports,
	...comissions,
	{
		path: "planos/relatorios",
		name: "planos-relatorios",
		component: () => import("@/views/planos/Index.vue"),
		meta: {
			breadcrumb: [
				{ title: "Home", url: "dashboard" },
				{ title: "Planos" },
				{ title: "Relatórios", active: true },
			],
			pageTitle: "Relatórios de Planos de Recuperação",
			rule: "editor",
			pai: "planos",
			subTitle: "Planos",
			//subIcon: 'settings',
			submenu: subRotaPlanos,
		},
	},
];

const PUBLIC_CONTEXT = [
	{
		path: "",
		component: () => import("@/layouts/main/OnlyTopBar.vue"),
		children: [
			{
				path: "/",
				name: "indexall",
				component: () => import("@/views/panel/Index.vue"),
				meta: {
					breadcrumb: [
						{ title: "Home" },
						{ title: "Painel", active: true },
					],
					pageTitle: "Painel",
					pageDesc: "Tenha acesso a todas as empresas a que você percente!",
					subTitle: "Painel",
					authRequired: true,
					rule: "public",
				},
			},
		],
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('@/views/pages/login/Login.vue'),
		meta: {
		   rule: 'public'
		}
	 },
	{
		path: '/register',
		name: 'register',
		component: () => import('@/views/pages/register/Register.vue'),
		meta: {
		   rule: 'public'
		}
	 },
	{
		path: "/pages/lock-screen",
		name: "page-lock-screen",
		component: () => import("@/views/pages/LockScreen.vue"),
		meta: {
			rule: "public",
		},
	},
	{
		path: "/pages/comingsoon",
		name: "page-coming-soon",
		component: () => import("@/views/pages/ComingSoon.vue"),
		meta: {
			rule: "public",
		},
	},
	{
		path: "/404",
		name: "page-error-404",
		component: () => import("@/views/pages/Error404.vue"),
		meta: {
			rule: "public",
		},
	},
	{
		path: "/404-company",
		name: "page-error-404-company",
		component: () => import("@/views/pages/CompanyNotFound.vue"),
		meta: {
			rule: "public",
		},
	},
	{
		path: "/500",
		name: "page-error-500",
		component: () => import("@/views/pages/Error500.vue"),
		meta: {
			rule: "public",
		},
	},
	{
		path: "/nao-autorizado",
		name: "nao-autorizado",
		component: () => import("@/views/pages/NotAuthorized.vue"),
		meta: {
			rule: "public",
		},
	},
	{
		path: "/esqueceu-a-senha",
		name: "esqueceu-a-senha",
		component: () => import("@/views/pages/ForgotPassword.vue"),
		meta: {
			rule: "public",
		},
	},
	{
		path: "/recuperar-a-senha/:token",
		name: "recuperar-a-senha",
		component: () => import("@/views/pages/RecuperarSenha.vue"),
		meta: {
			rule: "public",
		},
	},
	{
		path: "/company-not-authorized",
		name: "nao-autorizado",
		component: () => import("@/views/pages/CompanyNotAuthorized.vue"),
		meta: {
			rule: "public",
		},
	},
	{
		path: "/pages/maintenance",
		name: "page-maintenance",
		component: () => import("@/views/pages/Maintenance.vue"),
		meta: {
			rule: "public",
		},
	},
	{
		path: "/pages/novo-side-bar",
		name: "sidebar",
		component: () => import("@/views/pages/sidebar/NovoSidebar.vue"),
		meta: {
			rule: "public",
		},
	},
	{
		path: "/agendamento",
		name: "agendamento-link",
		component: () => import("@/views/pages/AgendamentoLink.vue"),
		meta: {
			rule: "public",
		},
	},
];

const publicContext = {
	path: "",
	component: () => import("@/layouts/full-page/FullPage.vue"),
	children: PUBLIC_CONTEXT,
};

const privateContext = {
	path: '/:company_slug',
	component: () => import('./layouts/main/Base.vue'),
   meta: {authRequired: true},
   children: PRODUCER_CONTEXT
};

const errorContext = {
	path: "*",
	redirect: "/404",
};

const securityContext = {
	path: "/auth/login",
	component: () => import("@/views/Callback.vue"),
	meta: {
		rule: "public",
	},
};

const logoutContext = {
	path: "/auth/logout",
	component: () => import("@/views/CallbackLogout.vue"),
	meta: {
		rule: "public",
	},
};

const router = new Router({
	mode: VUE_ROUTER_MODE,
	base: VUE_BASE_URL,
	scrollBehavior,
	routes: [publicContext, privateContext, errorContext, securityContext, logoutContext],
});
router.beforeEach(async (to, from, next) => {
	const menu = document.querySelector('hot-menu hot-collapse[active]');
	if (menu)
		menu.removeAttribute('active');
		
	if (to.params.company_slug) {
		traitContext(to.params.company_slug);
	}
	await changeBaseUrl(to.params.company_slug||'master');

	if (to.matched.some((record) => record.meta.authRequired)) {
		try {
			await initAuthSSO();
			return next();
		} catch (error) {
			if (error.response && error.response.status == 403) {
				router.push("/nao-autorizado");
			}
			return next(false);
		}
	} else {
		return next();
	}
});

router.afterEach(() => {
	const appLoading = document.getElementById("loading-bg");
	if (appLoading) {
		appLoading.style.display = "none";
	}
});

export default router;
