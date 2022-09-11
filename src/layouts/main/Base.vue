<!-- =========================================================================================
    File Name: Main.vue
    Description: Main layout
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
	<div class="layout--main" :class="[layoutTypeClass, navbarClasses, footerClasses, {'no-scroll': isAppPage}]">

		<v-nav-menu :navMenuItems="navMenuItems" title="Vuexy" parent=".layout--main"/>
		<v-nav-menu-2 title="Vuexy" parent=".layout--main"/>

		<div id="content-area" :class="[contentAreaClass, {'show-overlay': bodyOverlay}]">
			<div id="content-overlay"/>

			<!-- Navbar -->
			<template v-if="mainLayoutType === 'horizontal' && windowWidth >= 1200">
				<the-navbar-horizontal
					:navbarType="navbarType"
					:class="[
          {'text-white' : isNavbarDark  && !isThemeDark},
          {'text-base'  : !isNavbarDark && isThemeDark}
        ]"/>

				<div style="height: 62px" ></div>

				<h-nav-menu
					:class="[
          {'text-white' : isNavbarDark  && !isThemeDark},
          {'text-base'  : !isNavbarDark && isThemeDark}
        ]"
					:navMenuItems="navMenuItems"/>
			</template>

			<template v-else>
				<the-navbar-vertical
					:navbarColor="navbarColor"
					:class="[
          {'text-white' : isNavbarDark  && !isThemeDark},
          {'text-base'  : !isNavbarDark && isThemeDark}
        ]"/>
		<div style="height: 90px" ></div>
			</template>
			<!-- /Navbar -->

			<div class="content-wrapper">
				<transition :name="routerTransition">
					<div class="menu-statico-2">
						<vx-card>
							<vs-collapse>
								<vs-collapse-item>
									<div slot="header">
										<span class="menuSelected">
											<vs-icon icon-pack="material-icons" :icon="$route.meta.subIcon"/>
											{{ $route.meta.subTitle }}
										</span>
									</div>
									<div class="ml-10">
										<vs-list>
											<router-link v-for="item in $route.meta.submenu" :key="item.name" :to="item.url"
															 class="menu-statico-2-link"
															 :class="{'menu-ativo' : activeLink(item.url)}">
												<vs-list-item icon-pack="material-icons" :icon="item.icon" :title="item.name"/>
											</router-link>
										</vs-list>
									</div>
								</vs-collapse-item>
							</vs-collapse>
						</vx-card>
					</div>
				</transition>
				<div class="router-view relative">
					<div class="router-content">
						<transition :name="routerTransition">
							<div v-if="$route.meta.breadcrumb || $route.meta.pageTitle" class="items-center mb-5">
								<vx-breadcrumb class="md:block hidden mb-12" v-if="$route.meta.breadcrumb" :route="$route"
													:isRTL="$vs.rtl"/>

								<div class="content-area__heading"
									  :class="{'pr-4 border-0' : $route.meta.breadcrumb}">
									<h2 class="mb-1">{{ $route.meta.pageTitle }}</h2>
								</div>
							</div>
						</transition>

						<div class="content-area__content">
							<back-to-top bottom="5%" :right="$vs.rtl ? 'calc(100% - 2.2rem - 38px)' : '30px'"
											 visibleoffset="500" v-if="!hideScrollToTop">
								<vs-button icon-pack="feather" icon="icon-arrow-up" class="shadow-lg btn-back-to-top"/>
							</back-to-top>

							<transition :name="routerTransition" mode="out-in">
								<router-view @changeRouteTitle="changeRouteTitle"
												 @setAppClasses="(classesStr) => $emit('setAppClasses', classesStr)"/>
							</transition>
						</div>
					</div>
				</div>
			</div>
			<the-footer/>
		</div>
	</div>
</template>

<script>
(function() {
	var s = document.createElement('script');
	s.src = 'https://survey.survicate.com/workspaces/9cd0d9cb3823f32f6cb3492eb6e7d1e4/web_surveys.js';
	s.async = true;
	var e = document.getElementsByTagName('script')[0];
	e.parentNode.insertBefore(s, e);
})(window);

import BackToTop from 'vue-backtotop';
import navMenuItems from "@/layouts/components/vertical-nav-menu/navMenuItems.js";
import TheCustomizer from "@/layouts/components/customizer/TheCustomizer.vue";
import TheNavbarVertical from '@/layouts/components/navbar/TheNavbarVertical.vue';
import TheFooter from '@/layouts/components/TheFooter.vue';
import themeConfig from '@/../themeConfig.js';
import VNavMenu from '@/layouts/components/vertical-nav-menu/VerticalNavMenu.vue';
import VNavMenu2 from "@/layouts/components/vertical-nav-menu/SidebarStatic.vue";
import moduleExtensoes from "@/store/extensoes/moduleExtensoes";


