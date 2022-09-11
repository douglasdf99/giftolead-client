<template>
    <div>
        <div class="vx-row">

            <div class="vx-col w-full lg:w-3/12 relative" style="height: 100%;">
                <div class="rounded-t-lg bg-dark" style="height: 100px;"></div>
                <img src="@/assets/images/util/melhorenvio.png" width="50%" class="absolute bg-white px-4 mb-4" style="border-radius: 10px;left: 25%; top: 20%">
                <div class="rounded-b-lg text-center" style="background-color: #E8EBF2">
                    <p class="pt-20 font-bold text-black">Melhor Envio</p>
                    <p class="my-2 ">Entregue brindes utilizzando a logistica do Melhor Envio, possibilitando várias opções de transporte.</p>
                    <vs-button color="dark" class="my-5 w-10/12" @click="instalado ? desinstalar() : instalar()" v-if="$acl.check('extensao_slack_install')">{{
                            instalado ? 'Desinstalar' : 'Instalar'
                        }}
                    </vs-button>
                </div>
            </div>
            <div class="vx-col w-full lg:w-9/12">
                <div class="vx-row">
                    <!-- <div class="vx-col w-full mb-4">
                            <div class="p-5 rounded-lg bg-white">
                                <p>
                                  Configure aqui a forma que será utilizado sua integração do Melhor Envio
                                </p>
                            </div>
                        </div>-->
                    <div class="vx-col w-full vs-con-loading__container " id="cards-melhor-info">
                        <vs-alert color="danger" title="Atenção: verificar problema do contrato." active="true" class="mb-4" v-if="this.melhorEnvio.error">
                            {{ melhorEnvio.error }}
                        </vs-alert>
                        <vx-card class="grid-view-item mb-base overflow-hidden">
                            <div class="vx-row mb-2" v-if="!melhorEnvio.status">
                                Com a melhor envio, você pode enviar brindes com diferentes tipos de logísticas.
                            </div>
                            <!--                        Detalhamento-->
                            <div class="vx-row mb-6" v-if="melhorEnvio.status">
                                <div class="vx-col w-full mb-2">
                                    <div class="vx-row mb-6">
                                        <div class="vx-col sm:w-1/2 w-full mb-2">
                                            <span class="font-regular mb-2">Nome</span>
                                            <h4 class="flex items-center"> {{ melhorEnvio.firstname }} {{ melhorEnvio.lastname }}
                                            </h4>
                                        </div>
                                        <div class="vx-col sm:w-1/2 w-full mb-2">
                                            <span class="font-regular mb-2">Email</span>
                                            <h4 class="flex items-center"> {{ melhorEnvio.email }}
                                            </h4>
                                        </div>
                                    </div>
                                    <div class="vx-row mb-6">
                                        <div class="vx-col sm:w-1/2 w-full mb-2">
                                            <span class="font-regular mb-2">Documento</span>
                                            <h4> {{ melhorEnvio.document }}</h4>
                                        </div>
                                        <div class="vx-col sm:w-1/2 w-full mb-2">
                                            <span class="font-regular mb-2">Status</span>
                                            <h4> {{ translateStatus(melhorEnvio.status.status)  }}</h4>
                                        </div>
                                    </div>
                                    <div class="vx-row mb-6">
                                        <div class="vx-col sm:w-1/4 w-full mb-2">
                                            <span class="font-regular mb-2">Quantidade Maxima que pode comprar</span>
                                            <h4> {{ melhorEnvio.limits.shipments }}</h4>
                                        </div>
                                        <div class="vx-col sm:w-1/4 w-full mb-2">
                                            <span class="font-regular mb-2">Quantidade liberada para comprar</span>
                                            <h4> {{ melhorEnvio.limits.shipments_available }}</h4>
                                        </div>
                                        <div class="vx-col sm:w-1/4 w-full mb-2">
                                            <span class="font-regular mb-2">Limite de endereços do usuário no período (origem ou destino se for logística reversa)</span>
                                            <h4> {{ melhorEnvio.limits.addresses }}</h4>
                                        </div>
                                        <div class="vx-col sm:w-1/4 w-full mb-2">
                                            <span class="font-regular mb-2">Período limitado pelo limite de endereços (em dias)</span>
                                            <h4> {{ melhorEnvio.limits.addresses_period }}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--              Fim Detalhamento-->
                        </vx-card>
                        <vs-divider></vs-divider>
                        <div class="" v-if="item2">
                            <h4 class="font-bold mb-8">Configurações das formas de frete</h4>
                            <div class="vx-col w-full mb-2 d-inline-flex font-bold" style="display: flex">
                                <u class="py-2"><span class="font-14 text-black font-bold ml-2 mr-2">Atualizar formas de frete Melhor Envio </span></u>
                                <vs-button radius color="dark" type="border" icon-pack="material-icons" icon="sync" @click="atualizaServicos"></vs-button>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <vs-alert :active="!item2.config_padrao" color="danger" icon-pack="feather" icon="icon-info">
                                        <span>Atenção, é nescessário selecionar o serviço padrão de Logística</span>
                                    </vs-alert>
                                </div>
                            </div>
                            <div id="cards-melhor-servicos" class="col-12 mb-20 vs-con-loading__container">
                                <div class="com-item" v-if="item2.servicos.length > 0">
                                    <vs-table :data="item2" class="table-items  mt-4" style="z-index: 2">
                                        <template slot="thead">
                                            <vs-th>Descricao</vs-th>
                                            <vs-th>Código do serviço</vs-th>
                                            <vs-th>Padrão</vs-th>
                                        </template>

                                        <template slot-scope="{}">
                                            <vs-tr :key="servico.id" v-for="servico in item2.servicos" class="mb-3">
                                                <vs-td :data="servico.transportadora">
                                                    <span class="destaque">{{ servico.transportadora }} - {{ servico.servico }}</span>
                                                </vs-td>
                                                <vs-td :data="servico.uuid">
                                                    <vs-chip class="primary" :color="servico.status ? 'primary' :'danger'"><span class="destaque">{{ servico.uuid }}</span> - {{ servico.status }}</vs-chip>
                                                </vs-td>
                                                <vs-td>
                                                    <p class="mb-1 mt-2 mt-sm-0 font-weight-bold text-dark" v-if="item2.config_padrao">
                                                        <a v-if="servico.id === parseInt(item2.config_padrao.servico)" class="text-dark"><span
                                                            class="material-icons">star</span></a>
                                                        <a v-else :class="{'disabled' : salvando}" @click="setPadrao(servico)"
                                                           style="cursor: pointer;" class="text-dark">
                                                            <span class="material-icons">star_outline</span>
                                                        </a>
                                                    </p>
                                                    <a v-else class="" :class="{'disabled' : salvando}" @click="setPadrao(servico)"
                                                       style="cursor: pointer;">
                                                        <span class="material-icons">star_outline</span>
                                                    </a>
                                                </vs-td>
                                            </vs-tr>
                                        </template>

                                    </vs-table>
                                </div>
                                <div class="col-12 mb-20" v-else>
                                    <div class="card-box mb-0">
                                        <div class="row align-items-center">
                                            <div class="col-sm-12">
                                                <p class="mb-1 mt-2 mt-sm-0 font-bold text-center text-dark">
                                                    Nenhum serviço encontrado</p>
                                            </div>
                                        </div> <!-- end row -->
                                    </div>
                                </div>
                            </div>
                            <div id="div-excecao" class="vs-con-loading__container">
                                <h4 class="font-bold mb-2">Exceções</h4>
                                <h6 class="font-regular mb-8">Voocê pode criar regras alternativas de serviço postal para entregas
                                    diferenciadas</h6>
                                <vx-card :key="config.id" class="mb-10" v-for="(config, index) in item2.configs"
                                         v-bind:style="{border: (config.error ? '2px solid #ff000066' : '')}">
                    <span class="btn btn-dark btn-rounded font-13 text-white font-weight-bold text-ou" v-if="index > 0"><vs-button
                        size="small" color="dark">OU</vs-button></span>
                                    <div class="vx-row">
                                        <div class="vx-col sm:w-1/12 w-full mb-2">
                                            <vs-dropdown vs-trigger-click>
                                                <vs-button radius color="#EDEDED" type="filled"
                                                           class="btn-more-icon relative botao-menu"
                                                           icon-pack="material-icons" icon="more_horiz"
                                                ></vs-button>
                                                <vs-dropdown-menu class="dropdown-menu-list">
                                                    <vs-dropdown-item @click="showEditarExcecao(config)">
                                                        <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                                        Editar
                                                    </vs-dropdown-item>

                                                    <vs-dropdown-item @click="showRemoverExcecao(config.id)">
                                                        <vs-icon icon-pack="material-icons" icon="delete"></vs-icon>
                                                        Deletar
                                                    </vs-dropdown-item>

                                                </vs-dropdown-menu>
                                            </vs-dropdown>
                                        </div>
                                        <div class="vx-col sm:w-1/12 w-full mb-2 flex" v-if="config.error">
                                            <vx-tooltip :text="config.error" position="top">
                                <span class="rounded-full bg-danger py-2 px-2 text-enum text-white font-bold">
                                    X
                                </span>
                                            </vx-tooltip>
                                        </div>
                                        <div class="vx-col sm:w-1/12 w-full mb-2" v-else>
                                            <span class="rounded-full bg-primary py-2 px-2 text-enum text-white font-bold">{{ index + 1 }}</span>
                                        </div>
                                        <div class="vx-col sm:w-4/12 w-full mb-2">
                                            <p class="mb-0 text-base font-bold">Tipo</p>
                                            {{ selectedtipo(config.tipo) }}
                                        </div>
                                        <div class="vx-col sm:w-3/12 w-full mb-2" v-if="config.tipo == 'estado'">
                                            <p class="mb-0 text-base font-bold">Variável</p>
                                            {{ config.variavel }}
                                        </div>
                                        <div class="vx-col sm:w-3/12 w-full mb-2" v-else>
                                            <p class="mb-0 text-base font-bold">Variável</p>
                                            {{ selectedBrinde(config.variavel) }}
                                        </div>
                                        <div class="vx-col sm:w-3/12 w-full mb-2">
                                            <p class="mb-0 text-base font-bold">Serviço Aplicado</p>
                                            <span class="font-15 font-weight-bold">{{ servicoconfig(config.servico) }}</span>
                                        </div>
                                    </div>
                                    <!-- end row -->
                                </vx-card>

                                <div class="vx-row justify-center align-center mt-10">
                                    <vs-button @click="showAdicionarExcecao" color="primary" type="filled" icon-pack="material-icons" icon="control_point"
                                               class="font-bold">Adicionar Exceção
                                    </vs-button>
                                </div>

                                <div class="mt-20">
                                    <vs-divider></vs-divider>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <vs-prompt
            @cancel="clearValMultiple"
            @accept="sendexcecao"
            @close="close"
            :acceptText="'Salvar'"
            :cancelText="'Cancelar'"
            :is-valid="validExcecao"
            :title="'Adicionar exceção'"
            :max-width="'600px'"
            :active.sync="modalexcecao">
            <div class="con-exemple-prompt">
                Entre com os dados da configuração...

                <vs-alert v-show="!validExcecao" color="danger" vs-icon="new_releases">
                    Os campos não podem ficar vazios
                </vs-alert>
                {{ this.val }}
                <div class="">
                    <span class="font-regular mb-2">Tipo</span>
                    <v-select v-model="val.tipo" class="mt-4 mb-2" :class="'select-large-base'" :clearable="false"
                              :options="opcoesTipo" v-validate="'required'" name="tipo"/>
                </div>

                <div class="">
                    <span class="font-regular mb-2">Variavel</span>
                    <v-select v-model="val.variavel" class="mt-4 mb-2" label="text" v-if="val.tipo.id == 'estado'"
                              :class="'select-large-base'" :clearable="false"
                              :options="estados" v-validate="'required'" name="variavel"/>
                    <v-select v-model="val.variavel" class="mt-4 mb-2" v-else :class="'select-large-base'"
                              :clearable="false"
                              :options="optionBrindes()" v-validate="'required'" name="variavel"/>
                </div>
                <div class="">
                    <span class="font-regular mb-2">Serviço</span>
                    <v-select v-model="val.servico" class="mt-4 mb-2" :class="'select-large-base'" :clearable="false"
                              :options="optionServicos()" v-validate="'required'" name="variavel"/>
                </div>
            </div>
        </vs-prompt>
    </div>
