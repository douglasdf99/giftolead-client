<template>
    <div>
        <div class="vx-row mb-4">
            <div class="vx-col lg:w-full w-full">
            <span class="float-right mt-1 mx-4"
                  style="font-weight: bold">{{produto.status ? 'Ativado' : 'Desativado'}}</span>
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="produto.status" class="float-right switch"/>
                <span class="float-right mt-1 mx-4" style="font-weight: bold">Status</span>
            </div>
        </div>
        <div class="vx-row mb-3">
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
                <span class="font-regular mb-2">Nome do produto</span>
                <vs-input class="w-full" v-model="produto.nome" size="large" v-validate="'required'" name="nome"/>
                <span class="text-danger text-sm" v-show="errors.has('nome')">{{ errors.first('nome') }}</span>
            </div>
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
                <span class="font-regular mb-2">Conta atribuída no Hotmart</span>
                <v-select v-model="contaSelected" :class="'select-large-base'" :clearable="false"
                          style="background-color: white"
                          :options="opcoesContas" v-validate="'required'" name="conta"/>
                <span class="text-danger text-sm" v-show="errors.has('conta')">{{ errors.first('conta') }}</span>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2" v-if="produto.preco">
                <span class="font-regular mb-2">Preço</span>
                <vs-input class="w-full" v-model="produto.preco" v-validate="'required'" size="large" v-money="money"
                          name="preco"/>
                <span class="text-danger text-sm" v-show="errors.has('preco')">{{ errors.first('preco') }}</span>
                <!--<vs-input class="w-full" v-model="produto.comi_valor" size="large" v-money="money"/>-->
            </div>
            <div class="vx-col w-full xlg:w-3/12 lg:w-3/12">
                <span class="font-regular mb-2">Código ID do produto no Hotmart</span>
                <vs-input class="w-full" type="text" @keypress="isNumber($event)" v-validate="'required'" v-model="produto.cod_produto"
                          size="large" name="codigo"/>
                <span class="text-danger text-sm" v-show="errors.has('codigo')">{{ errors.first('codigo') }}</span>

            </div>
            <div class="vx-col w-full xlg:w-3/12 lg:w-3/12">
                <span class="font-regular mb-2">REF produto no checkout</span>
                <vs-input class="w-full" v-model="produto.checkout" size="large"/>
            </div>
        </div>
        <vx class="vx-row mb-20">
            <div class="vx-col w-full mb-4">
                <span>Escolha uma cor para mostrar o produto nas telas</span>
            </div>
            <div class="vx-col w-full">
                <ul class="clearfix">
                    <li class="w-10 cursor-pointer h-10 rounded-lg m-2 float-left" v-for="cor in cores"
                        :style="{backgroundColor: cor}" @click="selecionaCor(cor)">
                        <vs-icon icon="done" icon-pack="material-icons" style="color: white;font-size: 2.5rem;"
                                 v-if="produto.cor === cor"></vs-icon>
                    </li>
                    <li class="w-10 cursor-pointer h-10 rounded-lg m-2 float-left" :style="{backgroundColor: customcor}"
                        @click="selecionaCor(customcor)">
                        <vs-icon icon="done" icon-pack="material-icons" style="color: white;font-size: 2.5rem;"
                                 v-if="produto.cor === customcor"></vs-icon>
                    </li>
                    <li class="w-10 cursor-pointer h-10 rounded-lg m-2 float-left">
                        <input type="color" v-model="customcor" @change="selecionaCor()"
                               class="w-10 cursor-pointer h-10 rounded-lg ">
                    </li>
                </ul>
                <input type="text" v-model="this.produto.cor" v-validate="'required'" name="cor" style="display: none;">
                <span class="text-danger text-sm" v-show="errors.has('cor')">{{ errors.first('cor') }}</span>

            </div>
        </vx>
        <vs-divider class="mb-20"/>
        <div class="vx-row mb-20">
            <div class="vx-col w-full lg:w-1/2">
                <h2 class="subtitulo">Configurar comissão de venda para este produto</h2>
            </div>
            <div class="vx-col w-full lg:w-1/2 mb-6">
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="produto.hab_comissao" class="float-right switch"/>
            </div>
            <transition name="fade">
                <div class="vx-col w-full lg:w-full" v-if="produto.hab_comissao">
                    <div class="vx-row">
                        <div class="vx-col w-full lg:w-1/2">
                            <span class="span-destaque">Tipo de Comissão</span>
                            <ul class="list-tipo-comissao mt-10">
                                <li class="my-3">
                                    <vs-radio color="dark" v-model="produto.comissao_partilhada" vs-value="1">
                                        Individual
                                    </vs-radio>
                                </li>
                                <li>
                                    <vs-radio color="dark" v-model="produto.comissao_partilhada" vs-value="0">
                                        Partilhada
                                    </vs-radio>
                                </li>
                            </ul>
                        </div>
                        <div class="vx-col w-full lg:w-1/2">
                            <span class="span-destaque">Tipo de Comissão</span>
                            <div class="flex items-center mt-10">
                                <vs-button color="primary" type="border" class="mr-6"
                                           v-bind:class="{'btn-selecionado' : (produto.comissao_tipo === 'valor')}"
                                           @click="selecionaTipoComissao('valor')">Valor (R$)
                                </vs-button>
                                <vs-button color="primary" type="border"
                                           v-bind:class="{'btn-selecionado' : (produto.comissao_tipo === 'percentual')}"
                                           @click="selecionaTipoComissao('percentual')">Percentual (%)
                                </vs-button>
                            </div>
                        </div>
                    </div>
                    <div class="vx-row mt-10" v-if="produto.comissao_partilhada == 1">
                        <div class="vx-col w-full xlg:w-1/2 lg:w-1/2" v-if="produto.comissao_tipo === 'valor'">
                            <span class="font-regular mb-2">Comissão para quem <b>insere</b> o Ticket</span>
                            <vs-input class="w-full" v-model="produto.comi_valor" size="large" v-money="money"/>
                        </div>
                        <div class="vx-col w-full xlg:w-3/12 lg:w-1/2" v-if="produto.comissao_tipo === 'valor'">
                            <span class="font-regular mb-2">Comissão para quem <b>atende</b> o Ticket</span>
                            <vs-input class="w-full" v-model="produto.comi_per_valor" v-money="money" size="large"/>
                        </div>


                        <div class="vx-col w-full xlg:w-1/2 lg:w-1/2" v-if="produto.comissao_tipo === 'percentual'">
                            <span class="font-regular mb-2">Comissão para quem <b>insere</b> o Ticket</span>
                            <vs-input class="w-full" v-model="produto.comi_percent" size="large" v-money="percent"/>
                        </div>
                        <div class="vx-col w-full xlg:w-3/12 lg:w-1/2" v-if="produto.comissao_tipo === 'percentual'">
                            <span class="font-regular mb-2">Comissão para quem <b>atende</b> o Ticket</span>
                            <vs-input class="w-full" v-model="produto.comi_per_percent" size="large" v-money="percent"/>
                        </div>
                    </div>
                    <div class="vx-row mt-10" v-if="produto.comissao_partilhada == 0">
                        <div class="vx-col w-full xlg:w-3/12 lg:w-1/2" v-if="produto.comissao_tipo === 'valor'">
                            <span class="font-regular mb-2">Comissão em reais</span>
                            <vs-input class="w-full" v-model="produto.comi_valor" size="large" v-money="money"/>
                        </div>
                        <div class="vx-col w-full xlg:w-3/12 lg:w-1/2" v-if="produto.comissao_tipo === 'percentual'">
                            <span class="font-regular mb-2">Comissão percentual</span>
                            <vs-input class="w-full" v-model="produto.comi_percent" size="large" v-money="percent"/>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
        <vs-divider class="mb-20"/>
        <div class="vx-row flex items-center mb-20">
            <div class="vx-col w-full mb-4">
                <h2 class="subtitulo">Produtos como possam ser vendidos como Upsell</h2>
            </div>
            <div class="vx-col w-full relative">
                <v-select multiple :closeOnSelect="false" v-model="upsellers" :options="produtos" dir="ltr" class="bg-white"/>
            </div>
        </div>
        <vs-divider class="mb-20"/>
        <div class="vx-row flex items-center" style="margin-bottom: 10rem">
            <div class="vx-col w-full mb-4">
                <h2 class="subtitulo">Url de integração com o Hotmart</h2>
            </div>
            <div class="vx-col w-full lg:w-10/12 relative">
                <vs-input class="w-full" size="large" v-model="url"
                          disabled></vs-input>
                <i class="material-icons" id="copy-icon" @click="copyText">file_copy</i>
            </div>
            <div class="vx-col w-full lg:w-2/12">
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="produto.integracao" class="float-right switch"/>
            </div>
        </div>
        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <div class="container">
                        <div class="vx-row mb-2 relative">
                            <vs-button class="mr-3" color="primary" type="filled" @click="salvar" :disabled="isValid">
                                Salvar
                            </vs-button>
                            <vs-button class="mr-3" color="dark" type="flat" icon-pack="feather" icon="x-circle"
                                       @click="$router.push({name: 'produtos'})">
                                Cancelar
                            </vs-button>
                        </div>
                    </div>
                </div>
            </footer-doug>
        </transition>
    </div>
