<template>
    <div>
        <detalhe v-if="addNewDataSidebar" :expedicao="expedicao" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar"
                 :data="sidebarData"/>
        <endereco v-if="modalEndereco" :expedicao="expedicao" :isSidebarActive="modalEndereco" @closeSidebar="toggleDataSidebarEnd"
                  :data="endereco"/>
        <div class="vx-row mb-5">
            <div class="vx-col w-full lg:w-3/4">
                <div class="flex items-center justify-around" v-if="expedicao">
                    <p class="flex items-center">
                        {{ expedicao.fechado ? 'fechada' : 'pendente' }}
                        <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                 class="ml-5 icon-grande" v-bind:style="{color: expedicao.fechado ? '#4DE98A' : '#E7BE00'}"></vs-icon>
                    </p>
                    <p>PLP: <b>{{ expedicao.plp || 'Sem PLP gerada' }}</b></p>
                    <p class="flex items-center">Produto:
                        <vs-chip class="ml-4 text-lg" :color="expedicao.brinde.produto.cor"> {{ expedicao.brinde.produto.nome }}</vs-chip>
                    </p>
                    <p class="flex items-center">Brinde: {{ expedicao.brinde.nome }}</p>
                    <p class="flex items-center">Contrato: {{ expedicao.contrato.nome }}
                        <vx-tooltip position="top" text="Selecionar Contrato">
                            <vs-button color="primary" class="p-2 ml-3" @click="modalContrato = true" icon-pack="material-icons" icon="create"></vs-button>
                        </vx-tooltip>
                    </p>
                </div>
            </div>
        </div>
        <div class="vx-row flex items-center">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form>
                            <vs-input autocomplete class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="dados.pesquisa" id="search_input_trans" size="large"
                                      placeholder="Pesquisar"/>
                            <!-- SEARCH LOADING -->
                            <!-- SEARCH ICON -->
                            <div slot="submit-icon" class="absolute top-0 right-0 py-3 px-6">
                                <button type="button" class="btn-search-bar">
                                    <feather-icon icon="SearchIcon" svgClasses="h-6 w-6"/>
                                </button>
                                <!--<feather-icon icon="SearchIcon" svgClasses="h-6 w-6" />-->
                            </div>
                        </form>
                    </div>
                </div>
                <!-- SEARCH INPUT -->
            </div>
        </div>
        <vs-table :data="list" class="table-items">
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
                                <vs-dropdown-item @click="arquivar(tr)" v-if="!expedicao.plp && $acl.check('brinde_automacao_arquivar')">
                                    <vs-icon icon-pack="material-icons" icon="work"></vs-icon>
                                    Arquivar
                                </vs-dropdown-item>
                                <vs-dropdown-item @click="imprimir(tr.id)" v-if="expedicao.fechado && $acl.check('brinde_automacao_imprimir')">
                                    <vs-icon icon-pack="material-icons" icon="print"></vs-icon>
                                    Etiqueta
                                </vs-dropdown-item>
                                <vs-dropdown-item @click="imprimirDeclaracao(tr.id)" v-if="expedicao.fechado">
                                    <vs-icon icon-pack="material-icons" icon="print"></vs-icon>
                                    Declaração de Conteúdo
                                </vs-dropdown-item>
                                <vs-dropdown-item @click="editarEndereco(tr)" v-if="!expedicao.fechado">
                                    <vs-icon icon-pack="material-icons" icon="home"></vs-icon>
                                    Editar Endereço
                                </vs-dropdown-item>
                                <vs-dropdown-item @click="enviarRastreio(tr.id)">
                                    <vs-icon icon-pack="material-icons" icon="email"></vs-icon>
                                    Enviar Rastreio
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                    <vs-td><span class="font-bold">{{ tr.nome_destinatario }}</span></vs-td>
                    <vs-td>{{ tr.email_destinatario }}</vs-td>
                    <vs-td class="flex mb-2">
                        <vx-tooltip position="top" text="Clique para copiar código de rastreio">
                            <span class="cursor-pointer font-bold text-primary" @click="copyRastreio(tr.rastreio)"> {{ tr.rastreio }} </span>
                        </vx-tooltip>
                    </vs-td>
                    <vs-td>{{ tr.endereco.cep | VMask('##.###-###') }}</vs-td>
                    <vs-td class="td-icons flex flex-col items-center justify-center">
                        <vs-icon icon-pack="material-icons" icon="check_circle_outline" v-if="tr.erro == null"
                                 class="icon-grande font-bold" style="color: #00ACC1"></vs-icon>
                        <vs-icon icon-pack="material-icons" icon="highlight_off" v-else
                                 class="icon-grande font-bold text-danger"></vs-icon>

                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>

        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <div class="container">
                        <div class="vx-row mb-2 relative">
                            <vs-button color="primary" class="text-white px-6 py-4 mx-3" @click="gerarPlp" v-if="!expedicao.plp && $acl.check('brinde_expedicao_gerarplp')">Gerar PLP</vs-button>
                            <vs-button color="primary" class="text-white px-6 py-4 mx-3" @click="imprimirPlp" v-else>Imprimir PLP</vs-button>
                            <vs-dropdown vs-trigger-click>
                                <vs-button color="primary" class="text-white px-6 py-4" v-if="expedicao.fechado">Imprimir Etiquetas</vs-button>
                                <vs-dropdown-menu class="dropdown-menu-list">
                                    <vs-dropdown-item @click="imprimirEtiquetas('multi')">
                                        <vs-icon icon-pack="material-icons" icon="print"></vs-icon>
                                        Imprimir 4 por página
                                    </vs-dropdown-item>
                                    <vs-dropdown-item @click="imprimirEtiquetas('single')">
                                        <vs-icon icon-pack="material-icons" icon="print"></vs-icon>
                                        Imprimir 1 por página
                                    </vs-dropdown-item>
                                </vs-dropdown-menu>
                            </vs-dropdown>
                            <vs-button color="primary" class="text-white px-6 py-4 mx-3" @click="imprimirDeclaracao(null)">Imprimir Declaração de conteúdo</vs-button>
                            <vs-button class="ml-3" color="dark" type="flat" icon-pack="feather" icon="x-circle"
                                       @click="$router.push({path: '/brindes/expedicoes'})">
                                Voltar
                            </vs-button>
                        </div>
                    </div>
                </div>
            </footer-doug>
        </transition>
        <vs-popup id="pdf-with-loading" class="popup-iframe vs-con-loading__container" style="overflow: hidden" title="Imprimindo etiquetas" :active.sync="modalIframe">


            <iframe v-if="urlIframe" :src="urlIframe" width="100%" height="100%" title="Imprimindo Etiqueta"></iframe>

        </vs-popup>
        <vs-prompt
            @cancel="modalContrato = false"
            @accept="update"
            acceptText="Salvar"
            cancelText="Cancelar"
            :title="'Trocar o contrato'"
            :max-width="'600px'"
            :active.sync="modalContrato">
            <div class="con-exemple-prompt">
                <span class="font-regular mb-2">Selecione</span>
                <v-select v-model="selectedContrato" :class="'select-large-base'" :clearable="false"
                          style="background-color: white" :options="contratos" v-validate="'required'" name="produtoUpsell"/>
            </div>
        </vs-prompt>
        <!-- inicio popup-->
        <div class="vs-component con-vs-popup holamundo vs-popup-primary" style="" v-show="modalGerarPlp">
            <div class="vs-popup--background"></div>
            <div class="vs-popup" style="background: rgb(255, 255, 255);">
                <header class="vs-popup--header">
                    <div class="vs-popup--title">
                    </div>
                </header>
                <div class="vs-popup--content">
                    <div class="vx-col w-full">
                        <vx-card class="p-2">
                            <div class="text-left mb-10">
                                <h2 class="text-center"> Gerando PLP </h2>
                                <h6 class="mb-2 mt-4"><b>Numero da Expedição :</b> #{{ expedicao.id }}</h6>
                                <h6 class="mb-2"><b>Brinde a ser enviado :</b> {{ expedicao.brinde.nome }}</h6>
                                <h6 class="mb-2 flex"><b>Pertencente ao produto :</b>
                                    <vs-chip class="ml-4 text-lg" :color="expedicao.brinde.produto.cor">{{ expedicao.brinde.produto.nome }}</vs-chip>
                                </h6>
                                <p class="mb-2"></p>
                            </div>
                            <vs-divider/>

                            <div class="flex items-center">
                                <div class="fill-row-loading w-full" v-if="step == 0">
                                    <h6 class="mb-6"><b>Status atual:</b> <span> Verificando etiquetas </span></h6>
                                    <h6 class="text-center mb-2"> {{ count }}/{{ expedicao.automacaos.length }} </h6>
                                    <vs-progress :height="12" :percent="percent" color="success"></vs-progress>

                                </div>

                                <!--                steep2-->
                                <div class="fill-row-loading w-full" v-if="step == 1">
                                    <div class="" v-if="!plpGerada">
                                        <h6 class="mb-6"><b>Status atual:</b> <span> Realizando comunicação com o sistema de correios </span></h6>
                                        <vs-progress indeterminate color="primary"></vs-progress>
                                    </div>
                                    <div class="" v-if="plpGerada == 5">
                                        <h6 class="mb-6"><b>Status atual:</b> <span class="text-daner"> A PLP não pode ser gerada </span></h6>
                                        <vs-divider border-style="dotted" color="primary">Detalhamento</vs-divider>
                                        <div class="" v-if="automacaosErros.length > 0">
                                            <h6 class="mb-6"><b></b></h6>
                                            <vs-list-header :title="'Etiquetas com erro ('+ automacaosErros.length +') :'"></vs-list-header>
                                            <vs-list-item v-for="(automacao, index) in automacaosErros" :key="index" :title="automacao.nome_destinatario" :subtitle="automacao.email_destinatario">
                                                <vs-button size="large" class="font-bold mx-2 rounded-full" color="danger" type="filled"
                                                           icon-pack="material-icons" icon="remove_red_eye">
                                                </vs-button>
                                            </vs-list-item>
                                            <div class="flex justify-center flex-wrap mt-10">
                                                <vs-button color="warning" type="filled" icon-pack="material-icons" icon="close" @click="atualiza">Fechar</vs-button>
                                                <vs-button color="warning" type="filled" icon-pack="material-icons" icon="sync" @click="gerarPlp">Tentar novamente</vs-button>
                                            </div>
                                        </div>
                                        <div class="" v-else>
                                            <h5 class="text-danger text-center" v-if="erroMensage">{{ erroMensage }}</h5>
                                            <h5 class="text-danger text-center" v-else>Por favor tente novamente mais tarde</h5>
                                        </div>
                                    </div>
                                    <div class="" v-if="plpGerada == 10">
                                        <h6 class="mb-6"><b>Status atual:</b> <span class="text-daner"> PLP GERADA </span></h6>
                                        <h5 class="text-center text-success"> PLP GERADA COM SUCESSO!</h5>
                                        <vs-progress :height="12" :percent="100" color="success"></vs-progress>
                                        <div class="flex justify-center flex-wrap mt-10">
                                            <vs-button color="success" type="filled" icon-pack="material-icons" icon="call_made" @click="atualiza">Ir para Expedição</vs-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </vx-card>
                    </div>
                </div>
            </div>
        </div>
        <!-- fim popup-->
    </div>
