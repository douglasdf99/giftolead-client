<template>
    <div>
        <div class="vx-row mb-3">
            <div class="vx-col w-full">
                <p class="destaque text-2xl">
                    Atendimento do Ticket # <!--{{$route.params.id}}-->
                </p>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col w-full lg:w-1/2 pr-1">
                <div class="w-full bg-white p-4 rounded-lg">
                    <div class="vx-row mb-2">
                        <div class="vx-col w-1/4 text-center">
                            <img src="@/assets/images/util/avatar-padrao.svg" width="80">
                        </div>
                        <div class="vx-col w-3/3">
                            <p class="text-black text-xl font-bold">
                                Teste Vitor
                            </p>
                            <p class="text-black text-xl font-bold mb-2">
                                (87) 98988-1245
                            </p>
                            <p class="font-semibold text-md" style="color: #9B9B9B">lucasesn@gmail.com</p>
                            <p class="font-semibold text-md mb-4" style="color: #9B9B9B">CPF: 066.321.351-70</p>
                            <div class="w-full flex">
                                <vs-button class="font-bold rounded-full" color="primary" type="filled"
                                           icon-pack="material-icons" icon="call">
                                    Ligar agora
                                </vs-button>
                                <vs-button class="rounded-full">
                                    <i class="fab fa-whatsapp text-3xl mx-2 text-white"></i>
                                </vs-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full lg:w-1/2 p1-1">
                <div class="w-full bg-white p-4 rounded-lg">
                    <div class="vx-row">

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moduleTickets from "../../store/tickets/moduleTickets";

    export default {
        name: "Atender",
        data() {
            return {
                ticket: {}
            }
        },
        created() {
            if (!moduleTickets.isRegistered) {
                this.$store.registerModule('tickets', moduleTickets)
                moduleTickets.isRegistered = true
            }
            //this.getId(this.$route.params.id);
        },
        methods: {
            getId(id) {
                this.$vs.loading();
                this.$store.dispatch('tickets/getId', id).then(response => {
                    this.ticket = response;
                    this.$vs.loading.close();
                });
            },
        }
    }
</script>

<style scoped>

</style>