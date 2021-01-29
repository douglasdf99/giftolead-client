<template>
    <div>
        <!-- <div class="vx-row mb-4">
           <div class="vx-col lg:w-full w-full">
                 <span class="float-right mt-1 mx-4"
                       style="font-weight: bold">{{campanha.status ? 'Ativado' : 'Desativado'}}</span>
             <vs-switch vs-icon-on="check" color="#0FB599" v-model="campanha.status" class="float-right switch" :disabled="!$acl.check('planos_campanhas_editar')"/>
           </div>
         </div>-->
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
            <div class="vx-col w-full">
                <p class="destaque">Configure como o Ticket chegará para recuperação</p>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col w-4/12">
                <span class="font-regular mb-2">Origem</span>
                <vs-input class="w-full" value="Hotmart" size="large" name="origem" disabled/>
            </div>
            <div class="vx-col w-4/12">
                <span class="font-regular mb-2">Responsável</span>
                <vs-input class="w-full" value="Sistema API" size="large" name="responsavel" disabled/>
            </div>
            <div class="vx-col w-4/12" id="select-duvidas">
                <span class="font-regular mb-2">Dúvida</span>
                <v-select v-model="duvidaSelected" :class="'select-large-base'" :clearable="false"
                          style="background-color: white" :options="opcoesDuvidas" v-validate="'required'" name="duvida"/>
            </div>
        </div>
        <div class="vx-row lg:my-6 sm:my-5">
            <div class="vx-col w-full">
                <p class="destaque text-xl font-bold text-black">
                    Configurando a sua segmentação para automática de Ticket
                </p>
            </div>
        </div>
        <div class="vx-row mb-1">
            <div class="vx-col w-full">
                <v-select multiple :closeOnSelect="false" v-model="tipoSelected"
                          class="select-large-base" :options="opcoesHotmart" style="background-color: white"/>
                <br>
            </div>
        </div>
        <div class="vx-row mt-1 mb-2">
            <div class="vx-col w-full">
                <vs-checkbox color="dark" v-model="campanha.reabertura"><span class="label-bold-underline">Habilitar reabertura do ticket</span>
                </vs-checkbox>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col w-full">
                <div class="p-4 rounded-md" style="background-color: #EDEDED">
                    <p class="text-sm gray">
                        Para que o ticket possa ser criado no sistema é preciso que o lead comprador nào tenha nenhuma transação dada como aprovada no sistema para o mesmo produto desta campanha. Se o ticket de
                        finalização nao estiver no modo de espera o ticket sera finalizado assim que o comprador tiver uma transação dada como aprovada.
                    </p>
                </div>
            </div>
        </div>
        <div class="vx-row my-6">
            <div class="vx-col w-full lg:w-1/3 md:w-1/3 sm:w-full hover-opacidade cursor-pointer">
                <vx-card class="shadow-none " @click="contatos('todos')">
                    <span class="destaque">Nº de contatos</span>
                    <p class="font-bold text-3xl my-5">{{campanha.contatos_fechados_count + campanha.contatos_pendentes_count}}</p>
                </vx-card>
            </div>
            <div class="vx-col w-full lg:w-1/3 md:w-1/3 sm:w-full">
                <vx-card class="shadow-none">
                    <span class="destaque">Valor co-recuperado</span>
                    <p class="font-bold text-3xl my-5">R$ {{formatPrice(campanha.valor_recuperado)}}</p>
                </vx-card>
            </div>
            <div class="vx-col w-full lg:w-1/3 md:w-1/3 sm:w-full">
                <vx-card class="shadow-none">
                    <span class="destaque">Vendas co-recuperadas</span>
                    <p class="font-bold text-3xl my-5">{{campanha.tickets_vendidos.length}} </p>
                </vx-card>
            </div>
            <div class="vx-col mt-5 w-full text-center cursor-pointer" @click="verMaisCards = true" v-if="!verMaisCards">
                <p class="destaque text-primary">Ver mais</p>
            </div>
        </div>
        <transition name="fade">
            <div class="vx-row" v-if="verMaisCards">
                <div class="vx-col w-full lg:w-1/3 md:w-1/3 sm:w-full hover-opacidade cursor-pointer" @click="contatos('ativos')">
                    <vx-card class="shadow-none">
                        <span class="destaque">Nº de contatos pendentes</span>
                        <p class="font-bold text-3xl my-5">{{campanha.contatos_pendentes_count}}</p>
                    </vx-card>
                </div>
                <div class="vx-col w-full lg:w-1/3 md:w-1/3 sm:w-full hover-opacidade cursor-pointer" @click="contatos('inativos')">
                    <vx-card class="shadow-none">
                        <span class="destaque">Nº total de contatos Fechados</span>
                        <p class="font-bold text-3xl my-5">{{campanha.contatos_fechados_count}}</p>
                    </vx-card>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <vs-button class="float-right mr-3" color="dark" type="border" icon-pack="feather" icon="x-circle"
                               @click="$router.push({path: '/planos/gerenciar/' + campanha.campanhas[0].plano_id})">
                        Cancelar
                    </vs-button>
                    <vs-button class="float-right mr-3" color="primary" type="filled" @click="salvar" :disabled="isInvalid && !$acl.check('planos_campanhas_editar')">
                        Salvar
                    </vs-button>
                </div>
            </footer-doug>
        </transition>
    </div>
