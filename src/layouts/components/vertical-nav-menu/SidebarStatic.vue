<!-- =========================================================================================
  File Name: VerticalNavMenu.vue
  Description: Vertical NavMenu Component
  Component Name: VerticalNavMenu
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="parentx">

        <vs-sidebar
                class="v-nav-menu items-no-padding secundary-menu"
                v-model="isVerticalNavMenuActive"
                ref="verticalNavMenu"
                default-index="-1"
                :click-not-close="clickNotClose"
                :reduce-not-rebound="reduceNotRebound"
                :parent="parent"
                :hiddenBackground="clickNotClose"
                :reduce="false"
                v-hammer:swipe.left="onSwipeLeft">

            <div v-if="verticalNavMenuItemsMin">

                <!-- Header -->
                <div class="header-sidebar flex items-end justify-between" slot="header">

                    <!-- Logo -->
                    <router-link tag="div" class="vx-logo cursor-pointer flex items-center pt-12" to="/" >
                      <img :src="url_api('images/logo2.svg')" >

                      <!-- <logo class="w-10 mr-4 fill-current text-primary"/>
                       <span class="vx-logo-text text-primary" v-show="isMouseEnter || !reduce" v-if="title">{{ title }}</span>-->
                    </router-link>
                    <!-- /Logo -->

                    <!-- Menu Buttons -->

                    <!-- /Menu Toggle Buttons -->
                </div>
                <!-- /Header -->

                <!-- Menu Items -->
                <VuePerfectScrollbar ref="verticalNavMenuPs" class="scroll-area-v-nav-menu pt-2" :settings="settings"
                                     @ps-scroll-y="psSectionScroll" :key="$vs.rtl">
                    <template>
                      <vs-row class="mt-12" >
                        <vs-col vs-w="12">
                          <span class="menuSelected">{{titlesub}}</span>
                        </vs-col>
                      </vs-row>
                      <vs-row>
                        <vs-col vs-w="12">
                          <ul id="submenu">
                            <li v-for="item in menus" :key="item.name">
                              <vs-icon icon-pack="material-icons" :icon="item.icon"/>
                              <router-link :to="item.url"><span class="ml-3 menu-name">{{item.name}}</span></router-link>
                            </li>
                          </ul>
                        </vs-col>
                      </vs-row>

                    </template>
                </VuePerfectScrollbar>
                <!-- /Menu Items -->
            </div>
        </vs-sidebar>

        <!-- Swipe Gesture -->
        <div
                v-if="!isVerticalNavMenuActive"
                class="v-nav-menu-swipe-area"
                v-hammer:swipe.right="onSwipeAreaSwipeRight"/>
        <!-- /Swipe Gesture -->
    </div>
</template>


