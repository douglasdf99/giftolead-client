<template>
    <div>
        <side-bar v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar"
                  :data="sidebarData"/>
        <div class="vx-row flex items-center mt-20">
        <vx-card  class=" mb-10">
          <div class="vx-row">
            <div class="vx-col sm:w-1/12 w-full">
              <span class="rounded-full bg-primary py-2 px-2 text-enum text-white font-bold"><i class="material-icons">star</i></span>
            </div>
            <div class="vx-col sm:w-1/12 w-full py-2 px-2">
              <p class="mb-0 text-base font-bold">Checkout:</p>
            </div>
            <div class="vx-col sm:w-10/12 w-full py-2 px-2">
              <p class="mb-0 text-base font-bold text-dark-50">{{produto.conta.integracao.checkout_base}}{{produto.checkout}}</p>
            </div>
          </div>
          <!-- end row -->
        </vx-card>
      </div>
        <div class="vx-row flex items-center lg:mt-10 sm:mt-6">
            <div class="vx-col w-full sm:w-0 md:w-0 lg:w-6/12 xlg:w-5/12 col-btn-incluir-mobile mb-3">
                <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="addNewData">
                    <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                    Incluir link
                </vs-button>
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
                <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="addNewData">
                    <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                    Incluir link
                </vs-button>
                <!-- SEARCH INPUT -->
            </div>
        </div>
        <vs-row>
            <vs-col vs-w="12">
                <div class="vx-row mt-10" v-show="items.length === 0">
                    <div class="w-full lg:w-6/12 xlg:w-6/12 s:w-full sem-item">
                        <div class="w-8/12">
                            <div v-if="dados.search">
                                <p class="span-sem-item">Nenhum item foi encontrado</p>
                                <p class="text-sem-item mt-6">
                                    Para inserir novos registros você <br> pode clicar em incluir link.
                                </p>
                            </div>
                            <div v-else>
                                <p class="span-sem-item">Você não possui nenhum item cadastrado</p>
                                <p class="text-sem-item">
                                    Para inserir novos registros você <br> pode clicar em incluir link.
                                </p>
                            </div>
                            <br>
                            <p>
                                <vs-button color="primary" class="float-left botao-incluir mt-6" type="filled"
                                           @click="addNewData">
                                    <vs-icon icon-pack="material-icons" icon="check_circle"
                                             class="icon-grande"></vs-icon>
                                    Incluir link
                                </vs-button>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="com-item mt-20" v-show="items.length > 0">
                  <vx-card :key="link.id"  class=" mb-10" v-for="(link, index) in items">
                    <div class="vx-row">
                      <div class="vx-col sm:w-1/12 w-full mb-2">
                          <vs-dropdown vs-trigger-click>
                            <vs-button radius color="#EDEDED" type="filled"
                                       class="btn-more-icon relative botao-menu"
                                       icon-pack="material-icons" icon="more_horiz"
                            ></vs-button>
                            <vs-dropdown-menu class="dropdown-menu-list">
                              <span class="span-identifica-item-dropdown">Nº {{link.id}}</span>
                              <vs-dropdown-item @click="updateData(link.id)">
                                <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                Editar
                              </vs-dropdown-item>

                              <vs-dropdown-item @click="deletar(link.id)">
                                <vs-icon icon-pack="material-icons" icon="delete"></vs-icon>
                                Deletar
                              </vs-dropdown-item>

                            </vs-dropdown-menu>
                          </vs-dropdown>

                      </div>
                      <div class="vx-col sm:w-3/12 w-full mb-2">
                        <p class="mb-0 text-base font-bold">Descrição {{link.id}}</p>
                       {{link.descricao}}
                      </div>
                      <div class="vx-col sm:w-3/12 w-full mb-2">
                        <p class="mb-0 text-base font-bold">SCR</p>
                        {{link.scr}}
                      </div>
                      <div class="vx-col sm:w-3/12 w-full mb-2" >
                        <p class="mb-0 text-base font-bold">Oferta</p>
                        {{link.codigo_oferta}}
                      </div>
                      <div class="vx-col sm:w-2/12 w-full mb-2">
                        <p class="mb-0 text-base font-bold">Parcelas</p>
                        <span class="font-15 font-weight-bold">{{link.split}}x</span>
                      </div>
                    </div>
                    <!-- end row -->
                  </vx-card>

                    <vs-pagination class="mt-2" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                </div>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>
    import SideBar from './SideBar'
    import moduleProdutos from '@/store/produtos/moduleProdutos.js'

    export default {
        name: "Index",
        components: {SideBar},
        data() {
            return {
                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {},
                routeTitle: 'Contas',
                produto:{},
                dados: {
                    search: '',
                    page: 1
                },
                pagination: {
                    last_page: 1,
                    page: 1,
                    current_page: 1
                },
                currentx: 1
                //items: {}
            }
        },
        created() {
            this.$vs.loading()
            if (!moduleProdutos.isRegistered) {
                this.$store.registerModule('produtos', moduleProdutos)
              moduleProdutos.isRegistered = true
            }
            this.getProduto(this.$route.params.id);
            this.getItems(this.$route.params.id);
        },
        methods: {
          getProduto(id) {
            this.$store.dispatch('produtos/getId', id).then(data => {
              this.produto = {...data};
            })
          },
            addNewData() {
                this.sidebarData = {}
                this.toggleDataSidebar(true)
            },
            updateData(id) {

              this.$router.push({path: '/configuracoes/links/produto/'+ this.produto.id + '/editar/' + id});
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
            },
            getItems(id) {
                this.dados.produto = id;
                this.$store.dispatch('getVarios', {rota: 'links', params: this.dados}).then(response => {
                    this.pagination = response;
                    //this.items = response.data
                    //this.dados.page = this.pagination.current_page
                    this.$vs.loading.close()
                });
            },
            deletar(id) {
                this.$vs.dialog({
                    color: 'danger',
                    title: `Deletar origem id: ${id}`,
                    text: 'Deseja deletar esta Origem? Procedimento irreversível',
                    acceptText: 'Sim, deletar!',
                    accept: () => {
                        this.$vs.loading();
                        this.$store.dispatch('deleteItem', {id: id, rota: 'origems'}).then(() => {
                            this.$vs.notify({
                                color: 'success',
                                title: 'Sucesso',
                                text: 'A Origem foi deletada com sucesso'
                            });
                            this.getItems();
                        }).catch(erro => {
                            console.log(erro)
                            this.$vs.notify({
                                color: 'danger',
                                title: 'Erro',
                                text: 'Algo deu errado ao deletar a conta. Contate o suporte.'
                            })
                        })
                    }
                })
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
