<template>
    <div>
        <detalhe-comissao v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar"
                  :data="sidebarData"/>
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
                <div class="vx-row my-3" v-if="dados.aba == 'comissao'">
                    <div class="vx-col w-full lg:w-1/2 sm:w-full">
                        <label class="vs-input--label">Usuário</label>
                        <v-select v-model="selectedUser" :class="'select-large-base'" :clearable="true" class="bg-white"
                                  :options="usuarios"/>
                    </div>
                    <div class="vx-col w-full lg:w-1/2 sm:w-full">
                        <label class="vs-input--label">Responsável</label>
                        <v-select v-model="selectedResp" :class="'select-large-base'" :clearable="true" class="bg-white"
                                  :options="responsaveis"/>
                    </div>
                </div>
                <!-- SEARCH INPUT -->
            </div>
            <div class="vx-col w-full lg:w-3/12 sm:w-full">
                <vx-card class="shadow-none">
                    <span class="destaque">Ordens a gerar</span>
                    <p class="font-bold text-3xl my-5" v-bind:class="''">R$ {{formatPrice(soma)}}</p>
                </vx-card>
            </div>
        </div>
        <vs-row class="mt-10">
            <vs-col vs-w="12">
                <vs-tabs :color="colorx">
                    <vs-tab @click="colorx = 'warning'; getItems('pendente'); dados.aba = 'usuario'" color="warning" value="10"
                            :label="'gerar ordens' + ( dados.aba === 'usuario' ? ` (${comissoes.length})` : '')">
                        <listagem @gerarOrdens="gerandoOrdem" @visualizar="visualizar" :items="comissoes" tipo="usuario"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab @click="colorx = 'success'; getItems('reprovado'); dados.aba = 'comissao'" color="success"
                            :label="'comissões' + ( dados.aba === 'comissao' ? ` (${comissoes.length})` : '')">
                        <listagem @gerarOrdens="gerandoOrdem" @visualizar="visualizar" :items="comissoes" tipo="comissao"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                </vs-tabs>

            </vs-col>
        </vs-row>
    </div>
</template>

<script>
    import DetalheComissao from './DetalheComissao'
    import listagem from './ListComissoes'
    import vSelect from 'vue-select'
    import saveleadsConfig from "../../../saveleadsConfig";
    import moduleComissoes from "../../store/comissoes/moduleComissoes";
    import moduleUsuario from "../../store/usuarios/moduleUsuario";

    export default {
        name: "Comissionar",
        components: {DetalheComissao, listagem, 'v-select': vSelect},
        data() {
            return {
                colorx: 'warning',
                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {},
                search: '',
                dados: {
                    search: '',
                    page: 1,
                    length: 25,
                    aba: 'usuario'
                },
                pagination: {
                    last_page: 1,
                    page: 1,
                    current_page: 1
                },
                lengths: saveleadsConfig.lengths,
                currentx: 1,
                comissoes: [],
                tipoCom: 'pendente',
                selectedUser: {id: null},
                selectedResp: {id: null},
                responsaveis: [
                    {id: 'whatsapplist', label: 'WhatsappList'},
                    {id: 'campanhacancelado', label: 'Campanha de Cancelados'},
                    {id: 'campanhaboleto', label: 'Campanha de Boleto'},
                    {id: 'campanhacarrinho', label: 'Campanha de Carrinho'},
                    {id: 'usuario', label: 'Usuário'},
                ],
                soma: 0,
                usuarios: []
            }
        },
        created() {
            this.$vs.loading()
            if (!moduleComissoes.isRegistered) {
                this.$store.registerModule('comissoes', moduleComissoes)
                moduleComissoes.isRegistered = true
            }

            if (!moduleUsuario.isRegistered) {
                this.$store.registerModule('usuarios', moduleUsuario)
                moduleUsuario.isRegistered = true
            }
            this.getOpcoes();
            this.getItems();
        },
        methods: {
            addNewData() {
                this.sidebarData = {}
                this.toggleDataSidebar(true)
            },
            updateData(obj) {
                console.log('editando', obj)
                this.sidebarData = obj
                this.toggleDataSidebar(true)
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
            },
            getItems() {
                this.$vs.loading();

                let url = '';
                let control = 0;//Controla entradas em cada condição
                if (this.search !== '') {
                    url += 'name:' + this.search + ';';
                    url += 'email:' + this.search;
                    control++;
                }

                if(this.selectedUser.id){
                    this.dados.user_id = this.selectedUser.id;
                }

                if(this.selectedResp.id){
                    this.dados.responsavel_type = this.selectedResp.id;
                }

                if (control >= 2)
                    url += '&searchJoin=and';

                this.dados.search = url;

                this.$store.dispatch('comissoes/getCom', {params: this.dados}).then(response => {
                    console.log('retornado com sucessso', response)
                    this.comissoes = [...response[0].data]
                    this.pagination = response[0];
                    this.soma = parseFloat(response.soma);
                    //this.dados.page = this.pagination.current_page
                    this.$vs.loading.close();
                });
            },
            getOpcoes(){
                this.$store.dispatch('usuarios/get').then(response => {
                    this.usuarios = [...this.arraySelect(response)];
                });
            },
            pesquisar(e) {
                e.preventDefault();
                this.$vs.loading();
                this.getItems();
            },
            visualizar(obj){
                console.log('entrou no visualizar')
                this.sidebarData = obj;
                this.toggleDataSidebar(true);
            },
            gerandoOrdem(arr){
                let ids = arr.map(item => {return item.id});
                this.$vs.loading();
                this.$store.dispatch('comissoes/storeOrdens', ids).then(() => {
                    this.getItems();
                }).catch(erro => {
                    console.log('erro', erro);
                })
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
            selectedUser() {
                this.$vs.loading();
                this.dados.page = 1;
                this.getItems();
            },
            selectedResp() {
                this.$vs.loading();
                this.dados.page = 1;
                this.getItems();
            },
            dados: {
                handler(val) {
                    console.log(val.length)
                    if (val.length != this.pagination.per_page) {
                        this.dados.page = 1;
                        this.$vs.loading();
                        this.getItems();
                    }
                },
                deep: true
            },
        },
        mounted() {},
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