</template>

<script>
    import vSelect from 'vue-select'
    import moduleContas from '@/store/contas/moduleContas.js'
    import moduleProdutos from '@/store/produtos/moduleProdutos.js'
    import {Validator} from 'vee-validate';
    import saveleadsConfig from "../../../saveleadsConfig";

    const dict = {
        custom: {
            nome: {
                required: 'Por favor, insira o nome do produto',
            },
            conta: {
                required: 'Por favor, selecione a conta que pertence esse produto',
            },
            preco: {
                required: 'Por favor, insira o código',
            },
            codigo: {
                required: 'Por favor, insira o código',
            },
            checkout: {
                required: 'Por favor, insira o código do checkout do produto',
            },
            cor: {
                required: 'Por favor, insira um cor para o produto',
            },
            comissao_partilhada: {
                required: 'Por favor, insira o código do checkout do produto',
            },
            comissao_tipo: {
                required: 'Por favor, insira o código do checkout do produto',
            },
            comi_valor: {
                required: 'Por favor, insira o código do checkout do produto',
            },
            comi_per_valor: {
                required: 'Por favor, insira o código do checkout do produto',
            },
            comi_percent: {
                required: 'Por favor, insira o código do checkout do produto',
            },
            comi_per_percent: {
                required: 'Por favor, insira o código do checkout do produto',
            },
        }
    };
    Validator.localize('pt-br', dict);
    export default {
        name: "Edit",
        components: {
            'v-select': vSelect
        },
        created() {
            if (!moduleContas.isRegistered) {
                this.$store.registerModule('contas', moduleContas)
                moduleContas.isRegistered = true
            }
            if (!moduleProdutos.isRegistered) {
                this.$store.registerModule('produtos', moduleProdutos)
                moduleProdutos.isRegistered = true
            }
            this.getOpcoes();

            if (this.$route.name === 'produto-editar') {
                this.contaSelected = {id: null, label: ''};
                this.getProduto(this.$route.params.id);
            } else {
                this.produto.preco = true;
            }
            console.log('criando', this.produto.preco);
        },
        mounted() {
            console.log('montado', this.produto.preco);
        },
        updated() {
            console.log('updated', this.produto.preco);
        },
        data() {
            return {
                customcor: '',
                produto: {
                    cor: '',
                    comissao_tipo: 'valor',
                    comissao_partilhada: 0,
                    preco: null,
                    comi_valor: 0,
                    comi_per_valor: 0,
                    comi_percent: 0,
                    comi_per_percent: 0,
                    status: true,
                    integracao: true,
                    checkout: '',
                    upsellers: []
                },
                upsellers: [],
                produtos: [],
                url: saveleadsConfig.url_api + '/hotmart',
                contaSelected: null,
                cores: ['#21BC9C', '#1EA085', '#2FCC70', '#28AF60', '#3598DB', '#2B80B9', '#A463BF', '#8E43AD',
                    '#3D556E', '#222F3D', '#F2C512', '#F39C1A', '#E84B3C', '#C0382B', '#DDE6E8', '#BDC3C8'],
                configComissao: false,
                opcoesContas: [],
                money: {
                    decimal: ',',
                    thousands: '.',
                    prefix: 'R$ ',
                    suffix: '',
                    precision: 2,
                    masked: false /* doesn't work with directive */
                },
                percent: {
                    decimal: ',',
                    thousands: '.',
                    prefix: '',
                    suffix: '%',
                    precision: 2,
                    masked: false /* doesn't work with directive */
                },
            }
        },
        methods: {
            salvar() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.$vs.loading();
                        this.produto.conta_id = this.contaSelected.id;
                        if (this.upsellers.length > 0) {
                            this.produto.upsellers = this.upsellers.map(item => {
                                return item.id;
                            });
                        }
                        console.log('olha aí', this.produto.upsellers)
                        if (this.produto.id !== undefined) {
                            this.$store.dispatch('produtos/updateProduto', this.produto).then(response => {
                                console.log('response', response);
                                this.$vs.notify({
                                    title: 'Sucesso',
                                    text: "O produto foi atualizado com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });
                                this.$router.push({name: 'produtos'});
                            }).catch(erro => {
                                this.$vs.notify({
                                    title: 'Error',
                                    text: erro.message,
                                    iconPack: 'feather',
                                    icon: 'icon-alert-circle',
                                    color: 'danger'
                                })
                            })
                        } else {
                            this.$store.dispatch('produtos/storeProduto', this.produto).then(response => {
                                console.log('response', response);
                                this.$vs.notify({
                                    title: 'Sucesso',
                                    text: "O produto foi criado com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });
                                this.$router.push({name: 'produtos'});
                            }).catch(erro => {
                                this.$vs.notify({
                                    title: 'Error',
                                    text: erro.message,
                                    iconPack: 'feather',
                                    icon: 'icon-alert-circle',
                                    color: 'danger'
                                })
                            })
                        }
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

            },
            selecionaCor(cor) {
                if (cor) {
                    this.produto.cor = cor
                } else {
                    this.produto.cor = this.customcor;
                }
                this.errors.remove('cor');
            },
            selecionaTipoComissao(val) {
                this.produto.comissao_tipo = val;
                console.log(this.produto.comissao_tipo)
            },
            getOpcoes() {
                this.opcoesContas = [];
                this.$store.dispatch('contas/get').then(response => {
                    let arr = [...response];
                    arr.forEach(item => {
                        this.opcoesContas.push({id: item.id, label: item.nome})
                    });
                });
                //
                this.$store.dispatch('produtos/get').then(response => {
                    let arr = [...response];
                    arr.forEach(item => {
                        console.log('itemn', item)
                        if ((item.conta_id == this.produto.conta_id) && (item.nome != this.produto.nome))
                            this.produtos.push({id: item.id, label: item.nome});
                    });
                })
            },
            getProduto(id) {
                this.$vs.loading()
                this.$store.dispatch('produtos/getId', id).then(data => {
                    this.produto = {...data};
                    /*if (this.produto.comi_valor !== 0 || this.produto.comi_percent !== 0 ||
                        this.produto.comi_percent !== 0 || this.produto.comi_per_valor !== 0) {
                        this.configComissao = true;
                    }*/
                    if (!this.produto.preco) {
                        this.produto.preco = true;
                    }
                    this.setUpsellers();
                    this.produto.comi_valor *= 100;
                    this.produto.comi_percent *= 100;
                    this.produto.comi_per_valor *= 100;
                    this.produto.comi_per_percent *= 100;
                    this.produto.preco *= 100;
                    console.log('preco', this.produto.preco)
                    let {id, nome} = this.produto.conta;
                    this.contaSelected.id = id;
                    this.contaSelected.label = nome;
                    this.customcor = this.produto.cor;
                    this.$vs.loading.close();
                })
            },
            setUpsellers() {
                if (this.produto.upsellers.length > 0) {
                    console.log('entrou');
                    this.produto.upsellers.forEach(item => {
                        this.upsellers.push({id: item.produto.id, label: item.produto.nome});
                    });
                }
            },
            copyText() {
                const thisIns = this;
                this.$copyText(this.url).then(function () {
                    thisIns.$vs.notify({
                        title: 'Success',
                        text: 'URL copiada para sua área de transferência',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check-circle'
                    })
                }, function () {
                    thisIns.$vs.notify({
                        title: 'Failed',
                        text: 'Erro ao copiar link',
                        color: 'danger',
                        iconPack: 'feather',
                        position: 'top-center',
                        icon: 'icon-alert-circle'
                    })
                })
            }
        },
        computed: {
            isValid() {
                return this.errors.any() && this.produto.cor !== '';
            },
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
            }
        },
    }
</script>

<style>
    [dir] .con-select .vs-select--input {
        padding: 1.4rem 2rem !important;
    }

    .list-tipo-comissao .vs-radio--label {
        font-weight: 600;
        margin-left: 2rem;
    }

    #copy-icon {
        position: absolute;
        top: 0.7rem;
        position: absolute;
        right: 30px;
        cursor: pointer;
    }
</style>
