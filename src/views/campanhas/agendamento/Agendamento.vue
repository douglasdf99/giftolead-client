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
                        <span class="font-regular mb-2">Descrição</span>
                        <vs-textarea v-model="campanha.descricao" id="text-area" class="w-full bg-white" rows="6"/>
                    </div>
                    <div class="vx-col w-full mb-4">
                        <span class="font-regular mb-2">Página de Obrigado</span>
                        <vs-input class="w-full" id="search_input_trans" v-model="campanha.checkout"
                                  placeholder="https://" size="large" name="nome" v-validate="'required'"/>
                    </div>
                    <div class="vx-col w-full lg:w-1/2 mb-3">
                        <span class="font-regular mb-2">Origem</span>
                        <v-select v-model="selectedOrigem" :class="'select-large-base'" :clearable="false"
                                  style="background-color: white"
                                  :options="origens" v-validate="'required'" name="origem"/>
                        <span class="text-danger text-sm" v-show="errors.has('origem')">Obrigatório selecionar uma origem</span>
                    </div>
                    <div class="vx-col w-full lg:w-1/2 mb-3">
                        <span class="font-regular mb-2">Dúvida</span>
                        <v-select v-model="selectedDuvida" :class="'select-large-base'" :clearable="false"
                                  style="background-color: white"
                                  :options="duvidas" v-validate="'required'" name="duvida"/>
                        <span class="text-danger text-sm" v-show="errors.has('duvida')">Obrigatório selecionar uma dúvida</span>
                    </div>
                    <div class="vx-col w-full relative mb-3" v-if="!campanha.infusion">
                        <i class="material-icons text-white mt-5" id="copy-icon" @click="copyText">file_copy</i>
                        <prism language="html" class="rounded-lg">
                            {{codigohtml()}}
                        </prism>
                    </div>
                    <div class="vx-col w-full mb-2">
                        <p class="destaque">
                            Insira o código abaixo em seu projeto
                        </p>
                    </div>
                    <div class="vx-col w-full relative" v-if="!campanha.infusion">
                        <i class="material-icons text-black mt-5" id="copy-icon" @click="copyScripts">file_copy</i>
                        <div class="w-full bg-white rounded-lg p-5">
                            <p class="font-regular text-lg" v-for="val in scripts">
                                {{val}}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="vx-row">
                    <div class="vx-col w-full">
                        <div class="my-8">
                            <vs-checkbox color="dark" v-model="campanha.infusion"><span class="label-bold-underline">Utilizar minha ferramenta de e-mail</span>
                            </vs-checkbox>
                            <small class="flex mt-2 ml-3"><i class="material-icons text-base mr-2">info_outline</i>Esta
                                opção habilita a a associação com sua ferramenta de e-mail
                            </small>
                        </div>
                    </div>
                </div>
                <vx-card class="mb-8">
                    <div class="vx-row mb-6" v-if="campanha.infusion">
                        <div class="vx-col w-full ">
                            <h5 class="mb-4">Campos do Formulário</h5>
                            <div class="vx-row">
                                <div class="vx-col sm:w-1/3 w-full mb-2">
                                    <span class="font-regular mb-2">Campo Nome</span>
                                    <vs-input class="w-full" v-validate="'required'" name="campo_nome"
                                              v-model="campanha.campo_nome" size="large"/>
                                    <span class="text-danger text-sm" v-show="errors.has('campo_nome')">{{ errors.first('campo_nome') }}</span>
                                </div>

                                <div class="vx-col sm:w-1/3 w-full mb-2">
                                    <span class="font-regular mb-2">Campo Email</span>
                                    <vs-input class="w-full" v-validate="'required'" name="campo_email"
                                              v-model="campanha.campo_email" size="large"/>
                                    <span class="text-danger text-sm" v-show="errors.has('campo_email')">{{ errors.first('campo_email') }}</span>
                                </div>

                                <div class="vx-col sm:w-1/3 w-full mb-2">
                                    <span class="font-regular mb-2">Campo Whatsapp</span>
                                    <vs-input class="w-full" v-validate="'required'" name="campo_whatsapp"
                                              v-model="campanha.campo_whatsapp" size="large"/>
                                    <span class="text-danger text-sm" v-show="errors.has('campo_whatsapp')">{{ errors.first('campo_whatsapp') }}</span>
                                </div>
                                <div class="vx-col sm:w-1/3 w-full mb-2">
                                    <span class="font-regular mb-2">Campo Origem</span>
                                    <vs-input class="w-full" v-validate="'required'" name="campo_origem"
                                              v-model="campanha.campo_origem" size="large"/>
                                    <span class="text-danger text-sm" v-show="errors.has('campo_origem')">{{ errors.first('campo_origem') }}</span>
                                </div>
                                <div class="vx-col sm:w-1/3 w-full mb-2">
                                    <span class="font-regular mb-2">Campo Dúvida</span>
                                    <vs-input class="w-full" v-validate="'required'" name="campo_duvida"
                                              v-model="campanha.campo_duvida" size="large"/>
                                    <span class="text-danger text-sm" v-show="errors.has('campo_duvida')">{{ errors.first('campo_duvida') }}</span>
                                </div>
                                <div class="vx-col sm:w-1/3 w-full mb-2">
                                    <span class="font-regular mb-2">Campo Data do Agendamento</span>
                                    <vs-input class="w-full" v-validate="'required'" name="campo_data_agendamento"
                                              v-model="campanha.campo_data_agendamento" size="large"/>
                                    <span class="text-danger text-sm" v-show="errors.has('campo_data_agendamento')">{{ errors.first('campo_data_agendamento') }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </vx-card>
                <div class="vx-row">
                    <div class="vx-col w-full" v-if="campanha.infusion">
                        <img src="@/assets/images/util/infusion-help.png" class="border-dark shadow mb-3" width="100%">
                        <p class="flex mb-2 ml-3 font-bold text-warning">
                            <i class="material-icons text-base mr-2">info_outline</i>Insira esta URL como sua página de
                            obrigado e marque o checkbox que se encontra logo abaixo. Veja no exemplo acima.
                        </p>
                        <div class="w-full relative">
                            <span class="font-regular mb-2">Url Infusion:</span>
                            <vs-input class="w-full mb-4"
                                      :value="this.url_api('campanhaagendamento/'+this.campanha.token).substr(0, 65) + '...'"
                                      placeholder="https://" size="large" name="urlInfusion"
                                      id="urlInfusion" disabled/>
                            <i class="material-icons" id="copy-icon-input" @click="copyUrl">file_copy</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full lg:w-5/12">
                <div class="vx-row">
                    <div class="vx-col w-full mb-4">
                        <vx-card style="box-shadow: none">
                            <span class="destaque">Nº de contatos pendentes</span>
                            <p class="font-bold text-3xl my-5">{{campanha.contatos_pendentes_count}}</p>
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
                            <vs-button class="mr-3" color="primary" type="filled" @click="salvar" :disabled="!isValid">
                                Salvar
                            </vs-button>
                            <!--<vs-button icon-pack="material-icons" icon="email" class="mr-3" color="dark" type="flat"
                                       @click="$router.push({path: '/campanha/configurar_checkout/' + campanha.id + '/emails'})" v-if="campanha.id">
                                Configurar e-mails da campanha
                            </vs-button>-->
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
    import moduleCampAgendamentos from "@/store/campanha_agendamento/moduleCampAgendamentos";
    import Prism from 'vue-prism-component'
    import moduleOrigens from "../../../store/origens/moduleOrigens";
    import moduleDuvidas from "../../../store/tipoDuvida/moduleDuvidas";

    export default {
        name: "Agendamento",
        components: {
            'v-select': vSelect,
            Prism
        },
        created() {
            if (!moduleCampAgendamentos.isRegistered) {
                this.$store.registerModule('agendamento', moduleCampAgendamentos)
                moduleCampAgendamentos.isRegistered = true
            }

            if (!moduleOrigens.isRegistered) {
                this.$store.registerModule('origens', moduleOrigens)
                moduleOrigens.isRegistered = true
            }

            if (!moduleDuvidas.isRegistered) {
                this.$store.registerModule('duvidas', moduleDuvidas)
                moduleDuvidas.isRegistered = true
            }
            this.getOpcoes().then(() => this.getId(this.$route.params.id));

            var scripts = [
                "https://cdn.jsdelivr.net/jquery/latest/jquery.min.js",
                "https://cdn.jsdelivr.net/momentjs/latest/moment.min.js",
                'https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js',
                'https://api.saveleads.com.br/js/formularioAgendamento.js'
            ];
            scripts.forEach((script, index)=> {
                let tag = document.createElement("script");
                tag.setAttribute("type", 'text/javascript');
                tag.setAttribute("src", script);
                console.log(tag.outerHTML);
                this.scripts.push(tag.outerHTML)
            });

            let link = document.createElement('link');
            link.setAttribute("type", 'text/css');
            link.setAttribute("rel", 'stylesheet');
            link.setAttribute("href", 'https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css');

            this.scripts.push(link.outerHTML);
        },
        data() {
            return {
                campanha: {
                    nome: '',
                    produto: '',
                    status: null,
                    checkout: '',
                    infusion: false
                },
                customcor: '',
                html: '',
                origens: [],
                selectedOrigem: {id: '', text: ''},
                duvidas: [],
                selectedDuvida: {id: '', text: ''},
                scripts: []
            }
        },
        methods: {
            salvar() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.$vs.loading();

                        this.campanha.origem_id = this.selectedOrigem.id;
                        this.campanha.tipo_duvida_id = this.selectedDuvida.id;

                        this.campanha.plano_id = this.$route.params.id;
                        this.campanha._method = 'PUT';
                        this.campanha.infusion = this.campanha.infusion == "" ? false : true;
                        if (this.campanha.id !== undefined) {
                            this.$store.dispatch('agendamento/update', {
                                id: this.campanha.id,
                                dados: this.campanha
                            }).then(response => {
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
                            this.$store.dispatch('agendamento/store', this.campanha).then(response => {
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
            codigohtml() {
                this.html = `
<form accept-charset="UTF - 8" action="${this.url_api('campanhaagendamento/' + this.campanha.token)}" id="formulario-saveleads" method="POST">
    <label for="nome">Nome</label>
    <input type="text" name="nome" id="nome" placeholder="Nome completo">
    <label for="email">E-mail</label>
    <input type="email" name="email" id="email" placeholder="Insira seu melhor e-mail">
    <label for="email">Whatsapp</label>
    <input type="text" name="telefone" id="telefone" placeholder="Insira seu Whatsapp">
    <input type="hidden" name="origem" id="origem" value="${this.selectedOrigem.id}">
    <input type="hidden" name="duvida" id="duvida" value="${this.selectedDuvida.id}">
    <input type="text" name="data_agendamento" value="Clique aqui"/>
    <button type="submit">Enviar</button>

    <!-- Biblioteca do Datepicker https://www.daterangepicker.com/ -->
</form>`;
                return this.html;
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
                this.$store.dispatch('agendamento/getId', id).then(response => {
                    this.campanha = {...response};

                    if (this.campanha.origem_id != null)
                        this.selectedOrigem.id = this.campanha.origem_id;

                    if (this.campanha.tipo_duvida_id != null)
                        this.selectedDuvida.id = this.campanha.tipo_duvida_id;

                    if (this.campanha.infusion == "0")
                        this.campanha.infusion = false;
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
            },
            copyScripts() {
                const thisIns = this;
                let str = ''
                this.scripts.forEach(val => {
                    str += val + '\n';
                });
                this.$copyText(str).then(function () {
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
                let value = this.url_api('campanhaagendamento/' + this.campanha.token);
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
            getOpcoes() {
                return new Promise((resolve, reject) => {
                    this.origens = [];
                    this.$store.dispatch('origens/get').then(response => {
                        let arr = [...response];
                        arr.forEach(item => {
                            this.origens.push({id: item.id, label: item.nome})
                        });
                    });

                    this.duvidas = [];
                    this.$store.dispatch('duvidas/get').then(response => {
                        let arr = [...response];
                        arr.forEach(item => {
                            this.duvidas.push({id: item.id, label: item.nome})
                        });
                    })

                    resolve();
                });
            },
        },
        computed: {
            isValid() {
                return this.errors.any() && (this.selectedOrigem.id != '' && this.selectedDuvida.id != '');
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

    #copy-icon-input {
        position: absolute;
        top: 2.2rem;
        right: 30px;
        cursor: pointer;
    }
</style>
