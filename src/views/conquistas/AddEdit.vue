<template>
    <div>
        <div class="vx-row mb-4">
            <div class="vx-col lg:w-full w-full">
            <span class="float-right mt-1 mx-4"
                  style="font-weight: bold">{{conquista.ativo ? 'Ativado' : 'Desativado'}}</span>
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="conquista.ativo" class="float-right switch"/>
            </div>
        </div>
        <div class="vx-row mb-3">
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
                <span class="font-regular mb-2">Nome do produto</span>
                <vs-input class="w-full" v-model="conquista.nome" size="large" v-validate="'required'" name="nome"/>
                <span class="text-danger text-sm" v-show="errors.has('nome')">{{ errors.first('nome') }}</span>
            </div>
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2" v-if="!conquista.global && conquista.global != null">
                <span class="font-regular mb-2">Produto</span>

                <v-select v-model="produtoSelected" :class="'select-large-base'" :clearable="false"
                          style="background-color: white" :options="produtos" v-validate="'required'" name="produto"/>
                <span class="text-danger text-sm" v-show="errors.has('produto')">Este campo é obrigatírio</span>
            </div>
        </div>
        <div class="vx-row mt-10 mb-3 justify-around flex" v-if="!prosseguiu">
            <div class="vx-col w-full mb-10">
                <h2 class="subtitulo">Escolha o tipo de conquista</h2>
            </div>
            <div class="vx-col w-full lg:w-5/12 sm:w-full text-center cursor-pointer tipo-conquista"
                 :class="{'conquista-ativa': (!conquista.global && conquista.global != null)}"
                 @click="conquista.global = false">
                <div class="vx-row py-5">
                    <div class="vx-col w-full">
                        <img src="@/assets/images/util/conquista-prod.svg" alt="">
                    </div>
                    <div class="vx-col w-full text-center">
                        <p class="destaque mb-3">Conquista Produto</p>
                        <p>Gamefication e bonificações por <br> vendas vinculadas a um produto</p>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full lg:w-5/12 sm:w-full text-center cursor-pointer tipo-conquista"
                 :class="{'conquista-ativa': (conquista.global)}" @click="conquista.global = true">
                <div class="vx-row py-5">
                    <div class="vx-col w-full">
                        <img src="@/assets/images/util/conquista-global.svg" alt="">
                    </div>
                    <div class="vx-col w-full">
                        <p class="destaque mb-3">Conquista Global</p>
                        <p>Gamefication e bonificações por <br> vendas de qualquer produto</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="vx-row mt-10 mb-5">
                <div class="vx-col w-full lg:w-1/2">
                    <span class="span-destaque">Perfil da Comissão</span>
                    <ul class="list-tipo-comissao mt-10">
                        <li class="my-3">
                            <vs-radio color="dark" v-model="conquista.perfil" vs-value="atendente">
                                Atendente
                            </vs-radio>
                        </li>
                        <li>
                            <vs-radio color="dark" v-model="conquista.perfil" vs-value="responsavel">
                                Responsável
                            </vs-radio>
                        </li>
                    </ul>
                </div>
                <div class="vx-col w-full lg:w-1/2">
                    <span class="span-destaque">Tipo de Comissão</span>
                    <div class="flex items-center mt-10">
                        <vs-button color="primary" type="border" class="mr-6"
                                   v-bind:class="{'btn-selecionado' : (conquista.tipo === 'valor')}"
                                   @click="selecionaTipoComissao('valor')">Valor (R$)
                        </vs-button>
                        <vs-button color="primary" type="border"
                                   v-bind:class="{'btn-selecionado' : (conquista.tipo === 'percentual')}"
                                   @click="selecionaTipoComissao('percentual')">Percentual (%)
                        </vs-button>
                    </div>
                </div>
            </div>
            <div class="vx-row">
                <div class="vx-col w-full xlg:w-3/12 lg:w-1/2" v-if="conquista.tipo === 'valor'">
                    <span class="font-regular mb-2">Aumento em reais</span>
                    <vs-input class="w-full" v-model="conquista.valor" size="large" v-money="money" v-validate="'required'"/>
                </div>
                <div class="vx-col w-full xlg:w-3/12 lg:w-1/2" v-if="conquista.tipo === 'percentual'">
                    <span class="font-regular mb-2">Aumento percentual</span>
                    <vs-input class="w-full" v-model="conquista.porcentagem" size="large" v-money="percent" v-validate="'required'"/>
                </div>
                <div class="vx-col w-full xlg:w-3/12 lg:w-1/2">
                    <span class="font-regular mb-2">Nº de vendas</span>
                    <vs-input class="w-full" v-model="conquista.quantidade" size="large" v-validate="'required'"/>
                </div>
            </div>
        </div>
        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <div class="container">
                        <div class="vx-row mb-2 relative">
                            <vs-button class="mr-3" color="primary" type="filled" @click="salvar" :disabled="isValid">
                                {{!prosseguiu ? 'Prosseguir' : 'Salvar'}}
                            </vs-button>
                            <vs-button class="mr-3" color="dark" type="flat" icon-pack="feather" icon="x-circle"
                                       @click="$router.push({name: 'conquistas'})">
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
    import moduleConquistas from '@/store/conquistas/moduleConquistas.js'
    import moduleProdutos from '@/store/produtos/moduleProdutos.js'
    import {Validator} from 'vee-validate';
    import saveleadsConfig from "../../../saveleadsConfig";

    const dict = {
        custom: {
            nome: {
                required: 'Por favor, insira o nome do produto',
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
            if (!moduleConquistas.isRegistered) {
                this.$store.registerModule('conquistas', moduleConquistas)
                moduleConquistas.isRegistered = true
            }
            if (!moduleProdutos.isRegistered) {
                this.$store.registerModule('produtos', moduleProdutos)
                moduleProdutos.isRegistered = true
            }
            this.getOpcoes();

            /*if (this.$route.name === 'produto-editar') {
                this.contaSelected = {id: null, label: ''};
                this.getProduto(this.$route.params.id);
            } else {
                this.conquista.preco = true;
            }*/
        },
        data() {
            return {
                url: saveleadsConfig.url_api,
                produtoSelected: null,
                conquista: {
                    ativo: true,
                    tipo: 'valor',
                    global: null,
                    perfil: 'atendente',
                    valor: 0,
                    porcentagem: 0,
                    quantidade: null
                },
                prosseguiu: false,
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
                        if (!this.prosseguiu) {
                            this.prosseguiu = true;
                        } else {
                            this.$vs.loading();
                            this.conquista.produto = this.produtoSelected.id;
                            if (this.conquista.id !== undefined) {
                                this.$store.dispatch('conquistas/updateProduto', this.produto).then(response => {
                                    console.log('response', response);
                                    this.$vs.notify({
                                        title: 'Sucesso',
                                        text: "O produto foi atualizado com sucesso.",
                                        iconPack: 'feather',
                                        icon: 'icon-check-circle',
                                        color: 'success'
                                    });
                                    this.$router.push({name: 'conquistas'});
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
                                this.$store.dispatch('conquistas/storeProduto', this.produto).then(response => {
                                    console.log('response', response);
                                    this.$vs.notify({
                                        title: 'Sucesso',
                                        text: "O produto foi criado com sucesso.",
                                        iconPack: 'feather',
                                        icon: 'icon-check-circle',
                                        color: 'success'
                                    });
                                    this.$router.push({name: 'conquistas'});
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
            selecionaTipoComissao(val) {
                this.conquista.tipo = val;
            },
            getOpcoes() {
                this.produtos = [];
                this.$store.dispatch('produtos/get').then(response => {
                    let arr = [...response];
                    arr.forEach(item => {
                        this.produtos.push({id: item.id, label: item.nome})
                    });
                })
            },
            getProduto(id) {
                this.$vs.loading()
                this.$store.dispatch('conquistas/getId', id).then(data => {
                    this.conquista = {...data};
                    this.$vs.loading.close();

                })
            },
        },
        computed: {
            isValid() {
                return this.errors.any() && this.conquista.global != null;
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
            },
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
