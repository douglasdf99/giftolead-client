<template>
    <div>
        <h4 class="font-bold mb-10 mt-20">Dados do contrato
        </h4>
        <vs-alert color="danger" title="Atenção: verificar problema do contrato." active="true" class="mb-4"
                  v-if="item.erros">
            {{ item.erros }}
        </vs-alert>
        <vx-card class="grid-view-item mb-base overflow-hidden">
            <div class="vx-row mb-2">
                <div class="vx-col w-full">
                    <vs-button radius color="primary" type="border" icon-pack="material-icons" icon="edit"
                               class="float-right"
                               @click="$router.push({path: '/configuracoes/contratos/editar/' + item.id})"></vs-button>
                </div>
            </div>
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-2/3 w-full mb-2">
                    <div class="vx-row mb-6">
                        <div class="vx-col w-full mb-2">
                            <span class="font-regular mb-2">Nome de Contrato</span>
                            <h4 class="flex items-center"> {{ item.nome }}
                                <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                         class="icon-grande text-success" style="margin-left: 1rem;margin-top: 3px;"
                                         v-if="item.status"></vs-icon>
                                <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                         class="icon-grande text-danger"
                                         style="margin-left: 1rem;margin-top: 3px;" v-else></vs-icon>
                            </h4>
                        </div>
                    </div>
                    <div class="vx-row mb-6">
                        <div class="vx-col sm:w-1/2 w-full mb-2">
                            <span class="font-regular mb-2">Cartão de postagem</span>
                            <h4> {{ item.cartaoPostagem }}</h4>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2">
                            <span class="font-regular mb-2">Número do contrato</span>
                            <h4> {{ item.contrato }}</h4>
                        </div>
                    </div>
                    <div class="vx-row mb-6">
                        <div class="vx-col sm:w-1/2 w-full mb-2">
                            <span class="font-regular mb-2">Usuário SIGEP WEB</span>
                            <h4> {{ item.usuario }}</h4>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-2">
                            <span class="font-regular mb-2">Senha SIGEP WEB</span>
                            <h4> {{ item.senha }}</h4>
                        </div>
                    </div>
                    <div class="vx-col w-full mb-2 d-inline-flex font-bold" style="display: flex">
                        <a class="py-2 cursor-pointer" @click="correiosLogar"><u><span
                            class="font-14 text-primary font-bold ml-2 mr-2">Logar no sistema do correios </span></u></a>
                        <vs-button radius color="dark" type="border" icon-pack="material-icons" icon="vpn_key"
                                   @click="correiosLogar"></vs-button>
                    </div>
                </div>
                <div class="vx-col sm:w-1/3 w-full mb-2">
                    <div class="mb-6 p-5 pt-0">
                        <span class="font-regular mb-3 ml-2">Logotipo da etiqueta</span>
                        <div class="flex justify-left content-left" v-if="item.logotipo">
                            <!-- ITEM IMAGE -->
                            <div class="item-img-container bg-white h-64 flex items-center justify-center mb-4">
                                <img :src="get_img_api(item.logotipo)" style="width: 200px" alt="logotipo"
                                     class="grid-view-img px-4">
                            </div>
                            <div class="item-details px-4">
                            </div>
                            <div class="flex flex-wrap">
                            </div>
                        </div>

                        <div class="w-full text-center mt-10 m-4" v-else>
                            <h6 class="text-center"><i>Sem logotipo</i></h6>
                        </div>

                    </div>
                </div>
            </div>
        </vx-card>
        <vs-divider></vs-divider>
        <div class="" v-if="item.id">
            <h4 class="font-bold mb-8">Configurações das formas de frete</h4>
            <div class="vx-col w-full mb-2 d-inline-flex font-bold" style="display: flex">
                <u class="py-2"><span class="font-14 text-black font-bold ml-2 mr-2">Buscar formas de frete deste contrato </span></u>
                <vs-button radius color="dark" type="border" icon-pack="material-icons" icon="sync"
                           @click="correiosservicos"></vs-button>
            </div>
            <div class="row">
                <div class="col-12">
                    <vs-alert :active="!item.config_padrao" color="danger" icon-pack="feather" icon="icon-info">
                        <span>Atenção, é nescessário selecionar o serviço padrão do Contrato</span>
                    </vs-alert>
                </div>
            </div>
            <div id="div-servicos" class="col-12 mb-20 vs-con-loading__container">
                <div class="com-item" v-if="item.servicos && item.servicos.length > 0">
                    <vs-table :data="item" class="table-items  mt-4" style="z-index: 2">

                        <template slot="thead">
                            <vs-th>Descricao</vs-th>
                            <vs-th>Código do serviço</vs-th>
                            <vs-th>Padrão</vs-th>
                        </template>

                        <template slot-scope="{}">
                            <vs-tr :key="servico.id" v-for="servico in item.servicos" class="mb-3">
                                <vs-td :data="servico.descricao">
                                    <span class="destaque">{{ servico.descricao }}</span>
                                </vs-td>
                                <vs-td :data="servico.codigo">
                                    <span class="destaque">{{ servico.codigo }}</span>
                                </vs-td>
                                <vs-td>
                                    <p class="mb-1 mt-2 mt-sm-0 font-weight-bold text-dark" v-if="item.config_padrao">
                                        <a v-if="servico.codigo === item.config_padrao.servico" class="text-dark"><span
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
                <vx-card :key="config.id" class="mb-10" v-for="(config, index) in item.configs"
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
                    <vs-button color="primary" type="filled" icon-pack="material-icons" icon="control_point"
                               class="font-bold" @click="showAdicionarExcecao">Adicionar Exceção
                    </vs-button>
                </div>
                <div class="mt-20">
                    <vs-divider></vs-divider>
                </div>
            </div>
        </div>

        <!--
            <transition name="fade">
              <footer-doug >
                <div class="vx-col sm:w-11/12 mb-2">
                  <div class="container">
                    <div class="vx-row mb-2 relative">
                      <vs-button class="mr-3" color="primary" type="filled" @click="updateEmpresa" v-if="item.id">Salvar</vs-button>
                      <vs-button class="mr-3" color="primary" type="filled" @click="salvarEmpresa" v-else>Salvar</vs-button>
                      <vs-button class="mr-3" color="dark" type="flat" icon-pack="feather" icon="x-circle"  @click="$router.push({name: 'contratos'})">Cancelar</vs-button>
                    </div>
                  </div>
                </div>
              </footer-doug>
            </transition>-->
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
                              :options="optionBrindes" v-validate="'required'" name="variavel"/>
                </div>
                <div class="">
                    <span class="font-regular mb-2">Serviço</span>
                    <v-select v-model="val.servico" class="mt-4 mb-2" :class="'select-large-base'" :clearable="false"
                              :options="optionServicos" v-validate="'required'" name="variavel"/>
                </div>
            </div>
        </vs-prompt>
    </div>

