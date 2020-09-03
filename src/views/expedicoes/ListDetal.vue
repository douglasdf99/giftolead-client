<template>
    <div>
        <detalhe v-if="addNewDataSidebar" :expedicao="expedicao" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar"
                  :data="sidebarData"/>
        <div class="vx-row mb-5">
            <div class="vx-col w-full lg:w-1/2">
                <div class="flex items-center justify-around" v-if="expedicao">
                    <p class="flex items-center">
                        {{expedicao.fechado ? 'fechada' : 'pendente'}}
                        <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                 class="ml-5 icon-grande" v-bind:style="{color: expedicao.fechado ? '#4DE98A' : '#E7BE00'}"></vs-icon>
                    </p>
                    <p>PLP: <b>{{expedicao.plp || 'Sem PLP gerada'}}</b></p>
                    <p class="flex items-center">Produto: <vs-chip class="ml-4 text-lg" :color="expedicao.brinde.produto.cor">{{expedicao.brinde.produto.nome}}</vs-chip></p>
                </div>
            </div>
        </div>
        <div class="vx-row flex items-center">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="dados.pesquisa" id="search_input_trans" size="large"
                                      placeholder="Pesquisar por n de expedição ou produto ou PLP"/>
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
            <div class="vx-col w-full lg:w-1/2 text-right">
                <vs-button color="primary" class="text-white px-6 py-4 mx-3" @click="gerarPlp" v-if="!expedicao.plp">Gerar PLP</vs-button>
                <vs-button color="primary" class="text-white px-6 py-4 mx-3" @click="imprimirPlp" v-else>Imprimir PLP</vs-button>
                <vs-button color="primary" class="text-white px-6 py-4" @click="imprimirEtiquetas()" v-if="expedicao.fechado">Imprimir Etiquetas</vs-button>
            </div>
        </div>
        <vs-table :data="expedicao.automacaos" class="table-items">
            <template slot="thead">
                <vs-th></vs-th>
                <vs-th>Destinatário</vs-th>
                <vs-th>E-mail</vs-th>
                <vs-th>Objeto nos correios</vs-th>
                <vs-th>CEP</vs-th>
                <vs-th></vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr">
                    <vs-td class="flex justify-center items-center">
                        <vs-dropdown vs-trigger-click>
                            <vs-button radius color="#EDEDED" type="filled"
                                       class="btn-more-icon relative botao-menu"
                                       icon-pack="material-icons" icon="more_horiz"
                            ></vs-button>
                            <vs-dropdown-menu class="dropdown-menu-list">
                                <vs-dropdown-item @click="visualizar(tr)">
                                    <vs-icon icon-pack="material-icons" icon="visibility"></vs-icon>
                                    Detalhar
                                </vs-dropdown-item>
                                <vs-dropdown-item @click="imprimir(tr.id)" v-if="expedicao.fechado">
                                    <vs-icon icon-pack="material-icons" icon="print"></vs-icon>
                                    Imprimir Etiqueta
                                </vs-dropdown-item>
                                <vs-dropdown-item @click="imprimir(tr.id)" v-if="expedicao.fechado">
                                    <vs-icon icon-pack="material-icons" icon="home"></vs-icon>
                                    Editar Endereço
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                    <vs-td><span class="font-bold">{{tr.nome_destinatario}}</span></vs-td>
                    <vs-td>{{tr.email_destinatario}}</vs-td>
                    <vs-td><span class="cursor-pointer font-bold text-primary">{{tr.rastreio}}</span></vs-td>
                    <vs-td>{{tr.endereco.cep | VMask('##.###-###')}}</vs-td>
                    <vs-td class="td-icons flex flex-col items-center justify-center">
                        <vs-icon icon-pack="material-icons" icon="check_circle_outline" v-if="tr.erro == null"
                                 class="icon-grande font-bold" style="color: #00ACC1"></vs-icon>
                        <vs-icon icon-pack="material-icons" icon="highlight_off" v-else
                                 class="icon-grande font-bold text-danger"></vs-icon>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-popup class="popup-iframe" style="overflow: hidden" title="Imprimindo etiquetas" :active.sync="modalIframe">
            <iframe :src="urlIframe" width="100%" height="100%" title="Imprimindo Etiqueta"></iframe>
        </vs-popup>
    </div>
</template>

<script>
    import moduleExpedicoesBrindes from "../../store/expedicoes/moduleExpedicoesBrindes";
    import detalhe from './Detalhe'
    import saveleadsConfig from "../../../saveleadsConfig";

    export default {
        name: "ListDetal",
        components: {
            detalhe
        },
        data() {
            return {
                expedicao: {
                    brinde: {
                        produto: {}
                    }
                },
                dados: {
                    pesquisa: '',
                },
                modalIframe: false,
                urlIframe: '',

                // Data Sidebar
                addNewDataSidebar: false,
                sidebarData: {},
            }
        },
        created() {
            if (!moduleExpedicoesBrindes.isRegistered) {
                this.$store.registerModule('expedicao', moduleExpedicoesBrindes);
                moduleExpedicoesBrindes.isRegistered = true;
            }

            this.getId(this.$route.params.id);
        },
        methods: {
            getId(id) {
                this.$vs.loading();
                this.$store.dispatch('expedicao/getId', id).then(response => {
                    console.log(response);
                    this.expedicao = {...response};
                    this.$vs.loading.close();
                });
            },
            pesquisar(e) {
                e.preventDefault();
                this.$vs.loading();
                this.getId(this.$route.params.id);
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
            },
            visualizar(obj) {
                this.sidebarData = obj
                this.toggleDataSidebar(true);
            },
            imprimir(id){
                this.modalIframe = true;
                this.urlIframe = saveleadsConfig.url_api + `/expedicaos/imprimiretiqueta?expedicao_id=${this.$route.params.id}&automacao_id=${id}`;
            },
            imprimirEtiquetas(){
                this.modalIframe = true;
                this.urlIframe = saveleadsConfig.url_api + '/expedicaos/imprimiretiqueta?expedicao_id=' + this.$route.params.id;
            },
            gerarPlp(){
                this.$vs.loading();
                this.$store.dispatch('expedicao/gerarPlp', this.expedicao.id).then(() => {
                    this.$vs.notify({
                        color: 'success',
                        text: 'PLP gerada com sucesso.'
                    });
                    this.getId(this.expedicao.id);
                }).catch(erro => {
                    console.log('erro', erro);
                    this.$vs.notify({
                        color: 'danger',
                        text: 'Algo deu errado ao gerar a PLP. Contate o suporte'
                    });
                    this.$vs.loading.close();
                });
            },
            imprimirPlp(){
                this.modalIframe = true;
                this.urlIframe = saveleadsConfig.url_api + '/expedicaos/imprimirplp?expedicao_id=' + this.$route.params.id;
            }
        },
    }
</script>

<style>
    .popup-iframe .vs-popup {
        width: 100vw !important;
        height: 100vh !important;
    }

    .popup-iframe .vs-popup--content {
        height: 100% !important;
        overflow: hidden;
    }
</style>