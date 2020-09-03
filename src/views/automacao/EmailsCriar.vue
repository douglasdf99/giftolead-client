<template>
    <div>
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
            <div class="vx-col w-full">
                <div class="mb-3 pt-0">
                    <span class="font-regular">Inserir no corpo da mensagem:</span>
                    <ul class="variaveis-msg flex mx-0">
                        <li class="variavel mx-4" @click="addVarText('[NOME_LEAD]')">
                            <span>Nome do Lead</span>
                        </li>
                        <li class="variavel mx-4" @click="addVarText('[NOME_BRINDE]')">
                            <span>Nome do Brinde</span>
                        </li>
                    </ul>
                </div>
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
            <div class="vx-col w-full lg:w-4/12">
                <preview v-if="$route.params.tipo == 1" :text="email.corpo"></preview>
                <preview2 v-else :text="email.corpo"></preview2>
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
                                       @click="$router.push({path: '/brindes/automacao/emails'})">
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
    import {Validator} from "vee-validate";
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import {quillEditor} from 'vue-quill-editor'
    import moduleAutomacao from "../../store/automacao/moduleAutomacao";
    import preview from './Preview'
    import preview2 from './PreviewRastreio'

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
            quillEditor, preview, preview2
        },
        created() {
            if (!moduleAutomacao.isRegistered) {
                this.$store.registerModule('automacao', moduleAutomacao)
                moduleAutomacao.isRegistered = true
            }
            if (this.$route.name === 'brindes-automacao-emails-editar')
                this.getId(this.$route.params.id);

            //this.getAutomacao();
        },
        data() {
            return {
                email: {
                    periodo: 0,
                    titulo: 'We Do Care - Saveleads',
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
                if(this.$route.name === 'brindes-automacao-emails-criar')
                    this.email.evento = this.$route.params.tipo;
                this.$store.dispatch('automacao/storeEmail', this.email).then(response => {
                    console.log('response', response);
                    this.$vs.notify({
                        title: '',
                        text: (this.email.id !== undefined ? 'Atualizado' : 'Criado') + "Atualizado com sucesso.",
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
                this.$store.dispatch('automacao/getEmailId', id).then(response => {
                    this.email = {...response};
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
            getAutomacao() {
                this.$store.dispatch('automacao/getId', this.$route.params.id).then(response => {
                    this.automacao = {...response};
                });
            },
            getLinks() {
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
