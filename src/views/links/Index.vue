<template>
    <div>
        <div class="vx-row flex items-center lg:mt-20 sm:mt-6">
            <div class="vx-col w-full sm:w-0 md:w-0 lg:w-6/12 xlg:w-5/12 col-btn-incluir-mobile mb-3">

                <!-- SEARCH INPUT -->
            </div>
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="dados.search" id="search_input" size="large"/>
                            <!-- SEARCH LOADING -->
                            <!-- SEARCH ICON -->
                            <div slot="submit-icon" class="absolute top-0 right-0 py-4 px-6">
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
            <div class="vx-col w-full lg:w-6/12 xlg:w-5/12 col-btn-incluir-desktop">

                <!-- SEARCH INPUT -->
            </div>
        </div>
        <vs-row>
            <vs-col vs-w="12">
                <nenhum-registro class="mt-20" module="Link"  v-show="items.length === 0"/>
                <div class="com-item" v-show="items.length > 0">
                    <vs-table :data="items" v-model="selected" @selected="handleSelected" class="table-items">
                        <template slot="thead">
                            <vs-th>Produto</vs-th>
                            <vs-th>Savelinks</vs-th>
                        </template>

                        <template slot-scope="{data}">
                            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" class="mb-3 cursor-pointer">
                                <vs-td :data="data[indextr].nome">
                                  <vs-chip :color="data[indextr].cor" class="product-order-status" >
                                    <span class="destaque">{{ data[indextr].nome }}</span>
                                  </vs-chip>
                                </vs-td>
                                <vs-td :data="data[indextr].status">
                                  <span class="destaque" v-if="data[indextr].links.length == 1">{{data[indextr].links.length}} link</span>
                                  <span class="destaque" v-else>{{data[indextr].links.length}} links</span>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                    <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                </div>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>
    import moduleContas from '@/store/contas/moduleContas.js';
    import NenhumRegistro from "@/views/components/NenhumRegistro";

    export default {
        name: "Index",
        components: {NenhumRegistro},
        data() {
            return {
                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {},
                routeTitle: 'Produtos',
                dados: {
                    search: '',
                    page: 1,

                },
                pagination: {
                    last_page: 1,
                    page: 1,
                    current_page: 1
                },
                currentx: 1,
                money: {
                    decimal: ',',
                    thousands: '.',
                    prefix: 'R$ ',
                    suffix: '',
                    precision: 2,
                    masked: false /* doesn't work with directive */
                },
                //items: {}
            };
        },
        created() {
            this.$vs.loading();
            if (!moduleContas.isRegistered) {
                this.$store.registerModule('contas', moduleContas);
                moduleContas.isRegistered = true;
            }
            this.getProdutos(this.$route.params.id);
        },
        methods: {
            handleSelected(tr) {
              this.$router.push({name: 'links-produto', params:{id: tr.id}});
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val;
            },
            getProdutos() {

                this.$store.dispatch('getVarios', {rota: 'produtos', params: this.dados}).then(response => {
                    this.pagination = response;
                    this.$vs.loading.close();
                });
            },
            deletar(id) {
                this.$vs.dialog({
                    color: 'danger',
                    title: `Deletar conta id: ${id}`,
                    text: 'Deseja deletar este Produto? Procedimento irreversível',
                    acceptText: 'Sim, deletar!',
                    accept: () => {
                        this.$vs.loading();
                        this.$store.dispatch('deleteItem', {id: id, rota: 'produtos'}).then(() => {
                            this.$vs.notify({
                                color: 'success',
                                title: 'Sucesso',
                                text: 'A URL foi deletada com sucesso'
                            });
                            this.getProdutos();
                        }).catch(() => {
                            this.$vs.notify({
                                color: 'danger',
                                title: 'Erro',
                                text: 'Algo deu errado ao deletar o produto. Contate o suporte.'
                            });
                        });
                    }
                });
            },
            pesquisar(e) {
              this.dados.page = 1;
                e.preventDefault();
                this.$vs.loading();
                this.getProdutos();
            }
        },
        watch: {
            currentx() {
                this.$vs.loading();
                this.dados.page = this.currentx;
                this.getProdutos();
            },
            "$route"() {
                this.routeTitle = this.$route.meta.pageTitle;
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

    };
</script>
<style scoped>
  .con-vs-chip {
    border-radius: 5px !important;
  }
</style>
