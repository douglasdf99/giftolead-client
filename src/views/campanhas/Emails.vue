<template>
    <div>
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
            <div class="vx-col col-conquista mb-10" v-for="email in emails">
                <div class="conquista" style="cursor: default !important" v-bind:style="{opacity: (email.status ? '' : '.5')}">
                    <div class="py-2 w-full">
                        <vs-switch vs-icon-on="check" color="#0FB599" class="float-right switch"
                                   v-model="email.status" @click="ativaEmail(email)"/>
                    </div>
                    <div class="conquista-clicavel w-full">
                        <img src="@/assets/images/util/e-mail.svg" class="img-conquista my-3" width="120">
                        <p class="nome-conq mb-4">
                            {{email.unidade_tempo}} {{email.unidade_medida}} depois
                        </p>
                    </div>
                    <vs-button color="primary" type="border" class="font-bold"
                               @click="$router.push({path: '/campanha/configurar-checkout/' + email.campanha_id + '/emails/editar/' + email.id})">
                        Editar tentativa
                    </vs-button>
                </div>
            </div>
        </div>
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
                emails: [],
                countSwitch: []
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
            getId(id) {
                this.$vs.loading();
                this.$store.dispatch('checkout/getEmails', id).then(response => {
                    this.emails = response;
                    this.$vs.loading.close();
                });
            },
            ativaEmail(e) {
                console.log(this.countSwitch)
                if(this.countSwitch[e.id] !== undefined && this.countSwitch[e.id] === 3) {
                    e.status = !e.status;
                    this.$vs.notify({
                        title: '',
                        text: 'Muitas tentativas de ativação',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    });
                } else {
                    console.log(e)
                    const formData = new FormData();
                    let ativo = e.status ? 0 : 1;
                    let text = e.status ? 'Desativada' : 'Ativada';
                    formData.append('status', ativo);
                    formData.append('_method', 'PUT');
                    formData.append('assunto', e.assunto);
                    this.$store.dispatch('checkout/updateEmail', {id: e.id, dados: formData}).then(() => {
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
                            text: erro.message,
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    })
                    this.countSwitch[e.id] = this.countSwitch[e.id] !== undefined ? this.countSwitch[e.id] + 1 : 1;
                }
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
