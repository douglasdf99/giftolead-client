<template>
    <div>
        <detalhe-melhor-envio v-if="addNewDataSidebar" :expedicao="expedicao" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar"
                              :data="sidebarData"/>
        <endereco v-if="modalEndereco" :expedicao="expedicao" :isSidebarActive="modalEndereco" @closeSidebar="toggleDataSidebarEnd"
                  :data="endereco"/>
        <div class="vx-row mb-5" v-if="melhorenvio">
            <div class="vx-col w-full flex items-center justify-end mb-4">
                <p class="font-bold flex items-center justify-center ">Atualizar informações
                    <vs-button @click="refresh" color="primary" type="filled" class="ml-4 relative botao-menu text-white" icon-pack="material-icons" icon="cached"></vs-button>
                </p>
            </div>
            <div class="vx-col w-full">
                <vx-card class="shadow-none">
                    <div class="grid grid-cols-5 gap-4 text-center">
                        <p>Contrato: <span class="mb-3 text-lg font-bold">{{ expedicao.contrato_type == 'App\\Models\\Extensoes\\MelhorEnvio' ? 'Melhor Envio' : expedicao.contrato.nome }}</span></p>
                        <p>Saldo: <span class="font-bold text-lg mb-3 text-success">R$ {{ saldo.toFixed(2).replace('.', ',') }}</span></p>
                        <p>Pode gerar: <span class="font-bold text-lg mb-3 text-success">{{ limites.shipments_available }} envios</span></p>
                        <p>Limite total: <span class="font-bold text-lg mb-3 text-success">{{ limites.shipments }} envios</span></p>
                        <p id="custo" class="vs-con-loading__container">Custo: <span class="font-bold text-lg mb-3 text-primary"> {{ custo != null ? 'R$ ' + custo.toFixed(2).replace('.', ',') : '?' }} </span>
                        </p>
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
                        </form>
                    </div>
                </div>
                <!-- SEARCH INPUT -->
            </div>
        </div>
        <div class="vx-row my-3" v-if="possuiErro">
            <div class="vx-col w-full">
                <div class="py-1 px-2 bg-danger rounded-lg" style="filter: opacity(0.9);">
                    <div class="vx-row">
                        <div class="vx-col w-1/12 text-center">
                            <i class="material-icons text-white text-4xl">report_problem</i>
                        </div>
                        <div class="vx-col w-11/12 flex col items-center">
                            <p class="text-white text-lg mb-0">Esta expedição possui automações com erro. Favor verificar as possíveis soluções.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="vx-row my-3" v-if="!melhorenvio.config_padrao">
            <div class="vx-col w-full">
                <div class="py-1 px-2 bg-danger rounded-lg" style="filter: opacity(0.9);">
                    <div class="vx-row">
                        <div class="vx-col w-1/12 text-center">
                            <i class="material-icons text-white text-4xl">report_problem</i>
                        </div>
                        <div class="vx-col w-11/12 flex col items-center">
                            <p class="text-white text-lg mb-0">A extensão Melhor Envio está sem configuração padrão.
                                <span class="text-warning hover:text-primary font-bold cursor-pointer" @click="$router.push({name: 'extensoes-melhor-envio-config'})">Clique aqui </span>para configurar</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <vs-table multiple v-model="selecteds" :data="list" class="table-items vs-con-loading__container" id="table">
            <template slot="thead">
                <vs-th></vs-th>
                <vs-th>Destinatário</vs-th>
                <vs-th>E-mail</vs-th>
                <vs-th>Rastreio ME</vs-th>
                <vs-th>CEP</vs-th>
                <vs-th>Status</vs-th>
                <vs-th>Custo</vs-th>
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
                                <vs-dropdown-item @click="editarEndereco(tr)" v-if="(tr.status_melhor_envio == 'pending' || tr.status_melhor_envio == 'canceled' || tr.status_melhor_envio == 'undelivered')">
                                    <vs-icon icon-pack="material-icons" icon="home"></vs-icon>
                                    Editar Endereço
                                </vs-dropdown-item>
                                <!--                                <vs-dropdown-item v-if="expedicao.fechado" @click="enviarRastreio(tr.id)">-->
                                <!--                                    <vs-icon icon-pack="material-icons" icon="email"></vs-icon>-->
                                <!--                                    Enviar Rastreio-->
                                <!--                                </vs-dropdown-item>-->
                                <vs-dropdown-item @click="addCarrinho(tr.id, indextr)" v-if="tr.status_melhor_envio === 'canceled'">
                                    <vs-icon icon-pack="material-icons" icon="add_shopping_cart"></vs-icon>
                                    Adicionar ao Carrinho novamente
                                </vs-dropdown-item>
                                <vs-dropdown-item  @click="removeCarrinho(tr, indextr)">
                                    <vs-icon icon-pack="material-icons" icon="remove_shopping_cart"></vs-icon>
                                    Remover do Carrinho
                                </vs-dropdown-item>
                                <vs-dropdown-item v-if="!tr.rastreio_melhor_envio && tr.status_melhor_envio == 'released'" @click="gerarEtiqueta(tr.codigo_carrinho_melhor_envio, indextr)">
                                    <vs-icon icon-pack="material-icons" icon="cached"></vs-icon>
                                    Gerar Etiqueta
                                </vs-dropdown-item>
                                <vs-dropdown-item @click="imprimir(tr.codigo_carrinho_melhor_envio, indextr)"
                                                  v-if="tr.status_melhor_envio === 'posted' || tr.status_melhor_envio == 'released' && tr.rastreio_melhor_envio">
                                    <vs-icon icon-pack="material-icons" icon="print"></vs-icon>
                                    Imprimir Etiqueta
                                </vs-dropdown-item>
                                <vs-dropdown-item @click="arquivar(tr)" v-if="$acl.check('brinde_automacao_arquivar') && tr.status_melhor_envio === 'canceled' || tr.status_melhor_envio == 'pending'">
                                    <vs-icon icon-pack="material-icons" icon="work"></vs-icon>
                                    Arquivar
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                    <vs-td><span class="font-bold">{{ tr.nome_destinatario }}</span></vs-td>
                    <vs-td>{{ tr.email_destinatario }}</vs-td>
                    <vs-td class="flex mb-2">
                        <vx-tooltip position="top" text="Clique para copiar código de envio e ser redirecionada para a página de busca" v-if="tr.rastreio_melhor_envio">
                            <span class="cursor-pointer font-bold text-primary" @click="abrirRastreio(tr.rastreio_melhor_envio)">
                                {{ tr.rastreio_melhor_envio }}
                            </span>
                        </vx-tooltip>
                        <vx-tooltip position="top" text="Clique para gerar a etiqueta desta automação. O rastreio pode levar 1 hora até ser exibido." v-else>
                            <span class="cursor-pointer font-bold text-primary" @click="gerarEtiqueta(tr.codigo_carrinho_melhor_envio, indextr)">
                                Gerar etiqueta
                            </span>
                        </vx-tooltip>
                    </vs-td>
                    <vs-td v-if="tr.endereco">{{ tr.endereco.cep | VMask('##.###-###') }}</vs-td>
                    <vs-td v-if="tr.status" class="flex justify-center items-center">
                        <vx-tooltip :text="tr.status.text">
                            <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                     class="icon-grande" v-bind:class="`text-${tr.status.color}`"></vs-icon>
                        </vx-tooltip>
                    </vs-td>
                    <vs-td :id="'custo-row-' + tr.id" class="vs-con-loading__container">{{ showAutoCusto(tr) }}</vs-td>
                </vs-tr>
            </template>
        </vs-table>

        <transition name="fade" v-if="selecteds.length > 0">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <vs-button color="primary" class="float-right text-white px-6 py-4 mx-3" @click="realizarPagamento" :disabled="!podePagar.success">
                        <vx-tooltip :text="podePagar.message" position="top">
                            Realizar Pagamento
                        </vx-tooltip>
                    </vs-button>
                    <vs-button color="primary" class="float-right text-white px-6 py-4 mx-3" @click="checkCancellable" :disabled="!podeCancelar.success">
                        <vx-tooltip :text="podeCancelar.message" position="top">
                            Cancelar Compra
                        </vx-tooltip>
                    </vs-button>
                    <vs-button color="primary" class="float-right text-white px-6 py-4 mx-3" :disabled="!podeGerar.success" @click="gerarEtiquetas()">Gerar Etiquetas</vs-button>
                    <vs-button class="float-left ml-3  px-6 py-4 mx-3" color="dark" type="border" icon-pack="feather" icon="x-circle"
                               @click="$router.push({name: 'brindes-expedicoes-melhor-envio'})">
                        Voltar
                    </vs-button>
                </div>
            </footer-doug>
        </transition>
        <custom-popup id="pdf-with-loading" class="popup-iframe vs-con-loading__container" style="overflow: hidden" title="Imprimindo etiquetas" :active.sync="modalIframe">
            <iframe v-if="urlIframe" :src="urlIframe" width="100%" height="100%" title="Imprimindo Etiqueta"></iframe>
        </custom-popup>
        <vs-prompt
            @cancel="modalPagamento = false"
            @accept="comprar"
            acceptText="Comprar"
            cancelText="Cancelar"
            :title="'Realizar pagamento'"
            :max-width="'600px'"
            :active.sync="modalPagamento">
            <div class="con-exemple-prompt">
                <p class="font-regular">Método de Pagamento: <span class="text-success">Saldo</span></p>
                <p class="font-regular">Saldo disponível: <span class="font-bold text-primary">R${{ saldo.toFixed(2).replace('.', ',') }}</span></p>
                <p class="font-regular">Saldo após o pagamento: <span class="font-bold text-primary">R${{ (saldo - pagamentoData.soma).toFixed(2).replace('.', ',') }}</span></p>
                <vs-divider class="w-full"></vs-divider>
                <p class="text-lg text-center mb-5">Valor Total: <span class="text-primary text-2xl font-bold">${{ pagamentoData.soma.toFixed(2).replace('.', ',') }}</span></p>
            </div>
        </vs-prompt>
        <vs-prompt
            @cancel="modalCancelamento = false"
            @accept="cancelarCompra"
            acceptText="Solicitar cancelamento"
            cancelText="Fechar"
            :title="'Cancelar pagamento'"
            :max-width="'600px'"
            :active.sync="modalCancelamento">
            <div class="con-exemple-prompt">
                <p class="text-center mb-5">Valor TotalAutamoções a serem canceladas: <span class="text-primary font-bold">tabla de automações</span></p>
                <vs-divider class="w-full"></vs-divider>
                <label class="font-regular mt-2">Motivo do cancelamento</label>
                <v-select v-model="cancelamentoData.reason" :class="'select-large-base mb-2'" :clearable="false"
                          style="background-color: white" :options="cancelamentoData.tipos" v-validate="'required'" name="produtoUpsell"/>
                <label class="font-regular mt-2">Descrição</label>
                <vs-textarea counter="20" label="Tamanho: 20" v-validate="'max:30'" name="descricao"
                             :counter-danger.sync="counterDanger" v-model="cancelamentoData.description"/>
            </div>
        </vs-prompt>
    </div>
