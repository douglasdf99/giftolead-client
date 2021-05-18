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

        <v-nav-menu
            :navMenuItems="navMenuItems"
            title="Vuexy"
            parent=".layout--main"
        />
        <v-nav-menu-2
            title="Vuexy"
            parent=".layout--main"/>

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

                <div style="height: 62px" v-if="navbarType === 'static'"></div>

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
            </template>
            <!-- /Navbar -->

            <div class="content-wrapper">
                <transition :name="routerTransition">
                    <div class="menu-statico-2">
                        <vx-card>
                            <vs-collapse>
                                <vs-collapse-item>
                                    <div slot="header"><span class="menuSelected"><vs-icon icon-pack="material-icons" :icon="$route.meta.subIcon"/> {{ $route.meta.subTitle }}</span></div>
                                    <div class="ml-10">
                                        <vs-list>
                                            <router-link v-for="item in $route.meta.submenu" :key="item.name" :to="item.url" class="menu-statico-2-link" :class="{'menu-ativo' : activeLink(item.url)}">
                                                <vs-list-item icon-pack="material-icons" :icon="item.icon" :title="item.name"></vs-list-item>
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
                            <div v-if="$route.meta.breadcrumb || $route.meta.pageTitle"
                                 class="items-center mb-5">
                                <!-- BREADCRUMB -->
                              <span v-if="realtime">conectado</span>
                              <span v-else>desconectado</span>
                                <vx-breadcrumb class="md:block hidden mb-12" v-if="$route.meta.breadcrumb"
                                               :route="$route" :isRTL="$vs.rtl"/>

                                <div class="content-area__heading"
                                     :class="{'pr-4 border-0' : $route.meta.breadcrumb}">
                                    <h2 class="mb-1">{{ $route.meta.pageTitle }}</h2>
                                </div>


                                <!--        &lt;!&ndash; DROPDOWN &ndash;&gt;
                                        <vs-dropdown vs-trigger-click class="ml-auto md:block hidden cursor-pointer">
                                            <vs-button radius icon="icon-settings" icon-pack="feather"/>

                                            <vs-dropdown-menu class="w-32">
                                                <vs-dropdown-item>
                                                    <div @click="$router.push('/pages/profile').catch(() => {})"
                                                         class="flex items-center">
                                                        <feather-icon icon="UserIcon" class="inline-block mr-2"
                                                                      svgClasses="w-4 h-4"/>
                                                        <span>Profile</span>
                                                    </div>
                                                </vs-dropdown-item>
                                                <vs-dropdown-item>
                                                    <div @click="$router.push('/apps/todo').catch(() => {})"
                                                         class="flex items-center">
                                                        <feather-icon icon="CheckSquareIcon" class="inline-block mr-2"
                                                                      svgClasses="w-4 h-4"/>
                                                        <span>Tasks</span>
                                                    </div>
                                                </vs-dropdown-item>
                                                <vs-dropdown-item>
                                                    <div @click="$router.push('/apps/email').catch(() => {})"
                                                         class="flex items-center">
                                                        <feather-icon icon="MailIcon" class="inline-block mr-2"
                                                                      svgClasses="w-4 h-4"/>
                                                        <span>Inbox</span>
                                                    </div>
                                                </vs-dropdown-item>
                                            </vs-dropdown-menu>

                                        </vs-dropdown>-->

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
import BackToTop from 'vue-backtotop'
import HNavMenu from "@/layouts/components/horizontal-nav-menu/HorizontalNavMenu.vue"
import navMenuItems from "@/layouts/components/vertical-nav-menu/navMenuItems.js"
import TheCustomizer from "@/layouts/components/customizer/TheCustomizer.vue"
import TheNavbarHorizontal from '@/layouts/components/navbar/TheNavbarHorizontal.vue'
import TheNavbarVertical from '@/layouts/components/navbar/TheNavbarVertical.vue'
import TheFooter from '@/layouts/components/TheFooter.vue'
import themeConfig from '@/../themeConfig.js'
import VNavMenu from '@/layouts/components/vertical-nav-menu/VerticalNavMenu.vue'
import VNavMenu2 from "@/layouts/components/vertical-nav-menu/SidebarStatic.vue";
import axios from 'axios'
import {AclRule} from 'vue-acl'
import moduleExtensoes from "@/store/extensoes/moduleExtensoes";

