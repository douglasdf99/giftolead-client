<!-- =========================================================================================
    File Name: VerticalNavMenuItem.vue
    Description: Vertical NavMenu item component. Extends vuesax framework's 'vs-sidebar-item' component
    Component Name: VerticalNavMenuItem
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
    <div v-if="canSee" class="vs-sidebar--item"
         :class="[{'vs-sidebar-item-active' : activeLink},{'disabled-item pointer-events-none' : isDisabled}]">
        <div v-if="grande">
            <router-link v-on:click.native="teste(submenu)" tabindex="-1" v-if="to" exact
                         :class="[{'router-link-active': activeLink}]" :to="to"
                         :target="target">
                <vs-icon v-if="!featherIcon" :icon-pack="'material-icons'" :icon="icon"/>
                <!--<feather-icon v-else :class="{'w-3 h-3': iconSmall}" :icon="icon"/>-->
                <slot/>
            </router-link>

            <a v-else v-on:click.native="console.log('cliclou')" :target="target" :href="href" tabindex="-1">
                <vs-icon v-if="!featherIcon" :icon-pack="'material-icons'" :icon="icon"/>
                <!--<feather-icon v-else :class="{'w-3 h-3': iconSmall}" :icon="icon"/>-->
                <slot/>
            </a>
        </div>
        <div v-else>
            <div class="flex justify-center items-center">
                <vs-icon v-if="!featherIcon" :icon-pack="'material-icons'" :icon="icon" style="margin: 2.5rem 0 0 0"
                         :class="[activeLink ? 'show' : 'hide']" class="icone-destaque"/>
            </div>
            <!--<feather-icon v-else :class="{'w-3 h-3': iconSmall}" :icon="icon"/>-->
        </div>
    </div>
</template>

<script>
    export default {
        name: 'v-nav-menu-item',
        props: {
            icon: {type: String, default: ""},
            iconSmall: {type: Boolean, default: false},
            iconPack: {type: String, default: 'material-icons'},
            href: {type: [String, null], default: '#'},
            to: {type: [String, Object, null], default: null},
            slug: {type: String, default: null},
            index: {type: [String, Number], default: null},
            featherIcon: {type: Boolean, default: false},
            target: {type: String, default: '_self'},
            isDisabled: {type: Boolean, default: false},
            grande: {type: Boolean},
            submenu: {type: Array},
        },
        computed: {
            canSee() {
                this.$acl.check(this.$store.state.AppActiveUser.userRole)
                return this.to ? this.$acl.check(this.$router.match(this.to).meta.rule) : true
            },
            activeLink() {
                console.log('rota', this.$route.meta)
                console.log('slug', this.slug)
                return ((this.to == this.$route.path) || (this.$route.meta.pai == this.slug) && this.to) ? true : false
            }
        },
        methods: {
            teste(submenu) {
                console.log(submenu);
                this.$store.dispatch('submenu', submenu);
                localStorage.setItem("submenu", JSON.stringify(submenu));
            }
        }
    }

</script>
<style>
    .show {
        display: block !important;
    }

    .hide {
        display: none !important;
    }

    .icone-destaque:before {
        top: 2rem;
        content: '';
        position: absolute;
        border-style: solid;
        border-width: 19px 14px 19px 0;
        right: -12px;
        border-color: transparent #2b2b2b transparent transparent;
        transform: rotate(180deg);
      border-radius: 0 0 25% 148%;
    }
</style>
