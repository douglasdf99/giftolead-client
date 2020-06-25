<template>
    <div>
        <div class="vx-row">
            <div class="vx-col w-full mb-5">
                <p class="destaque">Configure o período de envio depois do último e-mail enviado</p>
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
                                          v-model="email.unidade_tempo" v-validate="'required|min_value:1'" size="large"/>
                                <span class="text-primary text-xs">{{periodoDisponivel}}</span><br>
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
                        <li class="variavel" @click="addVarText('[NOME_PRODUTO]')">
                            <span>Nome do Produto</span>
                        </li>
                        <li class="variavel" @click="addVarText('[WHATSAPP]')">
                            <span>Whatsapp</span>
                        </li>
                        <li class="variavel" @click="addLinkCheckoutVarText">
                            <span>Links de venda</span>
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
        <vs-prompt
                @cancel="clearValMultiple"
                @accept="selectLink"
                @close="close"
                :acceptText="'Salvar'"
                :cancelText="'Cancelar'"
                title="Selecionar link"
                :max-width="'600px'"
                :active.sync="modal">
            <div class="con-exemple-prompt">
                <div class="mt-3">
                    <span class="font-regular mb-2">Link</span>
                    <v-select v-model="linkSelected" class="mt-4 mb-2" :class="'select-large-base'" :clearable="false"
                              :options="links" v-validate="'required'" name="tipo"/>
                </div>
            </div>
        </vs-prompt>
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
            if (!moduleCampCheckouts.isRegistered) {
                this.$store.registerModule('checkout', moduleCampCheckouts)
                moduleCampCheckouts.isRegistered = true
            }
            if (this.$route.name === 'campanha-config-checkout-emails-editar')
                this.getId(this.$route.params.idEmail);
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
                periodoNum: '',
                periodoSelected: {id: 1, label: 'minutos'},
                periodosTipo: [
                    {id: 1, label: 'minutos'},
                    {id: 60, label: 'horas'},
                    {id: 1440, label: 'dias'},
                ],
                somaPeriodo: 0,
                modal: false,
                links: [],
                linkSelected: {}
            }
        },
        methods: {
            addLinkCheckoutVarText(){
                this.modal = true;
            },
            clearValMultiple() {
                this.linkSelected = {id: null, label: 'Selecione o link'};
            },
            selectLink() {
                this.addVarText('[LINK_' + this.linkSelected.id + ']');
                this.linkSelected = {id: null, label: 'Selecione o link'};
            },
            close() {
                this.modal = false;
            },
            validar() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        if (this.$route.name === 'campanha-config-checkout-emails-editar' && this.email.campanha.contatos.length > 0) {
                            this.$vs.dialog({
                                color: 'primary',
                                title: `Atenção`,
                                type: 'alert',
                                text: ' Este e-mail só será enviado ao contato caso o período selecionado seja maior do que o último e-mail que ele recebeu.',
                                acceptText: 'Ok',
                                buttonCancel: false,
                                accept: () => {
                                    this.validarPeriodo();
                                },
                            })
                        } else {
                            this.validarPeriodo();
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
            validarPeriodo() {
                //Validando o período deste e-mail em relação aos já cadastrados, afim de barrar na excedência de 31 dias
                let somaTotal = this.somaPeriodo + (this.email.unidade_tempo * this.periodoSelected.id)
                if (somaTotal > 44640) {
                    this.$vs.dialog({
                        color: 'danger',
                        title: `Salvamento interrompido`,
                        type: 'alert',
                        text: ' A somatória de todos os períodos cadastrados nos e-mails desta campanha não podem ultrapassar 31 dias (44.640 minutos). Reajuste o período desta configuração e tente novamente.',
                        acceptText: 'Ok',
                        buttonCancel: false,
                    });
                } else {
                    this.salvar()
                }
            },
            salvar() {
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
            },
            onEditorReady(editor) {
                this.editor = editor;
            },
            getId(id) {
                this.$vs.loading();
                this.$store.dispatch('checkout/getEmails', this.$route.params.id).then(response => {
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
                    this.$store.dispatch('getLinks', this.email.campanha.produto_id).then(response => {
                        let arr = [...response];
                        arr.forEach(item => {
                            this.links.push({id: item.identidade, label: item.descricao});
                        });
                        this.linkSelected = {id: null, label: 'Selecione o link'}
                    });
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
