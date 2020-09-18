<template>
    <div>
        <label class="vs-input--label">Responsável</label>
        <multiselect group-values="libs" group-label="tipo" v-model="selectedResp" :options="agentes" placeholder="Selecione o responsável" deselect-label="Remover seleção"
                     selectLabel="Clique para selecionar" track-by="id" label="label"></multiselect>
    </div>
</template>

<script>
    import Multiselect from 'vue-multiselect'
    import moduleCampAgendamentos from "../../store/campanha_agendamento/moduleCampAgendamentos";
    import moduleCampBoletos from "../../store/campanha_boleto/moduleCampBoletos";
    import moduleCampCanceladas from "../../store/campanha_canceladas/moduleCampCanceladas";
    import moduleCampWhatsapp from "../../store/campanha_whatsapp/moduleCampWhatsapp";
    import moduleUsuario from "../../store/usuarios/moduleUsuario";

    export default {
        name: "SelectResponsaveis",
        components: {Multiselect},
        data() {
            return {
                //responsaveis
                usuarios: [],
                whats: [],
                canceladas: [],
                agendadas: [],
                boletos: [],

                agentes: [],
                selectedResp: null
            }
        },
        mounted() {
            if (!moduleUsuario.isRegistered) {
                this.$store.registerModule('usuarios', moduleUsuario)
                moduleUsuario.isRegistered = true
            }

            if (!moduleCampAgendamentos.isRegistered) {
                this.$store.registerModule('agendadas', moduleCampAgendamentos)
                moduleCampAgendamentos.isRegistered = true
            }

            if (!moduleCampBoletos.isRegistered) {
                this.$store.registerModule('boletos', moduleCampBoletos)
                moduleCampBoletos.isRegistered = true
            }

            if (!moduleCampCanceladas.isRegistered) {
                this.$store.registerModule('canceladas', moduleCampCanceladas)
                moduleCampCanceladas.isRegistered = true
            }

            if (!moduleCampWhatsapp.isRegistered) {
                this.$store.registerModule('whats', moduleCampWhatsapp)
                moduleCampWhatsapp.isRegistered = true
            }

            this.getUsers();
        },
        methods: {
            //Select de responsável
            getUsers() {
                this.$store.dispatch('usuarios/get').then(response => {
                    response.forEach(user => {
                        this.usuarios.push({
                            id: user.id,
                            label: user.name,
                            criador_type: 'App\\Models\\user'
                        });
                    });
                    this.getBoletos();
                })
            },
            getBoletos() {
                this.$store.dispatch('boletos/get').then(response => {
                    response.forEach(boleto => {
                        this.boletos.push({
                            id: boleto.id,
                            label: boleto.nome,
                            criador_type: 'App\\Models\\CampanhaBoleto'
                        });
                    });
                    this.getCanceladas();
                })
            },
            getCanceladas() {
                this.$store.dispatch('canceladas/get').then(response => {
                    response.forEach(cancelada => {
                        this.canceladas.push({
                            id: cancelada.id,
                            label: cancelada.nome,
                            criador_type: 'App\\Models\\CampanhaCancelado'
                        });
                    });
                    this.getWhats();
                })
            },
            getWhats() {
                this.$store.dispatch('whats/get').then(response => {
                    response.forEach(whats => {
                        this.whats.push({
                            id: whats.id,
                            label: whats.nome,
                            criador_type: 'App\\Models\\CampanhaWhatsapp'
                        });
                    });
                    this.getAgendadas();
                })
            },
            getAgendadas() {
                this.$store.dispatch('agendadas/get').then(response => {
                    response.forEach(agendada => {
                        this.agendadas.push({
                            id: agendada.id,
                            label: agendada.nome,
                            criador_type: 'App\\Models\\CampanhaAgendamento'
                        });
                    });
                    this.setResponsaveis();
                })
            },
            setResponsaveis() {
                /*console.log('users', this.usuarios);
                console.log('whats', this.whats);
                console.log('boletos', this.boletos);
                console.log('agendamento', this.agendadas);
                console.log('canceladas', this.canceladas);*/

                this.agentes.push(
                    {tipo: 'Usuário', libs: [...this.usuarios]},
                    {tipo: 'Campanha de Whatsapp', libs: [...this.whats]},
                    {tipo: 'Campanha de Boleto', libs: [...this.boletos]},
                    {tipo: 'Campanha de Agendamento', libs: [...this.agendadas]},
                    {tipo: 'Campanha de Canceladas', libs: [...this.canceladas]}
                );
            }
        },
        watch: {
            selectedResp(e){
                console.log('trocou', e);
                this.$emit('chooseResp', e);
            }
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>