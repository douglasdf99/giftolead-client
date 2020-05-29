<template>
    <div>
        <side-bar v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar"
                  :data="sidebarData"/>

        <div class="vx-row flex items-center lg:mt-10 sm:mt-6">
            <div class="vx-col w-full sm:w-0 md:w-0 lg:w-6/12 xlg:w-5/12 col-btn-incluir-mobile mb-3">
                <vs-button color="black" class="float-right botao-incluir" type="filled" @click="addNewData">
                    <vs-icon icon-pack="material-icons" icon="keyboard_backspace" class="icon-grande"></vs-icon>
                    Voltar
                </vs-button>
                <!-- SEARCH INPUT -->
            </div>

            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">

                <div class="flex items-center">
                    <div class="relative w-full">
                            <!-- SEARCH INPUT -->
                      <label class="destaque">Selecione o produto</label>
                      <v-select v-model="selectedProduto" :class="'select-large-base'" :clearable="false" class="bg-white"
                                :options="produtos"/>
                    </div>

                </div>
                <!-- SEARCH INPUT -->
            </div>
            <div class="vx-col w-full lg:w-6/12 xlg:w-5/12 col-btn-incluir-desktop">
                <vs-button color="black" class="float-right botao-incluir" type="filled" @click="addNewData">
                    <vs-icon icon-pack="material-icons" icon="keyboard_backspace" class="icon-grande"></vs-icon>
                  Voltar
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
                            </p>
                        </div>
                    </div>
                </div>
                <div class="com-item mt-20" v-show="items.length > 0">
                  <vx-card :key="link.id"  class=" mb-1 unsetshadow-setborder p-0" v-for="(link, index) in items">
                    <div class="vx-row">
                      <div class="vx-col sm:w-8/12 w-full">
                        <p class="mb-0 text-base font-bold pl-4 pt-2 "> {{link.descricao}}</p>
                      </div>
                      <div class="vx-col sm:w-4/12 w-full">
                        <div class="vx-col w-full relative py-0">
                          <vx-input-group v-if="getlink(link)">
                            <vs-input :value="getlink(link)" disabled  />
                            <template slot="append">
                              <div class="append-text btn-addon">
                                <vs-button color="black" type="border" @click="copyText(getlink(link))"> <i class="material-icons icone-input" >file_copy</i></vs-button>
                                <vs-button color="black" type="border" @click="goto(getlink(link))"> <i class="material-icons icone-input"  >trending_flat</i></vs-button>
                              </div>
                            </template>
                          </vx-input-group>
                          <a href="javascript:void(0)" class="mb-0 text-base font-bold pl-4 pt-2 " @click="gerarLink(link)" v-else> Gerar Link</a>
                        </div>
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
    import moduleLinks from '@/store/links/moduleLinks.js'
    import vSelect from 'vue-select'

    export default {
        name: "Index",

        components: {SideBar,  'v-select': vSelect,},

        data() {
            return {
                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {},
                routeTitle: 'Contas',
                produto:{},
                selectedProduto: null,
                produtos: [],
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
            if (!moduleLinks.isRegistered) {
                this.$store.registerModule('links', moduleLinks)
              moduleLinks.isRegistered = true
            }
            this.dados.produto = this.$route.params.id;
            this.getProduto(this.$route.params.id);
            this.getOpcoes();
            this.getItems();

        },
        methods: {
          getOpcoes() {
            //Produtos
            this.$store.dispatch('produtos/get').then(response => {
              let arr = [...response];
              arr.forEach(item => {
                this.produtos.push({id: item.id, label: item.nome})
                if (item.id == this.$route.params.id) {
                  this.selectedProduto =  {id: item.id, label: item.nome}
                }
              });
            });
          },
          getProduto(id) {
            this.$store.dispatch('produtos/getId', id).then(data => {
              this.produto = {...data};
            })
          },
          getlink(item){
            let link = '';
            let user = JSON.parse(localStorage.getItem("userInfo"));
            item.linksexternos.forEach(ext => {
              console.log('link itens',ext.user_id ,user.uid )
                if (ext.user_id == user.uid){
                  link = 'https://svlds.me/'+ext.codigo;
                }
            });
            return link;
          },
          meulink() {

          },
          copyText(text){
            const thisIns = this;
            this.$copyText(text).then(function () {
              thisIns.$vs.notify({
                title: 'Success',
                text: 'URL copiada para sua área de transferência',
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check-circle'
              })
            }, function () {
              thisIns.$vs.notify({
                title: 'Failed',
                text: 'Erro ao copiar link',
                color: 'danger',
                iconPack: 'feather',
                position: 'top-center',
                icon: 'icon-alert-circle'
              })
            })
            },
            goto(text){
              window.open(text, '_blank');
            },
            gerarLink(link){
              let data = {};
              data.codigo_id = link.identidade;
              this.$store.dispatch('links/gerarlink', data).then(() => {
                this.$vs.notify({
                  color: 'success',
                  title: 'Sucesso',
                  text: 'O link foi gerado com sucesso'
                });
                this.getItems();
              }).catch(erro => {
                console.log(erro)
                this.$vs.notify({
                  color: 'danger',
                  title: 'Erro',
                  text: 'Algo deu errado ao gerar o link. Contate o suporte.'
                })
              })
            },
            addNewData() {
             //this.$router.push({path: '/configuracoes/links/produto/'+ this.produto.id + '/criar'});
            },
            updateData(id) {
              //this.$router.push({path: '/configuracoes/links/produto/'+ this.produto.id + '/editar/' + id});
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
            },
            getItems() {
              this.$vs.loading();
                this.$store.dispatch('getVarios', {rota: 'links', params: this.dados}).then(response => {
                    this.pagination = response;
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
                        this.$store.dispatch('deleteItem', {id: id, rota: 'links'}).then(() => {
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
          selectedProduto: function (val) {
            console.log('val', val);
            this.$router.push({path: '/meuslinks/produto/'+ val.id});
            this.dados.produto = val.id;
            this.getProduto(val.id);
            this.getItems();
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
<style scoped>
  [dir] .vx-card .vx-card__collapsible-content .vx-card__body {
    padding: 0.8rem;
  }
  .unsetshadow-setborder{
    border: unset;
  }
  .unsetshadow-setborder:hover{
    border: unset;
    filter: brightness(0.95);
  }
  .btn-addon:active{
    color: #333333;
  }
  .vs-button-border.isActive .icone-input {
    color: #333333 !important;
  }
</style>
