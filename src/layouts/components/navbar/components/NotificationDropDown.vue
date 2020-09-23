<template>
    <!-- NOTIFICATIONS -->
    <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
        <feather-icon icon="BellIcon" class="cursor-pointer mt-1 sm:mr-6 mr-2" :badge="unreadNotifications.length"/>

        <vs-dropdown-menu class="notification-dropdown dropdown-custom vx-navbar-dropdown">

            <div class="notification-top text-center p-5 bg-primary text-white">
                <h3 class="text-white">{{ unreadNotifications.length}} Novas</h3>
                <p class="opacity-75">App Notificações</p>
            </div>

            <VuePerfectScrollbar ref="mainSidebarPs" class="scroll-area--nofications-dropdown p-0" :settings="settings" :key="$vs.rtl">
                <ul class="bordered-items">
                    <li v-for="ntf in unreadNotifications" :key="ntf.index" class="flex justify-between px-4 py-4 notification cursor-pointer">
                        <div class="flex items-start">
                            <feather-icon :icon="ntf.icon" :svgClasses="[`text-${ntf.category}`, 'stroke-current mr-1 h-6 w-6']"></feather-icon>
                            <div class="mx-2">
                                <span class="font-medium block notification-title" :class="[`text-${ntf.category}`]">{{ ntf.title }}</span>
                                <small>{{ ntf.msg }}</small>
                            </div>
                        </div>
                        <small class="mt-1 whitespace-no-wrap">{{ elapsedTime(ntf.time) }}</small>
                    </li>
                </ul>
            </VuePerfectScrollbar>

            <!--<div class="checkout-footer fixed bottom-0 rounded-b-lg text-primary w-full p-2 font-semibold text-center border border-b-0 border-l-0 border-r-0
                    border-solid d-theme-border-grey-light cursor-pointer">
                <span>Ver todas as notificações</span>
            </div>-->
        </vs-dropdown-menu>
    </vs-dropdown>
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
            unreadNotifications: [
                {
                    index: 0,
                    title: 'Conquista alcançada!',
                    msg: 'Você acaba de se tornar Vendedor Ninja!',
                    icon: 'StarIcon',
                    time: this.randomDate({sec: 25}),
                    category: 'warning'
                },
            ],
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
    },
    methods: {
        elapsedTime(startTime) {
            let x = new Date(startTime)
            let now = new Date()
            var timeDiff = now - x
            timeDiff /= 1000

            var seconds = Math.round(timeDiff)
            timeDiff = Math.floor(timeDiff / 60)

            var minutes = Math.round(timeDiff % 60)
            timeDiff = Math.floor(timeDiff / 60)

            var hours = Math.round(timeDiff % 24)
            timeDiff = Math.floor(timeDiff / 24)

            var days = Math.round(timeDiff % 365)
            timeDiff = Math.floor(timeDiff / 365)

            var years = timeDiff

            if (years > 0) {
                return years + (years > 1 ? ' Anos ' : ' Ano ') + 'atrás'
            } else if (days > 0) {
                return days + (days > 1 ? ' Dias ' : ' Dia ') + 'atrás'
            } else if (hours > 0) {
                return hours + (hours > 1 ? ' Hrs ' : ' Hora ') + 'atrás'
            } else if (minutes > 0) {
                return minutes + (minutes > 1 ? ' Mins ' : ' Min ') + 'atrás'
            } else if (seconds > 0) {
                return seconds + (seconds > 1 ? ' seg atrás' : 'Agora')
            }

            return 'Agora'
        },
        // Method for creating dummy notification time
        randomDate({hr, min, sec}) {
            let date = new Date()

            if (hr) date.setHours(date.getHours() - hr)
            if (min) date.setMinutes(date.getMinutes() - min)
            if (sec) date.setSeconds(date.getSeconds() - sec)

            return date
        },
    }
}

</script>

