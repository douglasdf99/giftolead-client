<template>
    <div>
        <!--<div class="vx-row">
            <div class="vx-col w-full float-right">
                <span class="float-right mt-1 mx-4" style="font-weight: bold">
                    {{item.status ? 'Ativado' : 'Desativado'}}
                </span>
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="item.status" class="float-right switch"/>
            </div>
        </div>-->
        <h4 class="font-bold mb-10">Dados do contrato
        </h4>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-2/3 w-full mb-2">
                <div class="vx-row mb-6">
                    <div class="vx-col w-full mb-2">
                        <span class="font-regular mb-2">Nome de Contrato</span>
                        <input class="vs-inputx vs-input--input large hasValue" size="large" v-validate="'required'"
                               name="nome" v-model="item.nome" type="text"/>
                        <span class="text-danger text-sm"
                              v-show="errors.has('nome')">{{ errors.first('nome') }}</span>
                    </div>
                </div>
                <div class="vx-row mb-6">
                    <div class="vx-col sm:w-1/2 w-full mb-2">
                        <span class="font-regular mb-2">Cartão de postagem</span>
                        <vs-input class="w-full" v-validate="'required'" name="cartaoPostagem"
                                  v-model="item.cartaoPostagem" size="large"/>
                        <span class="text-danger text-sm" v-show="errors.has('cartaoPostagem')">{{ errors.first('cartaoPostagem') }}</span>
                    </div>
                    <div class="vx-col sm:w-1/2 w-full mb-2">
                        <span class="font-regular mb-2">Número do contrato</span>
                        <vs-input class="w-full" v-validate="'required'" name="contrato" v-model="item.contrato" size="large"/>
                        <span class="text-danger text-sm" v-show="errors.has('contrato')">{{ errors.first('contrato') }}</span>

                    </div>
                </div>
                <div class="vx-row mb-6">
                    <div class="vx-col sm:w-1/2 w-full mb-2">
                        <span class="font-regular mb-2">Usuário SIGEP WEB</span>
                        <vs-input class="w-full" v-validate="'required'" name="usuario" v-model="item.usuario" size="large"/>
                        <span class="text-danger text-sm" v-show="errors.has('usuario')">{{ errors.first('usuario') }}</span>
                    </div>
                    <div class="vx-col sm:w-1/2 w-full mb-2">
                        <span class="font-regular mb-2">Senha SIGEP WEB</span>
                        <vs-input class="w-full" v-validate="'required'" name="senha" v-model="item.senha" size="large"/>
                        <span class="text-danger text-sm" v-show="errors.has('senha')">{{ errors.first('senha') }}</span>
                    </div>
                </div>
                <div class="vx-col w-full mb-2 d-inline-flex font-bold" style="display: flex">
                    <u class="py-2"><span class="font-14 text-primary font-bold ml-2 mr-2">Logar no sistema do correios </span></u>
                    <vs-button radius color="dark" type="border" icon-pack="material-icons" icon="vpn_key" @click="correiosLogar"></vs-button>
                </div>
            </div>
            <div class="vx-col sm:w-1/3 w-full mb-2">
                <div class="mb-6 p-5 pt-0">
                    <span class="font-regular mb-3 ml-2">Logotipo da etiqueta</span>
                    <div style="width: 100%; margin-top: 4px;" class="cursor-pointer" @dragenter="OnDragEnter"
                         @dragleave="OnDragLeave"
                         @dragover.prevent
                         @drop="onDrop"
                         :class="{ dragging: isDragging }">
                        <vx-card class="grid-view-item mb-base overflow-hidden" v-if="item.logotipo && !images.length">
                            <template slot="no-body">
                                <!-- ITEM IMAGE -->
                                <div class="item-img-container bg-white h-64 flex items-center justify-center mb-4 cursor-pointer">
                                    <img :src="get_img_api(item.logotipo)" style="width: 200px" alt="logotipo" class="grid-view-img px-4">
                                </div>
                                <div class="item-details px-4">
                                </div>
                                <div class="flex flex-wrap">
                                    <label
                                            class="item-view-secondary-action-btn bg-primary p-3 flex flex-grow items-center justify-center text-white cursor-pointer"
                                            for="file">
                                        <feather-icon icon="ShoppingBagIcon" svgClasses="h-4 w-4"/>
                                        <label class="text-sm font-semibold ml-2" for="file">Alterar Logotipo</label>
                                    </label>
                                </div>
                            </template>
                        </vx-card>
                        <vx-card class="grid-view-item mb-base overflow-hidden" v-show="images.length">
                            <template slot="no-body">
                                <!-- ITEM IMAGE -->
                                <div class="item-img-container bg-white h-64 flex items-center justify-center mb-4 "
                                     v-for="(image, index) in images" :key="index">
                                    <img :src="image" style="height: 100%" alt="logotipo" class="grid-view-img px-4">
                                </div>
                                <div class="item-details px-4">
                                </div>
                                <div class="flex flex-wrap">
                                    <label
                                            class="item-view-secondary-action-btn bg-primary p-3 flex flex-grow items-center justify-center text-white cursor-pointer"
                                            for="file">
                                        <feather-icon icon="ShoppingBagIcon" svgClasses="h-4 w-4"/>
                                        <label class="text-sm font-semibold ml-2" for="file">Alterar Logotipo</label>
                                    </label>
                                </div>
                            </template>
                        </vx-card>
                        <div class="uploader" v-show="!item.logotipo">
                            <div v-show="!images.length">
                                <label for="file">
                                    <i class="fa fa-cloud-upload"></i>
                                    <img :src="get_img_api('images/upload.png')">
                                    <p class="text-lg mt-6">Arraste e solte ou clique aqui</p>
                                    <div class="file-input">
                                        <input type="file" id="file" @change="onInputChange">
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <vs-divider></vs-divider>
        </div>

        <div class="vx-row mb-6">
            <div class="vx-col w-full mb-2">
                <div class="vx-row mb-6">
                    <div class="vx-col lg:w-1/3 w-full mb-2">
                        <span class="font-regular mb-2">Nome do remetente</span>
                        <vs-input class="w-full" v-validate="'required'" name="remetenteNome"
                                  v-model="item.remetenteNome" size="large"/>
                        <span class="text-danger text-sm" v-show="errors.has('remetenteNome')">{{ errors.first('remetenteNome') }}</span>
                    </div>
                    <div class="vx-col lg:w-1/3 w-full mb-2">
                        <span class="font-regular mb-2">Telefone</span>
                        <vs-input class="w-full" v-validate="'required'" name="telefone" v-model="item.telefone" size="large" v-mask="'(##) #####-####'"/>
                        <span class="text-danger text-sm" v-show="errors.has('telefone')">{{ errors.first('telefone') }}</span>
                    </div>
                    <div class="vx-col lg:w-1/3 w-full mb-2">
                        <span class="font-regular mb-2">CEP</span>
                        <vs-input class="w-full" v-validate="'required'" name="remetenteCep" v-mask="'#####-###'" v-model="item.remetenteCep" size="large" @blur="buscaCep"/>
                        <span class="text-danger text-sm" v-show="errors.has('remetenteCep')">{{ errors.first('remetenteCep') }}</span>
                    </div>
                </div>
                <div class="vx-row mb-6">
                    <div class="vx-col lg:w-3/12 w-full mb-2">
                        <span class="font-regular mb-2">Estado/Unidade Federativa</span>
                        <vs-input class="w-full" v-validate="'required'" name="remetenteEstado" v-model="item.remetenteEstado" size="large" :disabled="true"/>
                        <span class="text-danger text-sm" v-show="errors.has('remetenteEstado')">{{ errors.first('remetenteEstado') }}</span>
                    </div>
                    <div class="vx-col lg:w-3/12 w-full mb-2">
                        <span class="font-regular mb-2">Cidade</span>
                        <vs-input class="w-full" v-validate="'required'" name="remetenteCidade" v-model="item.remetenteCidade" size="large" :disabled="true"/>
                        <span class="text-danger text-sm" v-show="errors.has('remetenteCidade')">{{ errors.first('remetenteCidade') }}</span>
                    </div>
                    <div class="vx-col lg:w-6/12 w-full mb-2">
                        <span class="font-regular mb-2">Endereço</span>
                        <vs-input class="w-full" v-validate="'required'" name="remetenteEndereco"
                                  v-model="item.remetenteEndereco" size="large" :disabled="true"/>
                        <span class="text-danger text-sm" v-show="errors.has('remetenteEndereco')">{{ errors.first('remetenteEndereco') }}</span>
                    </div>
                </div>
                <div class="vx-row mb-20">
                    <div class="vx-col lg:w-1/3 w-full mb-2">
                        <span class="font-regular mb-2">Bairro</span>
                        <vs-input class="w-full" v-validate="'required'" name="remetenteBairro" v-model="item.remetenteBairro" size="large" :disabled="true"/>
                        <span class="text-danger text-sm" v-show="errors.has('remetenteBairro')">{{ errors.first('remetenteBairro') }}</span>
                    </div>
                    <div class="vx-col lg:w-3/12 w-full mb-2">
                        <span class="font-regular mb-2">Número</span>
                        <vs-input class="w-full" v-validate="'required'" name="remetenteNumero" v-model="item.remetenteNumero" size="large"/>
                        <span class="text-danger text-sm" v-show="errors.has('remetenteNumero')">{{ errors.first('remetenteNumero') }}</span>
                    </div>
                    <div class="vx-col lg:w-5/12 w-full mb-2">
                        <span class="font-regular mb-2">Complemento</span>
                        <vs-input class="w-full" v-validate="'required'" name="remetenteComplemento"
                                  v-model="item.remetenteComplemento" size="large"/>
                        <span class="text-danger text-sm" v-show="errors.has('remetenteComplemento')">{{ errors.first('remetenteComplemento') }}</span>
                    </div>
                </div>
            </div>
        </div>

        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <div class="container">
                        <div class="vx-row mb-2 relative">
                            <vs-button class="mr-3" color="primary" type="filled" @click="updateEmpresa" v-if="item.id">Salvar</vs-button>
                            <vs-button class="mr-3" color="primary" type="filled" @click="salvarEmpresa" v-else>Salvar</vs-button>
                            <vs-button icon-pack="material-icons" icon="directions_bus" class="mr-3" color="dark" type="flat" @click="configurar" v-if="item.id">Configurar formas de frete</vs-button>
                            <vs-button class="mr-3" color="dark" type="flat" icon-pack="feather" icon="x-circle" @click="$router.push({name: 'contratos'})">Cancelar</vs-button>
                        </div>
                    </div>
                </div>
            </footer-doug>
        </transition>
        <vs-prompt
                @cancel="clearValMultiple"
                @accept="sendexcecao"
                @close="close"
                :title="'Adicionar exceção'"
                :max-width="'600px'"
                :active.sync="modalexcecao">
            <div class="con-exemple-prompt">
                Entre com os dados da configuração...
                <div class="">
                    <span class="font-regular mb-2">Tipo</span>
                    <v-select v-model="val.tipo" class="mt-4 mb-2" :class="'select-large-base'" :clearable="false"
                              :options="opcoesTipo" v-validate="'required'" name="tipo"/>
                </div>
                <div class="">
                    <span class="font-regular mb-2">Variavel</span>
                    <v-select v-model="val.variavel" class="mt-4 mb-2" label="text" v-if="val.tipo.id == 'estado'" :class="'select-large-base'" :clearable="false"
                              :options="estados" v-validate="'required'" name="variavel"/>
                    <v-select v-model="val.variavel" class="mt-4 mb-2" v-else :class="'select-large-base'" :clearable="false"
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
    const {consultarCep} = require("correios-brasil");

    const dict = {
        custom: {
            razao_social: {
                required: 'Por favor, insira a razão social',
            },
            cartaoPostagem: {
                required: 'Por favor, insira o cartão de postagem',
            },
            contrato: {
                required: 'Por favor, insira o contrato',
                email: 'O email informado está com formato inválido'
            },
            usuario: {
                required: 'Por favor, insira o usuario',
            },
            senha: {
                required: 'Por favor, insira o senha',
            },
            remetenteNome: {
                required: 'Por favor, insira o Nome do remetente',
            },
            remetenteCep: {
                required: 'Por favor, insira o CEP',
            },
            remetenteCidade: {
                required: 'Por favor, insira o Cidade',
            },
            remetenteEndereco: {
                required: 'Por favor, insira o Endereço',
            },
            remetenteBairro: {
                required: 'Por favor, insira o Bairro',
            },
            remetenteEstado: {
                required: 'Por favor, insira o Unidade Federativa',
            },
            remetenteNumero: {
                required: 'Por favor, insira o Número',
            },
            remetenteComplemento: {
                required: 'Por favor, insira o Complemento',
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
                status: true,
                telefone : '',
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
            valido: false,
            antigoCep: '',
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
            if (this.$route.name === 'contratos-editar') {
                this.getContrato(this.$route.params.id);
            }
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
        },
        methods: {
          buscaCep() {

            if (this.valido) {
              console.log('teste')
            } else {
              this.remetenteComplemento = '';
              this.remetenteNumero = '';
              consultarCep(this.item.remetenteCep).then(response => {
                console.log('resposta', response);
                this.valido = true;
                this.antigoCep = this.item.remetenteCep;
                this.item.remetenteCidade = this.removeAccents(response.localidade);
                this.item.remetenteBairro = this.removeAccents(response.bairro);
                this.item.remetenteEndereco = this.removeAccents(response.logradouro);
                this.item.remetenteEstado = this.removeAccents(response.uf);
                this.$vs.notify({
                  title: '',
                  color: 'success',
                  text: 'CEP encontrado e informações preenchidas'
                })
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
            configurar() {
                this.$router.push({path: '/configuracoes/contratos/servicos/' + this.item.id});
            },
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

                this.$vs.notify({color: 'success', title: 'Upload Success', text: 'Lorem ipsum dolor sit amet, consectetur'})
            },
            errorUpload(event) {
                console.log('evento error', event);
                this.$vs.notify({color: 'success', title: 'Upload Success', text: 'Lorem ipsum dolor sit amet, consectetur'})
            },
            verifica() {
                console.log('funcao de verificacao')
            },
            getContrato(id) {
                this.$vs.loading()
                this.$store.dispatch('contratos/getId', id).then(data => {
                    this.item = {...data};
                    console.log(this.item)
                    this.$vs.loading.close();
                })
            },
            correiosLogar() {
              if (!this.item.usuario || !this.item.senha){
                this.$vs.notify({
                  title: 'Falha',
                  text: 'Para realizar o login é nescessário preencher todos os dados do contrato.',
                  iconPack: 'feather',
                  icon: 'icon-alert-circle',
                  color: 'danger'
                })
              }else{
                this.$vs.loading();
                console.log('chama etiquetas');
                this.$store.dispatch('contratos/logarind', this.item)
                  .then(() => {
                    console.log('login contrato')
                    this.$vs.loading.close();
                    this.$vs.notify({color: 'success', title: 'Sucesso!', text: 'Login realizado com sucesso'})
                  })
                  .catch(() => {
                    this.$vs.loading.close();
                    this.$vs.notify({
                      title: 'Falha',
                      text: 'Não foi possível realizar o login com os dados acima.',
                      iconPack: 'feather',
                      icon: 'icon-alert-circle',
                      color: 'danger'
                    })
                  }).finally(() => {
                  this.salvando = false;
                });
              }


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
                            text: error.message,
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    }).finally(() => {
                    this.salvando = false;
                });
            },
            sendexcecao() {
                this.$vs.loading({
                    container: '#div-excecao',
                    scale: 0.6
                });
                let obj = {};
                obj.tipo = this.val.tipo.id;
                if (this.val.tipo.id == 'estado') {
                    obj.variavel = this.val.variavel.value;
                } else {
                    obj.variavel = this.val.variavel.id;
                }
                obj.servico = this.val.servico.id;
                obj.correio_id = this.item.id;
                if (this.val.id > 0) {
                    obj.id = this.val.id;
                    this.$store.dispatch('contratos/editexcecao', obj)
                        .then(() => {
                            console.log('add excecao');
                            this.getContrato(this.item.id);
                            this.$vs.loading.close('#div-excecao > .con-vs-loading');
                            this.$vs.notify({color: 'success', title: 'Sucesso!', text: 'Exceção adicionada com sucesso'})
                        })
                        .catch(error => {
                            this.$vs.loading.close('#div-excecao > .con-vs-loading');
                            this.$vs.notify({
                                title: 'Error',
                                text: error.message,
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
                            this.$vs.notify({color: 'success', title: 'Sucesso!', text: 'Exceção alterada com sucesso'})
                        })
                        .catch(error => {
                            this.$vs.loading.close('#div-excecao > .con-vs-loading');
                            this.$vs.notify({
                                title: 'Error',
                                text: error.message,
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'danger'
                            })
                        }).finally(() => {
                        this.salvando = false;
                    });
                }

            },
            setPadrao(item) {
                this.$vs.loading({
                    container: '#div-servicos',
                    scale: 1
                });
                let obj = {};
                obj.tipo = 'padrao';
                obj.variavel = 'padrao';
                obj.servico = item.codigo;
                obj.correio_id = this.item.id;
                this.$store.dispatch('contratos/addexcecao', obj)
                    .then(() => {
                        console.log('editar excecao');
                        this.getContrato(this.item.id);
                        this.$vs.loading.close('#div-servicos > .con-vs-loading');
                        this.$vs.notify({color: 'success', title: 'Sucesso!', text: 'Serviço padrão alterado com sucesso'});
                    })
                    .catch(error => {
                        this.$vs.loading.close('#div-servicos > .con-vs-loading');
                        this.$vs.notify({
                            title: 'Error',
                            text: error.message,
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
                            text: error.message,
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
                        formData.append('telefone', this.item.telefone);

                        this.$store.dispatch('contratos/update', {id: this.item.id, dados: formData})
                            .then(() => {
                                console.log('enviou')
                                this.$vs.loading.close();
                                this.$vs.notify({color: 'success', title: 'Sucesso!', text: 'Dados alterados com sucesso'})
                            })
                            .catch(error => {
                                this.$vs.loading.close();
                                this.$vs.notify({
                                    title: 'Error',
                                    text: error.message,
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
                        formData.append('telefone', this.item.telefone);

                      this.$store.dispatch('contratos/store', formData)
                            .then(() => {
                                console.log('enviou')
                                this.$vs.loading.close();
                                this.$vs.notify({color: 'success', title: 'Sucesso!', text: 'Dados alterados com sucesso'})
                                this.$router.push({name: 'contratos'})
                            })
                            .catch(error => {
                                this.$vs.loading.close();
                                this.$vs.notify({
                                    title: 'Error',
                                    text: error.message,
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
        cursor: pointer;
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
                cursor: pointer;
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
                cursor: pointer;
            }

            label {
                padding: 2px 5px;
            }
        }

    }
</style>
