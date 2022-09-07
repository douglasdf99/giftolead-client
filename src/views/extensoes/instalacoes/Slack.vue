<template>
    <div>
        <div class="vx-row">
            <div class="vx-col w-full lg:w-3/12 relative" style="height: 100%;">
                <div class="rounded-t-lg bg-dark" style="height: 100px;"></div>
                <img src="@/assets/images/util/slack.png" width="50%" class="absolute bg-white px-4" style="border-radius: 10px;left: 25%; top: 20%">
                <div class="rounded-b-lg text-center" style="background-color: #E8EBF2">
                    <p class="pt-20 font-bold text-black">Slack</p>
                    <p class="my-2">Integre o Slack da sua empresa ao sistema, possibilitando envio automático de notificações.</p>
                    <vs-button color="dark" class="my-5 w-10/12" @click="instalar" v-if="$acl.check('extensao_slack_install')">{{instalado ? 'Desinstalar' : 'Instalar'}}</vs-button>
                </div>
            </div>
            <div class="vx-col w-full lg:w-9/12">
                <div class="vx-row mb-5">
                    <div class="vx-col w-full" v-if="extensao != null">
                        <vs-switch vs-icon-on="check" v-model="extensao.ativo" color="#0FB599" class="float-right switch" @click="ativaExtensao"/>
                        <span class="float-right mt-1 mx-4"
                              style="font-weight: bold">{{extensao.ativo ? 'Ativado' : 'Desativado'}}</span>
                    </div>
                </div>
                <div class="vx-row">
                    <div class="vx-col w-full mb-4">
                        <div class="p-5 rounded-lg bg-white">
                            <p>
                                Importante: a URL do Webhook da plataforma pode ser encontrada
                                <a target="_blank" href="https://slack.com/services/new/incoming-webhook" style="text-decoration: none">aqui</a>.
                            </p>
                        </div>
                    </div>
                    <div class="vx-col w-full" v-if="extensao != null">
                        <span class="font-regular mb-2">WebHook</span>
                        <vs-input class="w-full" v-model="extensao.extensao.webhook" :disabled="!$acl.check('extensao_slack_editar')" size="large" type="text" v-validate="'url:require_protocol'"/>
                        <vs-button class="mt-3" size="medium" color="primary" @click="salvar" v-if="$acl.check('extensao_slack_editar')">Salvar</vs-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moduleExtensoes from "../../../store/extensoes/moduleExtensoes";
import vSelect from 'vue-select';
import moduleUsuario from "../../../store/usuarios/moduleUsuario";

const moment = require('moment/moment');
require('moment/locale/pt-br');

export default {
    name: "TotalVoice",
    components: {
        moment, 'v-select': vSelect,
    },
    data() {
        return {
            status: false,
            dados: {
                dt_inicio: '',
                dt_fim: '',
                subdomain: 'app',
                type: 'App\\Models\\Extensoes\\Slack',
                page: 1
            },
            pagination: {
                last_page: 1,
                page: 1,
                current_page: 1,
                total: 0
            },
            extensao: null,
            currentx: 1,
            instalado: false,
            countSwitch: 0,
        };
    },
    created() {
        if (!moduleExtensoes.isRegistered) {
            this.$store.registerModule('extensoes', moduleExtensoes);
            moduleExtensoes.isRegistered = true;
        }

        if (!moduleUsuario.isRegistered) {
            this.$store.registerModule('users', moduleUsuario);
            moduleUsuario.isRegistered = true;
        }

        this.verifica();
    },
    computed: {
        users() {
            let users = [];
            this.usersall.forEach(val => {
                if (val.ramal == null)
                    users.push({id: val.id, label: val.name});
            });
            return users;
        }
    },
    methods: {
        verifica() {
            this.$vs.loading();
            this.dados.subdomain = window.location.host.split('.')[1] ? window.location.host.split('.')[0] : 'app';
            this.$store.dispatch('extensoes/get', this.dados.subdomain).then(response => {
                let arr = response.extensoes;
                if (arr.length > 0) {
                    arr.forEach(item => {
                        if (item.extensao_type === "App\\Models\\Extensoes\\Slack") {
                            this.extensao = item;
                            this.extensao.extensao = item.extensao;
                            this.instalado = true;
                        }
                    });
                } else {
                    this.$vs.loading.close();
                }
            }).finally(() => this.$vs.loading.close());
        },
        ativaExtensao() {
            if (this.countSwitch === 3) {
                this.extensao.ativo = !this.extensao.ativo;
                this.$vs.notify({
                    title: '',
                    text: 'Muitas tentativas de ativação',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
            } else {
                const formData = new FormData();
                let ativo = this.extensao.ativo ? 0 : 1;
                let text = this.extensao.ativo ? 'Desativada' : 'Ativada';
                formData.append('ativo', ativo);
                formData.append('_method', 'PUT');
                this.$store.dispatch('extensoes/ativa', {id: this.extensao.id, dados: formData}).then(() => {
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
                        text: erro.response.data.message,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    });
                });
                this.countSwitch += 1;
            }
        },
        instalar() {
            this.$vs.dialog({
                color: 'primary',
                title: `Instalar extensão?`,
                text: 'Você confirma que leu e aceita os termos da instalação?',
                acceptText: 'Sim, prosseguir!',
                accept: () => {
                    this.$vs.loading();
                    this.$store.dispatch('extensoes/instalar', {subdomain: this.dados.subdomain, type: 'Slack'}).then(() => {
                        this.$vs.notify({
                            color: 'success',
                            title: '',
                            text: 'Instalado com sucesso'
                        });
                        this.verifica();
                    }).catch(() => {
                        this.$vs.notify({
                            color: 'danger',
                            title: '',
                            text: 'Algo deu errado ao instalar. Contate o suporte.'
                        });
                    });
                }
            });
        },
        getUsers() {
            this.$store.dispatch('users/get').then(response => {
                this.usersall = response;
            });
        },
        salvar() {
            this.$vs.loading();
            this.$store.dispatch('extensoes/storeSlack', this.extensao.extensao).then(() => {
                this.$vs.notify({
                    color: 'success',
                    text: 'URL salva com sucesso.'
                });
            }).catch(() => {
                this.$vs.notify({
                    color: 'danger',
                    text: 'Algo deu errado ao salvar a configuração. Contate o suporte.'
                });
            }).finally(() => this.$vs.loading.close());
        }
    },
};
</script>

<style scoped>

</style>
