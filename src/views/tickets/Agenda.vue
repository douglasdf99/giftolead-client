<template>
    <div>
        <vs-tabs color="primary" class="tabs-shadow-none">
            <vs-tab color="primary" value="10" label="meus agendamentos" @click="getAtendimentos('meus')">
                <calendario :items="items" class="mt-2"></calendario>
            </vs-tab>
            <vs-tab color="success" value="10" label="agendados para qualquer usuário ()">
            </vs-tab>
            <vs-tab color="success" value="10" label="agendamentos de outros usuários">
            </vs-tab>
        </vs-tabs>
    </div>
</template>

<script>
    import Calendario from "./Calendario";
    import moduleTickets from "../../store/tickets/moduleTickets";
    import VueMoment from 'vue-moment'

    const moment = require('moment/moment');
    require('moment/locale/pt-br');

    export default {
        name: "Agenda",
        components: {
            'calendario': Calendario
        },
        data(){
            return {
                items: []
            }
        },
        methods: {
            getAtendimentos(val = 'meus'){
                this.$vs.loading();
                this.$store.dispatch('tickets/getAgenda', {tipo: val}).then(response => {
                    this.items = response;
                    this.organiza()
                }).finally(() => this.$vs.loading.close());
            },
            organiza(){
                this.$vs.loading();
                this.items.forEach(item => {
                    let {nome, data_agendamento} = item;
                    item.title = nome;
                    item.startDate = data_agendamento;
                    item.endDate = data_agendamento;
                    item.label = this.getSituacao(data_agendamento);
                    item.classes = 'event-' + this.getColorLabel();
                });
                console.log(this.items);
                this.$vs.loading.close();
            },
            getSituacao(data){
                let hoje = moment().format('Y-MM-D H:mm');
                var amanha = moment().add(1,'days').set({hour:0,minute:0,second:0,millisecond:0}).format('Y-MM-D H:mm');
                console.log('datas', hoje, amanha, data)
                if(data < hoje) return 'atrasado'
                if(data > hoje) return 'futuro'
            },
            getColorLabel(val){
                if(val == 'futuro') return 'success'
                if(val == 'atrasado') return 'danger'
            }
        },
        created() {
            if (!moduleTickets.isRegistered) {
                this.$store.registerModule('tickets', moduleTickets)
                moduleTickets.isRegistered = true
            }

            this.getAtendimentos();
        },
    }
</script>

<style scoped>

</style>