<template>
    <div>
        <div class="vx-row mb-4">
            <div class="vx-col lg:w-full w-full">
            <span class="float-right mt-1 mx-4"
                  style="font-weight: bold">{{campanha.status ? 'Ativado' : 'Desativado'}}</span>
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="campanha.status" class="float-right switch"/>
            </div>
        </div>
        <div class="vx-row mb-3">
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
                <span class="font-regular mb-2">Nome da campanha</span>
                <vs-input class="w-full" v-model="campanha.nome" size="large" name="nome"/>
            </div>
            <div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
                <span class="font-regular mb-2">Produto da campanha</span>
                <vs-input class="w-full" v-model="campanha.produto.nome" size="large" name="produto" disabled/>
            </div>
        </div>
        <div class="vx-row my-10">
            <div class="vx-col w-full lg:w-7/12">
                <div class="vx-row">
                    <div class="vx-col w-full mb-4">
                        <span class="font-regular mb-2">Checkout no Hotmart</span>
                        <vs-input class="w-full" id="search_input_trans" v-model="campanha.checkout" placeholder="https://" size="large" name="nome"/>
                    </div>
                    <div class="vx-col w-full">
                        <prism language="js" class="rounded-lg">
                            this.$vs.theme({
                            primary:'rgb(5, 173, 88)' // my new color
                            })
                        </prism>
                    </div>
                    <div class="vx-col w-full">

                    </div>
                </div>
            </div>
            <div class="vx-col w-full lg:w-5/12">
                <div class="vx-row">
                    <div class="vx-col w-full mb-4">
                        <vx-card style="box-shadow: none">
                            <span class="destaque">Nº de contatos na campanha</span>
                            <p class="font-bold text-3xl my-5">1456</p>
                        </vx-card>
                    </div>
                    <div class="vx-col w-full mb-4">
                        <vx-card style="box-shadow: none">
                            <span class="destaque">Vendas recuperadas</span>
                            <p class="font-bold text-3xl my-5">23</p>
                        </vx-card>
                    </div>
                    <div class="vx-col w-full mb-4">
                        <vx-card style="box-shadow: none">
                            <span class="destaque">Valor recuperado</span>
                            <p class="font-bold text-3xl my-5">R$ {{formatPrice(35424.43)}}</p>
                        </vx-card>
                    </div>
                </div>
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
                                       @click="$router.push({name: 'meus-planos'})">
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
    import moduleCampCheckouts from "@/store/campanha_checkout/moduleCampCheckouts";
    import Prism from 'vue-prism-component'

    export default {
        name: "Edit",
        components: {
            'v-select': vSelect,
            Prism
        },
        created() {
            if (!moduleCampCheckouts.isRegistered) {
                this.$store.registerModule('checkout', moduleCampCheckouts)
                moduleCampCheckouts.isRegistered = true
            }
            this.getId(this.$route.params.id);
        },
        data() {
            return {
                campanha: {
                    nome: '',
                    produto: '',
                    status: null,
                    checkout: 'https://'
                },
                customcor: '',
            }
        },
        methods: {
            salvar() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        if (this.campanhaSelected == null) {
                            this.$vs.notify({
                                title: 'Error',
                                text: 'verifique os erros específicos',
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'danger'
                            })
                        } else {
                            this.$vs.loading();
                            this.campanha.produto_id = this.produtoSelected.id;
                            this.campanha.tipo = this.campanhaSelected;
                            this.campanha.plano_id = this.$route.params.id;
                            if (this.campanha.id !== undefined) {
                                this.$store.dispatch('campanhas/update', this.campanha).then(response => {
                                    console.log('response', response);
                                    this.$vs.notify({
                                        title: '',
                                        text: "Atualizado com sucesso.",
                                        iconPack: 'feather',
                                        icon: 'icon-check-circle',
                                        color: 'success'
                                    });
                                    this.$router.push({path: '/planos/gerenciar/' + this.$route.params.id});
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
                                console.log('entrou no store')
                                this.$store.dispatch('campanhas/store', this.campanha).then(response => {
                                    console.log('response', response);
                                    this.$vs.notify({
                                        title: 'Sucesso',
                                        text: "O produto foi criado com sucesso.",
                                        iconPack: 'feather',
                                        icon: 'icon-check-circle',
                                        color: 'success'
                                    });
                                    this.$router.push({path: '/planos/gerenciar/' + this.$route.params.id});
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
            selecionaCor(cor) {
                if (cor) {
                    this.campanha.cor = cor
                } else {
                    this.campanha.cor = this.customcor;
                }
                this.errors.remove('cor');
            },
            selecionaTipoComissao(val) {
                this.campanha.comissao_tipo = val;
                console.log(this.campanha.comissao_tipo)
            },
            getId(id) {
                this.$vs.loading();
                this.$store.dispatch('checkout/getId', id).then(response => {
                    this.campanha = {...response};
                    this.$vs.loading.close();
                });
            },
            formatPrice(value) {
                let val = (value / 1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
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
                return this.errors.any();
            },
        },
        watch: {
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

    #copy-icon {
        position: absolute;
        top: 0.7rem;
        right: 30px;
        cursor: pointer;
    }
</style>
