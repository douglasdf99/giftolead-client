<template>
    <div>
        <div class="vx-row mb-4">
            <div class="vx-col lg:w-full w-full">
                <span class="float-right mt-1 mx-4" style="font-weight: bold">{{produto.status ? 'Ativado' : 'Desativado'}}</span>
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="produto.status" class="float-right switch"/>
                <span class="float-right mt-1 mx-4" style="font-weight: bold">Status</span>
            </div>
        </div>
        <div class="vx-row mb-3">
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
                <span class="font-regular mb-2">Nome do produto</span>
                <vs-input class="w-full" v-model="produto.nome" size="large" v-validate="'required'" name="nome"/>
                <span class="text-danger text-sm" v-show="errors.has('nome')">Este campo é obrigatório</span>
            </div>
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
                <label class="vs-input--label">Conta atribuída no Hotmart</label>
                <v-select v-model="contaSelected" :class="'select-large-base'" :clearable="false"
                          style="background-color: white"
                          :options="opcoesContas" v-validate="'required'" name="integracao"/>
                <span class="text-danger text-sm"
                      v-show="errors.has('integracao')">{{ errors.first('integracao') }}</span>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2" v-if="produto.preco">
                <span class="font-regular mb-2">Preço</span>
                <vs-input class="w-full" v-model="produto.preco"  size="large" v-money="money"/>
                <!--<vs-input class="w-full" v-model="produto.comi_valor" size="large" v-money="money"/>-->
            </div>
            <div class="vx-col w-full xlg:w-3/12 lg:w-3/12">
                <span class="font-regular mb-2">Código ID do produto no Hotmart</span>
                <vs-input class="w-full" v-model="produto.cod_produto"
                          size="large"/>
            </div>
            <div class="vx-col w-full xlg:w-3/12 lg:w-3/12">
                <vs-input label="REF produto no checkout" class="w-full" v-model="produto.checkout" size="large"/>
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
                </ul>
            </div>
        </vx>
        <vs-divider class="mb-20"/>
        <div class="vx-row mb-20">
            <div class="vx-col w-full lg:w-1/2">
                <h2 class="subtitulo">Configurar comissão de venda para este produto</h2>
            </div>
            <div class="vx-col w-full lg:w-1/2 mb-6">
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="configComissao" class="float-right switch"/>
            </div>
            <transition name="fade">
                <div class="vx-col w-full lg:w-full" v-if="configComissao">
                    <div class="vx-row">
                        <div class="vx-col w-full lg:w-1/2">
                            <span class="span-destaque">Tipo de Comissão</span>
                            <ul class="list-tipo-comissao mt-10">
                                <li class="my-3">
                                    <vs-radio color="dark" v-model="produto.comissao_partilhada" vs-value="0">
                                        Individual
                                    </vs-radio>
                                </li>
                                <li>
                                    <vs-radio color="dark" v-model="produto.comissao_partilhada" vs-value="1">
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
        <div class="vx-row flex items-center" style="margin-bottom: 10rem">
            <div class="vx-col w-full mb-4">
                <h2 class="subtitulo">Url de integração com o Hotmart</h2>
            </div>
            <div class="vx-col w-full lg:w-10/12">
                <vs-input class="w-full" size="large" value="https://api.saveleads.com.br" disabled></vs-input>
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
                            <vs-button class="mr-3" color="dark" type="flat" icon-pack="feather" icon="x-circle" @click="$router.push({name: 'produtos'})">
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
            if(this.$route.name === 'produto-editar') {
                this.getProduto(this.$route.params.id);
            }
        },
        data() {
            return {
                produto: {
                    cor: '',
                    comissao_tipo: 'valor',
                    comissao_partilhada: 0,
                    preco: 0,
                    comi_valor: 0,
                    comi_per_valor: 0,
                    comi_percent: 0,
                    comi_per_percent: 0,
                    status: true,
                    integracao: true,
                    checkout: ''
                },
                contaSelected: {id: null, label: ''},
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
                this.$vs.loading();
                this.produto.conta_id = this.contaSelected.id;
                if(this.produto.id !== undefined) {
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
            },
            selecionaCor(cor) {
                this.produto.cor = cor
            },
            selecionaTipoComissao(val) {
                this.produto.comissao_tipo = val;
                console.log(this.produto.comissao_tipo)
            },
            getOpcoes() {
                this.$store.dispatch('contas/get').then(response => {
                    let arr = [...response];
                    arr.forEach(item => {
                        this.opcoesContas.push({id: item.id, label: item.nome})
                    });
                })
            },
            getProduto(id) {
                this.$vs.loading()
                this.$store.dispatch('produtos/getId', id).then(data => {
                    this.produto = {...data};
                    if(this.produto.comi_valor !== 0 || this.produto.comi_percent !== 0 ||
                        this.produto.comi_percent !== 0 || this.produto.comi_per_valor !== 0) {
                        this.configComissao = true;
                    }
                    this.produto.comi_valor *= 100;
                    this.produto.comi_percent *= 100;
                    this.produto.comi_per_valor *= 100;
                    this.produto.comi_per_percent *= 100;
                    this.produto.preco *= 100;
                    let {id, nome} = this.produto.conta;
                    this.contaSelected.id = id;
                    this.contaSelected.label = nome;
                    this.$vs.loading.close()
                })
            }
        },
        computed: {
            isValid() {
                return this.errors.any() && this.produto.cor !== '';
            },
        }
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
</style>