</template>

<script>
import moduleExtensoes from "../../../store/extensoes/moduleExtensoes";
import vSelect from 'vue-select';
import moduleUsuario from "../../../store/usuarios/moduleUsuario";
import moduleBrindes from "@/store/brindes/moduleBrindes";

const moment = require('moment/moment');
require('moment/locale/pt-br');

export default {
    name: "TotalVoice",
    components: {
        moment, 'v-select': vSelect,
    },
    data() {
        return {
            configDelete: null,
            modalexcecao: false,
            salvando: false,
            item: {},
            status: false,
            dados: {
                dt_inicio: '',
                dt_fim: '',
                subdomain: 'app',
                type: 'App\\Models\\Extensoes\\MelhorEnvio',
                page: 1
            },
            estados: [
                {value: '', text: "Selecione um estado"},
                {value: "AC", text: "Acre"},
                {value: "AL", text: "Alagoas"},
                {value: "AP", text: "Amapá"},
                {value: "AM", text: "Amazonas"},
                {value: "BA", text: "Bahia"},
                {value: "CE", text: "Ceará"},
                {value: "DF", text: "Distrito Federal"},
                {value: "ES", text: "Espírito Santo"},
                {value: "GO", text: "Goiás"},
                {value: "MA", text: "Maranhão"},
                {value: "MT", text: "Mato Grosso"},
                {value: "MS", text: "Mato Grosso do Sul"},
                {value: "MG", text: "Minas Gerais"},
                {value: "PA", text: "Pará"},
                {value: "PB", text: "Paraíba"},
                {value: "PR", text: "Paraná"},
                {value: "PE", text: "Pernambuco"},
                {value: "PI", text: "Piauí"},
                {value: "RJ", text: "Rio de Janeiro"},
                {value: "RN", text: "Rio Grande do Norte"},
                {value: "RS", text: "Rio Grande do Sul"},
                {value: "RO", text: "Rondônia"},
                {value: "RR", text: "Roraima"},
                {value: "SC", text: "Santa Catarina"},
                {value: "SP", text: "São Paulo"},
                {value: "SE", text: "Sergipe"},
                {value: "TO", text: "Tocantins"}
            ],
            opcoesTipo: [
                {id: 'estado', label: "Quando o estado for"},
                {id: "brinde", label: "Quando o brinde for"},
            ],
            val: {
                id: null,
                tipo: "",
                servico: "",
                variavel: "",
                campanha_brinde_id: this.$route.params.id
            },
            brindes: {},
            melhorEnvio: {},
            pagination: {
                last_page: 1,
                page: 1,
                current_page: 1,
                total: 0
            },
            extensao: null,
            servicosMelhor: null,
            currentx: 1,
            instalado: false,
            countSwitch: 0,
        };
    },
    created() {
        if (!moduleBrindes.isRegistered) {
            this.$store.registerModule('brindes', moduleBrindes);
            moduleBrindes.isRegistered = true;
        }
        this.getBrindes();
        if (!moduleExtensoes.isRegistered) {
            this.$store.registerModule('extensoes', moduleExtensoes);
            moduleExtensoes.isRegistered = true;
        }
        if (!moduleUsuario.isRegistered) {
            this.$store.registerModule('users', moduleUsuario);
            moduleUsuario.isRegistered = true;
        }
    },
    mounted() {
        this.verifica();
    },
    computed: {
        validExcecao() {
            return (this.val.tipo !== "" && this.val.servico !== "" && this.val.variavel !== "");
        },
        users() {
            let users = [];
            this.usersall.forEach(val => {
                if (val.ramal == null)
                    users.push({id: val.id, label: val.name});
            });
            return users;
        },
        item2() {
            if (this.extensao)
                return this.extensao.extensao;
        }
    },
    methods: {
        translateStatus(val) {
            switch (val) {
                case 'Allowed':
                    return 'Permitido';
                default:
                    return val;
            }
        },
        getBrindes() {
            this.$store.dispatch('getVarios', {rota: 'brindes'}).then(response => {
                this.brindes = response;
                //this.dados.page = this.pagination.current_page
            });
        },
        async verifica() {
            this.$vs.loading();
            this.dados.subdomain = window.location.pathname.split('/')[1] ? window.location.pathname.split('/')[1] : 'app';
            await this.$store.dispatch('extensoes/get', this.dados.subdomain).then(response => {
                let arr = response.extensoes;

                if (arr.length > 0) {
                    arr.forEach(item => {
                        if (item.extensao_type === "App\\Models\\Extensoes\\MelhorEnvio") {
                            this.extensao = item;
                            this.instalado = true;
                            this.servicosMelhor = response.melhor_envio_serices;
                            this.getInformation(item.extensao.token);
                        }
                    });
                } else {
                    this.$vs.loading.close();
                }
            }).finally(() => this.$vs.loading.close());
        },
        async getInformation(token) {
            await this.$vs.loading({
                container: "#cards-melhor-info",
                scale: 0.45
            });
            await this.$store.dispatch('extensoes/MelhorInfo', {params: this.dados, config: {headers: {Authorization: `Bearer ${token}`}}}).then(response => {
                this.melhorEnvio = response.data;
            }).catch(() => {
                this.melhorEnvio.error = 'Não foi possível relizar conexão com a Melhor Envio';
            }).finally(() => {
                this.$vs.loading.close("#cards-melhor-info > .con-vs-loading");
            });
            //
            // this.$vs.loading({
            //   container: "#cards-melhor-servicos",
            //   scale: 0.45
            // });
            // await this.$store.dispatch('extensoes/MelhorServicos', this.dados).then(response => {
            // }).finally(() => {
            //   this.$vs.loading.close("#cards-melhor-servicos > .con-vs-loading")
            // });
            //
            // this.$vs.loading({
            //   container: "#cards-melhor-servicos",
            //   scale: 0.45
            // });
            // await this.$store.dispatch('extensoes/MelhorServicos', this.dados).then(response => {
            //
            // }).finally(() => {
            //   this.$vs.loading.close("#cards-melhor-servicos > .con-vs-loading")
            // });
            //
            // this.$vs.loading({
            //   container: "#cards-melhor-servicos",
            //   scale: 0.45
            // });
            // await this.$store.dispatch('extensoes/MelhorServicos', this.dados).then(response => {
            //
            // }).finally(() => {
            //   this.$vs.loading.close("#cards-melhor-servicos > .con-vs-loading")
            // })

        },
        async atualizaServicos(token) {
            await this.$vs.loading({
                container: "#cards-melhor-servicos",
                scale: 0.45
            });
            await this.$store.dispatch('extensoes/MelhorServices', {params: this.dados, config: {headers: {Authorization: `Bearer ${token}`}}}).then(response => {
                this.extensao.extensao.servicos = response.data;
            }).finally(() => {
                this.$vs.loading.close("#cards-melhor-servicos > .con-vs-loading");
            });

        },
        async setPadrao(item) {
            await this.$vs.loading({
                container: "#cards-melhor-servicos",
                scale: 0.45
            });
            await this.$store.dispatch('extensoes/setPadrao', {id: item.id}).then(response => {
                this.$vs.notify({
                    title: '',
                    text: "Itens atualizado com sucesso",
                    iconPack: 'feather',
                    icon: 'icon-check-circle',
                    color: 'success'
                });
                this.extensao.extensao.config_padrao = response.data.data;
            }).catch((error) => {
                this.$vs.notify({
                    title: '',
                    text: error.response.data.message,
                    color: 'danger'
                });
            }).finally(() => {
                this.$vs.loading.close("#cards-melhor-servicos > .con-vs-loading");
            });

        },
        ativaExtensao() {
            if (this.countSwitch === 3) {
                this.extensao.ativo = !this.extensao.ativo;
                this.$vs.notify({
                    title: '',
                    text: 'Muitas tentativas de ativação',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
            } else {
                const formData = new FormData();
                let ativo = this.extensao.ativo ? 0 : 1;
                let text = this.extensao.ativo ? 'Desativada' : 'Ativada';
                formData.append('ativo', ativo);
                formData.append('_method', 'PUT');
                this.$store.dispatch('extensoes/ativa', {id: this.extensao.id, dados: formData}).then(() => {
                    this.$vs.notify({
                        title: '',
                        text: text + " com sucesso.",
                        iconPack: 'feather',
                        icon: 'icon-check-circle',
                        color: 'success'
                    });
                }).catch(erro => {
                    this.$vs.notify({
                        title: 'Error',
                        text: erro.response.data.message,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    });
                });
                this.countSwitch += 1;
            }
        },
        instalar() {
            this.$vs.dialog({
                color: 'primary',
                title: `Instalar extensão?`,
                text: 'Você confirma que leu e aceita os termos da instalação?',
                acceptText: 'Sim, prosseguir!',
                accept: () => {
                    this.$vs.loading();
                    this.$store.dispatch('extensoes/instalar', {subdomain: this.dados.subdomain, type: 'MelhorEnvio'}).then((response) => {
                        window.location.href = response.data;
                        this.verifica();
                    }).catch(() => {
                        this.$vs.notify({
                            color: 'danger',
                            title: '',
                            text: 'Algo deu errado ao instalar. Contate o suporte.'
                        });
                    });
                }
            });
        },
        desinstalar() {
            this.$vs.dialog({
                color: 'danger',
                title: `Desinstalar extensão?`,
                text: 'Você confirma que leu e aceita os termos da instalação?',
                acceptText: 'Sim, prosseguir!',
                accept: () => {
                    this.$vs.loading();
                    this.$store.dispatch('extensoes/desinstalar', {subdomain: this.dados.subdomain, type: 'MelhorEnvio', id: this.item2.id}).then(() => {
                        document.location.reload(true);
                        this.$vs.notify({
                            color: 'success',
                            title: '',
                            text: 'Desinstalado com sucesso com sucesso'
                        });
                    }).catch(() => {
                        this.$vs.notify({
                            color: 'danger',
                            title: '',
                            text: 'Algo deu errado ao instalar. Contate o suporte.'
                        });
                    }).finally(() => {
                        this.$vs.loading.close();
                    });
                }
            });
        },

        //Modal
        showAdicionarExcecao() {
            this.val.tipo = "";
            this.val.varaivel = "";
            this.val.servico = "";
            this.modalexcecao = true;
        },
        showEditarExcecao(item) {
            this.val.id = item.id;
            let val = JSON.parse(JSON.stringify(item));
            let nome = this.selectedtipo(val.tipo);
            let estado = this.selectedEstado(val.variavel);
            let brinde = this.selectedBrinde(val.variavel);
            this.val.tipo = {id: val.tipo, label: nome};
            if (val.tipo == 'estado') {
                this.val.variavel = {value: val.variavel, text: estado};
            } else {
                this.val.variavel = {id: val.variavel, label: brinde};
            }
            this.val.servico = {id: val.servico, label: this.servicoconfig(val.servico)};
            this.modalexcecao = true;
        },

        showRemoverExcecao(item) {
            this.configDelete = item;
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Deletar exceção`,
                text: 'Você realmente gostaria de deletar essa exceção?',
                acceptText: 'Deletar',
                cancelText: 'Cancelar',
                accept: this.deleteExcexao,
            });
        },
        deleteExcexao() {
            this.$vs.loading({
                container: '#div-excecao',
                scale: 0.6
            });
            this.$store.dispatch('extensoes/MelhorEnvioDeleteExcecao', {id: this.configDelete})
                .then((response) => {
                    let arrayser = [];
                    this.item2.configs.forEach((item) => {
                        if (item.id != response.data.data.id) {
                            arrayser.push(item);
                        }
                    });
                    this.item2.configs = arrayser;
                    this.$vs.notify({color: 'success', title: 'Sucesso!', text: 'Exceção deleta com sucesso'});
                })
                .catch(error => {
                    this.$vs.notify({
                        title: 'Error',
                        text: error.response.data.message,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    });
                }).finally(() => {
                this.salvando = false;
                this.$vs.loading.close('#div-excecao > .con-vs-loading');
            });

        },
        clearValMultiple() {
            this.val.tipo = "";
            this.val.varaivel = "";
            this.val.servico = "";
        },
        selectedtipo(config) {
            let retorno = '';
            if (config == 'estado') {
                retorno = 'Quando o estado for';
            }
            if (config == 'brinde') {
                retorno = 'Quando o brinde for';
            }
            return retorno;
        },
        selectedEstado(estado) {
            let item2 = '';
            this.estados.forEach(item => {
                if (item.value == estado) {
                    item2 = item.text;
                }
            });
            return item2;
        },
        selectedBrinde(brinde) {
            let item2 = '';
            this.brindes.forEach(item => {
                if (item.id == brinde) {
                    item2 = item.nome;
                }
            });
            return item2;
        },
        servicoconfig(servico) {
            let serv = false;
            this.item2.servicos.forEach(item => {
                if (item.id == servico) {
                    serv = item.transportadora + ' - ' + item.servico;
                }
            });
            if (serv) {
                return serv;
            } else {
                return 'Serviço não encontrado';
            }
        },
        close() {
            this.clearValMultiple();
            this.$vs.notify({
                color: 'danger',
                title: 'Closed',
                text: 'You close a dialog!'
            });
        },
        optionBrindes() {
            let option = [];
            if (this.brindes && this.brindes.length > 0) {
                this.brindes.forEach(item => {
                    option.push({id: item.id, label: item.nome});
                });
            }
            return option;
        },
        optionServicos() {
            let option = [];
            if (this.item2 && this.item2.servicos.length > 0) {
                this.item2.servicos.forEach(item => {
                    option.push({id: item.id, label: item.transportadora + ' - ' + item.servico});
                });
            }
            return option;
        },
        adcionarExcecao() {

        },
        async sendexcecao() {
            let obj = {};
            obj.tipo = this.val.tipo.id;
            if (this.val.tipo.id == 'estado') {
                obj.variavel = this.val.variavel.value;
            } else {
                obj.variavel = this.val.variavel.id;
            }
            obj.servico = this.val.servico.id;
            obj.correio_id = this.item2.id;

            let encontrado = false;
            await this.item2.configs.forEach(item => {
                if (item.tipo == obj.tipo && item.variavel == obj.variavel && item.servico == obj.servico) {
                    encontrado = true;
                }
            });
            if (encontrado) {
                this.$vs.notify({
                    title: '',
                    text: 'Já existe uma exceção cadastrada com este tipo e variável.',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger',
                    time: 5000
                });
            } else {
                if (this.val.id > 0) {
                    obj.id = this.val.id;
                    this.$store.dispatch('extensoes/MelhorEnvioEditExcecao', obj)
                        .then((response) => {
                            let arrayser = [];
                            this.item2.configs.forEach((item) => {
                                if (item.id == response.data.data.id) {
                                    item = response.data.data;
                                    arrayser.push(response.data.data);
                                } else
                                    arrayser.push(item);

                            });
                            this.item2.configs = arrayser;
                            this.$vs.notify({
                                color: 'success',
                                title: 'Sucesso!',
                                text: 'Exceção adicionada com sucesso'
                            });
                        })
                        .catch((error) => {
                            this.$vs.notify({
                                title: '',
                                text: error.response.data.message,
                                color: 'danger'
                            });
                        })
                        .finally(() => {
                            this.$vs.loading.close('#div-excecao > .con-vs-loading');
                        });
                } else {
                    this.$store.dispatch('extensoes/MelhorEnvioAddExcecao', obj)
                        .then((response) => {
                            this.item2.configs.push(response.data.data);
                            this.$vs.notify({
                                color: 'success',
                                title: 'Sucesso!',
                                text: 'Exceção alterada com sucesso'
                            });
                        })
                        .catch(error => {
                            this.$vs.notify({
                                title: 'Error',
                                text: error.response.data.message,
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'danger'
                            });
                        }).finally(() => {
                        this.$vs.loading.close('#div-excecao > .con-vs-loading');
                    });
                }
            }

        },
        getUsers() {
            this.$store.dispatch('users/get').then(response => {
                this.usersall = response;
            });
        },
        salvar() {
            this.$vs.loading();
            this.$store.dispatch('extensoes/storeMelhorEnvio', this.extensao.extensao).then(() => {
                this.$vs.notify({
                    color: 'success',
                    text: 'URL salva com sucesso.'
                });
            }).catch(() => {
                this.$vs.notify({
                    color: 'danger',
                    text: 'Algo deu errado ao salvar a configuração. Contate o suporte.'
                });
            }).finally(() => this.$vs.loading.close());
        }
    },
};
</script>

<style scoped>

</style>
