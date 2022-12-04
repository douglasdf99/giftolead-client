<template>
	<div>
		<hot-structure>
			<hot-menu slot="menu" style="z-index: 405">
				<hot-header slot="header">
					<router-link
						class="logo-link"
						slot="logo-link"
					></router-link>
					<span class="text-2xl" slot="brand-name">Pro</span>
					<div slot="header-actions">
						<div class="flex items-center justify-center">
							<hot-dropdown class="pr-5 w-full cosmos_dropdown_large">
								<div slot="button" class="cursor-pointer">
									<font-awesome-icon
										size="lg"
										icon="fa-solid fa-building "
									/>
								</div>
								<hot-dropdown-menu-header
									slot="menu"
									class="font-bold pl-3 text-base p-1"
									>Empresas que eu participo</hot-dropdown-menu-header
								>
								<hot-dropdown-menu-item
									slot="menu"
									v-for="company in user.companies"
									:key="company.slug"
									:class="context == company.slug ? 'active' : ''"
								>
									<div
										class="flex items-center"
										@click="
											$router.push({
												name: 'dashboard',
												params: { company_slug: company.slug },
											})
										"
									>
										<vs-avatar
											size="35px"
											:text="company.apelido"
											class="text-lg bg-primary mr-3"
										/>
										<div>
											<p class="mb-1 text-base font-light">
												{{ company.apelido }}
											</p>
											<p class="mb-0 text-sm text-gray-500">
												{{ company.role_name }}
											</p>
										</div>
									</div>
								</hot-dropdown-menu-item>
							</hot-dropdown>

							<hot-dropdown class="pr-4 mr-4">
								<div slot="button" class="bg-none">
									<vs-avatar
										size="25px"
										:text="user.displayName"
										class="text-lg p-0 mb-0 bg-primary"
									/>
								</div>
								<hot-dropdown-menu-item
									slot="menu"
									@click="$router.push({ name: 'profile' })"
									>Meu Perfil
								</hot-dropdown-menu-item>
								<hot-dropdown-menu-item slot="menu" @click="logOff"
									>Sair</hot-dropdown-menu-item
								>
							</hot-dropdown>
						</div>
					</div>
				</hot-header>

				<div slot="product-name">Saveleads</div>
				<div class="_hot-scroll">
					<nav class="hot-application__menu-items">
						<div v-for="item in navMenuItems" :key="item.slug">
							<transition name="fade">
								<hot-menu-item
									:open="
										item.submenu
											? item.submenu.find(
													(element) => element.slug == $route.name
											  )
											: false
									"
									@click="
										item.submenu
											? null
											: $router.push({ name: item.slug })
									"
									:class="
										item.submenu
											? null
											: $route.name == item.slug
											? 'active'
											: ''
									"
									v-if="$acl.check(item.can)"
								>
									<font-awesome-icon
										:icon="item.icon"
										size="lg"
										class="ml-2 w-5"
									></font-awesome-icon>
									<span class="ml-5 text-2xl"> {{ item.name }}</span>
									<hot-menu-item
										class="sub_menu"
										v-if="$acl.check(sub.can)"
										slot="collapsed"
										v-for="sub in item.submenu"
										:key="sub.slug"
										@click="$router.push({ name: sub.slug })"
										:class="
											$route.name == sub.slug
												? 'active sub_active'
												: ''
										"
									>
										<span>{{ sub.name }}</span>
									</hot-menu-item>
								</hot-menu-item>
							</transition>
						</div>
					</nav>
				</div>
			</hot-menu>

			<hot-content slot="content">
				<div class="router-view relative">
					<div class="router-content">
						<transition :name="routerTransition">
							<div
								v-if="$route.meta.breadcrumb || $route.meta.pageTitle"
								class="items-center mb-5"
							>
								<vx-breadcrumb
									class="md:block hidden my-8"
									v-if="$route.meta.breadcrumb"
									:route="$route"
									:isRTL="$vs.rtl"
								/>
								<div
									class="content-area__heading"
									:class="{ 'pr-4 border-0': $route.meta.breadcrumb }"
								>
									<h2 class="mb-1">{{ $route.meta.pageTitle }}</h2>
								</div>
							</div>
						</transition>

						<div class="content-area__content">
							<back-to-top
								bottom="5%"
								:right="$vs.rtl ? 'calc(100% - 2.2rem - 38px)' : '30px'"
								visibleoffset="500"
								v-if="!hideScrollToTop"
							>
								<vs-button
									icon-pack="feather"
									icon="icon-arrow-up"
									class="shadow-lg btn-back-to-top"
								/>
							</back-to-top>

							<transition :name="routerTransition" mode="out-in">
								<router-view
									@changeRouteTitle="changeRouteTitle"
									@setAppClasses="
										(classesStr) => $emit('setAppClasses', classesStr)
									"
								/>
							</transition>
						</div>
					</div>
				</div>
			</hot-content>
		</hot-structure>
	</div>
</template>

<script>


import BackToTop from "vue-backtotop";
import TheNavbarVertical from "@/layouts/components/navbar/TheNavbarVertical.vue";
import TheFooter from "@/layouts/components/TheFooter.vue";
import themeConfig from "@/../themeConfig.js";
import VNavMenu from "@/layouts/components/vertical-nav-menu/VerticalNavMenu.vue";
import VNavMenu2 from "@/layouts/components/vertical-nav-menu/SidebarStatic.vue";
import moduleExtensoes from "@/store/extensoes/moduleExtensoes";

