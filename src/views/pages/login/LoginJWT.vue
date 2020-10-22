<template>
    <div>
        <form @submit="loginJWT">
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
                <button type="submit" class="btn-entrar bg-primary cursor-pointer" :disabled="!validateForm">Entrar</button>
            </div>
        </form>
    </div>
</template>

<script>
  import {Validator} from 'vee-validate';
  import saveleadsConfig from "../../../../saveleadsConfig";

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
      created(){
       // localStorage.removeItem("permissoes");
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
            loginJWT(e) {
                e.preventDefault();
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
                    .then((response) => {
                      saveleadsConfig.token = response;
                      console.log('config', saveleadsConfig);
                        this.$store.dispatch('auth/getPermissoes',response).then(()=>{
                          this.$store.dispatch('auth/getUserLogin',response).then(()=>{
                          console.log('resolveu permissoes')
                          window.location.href = window.location.protocol + '//' + window.location.host + (this.$router.currentRoute.query.to || '/');
                        });
                      });
                    })
                    .catch(error => {
                      this.$vs.loading.close();
                        console.log(error);
                        this.$vs.notify({
                            title: 'Error',
                            text: error.response.data,
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    }).finally(()=>{
                })
            },
            registerUser() {
                if (!this.checkLogin()) return
                this.$router.push('/registrar').catch(() => {
                })
            },
            mostrar_senha() {
                this.tipo = (!this.show_password ? 'text' : 'password')
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

    .btn-entrar {
        padding: 1rem 4rem;
        background-color: #9344C4 !important;
        font-family: "Poppins", sans-serif;
        color: white;
        border-radius: 10px;
        border: none;
        font-weight: bold;
        font-size: 1.2rem;
        transition-duration: .3s;
    }

    .btn-entrar:hover {
        transition-duration: .3s;
        background-color: #7d31bc !important;
    }
</style>
