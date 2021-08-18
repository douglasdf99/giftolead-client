<template>
    <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary"
                class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
        <div class="my-6 flex items-center justify-between px-6">
            <h4>Links de venda</h4>
            <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
        </div>
        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-5">
                <div class="vx-row">
                    <div class="com-item mt-10 w-full">
                        <vx-card :key="link.id" class=" mb-1 unsetshadow-setborder p-0" v-for="link in items">
                            <div class="vx-row">
                                <div class="vx-col sm:w-6/12 w-full">
                                    <p class="mb-0 text-base font-bold pl-4 pt-2 "> {{ link.descricao }}</p>
                                </div>
                                <div class="vx-col sm:w-6/12 w-full">
                                    <div class="vx-col w-full relative py-0">
                                        <vx-input-group v-if="getlink(link)">
                                            <vs-input :value="getlink(link)" disabled/>
                                            <template slot="append">
                                                <div class="append-text btn-addon">
                                                    <vs-button color="black" type="border" @click="copyText(getlink(link))"><i class="material-icons icone-input">file_copy</i></vs-button>
                                                    <vs-button color="black" type="border" @click="goto(getlink(link))"><i class="material-icons icone-input">trending_flat</i></vs-button>
                                                </div>
                                            </template>
                                        </vx-input-group>
                                        <vs-button color="primary" type="flat" @click="gerarLink(link)" class="float-right" v-else><span class="font-bold">Gerar Link</span></vs-button>
                                    </div>
                                </div>
                            </div>
                            <!-- end row -->
                        </vx-card>
                        <vs-pagination class="mt-10" :total="pagination.last_page" v-model="currentx"></vs-pagination>
                    </div>
                </div>
            </div>
        </VuePerfectScrollbar>

    </vs-sidebar>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {quillEditor} from 'vue-quill-editor'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import {Validator} from 'vee-validate';
import moduleLinks from '@/store/links/moduleLinks.js'
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
            addNewDataSidebar: false,
            sidebarData: {},
            routeTitle: 'Contas',
            produto: {},
            selectedProduto: {id: null, label: 'Selecione um produto'},
            produtos: [],
            dados: {
                page: 1,
                status: 1
            },
            pagination: {
                last_page: 1,
                page: 1,
                current_page: 1
            },
            currentx: 1
        }
    },
    created() {
        if (!moduleLinks.isRegistered) {
            this.$store.registerModule('links', moduleLinks)
            moduleLinks.isRegistered = true
        }
        this.dados.produto = this.data.produto_id;
        this.getItems();
    },
    computed: {
        items() {
            return this.$store.state.items;
        },
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
        getlink(item) {
            let link = '';
            let user = JSON.parse(localStorage.getItem("userInfo"));
            item.linksexternos.forEach(ext => {
                if (ext.user_id == user.uid) {
                    link = 'https://svlds.me/' + ext.codigo;
                }
            });
            return link;
        },
        meulink() {

        },
        copyText(text) {
            const thisIns = this;
            this.$copyText(text).then(function () {
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
        },
        goto(text) {
            window.open(text, '_blank');
        },
        gerarLink(link) {
            let data = {};
            data.codigo_id = link.identidade;
            this.$store.dispatch('links/gerarlink', data).then(() => {
                this.$vs.notify({
                    color: 'success',
                    title: 'Sucesso',
                    text: 'O link foi gerado com sucesso'
                });
                this.getItems();
            }).catch(erro => {
                console.log(erro)
                this.$vs.notify({
                    color: 'danger',
                    title: 'Erro',
                    text: 'Algo deu errado ao gerar o link. Contate o suporte.'
                })
            })
        },
        getItems() {
            this.$vs.loading();
            this.$store.dispatch('getVarios', {rota: 'links', params: this.dados}).then(response => {
                this.pagination = response;
                this.$vs.loading.close();
            });
        },
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
                if (response.return) {
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
