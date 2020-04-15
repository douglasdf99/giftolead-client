<!-- =========================================================================================
	File Name: SidebarStatic.vue
	Description: Rendering of static sidebar
	----------------------------------------------------------------------------------------
	Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
	Author: Pixinvent
	Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div>
        <div class="parentx-static relative" style="height: 100vh;">
            <vs-sidebar static-position default-index="1" color="primary"
                        class="sidebarx sidebarpage bordered-sidebar" spacer v-model="active">
                <div class="header-sidebar" slot="header" style="padding-left: 15%">
                    <div class="text-center">
                        <img src="@/assets/images/sidebar/logo-2.png" alt="" class="logo" v-if="!menuAtivo">
                    </div>
                </div>
                <vs-row style="margin: 1rem 0 2rem">
                    <vs-col vs-w="12">
                        <span class="menuSelected">{{menuSelecionado}}</span>
                    </vs-col>
                </vs-row>
                <vs-row>
                    <vs-col vs-w="12">
                        <ul id="submenu">
                            <li v-for="item in submenu">
                                <vs-icon icon-pack="material-icons" :icon="item.icon"/>
                                <router-link :to="item.slug"><span class="menu-name">{{item.name}}</span></router-link>
                            </li>
                        </ul>
                    </vs-col>
                </vs-row>
            </vs-sidebar>
        </div>
    </div>
</template>

<script>
    export default {
        data: () => ({
            active: false,
        }),
        methods: {
            ativarMenu() {
                this.$store.dispatch('ativarMenu', true);
            }
        },
        computed: {
            menuAtivo() {
                return this.$store.state.menuAtivo;
            },
            menuSelecionado() {
                return this.$store.state.menuSelecionado;
            },
            submenu() {
                return this.$store.state.submenu;
            }
        }
    }
</script>

<style>
    .sidebarpage {
        height: 100vh !important;
    }

    .vs-sidebar--header {
        border: none !important;
    }

    .vs-sidebar--items {
        padding-left: 5.5rem;
    }

    .menuSelected {
        font-family: "Poppins", sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: #4A4A4A;
    }

    #submenu li {
        display: flex;
        align-items: center;
        font-size: 1rem;
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
