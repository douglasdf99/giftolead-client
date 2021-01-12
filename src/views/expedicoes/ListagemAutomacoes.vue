<template>
    <div>
        <div class="bg-card-gray border-rounded mt-2 vs-con-loading__container" id="cards-limits">
            <div class="flex flex-wrap p-2">
                <div class="w-full mb-4">
                    <h5>Limites</h5>
                </div>
            </div>
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/4 w-full mb-2">
                    <span class="font-regular mb-2">Quantidade Maxima que pode comprar</span>
                    <h4> {{ limites.shipments }}</h4>
                </div>
                <div class="vx-col sm:w-1/4 w-full mb-2">
                    <span class="font-regular mb-2">Quantidade liberada para comprar</span>
                    <h4> {{ limites.shipments_available }}</h4>
                </div>
                <div class="vx-col sm:w-1/4 w-full mb-2">
                    <span class="font-regular mb-2">Limite de endereços do usuário no período (origem ou destino se for logística reversa)</span>
                    <h4> {{ limites.addresses }}</h4>
                </div>
                <div class="vx-col sm:w-1/4 w-full mb-2">
                    <span class="font-regular mb-2">Período limitado pelo limite de endereços (em dias)</span>
                    <h4> {{ limites.addresses_period }}</h4>
                </div>
            </div>
        </div>
        <div class="vx-row mt-20 flex justify-center" v-if="items.length === 0">
            <nenhum-registro></nenhum-registro>
        </div>
        <div class="com-item" v-else>
            <vs-table multiple v-model="selecteds" @selected="handleSelected" :data="items" class="table-items">
                <template slot="thead">
                    <vs-th></vs-th>
                    <vs-th>Cliente</vs-th>
                    <vs-th>Inserção</vs-th>
                    <vs-th>Brinde</vs-th>
                    <vs-th>E-mail</vs-th>
                    <vs-th>Token</vs-th>
                    <vs-th>Ordem de envio</vs-th>
                    <vs-th>Status</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr">
                        <vs-td class="flex justify-center items-center">
                            <vs-dropdown vs-trigger-click v-if="$acl.check('brinde_automacao_editar') || $acl.check('brinde_automacao_deletar')">
                                <vs-button radius color="#EDEDED" type="filled"
                                           class="btn-more-icon relative botao-menu"
                                           icon-pack="material-icons" icon="more_horiz"
                                ></vs-button>
                                <vs-dropdown-menu class="dropdown-menu-list">
                                    <vs-divider></vs-divider>
                                    <vs-dropdown-item @click="editarEndereco(tr)" v-if="$acl.check('brinde_automacao_editar') && !tr.expedicao">
                                        <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                        Editar Endereço
                                    </vs-dropdown-item>
                                    <vs-dropdown-item @click="arquivar(tr)" v-if="$acl.check('brinde_automacao_deletar')">
                                        <vs-icon icon-pack="material-icons" icon="work"></vs-icon>
                                        Arquivar
                                    </vs-dropdown-item>
                                    <vs-dropdown-item @click="restaurarAlert(tr.id)" v-show="tr.arquivado == 1" v-if="$acl.check('brinde_automacao_deletar')">
                                        <vs-icon icon-pack="material-icons" icon="star"></vs-icon>
                                        Restaurar
                                    </vs-dropdown-item>
                                </vs-dropdown-menu>
                            </vs-dropdown>
                        </vs-td>
                        <vs-td>
                            <p class="font-bold">{{ tr.lead.nome }}</p>
                            <p class="">{{ tr.lead.email }}</p>
                        </vs-td>
                        <vs-td>
                            <p class="font-bold">{{ getResponsavel(tr) }}</p>
                        </vs-td>
                        <vs-td>
                            <p class="font-bold">{{ tr.brinde.nome }}</p>
                        </vs-td>
                        <vs-td class="flex justify-center">
                            <vx-tooltip text="Enviando" position="top">
                                <vs-icon icon-pack="material-icons" icon="watch_later" color="gray" v-if="tr.eventos.length == 0" class="text-2xl"/>
                            </vx-tooltip>
                            <vx-tooltip text="Não enviado" position="top">
                                <vs-icon icon-pack="material-icons" icon="cancel" color="danger" v-if="getEventoRed(tr)" class="text-2xl"/>
                            </vx-tooltip>
                            <vx-tooltip text="Enviado" position="top">
                                <vs-icon icon-pack="material-icons" icon="check" color="success" v-if="getEventoGreen(tr)" class="text-2xl"/>
                            </vx-tooltip>
                        </vs-td>
                        <vs-td>
                            {{ tr.uuid }}
                        </vs-td>
                        <vs-td>
                            <p class="font-bold flex items-center" v-bind:class="getOrdemColor(tr)">
                                {{ getOrdemEnvio(tr) }}
                                <i class="material-icons ml-3" v-bind:class="getOrdemColor(tr)">fiber_manual_record</i>
                            </p>
                        </vs-td>
                        <vs-td class="flex">
                            <vx-tooltip position="top" :text="tr.rastreio">
                                <img src="@/assets/images/util/delivery-icon.svg" width="40px" class="mr-2 cursor-pointer" @click="copyText(tr.rastreio)" v-if="tr.rastreio != null">
                            </vx-tooltip>
                            <img src="@/assets/images/util/expedicao-icon.svg" width="25px" v-if="tr.expedicao && tr.expedicao != null">
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
            <transition name="fade" v-if="selecteds.length > 0">
                <footer-doug>
                    <div class="vx-col sm:w-11/12 mb-2">
                        <vx-tooltip :text="podeComprar.message" position="top" class="mr-3 float-right">
                            <vs-button @click="toggleModalCompra" class="" color="primary" type="filled" :disabled="!podeComprar.success">
                                Comprar etiquetas
                            </vs-button>
                        </vx-tooltip>
                        <vx-tooltip :text="podeCalcular.message" position="top" class="mr-3 float-right">
                            <vs-button class="mr-3 float-right" color="primary" type="filled" @click="calcularFrete" :disabled="!podeCalcular.success">
                                Calcular frete
                            </vs-button>
                        </vx-tooltip>
                        <div class="float-left">
                            <p>Automações selecionadas</p>
                        </div>
                    </div>
                </footer-doug>
            </transition>
        </div>
        <div class="vs-component con-vs-popup holamundo vs-popup-primary" style="z-index: 52000;" v-if="modalcompra">
            <div class="vs-popup--background"></div>
            <div class="vs-popup" style="background: rgb(255, 255, 255);" id="table-calculo">
                <header class="vs-popup--header">
                    <div class="vs-popup--title">
                    </div>
                </header>
                <div class="vs-popup--content">
                    <div class="vx-row mb-5">
                        <div class="vx-col w-full">
                            <p class="font-bold text-black text-lg">Processo de compra Melhor Envio</p>
                        </div>
                    </div>
                    <vs-divider></vs-divider>
                    <div class="vx-row mb-3">
                        <div class="vx-col w-full text-center">
                            <p class="font-bold h1 text-black">Cálculo de Custo</p>
                            <p class="font-bold text-3xl text-primary">R$ {{modalData.custo}}</p>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col w-full">
                            <div class="table w-full border-solid border-2 border-primary p-5 rounded-lg vs-con-loading__container" id="table-modal">
                                <div class="table-row-group">
                                    <div class="table-row rounded-lg" v-for="(auto, index) in modalData.automacoes">
                                        <div v-if="auto.error" class="table-cell px-3 pb-3">
                                            <vx-tooltip position="top" :text="auto.error">
                                                <i class="material-icons text-danger">error</i>
                                            </vx-tooltip>
                                        </div>
                                        <div class="table-cell px-3 pb-3">{{auto.lead.nome}}</div>
                                        <div class="table-cell px-3 pb-3">{{auto.lead.email}}</div>
                                        <div class="table-cell px-3 pb-3">
                                            <select v-model="auto.servicoSelected" @change="calculoIndividual(auto, index)" :class="'select-large-base'" :clearable="false" class="bg-white default">
                                                <option v-for="serv in modalData.services" :value="serv.id" :selected="auto.servicoSelected === serv.id">{{serv.label}}</option>
                                            </select>
                                            <!--                                            <v-select v-model="auto.servicoSelected" :class="'select-large-base'" :clearable="false" class="bg-white"-->
                                            <!--                                                      :options="modalData.services"/>-->
                                        </div>
                                        <div class="table-cell px-3 pb-3 font-bold">R$ {{auto.custo}}</div>
                                        <div class="table-cell px-3 pb-3" style="display: flex;" @click="removeAutomacao(auto, index)">
                                            <i class="material-icons dark mx-auto my-auto cursor-pointer hover:text-danger" >highlight_off</i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <vs-divider></vs-divider>
                    <div class="vx-row mt-5">
                        <div class="vx-col w-full">
                            <vs-button @click="modalData = {custo: 0, automacoes: []}; modalcompra = false" class="" color="dark" type="border">
                                Cancelar
                            </vs-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moduleAutomacao from "../../store/automacao/moduleAutomacao";
    import NenhumRegistro from "../components/NenhumRegistro";
    import moduleExpedicoesBrindes from "../../store/expedicoes/moduleExpedicoesBrindes";
    import moduleExtensoes from "../../store/extensoes/moduleExtensoes";
    import vSelect from 'vue-select'

    export default {
        components: {NenhumRegistro, 'v-select': vSelect},
        data() {
            return {
                selecteds: [],
                idSelected: null,
                melhorenvio: null,
                limites: {},

                //Modal Compra
                modalcompra: false,
                modalData: {
                    automacoes: [],
                    custo: 0,
                    services: []
                }
            }
        },
        name: "Listagem",
        props: ['items', 'tipo'],
        methods: {
            toggleModalCompra() {
                this.modalcompra = true;
                this.modalData.services = this.melhorenvio.servicos.map(item => {
                    return {id: item.uuid, label: item.servico}
                });
                this.calcularFrete();
            },
            async getExtensoes() {
                this.$vs.loading({
                    container: "#cards-limits",
                    scale: 0.45
                });
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
                    } else {
                        this.$vs.loading.close();
                    }
                }).finally(() =>
                    this.$vs.loading.close("#cards-limits > .con-vs-loading")
                );
            },
            async getLimites() {
                this.$store.dispatch('automacao/verificaLimite', {params: this.dados, config: {headers: {Authorization: `Bearer ${this.melhorenvio.token}`}}}).then(response => {
                    console.log('retorno  melhor envio', response);
                    this.limites = response.data;
                    this.limites.error = false
                }).catch(() => {
                    this.limites.error = true;
                    this.limites.errorMessage = 'Não foi possível realizar conexão com a melhor envio';
                }).finally(() => {

                });
            },
            async comprarEtiquetas() {
                for (const [idx, item] of this.selecteds.entries()) {
                    await this.$store.dispatch('automacao/adiconarCarrinho', item.id).then((response) => {
                        console.log('retorno loco', response);
                    }).catch(erro => {
                        console.log('erro', erro);
                        this.$vs.notify({
                            color: 'danger',
                            text: 'Algo deu errado ao adicionar ao carrinho'
                        });
                    }).finally(() => {
                    });
                }
            },
            async calcularFrete() {
                let obj = {payload: {}};
                for (const [idx, item] of this.selecteds.entries()) {
                    obj = await this.buildObjPayloadCalculaFrete(item); //Monta o payload a ser enviado à api

                    await this.$store.dispatch('automacao/calcular', obj).then((response) => {
                        if (response.data.error) item.error = response.data.error;
                        else {
                            item.error = null;
                            item.custo = parseFloat(response.data.price);
                        }
                        item.servicoSelected = response.data.id;
                        this.modalData.custo += item.custo;
                        this.modalData.automacoes.push(item);
                    });
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
            async calculoIndividual(item, index) {
                this.$vs.loading({
                    container: "#table-modal",
                    scale: 0.45
                });
                console.log('serv', item);
                let obj = await this.buildObjPayloadCalculaFrete(item, true);
                await this.$store.dispatch('automacao/calcular', obj).then((response) => {
                    console.log('response recalculo', response);
                    if (response.data.error) {
                        item.error = response.data.error;
                        item.custo = 0
                    } else {
                        item.error = null;
                        item.custo = parseFloat(response.data.price);
                    }
                    item.servicoSelected = response.data.id;
                    this.modalData.automacoes[index] = item;
                    this.modalData.custo = 0;
                    this.modalData.automacoes.forEach(value => this.modalData.custo += parseFloat(value.custo));
                    this.$vs.loading.close("#table-modal > .con-vs-loading");
                });
            },
            removeAutomacao(item, index){
                this.modalData.automacoes.splice(index, 1);
                this.modalData.custo -= parseFloat(item.custo);
                if(this.modalData.automacoes.length === 0) this.modalcompra = false;
            },
            getService(val) {
                const result = this.melhorenvio.servicos.filter(serv => serv.id == val);
                return result[0].uuid.toString();
            },
            handleSelected(tr) {
            },
            deleteAlert(id) {
                this.idSelected = id;
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'danger',
                    title: `Confirme`,
                    text: 'Tem certeza ao arquivar essa automação',
                    accept: this.deleteItem,
                    acceptText: "Deletar",
                    cancelText: "Cancelar"

                })
            },
            restaurarAlert(id) {
                this.idSelected = id;
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'primary',
                    title: `Confirme`,
                    text: 'Tem certeza ao Restaurar essa automação',
                    accept: this.restaurarItem,
                    acceptText: "Restaurar",
                    cancelText: "Cancelar"

                })
            },
            deleteItem() {
                this.$store.dispatch('automacao/deleteItem', this.idSelected).then(() => {
                    this.$vs.notify({
                        title: '',
                        text: "Automação aquivada com sucesso.",
                        iconPack: 'feather',
                        icon: 'icon-check-circle',
                        color: 'success'
                    })
                    this.$emit('getItems')

                }).catch(error => {

                })

            },
            arquivar(obj) {
                this.$vs.dialog({
                    color: 'primary',
                    type: 'confirm',
                    title: `Arquivar Automação`,
                    text: 'Ao arquivar a automação ela sairá da listagem atual e irá para listagem de arquivas.',
                    acceptText: 'Sim, arquivar!',
                    cancelText: 'Cancelar',
                    accept: () => {
                        this.$store.dispatch('expedicaos/arquivar', obj.id).then(() => {
                            this.$emit('getItems')
                            this.$vs.notify({
                                color: 'success',
                                text: 'Arquivado realizado com sucesso'
                            });
                        }).catch(erro => {
                            console.log('erro', erro);
                            this.$vs.notify({
                                color: 'danger',
                                text: 'Algo deu errado ao arquivar a automação. Contate o suporte'
                            });
                        });
                    }
                })
            },
            restaurarItem() {
                this.$store.dispatch('automacao/restaurarItem', this.idSelected).then(() => {
                    this.$vs.notify({
                        title: '',
                        text: "Automação restaurada com sucesso.",
                        iconPack: 'feather',
                        icon: 'icon-check-circle',
                        color: 'success'
                    })
                    this.$emit('getItems')

                }).catch(error => {

                })

            },
            getResponsavel(obj) {
                switch (obj.responsavel_type) {
                    case 'App\\Models\\User':
                        return obj.responsavel.name;
                    default:
                        return obj.responsavel.nome;
                }
            },
            getLinkRastreio(obj) {
                let url = 'https://weentrega.saveleads.com.br/preencher/' + obj.uuid + '/' + obj.email_destinatario;
                const thisIns = this;
                this.$copyText(url).then(function () {
                        thisIns.$vs.notify({
                            title: 'Success',
                            text: 'URL copiada para sua área de transferência',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check-circle'
                        })
                    },
                    function () {
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
            getOrdemEnvio(obj) {
                if (obj.endereco == null)
                    return 'Pendente'
                else
                    return 'Preenchida'
            },
            getOrdemColor(obj) {
                if (obj.endereco == null)
                    return 'text-warning';
                else
                    return 'text-primary';
            },
            getEventoRed(obj) {
                if (obj.eventos.length > 0)
                    return obj.eventos[obj.eventos.length - 1].resposta == 'error';
                else
                    return false;
            },
            getEventoGreen(obj) {
                if (obj.eventos.length > 0)
                    return obj.eventos[obj.eventos.length - 1].resposta == 'success';
                else
                    return false;
            },
            copyText(val) {
                const thisIns = this;
                this.$copyText(val).then(function () {
                    thisIns.$vs.notify({
                        title: 'Success',
                        text: 'Código de rastreio copiado para sua área de transferência',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check-circle'
                    })
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
            reenviar(token) {
                let self = this
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'primary',
                    title: `Confirme`,
                    text: 'Certeza de que deseja reenviar este e-mail?',
                    accept() {
                        self.$store.dispatch('automacao/enviarEmail', {uuid: token, evento: 1}).then(() => {
                            this.$vs.notify({
                                text: 'Enviado com sucesso.',
                                color: 'success'
                            });
                        }).catch(erro => {
                            this.$vs.notify({
                                text: erro.message,
                                color: 'danger',
                                title: 'Ops! Algo deu errado. Contate o suporte.',
                                time: 10000,
                            })
                        })
                    },
                    acceptText: "Enviar",
                    cancelText: "Cancelar"

                })
            },
            //Editar endereço da automação
            editarEndereco(obj) {
                console.log('editar', obj);
                this.$emit('editarEnd', obj);
            },
        },
        created() {
            if (!moduleExpedicoesBrindes.isRegistered) {
                this.$store.registerModule('expedicaos', moduleExpedicoesBrindes);
                moduleExpedicoesBrindes.isRegistered = true;
            }
            if (!moduleAutomacao.isRegistered) {
                this.$store.registerModule('automacao', moduleAutomacao)
                moduleAutomacao.isRegistered = true
            }
            if (!moduleExtensoes.isRegistered) {
                this.$store.registerModule('extensoes', moduleExtensoes)
                moduleExtensoes.isRegistered = true
            }
        },
        mounted() {
            this.getExtensoes();
        },
        computed: {
            podeComprar() {
                if (this.limites.shipments_available < this.selecteds.length) {
                    return {success: false, message: 'A quantidade selecionada não corresponde a quantidade liberada para comprar'}
                }
                if (this.limites.error) {
                    return {success: false, message: this.limites.errorMessage}
                }
                return {success: true, message: 'Tudo de boa na lagoa'};
            },
            podeCalcular() {
                let semEndereco = this.selecteds.filter(item => !item.endereco);
                if (semEndereco.length > 0) return {success: false, message: 'Não é possível calcular frete de uma automação sem endereço.'};
                return {success: true, message: 'Ápto a calcular.'}
            }
        },
        watch: {
            selecteds(val) {
                console.log('selecteds', val);
            }
        }
    }
</script>

<style scoped>
    #table-calculo {
        width: 800px
    }
</style>
