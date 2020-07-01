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
        <div class="mt-6 flex items-center justify-between px-6">
            <h4>Responder Contato</h4>
        </div>
        <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
            <div class="p-6">
                <div id="chat-app" class="border border-solid d-theme-border-grey-light rounded relative overflow-hidden">
                    <!-- RIGHT COLUMN -->
                    <div class="chat__bg no-scroll-content chat-content-area border border-solid d-theme-border-grey-light border-t-0 border-r-0 border-b-0" :class="{'sidebar-spacer--wide': clickNotClose, 'flex items-center justify-center': activeChatUser === null}">
                        <template v-if="activeChatUser">
                            <div class="chat__navbar">
                                <chat-navbar :isSidebarCollapsed="!clickNotClose" :user-id="activeChatUser" :isPinnedProp="isChatPinned" @openContactsSidebar="toggleChatSidebar(true)" @showProfileSidebar="showProfileSidebar" @toggleIsChatPinned="toggleIsChatPinned"></chat-navbar>
                            </div>
                            <VuePerfectScrollbar class="chat-content-scroll-area border border-solid d-theme-border-grey-light" :settings="settings" ref="chatLogPS" :key="$vs.rtl">
                                <div class="chat__log" ref="chatLog">
                                    <chat-log :userId="activeChatUser" v-if="activeChatUser"></chat-log>
                                </div>
                            </VuePerfectScrollbar>
                            <div class="chat__input flex p-4 bg-white">
                                <vs-input class="flex-1" placeholder="Type Your Message" v-model="typedMessage" @keyup.enter="sendMsg" />
                                <vs-button class="bg-primary-gradient ml-4" type="filled" @click="sendMsg">Send</vs-button>
                            </div>
                        </template>
                        <template v-else>
                            <div class="flex flex-col items-center">
                                <feather-icon icon="MessageSquareIcon" class="mb-4 bg-white p-8 shadow-md rounded-full" svgClasses="w-16 h-16"></feather-icon>
                                <h4 class=" py-2 px-4 bg-white shadow-md rounded-full cursor-pointer" @click.stop="toggleChatSidebar(true)">Start Conversation</h4>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </VuePerfectScrollbar>
    </vs-sidebar>
</template>

<script>
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'
    import vSelect from 'vue-select'
    import ChatLog from './ChatLog'
    import ChatNavBar from './ChatNavbar'

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
                origem: {
                    empresa_id: 1,
                    nome: '',
                },

                //Chat
                active: true,
                isHidden: false,
                searchContact: "",
                activeProfileSidebar: false,
                activeChatUser: null,
                userProfileId: -1,
                typedMessage: "",
                isChatPinned: false,
                settings: {
                    maxScrollbarLength: 60,
                    wheelSpeed: 0.70,
                },
                clickNotClose: false,
                isChatSidebarActive: true,
                isLoggedInUserProfileView: false,
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
            initValues() {
                console.log('chamou init');
                if (this.data.id) {
                    console.log(this.data)
                    return
                } else {
                    this.origem.id = null
                    this.origem.nome = ''
                }
            },
            submitData() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.$vs.loading();
                        this.$emit('closeSidebar');
                        this.initValues();
                    }
                })
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
            }
        },
        components: {
            VuePerfectScrollbar,
            'v-select': vSelect,
            ChatLog, ChatNavBar
        },
        created() {
            this.initValues();
            if (Object.entries(this.data).length === 0) {
                //this.initValues()
                this.$validator.reset()
            } else {
                console.log('entrou aqui', this.data);
                this.origem = JSON.parse(JSON.stringify(this.data));
            }
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
        height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);
    }
</style>

<style>
    .vs-sidebar--background {
        background: rgba(0, 0, 0, .2) !important;
    }
</style>
<style lang="scss">
    @import "@/assets/scss/vuexy/apps/chat.scss";
</style>
