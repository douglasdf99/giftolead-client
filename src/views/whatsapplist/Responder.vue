<!-- =========================================================================================
  File Name: AddNewDataSidebar.vue
  Description: Add New Data - Sidebar component
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary"
                class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
        <div class="my-6 flex items-center justify-between px-6">
            <h4>Responder Contato</h4>
            <feather-icon icon="XIcon" @click.stop="fechar" class="cursor-pointer"></feather-icon>
        </div>
        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-0">
                <div id="chat-app" class="d-theme-border-grey-light rounded relative overflow-hidden chat-whats-bg">
                    <!-- RIGHT COLUMN -->
                    <div class="chat-whats chat__bg no-scroll-content chat-content-area border border-solid d-theme-border-grey-light border-t-0 border-r-0 border-b-0"
                         :class="{'sidebar-spacer--wide': clickNotClose, 'flex items-center justify-center': activeChatUser === null}">
                        <template v-if="activeChatUser">
                            <div class="chat__navbar">
                                <chat-navbar :dados="data" :enviado="enviado" @setMensagem="setMensagem" :isSidebarCollapsed="!clickNotClose" :user-id="activeChatUser"
                                             :isPinnedProp="isChatPinned"></chat-navbar>
                                <vs-progress indeterminate color="primary" v-if="enviando"></vs-progress>
                            </div>
                            <VuePerfectScrollbar class="chat-content-scroll-area border border-solid d-theme-border-grey-light" style="border-color: transparent" :settings="settings" ref="chatLogPS"
                                                 :key="$vs.rtl">
                                <div class="chat__log" ref="chatLog">
                                    <chat-log :userId="activeChatUser" :dados="data" v-if="activeChatUser"></chat-log>
                                </div>
                            </VuePerfectScrollbar>
                        </template>
                    </div>
                    <div class="py-4 text-center" style="background-color: #F4F4F4">
                        <span>
                            {{ data.resposta ? 'Hitórico de mensagens' : 'Iremos te redirecionar para o aplicativo do Whatsapp' }}
                        </span>
                    </div>
                    <div class="chat__input flex py-4 items-end" style="background-color: #F4F4F4; box-shadow: 0 1px 10px 0 rgba(179,179,179,1);" v-if="!enviado">
                        <vx-tooltip text="Variáveis" position="top">
                            <vs-dropdown vs-trigger-click>
                                <i class="material-icons text-4xl text-gray p-4 cursor-pointer">sms</i>
                                <vs-dropdown-menu class="dropdown-menu-list dropdown-usuario dropdown-chat">
                                    <span class="span-identifica-item-dropdown mb-0">Variáveis</span>
                                    <vs-dropdown-item v-for="i in variaveis">
                                        <span @click="addVarText(i.value)">{{ i.nome }}</span>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item @click="addLinkCheckoutVarText" v-if="this.$route.name != 'brindes-automacao'">
                                        <span>Links do Sistemas</span>
                                    </vs-dropdown-item>
                                </vs-dropdown-menu>
                            </vs-dropdown>
                        </vx-tooltip>
                        <vs-textarea v-model="typedMessage" id="text-area-chat" class="w-full bg-white mb-0" rows="4" placeholder="Digite uma mensagem"/>
                        <i class="material-icons text-4xl text-gray p-4 cursor-pointer" @click="sendMsg">send</i>
                    </div>
                </div>
                <vs-prompt
                    @cancel="clearValMultiple"
                    @accept="selectLink"
                    @close="close"
                    :acceptText="'Salvar'"
                    :cancelText="'Cancelar'"
                    title="Selecionar link"
                    :max-width="'600px'"
                    :active.sync="modal" class="teste" style="z-index: 52020">
                    <div class="con-exemple-prompt">
                        <div class="mt-3">
                            <span class="font-regular mb-2">Link</span>
                            <v-select v-model="selectedLink" class="mt-4 mb-2" :class="'select-large-base'" :clearable="false"
                                      :options="links" v-validate="'required'" name="tipo"/>
                        </div>
                    </div>
                </vs-prompt>
            </div>
        </VuePerfectScrollbar>
    </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import vSelect from 'vue-select';
import ChatNavBar from '../components/whatsapp/ChatNavbar';
import ChatLog from '../components/whatsapp/ChatLog';
import saveleadsConfig from '../../../saveleadsConfig';

