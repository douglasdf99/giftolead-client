<template>
    <!--<div class="h-screen flex w-full bg-img">
        <div class="vx-col w-4/5 sm:w-4/5 md:w-3/5 lg:w-3/4 xl:w-3/5 mx-auto self-center">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">
                    <div class="vx-row">
                        <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
                            <img src="@/assets/images/pages/forgot-password.png" alt="login" class="mx-auto">
                        </div>
                        <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center d-theme-dark-bg">
                            <div class="p-8" v-if="!comErro">
                                <div class="vx-card__title mb-8">
                                    <h4 class="mb-4">Recuperando sua senha</h4>
                                    <p>Seu token foi encontrado. Por favor, insira abaixo sua nova senha e confirme-a
                                        novamente para que ela possar ser trocada.</p>
                                </div>
                                <span class="text-danger text-sm" v-if="password !== repeat_password">As senhas precisam ser idênticas</span>
                                <vs-input type="password" label-placeholder="Nova senha" v-model="password"
                                          class="w-full mb-8"/>
                                <vs-input type="password" label-placeholder="Repita a senha" v-model="repeat_password"
                                          class="w-full mb-8"/>
                                <vs-button type="border" to="/pages/login" class="px-4 w-full md:w-auto">Voltar ao
                                    Login
                                </vs-button>
                                <vs-button class="float-right px-4 w-full md:w-auto mt-3 mb-8 md:mt-0 md:mb-0"
                                           :disabled="!(password === repeat_password)"
                                           @click="recuperar">Recuperar Senha
                                </vs-button>
                            </div>
                            <div class="p-8" v-if="comErro">
                                <div class="vx-card__title mb-8">
                                    <h4 class="mb-4">Token não encontrado</h4>
                                    <p>Seu token não foi encontrado no nosso banco de dados. Por favor, solicite o mesmo
                                        por e-mail</p>
                                </div>
                                <vs-button type="border" to="/esqueceu-a-senha" class="px-4 w-full md:w-auto">Solicitar
                                    recuperação
                                </vs-button>
                            </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>-->
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
                                <div class="p-8" v-if="!comErro">
                                    <div class="vx-card__title mb-8">
                                        <h4 class="mb-4">Recuperando sua senha</h4>
                                        <p>Seu token foi encontrado. Por favor, insira abaixo sua nova senha e
                                            confirme-a novamente para que ela possar ser trocada.</p>
                                    </div>
                                    <span class="text-danger text-sm" v-if="password !== repeat_password">As senhas precisam ser idênticas</span>
                                    <vs-input type="password" label-placeholder="Nova senha" v-model="password"
                                              class="w-full mb-8"/>
                                    <vs-input type="password" label-placeholder="Repita a senha"
                                              v-model="repeat_password"
                                              class="w-full mb-8"/>
                                    <vs-button type="border" to="/pages/login" class="px-4 w-full md:w-auto">Voltar ao
                                        Login
                                    </vs-button>
                                    <vs-button class="float-right px-4 w-full md:w-auto mt-3 mb-8 md:mt-0 md:mb-0"
                                               :disabled="!(password === repeat_password)"
                                               @click="recuperar">Recuperar Senha
                                    </vs-button>
                                </div>
                                <div class="p-8" v-if="comErro">
                                    <div class="vx-card__title mb-8">
                                        <h4 class="mb-4">Token não encontrado</h4>
                                        <p>Seu token não foi encontrado no nosso banco de dados. Por favor, solicite o
                                            mesmo por e-mail</p>
                                    </div>
                                    <vs-button type="border" to="/esqueceu-a-senha" class="px-4 w-full md:w-auto">
                                        Solicitar recuperação
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
                token: this.$route.params.token,
                password: '',
                repeat_password: '',
                email: '',
                comErro: false
            }
        },
        created() {
            console.log('token aí', this.$route.params.token)
            this.findToken().catch(erro => {
                console.log(erro)
                this.comErro = true
                this.$vs.notify({
                    title: 'Erro',
                    text: "Token não encontrado",
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })
            });
        },
        methods: {
            recuperar() {
                if (this.password === this.repeat_password) {
                    this.$vs.loading()
                    axios.post('/api/reset', {
                        token: this.token,
                        password: this.password,
                        password_confirmed: this.repeat_password,
                        email: this.email
                    }).then(() => {
                        this.$vs.loading.close();
                        this.$vs.notify({
                            title: 'Sucesso',
                            text: "Senha alterada com sucesso",
                            iconPack: 'feather',
                            icon: 'icon-check-circle',
                            color: 'success'
                        });
                        this.$router.push({name: 'login'});
                    }).catch(erro => {
                        this.$vs.loading.close();
                        console.log(erro)
                        this.$vs.notify({
                            title: 'Erro',
                            text: "Algo deu errado na recuperação de senha",
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    })
                }
            },
            findToken() {
                return new Promise((resolve, reject) => {
                    axios.get(`/api/find/${this.token}`).then(response => {
                        console.log(response)
                        this.email = response.data.email;
                        resolve(response)
                    }).catch(erro => reject(erro));
                })
            }
        }
    }
</script>

<style scoped>
    small {
        font-size: .9rem;
        color: red;
    }
</style>