</template>

<script>
    import vSelect from 'vue-select'
    import Prism from 'vue-prism-component'
    import moduleCampCanceladas from "../../../store/campanha_canceladas/moduleCampCanceladas";
    import moduleOrigens from "../../../store/origens/moduleOrigens";
    import moduleDuvidas from "../../../store/tipoDuvida/moduleDuvidas";
    import moduleUsuario from "../../../store/usuarios/moduleUsuario";

    export default {
        name: "Canceladas",
        components: {
            'v-select': vSelect,
            Prism
        },
        created() {
            if (!moduleCampCanceladas.isRegistered) {
                this.$store.registerModule('canceladas', moduleCampCanceladas)
                moduleCampCanceladas.isRegistered = true
            }
            if (!moduleOrigens.isRegistered) {
                this.$store.registerModule('origens', moduleOrigens)
                moduleOrigens.isRegistered = true
            }
            if (!moduleDuvidas.isRegistered) {
                this.$store.registerModule('duvidas', moduleDuvidas)
                moduleDuvidas.isRegistered = true
            }
            if (!moduleUsuario.isRegistered) {
                this.$store.registerModule('users', moduleUsuario)
                moduleUsuario.isRegistered = true
            }
            this.getId(this.$route.params.id);
            this.getOpcoes()
        },
        data() {
            return {
                campanha: {
                    nome: '',
                    produto: '',
                    status: 0,
                    checkout: '',
                    tipos: [],
                    origem_id: 1,
                    responsavel_id: 1,
                    tickets_vendidos: []
                },
                verMaisCards: false,
                tipoSelected: [],
                opcoesHotmart: [
                    {id: 'canceled', label: 'Cancelado'},
                    {id: 'expired', label: 'Expirado'}
                ],
                hotmartStatus: {
                    canceled: 'Cancelado',
                    expired: 'Expirado'
                },
                opcoesOrigens: [],
                origemSelected: {id: null, text: 'Origem'},
                opcoesDuvidas: [],
                duvidaSelected: {id: null, text: 'Duvida'},
                opcoesResponsaveis: [],
                responsavelSelected: {id: null, text: 'Responsável'},
            }
        },
        methods: {
            contatos(val) {
                this.$router.push({path: `/campanha/configurar-canceladas/${this.$route.params.id}/contatos-${val}`});
            },
            salvar() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.$vs.loading();
                        this.campanha.plano_id = this.campanha.campanhas[0].plano_id;
                        this.campanha.origem_id = 1;
                        this.campanha.responsavel_id = 1;
                        this.campanha._method = 'PUT';
                        this.campanha.tipos = [];
                        this.campanha.tipo_duvida_id = this.duvidaSelected.id
                        this.tipoSelected.forEach(item => {
                            this.campanha.tipos.push(item.id)
                        });
                        if (this.campanha.id !== undefined) {
                            this.$store.dispatch('canceladas/update', {id: this.campanha.id, dados: this.campanha}).then(response => {
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
                                    text: erro.response.data.message,
                                    iconPack: 'feather',
                                    icon: 'icon-alert-circle',
                                    color: 'danger'
                                })
                            })
                        } else {
                            this.$store.dispatch('canceladas/store', this.campanha).then(response => {
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
                                    text: erro.response.data.message,
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
                this.$store.dispatch('canceladas/getId', id).then(response => {
                    this.campanha = {...response};
                    if (this.campanha.tipo_duvida_id) {
                        this.duvidaSelected.id = this.campanha.tipo_duvida.id;
                        this.duvidaSelected.label = this.campanha.tipo_duvida.nome
                    } else {
                        this.duvidaSelected = {id: null, label: 'Dúvida'};
                    }
                    if (this.campanha.tipos) {
                        this.campanha.tipos.forEach(item => {
                            this.tipoSelected.push({id: item, label: this.hotmartStatus[item]});
                        })
                    }

                }).catch(erro => {
                    console.log('front erro', erro.response);
                    //Redirecionando caso 404
                    if (erro.response.status == 404) this.$router.push({name: 'page-error-404', params: {back: 'meus-planos', text: 'Retornar à listagem de Planos'}});
                }).finally(() => this.$vs.loading.close());
            },
            getOpcoes() {
                this.$vs.loading();
                this.$store.dispatch('duvidas/get').then(response => {
                    let arr = response;
                    arr.forEach(item => {
                        this.opcoesDuvidas.push({id: item.id, label: item.nome});
                    });
                });
                /*this.$store.dispatch('origens/get').then(response => {
                    let arr = response;
                    this.origemSelected = {id: 0, label: 'Origem'};
                    arr.forEach(item => {
                        this.opcoesOrigens.push({id: item.id, label: item.nome});
                    });
                });
                this.$store.dispatch('users/get').then(response => {
                    let arr = response;
                    this.responsavelSelected = {id: 0, label: 'Responsável'};
                    arr.forEach(item => {
                        this.opcoesResponsaveis.push({id: item.id, label: item.name});
                    });
                })*/
            },
            formatPrice(value) {
                let val = (value / 1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
        },
        computed: {
            isInvalid() {
                return this.errors.any() || this.duvidaSelected.id == null;
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