</template>

<script>
import moduleExpedicoesBrindes from "../../store/expedicoes/moduleExpedicoesBrindes";
import detalhe from './Detalhe'
import endereco from './Endereco'
import saveleadsConfig from "../../../saveleadsConfig";
import vSelect from 'vue-select'
import moduleContrato from "../../store/contratos/moduleContrato";
import axios from "@/axios.js"

const {consultarCep} = require("correios-brasil");

export default {
    name: "ListDetal",
    //channel: `laravel_database_listarautomacao${this.$route.params.id}`,
    components: {
        endereco, detalhe, 'v-select': vSelect
    },
    data() {
        return {
            expedicao: {
                brinde: {
                    produto: {}
                },
                automacaos: [
                    {rastreio: null}
                ],
                contrato: {}
            },
            automacaosErros: [],
            city_id: '',
            dados: {
                pesquisa: '',
            },
            //Iframe de impressões
            modalIframe: false,
            urlIframe: '',

            //Editando endereco
            modalEndereco: false,
            modalGerarPlp: false,
            percent: 0,
            count: 0,
            step: 0,
            erroMensage: false,
            plpGerada: false,
            endereco: {
                telefone: ''
            },
            valido: true,
            antigoCep: '',

            // Data Sidebar
            addNewDataSidebar: false,
            sidebarData: {},

            //Modal Contratos
            modalContrato: false,
            contratos: [],
            selectedContrato: {},
        }
    },
    mounted() {
        this.$echo.channel(`listarautomacao${this.$route.params.id}`).listen('ListarAutomacao', (e) => {
            console.log('teste');
            console.log(e);
            if (this.step < 1) {
                if (e.automacao.status == 'fechado') {
                    this.count++
                    this.percent = (this.count / this.expedicao.automacaos.length) * 100;
                    console.log(this.count, this.percent);
                }
                if (e.automacao.status == 'error') {
                    this.count++
                    this.percent = (this.count / this.expedicao.automacaos.length) * 100;
                    console.log(this.count, this.percent);
                    this.automacaosErros.push(e.automacao);
                }
            }

            if (e.automacao.status == 'sucesso') {
                this.plpGerada = 10
            }

            if (e.automacao.status == 'ngerada') {
                if (e.automacao.erroMensage) {
                    this.erroMensage = e.automacao.erroMensage
                }
                this.plpGerada = 5
            }

            if (this.percent == 100) {
                this.step++;
                this.percent = 0;
                this.count = 0;
            }
        });
    },
    created() {
        if (!moduleExpedicoesBrindes.isRegistered) {
            this.$store.registerModule('expedicoes', moduleExpedicoesBrindes);
            moduleExpedicoesBrindes.isRegistered = true;
        }

        if (!moduleContrato.isRegistered) {
            this.$store.registerModule('contratos', moduleContrato);
            moduleContrato.isRegistered = true;
        }
        if (moduleExpedicoesBrindes.isRegistered)
            this.getItem(this.$route.params.id);
        this.getContratos();
        console.log('valido', this.valido)
    },
    methods: {
        getItem(id) {
            this.$vs.loading();
            this.$store.dispatch('expedicoes/getId', id).then(response => {
                console.log(response);
                this.expedicao = {...response};
                this.selectedContrato = {id: this.expedicao.contrato.id, label: this.expedicao.contrato.nome};
                this.$vs.loading.close();
            });
        },
        atualiza() {
            this.modalGerarPlp = false;
            this.getItem(this.expedicao.id);
            this.$vs.loading.close();
        },
        pesquisar(e) {
            e.preventDefault();
            this.$vs.loading();
            this.getItem(this.$route.params.id);
        },
        toggleDataSidebar(val = false) {
            this.addNewDataSidebar = val
        },
        toggleDataSidebarEnd(val = false) {
            this.modalEndereco = val
        },
        visualizar(obj) {
            this.sidebarData = obj
            this.toggleDataSidebar(true);
        },
        arquivar(obj) {
            this.$vs.dialog({
                color: 'primary',
                type: 'confirm',
                title: `Arquivar Automação`,
                text: 'Ao arquivar a automação ela sairá da expedição e irá para listagem de arquivas.',
                acceptText: 'Sim, arquivar!',
                cancelText: 'Cancelar',
                accept: () => {
                    this.$store.dispatch('expedicoes/arquivar', obj.id).then(() => {
                        this.atualiza();
                        this.$vs.notify({
                            color: 'success',
                            text: 'Arquivado realizado com sucesso'
                        });
                    }).catch(erro => {
                        console.log('erro', erro);
                        this.modalGerarPlp = false;
                        this.$vs.notify({
                            color: 'danger',
                            text: 'Algo deu errado ao arquivar a automação. Contate o suporte'
                        });
                    });
                }
            })
        },
        imprimir(id) {
            this.urlIframe = false;
            this.modalIframe = true;
            this.$vs.loading({
                container: '#pdf-with-loading'
            })
            axios.get("expedicaos/imprimiretiqueta", {params: {'expedicao_id': this.$route.params.id, 'tipo': 'single', 'automacao_id': id}, responseType: 'arraybuffer'})
                .then((response) => {
                    console.log(response);
                    var blob = new Blob([response.data], {
                        type: 'application/pdf'
                    });
                    var url = window.URL.createObjectURL(blob);
                    console.log(url);
                    this.urlIframe = url;
                    //window.open(url);
                    this.$vs.loading.close('#pdf-with-loading > .con-vs-loading')
                })
                .catch((error) => {
                    this.$vs.notify({
                        color: 'danger',
                        text: 'Algo deu errado. Contate o suporte'
                    });
                    this.$vs.loading.close('#pdf-with-loading > .con-vs-loading')

                });
        },
        imprimirEtiquetas(tipo) {
            this.urlIframe = false;
            this.modalIframe = true;
            this.$vs.loading({
                container: '#pdf-with-loading'
            })
            axios.get("expedicaos/imprimiretiqueta", {params: {'expedicao_id': this.expedicao.id, 'tipo': tipo}, responseType: 'arraybuffer'})
                .then((response) => {
                    console.log(response);
                    var blob = new Blob([response.data], {
                        type: 'application/pdf'
                    });
                    var url = window.URL.createObjectURL(blob);
                    console.log(url);
                    this.urlIframe = url;
                    //window.open(url);
                    this.$vs.loading.close('#pdf-with-loading > .con-vs-loading')
                })
                .catch((error) => {
                    this.$vs.notify({
                        color: 'danger',
                        text: 'Algo deu errado. Contate o suporte'
                    });
                    this.$vs.loading.close('#pdf-with-loading > .con-vs-loading')

                });
        },
        imprimirDeclaracao(automacao) {
            this.urlIframe = false;
            this.modalIframe = true;
            this.$vs.loading({
                container: '#pdf-with-loading'
            })
            let params = {
                'expedicao_id': this.expedicao.id,
                'automacao_id': automacao
            };
            axios.get("expedicaos/declaracaodeconteudo", {params: params, responseType: 'arraybuffer'})
                .then((response) => {
                    console.log(response);
                    var blob = new Blob([response.data], {
                        type: 'application/pdf'
                    });
                    var url = window.URL.createObjectURL(blob);
                    console.log(url);
                    this.urlIframe = url;
                    //window.open(url);
                    this.$vs.loading.close('#pdf-with-loading > .con-vs-loading')
                })
                .catch((error) => {
                    this.$vs.notify({
                        color: 'danger',
                        text: 'Algo deu errado. Contate o suporte'
                    });
                    this.$vs.loading.close('#pdf-with-loading > .con-vs-loading')

                });
        },
        enviarRastreio(id) {
            this.$vs.loading();
            this.$store.dispatch('expedicoes/enviarRastreio', {expedicao_id: this.expedicao.id, automacao_id: id}).then(() => {
                this.$vs.notify({
                    color: 'success',
                    text: 'Rastreio enviado com sucesso.'
                });
                this.getItem(this.expedicao.id);
            }).catch(erro => {
                console.log('erro', erro);
                this.$vs.notify({
                    color: 'danger',
                    text: 'Algo deu errado. Contate o suporte'
                });
                this.$vs.loading.close();
            });
        },
        gerarPlp() {
            // this.$vs.loading();
            this.$vs.dialog({
                color: 'primary',
                title: `Gerar PLP`,
                text: 'Ao gerar PLP, não será mais possível editar os objetos contidos nela.',
                acceptText: 'Sim, gerar!',
                accept: () => {
                    this.modalGerarPlp = true;
                    this.$store.dispatch('expedicoes/gerarPlp', this.expedicao.id).then(() => {
                    }).catch(erro => {
                        console.log('erro', erro);
                        this.modalGerarPlp = false;
                        this.$vs.notify({
                            color: 'danger',
                            text: 'Algo deu errado ao gerar a PLP. Contate o suporte'
                        });
                    });
                }
            })
        },
        imprimirPlp() {
            /*this.modalIframe = true;
            this.urlIframe = saveleadsConfig.url_api + '/expedicaos/imprimirplp?expedicao_id=' + this.$route.params.id;*/
            this.urlIframe = false;
            this.modalIframe = true;
            this.$vs.loading({
                container: '#pdf-with-loading'
            })
            axios.get("expedicaos/imprimirplp", {params: {'expedicao_id': this.expedicao.id}, responseType: 'arraybuffer'})
                .then((response) => {
                    console.log(response);
                    var blob = new Blob([response.data], {
                        type: 'application/pdf'
                    });
                    var url = window.URL.createObjectURL(blob);
                    console.log(url);
                    this.urlIframe = url;
                    //window.open(url);
                    this.$vs.loading.close('#pdf-with-loading > .con-vs-loading')
                })
                .catch((error) => {
                    this.$vs.notify({
                        color: 'danger',
                        text: 'Algo deu errado. Contate o suporte'
                    });
                    this.$vs.loading.close('#pdf-with-loading > .con-vs-loading')

                });
        },
        copyRastreio(val) {
            const thisIns = this;
            this.$copyText(val).then(function () {
                thisIns.$vs.notify({
                    title: 'Success',
                    text: 'Rastreio copiado para sua área de transferência',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check-circle'
                })
            }, function () {
                thisIns.$vs.notify({
                    title: 'Failed',
                    text: 'Erro ao copiar rastreio',
                    color: 'danger',
                    iconPack: 'feather',
                    position: 'top-center',
                    icon: 'icon-alert-circle'
                })
            })
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

        },

        //Trocando contrato
        getContratos() {
            this.$store.dispatch('contratos/get').then(response => {
                this.contratos = [...this.arraySelect(response)];
            })
        },
        update() {
            this.$vs.loading();
            this.expedicao.contrato_id = this.selectedContrato.id;
            this.$store.dispatch('expedicoes/store', this.expedicao).then(() => {
                this.val = {};
                this.$vs.notify({
                    color: 'success',
                    title: '',
                    text: 'Salvo com sucesso'
                });
                this.getItem(this.$route.params.id);
            }).catch(erro => {
                console.log(erro)
                this.$vs.notify({
                    color: 'danger',
                    title: 'Erro',
                    text: 'Algo deu errado ao finalizar. Reinicie a página.'
                })
            });
        }
    },
    computed: {
        invalidoEntrega() {
            return (!this.endereco.complemento || !this.endereco.numero || !this.endereco.ddd || !this.endereco.telefone || !this.endereco.nome || this.endereco.telefone.length <= 8)
        },
        list() {
            return this.expedicao.automacaos.filter(automacao => {
                console.log('auto', automacao);
                let email = automacao.email_destinatario ? automacao.email_destinatario.toLowerCase().includes(this.dados.pesquisa.toLowerCase()) : false;
                let rastreio = automacao.rastreio ? automacao.rastreio.toLowerCase().includes(this.dados.pesquisa.toLowerCase()) : false;
                let nome = automacao.nome_destinatario ? automacao.nome_destinatario.toLowerCase().includes(this.dados.pesquisa.toLowerCase()) : false;

                return email || rastreio || nome
            })
        }
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
