<template>
    <div>
        <vs-tabs color="primary" class="tabs-shadow-none">
            <vs-tab color="primary" value="10" label="meus agendamentos" @click="getAtendimentos('agendamentos')">
                <calendario :items="items" class="mt-2" :agendadosHoje="agendadosHoje" @getItems="getAtendimentos"></calendario>
            </vs-tab>
            <vs-tab color="success" value="10" label="agendados para qualquer usuário" @click="getAtendimentos('agendamentos_natendimento')">
                <calendario :items="items" class="mt-2" @getItems="getAtendimentos('agendamentos_natendimento')"></calendario>
            </vs-tab>
            <vs-tab color="success" value="10" label="todos os agendamentos" @click="getAtendimentos('agendamentos_todos')">
                <calendario :items="items" class="mt-2" @getItems="getAtendimentos('agendamentos_todos')"></calendario>
            </vs-tab>
        </vs-tabs>
    </div>
</template>

<script>
    import Calendario from "./Calendario";
    import moduleTickets from "../../store/tickets/moduleTickets";

    const moment = require('moment/moment');
    require('moment/locale/pt-br');

    export default {
        name: "Agenda",
        components: {
            'calendario': Calendario
        },
        data(){
            return {
                items: [],
                agendadosHoje: [],
            }
        },
        methods: {
            getAtendimentos(val = 'agendamentos'){
                this.$vs.loading();
                this.agendadosHoje = [];
                this.$store.dispatch('tickets/rotaAtual', val);
                this.$store.dispatch('tickets/getAgenda', val).then(response => {
                    this.items = response;
                    this.organiza()
                }).finally(() => this.$vs.loading.close());
            },
            organiza(){
                this.$vs.loading();
                this.items.forEach(item => {
                    let {nome, data_agendamento} = item;
                    if(item.responsavel)
                        item.title = `<img class='rounded-full' src='${this.get_img_api(item.responsavel.avatar)}' width='30px'>` + nome;
                    else
                        item.title = nome
                    item.startDate = data_agendamento;
                    item.endDate = data_agendamento;
                    item.label = this.getSituacao(data_agendamento);
                    item.classes = 'event-' + this.getColorLabel(item.label);
                    let hoje = moment().format('Y-MM-D H:mm');
                    var amanha = moment().add(1,'days').set({hour:0,minute:0,second:0,millisecond:0}).format('Y-MM-D H:mm');
                    if(((item.data_agendamento > hoje) && (item.data_agendamento < amanha)) || (item.data_agendamento < hoje)){
                        this.agendadosHoje.push(item);
                    }
                });
                this.$vs.loading.close();
            },
            getSituacao(data){
                let hoje = moment().format('Y-MM-D H:mm');
                var amanha = moment().add(1,'days').set({hour:0,minute:0,second:0,millisecond:0}).format('Y-MM-D H:mm');
                if((data > hoje) && (data < amanha)) return 'dentrodoprazo';
                if(data < hoje) return 'atrasado';
                if(data >= amanha) return 'futuro';
            },
            getColorLabel(val){
                if(val == 'futuro') return 'success'
                if(val == 'atrasado') return 'danger'
                return 'warning'
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