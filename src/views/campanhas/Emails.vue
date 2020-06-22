<template>
    <div>
        <side-bar v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="closeSidebar" :data="listaEmails"/>
        <div class="vx-row mt-10" v-if="emails.length > 0">
            <div class="vx-col w-full float-right">
                <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="organizar">
                    <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                    Reorganizar E-mails
                </vs-button>
            </div>
        </div>
        <div class="vx-row mt-10">
            <div class="vx-col col-conquista mb-10">
                <div class="conquista nova cursor-pointer"
                     @click="$router.push({path: '/campanha/configurar-checkout/' + $route.params.id + '/emails/criar'})">
                    <div class="img-plus cursor-pointer">
                        <i class="material-icons">add</i>
                    </div>
                    <p class="nome-conq">
                        Adicionar <br> novo e-mail
                    </p>
                </div>
            </div>
            <div class="vx-col col-conquista mb-10" v-for="(email, index) in emails">
                <div class="conquista" style="cursor: default !important" v-bind:style="{opacity: (email.status ? '' : '.5')}">
                    <div class="py-2 w-full flex justify-between">
                        <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="deletar(email.id)"></vs-button>
                        <vs-switch vs-icon-on="check" color="#0FB599" class="float-right switch"
                                   v-model="email.status" @click="ativaEmail(email)"/>
                    </div>
                    <div class="conquista-clicavel w-full">
                        <img src="@/assets/images/util/e-mail.svg" class="img-conquista my-3" width="120">
                        <p class="nome-conq mb-4 text-base">
                            {{email.unidade_tempo}} {{email.unidade_medida}} depois {{index === 0 ? 'da entrada' : 'do último envio'}}
                        </p>
                    </div>
                    <vs-button color="primary" type="border" class="font-bold"
                               @click="$router.push({path: '/campanha/configurar-checkout/' + email.campanha_id + '/emails/editar/' + email.id})">
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
                            <vs-button class="mr-3" color="dark" type="flat" icon-pack="feather" icon="x-circle"
                                       @click="$router.push({path: '/campanha/configurar-checkout/' + $route.params.id})">
                                Voltar
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
    import SideBar from './Reorganizar'

    export default {
        name: "Emails",
        components: {
            'v-select': vSelect,
            SideBar
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
                listaEmails: [],
                countSwitch: [],
                addNewDataSidebar: false
            }
        },
        methods: {
            organizar() {
                this.listaEmails = [...this.emails];
                this.toggleDataSidebar(true)
            },
            closeSidebar() {
                console.log('ah mano')
                this.toggleDataSidebar();
                this.getId(this.$route.params.id)
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
            },
            getId(id) {
                this.$vs.loading();
                this.$store.dispatch('checkout/getEmails', id).then(response => {
                    this.emails = response;
                    this.$vs.loading.close();
                });
            },
            deletar(id) {
                this.$vs.dialog({
                    color: 'danger',
                    title: `Deletar registro?`,
                    text: 'Deseja deletar este registro? Procedimento irreversível',
                    acceptText: 'Sim, deletar!',
                    accept: () => {
                        this.$vs.loading();
                        this.$store.dispatch('deleteItem', {id: id, rota: 'campanha_carrinho_emails'}).then(() => {
                            this.$vs.notify({
                                color: 'success',
                                title: '',
                                text: 'Deletado com sucesso'
                            });
                            if (this.$route.name === 'planos-gerenciar')
                                this.getPlano(this.$route.params.id);
                        }).catch(erro => {
                            console.log(erro)
                            this.$vs.notify({
                                color: 'danger',
                                title: '',
                                text: 'Algo deu errado ao deletar. Contate o suporte.'
                            })
                        })
                    }
                })
            },
            ativaEmail(e) {
                console.log(this.countSwitch)
                if (this.countSwitch[e.id] !== undefined && this.countSwitch[e.id] === 3) {
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