</template>

<script>
import moduleContrato from '@/store/contratos/moduleContrato.js';
import moduleBrindes from '@/store/brindes/moduleBrindes.js'

// register custom messages
import {Validator} from 'vee-validate';
import vSelect from 'vue-select'

const dict = {
    custom: {
        razao_social: {
            required: 'Por favor, insira a razão social',
        },
        cnpj: {
            required: 'Por favor, insira o cnpj',
        },
        email: {
            required: 'Por favor, insira o email comercial',
            email: 'O email informado está com formato inválido'
        },
        site: {
            required: 'Por favor, insira o website da empresa',
        },
        descricao: {
            max: 'O limite máximo da descrição foi atingido',
        },
        rodape: {
            max: 'O limite máximo do rodapé foi atingido',
        }
    }
};
Validator.localize('pt-br', dict);
export default {
    components: {
        'v-select': vSelect,
    },
    data: () => ({
        name: "DadosEmpresa",
        item: {
            nome: '',
            cartaoPostagem: '',
            contrato: '',
            usuario: '',
            senha: '',
            remetenteNome: '',
            remetenteCep: '',
            remetenteCidade: '',
            remetenteEndereco: '',
            remetenteBairro: '',
            remetenteEstado: '',
            remetenteNumero: '',
            remetenteComplemento: '',
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
        opcoesServico: [
            {id: '', label: "Selecione um estado"},
            {id: "AC", label: "Acre"},
            {id: "AL", label: "Alagoas"},
        ],
        opcoesVariavel: [],
        brindes: {},
        empresaOld: {},
        files: [],
        images: [],
        isDragging: false,
        error: 0,
        configExclud: null,
        edited: false,
        counterDanger: false,
        salvando: false,
        modalexcecao: false,
        val: {
            tipo: '',
            variavel: '',
            servico: '',
        },
    }),
    created() {
        if (!moduleBrindes.isRegistered) {
            this.$store.registerModule('brindes', moduleBrindes);
            moduleBrindes.isRegistered = true;
        }
        this.getBrindes();
        if (!moduleContrato.isRegistered) {
            this.$store.registerModule('contratos', moduleContrato)
            moduleContrato.isRegistered = true
        }
        this.getContrato(this.$route.params.id);
    },
    computed: {
        empresaDb() {
            return this.$store.state.empresa.empresa;
        },
        optionBrindes() {
            let option = [];
            if (this.brindes && this.brindes.length > 0) {
                this.brindes.forEach(item => {
                    option.push({id: item.id, label: item.nome});
                })
            }
            return option;
        },
        optionServicos() {
            let option = [];
            if (this.item.servicos && this.item.servicos.length > 0) {
                this.item.servicos.forEach(item => {
                    option.push({id: item.codigo, label: item.descricao});
                })
            }
            return option;
        },
        validExcecao() {
            let igual = false;
            console.log('computed', this.val)
            if (this.val.tipo !== "" && this.val.variavel !== "" && this.val.servico !== "") {
                console.log('computed entrou', this.val)
                igual = true
            }
            return igual
        }
    },
    mounted() {
        this.verifica();
    },
    watch: {
        currentx(val) {
            this.$vs.loading();
            console.log('val', val);
            this.dados.page = this.currentx;
            this.getContas();
        },
        "$route"() {
            this.routeTitle = this.$route.meta.pageTitle
        },
        produto: {
            handler(val) {
                console.log('mudou');
                if (val) {
                    console.log('watch', val);
                }
            },
            deep: true
        },
        val: {
            handler(val) {
                console.log('selecionado', val)
            },
        }
    },
    methods: {
        getBrindes() {
            this.$store.dispatch('getVarios', {rota: 'brindes'}).then(response => {
                console.log('retornado com sucesso', response)
                this.brindes = response;
                console.log('brindes', this.brindes);
                //this.dados.page = this.pagination.current_page
            });
        },
        acceptAlert() {

            this.$vs.notify({
                color: 'success',
                title: 'Accept Selected',
                text: 'Lorem ipsum dolor sit amet, consectetur'
            })
        },
        close() {
            this.$vs.notify({
                color: 'danger',
                title: 'Closed',
                text: 'You close a dialog!'
            })
        },
        clearValMultiple() {
            this.val.tipo = "";
            this.val.variavel = "";
            this.val.servico = "";
        },
        initVal() {
            this.val.id = '';
            this.val.tipo = '';
            this.val.variavel = '';
            this.val.servico = '';
        },
        showAdicionarExcecao() {
            this.initVal();
            //this.itemedit = JSON.parse(JSON.stringify(this.item));
            this.modalexcecao = true;
        },
        showRemoverExcecao(item) {
            this.configExclud = item;
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Deletar exceção`,
                text: 'Você realmente gostaria de deletar essa exceção desse contrato?',
                acceptText: 'Deletar',
                cancelText: 'Cancelar',
                accept: this.deleteExcexao,
            })
        },
        showEditarExcecao(item) {
            console.log('servico', item);
            this.val.id = item.id;
            let val = JSON.parse(JSON.stringify(item));
            let nome = this.selectedtipo(val.tipo);
            let estado = this.selectedEstado(val.variavel);
            let brinde = this.selectedBrinde(val.variavel);
            console.log('capiturado', estado);
            this.val.tipo = {id: val.tipo, label: nome};
            if (val.tipo == 'estado') {
                this.val.variavel = {value: val.variavel, text: estado};
            } else {
                this.val.variavel = {id: val.variavel, label: brinde};
            }
            this.val.servico = {id: val.servico, label: this.servicoconfig(val.servico)};
            this.modalexcecao = true;
        },
        servicoconfig(servico) {
            let serv = false;
            this.item.servicos.forEach(item => {
                if (item.codigo == servico) {
                    console.log(item.descricao);
                    serv = item.descricao;
                }
            });
            if (serv) {
                return serv;
            } else {
                return 'Serviço não encontrado'
            }
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
                    console.log('retorno', item.text)
                    item2 = item.text;
                }
            });
            return item2;
        },
        selectedBrinde(brinde) {
            let item2 = '';
            this.brindes.forEach(item => {
                console.log('retorno brinde', item)
                if (item.id == brinde) {
                    console.log('retorno', item.nome)
                    item2 = item.nome;
                }
            });
            return item2;
        },
        successUpload(event) {
            console.log('evento sucesso', event);

            this.$vs.notify({
                color: 'success',
                title: 'Upload Success',
                text: 'Lorem ipsum dolor sit amet, consectetur'
            })
        },
        errorUpload(event) {
            console.log('evento error', event);
            this.$vs.notify({
                color: 'success',
                title: 'Upload Success',
                text: 'Lorem ipsum dolor sit amet, consectetur'
            })
        },
        verifica() {
            console.log('funcao de verificacao')
        },
        getContrato(id) {
            this.$vs.loading()
            this.$store.dispatch('contratos/getId', id).then(data => {
                this.item = {...data};
                console.log('item', this.item)
            }).catch(erro => {
                console.log('erro', erro.response);
                this.$vs.notify({
                    text: error.response.data.message,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
            }).finally(() => this.$vs.loading.close());
        },
        correiosLogar() {
            this.$vs.loading();
            console.log('chama etiquetas');
            this.$store.dispatch('contratos/logar', this.item)
                .then(() => {
                    console.log('login contrato')
                    this.$vs.notify({color: 'success', title: 'Sucesso!', text: 'Login realizado com sucesso'})
                })
                .catch(() => {
                    this.$vs.notify({
                        title: 'Falha',
                        text: 'Não foi possível realizar o login com os dados acima.',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                }).finally(() => {
                this.salvando = false;
                this.$vs.loading.close();
            });
        },
        openLoadingInDiv() {
            this.$vs.loading({
                container: '#div-with-loading',
                scale: 0.6
            })
        },
        correiosservicos() {
            this.$vs.loading({
                container: '#div-servicos',
                scale: 0.6
            });
            this.$store.dispatch('contratos/servicos', this.item)
                .then(() => {
                    console.log('login contrato')
                    this.$vs.loading.close('#div-servicos > .con-vs-loading');
                    this.$vs.notify({color: 'success', title: 'Sucesso!', text: 'Dados alterados com sucesso'})
                })
                .catch(error => {
                    this.$vs.loading.close('#div-servicos > .con-vs-loading');
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Não foi possível capturar servicos desse contrato, por favor verifique os dados de acesso.',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                }).finally(() => {
                this.salvando = false;
            });
        },
        verificaExcecao(obj) {
            return new Promise((resolve, reject) => {
                console.log('configs novas', obj)
                let encontrado = false;
                this.item.configs.forEach(item => {
                    if (item.tipo == obj.tipo && item.variavel == obj.variavel) {
                        encontrado = true;
                    }
                });
                resolve(encontrado)
            });
        },
        sendexcecao() {
            let obj = {};
            obj.tipo = this.val.tipo.id;
            if (this.val.tipo.id == 'estado') {
                obj.variavel = this.val.variavel.value;
            } else {
                obj.variavel = this.val.variavel.id;
            }
            obj.servico = this.val.servico.id;
            obj.correio_id = this.item.id;

            this.verificaExcecao(obj).then(response => {
                if (response) {//encontrado igual
                    this.$vs.notify({
                        title: '',
                        text: 'Já existe uma exceção cadastrada com este tipo e variável.',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger',
                        time: 5000
                    })
                } else {
                    this.$vs.loading({
                        container: '#div-excecao',
                        scale: 0.6
                    });
                    if (this.val.id > 0) {
                        obj.id = this.val.id;
                        this.$store.dispatch('contratos/editexcecao', obj)
                            .then(() => {
                                console.log('add excecao');
                                this.getContrato(this.item.id);
                                this.$vs.loading.close('#div-excecao > .con-vs-loading');
                                this.$vs.notify({
                                    color: 'success',
                                    title: 'Sucesso!',
                                    text: 'Exceção adicionada com sucesso'
                                })
                            })
                            .catch(error => {
                                this.$vs.loading.close('#div-excecao > .con-vs-loading');
                                this.$vs.notify({
                                    title: 'Error',
                                    text: error.response.data.message,
                                    iconPack: 'feather',
                                    icon: 'icon-alert-circle',
                                    color: 'danger'
                                })
                            }).finally(() => {
                            this.salvando = false;
                        });
                    } else {
                        this.$store.dispatch('contratos/addexcecao', obj)
                            .then(() => {
                                console.log('editar excecao');
                                this.getContrato(this.item.id);
                                this.$vs.loading.close('#div-excecao > .con-vs-loading');
                                this.$vs.notify({
                                    color: 'success',
                                    title: 'Sucesso!',
                                    text: 'Exceção alterada com sucesso'
                                })
                            })
                            .catch(error => {
                                this.$vs.loading.close('#div-excecao > .con-vs-loading');
                                this.$vs.notify({
                                    title: 'Error',
                                    text: error.response.data.message,
                                    iconPack: 'feather',
                                    icon: 'icon-alert-circle',
                                    color: 'danger'
                                })
                            }).finally(() => {
                            this.salvando = false;
                        });
                    }
                }
            });

        },
        setPadrao(item) {
            this.$vs.loading({
                container: '#div-servicos',
                scale: 0.6
            });
            let obj = {};
            obj.tipo = 'padrao';
            obj.variavel = 'padrao';
            obj.servico = item.codigo;
            obj.correio_id = this.item.id;
            this.$store.dispatch('contratos/addexcecao', obj)
                .then(() => {
                    console.log('editar excecao');
                    this.item.config_padrao.servico = item.codigo
                    //this.getContrato(this.item.id);
                    this.$vs.loading.close('#div-servicos > .con-vs-loading');
                    this.$vs.notify({color: 'success', title: 'Sucesso!', text: 'Exceção alterada com sucesso'});
                })
                .catch(error => {
                    this.$vs.loading.close('#div-servicos > .con-vs-loading');
                    this.$vs.notify({
                        title: 'Error',
                        text: error.response.data.message,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                }).finally(() => {
                this.salvando = false;
            });
        },
        deleteExcexao() {
            this.$vs.loading({
                container: '#div-excecao',
                scale: 0.6
            });
            this.$store.dispatch('contratos/removeexcecao', this.configExclud)
                .then(() => {
                    console.log('remover excecao');
                    this.getContrato(this.item.id);
                    this.$vs.loading.close('#div-excecao > .con-vs-loading');
                    this.$vs.notify({color: 'success', title: 'Sucesso!', text: 'Exceção deleta com sucesso'})
                })
                .catch(error => {
                    this.$vs.loading.close('#div-excecao > .con-vs-loading');
                    this.$vs.notify({
                        title: 'Error',
                        text: error.response.data.message,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                }).finally(() => {
                this.salvando = false;
            });

        },
        updateEmpresa() {
            this.salvando = true;
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.$vs.loading();
                    const formData = new FormData();
                    this.files.forEach(file => {
                        formData.append('logotipo', file, file.name);
                    });
                    formData.append('_method', 'PUT');
                    formData.append('nome', this.item.nome);
                    formData.append('cartaoPostagem', this.item.cartaoPostagem);
                    formData.append('contrato', this.item.contrato);
                    formData.append('usuario', this.item.usuario);
                    formData.append('senha', this.item.senha);
                    formData.append('cnpj', this.item.cnpj);
                    formData.append('remetenteNome', this.item.remetenteNome);
                    formData.append('remetenteCep', this.item.remetenteCep);
                    formData.append('remetenteCidade', this.item.remetenteCidade);
                    formData.append('remetenteEndereco', this.item.remetenteEndereco);
                    formData.append('remetenteBairro', this.item.remetenteBairro);
                    formData.append('remetenteEstado', this.item.remetenteEstado);
                    formData.append('remetenteNumero', this.item.remetenteNumero);
                    formData.append('remetenteComplemento', this.item.remetenteComplemento);

                    this.$store.dispatch('contratos/update', {id: this.item.id, dados: formData}).then(() => {
                        console.log('enviou')
                        this.$vs.notify({
                            color: 'success',
                            title: 'Sucesso!',
                            text: 'Dados alterados com sucesso'
                        })
                    }).catch(error => {
                        this.$vs.notify({
                            title: 'Error',
                            text: error.response.data.message,
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    }).finally(() => {
                        this.salvando = false;
                        this.$vs.loading.close();
                    })
                } else {
                    this.$vs.notify({
                        title: 'Error',
                        text: 'verifique os erros específicos',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                }
            })
            this.salvando = false;
        },
        salvarEmpresa() {
            this.salvando = true;
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.$vs.loading();
                    const formData = new FormData();
                    this.files.forEach(file => {
                        formData.append('logotipo', file, file.name);
                    });
                    formData.append('nome', this.item.nome);
                    formData.append('cartaoPostagem', this.item.cartaoPostagem);
                    formData.append('contrato', this.item.contrato);
                    formData.append('usuario', this.item.usuario);
                    formData.append('senha', this.item.senha);
                    formData.append('cnpj', this.item.cnpj);
                    formData.append('remetenteNome', this.item.remetenteNome);
                    formData.append('remetenteCep', this.item.remetenteCep);
                    formData.append('remetenteCidade', this.item.remetenteCidade);
                    formData.append('remetenteEndereco', this.item.remetenteEndereco);
                    formData.append('remetenteBairro', this.item.remetenteBairro);
                    formData.append('remetenteEstado', this.item.remetenteEstado);
                    formData.append('remetenteNumero', this.item.remetenteNumero);
                    formData.append('remetenteComplemento', this.item.remetenteComplemento);

                    this.$store.dispatch('contratos/store', formData)
                        .then(() => {
                            console.log('enviou')
                            this.$vs.loading.close();
                            this.$vs.notify({
                                color: 'success',
                                title: 'Sucesso!',
                                text: 'Dados alterados com sucesso'
                            })
                            this.$router.push({name: 'contratos'})
                        })
                        .catch(error => {
                            this.$vs.loading.close();
                            this.$vs.notify({
                                title: 'Error',
                                text: error.response.data.message,
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'danger'
                            })
                        }).finally(() => {
                        this.salvando = false;
                    })
                } else {
                    this.$vs.notify({
                        title: 'Error',
                        text: 'verifique os erros específicos',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                }
            })
            this.salvando = false;
        },
        //drag
        OnDragEnter(e) {
            e.preventDefault();
            this.dragCount++;
            this.isDragging = true;
            return false;
        },
        OnDragLeave(e) {
            e.preventDefault();
            this.dragCount--;
            if (this.dragCount <= 0)
                this.isDragging = false;
        },
        onInputChange(e) {
            const files = e.target.files;
            Array.from(files).forEach(file => this.addImage(file));
        },
        onDrop(e) {
            e.preventDefault();
            e.stopPropagation();
            this.isDragging = false;
            const files = e.dataTransfer.files;
            Array.from(files).forEach(file => this.addImage(file));
        },
        addImage(file) {
            this.files.pop();
            if (!file.type.match('image.*')) {
                this.$toastr.e(`${file.name} is not an image`);
                return;
            }
            this.files.push(file);
            this.item.logotipo = file;
            const img = new Image(),
                reader = new FileReader();
            this.images.pop();
            reader.onload = (e) => this.images.push(e.target.result);
            reader.readAsDataURL(file);
        },
        getFileSize(size) {
            const fSExt = ['Bytes', 'KB', 'MB', 'GB'];
            let i = 0;

            while (size > 900) {
                size /= 1024;
                i++;
            }
            return `${(Math.round(size * 100) / 100)} ${fSExt[i]}`;
        },
    }
}
</script>

<style scoped>
.con-vs-dialog .vs-dialog {
    -webkit-transition: all .2s;
    transition: all .2s;
    z-index: 100;
    width: calc(100% - 20px);
    margin: 10px;
    max-width: 800px !important;
    border-radius: 6px;
    -webkit-box-shadow: 0 5px 20px 0 rgba(0, 0, 0, .1);
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, .1);
    background: #fff;
    -webkit-animation: rebound .3s;
    animation: rebound .3s;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
    opacity: 0;
}

.con-input-upload.disabled-upload {
    display: none;
}

.con-img-upload {
    width: 100%;
    background: unset;
    margin-top: 5px;
    padding-right: 5px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-column-gap: 5px;
    -moz-column-gap: 5px;
    column-gap: 5px;
}

.con-input-upload {
    background: #ffffff;
    width: 300px;
    height: 300px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 8px;
    position: relative;
    -webkit-transition: all .25s ease;
    transition: all .25s ease;
    border: 1px dashed rgba(0, 0, 0, .1);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    margin: 0px;
}

.con-img-upload .img-upload {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    background: rgba(0, 80, 0, .5);
    background: #fff;
    -webkit-box-shadow: 0 5px 20px 0 rgba(0, 0, 0, .1);
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, .1);
    -webkit-transition: all .3s ease;
    transition: all .3s ease;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    width: 300px;
    height: 300px;
    margin: 5px;
}

.vs-con-textarea {
    background: white;
    width: 100%;
    position: relative;
    border: 1px solid rgba(0, 0, 0, .08);
    -webkit-box-shadow: 0 0 0 0 transparent;
    box-shadow: 0 0 0 0 transparent;
    border-radius: 6px;
    -webkit-transition: boxShadow .25s ease, border .25s ease, -webkit-transform .25s ease;
    transition: boxShadow .25s ease, border .25s ease, -webkit-transform .25s ease;
    transition: boxShadow .25s ease, border .25s ease, transform .25s ease;
    transition: boxShadow .25s ease, border .25s ease, transform .25s ease, -webkit-transform .25s ease;
    -webkit-transform: translate(0);
    transform: translate(0);
    margin-bottom: 16px;
}
</style>
<style lang="scss" scoped>
.botaofechar {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 5px;
}

.text-enum {
    height: 3rem;
    width: 3rem;
    font-size: 2rem;
    line-height: 26px;
    display: inline-block;
    text-align: center;
    margin-right: 6px;
}

.text-ou {
    position: absolute;
    left: calc(50% - 127px / 2);
    top: -19px;
    width: 127px;
    height: 34px;
}

.uploader {
    width: 100%;
    background: #fff;
    color: #0c0808;
    padding: 40px 15px;
    text-align: center;
    border-radius: 10px;
    border: 3px dashed #fff;
    font-size: 20px;
    position: relative;

    &.dragging {
        background: #fff;
        color: #2196F3;
        border: 3px dashed #e7e7e7;

        .file-input label {
            background: #f0f2f4;
            color: #fff;
        }
    }

    i {
        font-size: 85px;
    }

    .file-input {
        width: 200px;
        margin: auto;
        height: 68px;
        position: relative;

        label,
        input {
            background: #f1f5f7;
            color: #0c0808;
            width: 100%;
            position: absolute;
            left: 0;
            top: 0;
            font-size: 18px;
            padding: 10px;
            border-radius: 4px;
            margin-top: 7px;
        }

        input {
            opacity: 0;
            z-index: -2;
        }
    }

    .images-preview {
        display: flex;
        flex-wrap: wrap;

        .img-wrapper {
            width: auto;
            display: flex;
            /*/flex-direction: column;*/
            margin: 10px;

            justify-content: space-between;
            background: #fff0;
            //box-shadow: 5px 5px 20px #3e3737;
            img {
                max-height: 200px;
                max-width: 200px;
                width: 100%;
            }
        }

        .details {
            font-size: 12px;
            background: #fff;
            color: #000;
            display: flex;
            flex-direction: column;
            padding: 3px 6px;

            .name {
                overflow: hidden;
                height: 18px;
            }
        }
    }

    .upload-control {
        button, label {
            background: #7e57c2;
            border: 2px solid #7e57c2;
            border-radius: 3px;
            color: #fff;
            font-size: 15px;

        }

        label {
            padding: 2px 5px;
        }
    }

}
</style>
