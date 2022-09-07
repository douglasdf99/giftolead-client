<template>
	<div class="layout--main" :class="[layoutTypeClass, navbarClasses, footerClasses, {'no-scroll': isAppPage}]">
    <transition :name="routerTransition" mode="out-in">
								<router-view @changeRouteTitle="changeRouteTitle"
												 @setAppClasses="(classesStr) => $emit('setAppClasses', classesStr)"/>
							</transition>
	</div>
</template>

<script>
import navMenuItems from "@/layouts/components/vertical-nav-menu/navMenuItems.js";
import themeConfig from '@/../themeConfig.js';
import FeatureMenu from '../components/vertical-nav-menu/navMenuItems';

export default {
	data() {
		return {
			features: FeatureMenu,
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

		};
	},
	created() {
	},
	computed: {
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
		changeRouteTitle(title) {
			this.routeTitle = title;
		},
	},
};

</script>
