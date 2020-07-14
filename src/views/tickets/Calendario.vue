<template>
    <div id="simple-calendar-app">
        <div class="vx-card no-scroll-content shadow-none">
            <calendar-view
                    ref="calendar"
                    :displayPeriodUom="calendarView"
                    :show-date="showDate"
                    :events="items"
                    :enableDragDrop="rotaAtual == 'agendamentos'"
                    :eventTop="windowWidth <= 400 ? '2rem' : '3rem'"
                    eventBorderHeight="0px"
                    eventContentHeight="1.65rem"
                    class="theme-default"
                    @click-event="redirectTicket"
                    @drop-on-date="eventDragged">

                <div slot="header" class="mb-4">
                    <div class="vx-row no-gutter">
                        <!-- Month Name -->
                        <div class="vx-col w-1/3 items-center sm:flex hidden">
                            <!-- Add new event button -->
                            <vs-button @click="exibirHoje = true">Hoje</vs-button>
                        </div>

                        <!-- Current Month -->
                        <div class="vx-col sm:w-1/3 w-full sm:my-0 my-3 flex sm:justify-end justify-center order-last">
                            <div class="flex items-center">
                                <feather-icon
                                        :icon="$vs.rtl ? 'ChevronRightIcon' : 'ChevronLeftIcon'"
                                        @click="updateMonth(-1)"
                                        svgClasses="w-5 h-5 m-1"
                                        class="cursor-pointer bg-primary text-white rounded-full"/>

                                <span class="mx-3 text-xl font-medium whitespace-no-wrap">{{ showDate | month }}</span>

                                <feather-icon
                                        :icon="$vs.rtl ? 'ChevronLeftIcon' : 'ChevronRightIcon'"
                                        @click="updateMonth(1)"
                                        svgClasses="w-5 h-5 m-1"
                                        class="cursor-pointer bg-primary text-white rounded-full"/>
                            </div>
                        </div>
                        <div class="vx-col sm:w-1/3 w-full flex justify-center">
                            <template v-for="(view, index) in calendarViewTypes">
                                <vs-button :key="String(view.val) + (calendarView === view.val ? 'filled' : 'border')"
                                           :type="calendarView === view.val ? 'filled' : 'border'"
                                           class="p-3 md:px-8 md:py-3"
                                           :class="{'border-l-0 rounded-l-none': index, 'rounded-r-none': calendarViewTypes.length !== index+1}"
                                           @click="calendarView = view.val">
                                    {{ view.label }}
                                </vs-button>
                            </template>
                        </div>
                    </div>

                    <div class="vx-row sm:flex hidden mt-4">
                        <div class="vx-col w-full flex">
                            <!-- Labels -->
                            <div class="flex flex-wrap sm:justify-start justify-center">
                                <div v-for="(label, index) in calendarLabels" :key="index" class="flex items-center mr-4 mb-2">
                                    <div class="h-3 w-3 inline-block rounded-full mr-2" :class="'bg-' + label.color"></div>
                                    <span>{{ label.text }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </calendar-view>
        </div>

        <!-- Prompt Reagendamento -->
        <vs-prompt
                class="calendar-event-dialog"
                title="Reagendar Atendimento"
                accept-text="Salvar"
                cancel-text="Cancelar"
                button-cancel="border"
                @cancel="cancelaReagendar"
                @accept="reagendar"
                :active.sync="reagendando">
            <div class="p-5 flex justify-center">
                <flat-pickr :config="configdateTimePicker" v-model="time" class="text-center" placeholder="Selecione o novo horário"/>
            </div>
        </vs-prompt>

        <!-- Pop-up Hoje -->
        <vs-popup class="holamundo" title="Agendados para hoje" :active.sync="exibirHoje">
            <div class="vx-row">
                <div class="vx-col w-full lg:w-1/2 text-center mb-3" v-for="i in agendadosHoje">
                    <vs-chip v-bind:class="'bg-' + getColorLabel(i.label)" class="text-white">
                        <p class="text-md">{{i.nome}} | <span class="destaque font-bold">{{i.data_agendamento | formatDateTime}}</span></p>
                    </vs-chip>
                </div>
            </div>
        </vs-popup>
    </div>
</template>

<script>
    import {CalendarView, CalendarViewHeader} from "vue-simple-calendar"
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';

    const moment = require('moment/moment');
    require('moment/locale/pt-br');

    require("vue-simple-calendar/static/css/default.css")

    import Datepicker from 'vuejs-datepicker'
    import {en, he, ptBr} from "vuejs-datepicker/src/locale"

    export default {
        components: {
            CalendarView,
            CalendarViewHeader,
            Datepicker,
            flatPickr
        },
        props: ['items'],
        data() {
            return {
                showDate: new Date(),
                disabledFrom: false,
                id: 0,
                title: '',
                startDate: '',
                endDate: '',
                labelLocal: 'none',

                langHe: he,
                langEn: en,
                langPtBr: ptBr,

                url: '',
                calendarView: 'month',

                activePromptAddEvent: false,
                reagendando: false,
                activePromptEditEvent: false,

                calendarViewTypes: [
                    {
                        label: "Mês",
                        val: "month"
                    },
                    {
                        label: "Semana",
                        val: "week"
                    },
                    {
                        label: "Ano",
                        val: "year"
                    },
                ],
                exibirHoje: false,

                //Timepicker
                time: null,
                configdateTimePicker: {
                    enableTime: true,
                    enableSeconds: false,
                    noCalendar: true,
                    time_24hr: true
                },

                //Reagendando
                reagendarID: null,
                reagendarDate: null,
            }
        },
        computed: {
            validForm() {
                return this.title != '' && this.startDate != '' && this.endDate != '' && (Date.parse(this.endDate) - Date.parse(this.startDate)) >= 0 && !this.errors.has('event-url');
            },
            disabledDatesTo() {
                return {to: new Date(this.startDate)}
            },
            disabledDatesFrom() {
                return {from: new Date(this.endDate)}
            },
            calendarLabels() {
                return [
                    {text: 'Atrasado', color: 'danger', value: 'atrasado'},
                    {text: 'Dentro do prazo', color: 'warning', value: 'dentrodoprazo'},
                    {text: 'Futuro', color: 'success', value: 'futuro'},
                ]
            },
            labelColor() {
                return (label) => {
                    if (label == "futuro") return "success"
                    if (label == "dentrodoprazo") return "warning"
                    if (label == "atrasado") return "danger"
                }
            },
            windowWidth() {
                return this.$store.state.windowWidth
            },
            rotaAtual() {
                return this.$store.state.tickets.rotaAtual;
            },

        },
        methods: {
            addEvent() {
                const obj = {title: this.title, startDate: this.startDate, endDate: this.endDate, label: this.labelLocal, url: this.url}
                obj.classes = "event-" + this.labelColor(this.labelLocal)
                this.$store.dispatch('calendar/addEvent', obj);
            },
            getColorLabel(val) {
                if (val == 'futuro') return 'success'
                if (val == 'atrasado') return 'danger'
                else return 'warning'
            },
            redirectTicket() {
                if (this.rotaAtual != 'agendamentos_todos')
                    this.$router.push({name: 'tickets-list'});
            },
            updateMonth(val) {
                this.showDate = this.$refs.calendar.getIncrementedPeriod(val);
            },
            clearFields() {
                this.title = this.endDate = this.url = "";
                this.id = 0;
                this.labelLocal = "none";
            },
            promptAddNewEvent(date) {
                this.disabledFrom = false;
                this.addNewEventDialog(date);
            },
            verHoje() {

            },
            addNewEventDialog(date) {
                this.clearFields();
                this.startDate = date;
                this.endDate = date;
                this.activePromptAddEvent = true;
            },
            openAddNewEvent(date) {
                this.disabledFrom = true;
                this.addNewEventDialog(date);
            },
            editEvent() {
                const obj = {id: this.id, title: this.title, startDate: this.startDate, endDate: this.endDate, label: this.labelLocal, url: this.url}
                obj.classes = "event-" + this.labelColor(this.labelLocal)
                this.$store.dispatch('calendar/editEvent', obj)
            },
            removeEvent() {
                this.$store.dispatch('calendar/removeEvent', this.id)
            },
            eventDragged(event, date) {
                console.log(moment(date).format('Y-MM-DD H:mm'));
                this.reagendarID = event.id;
                this.reagendarDate = moment(date);
                this.reagendando = true;
            },
            reagendar() {
                let split = this.time.split(':');
                this.reagendarDate.set({hour: split[0], minute: split[1], second: 0, millisecond: 0});
                console.log(this.reagendarDate.format('Y-MM-DD H:mm:ss'));
                this.$store.dispatch('tickets/reagendar', {id: this.reagendarID, data_agendamento: this.reagendarDate.format('Y-MM-DD H:mm')}).then(() => {
                    this.time = null;
                    this.$vs.notify({
                        title: '',
                        text: "Reagendado com sucesso.",
                        iconPack: 'feather',
                        icon: 'icon-check-circle',
                        color: 'success'
                    });
                    this.$emit('getItems');
                })
            },
            cancelaReagendar() {
                this.reagendarID = null;
                this.reagendarDate = null;
                this.reagendando = false;
            }
        },
        updated() {
            console.log(this.$store.state.tickets.rotaAtual);
        },
        created() {
        },
        beforeDestroy() {
            this.$store.unregisterModule('calendar')
        }
    }
</script>

<style lang="scss">
    @import "@/assets/scss/vuexy/apps/simple-calendar.scss";
</style>