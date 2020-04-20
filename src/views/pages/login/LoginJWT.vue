<template>
    <div>
      <div class="mb-8">
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
        <span class="text-danger text-sm"
              v-show="errors.has('email')">{{ errors.first('email') }}</span>
      </div>
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
      <span class="text-danger text-sm"
            v-show="errors.has('password')">{{ errors.first('password') }}</span>

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
  import {Validator} from 'vee-validate';

  const dict = {
    custom: {
      email: {
        required: 'Por favor, insira o seu email para acessar o sistema',
        email: 'O email informado está com formato inválido',
        min: 'O limite mínimo são de 3 caractérs'

      },
      password: {
        required: 'Por favor, insira a senha para acessar o sistema',
        min: 'O tamanho mínimo da senha são de 3 caractérs'
      }
    }
  };
  Validator.localize('pt-br', dict);
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
                      console.log(error.response);
                        this.$vs.loading.close()
                        this.$vs.notify({
                            title: 'Error',
                            text: error.response.data,
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
