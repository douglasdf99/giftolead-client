<template>
    <!-- NOTIFICATIONS -->
    <div @click="setlida">
        <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
            <feather-icon icon="BellIcon" class="cursor-pointer mt-1 sm:mr-6 mr-2" :badge="unreadNotifications.length"/>

            <vs-dropdown-menu class="notification-dropdown dropdown-custom vx-navbar-dropdown">

                <div class="notification-top text-center p-5 bg-primary text-white">
                    <h3 class="text-white">{{ unreadNotifications.length }} Novas</h3>
                    <p class="opacity-75">App Notificações</p>
                </div>

                <VuePerfectScrollbar ref="mainSidebarPs" class="scroll-area--nofications-dropdown p-0 mb-10" :settings="settings" :key="$vs.rtl">
                    <ul class="bordered-items">
                        <li v-for="ntf in unreadNotifications" :key="ntf.index" class="flex justify-between px-4 py-4 notification cursor-pointer">
                            <div class="flex items-start">
                                <!--<feather-icon :icon="ntf.icon" :svgClasses="[`text-${ntf.category}`, 'stroke-current mr-1 h-6 w-6']"></feather-icon>-->
                                <vs-icon :icon="ntf.icon" icon-pack="material-icons" class="icon-grande text-xl" v-bind:class="`text-${ntf.category}`"
                                         :svgClasses="[`text-${ntf.category}`, 'stroke-current mr-1 h-6 w-6']"></vs-icon>
                                <div class="mx-2">
                                    <span class="font-medium block notification-title" :class="[`text-${ntf.category}`]">{{ ntf.title }}</span>
                                    <small>{{ ntf.msg }}</small>
                                </div>
                            </div>
                            <small class="mt-1 whitespace-no-wrap">{{ elapsedTime(ntf.time) }}</small>
                        </li>
                        <li v-for="ntf in notifications" :key="ntf.index" style="background-color: #ece5e5" class="flex justify-between px-4 py-4 notification cursor-pointer">
                            <div class="flex items-start">
                                <!--<feather-icon :icon="ntf.icon" :svgClasses="[`text-${ntf.category}`, 'stroke-current mr-1 h-6 w-6']"></feather-icon>-->
                                <vs-icon :icon="ntf.icon" icon-pack="material-icons" class="icon-grande text-xl" v-bind:class="`text-${ntf.category}`"
                                         :svgClasses="[`text-${ntf.category}`, 'stroke-current mr-1 h-6 w-6']"></vs-icon>
                                <div class="mx-2">
                                    <span class="font-medium block notification-title" :class="[`text-${ntf.category}`]">{{ ntf.title }}</span>
                                    <small>{{ ntf.msg }}</small>
                                </div>
                            </div>
                            <small class="mt-1 whitespace-no-wrap">{{ elapsedTime(ntf.time) }}</small>
                        </li>
                    </ul>
                </VuePerfectScrollbar>

                <div class="checkout-footer fixed bottom-0 rounded-b-lg text-primary w-full p-2 font-semibold text-center border border-b-0 border-l-0 border-r-0
                    border-solid d-theme-border-grey-light cursor-pointer">
                    <span>Ver todas as notificações</span>
                </div>
            </vs-dropdown-menu>
        </vs-dropdown>
    </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import moduleNotificacoes from "@/store/notificacoes/moduleNotificacoes";

export default {
    components: {
        VuePerfectScrollbar
    },
    data() {
        return {
            unreadNotifications: [],
            notifications: [],
            settings: {
                maxScrollbarLength: 60,
                wheelSpeed: .60,
            },
        }
    },
    created() {
        if (!moduleNotificacoes.isRegistered) {
            this.$store.registerModule('notificacoes', moduleNotificacoes);
            moduleNotificacoes.isRegistered = true;
        }

        console.log(localStorage.getItem('userInfo'));

        this.getNotificacoes();
    },
    mounted() {
        // this.$echo.private('App.Models.User.29').listen('BroadcastNotificationCreated', (payload) => {
        //   console.log('escutou');
        //   console.log(payload);
        // });
        let user = JSON.parse(localStorage.getItem('userInfo'));
        this.$echo.private('App.Models.User.' + user.uid).notification((notification) => {
            console.log('escutou');
            console.log(notification);
            this.unreadNotifications.push({
                index: notification.notification.id,
                title: notification.notification.data.title,
                msg: notification.notification.data.message,
                icon: notification.notification.data.icon,
                time: notification.notification.data.time,
                category: notification.notification.data.category
            });
        });
    },
    methods: {
        // Method for creating dummy notification time
        randomDate({hr, min, sec}) {
            let date = new Date()

            if (hr) date.setHours(date.getHours() - hr)
            if (min) date.setMinutes(date.getMinutes() - min)
            if (sec) date.setSeconds(date.getSeconds() - sec)

            return date
        },
        getNotificacoes() {
            this.$store.dispatch('notificacoes/get').then(response => {
                console.log(response)
                response.forEach((item, index) => {
                    this.unreadNotifications.push({
                        index: item.id,
                        title: item.data.title,
                        msg: item.data.message,
                        icon: item.data.icon,
                        time: item.data.time,
                        category: item.data.category
                    })
                });
            });
        },
        setlida() {
            if (this.unreadNotifications.length > 0) {
                this.$store.dispatch('notificacoes/setread').then(() => {
                    console.log('lidas com sucesso')
                    this.unreadNotifications.forEach(item => {
                        this.notifications.push(item)
                    })
                    //this.notifications = [...this.unreadNotifications];
                    this.unreadNotifications = [];
                });
            }
        }
    }
}

</script>

