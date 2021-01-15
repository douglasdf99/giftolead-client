<template>
    <div>
        <detalhe v-if="addNewDataSidebar" :expedicao="expedicao" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar"
                 :data="sidebarData"/>
        <endereco v-if="modalEndereco" :expedicao="expedicao" :isSidebarActive="modalEndereco" @closeSidebar="toggleDataSidebarEnd"
                  :data="endereco"/>
        <div class="vx-row mb-5" v-if="melhorenvio">
            <div class="vx-col w-full">
                <vx-card class="shadow-none">
                    <div class="grid grid-cols-4 gap-4">
                        <!--                        <p class="flex items-center">-->
                        <!--                            {{ expedicao.fechado ? 'Fechada' : 'Pendente' }}-->
                        <!--                            <vs-icon icon-pack="material-icons" icon="fiber_manual_record"-->
                        <!--                                     class="ml-5 icon-grande" v-bind:style="{color: expedicao.fechado ? '#4DE98A' : '#E7BE00'}"></vs-icon>-->
                        <!--                        </p>-->
                        <p class="flex items-center">PLP: <b class="ml-2">{{ expedicao.plp || ' Sem PLP gerada' }}</b></p>
                        <p class="flex items-center">Contrato: <b class="ml-2">{{ expedicao.contrato_type == 'App\\Models\\Extensoes\\MelhorEnvio' ? 'Melhor Envio' : expedicao.contrato.nome }}</b>
                            <vx-tooltip position="top" text="Selecionar Contrato">
                                <vs-button color="primary" class="p-2 ml-3" @click="modalContrato = true" icon-pack="material-icons" icon="create"></vs-button>
                            </vx-tooltip>
                        </p>
                        <p>Saldo: <span class="font-bold text-xl mb-3 text-success">R$ {{ saldo.toFixed(2).replace('.', ',') }}</span></p>
                        <p>Pode gerar: <span class="font-bold text-xl mb-3 text-success">{{ limites.shipments_available }} envios</span></p>
                        <p>Limite total: <span class="font-bold text-xl mb-3 text-success">{{ limites.shipments }} envios</span></p>
                        <p>Custo: <span class="font-bold text-xl mb-3 text-primary">R$ {{ custo.toFixed(2).replace('.', ',') }} </span></p>
                        <vx-tooltip text="Atualizar Status" position="top" class="flex items-center justify-center">
                            <vs-button @click="refresh" color="primary" type="filled" class="relative botao-menu text-white" icon-pack="material-icons" icon="cached">Atualizar</vs-button>
                        </vx-tooltip>
                    </div>
                </vx-card>
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
        <div class="vx-row my-3" v-if="possuiErro">
            <div class="vx-col w-full">
                <div class="p-5 bg-danger rounded-lg">
                    <div class="vx-row">
                        <div class="vx-col w-1/12 text-center">
                            <i class="material-icons text-white text-4xl">report_problem</i>
                        </div>
                        <div class="vx-col w-11/12">
                            <p class="text-white text-lg mb-0">Esta expedição possui automações com erro. Favor verificar as possíveis soluções.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <vs-table multiple v-model="selecteds" @selected="handleSelected" :data="expedicao.automacaos" class="table-items vs-con-loading__container" id="table">
            <template slot="thead">
                <vs-th></vs-th>
                <vs-th>Destinatário</vs-th>
                <vs-th>E-mail</vs-th>
                <vs-th>Código do envio do ME</vs-th>
                <vs-th>CEP</vs-th>
                <vs-th>Status</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr" class="vs-con-loading__container" :id="'table-row-' + indextr">
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
                                <vs-dropdown-item v-if="expedicao.fechado" @click="enviarRastreio(tr.id)">
                                    <vs-icon icon-pack="material-icons" icon="email"></vs-icon>
                                    Enviar Rastreio
                                </vs-dropdown-item>
                                <vs-dropdown-item v-if="!tr.codigo_pagamento_melhor_envio" @click="removeCarrinho(tr, indextr)">
                                    <vs-icon icon-pack="material-icons" icon="delete"></vs-icon>
                                    Remover do Carrinho
                                </vs-dropdown-item>
                                {{tr.status}}
                                <vs-dropdown-item v-if="!tr.rastreio" @click="gerarEtiqueta(tr.codigo_carrinho_melhor_envio)">
                                    <vs-icon icon-pack="material-icons" icon="cached"></vs-icon>
                                    Gerar Etiqueta
                                </vs-dropdown-item>
                                <vs-dropdown-item v-else @click="gerarEtiqueta(tr.id)">
                                    <vs-icon icon-pack="material-icons" icon="print"></vs-icon>
                                    Imprimir Etiqueta
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                    <vs-td><span class="font-bold">{{ tr.nome_destinatario }}</span></vs-td>
                    <vs-td>{{ tr.email_destinatario }}</vs-td>
                    <vs-td class="flex mb-2">
                        <vx-tooltip position="top" text="Clique para copiar código de envio e ser redirecionada para a página de busca">
                            <span class="cursor-pointer font-bold text-primary"
                                  @click="copyRastreio(tr.codigo_pagamento_melhor_envio)"> {{ tr.codigo_pagamento_melhor_envio ? tr.codigo_pagamento_melhor_envio.substr(0, 10) : '' }}... </span>
                        </vx-tooltip>
                    </vs-td>
                    <vs-td v-if="tr.endereco">{{ tr.endereco.cep | VMask('##.###-###') }}</vs-td>
                    <vs-td v-if="tr.status" class="flex justify-center items-center">
                        <vx-tooltip :text="tr.status.text">
                            <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                     class="icon-grande" v-bind:class="`text-${tr.status.color}`"></vs-icon>
                        </vx-tooltip>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>

        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <vs-button color="primary" class="float-right text-white px-6 py-4 mx-3" @click="realizarPagamento" :disabled="!podePagar.success" v-if="!expedicao.plp && $acl.check('brinde_expedicao_gerarplp')">
                        <vx-tooltip :text="podePagar.message" position="top">
                            Realizar Pagamento
                        </vx-tooltip>
                    </vs-button>
                    <vs-button color="primary" class="float-right text-white px-6 py-4 mx-3" @click="imprimirPlp" v-else>Imprimir PLP</vs-button>
                    <vs-dropdown vs-trigger-click class="float-right">
                        <vs-button color="primary" class="float-right text-white px-6 py-4" v-if="expedicao.fechado">Imprimir Etiquetas</vs-button>
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
                    <vs-button color="primary" class="float-right text-white px-6 py-4 mx-3" @click="imprimirDeclaracao(null)">Imprimir Declaração de conteúdo</vs-button>
                    <vs-button color="primary" class="float-right text-white px-6 py-4 mx-3" @click="gerarEtiquetas()">Gerar Etiquetas</vs-button>
                    <vs-button class="float-left ml-3  px-6 py-4 mx-3" color="dark" type="border" icon-pack="feather" icon="x-circle"
                               @click="$router.push({path: '/brindes/expedicoes-melhor-envio'})">
                        Voltar
                    </vs-button>
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
        <vs-prompt
                @cancel="modalPagamento = false"
                @accept="comprar"
                acceptText="Comprar"
                cancelText="Cancelar"
                :title="'Trocar o contrato'"
                :max-width="'600px'"
                :active.sync="modalPagamento">
            <div class="con-exemple-prompt">
                <p class="text-lg text-center mb-5">Valor Total: <span class="text-primary text-2xl font-bold">${{pagamentoData.soma.toFixed(2).replace('.', ',')}}</span></p>
                <vs-divider class="w-full"></vs-divider>
                <span class="font-regular mb-2">Método de Pagamento</span>
                <v-select v-model="pagamentoData.tipo_pagamento" :class="'select-large-base'" :clearable="false"
                          style="background-color: white" :options="pagamentoData.tipos" v-validate="'required'" name="produtoUpsell"/>
            </div>
        </vs-prompt>
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
    import moduleExtensoes from "@/store/extensoes/moduleExtensoes";
    import moduleAutomacao from "@/store/automacao/moduleAutomacao";

    const {consultarCep} = require("correios-brasil");

    export default {
        name: "ListDetalMelhorEnvio",
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
                    contrato: {},
                },
                selecteds: [],
                melhorenvio: {},
                limites: {
                    shipments: 0,
                    shipments_available: 0
                },
                saldo: 0,
                custo: 0,
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

                //Modal Pagamento
                modalPagamento: false,
                pagamentoData: {
                    tipo_pagamento: {id: null, label: 'Escolha uma forma de pagamento'},
                    tipos: [{id: 'moip', label: 'Wirecard'}, {id: 'mercado-pago', label: 'Mercado pago'}, {id: '', label: 'Saldo'}],
                    ids: [],
                    soma: 0
                }
            }
        },
        mounted() {
            var subdomain = window.location.host.split('.')[1] ? window.location.host.split('.')[0] : 'app';

            this.$echo.channel(`${subdomain}_listarautomacao${this.$route.params.id}`).listen('ListarAutomacao', (e) => {
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

            this.getContratos();
            this.getExtensao();
        },
        created() {
            if (!moduleExpedicoesBrindes.isRegistered) {
                this.$store.registerModule('expedicaos', moduleExpedicoesBrindes);
                moduleExpedicoesBrindes.isRegistered = true;
            }
            if (!moduleContrato.isRegistered) {
                this.$store.registerModule('contratos', moduleContrato);
                moduleContrato.isRegistered = true;
            }
            if (!moduleExtensoes.isRegistered) {
                this.$store.registerModule('extensoes', moduleExtensoes)
                moduleExtensoes.isRegistered = true
            }
            if (!moduleAutomacao.isRegistered) {
                this.$store.registerModule('automacao', moduleAutomacao)
                moduleAutomacao.isRegistered = true
            }

            if (moduleExpedicoesBrindes.isRegistered)
                this.getItem(this.$route.params.id);
        },
        methods: {
            async tracking() {
                this.$vs.loading();
                await this.expedicao.automacaos.forEach(item => {
                    this.$store.dispatch('expedicaos/tracking', {
                        headers: {Authorization: `Bearer ${this.melhorenvio.token}`, 'accept': 'application/json'},
                        token: item.codigo_carrinho_melhor_envio
                    }).then(response => {
                        item.status = this.translateStatus(response.data[item.codigo_carrinho_melhor_envio].status);
                        this.expedicao.automacaos = {...this.expedicao.automacaos};
                    }).catch(erro => {
                        console.log("caiu no erro", erro)
                    });
                });
                await this.$vs.loading.close();
            },
            translateStatus(status) {
                console.log('status aí', status);
                let response = '';
                switch (status) {
                    case 'pending':
                        response = {text: 'Pendente de pagamento', color: 'warning'};
                        break;
                    case 'released':
                        response = {text: 'Liberada para impressão e postagem', color: 'primary'};
                        break;
                    case 'delivered':
                        response = {text: 'Envio entregue', color: 'success'};
                        break;
                    case 'canceled':
                        response = {text: 'Etiqueta cancelada', color: 'danger'};
                        break;
                    case 'undelivered':
                        response = {text: 'Envio não entregue', color: 'danger'};
                        break;
                    case 'empty':
                        response = {text: 'Não identificado no Melhor Envio', color: 'danger'};
                        break;
                    case 'paid':
                        response = {text: 'Pago', color: 'success'};
                        break;
                    default:
                        response = {text: 'Status desconhecido, color: ', color: 'black'};
                }

                return response;
            },
            async getItem(id) {
                this.$vs.loading();
                await this.$store.dispatch('expedicaos/getId', id).then(response => {
                    this.expedicao = {...response};
                    this.expedicao.automacaos.forEach(item => {
                        item.status = this.translateStatus(item.status_melhor_envio);
                    });
                    if (this.expedicao.contrato)
                        this.selectedContrato = {id: this.expedicao.contrato.id, label: this.expedicao.contrato_type == 'App\\Models\\Extensoes\\MelhorEnvio' ? 'Melhor Envio' : this.expedicao.contrato.nome};
                }).catch(() => {
                    this.$vs.notify({
                        color: 'danger',
                        text: 'Algo deu errado ao carregar a expedição'
                    });
                }).finally(() => {
                    this.$vs.loading.close();
                });
            },
            async getInfos() {
                await this.$store.dispatch('automacao/saldo', {headers: {Authorization: `Bearer ${this.melhorenvio.token}`}}).then(response => {
                    this.saldo = parseFloat(response.balance);
                    if (this.saldo == 0) this.pagamentoData.tipos[2].disabled = true;
                });
                await this.calcularFrete();
            },
            async getExtensao() {
                let subdomain = window.location.host.split('.')[1] ? window.location.host.split('.')[0] : 'app';
                await this.$store.dispatch('extensoes/get', subdomain).then(response => {
                    let arr = response.extensoes;
                    if (arr.length > 0) {
                        arr.forEach(item => {
                            if (item.extensao_type === "App\\Models\\Extensoes\\MelhorEnvio") {
                                this.melhorenvio = item.extensao;
                                this.getLimites();
                            }
                        });
                    }
                });
            },
            async getLimites() {
                await this.$store.dispatch('automacao/verificaLimite', {params: this.dados, config: {headers: {Authorization: `Bearer ${this.melhorenvio.token}`}}}).then(response => {
                    this.limites = response.data;
                    this.limites.error = false
                }).catch(() => {
                    this.limites.error = true;
                    this.limites.errorMessage = 'Não foi possível realizar conexão com a melhor envio';
                });
                this.getInfos();
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
                        this.$store.dispatch('expedicaos/arquivar', obj.id).then(() => {
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
                });
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
                this.$store.dispatch('expedicaos/enviarRastreio', {expedicao_id: this.expedicao.id, automacao_id: id}).then(() => {
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
                        this.$store.dispatch('expedicaos/gerarPlp', this.expedicao.id).then(() => {
                        }).catch(erro => {
                            console.log('erro', erro);
                            this.modalGerarPlp = false;
                            // this.$vs.notify({
                            //   color: 'danger',
                            //   text: 'Algo deu errado ao gerar a PLP. Contate o suporte'
                            // });
                            this.$vs.dialog({
                                color: 'danger',
                                title: `Algo deu errado ao gerar a PLP`,
                                text: erro.response.data.message + '. Contate o suporte'
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
                        title: 'Copiado!',
                        text: 'Código copiado para sua área de transferência',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check-circle',
                        time: 15000
                    });
                    window.open('https://melhorenvio.com.br/painel/meus-envios', '_blank');
                }, function () {
                    thisIns.$vs.notify({
                        title: 'Failed',
                        text: 'Erro ao copiar código',
                        color: 'danger',
                        iconPack: 'feather',
                        position: 'top-center',
                        icon: 'icon-alert-circle'
                    })
                })
            },
            removeCarrinho(item, index) {
                console.log('item, index', item, index)
                this.$vs.loading({
                    container: "#table-row-" + index,
                    scale: 0.45
                });
                this.$store.dispatch('automacao/removerCarrinho', {id: item.id}).then(response => {
                    this.custo -= parseFloat(item.custo);
                    this.expedicao.automacaos.splice(index, 1);
                    this.$vs.loading.close("#table-row-" + index + " > .con-vs-loading");
                });
            },
            refresh() {
                this.$vs.loading({
                    container: "#table",
                    scale: 0.45
                });
                this.$store.dispatch('expedicaos/refreshStatus', this.expedicao.id).then(response => {
                    this.expedicao.automacaos = [...response.data];
                    this.expedicao.automacaos.forEach(item => {
                        item.status = this.translateStatus(item.status_melhor_envio);
                    });
                    console.log('automacoes', this.expedicao.automacaos);
                    this.$vs.loading.close("#table > .con-vs-loading");
                });
            },
            gerarEtiqueta(id){
                this.$vs.loading();
                // let ids = this.selecteds.map(item => item.codigo_carrinho_melhor_envio);
                // this.$store.dispatch('automacao/geraEtiqueta', ids).then(response => {
                //     console.log('Voltou pro front', response)
                // });
            },
            gerarEtiquetas(){
                this.$vs.loading();
                let ids = this.selecteds.map(item => item.codigo_carrinho_melhor_envio);
                let headers = {Authorization: `Bearer ${this.melhorenvio.token}`};
                this.$store.dispatch('automacao/geraEtiquetas', {ids, headers}).then(response => {
                    console.log('Voltou pro front', response)
                });
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
            //Trocando contrato
            getContratos() {
                this.$store.dispatch('contratos/get').then(response => {
                    this.contratos = [...this.arraySelect(response)];
                })
            },
            update() {
                this.$vs.loading();
                this.expedicao.contrato_id = this.selectedContrato.id;
                this.$store.dispatch('expedicaos/store', this.expedicao).then(() => {
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
            },
            realizarPagamento() {
                this.modalPagamento = true;
                this.pagamentoData.soma = 0;
                this.selecteds.forEach(item => this.pagamentoData.soma += parseFloat(item.custo));
                this.pagamentoData.ids = this.selecteds.map(item => item.id);
            },
            comprar() {
                this.$vs.loading();
                this.$store.dispatch('automacao/comprar', {ids: this.pagamentoData.ids, tipo_pagamento: this.pagamentoData.tipo_pagamento.id}).then(response => {
                    this.$vs.notify({
                        text: 'Forma de pagamento escolhida com sucesso.',
                        color: 'success'
                    });
                    if (response.data.link)
                        window.open(response.data.link, '_blank');

                    this.expedicao.automacaos.forEach(auto => {
                        response.data.data.forEach(retorno => {
                            if (auto.id == retorno.id)
                                auto = retorno
                        });
                    });
                }).catch(error => {
                    this.$vs.notify({
                        text: error.response.data.message,
                        color: 'danger'
                    });
                }).finally(() => this.$vs.loading.close());
            },
            handleSelected(tr) {
            },
            //Calculando o frete e o custo
            async calcularFrete() {
                let obj = {payload: {}};
                for (const [idx, item] of this.expedicao.automacaos.entries()) {
                    obj = await this.buildObjPayloadCalculaFrete(item); //Monta o payload a ser enviado à api

                    await this.$store.dispatch('automacao/calcular', obj).then((response) => {
                        if (response.data.error) item.error = response.data.error;
                        else {
                            item.error = null;
                            item.custo = parseFloat(response.data.price);
                        }
                        item.servicoSelected = response.data.id;
                        this.custo += item.custo;
                    });
                    //await this.tracking();
                }
            },
            async buildObjPayloadCalculaFrete(item, recalculando = false) {
                let service = '';
                if (this.melhorenvio.configs.length > 0) {
                    let mudou = false;
                    await this.melhorenvio.configs.forEach(conf => {
                        if (!mudou) {
                            if (conf.variavel == item.endereco.estado) { //verificação tipo estado
                                service = this.getService(conf.servico);
                                mudou = true;
                            } else if (conf.variavel == item.brinde_id) { //verificação tipo brinde
                                service = this.getService(conf.servico);
                                mudou = true;
                            } else { //retorna valor da configuração padrão
                                service = this.getService(this.melhorenvio.config_padrao.servico);
                            }
                        }
                    });
                }
                item.payload = {
                    "from": {
                        "postal_code": this.melhorenvio.postal_code,
                        "address": this.melhorenvio.address,
                        "number": this.melhorenvio.number
                    },
                    "to": {
                        "postal_code": item.endereco.cep,
                        "address": item.endereco.endereco,
                        "number": item.endereco.numero
                    },
                    "package": {
                        "weight": item.brinde.peso,
                        "width": item.brinde.largura,
                        "height": item.brinde.altura,
                        "length": item.brinde.comprimento
                    },
                    "services": recalculando ? item.servicoSelected : service
                };
                item.headers = {Authorization: `Bearer ${this.melhorenvio.token}`};
                return item
            },
            getService(val) {
                const result = this.melhorenvio.servicos.filter(serv => serv.id == val);
                return result[0].uuid.toString();
            },
        },
        computed: {
            invalidoEntrega() {
                return (!this.endereco.complemento || !this.endereco.numero || !this.endereco.ddd || !this.endereco.telefone || !this.endereco.nome || this.endereco.telefone.length <= 8)
            },
            list() {
                if (this.expedicao.automacaos.length > 0) {
                    return this.expedicao.automacaos.filter(automacao => {
                        let email = automacao.email_destinatario ? automacao.email_destinatario.toLowerCase().includes(this.dados.pesquisa.toLowerCase()) : false;
                        let rastreio = automacao.rastreio ? automacao.rastreio.toLowerCase().includes(this.dados.pesquisa.toLowerCase()) : false;
                        let nome = automacao.nome_destinatario ? automacao.nome_destinatario.toLowerCase().includes(this.dados.pesquisa.toLowerCase()) : false;

                        return email || rastreio || nome
                    })
                }

                return []
            },
            podePagar() {
                let v1 = this.selecteds.some(element => {
                    if (element.status_melhor_envio == 'empty' || element.status_melhor_envio === '' || element.status_melhor_envio === null) {
                        return true;
                    }
                    // if (element.codigo_pagamento_melhor_envio !== '' || element.codigo_pagamento_melhor_envio == null) {
                    //     return true;
                    // }
                });

                if (v1) return {success: false, message: 'Verifique o status dos itens selecionados.'};
                else return {success: true, message: 'Realizar pagamento dos itens selecionados.'};
                // if (this.selecteds.length == 0) return {success: false, message: 'Nenhuma automação selecionada.'};
                // this.selecteds.forEach(item => {
                //     console.log('status foreach', item.status);
                //     if (item.status.color == 'danger')
                //         return {success: false, message: 'Pelo menos um dos itens selecionados possui erro.'};
                // });
                //
                // return {success: true, message: 'Realizar pagamento dos itens selecionados.'};
            },
            possuiErro() {
                let v1 = this.expedicao.automacaos.some(element => {
                    if (element.codigo_pagamento_melhor_envio !== '' || element.codigo_pagamento_melhor_envio == null) {
                        return true;
                    }
                });
                return v1
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
