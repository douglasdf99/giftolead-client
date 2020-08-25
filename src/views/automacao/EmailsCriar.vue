<template>
    <div>
        <div class="vx-row">
            <div class="vx-col w-full mb-5">
                <p class="destaque">Configure tipo de envio depois do último e-mail enviado</p>
            </div>
        </div>
        <!--<div class="vx-row mb-4">
            <div class="vx-col lg:w-full w-full">
            <span class="float-right mt-1 mx-4"
                  style="font-weight: bold">{{email.status ? 'Ativado' : 'Desativado'}}</span>
                <vs-switch vs-icon-on="check" color="#0FB599" v-model="email.status" class="float-right switch"/>
            </div>
        </div>-->
        <div class="vx-row mb-10">
            <div class="vx-col w-full">
                <div class="shadow-none flex items-center justify-around w-full p-5 radius-lg bg-white">
                    <div class="vx-col w-full lg:w-1/12 text-center calendar-col-email">
                        <i class="material-icons primary" style="font-size: 8rem; color: #9344C4">announcement</i>
                    </div>
                    <div class="vx-col w-full lg:w-10/12">
                        <div class="vx-row">
                            <div class="vx-col w-full">
                                <span class="font-regular mb-2">Evento</span>
                                <v-select v-model="selectedEvento" :class="'select-large-base'"
                                          :clearable="false" style="background-color: white; width: 100%"
                                          :options="eventos" v-validate="'required'" name="produto"/>
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
            <div class="vx-col w-full lg:w-3/12">
                <span class="font-regular mb-2">Nome do Remetente:</span>
                <vs-input type="text" name="titulo" class="w-full"
                          v-model="email.titulo" v-validate="'required'" size="large"/>
                <span class="text-danger text-sm" v-show="errors.has('titulo')">{{ errors.first('titulo') }}</span>
            </div>
            <div class="vx-col w-full lg:w-3/12">
                <span class="font-regular mb-2">Responder a:</span>
                <vs-input type="email" name="responder" class="w-full"
                          v-model="email.responder" v-validate="'required|email'" size="large"/>
                <span class="text-danger text-sm" v-show="errors.has('responder')">{{ errors.first('responder') }}</span>
            </div>
            <div class="vx-col w-full lg:w-6/12">
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
                        <li class="variavel" @click="addVarText('[NOME_BRINDE]')">
                            <span>Nome do Brinde</span>
                        </li>
                        <li class="variavel" @click="addVarText('[COD_RASTREIO]')">
                            <span>Código de Rastreio</span>
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
                            <vs-button class="mr-3" color="primary" type="filled" @click="validar" :disabled="isValid">
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
    import moduleAutomacao from "../../store/automacao/moduleAutomacao";

    const dict = {
        custom: {
            periodo: {
                required: 'Por favor, insira o período que deseja enviar a mensagem',
                min_value: 'O valor minimo é de 1',
            },
            assunto: {
                required: 'Por favor, insira o assunto do e-mail',
            },
            responder: {
                required: 'Por favor, insira o email que irá receber a resposta',
                email: 'Por favor, insira um email válido'
            },
            titulo: {
                required: 'Por favor, insira o título do e-mail',
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
            if (!moduleAutomacao.isRegistered) {
                this.$store.registerModule('automacao', moduleAutomacao)
                moduleAutomacao.isRegistered = true
            }
            if (this.$route.name === 'brinde-automacao-emails-editar')
                this.getId(this.$route.params.idEmail);

            this.getAutomacao();
        },
        data() {
            return {
                email: {
                    periodo: 0,
                    titulo: '',
                    responder: '',
                    assunto: '',
                    corpo: '',
                    status: true,
                    unidade_tempo: 0,
                    unidade_medida: ''
                },
                campanha: {
                    produto: {}
                },
                selectedEvento: {id: null, label: 'Selecione o evento'},
                eventos: [
                    {id: 1, label: 'ao entrar'},
                    {id: 2, label: 'ao receber objeto'},
                ],
            }
        },
        methods: {
            validar() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        /*if (this.$route.name === 'campanha-config-checkout-emails-editar' && this.email.campanha.contatos.length > 0) {*/
                            this.$vs.dialog({
                                color: 'primary',
                                title: `Atenção`,
                                type: 'confirm',
                                text: 'Você tem certeza que deseja criar este e-mail?',
                                acceptText: 'Sim',
                                cancelText: 'Cancelar',
                                buttonCancel: false,
                                accept: () => {
                                    this.salvar();
                                },
                            });
                        /*} else {
                            this.salvar();
                        }*/
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
            salvar() {
                this.$vs.loading();
                this.email.evento = this.selectedEvento.id;
                console.log('email aí', this.email)
                if (this.email.id !== undefined) {
                    this.email._method = 'PUT';
                    this.$store.dispatch('automacao/updateEmail', {
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
                        this.$router.push({path: '/brindes/automacao/emails'});
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
                    this.$store.dispatch('automacao/storeEmail', this.email).then(response => {
                        console.log('response', response);
                        this.$vs.notify({
                            title: '',
                            text: "Criado com sucesso.",
                            iconPack: 'feather',
                            icon: 'icon-check-circle',
                            color: 'success'
                        });
                        this.$router.push({path: '/brindes/automacao/emails'});
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
            },
            onEditorReady(editor) {
                this.editor = editor;
            },
            getId(id) {
                this.$vs.loading();
                this.$store.dispatch('automacao/getEmails', this.$route.params.id).then(response => {
                    let arr = response;
                    arr.forEach(item => {
                        //Somando os períodos cadastrados nos outros e-mails, desconsiderando o que está sendo editado
                        if (this.$route.name === 'campanha-config-checkout-emails-editar') {
                            if (item.id != this.$route.params.idEmail && item.status)
                                this.somaPeriodo += item.periodo;
                        } else {
                            //Somando os períodos cadastrados nos outros e-mails
                            this.somaPeriodo += item.periodo;
                        }
                    });
                    console.log('somaperiodo', this.somaPeriodo)
                });
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
                    console.log('chou aqui')
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
            getAutomacao(){
                this.$store.dispatch('checkout/getId', this.$route.params.id).then(response => {
                    this.campanha = {...response};
                    this.getLinks();
                });
            },
            getLinks(){
                this.$store.dispatch('getLinks', this.campanha.produto_id).then(response => {
                    console.log('chou aqui 2', response)
                    let arr = [...response];
                    arr.forEach(item => {
                        this.links.push({id: item.identidade, label: item.descricao});
                    });
                    this.selectedLink = {id: null, label: 'Selecione o link'}
                });
            }
        },
        computed: {
            isValid() {
                return this.errors.any();
            },
            periodoDisponivel() {
                let dias = 0;
                let horas = 0;
                let mins = 0;
                let periodoDisponivel = 44640 - this.somaPeriodo;

                dias = (periodoDisponivel / 1440);//Descobrindo quantidade de dias
                //Se existem minutos para serem calculados, considerando o período de minutos que está disponível
                if ((periodoDisponivel - (parseInt(dias) * 1440)) > 0) {
                    let restoDias = periodoDisponivel - (parseInt(dias) * 1440);
                    horas = restoDias / 60;
                    let restoHoras = horas - parseInt(horas);
                    mins = restoHoras * 60;
                }

                //return parseInt(sobra / 1440);
                return `Você possui ${parseInt(dias)} dias, ${parseInt(horas)} horas e ${parseInt(mins)} minutos disponíveis para usar no período desta campanha.`
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
        top: 0.7rem;
        right: 30px;
        cursor: pointer;
    }

    @media (max-width: 768px) {
        .calendar-col-email {
            display: none;
        }
    }

    .ql-image {
        display: none !important;
    }
</style>