const VxTour = () => import('@/components/VxTour.vue')

export default {
    components: {
        VNavMenu2,
        BackToTop,
        HNavMenu,
        TheCustomizer,
        TheFooter,
        TheNavbarHorizontal,
        TheNavbarVertical,
        VNavMenu,
        VxTour
    },
    data() {
        return {
            realtimeConnect:false,
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
            steps: [{
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
            subdomain: window.location.host.split('.')[1] ? window.location.host.split('.')[0] : 'app'
        }
    },
    watch: {
        "$route"() {
            this.routeTitle = this.$route.meta.pageTitle
        },
        isThemeDark(val) {
            const color = this.navbarColor == "#fff" && val ? "#10163a" : "#fff"
            this.updateNavbarColor(color)
        },
        realtime(val) {
          console.log('val real',val)
            if (!val){
              //this.$echo.connect();
            }
        },
        "$store.state.mainLayoutType"(val) {
            this.setNavMenuVisibility(val)
            this.disableThemeTour = true
        }
    },
    computed: {
        realtime() {
            return this.realtimeConnect
        },
        titulo() {
            return this.$route.meta.pageTitle
        },
        setToken() {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        },
        bodyOverlay() {
            return this.$store.state.bodyOverlay
        },
        contentAreaClass() {
            if (this.mainLayoutType === "vertical") {
                if (this.verticalNavMenuWidth == "default") return "content-area-reduced"
                else if (this.verticalNavMenuWidth == "reduced") return "content-area-reduced"
                else return "content-area-full"
            }
            // else if(this.mainLayoutType === "boxed") return "content-area-reduced"
            else return "content-area-full"
        },
        footerClasses() {
            return {
                'footer-hidden': this.footerType == 'hidden',
                'footer-sticky': this.footerType == 'sticky',
                'footer-static': this.footerType == 'static',
            }
        },
        isAppPage() {
            return this.$route.meta.no_scroll
        },
        isThemeDark() {
            return this.$store.state.theme == 'dark'
        },
        layoutTypeClass() {
            return `main-${this.mainLayoutType}`
        },
        mainLayoutType() {
            return this.$store.state.mainLayoutType
        },
        navbarClasses() {
            return {
                'navbar-hidden': this.navbarType == 'hidden',
                'navbar-sticky': this.navbarType == 'sticky',
                'navbar-static': this.navbarType == 'static',
                'navbar-floating': this.navbarType == 'floating',
            }
        },
        verticalNavMenuWidth() {
            return this.$store.state.verticalNavMenuWidth
        },
        windowWidth() {
            return this.$store.state.windowWidth
        }
    },
    methods: {
        activeLink(url) {
            return url === this.$route.path;
        },
        changeRouteTitle(title) {
            this.routeTitle = title
        },
        updateNavbar(val) {
            if (val == "static") this.updateNavbarColor(this.isThemeDark ? "#10163a" : "#fff")
            this.navbarType = val
        },
        updateNavbarColor(val) {
            this.navbarColor = val
            if (val == "#fff") this.isNavbarDark = false
            else this.isNavbarDark = true
        },
        updateFooter(val) {
            this.footerType = val
        },
        updateRouterTransition(val) {
            this.routerTransition = val
        },
        setNavMenuVisibility(layoutType) {
            if ((layoutType === 'horizontal' && this.windowWidth >= 1200) || (layoutType === "vertical" && this.windowWidth < 1200)) {
                this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)
                this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_2_ACTIVE', false)
                this.$store.dispatch('updateVerticalNavMenuWidth', 'no-nav-menu')
            } else {
                this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', true)
                this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_2_ACTIVE', true)
            }
        },
        toggleHideScrollToTop(val) {
            this.hideScrollToTop = val
        },
        getMenus() {
            this.$store.dispatch('getMainMenu').then(response => {
                this.navMenuItems = [...response];
            })
        },
        getExtensoes() {
            this.$store.dispatch('extensoes/get', this.subdomain).then(response => {
                let arr = response.extensoes;
                if (arr.length > 0) {
                    arr.forEach(item => {
                        this.$store.dispatch('setExtensao', item)
                    });
                }
            });
        },
    },
    created() {
        const color = this.navbarColor == "#fff" && this.isThemeDark ? "#10163a" : this.navbarColor
        this.updateNavbarColor(color)
        this.setNavMenuVisibility(this.$store.state.mainLayoutType)

        // Dynamic Watchers for tour
        // Reason: Once tour is disabled it is not required to enable it.
        // So, watcher is required for just disabling it.
        this.dynamicWatchers.windowWidth = this.$watch("$store.state.windowWidth", (val) => {
            if (val < 1200) {
                this.disableThemeTour = true
                this.dynamicWatchers.windowWidth()
            }
        })

        this.dynamicWatchers.verticalNavMenuWidth = this.$watch("$store.state.verticalNavMenuWidth", () => {
            this.disableThemeTour = true
            this.dynamicWatchers.verticalNavMenuWidth()
        })

        this.dynamicWatchers.rtl = this.$watch("$vs.rtl", () => {
            this.disableThemeTour = true
            this.dynamicWatchers.rtl()
        })

        if (!moduleExtensoes.isRegistered) {
            this.$store.registerModule('extensoes', moduleExtensoes)
            moduleExtensoes.isRegistered = true
        }

        this.getMenus();
        this.getExtensoes();
    },
    beforeDestroy() {
        Object.keys(this.dynamicWatchers).map(i => {
            this.dynamicWatchers[i]()
            delete this.dynamicWatchers[i]
        })
    },
  updated() {
    if(!this.$echo.socketId()){
      //this.$echo.connect();
    }else{
      this.realtimeConnect = true;
    }
    let self = this;
    this.$echo.connector.socket.on('connect', function(){
      self.realtimeConnect = true;
      console.log('connect of socket');
    });

    this.$echo.connector.socket.on('disconnect', function(){
      self.realtimeConnect= false;
      console.log('disconnect of socket');
      console.log('disconnect of socket',self.realtimeConnect);
    });
  },
  mounted() {
      console.log('socket',this.$echo.socketId());
        var subdomain = window.location.host.split('.')[1] ? window.location.host.split('.')[0] : 'app';

        this.$echo.channel(`${subdomain}_permissions`).listen('PermissionEvent', (e) => {
            let permissoes = {};
            e.permissions.forEach(item => {
                if (item.permission_role.length > 0) {
                    var ac = new AclRule('Administrador');
                    item.permission_role.forEach(perfil => {
                        ac = ac.or(perfil.role.nome)
                    });
                    permissoes[item.name] = ac.generate();
                    //permissoes.push({'permissao':item.name, 'funcoes':ac.generate()});
                } else {
                    permissoes[item.name] = new AclRule('Administrador').generate();
                    //permissoes.push({'permissao':item.name, 'funcoes':new AclRule('Administrador').generate()});
                }
            });

            var ac = new AclRule('Administrador');
            e.roles.forEach(role => {
                ac = ac.or(role.nome)
            });
            permissoes['public'] = ac.generate();
            localStorage.setItem("permissoes", JSON.stringify(permissoes));
            this.getMenus();
        });

        let userInfo = JSON.parse(localStorage.getItem("userInfo"));

        this.$echo.channel(`${subdomain}_profile_${userInfo.uid}`).listen('ProfileEvent', (e) => {
            let userInfo = JSON.parse(localStorage.getItem("userInfo"));

            userInfo.photoURL = e.user.avatar;
            userInfo.userRole = e.user.roles.nome;
            userInfo.displayName = e.user.name;
            userInfo.about = e.user.roles.nome;

            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            this.$store.state.AppActiveUser = userInfo;
        });
    }
}

</script>
