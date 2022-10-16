<template>
	<div>
		<form @submit.prevent="loginJWT">
			<div class="mb-8">
				<vs-input
					size="large"
					v-validate="'required|email|min:3'"
					data-vv-validate-on="blur"
					name="email"
					icon-no-border
					icon="icon icon-user"
					icon-pack="feather"
					label-placeholder="E-mail"
					v-model="email"
					class="w-full"
				/>
				<span class="text-danger text-sm" v-show="errors.has('email')">{{
					errors.first("email")
				}}</span>
			</div>
			<vs-input
				size="large"
				data-vv-validate-on="blur"
				v-validate="'required|min:6|'"
				:type="tipo"
				name="password"
				id="password"
				icon-no-border
				icon="icon icon-lock"
				icon-pack="feather"
				label-placeholder="Senha"
				v-model="password"
				class="w-full mt-6"
				v-on:keyup="validateKeyPress"
			/>
			<span class="text-danger text-sm" v-show="errors.has('password')">{{
				errors.first("password")
			}}</span>

			<div class="flex flex-wrap justify-between my-5">
				<vs-checkbox
					v-model="show_password"
					@click="mostrar_senha"
					class="show_password mb-3"
				>
					Mostrar senha
				</vs-checkbox>
				<router-link to="/esqueceu-a-senha">Esqueceu a senha?</router-link>
			</div>
			<div
				class="flex flex-wrap items-center justify-between mb-3 buttons-login"
			>
				<span @click="$router.push({name: 'register'})" class="registrar">Não tenho conta!</span>
				<button
					type="submit"
					class="btn-entrar bg-primary cursor-pointer"
					:disabled="!validateForm"
				>
					Entrar
				</button>
			</div>
		</form>
	</div>
</template>

<script>
import saveleadsConfig from "../../../../saveleadsConfig";

export default {
	data() {
		return {
			email: "",
			password: "",
			show_password: false,
			tipo: "password",
		};
	},
	created() {
		//localStorage.clear();
	},
	computed: {
		validateForm() {
			return !this.errors.any() && this.email != "" && this.password != "";
		},
	},
	methods: {
		checkLogin() {
			if (this.$store.state.auth.isUserLoggedIn()) {
				this.$vs.notify({
					title: "Tentativa de Login",
					text: "Você já está logado!",
					iconPack: "feather",
					icon: "icon-alert-circle",
					color: "warning",
				});
				return false;
			}
			return true;
		},
		loginJWT() {
			if (!this.checkLogin()) return;

			// Loading
			this.$vs.loading();

			const payload = {
				checkbox_remember_me: this.checkbox_remember_me,
				userDetails: {
					email: this.email,
					password: this.password,
				},
			};

			this.$store
				.dispatch("auth/loginJWT", payload)
				.then((response) => {
					saveleadsConfig.token = response;
					document.location.href = "/";

					// this.$router.push('/');
				})
				.catch((error) => {
					console.log(error);
					if (error.response && error.response.data) {
						this.$vs.notify({
						title: "Ops...",
						text: error.response.data,
						iconPack: "feather",
						icon: "icon-alert-circle",
						color: "danger",
					});
					}
				})
				.finally(() => this.$vs.loading.close());
		},
		registerUser() {
			if (!this.checkLogin()) return;
			this.$router.push("/registrar").catch(() => {});
		},
		mostrar_senha() {
			this.tipo = !this.show_password ? "text" : "password";
		},
		validateKeyPress(e) {
			if (e.keyCode === 13) {
				const input = document.getElementById("password");
				input.blur();
				this.loginJWT();
			}
		},
	},
};
</script>

<style scoped>
.buttons-login {
	margin: 5rem 0;
}

.registrar {
	font-family: "Poppins", sans-serif;
	color: #9344c4;
	font-weight: bold;
	cursor: pointer;
}

.btn-entrar {
	padding: 1rem 4rem;
	background-color: #9344c4 !important;
	font-family: "Poppins", sans-serif;
	color: white;
	border-radius: 10px;
	border: none;
	font-weight: bold;
	font-size: 1.2rem;
	transition-duration: 0.3s;
}

.btn-entrar:hover {
	transition-duration: 0.3s;
	background-color: #7d31bc !important;
}
</style>
