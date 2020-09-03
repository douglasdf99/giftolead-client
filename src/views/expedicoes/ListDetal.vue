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
                    <p class="flex items-center">Produto:
                        <vs-chip class="ml-4 text-lg" :color="expedicao.brinde.produto.cor">{{expedicao.brinde.produto.nome}}</vs-chip>
                    </p>
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
                                <vs-dropdown-item @click="editarEndereco(tr)">
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
        <vs-popup class="popup-endereco" style="overflow: hidden" title="Editando endereço" :active.sync="modalEndereco">
            <div class="">
                <div class="p-6 pt-0">
                    <h3 class="text-center text-xl md:text-left Arial font-bold md:text-2xl text-gray-900 my-3">Suas informações pessoais</h3>
                    <form class="w-full px-6">
                        <div class="flex flex-col">
                            <p class="gray-wdc mb-2 text-lg font-bold">Destinatário</p>
                            <vs-input class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg mb-3" id="search_input_trans" v-model="endereco.nome" type="text" required />
                        </div>
                        <div class="vx-row mt-2">
                            <div class="vx-col w-3/12">
                                <p class="gray-wdc mb-2 text-lg font-bold">DDD</p>
                                <vs-input class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg mb-3" id="search_input_trans"
                                       v-model="endereco.ddd" type="text" required v-mask="'##'" @keypress="isNumber" />
                            </div>
                            <div class="vx-col w-9/12">
                                <p class="gray-wdc mb-2 text-lg font-bold">Telefone</p>
                                <vs-input class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg mb-3" id="search_input_trans"
                                       v-model="endereco.telefone" type="text" required v-mask="['####-####', '#####-####']" @keypress="isNumber" />
                            </div>
                        </div>
                    </form>
                    <h3 class="text-center text-xl md:text-left Arial font-bold md:text-2xl text-gray-900 mb-3 mt-5">Suas informações de entrega</h3>
                    <form class="w-full px-6 vs-con-loading__container" @submit="buscaCep" id="div-with-loading">
                        <div class="flex flex-col">
                            <p class="gray-wdc mb-2 text-lg font-bold">CEP (CÓDIGO POSTAL)</p>
                            <vs-input class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg mb-3" id="search_input_trans"
                                   v-model="endereco.cep" type="text" required @keypress="isNumber" v-mask="'########'" />
                        </div>
                        <vs-button class="border-none bg-primary hover:bg-black text-white cursor-pointer font-bold py-2 px-4 rounded-lg w-full h-16 text-2xl my-4" v-if="!valido" type="submit">
                            Buscar
                        </vs-button>
                        <div class="flex flex-col mt-8">
                            <p class="gray-wdc mb-2 text-lg font-bold">Estado</p>
                            <vs-input class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg mb-3" id="search_input_trans" type="text" required v-model="endereco.estado"
                                   :disabled="true"/>
                        </div>
                        <div class="flex flex-col">
                            <p class="gray-wdc mb-2 text-lg font-bold">Cidade</p>
                            <vs-input class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg mb-3" id="search_input_trans" type="text" required v-model="endereco.cidade"
                                   :disabled="true"/>
                        </div>
                        <div class="flex flex-col">
                            <p class="gray-wdc mb-2 text-lg font-bold">Bairro</p>
                            <vs-input class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg mb-3" id="search_input_trans" type="text" required v-model="endereco.bairro"
                                   :disabled="true"/>
                        </div>
                        <div class="flex flex-col">
                            <p class="gray-wdc mb-2 text-lg font-bold">Endereco</p>
                            <vs-input class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg mb-3" id="search_input_trans" type="text" required v-model="endereco.endereco"
                                   :disabled="true"/>
                        </div>
                        <div class="flex flex-col">
                            <p class="gray-wdc mb-2 text-lg font-bold">Complemento</p>
                            <vs-input class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg mb-3" id="search_input_trans" type="text" required v-model="endereco.complemento"/>
                        </div>
                        <div class="flex flex-col">
                            <p class="gray-wdc mb-2 text-lg font-bold">Número</p>
                            <vs-input class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg mb-3" id="search_input_trans" type="text" required v-model="endereco.numero" @keypress="isNumber"/>
                        </div>
                        <vs-button class="border-none bg-primary hover:bg-black text-white cursor-pointer font-bold py-2 px-4 rounded-lg w-full h-16 text-2xl my-4" type="submit" @click="storeEndereco"
                                   :disabled="invalidoEntrega">
                            Confirmar dados
                        </vs-button>
                    </form>
                </div>
            </div>
        </vs-popup>
    </div>
</template>

<script>
    import moduleExpedicoesBrindes from "../../store/expedicoes/moduleExpedicoesBrindes";
    import detalhe from './Detalhe'
    import saveleadsConfig from "../../../saveleadsConfig";

    const {consultarCep} = require("correios-brasil");

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
                //Iframe de impressões
                modalIframe: false,
                urlIframe: '',

                //Editando endereco
                modalEndereco: false,
                endereco: {
                    telefone: ''
                },
                valido: true,
                antigoCep: '',

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
            console.log('valido', this.valido)
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
            imprimir(id) {
                this.modalIframe = true;
                this.urlIframe = saveleadsConfig.url_api + `/expedicaos/imprimiretiqueta?expedicao_id=${this.$route.params.id}&automacao_id=${id}`;
            },
            imprimirEtiquetas() {
                this.modalIframe = true;
                this.urlIframe = saveleadsConfig.url_api + '/expedicaos/imprimiretiqueta?expedicao_id=' + this.$route.params.id;
            },
            gerarPlp() {
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
            imprimirPlp() {
                this.modalIframe = true;
                this.urlIframe = saveleadsConfig.url_api + '/expedicaos/imprimirplp?expedicao_id=' + this.$route.params.id;
            },

            //Editar endereço da automação
            editarEndereco(obj) {
                this.endereco = {...obj.endereco};
                this.endereco.ddd = this.endereco.telefone.substring(0, 2);
                this.endereco.telefone = this.endereco.telefone.replace(this.endereco.ddd, '');
                this.modalEndereco = true;
            },
            buscaCep(e) {
                e.preventDefault();
                if (this.valido) {
                    console.log('teste')
                } else {
                    this.endereco.complemento = '';
                    this.endereco.numero = '';
                    consultarCep(this.endereco.cep).then(response => {
                        console.log('resposta', response);
                        this.valido = true;
                        this.antigoCep = this.endereco.cep;
                        this.endereco.cidade = this.removeAccents(response.localidade);
                        this.endereco.bairro = this.removeAccents(response.bairro);
                        this.endereco.endereco = this.removeAccents(response.logradouro);
                        this.endereco.estado = this.removeAccents(response.uf);
                    }).catch(erro => {
                        console.log(erro);
                        this.$vs.notify({
                            title: '',
                            color: 'danger',
                            text: erro.message
                        })
                    });
                }
            },
            storeEndereco() {
                this.endereco.nome = this.removeAccents(this.endereco.nome);
            }
        },
        computed: {
            invalidoEntrega() {
                return (!this.endereco.complemento || !this.endereco.numero || !this.endereco.ddd || !this.endereco.telefone || !this.endereco.nome || this.endereco.telefone.length <= 8)
            },
        },
        watch: {
            endereco: {
                handler: function (e) {
                    if (e.cep != this.antigoCep) {
                        this.valido = false;
                    }
                },
                deep: true
            }
        }
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

    .popup-endereco .vs-popup--content {
        background-color: rgb(238 232 232) !important;
        margin-top: 0;
    }
</style>