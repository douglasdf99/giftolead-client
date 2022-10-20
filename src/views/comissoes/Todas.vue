<template>
    <div>
        <detalhe-comissao v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar"  @closeSidebar="toggleDataSidebar"
                          :data="sidebarData"/>
        <div class="vx-row flex items-center lg:mt-5 sm:mt-6 justify-between">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-8/12 xlg:w-5/12">
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
                <div class="vx-row my-3">
                    <div class="vx-col w-full lg:w-1/2 sm:w-full">
                        <label class="vs-input--label">Usuário</label>
                        <v-select v-model="selectedAten" :class="'select-large-base'" :clearable="true" class="bg-white"
                                  :options="usuarios"/>
                    </div>
                    <div class="vx-col w-full lg:w-1/2 sm:w-full">
                        <select-responsaveis @chooseResp="chooseResp" />
                    </div>
                </div>
                <!-- SEARCH INPUT -->
            </div>
            <div class="vx-col w-full lg:w-3/12 sm:w-full">
                <vx-card class="shadow-none">
                    <span class="destaque">Comissões</span>
                    <p class="font-bold text-3xl my-5 text-warning">R$ {{formatPrice(soma)}}</p>
                </vx-card>
            </div>
        </div>
        <vs-row class="mt-10">
            <vs-col vs-w="12">
                <listagem :items="comissoes" tipo="todas"></listagem>
                <vs-pagination class="mt-2" :total="pagination.last_page"
                               v-model="currentx"></vs-pagination>

            </vs-col>
        </vs-row>
    </div>
</template>

<script>
import DetalheComissao from '../comissoes/DetalheComissao';
import listagem from './ListComissoes';
import vSelect from 'vue-select';
import saveleadsConfig from "../../../saveleadsConfig";
import moduleComissoes from "../../store/comissoes/moduleComissoes";
import SelectResponsaveis from "../components/SelectResponsaveis";

export default {
    name: "Todas",
    components: {DetalheComissao, listagem, 'v-select': vSelect, SelectResponsaveis},
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
                aba: 'comissao',
                tipo: 'comissionadas'
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
            selectedAten: {id: null, label: 'Selecione o atendente'},
            selectedResp: null,
            responsaveis: [
                {id: 'whatsapplist', label: 'WhatsappList'},
                {id: 'campanhacancelado', label: 'Campanha de Cancelados'},
                {id: 'campanhaboleto', label: 'Campanha de Boleto'},
                {id: 'campanhacarrinho', label: 'Campanha de Carrinho'},
                {id: 'usuario', label: 'Usuário'},
            ],
            soma: 0,
            usuarios: []
        };
    },
    created() {
        this.$vs.loading();
        if (!moduleComissoes.isRegistered) {
            this.$store.registerModule('comissoes', moduleComissoes);
            moduleComissoes.isRegistered = true;
        }

        this.getItems();
        this.getOpcoes();
    },
    methods: {
        addNewData() {
            this.sidebarData = {};
            this.toggleDataSidebar(true);
        },
        updateData(obj) {
            this.sidebarData = obj;
            this.toggleDataSidebar(true);
        },
        toggleDataSidebar(val = false) {
            this.addNewDataSidebar = val;
        },
        getItems() {
            this.$vs.loading();

            let control = 0;//Controla entradas em cada condição
            let url = '';
            if (this.search !== '') {
                url += 'name:' + this.search + ';';
                url += 'email:' + this.search;
                control++;
            }

            if(this.selectedAten.id != null) {
                this.dados.user_id = this.selectedAten.id;
            } else this.dados.user_id = null;

            if(this.selectedResp) {
                //this.dados.responsavel_type = this.selectedResp.id;
                this.dados.responsavel_type = this.selectedResp.criador_type;
                this.dados.responsavel_id = this.selectedResp.id;
            } else {
                this.dados.responsavel_type = null;
                this.dados.responsavel_id = null;
            }

            if (control >= 2)
                url += '&searchJoin=and';

            this.dados.search = url;

            this.$store.dispatch('comissoes/getCom', {params: this.dados}).then(response => {
                this.comissoes = [...response[0].data];
                this.pagination = response[0];
                this.soma = parseFloat(response.soma);
                //this.dados.page = this.pagination.current_page
            }).catch(error => {
                this.$vs.notify({
                    text: error.response.data.message,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
            }).finally(() => this.$vs.loading.close());
        },
        getOpcoes() {
            this.selectedAten.label = 'Carregando...';
            this.$store.dispatch('users/getArraySelect').then(response => {
                this.usuarios = [...response];
                this.selectedAten.label = 'Selecione o atendente';
            });
        },
        pesquisar(e) {
            this.dados.page = 1;
            e.preventDefault();
            this.$vs.loading();
            this.getItems();
        },
        visualizar(obj) {
            this.sidebarData = obj;
            this.toggleDataSidebar(true);
        },
        gerandoOrdem(arr) {
            let ids = arr.map(item => {return item.id;});
            this.$vs.loading();
            this.$store.dispatch('comissoes/storeOrdens', ids).then(() => {
                this.getItems();
            });
        },

        chooseResp(obj) {
            this.selectedResp = obj;
        }
    },
    watch: {
        currentx() {
            this.$vs.loading();
            this.dados.page = this.currentx;
            this.getItems();
        },
        "$route"() {
            this.routeTitle = this.$route.meta.pageTitle;
        },
        selectedAten() {
            if(!this.selectedAten)
                this.selectedAten = {id: null, label: 'Selecione o atendente'};

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

};
</script>
