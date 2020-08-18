<template>
    <div>
        <side-bar v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="closeSidebar" :data="campanha.emails" rota="boleto"/>
        <div class="vx-row mb-4">
            <div class="vx-col lg:w-full w-full">
            <span class="float-right mt-1 mx-4"
                  style="font-weight: bold">{{campanha.status ? 'Ativado' : 'Desativado'}}</span>
                <vs-switch vs-icon-on="check" @click="ativaBoleto" color="#0FB599" v-model="campanha.status" class="float-right switch"/>
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
        <div class="vx-row my-5 justify-between">
            <div class="vx-col w-full lg:w-1/2">
                <div class="w-full tipo-conquista my-5 p-4 flex items-center hover-opacidade cursor-pointer" @click="configEnvio('emails')">
                    <img src="@/assets/images/util/e-mail.svg" class="img-conquista m-5" width="100">
                    <div>
                        <p class="font-bold text-xl">Envios de E-mails</p>
                        <p>Envie campanhas de e-mail marketing de forma rápida e prática</p>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full lg:w-1/2">
                <div class="w-full tipo-conquista my-5 p-4 flex items-center hover-opacidade cursor-pointer" @click="configEnvio('sms')">
                    <img src="@/assets/images/util/sms.svg" class="img-conquista m-5" width="100">
                    <div>
                        <p class="font-bold text-xl">Envios de SMS</p>
                        <p>Envie campanhas de SMS automáticas de forma rápida e prática.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col w-full lg:w-4/12 md:w-6/12 mb-4">
                <vx-card class="shadow-none hover-opacidade cursor-pointer" @click="historico">
                    <span class="destaque">Histórico de envios</span>
                    <p class="font-bold text-3xl my-5">{{campanha.historico_count}}</p>
                </vx-card>
            </div>
            <div class="vx-col w-full lg:w-4/12 md:w-6/12 mb-4" @click="contatos('ativos')">
                <vx-card class="shadow-none hover-opacidade cursor-pointer">
                    <span class="destaque">Nº de contatos ativos</span>
                    <p class="font-bold text-3xl my-5">{{campanha.contatos_count}}</p>
                </vx-card>
            </div>
            <div class="vx-col w-full lg:w-4/12 md:w-6/12 mb-4" @click="contatos('inativos')">
                <vx-card class="shadow-none hover-opacidade cursor-pointer">
                    <span class="destaque">Nº de contatos inativos</span>
                    <p class="font-bold text-3xl my-5">{{campanha.contatos_inativos_count}}</p>
                </vx-card>
            </div>
            <div class="vx-col w-full mb-4 text-center cursor-pointer" @click="verMaisCards = true" v-if="!verMaisCards">
                <p class="destaque text-primary">Ver mais</p>
            </div>
            <transition name="fade">
                <div class="vx-col w-full lg:w-4/12 md:w-6/12 mb-4 hover-opacidade cursor-pointer" @click="contatos('todos')" v-if="verMaisCards">
                    <vx-card class="shadow-none">
                        <span class="destaque">Nº total de contatos</span>
                        <p class="font-bold text-3xl my-5">{{campanha.contatos_todos_count}}</p>
                    </vx-card>
                </div>
            </transition>
            <transition name="fade">
                <div class="vx-col w-full lg:w-4/12 md:w-6/12 mb-4" v-if="verMaisCards">
                    <vx-card class="shadow-none">
                        <span class="destaque">Vendas recuperadas</span>
                        <p class="font-bold text-3xl my-5">{{campanha.transacaos_count}}</p>
                    </vx-card>
                </div>
            </transition>
            <transition name="fade">
                <div class="vx-col w-full lg:w-4/12 md:w-6/12 mb-4" v-if="verMaisCards">
                    <vx-card class="shadow-none">
                        <span class="destaque">Valor recuperado</span>
                        <p class="font-bold text-3xl my-5">R$ {{formatPrice(valortotal)}}</p>
                    </vx-card>
                </div>
            </transition>
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
    import Prism from 'vue-prism-component'
    import moduleCampBoletos from "../../../store/campanha_boleto/moduleCampBoletos";
    import SideBar from '../Reorganizar'
    import moduleCampanhas from "../../../store/campanhas/moduleCampanhas";

    export default {
        name: "Boleto",
        components: {
            'v-select': vSelect,
            Prism,
            SideBar
        },
        created() {
            if (!moduleCampBoletos.isRegistered) {
                this.$store.registerModule('boleto', moduleCampBoletos)
                moduleCampBoletos.isRegistered = true
            }
            if (!moduleCampanhas.isRegistered) {
                this.$store.registerModule('campanhas', moduleCampanhas)
                moduleCampanhas.isRegistered = true
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
                customcor: '',
                html: '',
                verMaisCards: false,
                countSwitch: [],
                addNewDataSidebar: false
            }
        },
        methods: {
            salvar() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.$vs.loading();
                        this.campanha.plano_id = this.campanha.campanhas[0].plano_id;
                        this.campanha._method = 'PUT';
                        if (this.campanha.id !== undefined) {
                            this.$store.dispatch('boleto/update', {id: this.campanha.id, dados: this.campanha}).then(response => {
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
                            this.$store.dispatch('boleto/store', this.campanha).then(response => {
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
            configEnvio(val) {
                this.$router.push({path: '/campanha/configurar-boleto/' + this.campanha.id + `/${val}`});
            },
            deletar(id) {
                this.$vs.dialog({
                    color: 'danger',
                    title: `Deletar registro?`,
                    text: 'Deseja deletar este registro? Procedimento irreversível',
                    acceptText: 'Sim, deletar!',
                    accept: () => {
                        this.$vs.loading();
                        this.$store.dispatch('deleteItem', {id: id, rota: 'campanha_boleto_emails'}).then(() => {
                            this.$vs.notify({
                                color: 'success',
                                title: '',
                                text: 'Deletado com sucesso'
                            });
                            this.getId(this.$route.params.id);
                        }).catch(erro => {
                            console.log(erro)
                            this.$vs.notify({
                                color: 'danger',
                                title: '',
                                text: 'Algo deu errado ao deletar. Contate o suporte.'
                            })
                        }).finally(() => {
                            this.$vs.loading.close();
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
                    this.$store.dispatch('boleto/updateEmail', {id: e.id, dados: formData}).then(() => {
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
            },
            ativaBoleto() {
                if (this.$route.name == 'campanha-configurar-boleto') {
                    this.$vs.dialog({
                        color: 'primary',
                        type: 'confirm',
                        title: `Deseja ativar essa campanha?`,
                        text: 'Ao ativar essa campanha, outra campnha desse mesmo tipo e de mesmo produto será desativada.',
                        acceptText: 'Sim, ativar!',
                        accept: () => {
                            this.$store.dispatch('campanhas/ativaEspecifica', {id: this.$route.params.id || '', status: this.campanha.status, rota: 'campanha_boletos_ativar'}).then(() => {
                                this.$vs.notify({
                                    title: '',
                                    text: "Sucesso",
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
                            }).finally(() => {

                            });
                        },
                        cancel: () => {
                            this.campanha.status = !this.campanha.status;
                        }
                    })
                }
            },
            organizar() {
                this.toggleDataSidebar(true)
            },
            closeSidebar() {
                this.toggleDataSidebar();
                this.getId(this.$route.params.id);
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
            },
            getId(id) {
                this.$vs.loading();
                this.$store.dispatch('boleto/getId', id).then(response => {
                    this.campanha = {...response};
                    this.$vs.loading.close();
                });
            },
            formatPrice(value) {
                let val = (value / 1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            historico() {
                this.$router.push({path: `/campanha/configurar-boleto/${this.$route.params.id}/historico-envios`})
            },
            contatos(val) {
                this.$router.push({path: `/campanha/configurar-boleto/${this.$route.params.id}/contatos-${val}`});
            },
        },
        computed: {
            isValid() {
                return this.errors.any();
            },
            valortotal: function(){
              let sum = 0;
              return this.campanha.transacaos.reduce(function(prev, item){
                return sum + item.full_price;
              },0);
            }
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
        top: .7rem;
        right: 30px;
        cursor: pointer;
    }

    #copy-icon-input {
        position: absolute;
        top: 2.2rem;
        right: 30px;
        cursor: pointer;
    }
</style>
