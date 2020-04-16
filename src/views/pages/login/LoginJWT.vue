<template>
  <div>
    <vs-input
            v-validate="'required|email|min:3'"
            data-vv-validate-on="blur"
            name="email"
            icon-no-border
            icon="icon icon-user"
            icon-pack="feather"
            label-placeholder="E-mail"
            v-model="email"
            class="w-full"/>
    <span class="text-danger text-sm">{{ errors.first('email') }}</span>

    <vs-input
            data-vv-validate-on="blur"
            v-validate="'required|min:6|'"
            type="password"
            name="password"
            icon-no-border
            icon="icon icon-lock"
            icon-pack="feather"
            label-placeholder="Senha"
            v-model="password"
            class="w-full mt-6"/>
    <span class="text-danger text-sm">O Preenchimento da senha é obrigatório</span>

    <div class="flex flex-wrap justify-between my-5">
      <vs-checkbox v-model="checkbox_remember_me" class="mb-3">Lembrar-me</vs-checkbox>
      <router-link to="/esqueceu-a-senha">Esqueceu a senha?</router-link>
    </div>
    <div class="flex flex-wrap justify-between mb-3">
      <vs-button type="border" @click="registerUser">Registrar</vs-button>
      <vs-button :disabled="!validateForm" @click="loginJWT">Entrar</vs-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: 'mbr.douglasmatos@gmail.com',
      password: '123456',
      checkbox_remember_me: false
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
  }
}

</script>

