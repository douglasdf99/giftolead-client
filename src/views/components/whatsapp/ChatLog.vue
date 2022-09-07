<!-- =========================================================================================
    File Name: ChatLog.vue
    Description: Chat Application - Log of chat
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
    <div id="component-chat-log" class="m-8" v-if="chatData">
        <div v-for="(msg, index) in chatData.msg" :key="index" class="msg-grp-container">
            <div class="flex items-start" :class="[{'flex-row-reverse' : msg.isSent}]">
                <template>
                    <vs-avatar size="40px" class="border-2 shadow border-solid border-white m-0 flex-shrink-0" :class="msg.isSent ? 'sm:ml-5 ml-3' : 'sm:mr-5 mr-3'"
                               :text="msg.isSent ? dados.resposta.responsavel.name : dados.nome" :color="msg.isSent ? 'primary': 'warning'"></vs-avatar>
                </template>

                <template v-if="chatData.msg[index-1]">
                    <div class="mr-16"
                         v-if="!(!hasSentPreviousMsg(chatData.msg[index-1].isSent, msg.isSent) || !isSameDay(msg.time, chatData.msg[index-1].time))"></div>
                </template>

                <div class="msg break-words relative shadow-md rounded py-3 px-4 mb-4 rounded-lg max-w-sm" :class="{'bg-primary-gradient text-white': msg.isSent, 'border border-solid border-gray-light bg-white': !msg.isSent}">
                    <span>{{ msg.textContent }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        userId: {
            type: Number,
            required: true,
        },
        mensagem: {
            type: String,
        },
        dados: {
            type: Object
        }
    },
    data() {
        return {
            /*chatData: {
                msg: []
            }*/
        };
    },
    created() {
        this.$store.dispatch('whatsapplist/emptyChat');
        let msg = '';
        if (this.$route.name != 'brindes-automacao') {
            if (this.dados.mensagem)
                msg = this.dados.mensagem;
            else
                msg = 'Veio de uma campanha de Boleto.';

            this.$store.dispatch('whatsapplist/pushMsg', {isSent: false, textContent: msg});
        } else {
            if(this.dados.mensagens.length > 0) {
                this.dados.mensagens.forEach(msg => {
                    this.$store.dispatch('whatsapplist/pushMsg', {isSent: true, textContent: msg.mensagem, avatar: msg.responsavel.avatar});
                });
            }
        }
    },
    computed: {
        activeUserImg() {
            return this.$store.state.AppActiveUser.photoURL;
        },
        senderImg() {
            return (isSentByActiveUser) => {
                if (isSentByActiveUser) return this.$store.state.AppActiveUser.photoURL;
                else return this.$store.getters['chat/contact'](this.userId).photoURL;
            };
        },
        hasSentPreviousMsg() {
            return (last_sender, current_sender) => last_sender == current_sender;
        },
        chatData() {
            return this.$store.state.whatsapplist.chatData;
        }
    },
    methods: {
        isSameDay(time_to, time_from) {
            const date_time_to = new Date(Date.parse(time_to));
            const date_time_from = new Date(Date.parse(time_from));
            return date_time_to.getFullYear() === date_time_from.getFullYear() &&
                date_time_to.getMonth() === date_time_from.getMonth() &&
                date_time_to.getDate() === date_time_from.getDate();
        },
        toDate(time) {
            const locale = "en-us";
            const date_obj = new Date(Date.parse(time));
            const monthName = date_obj.toLocaleString(locale, {
                month: 'short'
            });
            return date_obj.getDate() + ' ' + monthName;
        },
        scrollToBottom() {
            this.$nextTick(() => {
                this.$parent.$el.scrollTop = this.$parent.$el.scrollHeight;
            });
        }
    },
    updated() {
        this.scrollToBottom();
    },
    mounted() {
        this.scrollToBottom();
    }
};
</script>
