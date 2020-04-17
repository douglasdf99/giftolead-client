<!-- =========================================================================================
    File Name: Sidebar.vue
    Description: Sidebar - Imports all page portions
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div id="sidebar-demo">
        <!--<sidebar-parent></sidebar-parent>-->
        <div class="main-menu" v-bind:style="{animationName: animacao}">
            <!--<img src="@/assets/images/sidebar/seta-esquerda.svg" class="seta" v-if="menuAtivo">-->
            <img src="@/assets/images/sidebar/seta-direita.svg" class="seta" v-if="!menuAtivo">
            <vs-icon icon-pack="material-icons" :icon="icone_destaque" class="icone-destaque" v-if="!menuAtivo"/>
            <div class="header-sidebar" slot="header">
                <div class="text-center">
                    <img src="@/assets/images/sidebar/logo-1.png" alt="" class="logo" v-if="menuAtivo">
                </div>
            </div>

            <!-- Menu Items -->
            <ul id="MainMenu" v-if="menuAtivo">
                <li v-for="item in navMenuItems" @click="ativarMenu(false, item)">
                    <vs-icon icon-pack="material-icons" :icon="item.icon"/>
                    <span class="menu-name">{{item.name}}</span>
                </li>
            </ul>
            <!-- Fim Menu Items -->

            <div class="clickavel" @click="ativarMenu(false)">
                <img src="@/assets/images/sidebar/seta-menu-esquerda.svg" class="seta-menu" v-if="menuAtivo">
                <img src="@/assets/images/sidebar/menu-voltar.svg" class="menu-icon" v-if="menuAtivo">
            </div>
            <div class="clickavel" @click="ativarMenu(true)">
                <img src="@/assets/images/sidebar/seta-menu-direita.svg" class="seta-menu" v-if="!menuAtivo">
                <img src="@/assets/images/sidebar/menu-abrir.svg" class="menu-icon menu-icon-abrir" v-if="!menuAtivo">
            </div>
        </div>
        <sidebar-static></sidebar-static>
    </div>
</template>

<script>
    import SidebarStatic from "./SidebarStatic";
    import navMenuItems from "./navMenuItems.js";

    export default {
        components: {
            SidebarStatic,
        },
        data() {
            return {
                navMenuItems: navMenuItems,
                icone_destaque: ''
            }
        },
        created() {
            console.log('items', navMenuItems)
            let submenu = JSON.parse(localStorage.getItem('submenu'));
            console.log('submenu', submenu)
            if(submenu.name){
                this.$store.dispatch('submenu', submenu)
                this.icone_destaque = submenu.icon
                this.ativarMenu(false);
            }
        },
        methods: {
            ativarMenu(e, obj = null) {
                if(obj != null) {
                    if (obj.submenu) {
                        this.icone_destaque = obj.icon;
                        this.$store.dispatch('ativarMenu', e);
                        this.$store.dispatch('submenu', obj);
                    } else {
                        this.$router.push({name: obj.slug});
                    }
                } else {
                    this.$store.dispatch('ativarMenu', e);
                }
            }
        },
        computed: {
            animacao() {
                return this.$store.state.animacaoMenu;
            },
            menuAtivo() {
                return this.$store.state.menuAtivo;
            }
        }
    }

</script>

<style lang="scss">
    @import "@/assets/scss/vuexy/pages/sidebar.scss";
</style>
<style>
    .main-menu {
        z-index: 50000;
        position: fixed;
        width: 13vw;
        height: 100vh;
        background-color: #2B2B2B;
        padding: 2rem;
        animation-direction: normal;
        animation-duration: .5s;
        animation-fill-mode: forwards;
    }

    .seta, .seta-menu {
        position: absolute;
        z-index: 55000;
        right: -15px;
        top: 15%;
        animation-direction: normal;
        animation-duration: .5s;
        animation-fill-mode: forwards;
    }

    .seta-menu {
        top: 77%;
    }

    .menu-icon {
        position: absolute;
        z-index: 55000;
        right: -10px;
        top: 82%;
        animation-direction: normal;
        animation-duration: .5s;
        animation-fill-mode: forwards;
    }

    .menu-icon-abrir {
        right: 0 !important;
    }

    .header-sidebar {
        margin: 15% 0;
    }

    #menuButton {
        position: absolute;
        bottom: 10px;
    }

    .clickavel {
        cursor: pointer;
    }

    #MainMenu {
        margin-top: 4rem;
    }

    #MainMenu li {
        display: flex;
        align-items: center;
        font-size: 1.3rem;
        color: white;
        margin-bottom: 1rem;
        cursor: pointer;
        transition-duration: .3s;
    }

    #MainMenu li:hover {
        transition-duration: .3s;
        padding-left: 5%;
    }

    .vs-icon {
        margin-right: 10px;
        font-size: 1.4rem;
    }

    .menu-name {
        font-family: "Poppins", sans-serif;
    }

    .icone-destaque {
        color: white;
        font-size: 2rem;
        position: absolute;
        top: 16.6%;
        left: 10px;
        z-index: 90000;
    }

    @keyframes recolher {
        from {
            width: 12vw;
        }
        to {
            width: 2vw;
            padding: 0;
        }
    }

    @keyframes expandir {
        from {
            width: 2vw;
        }
        to {
            width: 13vw;
            padding: 25px;
        }
    }

    @media (max-width: 690px) {
        #MainMenu {
            display: none;
        }
    }
</style>