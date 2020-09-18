<template>
    <div>
        <!--<side-bar v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @paginate="paginate"
                  @closeSidebar="toggleDataSidebar"
                  :data="sidebarData"/>-->
        <div class="vx-row flex items-center lg:mt-5 sm:mt-6 justify-between">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="search" id="search_input_trans" size="large"
                                      placeholder="Pesquisar por usuário"/>
                            <!-- SEARCH LOADING -->
                            <!-- SEARCH ICON -->
                            <div slot="submit-icon" class="absolute top-0 right-0 py-3 px-6">
                                <button type="submit" class="btn-search-bar">
                                    <feather-icon icon="SearchIcon" svgClasses="h-6 w-6"/>
                                </button>
                                <!--<feather-icon icon="SearchIcon" svgClasses="h-6 w-6" />-->
                            </div>
                        </form>
                    </div>
                </div>
                <!-- SEARCH INPUT -->
            </div>
            <div class="vx-col w-full lg:w-3/12 sm:w-full">
                <vx-card class="shadow-none">
                    <span class="destaque">Comissões Pendentes</span>
                    <p class="font-bold text-3xl my-5 text-war ning">R$ {{formatPrice(soma)}}</p>
                </vx-card>
            </div>
        </div>
        <vs-row class="mt-10">
            <vs-col vs-w="12">
                <vs-tabs :color="colorx">
                    <vs-tab @click="colorx = 'warning'; getItems('pendente'); dados.aba = 'usuario'" color="warning" value="10"
                            :label="'gerar ordens' + ( dados.aba === 'usuario' ? ` (${comissoes.length})` : '')">
                        <listagem :items="comissoes" tipo="usuario"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab @click="colorx = 'success'; getItems('reprovado'); dados.aba = 'comissao'" color="success"
                            :label="'comissões' + ( dados.aba === 'comissao' ? ` (${comissoes.length})` : '')">
                        <listagem :items="comissoes" tipo="comissao"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                </vs-tabs>

            </vs-col>
        </vs-row>
    </div>
</template>

<script>
    import SideBar from './SideBar'
    import listagem from './Listagem'
    import moduleBrindes from '@/store/brindes/moduleBrindes.js'
    import saveleadsConfig from "../../../saveleadsConfig";

    export default {
        name: "Index",
        components: {SideBar, listagem},
        data() {
            return {
                colorx: 'warning',
                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {},
                routeTitle: 'Brindes',
                dados: {
                    search: null,
                    page: 1
                },

                pagination: {
                    last_page: 1,
                    page: 1,
                    current_page: 1
                },
                currentx: 1,

                lengths: saveleadsConfig.lengths,
                tipoCom: 'pendente',
                selectedUser: {id: null},
                selectedResp: {id: null},
                soma: 0,
                usuarios: []
            }
        },
        created() {
            this.$vs.loading();
            if (!moduleBrindes.isRegistered) {
                this.$store.registerModule('brindes', moduleBrindes);
                moduleBrindes.isRegistered = true;
            }
            this.getItems();
        },
        methods: {
            paginate() {
                console.log('resetou');
                this.currentx = 1;
            },
            addNewData() {
                this.sidebarData = {}
                this.toggleDataSidebar(true)
            },
            updateData(obj) {
                this.sidebarData = obj
                this.toggleDataSidebar(true)
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
            },
            getItems() {
                this.$store.dispatch('getVarios', {rota: 'brindes', params: this.dados}).then(response => {
                    console.log('retornado com sucesso', response)
                    this.comissoes = response.data
                    this.pagination = response;
                    //this.items = response.data
                    //this.dados.page = this.pagination.current_page
                    this.$vs.loading.close()
                });
            },
            pesquisar(e) {
                e.preventDefault();
                this.$vs.loading();
                this.getItems();
            }
        },
        watch: {
            currentx(val) {
                this.$vs.loading();
                console.log('val', val);
                this.dados.page = this.currentx;
                this.getItems();
            },
            "$route"() {
                this.routeTitle = this.$route.meta.pageTitle
            },
        },
        computed: {
            items() {
                return this.$store.state.items;
            },
            /*pagination() {
                return this.$store.state.pagination;
            },*/
        },

    }
</script>
<style>
    .td-icons > span {
        display: flex;
    }
</style>