export default {
    props: {
        isSidebarActive: {
            type: Boolean,
            required: true
        },
        data: {
            type: Object,
            default: () => {
            },
        },
    },
    watch: {},
    data() {
        return {
            //Chat
            active: true,
            isHidden: false,
            searchContact: "",
            activeProfileSidebar: false,
            activeChatUser: 1,
            userProfileId: -1,
            typedMessage: "",
            isChatPinned: false,
            settings: {
                maxScrollbarLength: 60,
                wheelSpeed: 0.70,
            },
            variaveis: saveleadsConfig.variaveis,
            clickNotClose: false,
            isChatSidebarActive: true,
            isLoggedInUserProfileView: false,
            enviando: false,
            enviado: false,

            //Modal
            modal: false,
            selectedLink: {id: null, label: 'Selecione o link'},
            links: []
        }
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
    },
    methods: {
        submitData() {
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.$vs.loading();
                    this.$emit('closeSidebar');
                    this.initValues();
                }
            })
        },
        fechar() {
            //this.$emit('getItems')
            this.isSidebarActiveLocal = false
        },
        setSidebarWidth() {
            if (this.windowWidth < 1200) {
                this.isChatSidebarActive = this.clickNotClose = false
            } else {
                this.isChatSidebarActive = this.clickNotClose = true
            }
        },
        toggleChatSidebar(value = false) {
            if (!value && this.clickNotClose) return
            this.isChatSidebarActive = value
        },
        sendMsg() {
            if (!this.typedMessage) return
            this.enviando = true;
            let rota = 'whatsapplists_resposta';
            if (this.$route.name == 'brindes-automacao')
                rota = 'automacaos/link-whatsapp'
            this.$store.dispatch('whatsapplist/sendMsg', {id: this.data.id, mensagem: this.typedMessage, rota: rota}).then(response => {
                this.enviado = true;
                this.typedMessage = '';
                setTimeout(() => this.redirectWhats(response), 2000);
                //this.$emit('getItems')
            });
        },
        redirectWhats(url) {
            this.enviando = false;
            window.open(url);
        },
        showProfileSidebar(userId, openOnLeft = false) {
            this.userProfileId = userId
            this.isLoggedInUserProfileView = openOnLeft
            this.activeProfileSidebar = !this.activeProfileSidebar
        },
        toggleIsChatPinned(value) {
            this.isChatPinned = value
        },
        setMensagem(text) {
            this.typedMessage = text;
        },
        addVarText(value) {
            //Text Area
            var $txt = document.getElementById('text-area-chat');
            var textAreaTxt = $txt.value;
            var caretPos = $txt.selectionStart;
            $txt.value = (textAreaTxt.substring(0, caretPos) + value + textAreaTxt.substring(caretPos));
            this.typedMessage = $txt.value;
        },
        addLinkCheckoutVarText() {
            this.modal = true;
        },
        clearValMultiple() {
            this.selectedLink = {id: null, label: 'Selecione o link'};
        },
        selectLink() {
            this.addVarText('[LINK_' + this.selectedLink.id + ']');
            this.selectedLink = {id: null, label: 'Selecione o link'};
        },
        close() {
            this.modal = false;
        },
    },
    components: {
        VuePerfectScrollbar,
        'v-select': vSelect,
        ChatLog, 'chat-navbar': ChatNavBar
    },
    created() {
        this.$store.dispatch('getLinks', this.data.campanhable.produto_id).then(response => {
            let arr = [...response];
            arr.forEach(item => {
                this.links.push({id: item.identidade, label: item.descricao});
            });
        });

        if (this.data.resposta) {
            this.enviado = true;
        }
    },
    updated() {
        if (this.data.resposta)
            this.$store.dispatch('whatsapplist/pushMsg', {isSent: true, textContent: this.data.resposta.mensagem});
    }
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
    height: calc(93vh);
}
</style>

<style>
.vs-sidebar--background {
    background: rgba(0, 0, 0, .2) !important;
}

#text-area-chat {
    padding: .5rem !important;
}

.chat-whats.no-scroll-content {
    height: calc(var(--vh, 1vh) * 100 - 20rem) !important;
}

[dir] #chat-app .chat__bg {
    background-image: url("../../assets/images/util/fundo-chat.jpg") !important;
    border: unset !important;
}

/*.chat-whats.no-scroll-content {
    height: calc(var(--vh, 1vh) * 100 - 28rem) !important;
}*/
</style>
<style lang="scss">
@import "@/assets/scss/vuexy/apps/chat.scss";
</style>
