<!-- =========================================================================================
    File Name: ForgotPassword.vue
    Description: FOrgot Password Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="h-screen flex w-full bg-img">
        <div class="vx-col w-4/5 sm:w-4/5 md:w-3/5 lg:w-3/4 xl:w-3/5 mx-auto self-center">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">
                    <div class="vx-row">
                        <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
                            <img src="@/assets/images/pages/forgot-password.png" alt="login" class="mx-auto">
                        </div>
                        <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center d-theme-dark-bg">
                            <div class="p-8">
                                <div class="vx-card__title mb-8">
                                    <h4 class="mb-4">{{enviado ? 'Enviamos o e-mail com a chave de segurança' : 'Recupere sua senha'}}</h4>
                                    <p v-show="!enviado">Por favor, entre com seu endereço de e-mail e enviaremos as intruções para a
                                        recuperação de senha.</p>
                                </div>

                                <vs-input v-show="!enviado" type="email" label-placeholder="Email" v-model="email" class="w-full mb-8" onautocomplete/>
                                <vs-button type="border" to="/login" class="px-4 w-full md:w-auto">Voltar ao
                                    Login
                                </vs-button>
                                <vs-button v-show="!enviado" class="float-right px-4 w-full md:w-auto mt-3 mb-8 md:mt-0 md:mb-0"
                                           @click="solicitar">Solicitar
                                </vs-button>
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
                    console.log(response)
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
