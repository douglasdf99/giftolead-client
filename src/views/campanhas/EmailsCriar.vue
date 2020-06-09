<template>
    <div>
        <div class="vx-row">
            <div class="vx-col w-full mb-5">
                <p class="destaque">Configure o período de envio</p>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col w-full">
                <vx-card class="shadow-none flex items-center">
                    <div class="row">
                        <div class="vx-col lg:w-3/12">
                            <i class="material-icons text-4xl primary">date_range</i>
                        </div>
                        <div class="vx-col lg:w-9/12">
                            <v-select v-model="periodoSelected" :class="'select-large-base'" :clearable="false"
                                      style="background-color: white"
                                      :options="periodos" v-validate="'required'" name="produto"/>
                        </div>
                    </div>
                </vx-card>
            </div>
        </div>
        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <div class="container">
                        <div class="vx-row mb-2 relative">
                            <!--<vs-button class="mr-3" color="primary" type="filled" @click="salvar" :disabled="isValid">
                                Salvar
                            </vs-button>
                            <vs-button icon-pack="material-icons" icon="email" class="mr-3" color="dark" type="flat"
                                       @click="$router.push({path: '/campanha/configurar_checkout/' + email.id})" v-if="email.id">
                                Voltar
                            </vs-button>
                            <vs-button class="mr-3" color="dark" type="flat" icon-pack="feather" icon="x-circle"
                                       @click="$router.push({path: '/planos/gerenciar/' + email.campanhas[0].plano_id})">
                                Cancelar
                            </vs-button>-->
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

    export default {
        name: "EmailsCriar",
        components: {
            'v-select': vSelect,
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
                email: {
                    periodo: '',
                    assunto: '',
                    status: null,
                },
                periodoSelected: {},
                periodos: [
                    {id: 1, text: '1 dia após'},
                    {id: 2, text: '2 dias após'},
                    {id: 3, text: '3 dias após'},
                    {id: 4, text: '4 dias após'},
                    {id: 5, text: '5 dias após'},
                ]
            }
        },
        methods: {
            salvar() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.$vs.loading();
                        this.email.plano_id = this.$route.params.id;
                        this.email._method = 'PUT';
                        if (this.email.id !== undefined) {
                            this.$store.dispatch('checkout/update', {id: this.email.id, dados: this.campanha}).then(response => {
                                console.log('response', response);
                                this.$vs.notify({
                                    title: '',
                                    text: "Atualizado com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });
                                this.$router.push({path: '/planos/gerenciar/' + this.email.campanhas[0].plano_id});
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
                            this.$store.dispatch('checkout/store', this.campanha).then(response => {
                                console.log('response', response);
                                this.$vs.notify({
                                    title: '',
                                    text: "Criado com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });
                                this.$router.push({path: '/planos/gerenciar/' + this.email.campanhas[0].plano_id});
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
                    this.email.cor = cor
                } else {
                    this.email.cor = this.customcor;
                }
                this.errors.remove('cor');
            },
            selecionaTipoComissao(val) {
                this.email.comissao_tipo = val;
                console.log(this.email.comissao_tipo)
            },
            getId(id) {
                this.$vs.loading();
                this.$store.dispatch('checkout/getEmails', id).then(response => {
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
                this.$copyText(this.html).then(function () {
                    thisIns.$vs.notify({
                        title: '',
                        text: 'Copiado para sua área de transferência',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check-circle'
                    })
                }, function () {
                    thisIns.$vs.notify({
                        title: 'Failed',
                        text: 'Erro ao copiar',
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
