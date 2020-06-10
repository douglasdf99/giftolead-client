<template>
    <div>
        <div class="vx-row">
            <div class="vx-col w-full mb-5">
                <p class="destaque">Configure o período de envio</p>
            </div>
        </div>
        <div class="vx-row mb-4">
            <div class="vx-col lg:w-full w-full">
            <span class="float-right mt-1 mx-4"
                  style="font-weight: bold">{{email.status ? 'Ativado' : 'Desativado'}}</span>
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="email.status" class="float-right switch"/>
            </div>
        </div>
        <div class="vx-row mb-10">
            <div class="vx-col w-full">
                <div class="shadow-none flex items-center justify-around w-full p-5 radius-lg bg-white">
                    <div class="vx-col w-full lg:w-1/12 text-center calendar-col-email">
                        <i class="material-icons primary" style="font-size: 8rem; color: #9344C4">date_range</i>
                    </div>
                    <div class="vx-col w-full lg:w-10/12">
                        <div class="vx-row">
                            <div class="vx-col w-1/2">
                                <span class="font-regular mb-2">Unidade de Tempo</span>
                                <vs-input type="text" @keypress="isNumber" name="periodo" class="w-full"
                                          v-model="email.unidade_tempo" v-validate="'required'" size="large"/>
                                <span class="text-danger text-sm" v-show="errors.has('periodo')">{{ errors.first('periodo') }}</span>
                            </div>
                            <div class="vx-col w-1/2">
                                <span class="font-regular mb-2">Medido em</span>
                                <v-select v-model="periodoSelected" :class="'select-large-base'"
                                          :clearable="false" style="background-color: white; width: 100%"
                                          :options="periodosTipo" v-validate="'required'" name="produto"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="vx-row mb-2">
            <div class="vx-col w-full mb-5">
                <p class="destaque">Configure o e-mail que será enviado</p>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col w-full lg:w-8/12">
                <span class="font-regular mb-2">Assunto do e-mail que será enviado</span>
                <vs-input type="text" name="assunto" class="w-full"
                          v-model="email.assunto" v-validate="'required'" size="large"/>
                <span class="text-danger text-sm" v-show="errors.has('assunto')">{{ errors.first('assunto') }}</span>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col w-full xlg:w-8/12 lg:w-8/12">
                <div class="vx-row mb-3">
                    <div class="vx-col w-full">
                        <span class="font-regular mb-2">Mensagem</span>
                        <quill-editor id="quill-editor" v-model="email.corpo" class="bg-white"
                                      @ready="onEditorReady($event)"></quill-editor>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full xlg:w-4/12 lg:w-4/12">
                <div class="mb-3 p-5 pt-0">
                    <span class="font-regular">Inserir no corpo da mensagem:</span>
                    <ul class="variaveis-msg">
                        <li class="variavel" @click="addVarText('[NOME_LEAD]')">
                            <span>Nome do Lead</span>
                        </li>
                        <li class="variavel" @click="addVarText('[NOME_ATENDENTE]')">
                            <span>Nome do Atendente</span>
                        </li>
                        <li class="variavel" @click="addVarText('[NOME_PRODUTO]')">
                            <span>Nome do Produto</span>
                        </li>
                        <li class="variavel" @click="addVarText('[NOME_BRINDE]')">
                            <span>Nome do Brinde</span>
                        </li>
                        <li class="variavel" @click="addVarText('[LINK_BOLETO]')">
                            <span>Link do Boleto</span>
                        </li>
                        <li class="variavel" @click="addVarText('[LINK_WHATSAPP]')">
                            <span>Link do Whatsapp</span>
                        </li>
                        <li class="variavel" @click="addVarText('[LINK_CHECKOUT]')">
                            <span>Link do Checkout</span>
                        </li>
                    </ul>
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
                                       @click="$router.push({path: '/campanha/configurar-checkout/' + $route.params.id + '/emails'})">
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
    import {Validator} from "vee-validate";
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import {quillEditor} from 'vue-quill-editor'

    const dict = {
        custom: {
            periodo: {
                required: 'Por favor, insira o período que deseja enviar a mensagem',
            },
            assunto: {
                required: 'Por favor, insira o assunto do e-mail',
            },
        }
    };
    Validator.localize('pt-br', dict);

    export default {
        name: "EmailsCriar",
        components: {
            'v-select': vSelect,
            quillEditor
        },
        created() {
            if (!moduleCampCheckouts.isRegistered) {
                this.$store.registerModule('checkout', moduleCampCheckouts)
                moduleCampCheckouts.isRegistered = true
            }
            if (this.$route.name === 'campanha-config-checkout-emails-editar');
                this.getId(this.$route.params.idEmail);
        },
        data() {
            return {
                email: {
                    periodo: 0,
                    assunto: '',
                    corpo: '',
                    status: null,
                    unidade_tempo: 0,
                    unidade_medida: ''
                },
                periodoNum: '',
                periodoSelected: {id: 1, label: 'minutos'},
                periodosTipo: [
                    {id: 1, label: 'minutos'},
                    {id: 60, label: 'horas'},
                    {id: 1440, label: 'dias'},
                ]
            }
        },
        methods: {
            salvar() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.$vs.loading();
                        this.email.campanha_id = this.$route.params.id;
                        this.email.periodo = this.email.unidade_tempo * this.periodoSelected.id;
                        this.email.unidade_medida = this.periodoSelected.label;
                        console.log('email aí', this.email)
                        if (this.email.id !== undefined) {
                            this.email._method = 'PUT';
                            this.$store.dispatch('checkout/updateEmail', {
                                id: this.email.id,
                                dados: this.email
                            }).then(response => {
                                console.log('response', response);
                                this.$vs.notify({
                                    title: '',
                                    text: "Atualizado com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });
                                this.$router.push({path: '/campanha/configurar-checkout/' + this.$route.params.id + '/emails'})
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
                            this.$store.dispatch('checkout/storeEmail', this.email).then(response => {
                                console.log('response', response);
                                this.$vs.notify({
                                    title: '',
                                    text: "Criado com sucesso.",
                                    iconPack: 'feather',
                                    icon: 'icon-check-circle',
                                    color: 'success'
                                });
                                this.$router.push({path: '/campanha/configurar-checkout/' + this.$route.params.id + '/emails'})
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
            onEditorReady(editor) {
                this.editor = editor;
            },
            getId(id) {
                this.$vs.loading();
                this.$store.dispatch('checkout/getEmailId', id).then(response => {
                    this.email = {...response};
                    switch (this.email.unidade_medida) {
                        case 'dias':
                            this.periodoSelected = {id: 1440, label: 'dias'}
                            break;
                        case 'horas':
                            this.periodoSelected = {id: 60, label: 'horas'}
                            break;
                        default:
                            this.periodoSelected = {id: 1, label: 'minutos'}
                    }
                    this.$vs.loading.close();
                });
            },
            formatPrice(value) {
                let val = (value / 1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            addVarText(value) {
                //Quill Editor
                var $txt2 = this.editor.getSelection(true);
                this.editor.insertText($txt2.index, value, '', true);
            },
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

    @media (max-width: 768px) {
        .calendar-col-email {
            display: none;
        }
    }
</style>
