<template>
    <div>
        <div class="vx-row mb-4">
            <div class="vx-col lg:w-full w-full">
            <span class="float-right mt-1 mx-4"
                  style="font-weight: bold">{{plano.status ? 'Ativado' : 'Desativado'}}</span>
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="plano.status" class="float-right switch"/>
            </div>
        </div>
        <div class="vx-row mb-3">
            <div class="vx-col w-full">
                <span class="font-regular mb-2">Nome do Plano</span>
                <vs-input class="w-full" v-model="plano.nome" size="large" v-validate="'required'" name="nome"/>
                <span class="text-danger text-sm" v-show="errors.has('nome')">{{ errors.first('nome') }}</span>
            </div>
        </div>
        <vs-divider class="my-10"/>
        <div class="list-campanha-plano">
            <div class="vx-row">
                <div class="vx-col w-full mb-10">
                    <p class="destaque">Configure a estrutura do seu plano de recuperação</p>
                </div>
            </div>
            <div class="vx-row">
                <div class="vx-col col-conquista mb-10">
                    <div class="conquista nova cursor-pointer"
                         @click="$router.push({path: '/planos/gerenciar/' + plano.id + '/campanha/criar'})">
                        <div class="img-plus cursor-pointer">
                            <i class="material-icons">add</i>
                        </div>
                        <p class="nome-conq">
                            Adicionar nova campanha
                        </p>
                    </div>
                </div>
                <div class="vx-col col-conquista mb-10" v-for="campanha in plano.campanhas">
                    <div class="conquista" v-bind:class="{'desativado': !campanha.campanhable.status}">
                        <div class="py-2 w-full flex justify-between">
                            <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="deletar(campanha.id)"></vs-button>
                            <vs-switch vs-icon-on="check" color="#0FB599" v-model="campanha.campanhable.status"
                                       class="float-right switch" @click="ativaCampanha(campanha.campanhable, campanha.campanhable_type)"/>
                        </div>
                        <div class="conquista-clicavel w-full cursor-pointer" @click="configurarCampanha(campanha)">
                            <img src="@/assets/images/util/checkout.svg" class="img-conquista rounded-none my-8" width="120" v-if="campanha.campanhable_type == `App\\Models\\CampanhaCarrinho`">
                            <img src="@/assets/images/util/agendamento.svg" class="img-conquista rounded-none my-8" width="120" v-if="campanha.campanhable_type == `App\\Models\\CampanhaAgendamento`">
                            <img src="@/assets/images/util/boleto.svg" class="img-conquista rounded-none my-8" width="120" v-if="campanha.campanhable_type == `App\\Models\\CampanhaBoleto`">
                            <img src="@/assets/images/util/whatsapp.svg" class="img-conquista rounded-none my-8" width="120" v-if="campanha.campanhable_type == `App\\Models\\CampanhaWhatsapp`">
                            <img src="@/assets/images/util/cancelado.svg" class="img-conquista rounded-none my-8" width="145" v-if="campanha.campanhable_type == `App\\Models\\CampanhaCancelado`">
                            <p class="nome-conq">
                                {{campanha.campanhable.nome}}
                            </p>
                            <small>{{campanha.campanhable.produto.nome}}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <transition name="fade" v-if="(nomeAntigo != plano.nome) || (statusAntigo != plano.status)">
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
    import vSelect from 'vue-select';
    import moduleContas from '@/store/contas/moduleContas.js';
    import moduleProdutos from '@/store/produtos/moduleProdutos.js';
    import modulePlanos from '@/store/planos/modulePlanos.js';
    import {Validator} from 'vee-validate';
    import saveleadsConfig from "../../../saveleadsConfig";
    import moduleCampanhas from "../../store/campanhas/moduleCampanhas";

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
            if (!moduleContas.isRegistered) {
                this.$store.registerModule('contas', moduleContas)
                moduleContas.isRegistered = true
            }
            if (!moduleProdutos.isRegistered) {
                this.$store.registerModule('produtos', moduleProdutos)
                moduleProdutos.isRegistered = true
            }
            if (!modulePlanos.isRegistered) {
                this.$store.registerModule('planos', modulePlanos)
                modulePlanos.isRegistered = true
            }
            if (!moduleCampanhas.isRegistered) {
                this.$store.registerModule('campanhas', moduleCampanhas)
                moduleCampanhas.isRegistered = true
            }

            if (this.$route.name === 'planos-gerenciar') {
                this.getPlano(this.$route.params.id);
            } else {
                this.plano.preco = true;
            }
        },
        data() {
            return {
                plano: {
                    nome: '',
                    status: 1,
                },
                countSwitch: [],
                nomeAntigo: '',
                statusAntigo: '',
                url: saveleadsConfig.url_api,
            }
        },
        methods: {
            salvar() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        if (this.plano.id !== undefined) {//Atualizando o plano
                            const obj = {...this.plano};
                            obj._method = 'PUT';
                            obj.status = obj.status ? 1 : 0;
                            //Caso esteja desativando um plano
                            if(!obj.status && this.statusAntigo){
                                this.$vs.dialog({
                                    color: 'danger',
                                    title: `Deseja mesmo desativar este plano?`,
                                    text: 'Ao desativar este plano, todas as campanhas vinculadas a ele também serão desativadas.',
                                    acceptText: 'Sim, desativar!',
                                    cancelText: 'Cancelar',
                                    accept: () => {
                                        this.$vs.loading();
                                        this.$store.dispatch("updateItem", {rota: 'planos', item: obj}).then(() => {
                                            this.$vs.notify({
                                                title: 'Sucesso',
                                                text: "Atualizado com sucesso.",
                                                iconPack: 'feather',
                                                icon: 'icon-check-circle',
                                                color: 'success'
                                            });
                                            this.getPlano(this.$route.params.id);
                                        }).catch(erro => {
                                            this.$vs.notify({
                                                title: 'Error',
                                                text: erro.message,
                                                iconPack: 'feather',
                                                icon: 'icon-alert-circle',
                                                color: 'danger'
                                            })
                                        })
                                    },
                                    cancel: () => {}
                                })
                            } else {//Alteração normal
                                this.$store.dispatch("updateItem", {rota: 'planos', item: obj}).then(() => {
                                    this.$vs.notify({
                                        title: 'Sucesso',
                                        text: "Atualizado com sucesso.",
                                        iconPack: 'feather',
                                        icon: 'icon-check-circle',
                                        color: 'success'
                                    });
                                    this.$vs.loading.close();
                                    this.getPlano(this.$route.params.id);
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
                        } else {//Criando um novo
                            this.$store.dispatch('planos/store', this.plano).then(response => {
                                console.log('response', response);
                                this.$vs.notify({
                                    title: 'Sucesso',
                                    text: "Criado com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });
                                this.$router.push({name: 'meus-planos'});
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
                        this.$vs.loading.close();
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
                        this.$store.dispatch('deleteItem', {id: id, rota: ''}).then(() => {
                            this.$vs.notify({
                                color: 'success',
                                title: 'Sucesso',
                                text: 'Deletado com sucesso'
                            });
                            this.getItems();
                        }).catch(erro => {
                            console.log(erro)
                            this.$vs.notify({
                                color: 'danger',
                                title: 'Erro',
                                text: 'Algo deu errado ao deletar. Contate o suporte.'
                            })
                        })
                    }
                })
            },
            ativaCampanha(e, tipo) {
                var dados = {
                    status: !e.status,
                    _method: 'PUT'
                };
                console.log(e.status)
                if (this.countSwitch[e.id] !== undefined && this.countSwitch[e.id] === 3) {
                    e.status = !e.status;
                    this.$vs.notify({
                        title: '',
                        text: 'Muitas tentativas de ativação',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                } else {
                    let rota = '';
                    switch (tipo) {
                        case 'App\\Models\\CampanhaCarrinho':
                            rota = 'campanha_carrinhos';
                            break;
                        case 'App\\Models\\CampanhaAgendamento':
                            rota = 'campanha_agendamento';
                            break;
                        case 'App\\Models\\CampanhaCancelado':
                            rota = 'campanha_cancelados_ativar';
                            return this.ativaCampanhaEspecifica(e.id, !e.status, rota);
                        case 'App\\Models\\CampanhaBoleto':
                            rota = 'campanha_boletos_ativar';
                            return this.ativaCampanhaEspecifica(e.id, !e.status, rota);
                        case 'App\\Models\\CampanhaWhatsapp':
                            rota = 'campanha_whatsapps';
                            break;
                    }
                    this.$store.dispatch('campanhas/update', {id: e.id, rota: rota, dados: dados}).then(response => {
                        this.$vs.notify({
                            title: '',
                            text: "Sucesso.",
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
                    });
                    this.$vs.loading.close();
                    this.countSwitch[e.id] = this.countSwitch[e.id] !== undefined ? this.countSwitch[e.id] + 1 : 1;
                }
            },
            ativaCampanhaEspecifica(id, status, rota) {
                this.$vs.dialog({
                    color: 'primary',
                    type: 'confirm',
                    title: `Deseja ativar essa campanha?`,
                    text: 'Ao ativar essa campanha, outra campnha desse mesmo tipo e de mesmo produto será desativada.',
                    acceptText: 'Sim, ativar!',
                    accept: () => {
                        this.$store.dispatch('campanhas/ativaEspecifica', {id: id, status: status, rota: rota}).then(() => {
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
                            this.getPlano(this.$route.params.id);
                        });
                    },
                    cancel: () => {
                        this.getPlano(this.$route.params.id);
                    }
                })
            },
            configurarCampanha(item) {
                let rota = '';
                switch (item.campanhable_type) {
                    case 'App\\Models\\CampanhaCarrinho':
                        rota = 'configurar-checkout';
                        break;
                    case 'App\\Models\\CampanhaAgendamento':
                        rota = 'configurar-agendamento';
                        break;
                    case 'App\\Models\\CampanhaCancelado':
                        rota = 'configurar-canceladas';
                        break;
                    case 'App\\Models\\CampanhaBoleto':
                        rota = 'configurar-boleto';
                        break;
                    case 'App\\Models\\CampanhaWhatsapp':
                        rota = 'configurar-whatsapp';
                        break;
                }
                this.$router.push({path: `/campanha/${rota}/${item.campanhable.id}`});
            },
            selecionaTipoComissao(val) {
                this.plano.comissao_tipo = val;
                console.log(this.plano.comissao_tipo)
            },
            getPlano(id) {
                this.$vs.loading()
                this.$store.dispatch('planos/getId', id).then(data => {
                    this.plano = {...data};
                    this.nomeAntigo = data.nome;
                    this.statusAntigo = data.status;
                    this.$vs.loading.close();
                })
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

    .list-campanha-plano.disabled {
        opacity: .5;
        cursor: default !important;
    }
</style>
