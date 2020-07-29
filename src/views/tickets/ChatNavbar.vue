<!-- =========================================================================================
    File Name: ChatNavbar.vue
    Description: Chat Application - Chat navbar
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
    <div v-if="userId != null" class="chat__header">
        <vs-navbar class="p-4 flex navbar-custom" color="white" type="flat">
            <div class="relative flex mr-4">
                <vs-avatar class="m-0 border-2 border-solid border-white" size="40px" :src="userDetails.photoURL"/>
            </div>
            <h6>{{ dados.nome }}</h6>
            <vs-spacer></vs-spacer>
            <vx-tooltip text="Mensagens Padrão" position="left" v-if="!enviado">
                <vs-dropdown vs-trigger-click>
                    <feather-icon icon="MenuIcon" class="mr-4 cursor-pointer"/>
                    <vs-dropdown-menu class="dropdown-menu-list dropdown-usuario dropdown-chat">
                        <span class="span-identifica-item-dropdown mb-0">Mensagem Padrão</span>
                        <vs-dropdown-item v-for="msg in mensagens" @click="$emit('setMensagem', msg.mensagem)">
                            <span v-if="msg.tipo === 'whatsapp'">{{msg.titulo}}</span>
                        </vs-dropdown-item>
                    </vs-dropdown-menu>
                </vs-dropdown>
            </vx-tooltip>
        </vs-navbar>
    </div>
</template>

<script>
    import moduleMensagem from "../../store/mensagemPadrao/moduleMensagem";

    export default {
        props: {
            userId: {
                type: Number,
                required: true,
            },
            isPinnedProp: {
                type: Boolean,
                required: true,
            },
            isSidebarCollapsed: {
                type: Boolean,
                required: true,
            },
            dados: {
                type: Object,
                required: true
            },
            enviado: {
                type: Boolean
            }
        },
        data() {
            return {
                mensagens: []
            }
        },
        created() {
            console.log('dados', this.dados);
            if (!moduleMensagem.isRegistered) {
                this.$store.registerModule('mensagens', moduleMensagem)
                moduleMensagem.isRegistered = true
            }
            this.getMensagens();
        },
        computed: {
            isPinnedLocal: {
                get() {
                    return this.isPinnedProp
                },
            },
            userDetails() {
                return this.$store.state.tickets.contato;
            },
        },
        methods: {
            getMensagens() {
                this.mensagens = [];
                this.$store.dispatch('mensagens/get').then(response => {
                    this.mensagens = [...response];
                });
            },
        }
    }
</script>
<style>
    .dropdown-chat {
        z-index: 500000;
    }
</style>