export default {
	components: {
		VNavMenu2,
		BackToTop,
		TheCustomizer,
		TheFooter,
		TheNavbarVertical,
		VNavMenu,
	},
	data() {
		return {
			realtimeConnect: false,
			disableCustomizer: themeConfig.disableCustomizer,
			//disableThemeTour: themeConfig.disableThemeTour,
			disableThemeTour: true,
			dynamicWatchers: {},
			footerType: themeConfig.footerType || 'static',
			hideScrollToTop: themeConfig.hideScrollToTop,
			isNavbarDark: false,
			navbarColor: themeConfig.navbarColor || '#fff',
			navbarType: themeConfig.navbarType || 'sticky',
			navMenuItems: navMenuItems,
			routerTransition: themeConfig.routerTransition || 'none',
			routeTitle: this.$route.meta.pageTitle,
			steps: [
				{
					target: '#btnVNavMenuMinToggler',
					content: 'Toggle Collapse Sidebar.'
				},
				{
					target: '.vx-navbar__starred-pages',
					content: 'Create your own bookmarks. You can also re-arrange them using drag & drop.'
				},
				{
					target: '.i18n-locale',
					content: 'You can change language from here.'
				},
				{
					target: '.navbar-fuzzy-search',
					content: 'Try fuzzy search to visit pages in flash.'
				},
				{
					target: '.customizer-btn',
					content: 'Customize template based on your preference',
					params: {
						placement: 'left'
					}
				},
				{
					target: '.vs-button.buy-now',
					content: 'Buy this awesomeness at affordable price!',
					params: {
						placement: 'top'
					}
				},
			],
			subdomain: ''
		};
	},
	watch: {
		"$route"() {
			this.routeTitle = this.$route.meta.pageTitle;
		},
		isThemeDark(val) {
			const color = this.navbarColor == "#fff" && val ? "#10163a" : "#fff";
			this.updateNavbarColor(color);
		},
		"$store.state.mainLayoutType"(val) {
			this.setNavMenuVisibility(val);
			this.disableThemeTour = true;
		}
	},
	computed: {
		extensoes() {
			return this.$store.state.extensoes.extensoes;
		},
		realtime() {
			return this.realtimeConnect;
		},
		titulo() {
			return this.$route.meta.pageTitle;
		},
		bodyOverlay() {
			return this.$store.state.bodyOverlay;
		},
		contentAreaClass() {
			if (this.mainLayoutType === "vertical") {
				if (this.verticalNavMenuWidth == "default") return "content-area-reduced";
				else if (this.verticalNavMenuWidth == "reduced") return "content-area-reduced";
				else return "content-area-full";
			}
			// else if(this.mainLayoutType === "boxed") return "content-area-reduced"
			else return "content-area-full";
		},
		footerClasses() {
			return {
				'footer-hidden': this.footerType == 'hidden',
				'footer-sticky': this.footerType == 'sticky',
				'footer-static': this.footerType == 'static',
			};
		},
		isAppPage() {
			return this.$route.meta.no_scroll;
		},
		isThemeDark() {
			return this.$store.state.theme == 'dark';
		},
		layoutTypeClass() {
			return `main-${this.mainLayoutType}`;
		},
		mainLayoutType() {
			return this.$store.state.mainLayoutType;
		},
		navbarClasses() {
			return {
				'navbar-hidden': this.navbarType == 'hidden',
				'navbar-sticky': this.navbarType == 'sticky',
				'navbar-static': this.navbarType == 'static',
				'navbar-floating': this.navbarType == 'floating',
			};
		},
		verticalNavMenuWidth() {
			return this.$store.state.verticalNavMenuWidth;
		},
		windowWidth() {
			return this.$store.state.windowWidth;
		}
	},
	methods: {
		activeLink(url) {
			return url === this.$route.path;
		},
		changeRouteTitle(title) {
			this.routeTitle = title;
		},
		updateNavbar(val) {
			if (val === "static") this.updateNavbarColor(this.isThemeDark ? "#10163a" : "#fff");
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
			if ((layoutType === 'horizontal' && this.windowWidth >= 1200) || (layoutType === "vertical" && this.windowWidth < 1200)) {
				this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false);
				this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_2_ACTIVE', false);
				this.$store.dispatch('updateVerticalNavMenuWidth', 'no-nav-menu');
			} else {
				this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', true);
				this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_2_ACTIVE', true);
			}
		},
		toggleHideScrollToTop(val) {
			this.hideScrollToTop = val;
		},
		getMenus() {
			// this.$store.dispatch('getMainMenu').then(response => {
			// 	this.navMenuItems = [...response];
			// });
		},
		getExtensoes() {
			if (this.extensoes.length === 0) {
				this.$store.dispatch('extensoes/get').then(response => {
					let arr = response.extensoes;
					if (arr) {
						arr.forEach(item => {
							this.$store.dispatch('setExtensao', item);
						});
					}
				});
			}
		},
	},
	created() {
		const color = this.navbarColor === "#fff" && this.isThemeDark ? "#10163a" : this.navbarColor;
		this.updateNavbarColor(color);
		this.setNavMenuVisibility(this.$store.state.mainLayoutType);

		this.dynamicWatchers.windowWidth = this.$watch("$store.state.windowWidth", (val) => {
			if (val < 1200) {
				this.disableThemeTour = true;
				this.dynamicWatchers.windowWidth();
			}
		});

		this.dynamicWatchers.verticalNavMenuWidth = this.$watch("$store.state.verticalNavMenuWidth", () => {
			this.disableThemeTour = true;
			this.dynamicWatchers.verticalNavMenuWidth();
		});

		this.dynamicWatchers.rtl = this.$watch("$vs.rtl", () => {
			this.disableThemeTour = true;
			this.dynamicWatchers.rtl();
		});

		if (!moduleExtensoes.isRegistered) {
			this.$store.registerModule('extensoes', moduleExtensoes);
			moduleExtensoes.isRegistered = true;
		}

		this.getMenus();
		this.getExtensoes();
	},
	beforeDestroy() {
		Object.keys(this.dynamicWatchers).map(i => {
			this.dynamicWatchers[i]();
			delete this.dynamicWatchers[i];
		});
	},
	updated() {
		if (!this.$echo.socketId()) {
			//this.$echo.connect();
		} else {
			this.realtimeConnect = true;
		}
		let self = this;
		this.$echo.connector.socket.on('connect', function () {
			self.realtimeConnect = true;
		});

		this.$echo.connector.socket.on('disconnect', function () {
			self.realtimeConnect = false;
		});
	},
	async mounted() {
		this.subdomain = this.$route.params.company_slug;

	}
};

</script>
