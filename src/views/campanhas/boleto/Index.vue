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
        <div class="vx-row my-5">
            <div class="vx-col col-conquista mb-10">
                <div class="conquista nova cursor-pointer"
                     @click="$router.push({path: '/campanha/configurar-boleto/' + $route.params.id + '/emails/criar'})">
                    <div class="img-plus cursor-pointer">
                        <i class="material-icons">add</i>
                    </div>
                    <p class="nome-conq">
                        Adicionar <br> novo e-mail
                    </p>
                </div>
            </div>
            <div class="vx-col col-conquista mb-10" v-for="(email, index) in campanha.emails">
                <div class="conquista" style="cursor: default !important" v-bind:style="{opacity: (email.status ? '' : '.5')}" v-bind:class="{'desativado': !email.status}">
                    <div class="py-2 w-full flex justify-between">
                        <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="deletar(email.id)"></vs-button>
                        <vs-switch vs-icon-on="check" color="#0FB599" class="float-right switch"
                                   v-model="email.status" @click="ativaEmail(email)"/>
                    </div>
                    <div class="w-full">
                        <img src="@/assets/images/util/e-mail.svg" class="img-conquista my-3" width="120">
                        <p class="nome-conq mb-4 text-base">
                            {{email.unidade_tempo}} {{email.unidade_medida}} depois {{index === 0 ? 'da entrada' : 'do último envio'}}
                        </p>
                    </div>
                    <vs-button color="primary" type="border" class="font-bold"
                               @click="$router.push({path: '/campanha/configurar-boleto/' + email.campanha_id + '/emails/editar/' + email.id})">
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
    import axios from "@/axios.js"
    import moduleCampBoletos from "../../../store/campanha_boleto/moduleCampBoletos";

    export default {
        name: "Checkout",
        components: {
            'v-select': vSelect,
            Prism
        },
        created() {
            if (!moduleCampBoletos.isRegistered) {
                this.$store.registerModule('boleto', moduleCampBoletos)
                moduleCampBoletos.isRegistered = true
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
                countSwitch: []
            }
        },
        mounted() {

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
                        }).finally(()=>{
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
            codigohtml(value) {
                this.html = `
<form accept-charset="UTF - 8" action="${this.url_api('api/campanhacarrinho/' + this.campanha.token)}" id="formulario-saveleads" method="POST">
    <label for="nome">Nome</label>
    <input type="text" name="nome" id="nome" placeholder="Nome completo">
    <label for="email">E-mail</label>
    <input type="email" name="email" id="email" placeholder="Insira seu melhor e-mail">
    <label for="email">Whatsapp</label>
    <input type="text" name="telefone" id="telefone" placeholder="Insira seu Whatsapp">
    <button type="submit">Enviar</button>
</form>
                `;
                return this.html;
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
            },
            copyUrl() {
                const thisIns = this;
                let value = this.url_api('campanhacarrinho/'+this.campanha.token);
                this.$copyText(value).then(function () {
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
            },
            historico() {
                this.$router.push({path: `/campanha/configurar-checkout/${this.$route.params.id}/historico-envios`})
            },
            contatosAtivos(){
                axios.get(`/api/campanha_carrinho_contatos`, {params: {}})
                    .then((response) => {
                        console.log('contatos resgatado', response);
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