export default {
	components: {
		VNavMenu2,
		BackToTop,
		TheFooter,
		TheNavbarVertical,
		VNavMenu,
	},
	data() {
		return {
			realtimeConnect: false,
			//disableThemeTour: themeConfig.disableThemeTour,
			disableThemeTour: true,
			dynamicWatchers: {},
			footerType: themeConfig.footerType || "static",
			hideScrollToTop: themeConfig.hideScrollToTop,
			isNavbarDark: false,
			navbarColor: themeConfig.navbarColor || "#fff",
			navbarType: themeConfig.navbarType || "sticky",
			navMenuItems: [],
			routerTransition: themeConfig.routerTransition || "none",
			routeTitle: this.$route.meta.pageTitle,
			steps: [
				{
					target: "#btnVNavMenuMinToggler",
					content: "Toggle Collapse Sidebar.",
				},
				{
					target: ".vx-navbar__starred-pages",
					content:
						"Create your own bookmarks. You can also re-arrange them using drag & drop.",
				},
				{
					target: ".i18n-locale",
					content: "You can change language from here.",
				},
				{
					target: ".navbar-fuzzy-search",
					content: "Try fuzzy search to visit pages in flash.",
				},
				{
					target: ".customizer-btn",
					content: "Customize template based on your preference",
					params: {
						placement: "left",
					},
				},
				{
					target: ".vs-button.buy-now",
					content: "Buy this awesomeness at affordable price!",
					params: {
						placement: "top",
					},
				},
			],
			displayItemName: false,
		};
	},
	watch: {
		
	},
	computed: {
		user() {
			return this.$store.state.auth.AppActiveUser;
		}
	},
	async created() {
		const color =
			this.navbarColor === "#fff" && this.isThemeDark
				? "#10163a"
				: this.navbarColor;
		this.updateNavbarColor(color);
		//this.setNavMenuVisibility(this.$store.state.mainLayoutType);

		this.dynamicWatchers.windowWidth = this.$watch(
			"$store.state.windowWidth",
			(val) => {
				if (val < 1200) {
					this.disableThemeTour = true;
					this.dynamicWatchers.windowWidth();
				}
			}
		);

		this.dynamicWatchers.verticalNavMenuWidth = this.$watch(
			"$store.state.verticalNavMenuWidth",
			() => {
				this.disableThemeTour = true;
				this.dynamicWatchers.verticalNavMenuWidth();
			}
		);

		this.dynamicWatchers.rtl = this.$watch("$vs.rtl", () => {
			this.disableThemeTour = true;
			this.dynamicWatchers.rtl();
		});

		if (!moduleExtensoes.isRegistered) {
			this.$store.registerModule("extensoes", moduleExtensoes);
			moduleExtensoes.isRegistered = true;
		}

		//await this.getMenus();
		await this.getExtensoes();
	},
	beforeDestroy() {
		Object.keys(this.dynamicWatchers).map((i) => {
			this.dynamicWatchers[i]();
			delete this.dynamicWatchers[i];
		});
	},
	methods: {
		logOff() {
			console.log("App active User", this.$store.state.auth.AppActiveUser);
		},
		async canSee(slug) {
			let route = await this.$router.match({ name: slug });
			console.log(route.meta.rule);
			let can = await this.$acl.check(route.meta.rule);
			console.log(
				"slug ",
				slug,
				"meta",
				route.meta,
				"can",
				can,
				"check",
				this.$acl.check(route.meta.rule)
			);

			return true;
		},
		changeRouteTitle(title) {
			this.routeTitle = title;
		},
		updateNavbar(val) {
			if (val === "static")
				this.updateNavbarColor(this.isThemeDark ? "#10163a" : "#fff");
			this.navbarType = val;
		},
		updateNavbarColor(val) {
			this.navbarColor = val;
			if (val === "#fff") this.isNavbarDark = false;
			else this.isNavbarDark = true;
		},
		updateFooter(val) {
			this.footerType = val;
		},
		updateRouterTransition(val) {
			this.routerTransition = val;
		},
		setNavMenuVisibility(layoutType) {
			if (
				(layoutType === "horizontal" && this.windowWidth >= 1200) ||
				(layoutType === "vertical" && this.windowWidth < 1200)
			) {
				// this.$store.dispatch("toggleIsVerticalNavMenuActive", false);
				//this.$store.dispatch("TOGGLE_IS_VERTICAL_NAV_MENU_2_ACTIVE", false);
				this.$store.dispatch("updateVerticalNavMenuWidth", "no-nav-menu");
			} else {
				this.$store.dispatch("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", true);
				//this.$store.dispatch("TOGGLE_IS_VERTICAL_NAV_MENU_2_ACTIVE", true);
			}
		},
		toggleHideScrollToTop(val) {
			this.hideScrollToTop = val;
		},
		getMenus() {
			this.$store.dispatch("getMainMenu").then((response) => {
				this.navMenuItems = [...response];
			});
		},
		getExtensoes() {
			if (this.extensoes.length === 0) {
				this.$store.dispatch("extensoes/get").then((response) => {
					let arr = response.extensoes;
					if (arr) {
						arr.forEach((item) => {
							this.$store.dispatch("setExtensao", item);
						});
					}
				});
			}
		},
		mouseEnterMenu(value) {
			this.displayItemName = !this.menuMinimized() ? true : value;
		},
		menuMinimized() {
			const menu = document.querySelector("hot-menu");
			if (menu) return menu.classList.length > 0;
		},
	},
};
</script>
<style>
.cosmos_dropdown_large {
	--dropdown-menu-width: 299px;
}
.cosmos_dropdown_large .active {
	background-color: #fdede7;
	color: #c5310a;
}
.sub_menu {
	--spacer-2: 1rem;
	--spacer-7: 4rem;
}
.sub_active {
	--gray-200: #c5310a;
}
</style>