</template>

<script>
import moduleExpedicoesBrindes from "../../store/expedicoes/moduleExpedicoesBrindes";
import endereco from './Endereco';
import saveleadsConfig from "../../../saveleadsConfig";
import vSelect from 'vue-select';
import moduleContrato from "../../store/contratos/moduleContrato";
import moduleExtensoes from "@/store/extensoes/moduleExtensoes";
import moduleAutomacao from "@/store/automacao/moduleAutomacao";
import DetalheMelhorEnvio from "./DetalheMelhorEnvio";

//const {consultarCep} = require("correios-brasil");

export default {
    name: "ListDetalMelhorEnvio",
    //channel: `laravel_database_listarautomacao${this.$route.params.id}`,
    components: {
        DetalheMelhorEnvio, endereco, 'v-select': vSelect
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
            custo: null,
            automacaosErros: [],
            city_id: '',
            counterDanger: false,
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
            url_melhorenvio: saveleadsConfig.url_melhorenvio,

            // Data Sidebar
            addNewDataSidebar: false,
            sidebarData: {},

            //Modal Pagamento
            modalPagamento: false,

            pagamentoData: {
                tipo_pagamento: '',
                //tipos: [{id: 'moip', label: 'Wirecard'}, {id: 'mercado-pago', label: 'Mercado pago'}, {id: '', label: 'Saldo'}],
                ids: [],
                soma: 0
            },
            modalCancelamento: false,
            cancelamentoData: {
                ids: [],
                reason: {id: null, label: 'Escolha uma forma de pagamento'},
                tipos: [{id: 2, label: 'Desistência'}, {id: 4, label: 'Informações incorretas'}, {id: 5, label: 'Rejeição da transportadora'}],
                description: ""
            },
        };
    },
    mounted() {
        var subdomain = window.location.pathname.split('/')[1] ? window.location.host.split('.')[0] : 'app';

        this.$echo.channel(`${subdomain}_listarautomacao${this.$route.params.id}`).listen('ListarAutomacao', (e) => {
            if (this.step < 1) {
                if (e.automacao.status == 'fechado') {
                    this.count++;
                    this.percent = (this.count / this.expedicao.automacaos.length) * 100;
                }
                if (e.automacao.status == 'error') {
                    this.count++;
                    this.percent = (this.count / this.expedicao.automacaos.length) * 100;
                    this.automacaosErros.push(e.automacao);
                }
            }
            if (e.automacao.status == 'sucesso') {
                this.plpGerada = 10;
            }

            if (e.automacao.status == 'ngerada') {
                if (e.automacao.erroMensage) {
                    this.erroMensage = e.automacao.erroMensage;
                }
                this.plpGerada = 5;
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
            this.$store.registerModule('extensoes', moduleExtensoes);
            moduleExtensoes.isRegistered = true;
        }
        if (!moduleAutomacao.isRegistered) {
            this.$store.registerModule('automacao', moduleAutomacao);
            moduleAutomacao.isRegistered = true;
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
                });
            });
            await this.$vs.loading.close();
        },
        translateStatus(status) {
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
                case 'posted':
                    response = {text: 'Postado', color: 'success'};
                    break;
                default:
                    response = {text: 'Status desconhecido, color: ', color: 'black'};
            }

            return response;
        },
        renderIncancellables(arr) {
            let lis = '';
            arr.forEach((item, index) => {
                lis += item[0] + (index > 0 ? ', ' : '');
            });

            let html = "As automações abaixo não estão aptas a serem canceladas: " + lis + '.';

            return html;
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
        async getExtensao() {
            let subdomain = window.location.pathname.split('/')[1] ? window.location.host.split('.')[0] : 'app';
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
                this.limites.error = false;
            }).catch(() => {
                this.limites.error = true;
                this.limites.errorMessage = 'Não foi possível realizar conexão com a melhor envio';
            });
            this.getInfos();
        },
        async getInfos() {
            await this.$store.dispatch('automacao/saldo', {headers: {Authorization: `Bearer ${this.melhorenvio.token}`}}).then(response => {
                this.saldo = parseFloat(response.balance);
                if (this.saldo == 0) this.pagamentoData.tipos[2].disabled = true;
            });
            await this.calcularCusto();
        },
        async calcularCusto() {
            this.$vs.loading({
                container: "#custo",
                scale: 0.45
            });
            this.$store.dispatch('expedicaos/itensCarrinho', {headers: {Authorization: `Bearer ${this.melhorenvio.token}`}}).then(response => {
                this.custo = 0.0;
                this.expedicao.automacaos.forEach(auto => {
                    //this.$vs.loading({container: "#custo-row-" + auto.id, scale: 0.45});
                    response.forEach(item => {
                        if (auto.codigo_carrinho_melhor_envio === item.id) {
                            if(auto.codigo_pagamento_melhor_envio) {
                                auto.custo = 'Já comprou';
                            } else {
                                auto.custo = item.price; // Atribuindo o custo de cada envio
                                this.custo += parseFloat(item.price); //Somando o custo total que é exibido acima da tabela
                            }
                            //this.$vs.loading.close("#custo-row-" + auto.id + " > .con-vs-loading");
                        }
                    });
                });
            }).finally(() => this.$vs.loading.close("#custo > .con-vs-loading"));
        },
        showAutoCusto(tr) {
            if(tr.custo != null) {
                if(tr.custo === 'Já comprou')
                    return tr.custo;

              return 'R$ ' + tr.custo.toFixed(2).replace('.', ',');
            }
            return '?';
        },
        atualiza() {
            this.modalGerarPlp = false;
            this.getItem(this.expedicao.id);
        },
        pesquisar(e) {
            e.preventDefault();
            this.$vs.loading();
            this.getItem(this.$route.params.id);
        },
        toggleDataSidebar(val = false) {
            this.addNewDataSidebar = val;
        },
        toggleDataSidebarEnd(val = false) {
            this.modalEndereco = val;
        },
        visualizar(obj) {
            this.sidebarData = obj;
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
                    }).catch(() => {
                        this.modalGerarPlp = false;
                        this.$vs.notify({
                            color: 'danger',
                            text: 'Algo deu errado ao arquivar a automação. Contate o suporte'
                        });
                    });
                }
            });
        },
        async imprimir(id, index) {
            let gerada = await this.gerarEtiqueta(id, index);
            if (gerada.status) {
                this.$vs.loading.close("#table-row-" + index + " > .con-vs-loading");
                this.urlIframe = false;
                this.modalIframe = true;
                this.$vs.loading({
                    container: '#pdf-with-loading'
                });
                this.$vs.loading();
                let ids = [id];
                let headers = {Authorization: `Bearer ${this.melhorenvio.token}`};
                this.$store.dispatch('automacao/imprmirMelhorEnvio', {ids, headers}).then(response => {
                    this.urlIframe = response.url;
                }).catch((error) => {
                    this.$vs.notify({
                        color: 'danger',
                        text: error.response.data.message
                    });
                }).finally(() => {
                    this.$vs.loading.close('#pdf-with-loading > .con-vs-loading');
                });
            } else {
                this.$vs.notify({color: 'warning', text: 'Aguarde a etiqueta ser gerada para que você possa imprimir', title: 'Aguarde', time: 10000});
                this.$vs.loading.close("#table-row-" + index + " > .con-vs-loading");
            }
        },
        imprimirEtiquetas() {
            this.urlIframe = false;
            this.modalIframe = true;
            this.$vs.loading({
                container: '#pdf-with-loading'
            });
            let ids = this.selecteds.map(item => item.codigo_carrinho_melhor_envio);
            let headers = {Authorization: `Bearer ${this.melhorenvio.token}`};
            this.$store.dispatch('automacao/imprmirMelhorEnvio', {ids, headers}).then(response => {
                this.urlIframe = response.url;
            }).catch((error) => {
                this.$vs.notify({
                    color: 'danger',
                    text: error.response.data.message
                });
            }).finally(() => {
                this.$vs.loading.close('#pdf-with-loading > .con-vs-loading');
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
            }).catch(() => {
                this.$vs.notify({
                    color: 'danger',
                    text: 'Algo deu errado. Contate o suporte'
                });
                this.$vs.loading.close();
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
            }, function () {
                thisIns.$vs.notify({
                    title: 'Failed',
                    text: 'Erro ao copiar código',
                    color: 'danger',
                    iconPack: 'feather',
                    position: 'top-center',
                    icon: 'icon-alert-circle'
                });
            });
        },
        addCarrinho(id, index) {
            this.$vs.loading({
                container: "#table-row-" + index,
                scale: 0.45
            });
            this.$store.dispatch('automacao/adicionarCarrinho', id).then(() => {
                this.$vs.notify({
                    text: 'Código do carrinho gerado com sucesso.',
                    color: 'success'
                });
            }).finally(() => this.$vs.loading.close("#table-row-" + index + " > .con-vs-loading"));
        },
        removeCarrinho(item, index) {
            this.$vs.loading({
                container: "#table-row-" + index,
                scale: 0.45
            });
            this.$store.dispatch('automacao/removerCarrinho', {id: item.id}).then(() => {
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
                this.$vs.loading.close("#table > .con-vs-loading");
                this.$vs.loading.close();
            });
        },
        async gerarEtiqueta(id, index) {
            this.$vs.loading({
                container: "#table-row-" + index,
                scale: 0.45
            });
            let ids = [id];
            let headers = {Authorization: `Bearer ${this.melhorenvio.token}`};
            let retorno = null;
            await this.$store.dispatch('automacao/geraEtiquetas', {ids, headers}).then(response => {
                retorno = response;
                let color = '';
                if (response[id]) {
                    color = response[id].status ? 'success' : 'danger';
                    this.$vs.notify({text: response[id].message, color});
                } else this.$vs.notify({text: "Atualize a página.", color: 'danger'});

                this.refresh();
            }).finally(() => this.$vs.loading.close("#table-row-" + index + " > .con-vs-loading"));

            return retorno[id];
        },
        gerarEtiquetas() {
            this.$vs.loading({
                container: "#table",
                scale: 0.45
            });
            let ids = this.selecteds.map(item => item.codigo_carrinho_melhor_envio);
            let headers = {Authorization: `Bearer ${this.melhorenvio.token}`};
            this.$store.dispatch('automacao/geraEtiquetas', {ids, headers}).then(() => {
                this.refresh();
            }).finally(() => this.$vs.loading.close("#table > .con-vs-loading"));
        },
        abrirRastreio(hash) {
            let {url_melhorenvio} = saveleadsConfig;
            window.open(url_melhorenvio + '/rastreio/' + hash, '_blank');
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
            if (!this.valido) {
                this.endereco.complemento = '';
                this.endereco.numero = '';
                this.$store.dispatch('consultCep', this.endereco.cep).then(response => {
                    this.valido = true;
                    this.antigoCep = this.endereco.cep;
                    this.endereco.cidade = this.removeAccents(response.city);
                    this.endereco.bairro = this.removeAccents(response.neighborhood);
                    this.endereco.endereco = this.removeAccents(response.street);
                    this.endereco.estado = this.removeAccents(response.state);
                }).catch(erro => {
                    this.$vs.notify({
                        title: '',
                        color: 'danger',
                        text: erro.response.data.message
                    });
                });
            }
        },
        //Trocando contrato
        getContratos() {
            this.$store.dispatch('contratos/get').then(response => {
                this.contratos = [...this.arraySelect(response)];
            });
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
            }).catch(() => {
                this.$vs.notify({
                    color: 'danger',
                    title: 'Erro',
                    text: 'Algo deu errado ao finalizar. Reinicie a página.'
                });
            });
        },
        realizarPagamento() {
            this.modalPagamento = true;
            this.pagamentoData.soma = 0;
            this.selecteds.forEach(item => {
                this.pagamentoData.soma += parseFloat(item.custo);
            });
            this.pagamentoData.ids = this.selecteds.map(item => item.id);
        },
        realizarCancelamento() {
            this.modalCancelamento = true;
            this.cancelamentoData.ids = this.selecteds.map(item => item.id);
        },
        checkCancellable() {
            this.$vs.loading({
                container: "#table",
                scale: 0.45
            });
            let ids = this.selecteds.map(item => item.codigo_carrinho_melhor_envio);
            let headers = {Authorization: `Bearer ${this.melhorenvio.token}`};
            this.$store.dispatch('automacao/checkCancel', {ids, headers}).then(response => {
                let arr = Object.entries(response);
                let incancellable = arr.filter(item => {
                    if (!item[1].cancellable) return item[0];
                });
                if (incancellable.length == 0) this.realizarCancelamento();
                else {
                    this.$vs.dialog({
                        color: 'warning',
                        type: 'alert',
                        title: `Itens incanceláveis`,
                        text: `${this.renderIncancellables(incancellable)}`,
                        acceptText: 'Ok, vou verificar!',
                        accept: () => {
                            this.$store.dispatch('expedicaos/arquivar').then(() => {
                                this.atualiza();
                                this.$vs.notify({
                                    color: 'success',
                                    text: 'Arquivado realizado com sucesso'
                                });
                            }).catch(() => {
                                this.modalGerarPlp = false;
                                this.$vs.notify({
                                    color: 'danger',
                                    text: 'Algo deu errado ao arquivar a automação. Contate o suporte'
                                });
                            });
                        }
                    });
                }
            }).finally(() => this.$vs.loading.close("#table > .con-vs-loading"));
        },
        comprar() {
            this.$vs.loading();
            this.$store.dispatch('automacao/comprar', {ids: this.pagamentoData.ids, tipo_pagamento: this.pagamentoData.tipo_pagamento.id}).then(response => {
                this.$vs.notify({text: 'Forma de pagamento escolhida com sucesso.', color: 'success'});

                this.expedicao.automacaos.forEach(auto => {
                    response.data.forEach(retorno => {
                        if (auto.id == retorno.id)
                            auto = {...auto, retorno};
                    });
                });
            }).catch(error => {
                this.$vs.notify({
                    text: error.response.data.message,
                    color: 'danger'
                });
            }).finally(() => this.refresh());
        },
        cancelarCompra() {
            this.$vs.loading();
            this.$store.dispatch('automacao/cancelar', {ids: this.cancelamentoData.ids, reason: this.cancelamentoData.reason.id, description: this.cancelamentoData.description}).then(() => {
                this.$vs.notify({
                    text: 'Solicitação de cancelamento enviada com sucesso.',
                    color: 'success'
                });
                this.refresh();
            }).catch(error => {
                this.$vs.notify({
                    text: error.response.data.message,
                    color: 'danger'
                });
            }).finally(() => this.$vs.loading.close());
        },
    },
    computed: {
        invalidoEntrega() {
            return (!this.endereco.complemento || !this.endereco.numero || !this.endereco.ddd || !this.endereco.telefone || !this.endereco.nome || this.endereco.telefone.length <= 8);
        },
        list() {
            if (this.expedicao.automacaos.length > 0) {
                return this.expedicao.automacaos.filter(automacao => {
                    let email = automacao.email_destinatario ? automacao.email_destinatario.toLowerCase().includes(this.dados.pesquisa.toLowerCase()) : false;
                    let rastreio = automacao.rastreio ? automacao.rastreio.toLowerCase().includes(this.dados.pesquisa.toLowerCase()) : false;
                    let nome = automacao.nome_destinatario ? automacao.nome_destinatario.toLowerCase().includes(this.dados.pesquisa.toLowerCase()) : false;

                    return email || rastreio || nome;
                });
            }

            return [];
        },
        podePagar() {
            let v1 = this.selecteds.some(element => {
                if (element.status_melhor_envio !== 'pending' || element.status_melhor_envio === '' || element.status_melhor_envio === null
                    || (element.codigo_carrinho_melhor_envio === '' && element.codigo_carrinho_melhor_envio == null) || (element.codigo_pagamento_melhor_envio !== ''
                        && element.codigo_pagamento_melhor_envio !== null)) {
                    return true;
                }
            });

            if (v1) return {success: false, message: 'Verifique o status dos itens selecionados.'};
            else return {success: true, message: 'Realizar pagamento dos itens selecionados.'};
        },
        podeGerar() {
            let v1 = this.selecteds.some(element => {
                if (element.rastreio_melhor_envio && !element.codigo_carrinho_melhor_envio) {
                    return true; //dispara erro
                }
            });

            if (v1) return {success: false, message: 'Pelo menos um dos itens selecionados não podem gerar etiqueta.'};
            else return {success: true, message: 'Gerar etiquetas dos itens selecionados.'};
        },
        podeCancelar() {
            let v1 = this.selecteds.some(element => {
                if (!(element.status == 'released' || 'posted') || !element.codigo_carrinho_melhor_envio) {
                    return true; //dispara erro
                }
            });

            if (v1) return {success: false, message: 'Pelo menos um dos itens selecionados não podem cancelar compra.'};
            else return {success: true, message: 'Cancelar compras selecionadas.'};
        },
        possuiErro() {
            let v1 = this.expedicao.automacaos.some(element => {
                if (element.status_melhor_envio === '' || element.status_melhor_envio == null || element.status_melhor_envio == 'empty') {
                    return true;
                }
            });
            return v1;
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
        },
    }
};
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
