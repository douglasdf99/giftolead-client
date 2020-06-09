<template>
    <div>
        <div class="vx-row">
            <div class="vx-col w-full mb-10">
                <p class="destaque">Configure a estrutura do seu plano de recuperação</p>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col col-conquista mb-10">
                <div class="conquista nova cursor-pointer"
                     @click="$router.push({path: '/campanha/configurar-checkout/' + $route.params.id + '/emails/criar'})">
                    <div class="img-plus cursor-pointer">
                        <i class="material-icons">add</i>
                    </div>
                    <p class="nome-conq">
                        Adicionar nova configuração
                    </p>
                </div>
            </div>
            <div class="vx-col col-conquista mb-10">
                <div class="conquista" style="opacity: .5; cursor: default !important;">
                    <div class="py-2 w-full">
                        <vs-switch vs-icon-on="check" color="#0FB599" class="float-right switch"/>
                    </div>
                    <div class="conquista-clicavel w-full">
                        <img src="@/assets/images/util/e-mail.svg" class="img-conquista my-3" width="120">
                        <!--<img src="@/assets/images/util/ticket.svg" class="img-conquista my-4" width="150">-->
                        <p class="nome-conq mb-4">
                            1 dia depois
                        </p>
                    </div>
                    <vs-button color="primary" type="border" @click="" class="font-bold">
                        Editar tentativa
                    </vs-button>
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
                            <vs-button icon-pack="material-icons" icon="email" class="mr-3" color="dark" type="flat"
                                       @click="$router.push({path: '/campanha/configurar_checkout/' + campanha.id})" v-if="campanha.id">
                                Voltar
                            </vs-button>
                            <vs-button class="mr-3" color="dark" type="flat" icon-pack="feather" icon="x-circle"
                                       @click="$router.push({path: '/planos/gerenciar/' + campanha.campanhas[0].plano_id})">
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

    export default {
        name: "Emails",
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
                campanha: {
                    nome: '',
                    produto: '',
                    status: null,
                    checkout: ''
                },
            }
        },
        methods: {
            salvar() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.$vs.loading();
                        this.campanha.plano_id = this.$route.params.id;
                        this.campanha._method = 'PUT';
                        if (this.campanha.id !== undefined) {
                            this.$store.dispatch('checkout/update', {id: this.campanha.id, dados: this.campanha}).then(response => {
                                console.log('response', response);
                                this.$vs.notify({
                                    title: '',
                                    text: "Atualizado com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });
                                this.$router.push({path: '/planos/gerenciar/' + this.campanha.campanhas[0].plano_id});
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
                                this.$router.push({path: '/planos/gerenciar/' + this.campanha.campanhas[0].plano_id});
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
