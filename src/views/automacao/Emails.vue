<template>
    <div>
        <!--<side-bar v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="closeSidebar" :data="listaEmails" rota="checkout"/>-->
        <div class="vx-row mt-10">
            <div class="vx-col w-full lg:w-1/4">
                <span class="font-regular mb-2">Brinde</span>
                <v-select v-model="selectedBrinde" :class="'select-large-base'" :clearable="false"
                          style="background-color: white" :options="brindes" name="conta"/>
            </div>
        </div>
        <vs-divider class="mt-base"></vs-divider>
        <div class="vx-row mt-10" v-if="selectedBrinde.id != null">
            <div class="vx-col col-conquista mb-10">
                <h4 class="text-center mb-4">Ao entrar</h4>
                <!--<div v-if="!emailCriar" class="conquista nova cursor-pointer"
                     @click="$router.push({path: `/brindes/automacao/emails/criar/1`})">
                    <div class="img-plus cursor-pointer">
                        <i class="material-icons">add</i>
                    </div>
                    <p class="nome-conq">
                        Adicionar <br> novo e-mail
                    </p>
                </div>-->
                <div class="conquista" style="cursor: default !important">
                    <div class="py-2 w-full flex my-2"></div>
                    <div class="w-full">
                        <img src="@/assets/images/util/e-mail.svg" class="img-conquista my-3" width="120">
                        <p class="nome-conq mb-4 text-base">
                            {{ emailCriar.assunto }}
                        </p>
                    </div>
                    <vs-button color="primary" type="border" class="font-bold"
                               @click="$router.push({path: `/brindes/automacao/emails/editar/${emailCriar.id}/1`})">
                        Editar e-mail
                    </vs-button>
                </div>
            </div>
            <div class="vx-col col-conquista mb-10">
                <h4 class="text-center mb-4">A receber código de rastreio</h4>
                <div class="conquista" style="cursor: default !important">
                    <div class="py-2 w-full flex justify-end">
                        <vs-switch vs-icon-on="check" color="#0FB599" class="float-right switch"
                                   v-model="emailRastreio.status" @click="ativaEmail(emailRastreio)"/>
                    </div>
                    <div class="w-full">
                        <img src="@/assets/images/util/e-mail.svg" class="img-conquista my-3" width="120">
                        <p class="nome-conq mb-4 text-base">
                            {{ emailRastreio.assunto }}
                        </p>
                    </div>
                    <vs-button color="primary" type="border" class="font-bold"
                               @click="$router.push({path: `/brindes/automacao/emails/editar/${emailRastreio.id}/2`})">
                        Editar e-mail
                    </vs-button>
                </div>
            </div>
        </div>
        <transition name="fade">
            <footer-doug>
                <div class="vx-col sm:w-11/12 mb-2">
                    <vs-button class="float-right mr-3" color="dark" type="filled" icon-pack="feather" icon="x-circle"
                               @click="$router.push({path: '/brindes/automacao'})">
                        Voltar
                    </vs-button>
                </div>
            </footer-doug>
        </transition>
    </div>
</template>

<script>
import vSelect from 'vue-select'
import moduleAutomacao from "../../store/automacao/moduleAutomacao";
import moduleBrindes from "@/store/brindes/moduleBrindes";
/*import SideBar from '../Reorganizar'*/

export default {
    name: "Emails",
    components: {
        'v-select': vSelect,
        /*SideBar*/
    },
    created() {
        if (!moduleAutomacao.isRegistered) {
            this.$store.registerModule('automacao', moduleAutomacao)
            moduleAutomacao.isRegistered = true
        }

        if (!moduleBrindes.isRegistered) {
            this.$store.registerModule('brindes', moduleBrindes)
            moduleBrindes.isRegistered = true
        }
        this.getBrindes();
    },
    data() {
        return {
            campanha: {
                nome: '',
                produto: '',
                status: null,
                checkout: ''
            },
            emails: [],
            listaEmails: [],
            countSwitch: [],
            addNewDataSidebar: false,
            brindes: [],
            selectedBrinde: {id: null, label: 'Selecione'}
        }
    },
    methods: {
        getBrindes(){
            this.$vs.loading();
            this.$store.dispatch('brindes/get').then(response => {
                this.brindes = [...this.arraySelect(response)];
                this.$vs.loading.close();
            });
        },
        organizar() {
            this.listaEmails = [...this.emails];
            this.toggleDataSidebar(true)
        },
        closeSidebar() {
            this.toggleDataSidebar();
            this.getId(this.$route.params.id)
        },
        toggleDataSidebar(val = false) {
            this.addNewDataSidebar = val
        },
        getId() {
            this.$vs.loading();
            this.$store.dispatch('automacao/getEmails', this.selectedBrinde.id).then(response => {
                console.log('emails', response);
                this.emails = response;
                this.$vs.loading.close();
            });
        },
        ativaEmail(e) {
            console.log(this.countSwitch)
            if (this.countSwitch[e.id] !== undefined && this.countSwitch[e.id] === 3) {
                e.status = !e.status;
                this.$vs.notify({
                    title: '',
                    text: 'Muitas tentativas de ativação',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
            } else {
                console.log(e)
                const formData = new FormData();
                let ativo = e.status ? 0 : 1;
                let text = e.status ? 'Desativada' : 'Ativada';
                formData.append('status', ativo);
                formData.append('_method', 'PUT');
                formData.append('assunto', e.assunto);
                this.$store.dispatch('checkout/updateEmail', {id: e.id, dados: formData}).then(() => {
                    this.$vs.notify({
                        title: '',
                        text: text + " com sucesso.",
                        iconPack: 'feather',
                        icon: 'icon-check-circle',
                        color: 'success'
                    });
                }).catch(erro => {
                    this.$vs.notify({
                        title: 'Error',
                        text: erro.message,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                })
                this.countSwitch[e.id] = this.countSwitch[e.id] !== undefined ? this.countSwitch[e.id] + 1 : 1;
            }
        }
    },
    computed: {
        isValid() {
            return this.errors.any();
        },
        emailCriar() {
            let email = false
            this.emails.forEach((item) => {
                if (item.evento == 1) email = item;
            });
            return email;
        },
        emailRastreio() {
            let email = false
            this.emails.forEach((item) => {
                if (item.evento == 3) email = item;
            });
            return email;
        },
    },
    watch: {
        "$route"() {
            this.routeTitle = this.$route.meta.pageTitle
        },
        selectedBrinde: {
            handler(val) {
                this.getId();
            },
            deep: true
        },
    },
}
</script>

<style>
[dir] .con-select .vs-select--input {
    padding: 1.4rem 2rem !important;
}

#copy-icon {
    position: absolute;
    top: 0.7rem;
    right: 30px;
    cursor: pointer;
}
</style>
