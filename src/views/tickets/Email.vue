<template>
    <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary"
                class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
        <div class="my-6 flex items-center justify-between px-6">
            <h4>Nova mensagem de e-mail</h4>
            <vx-tooltip text="Mensagens Padrão" position="left">
                <vs-dropdown vs-trigger-click>
                    <feather-icon icon="MenuIcon" class="mr-4 cursor-pointer"/>
                    <vs-dropdown-menu class="dropdown-menu-list dropdown-usuario dropdown-chat">
                        <span class="span-identifica-item-dropdown mb-0">Mensagem Padrão</span>
                        <vs-dropdown-item v-for="msg in mensagens" @click="addVarText(msg.mensagem)">
                            <span v-if="msg.tipo === 'email'">{{msg.assunto}}</span>
                        </vs-dropdown-item>
                    </vs-dropdown-menu>
                </vs-dropdown>
            </vx-tooltip>

        </div>
        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-5">
                <div class="vx-row">
                    <!--<div class="vx-col w-full mb-4">
                        <span class="font-regular mb-2">De</span>
                        <vs-input v-validate="'required'" :disabled="true" class="w-full" v-model="email.from" size="large" name="from"/>
                        <span class="text-danger text-sm" v-show="errors.has('from')">Este campo é obrigatório!</span>
                    </div>-->
                    <div class="vx-col w-full mb-4">
                        <span class="font-regular mb-2">Para</span>
                        <vs-input v-validate="'required'" v-if="data.lead" class="w-full" :disabled="true" :value="data.lead.nome + ' <' + data.lead.email + '>'" size="large" name="to"/>
                    </div>
                    <div class="vx-col w-full mb-4">
                        <span class="font-regular mb-2">Assunto</span>
                        <vs-input v-validate="'required'" class="w-full" v-model="email.assunto" size="large"
                                  name="subject"/>
                        <span class="text-danger text-sm"
                              v-show="errors.has('subject')">Este campo é obrigatório!</span>
                    </div>
                </div>
                <div class="vx-row mb-4">
                    <div class="vx-col w-full">
                        <span class="font-regular mb-2">Mensagem</span>
                        <quill-editor id="quill-editor" v-model="email.body" class="bg-white"
                                      @ready="onEditorReady($event)"></quill-editor>
                    </div>
                </div>
                <div class="vx-row">
                    <div class="vx-col w-full mb-2">
                        <span class="font-regular">Inserir no corpo da mensagem:</span>
                    </div>
                    <div class="vx-col w-full lg:w-1/3 mb-4" v-for="val in variaveis">
                        <div class="w-full px-4 py-2 text-center text-black rounded-lg cursor-pointer" style="background-color: #dddddd" @click="addVarText(val.value)">
                            <span>{{val.nome}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </VuePerfectScrollbar>
        <div class="flex flex-wrap items-center p-6" slot="footer">
            <vs-button class="mr-6" @click="enviar" :disabled="isValid">Enviar</vs-button>
            <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">Cancelar</vs-button>
        </div>
    </vs-sidebar>
</template>

<script>
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import {quillEditor} from 'vue-quill-editor'
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    import {Validator} from 'vee-validate';
    import saveleadsConfig from "../../../saveleadsConfig";
    import moduleMensagem from "../../store/mensagemPadrao/moduleMensagem";

    const dict = {
        custom: {
            nome: {
                required: 'Por favor, insira o nome do produto',
            },
        }
    };

    Validator.localize('pt-br', dict);

    export default {
        name: "Email",
        components: {
            VuePerfectScrollbar, quillEditor
        },
        props: {
            isSidebarActive: {
                type: Boolean,
                required: true
            },
            data: {
                type: Object,
                default: () => {
                },
            }
        },
        data() {
            return {
                email: {},
                variaveis: saveleadsConfig.variaveis,
                mensagens: []
            }
        },
        created() {
            if (!moduleMensagem.isRegistered) {
                this.$store.registerModule('mensagens', moduleMensagem)
                moduleMensagem.isRegistered = true
            }
            console.log('data', this.data)

            this.getMensagens();
        },
        computed: {
            isSidebarActiveLocal: {
                get() {
                    return this.isSidebarActive
                },
                set(val) {
                    if (!val) {
                        this.$emit('closeSidebar')
                        // this.$validator.reset()
                        // this.initValues()
                    }
                }
            },
            isValid() {
                return this.errors.any();
            },
        },
        methods: {
            onEditorReady(editor) {
                console.log('editor', editor.getSelection());
                this.editor = editor;
            },
            addVarText(value) {
                //Quill Editor
                var $txt2 = this.editor.getSelection(true);
                this.editor.insertText($txt2.index, value, '', true);
            },
            enviar() {
                this.$store.dispatch('tickets/sendEmail', {id: this.data.id, assunto: this.email.assunto, mensagem: this.email.body}).then(response => {
                    console.log('voltou pro front', response);
                    if(response.return){
                        this.$emit('closeSidebar');
                        this.$emit('getId');
                        this.$vs.notify({
                            color: 'success',
                            title: '',
                            text: 'Seu e-mail foi enviado com sucesso.'
                        });
                    } else {
                        this.$vs.notify({
                            color: 'danger',
                            title: '',
                            text: 'Houve um erro ao enviar seu e-mail. Entre em contato com o suporte.'
                        });
                    }
                }).catch(erro => {
                    console.log('erro', erro)
                });
            },
            getMensagens() {
                this.mensagens = [];
                this.$store.dispatch('mensagens/get').then(response => {
                    this.mensagens = [...response];
                });
            },
        },
    }
</script>

<style lang="scss" scoped>
    .add-new-data-sidebar {
        ::v-deep .vs-sidebar--background {
            z-index: 52010;
        }

        ::v-deep .vs-sidebar {
            z-index: 52010;
            width: 750px;
            max-width: 90vw;

            .img-upload {
                margin-top: 2rem;

                .con-img-upload {
                    padding: 0;
                }

                .con-input-upload {
                    width: 100%;
                    margin: 0;
                }
            }
        }
    }

    .scroll-area--data-list-add-new {
        // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
        height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);
    }
</style>

<style>
    .vs-sidebar--background {
        background: rgba(0, 0, 0, .2) !important;
    }
</style>