<script>
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    import VNavMenuGroup from './VerticalNavMenuGroup.vue'
    import VNavMenuItem from './VerticalNavMenuItem.vue'

    import Logo from "../Logo.vue"

    export default {
        name: 'v-nav-menu',
        components: {
            VNavMenuGroup,
            VNavMenuItem,
            VuePerfectScrollbar,
            Logo
        },
        props: {
            logo: {type: String},
            openGroupHover: {type: Boolean, default: false},
            parent: {type: String},
            reduceNotRebound: {type: Boolean, default: true},
            navMenuItems: {type: Array, required: true},
            title: {type: String},
        },
        data: () => ({
            clickNotClose: false, // disable close navMenu on outside click
            isMouseEnter: false,
            reduce: false, // determines if navMenu is reduce - component property
            showCloseButton: false, // show close button in smaller devices
            settings: {      // perfectScrollbar settings
                maxScrollbarLength: 60,
                wheelSpeed: 1,
                swipeEasing: true
            },
            showShadowBottom: false,
        }),
        computed: {
          titlesub (){

            return this.$route.meta.subTitle;

          },
          menus (){

            return this.$route.meta.submenu;

          },
            isGroupActive() {
                return (item) => {
                    const path = this.$route.fullPath
                    const routeParent = this.$route.meta ? this.$route.meta.parent : undefined
                    let open = false

                    let func = (item) => {
                        if (item.submenu) {
                            item.submenu.forEach((item) => {
                                if (item.url && (path === item.url || routeParent === item.slug)) {
                                    open = true
                                } else if (item.submenu) {
                                    func(item)
                                }
                            })
                        }
                    }
                    func(item)
                    return open
                }
            },
            menuItemsUpdated() {
                let clone = this.navMenuItems.slice()

                for (let [index, item] of this.navMenuItems.entries()) {
                    if (item.header && item.items.length && (index || 1)) {
                        let i = clone.findIndex(ix => ix.header === item.header)
                        for (let [subIndex, subItem] of item.items.entries()) {
                            clone.splice(i + 1 + subIndex, 0, subItem)
                        }
                    }
                }

                return clone
            },
            isVerticalNavMenuActive: {
                get() {
                    return this.$store.state.isVerticalNavMenuActive
                },
                set(val) {
                    this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', val)
                }
            },
            layoutType() {
                return this.$store.state.mainLayoutType
            },
            reduceButton: {
                get() {
                    return this.$store.state.reduceButton
                },
                set(val) {
                    this.$store.commit('TOGGLE_REDUCE_BUTTON', val)
                }
            },
            isVerticalNavMenuReduced() {
                return Boolean(this.reduce && this.reduceButton)
            },
            verticalNavMenuItemsMin() {
                return this.$store.state.verticalNavMenuItemsMin
            },
            windowWidth() {
                return this.$store.state.windowWidth
            }
        },
        watch: {
            '$route'() {
                if (this.isVerticalNavMenuActive && this.showCloseButton) this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)
            },
            reduce(val) {
                const verticalNavMenuWidth = val ? "reduced" : this.$store.state.windowWidth < 1200 ? "no-nav-menu" : "default"
                this.$store.dispatch('updateVerticalNavMenuWidth', verticalNavMenuWidth)

                setTimeout(function () {
                    window.dispatchEvent(new Event('resize'))
                }, 100)
            },
            layoutType() {
                this.setVerticalNavMenuWidth()
            },
            reduceButton() {
                this.setVerticalNavMenuWidth()
            },
            windowWidth() {
                this.setVerticalNavMenuWidth()
            }
        },
        methods: {
            // handleWindowResize(event) {
            //   this.windowWidth = event.currentTarget.innerWidth;
            //   this.setVerticalNavMenuWidth()
            // },
            onSwipeLeft() {
                if (this.isVerticalNavMenuActive && this.showCloseButton) this.isVerticalNavMenuActive = false
            },
            onSwipeAreaSwipeRight() {
                if (!this.isVerticalNavMenuActive && this.showCloseButton) this.isVerticalNavMenuActive = true
            },
            psSectionScroll() {
                this.showShadowBottom = this.$refs.verticalNavMenuPs.$el.scrollTop > 0 ? true : false
            },
            mouseEnter() {
                if (this.reduce) this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', false)
                this.isMouseEnter = true
            },
            mouseLeave() {
                if (this.reduce) this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', true)
                this.isMouseEnter = false;
            },
            setVerticalNavMenuWidth() {

                if (this.windowWidth > 1200) {
                    if (this.layoutType === 'vertical') {

                        // Set reduce
                        this.reduce = this.reduceButton ? true : false

                        // Open NavMenu
                        //this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_2_ACTIVE', true)

                        // Set Menu Items Only Icon Mode
                        const verticalNavMenuItemsMin = (this.reduceButton && !this.isMouseEnter) ? true : false
                        this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', verticalNavMenuItemsMin)

                        // Menu Action buttons
                        this.clickNotClose = true
                        this.showCloseButton = false

                        const verticalNavMenuWidth = this.isVerticalNavMenuReduced ? "reduced" : "default"
                        this.$store.dispatch('updateVerticalNavMenuWidth', verticalNavMenuWidth)

                        return
                    }
                }

                // Close NavMenu
                //this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_2_ACTIVE', false)

                // Reduce button
                if (this.reduceButton) this.reduce = false

                // Menu Action buttons
                this.showCloseButton = true
                this.clickNotClose = false

                // Update NavMenu Width
                this.$store.dispatch('updateVerticalNavMenuWidth', 'no-nav-menu')

                // Remove Only Icon in Menu
                this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', false)


                // if(this.layoutType === 'vertical' || (this.layoutType === 'horizontal' && this.windowWidth < 1200))
                // if (this.windowWidth < 1200) {

                //   // Close NavMenu
                //   this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)

                //   // Reduce button
                //   if (this.reduceButton) this.reduce = false

                //   // Menu Action buttons
                //   this.showCloseButton = true
                //   this.clickNotClose   = false

                //   // Update NavMenu Width
                //   this.$store.dispatch('updateVerticalNavMenuWidth', 'no-nav-menu')

                //   // Remove Only Icon in Menu
                //   this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', false)

                // } else {

                //   // Set reduce
                //   this.reduce = this.reduceButton ? true : false

                //   // Open NavMenu
                //   this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', true)

                //   // Set Menu Items Only Icon Mode
                //   const verticalNavMenuItemsMin = (this.reduceButton && !this.isMouseEnter) ? true : false
                //   this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', verticalNavMenuItemsMin)

                //   // Menu Action buttons
                //   this.clickNotClose   = true
                //   this.showCloseButton = false

                //   const verticalNavMenuWidth   = this.isVerticalNavMenuReduced ? "reduced" : "default"
                //   this.$store.dispatch('updateVerticalNavMenuWidth', verticalNavMenuWidth)
                // }
            },
            toggleReduce(val) {
                this.reduceButton = val
                this.setVerticalNavMenuWidth()
            },
        },
      created()
      {
        let submenu = JSON.parse(localStorage.getItem('submenu'));
        console.log('submenu', submenu)
        if(submenu.name){
          this.$store.dispatch('submenu', submenu)
          this.icone_destaque = submenu.icon
          this.ativarMenu(false);
        }
      },
      mounted() {
            this.setVerticalNavMenuWidth()
        },
    }

</script>


<style lang="scss">
    @import "@/assets/scss/vuexy/components/verticalNavMenu.scss"
</style>


<style>
    .secundary-menu .vs-sidebar {
        margin-left: 50px;
        max-width: 240px;
    }
    .menuSelected {
      font-family: "Poppins", sans-serif;
      font-size: 15px;
      font-weight: 700;
      color: #4A4A4A;
      padding: 20px 19px 16px 23px;
    }

    #submenu  {
      font-family: "Poppins", sans-serif;
      padding: 20px 19px 16px 23px;
    }
    #submenu li {
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-bottom: 1rem;
      cursor: pointer;
      transition-duration: .3s;
    }

    #submenu li:hover {
      padding-left: 5%;
      transition-duration: .3s;
    }

    #submenu span {
      color: #797979;
    }

    #submenu li:hover span {
      font-weight: 800;
    }
</style>
