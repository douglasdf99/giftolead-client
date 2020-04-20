<template>
    <div>
        <vs-input size="large"
                  v-validate="'required|email|min:3'"
                  data-vv-validate-on="blur"
                  name="email"
                  icon-no-border
                  icon="icon icon-user"
                  icon-pack="feather"
                  label-placeholder="E-mail"
                  v-model="email"
                  class="w-full"/>

        <vs-input size="large"
                  data-vv-validate-on="blur"
                  v-validate="'required|min:6|'"
                  :type="tipo"
                  name="password"
                  icon-no-border
                  icon="icon icon-lock"
                  icon-pack="feather"
                  label-placeholder="Senha"
                  v-model="password"
                  class="w-full mt-6"/>

        <div class="flex flex-wrap justify-between my-5">
            <vs-checkbox v-model="show_password" @click="mostrar_senha" class="show_password mb-3">Mostrar senha
            </vs-checkbox>
            <router-link to="/esqueceu-a-senha">Esqueceu a senha?</router-link>
        </div>
        <div class="flex flex-wrap items-center justify-between mb-3 buttons-login">
            <a href="#" class="registrar">Não tenho conta!</a>
            <vs-button :disabled="!validateForm" @click="loginJWT">Entrar</vs-button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                email: '',
                password: '',
                show_password: false,
                tipo: 'password'
            }
        },
        computed: {
            validateForm() {
                return !this.errors.any() && this.email != '' && this.password != '';
            },
        },
        methods: {
            checkLogin() {
                // If user is already logged in notify
                if (this.$store.state.auth.isUserLoggedIn()) {

                    // Close animation if passed as payload
                    // this.$vs.loading.close()

                    this.$vs.notify({
                        title: 'Tentativa de Login',
                        text: 'Você já está logado!',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'warning'
                    })

                    return false
                }
                return true
            },
            loginJWT() {

                if (!this.checkLogin()) return

                // Loading
                this.$vs.loading()

                const payload = {
                    checkbox_remember_me: this.checkbox_remember_me,
                    userDetails: {
                        email: this.email,
                        password: this.password
                    }
                };

                this.$store.dispatch('auth/loginJWT', payload)
                    .then(() => {
                        this.$store.dispatch('auth/getUser').then(() => {
                            this.$vs.loading.close();
                            // Navigate User to homepage
                            this.$router.push(this.$router.currentRoute.query.to || '/');
                        });
                    })
                    .catch(error => {
                        this.$vs.loading.close()
                        this.$vs.notify({
                            title: 'Error',
                            text: error.message,
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    })
            },
            registerUser() {
                if (!this.checkLogin()) return
                this.$router.push('/registrar').catch(() => {
                })
            },
            mostrar_senha() {
                this.tipo = (!this.show_password ? 'text': 'password')
            }
        }
    }
</script>

<style scoped>
    .buttons-login {
        margin: 5rem 0;
    }

    .registrar {
        font-family: "Poppins", sans-serif;
        color: #9344C4;
        font-weight: bold;
        cursor: pointer;
    }
</style>