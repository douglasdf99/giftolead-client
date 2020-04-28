<template>
    <div>
        <side-bar v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar" :data="sidebarData"/>
      <vs-row>
        <vs-col vs-w="12" class="mb-6">
            <vs-button color="primary" class="float-right botao-incluir" type="filled"  @click="addNewData">
              <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
              Incluir Brinde
            </vs-button>
            <!--<img src="@/assets/images/util/check-incluir.svg" >-->
        </vs-col>
      </vs-row>

      <vs-row>
          <vs-col vs-w="12">
            <div class="w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="flex items-center">

                    <!--<vs-input icon="search" placeholder="Pesquisar por contas" size="large" icon-after="true" label-placeholder="icon-after" class="w-full"/>-->
                    <!--<vs-input type="text" class="w-full" size="large"/>
                    <vs-button radius color="primary" type="border" icon-pack="feather" icon="icon-search"
                               class="btn-search"></vs-button>-->
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="dados.search" id="search_input" size="large"/>
                            <!-- SEARCH LOADING -->
                          <!-- SEARCH ICON -->
                          <div slot="submit-icon" class="absolute top-0 right-0 py-4 px-6">
                            <button type="submit" style="border: none; background: transparent; cursor: pointer;">
                              <feather-icon icon="SearchIcon" svgClasses="h-6 w-6"/>
                            </button>
                            <!--<feather-icon icon="SearchIcon" svgClasses="h-6 w-6" />-->
                          </div>
                        </form>
                    </div>

                </div>
                <!-- SEARCH INPUT -->
            </div>
          </vs-col>
      </vs-row>
        <vs-row>
            <vs-col vs-w="12">
                <div class="vx-row mt-2" v-show="items.length === 0">
                    <div class="w-full lg:w-6/12 xlg:w-6/12 s:w-full sem-item">
                        <div class="w-8/12">
                            <p class="span-sem-item">Você não possui nenhum item cadastrado</p> <br>
                            <p class="text-sem-item">
                                Para inserir novos registros você <br> pode clicar em incluir brinde.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="com-item" v-show="items.length > 0">
                    <vs-table :data="items" class="table-items">

                        <template slot="thead">
                          <vs-th></vs-th>
                            <vs-th>Brinde</vs-th>
                          <vs-th>Produto</vs-th>
                            <vs-th>Peso (Kg)</vs-th>
                            <vs-th>Largura (cm)</vs-th>
                            <vs-th>Altura (cm)</vs-th>
                            <vs-th>Comprimento (cm)</vs-th>

                        </template>

                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                              <vs-td class="flex justify-center items-center">
                                <vs-dropdown vs-trigger-click>
                                  <vs-button radius color="#EDEDED" type="filled" class="btn-more-icon"
                                             icon-pack="feather" icon="icon-more-horizontal"></vs-button>
                                  <vs-dropdown-menu>
                                    <vs-dropdown-item @click="updateData(data[indextr])">
                                      <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                      Editar
                                    </vs-dropdown-item>

                                    <vs-dropdown-item @click="deletar(data[indextr].id)">
                                      <vs-icon icon-pack="material-icons" icon="delete"></vs-icon>
                                      Deletar
                                    </vs-dropdown-item>

                                  </vs-dropdown-menu>
                                </vs-dropdown>
                              </vs-td>
                                <vs-td :data="data[indextr].nome">
                                    {{ data[indextr].nome }}
                                </vs-td>

                                <vs-td :data="data[indextr].token">
                                    {{ data[indextr].produto.nome }}
                                </vs-td>
                                <vs-td :data="data[indextr].token">
                                    {{ data[indextr].peso }}
                                </vs-td>
                                <vs-td :data="data[indextr].token">
                                    {{ data[indextr].largura }}
                                </vs-td>
                                <vs-td :data="data[indextr].token">
                                    {{ data[indextr].altura }}
                                </vs-td>
                                <vs-td :data="data[indextr].token">
                                    {{ data[indextr].comprimento }}
                                </vs-td>
                                <vs-td :data="data[indextr].token">
                                  <vs-icon icon-pack="material-icons" icon="fiber_manual_record" class="icon-grande"></vs-icon>{{ data[indextr].comprimento }}
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
    import SideBar from './SideBar'
    import moduleBrindes from '@/store/brindes/moduleBrindes.js'

    export default {
        name: "Index",
        components: {SideBar},
        data() {
            return {
                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {},
                routeTitle:'Contas',
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
            // if (!moduleBrindes.isRegistered) {
            //     this.$store.registerModule('brindes', moduleBrindes)
            //   moduleBrindes.isRegistered = true
            // }

            this.getBrindes();
        },
        methods: {
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
            getBrindes() {
                this.$store.dispatch('getVarios', {rota: 'brindes', params: this.dados}).then(response => {
                    console.log('retornado com sucesso', response)
                    this.pagination = response;
                    //this.items = response.data
                    //this.dados.page = this.pagination.current_page
                    this.$vs.loading.close()
                });
            },
            deletar(id) {
                this.$vs.dialog({
                    color: 'danger',
                    title: `Deletar conta id: ${id}`,
                    text: 'Deseja deletar esta Conta? Procedimento irreversível',
                    acceptText: 'Sim, deletar!',
                    accept: () => {
                        this.$vs.loading();
                        this.$store.dispatch('deleteItem', {id: id, rota: 'contas'}).then(() => {
                            this.$vs.notify({
                                color: 'success',
                                title: 'Sucesso',
                                text: 'A URL foi deletada com sucesso'
                            });
                            this.getBrindes();
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
                this.getBrindes();
            }
        },
        watch: {
            currentx(val) {
                this.$vs.loading();
                console.log('val', val);
                this.dados.page = this.currentx;
                this.getBrindes();
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
