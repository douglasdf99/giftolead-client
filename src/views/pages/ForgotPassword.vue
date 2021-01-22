<!-- =========================================================================================
    File Name: ForgotPassword.vue
    Description: FOrgot Password Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="h-screen flex w-full bg-img vx-row no-gutter items-center" id="page-login">
        <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-5/12 xl:w-5/12 sm:m-0 m-4 sm:h-full">
            <vx-card class="sm:h-full sm:w-full flex items-center"
                     style="-webkit-border-radius: 0;-moz-border-radius: 0;border-radius: 0;">
                <div slot="no-body">
                    <div class="vx-row no-gutter justify-center items-center">
                        <div class="vx-col sm:w-full md:w-full lg:w-2/3 d-theme-dark-bg">
                            <div class="px-8 pt-8 login-tabs-container">
                                <div class="vx-card__title mb-5 flex justify-center"
                                     style="margin-bottom: 5rem !important;">
                                    <img :src="url_api('images/logo2.svg')">
                                </div>
                                <div class="p-8">
                                    <div class="vx-card__title mb-8">
                                        <h4 class="mb-4">{{enviado ? 'Enviamos o e-mail com a chave de segurança' :
                                            'Recupere sua senha'}}</h4>
                                        <p v-show="!enviado">Por favor, entre com seu endereço de e-mail e enviaremos as
                                            intruções para a
                                            recuperação de senha.</p>
                                    </div>

                                    <vs-input v-show="!enviado" type="email" label-placeholder="Email" v-model="email"
                                              class="w-full mb-8" onautocomplete/>
                                    <vs-button type="border" to="/login" class="px-4 w-full md:w-auto">Voltar ao
                                        Login
                                    </vs-button>
                                    <vs-button v-show="!enviado"
                                               class="float-right px-4 w-full md:w-auto mt-3 mb-8 md:mt-0 md:mb-0"
                                               @click="solicitar">Solicitar
                                    </vs-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
</template>

<script>
    import axios from "@/axios.js"

    export default {
        data() {
            return {
                email: '',
                enviado: false
            }
        },
        methods: {
            solicitar() {
                this.$vs.loading()
                axios.post('/api/remember', {email: this.email}).then(response => {
                    this.$vs.loading.close();

                    this.$vs.notify({
                        title: 'Sucesso',
                        text: "Encaminhamos o e-mail",
                        iconPack: 'feather',
                        icon: 'icon-check-circle',
                        color: 'success'
                    });
                    this.enviado = true;
                }).catch(erro => {
                    this.$vs.loading.close();
                    console.log(erro);
                    this.$vs.notify({
                        title: 'Erro',
                        text: "Houve um problema com o servidor, favor contate o suporte.",
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                });
            },
        }
    }
</script>
