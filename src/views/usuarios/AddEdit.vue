<template>
	<div>
		<div class="vx-row mb-4">
			<div class="vx-col lg:w-full w-full">
				<div class="float-right mt-1 mx-4">
					<vs-chip v-if="usuario.status == 'pending'" color="warning"
						>Aguardando</vs-chip
					>
					<vs-chip v-if="usuario.status == 'active'" color="primary"
						>Ativo</vs-chip
					>
					<vs-chip v-if="usuario.status == 'inactive'" color="danger"
						>Inativo</vs-chip
					>
				</div>

				<!--<vs-switch
					:disabled="usuario.status == 'pending'"
					vs-icon-on="check"
					color="#0FB599"
					v-model="usuario.status"
					class="float-right switch"
				/>-->
				<span class="float-right mt-1 mx-4" style="font-weight: bold"
					>Status</span
				>
			</div>
		</div>
		<div class="vx-row mb-3">
			<div class="vx-col w-full xlg:w-12/12 lg:w-12/12">
				<div class="vx-row mb-3">
					<div
						class="vx-col w-full lg:w-1/2 sm:w-full"
						v-if="usuario.name"
					>
						<span class="font-regular mb-2">Nome</span>
						<vs-input
							class="w-full"
							v-model="usuario.name"
							size="large"
							name="name"
							v-validate="'required'"
							:disabled="true"
						/>
						<span
							class="text-danger text-sm"
							v-show="errors.has('name')"
							>{{ errors.first("name") }}</span
						>
					</div>
					<div class="vx-col w-full lg:w-1/2 sm:w-full" v-if="usuario.sck">
						<span class="font-regular mb-2">Origem (sck) do usuário</span>
						<vs-input
							class="w-full"
							v-model="usuario.sck"
							name="sck"
							size="large"
							type="text"
							v-validate="'required'"
							:disabled="true"
						/>

						<span
							class="text-danger text-sm"
							v-show="errors.has('sck')"
							>{{ errors.first("sck") }}</span
						>
						<!--<span class="text-danger text-sm" v-show="sckRepetido">{{ sugestoes }}</span>-->
					</div>
				</div>
				<div class="vx-row mb-3">
					<div class="vx-col w-full lg:w-1/2 sm:w-full">
						<span class="font-regular mb-2">E-mail</span>
						<vs-input
							class="w-full"
							@blur="sugereSck"
							v-model="usuario.email"
							size="large"
							name="email"
							type="email"
							v-validate="'required'"
							:disabled="true"
						/>
						<span
							class="text-danger text-sm"
							v-show="errors.has('email')"
							>{{ errors.first("email") }}</span
						>
					</div>
					<div class="vx-col w-full lg:w-1/2 sm:w-full">
						<span class="font-regular mb-2">Permissões do usuário</span>
						<v-select
							v-model="funcaoSelected"
							name="funcao"
							v-validate="'required'"
							:class="'select-large-base'"
							:clearable="false"
							style="background-color: white"
							:options="opcoesFuncoes"
						/>
						<span
							class="text-danger text-sm"
							v-show="errors.has('funcao')"
							>{{ errors.first("funcao") }}</span
						>
					</div>
				</div>
			</div>
		</div>
		<transition name="fade">
			<footer-doug>
				<div class="vx-col sm:w-11/12 mb-2">
					<vs-button
						class="float-right mr-3"
						color="dark"
						type="flat"
						icon-pack="feather"
						icon="x-circle"
						@click="$router.push({ name: 'usuarios' })"
					>
						Cancelar
					</vs-button>
					<vs-button
						class="float-right mr-3"
						color="primary"
						type="filled"
						@click="salvar"
						:disabled="isValid && this.sckRepetido"
					>
						Salvar
					</vs-button>
				</div>
			</footer-doug>
		</transition>
	</div>
</template>

<script>
import vSelect from "vue-select";
import moduleUsersCompanies from "@/store/usersCompanies/moduleUsersCompanies.js";
import moduleFuncao from "@/store/funcoes/moduleFuncoes.js";
import { Validator } from "vee-validate";

const dict = {
	custom: {
		name: {
			required: "Por favor, insira o nome",
		},
		email: {
			required: "Por favor, insira o e-mail",
		},
		password: {
			required: "Por favor, insira o senha",
		},
		password_confirmed: {
			required: "Por favor, confirme a senha",
		},
		sck: {
			required: "Por favor, insira a origem do usuário",
			alpha_num:
				"O código SCK não pode conter espaços ou caracteres especiais.",
		},
	},
};
Validator.localize("pt-br", dict);
export default {
	name: "Edit",
	components: {
		"v-select": vSelect,
	},
	created() {
		if (!moduleUsersCompanies.isRegistered) {
			this.$store.registerModule("usersCompanies", moduleUsersCompanies);
			moduleUsersCompanies.isRegistered = true;
		}
		if (!moduleFuncao.isRegistered) {
			this.$store.registerModule("funcoes", moduleFuncao);
			moduleFuncao.isRegistered = true;
		}
		this.getUsers();
		this.verificaExt();
		this.getOpcoes();

		if (this.$route.name === "usuario-editar") {
			this.funcaoSelected = { id: null, label: "" };
			this.getUsuario(this.$route.params.id);
		}
	},
	data() {
		return {
			customcor: "",
			usuario: {
				name: "",
				email: "",
				status: true,
				avatar: "",
				sck: "",
			},
			opcoesFuncoes: [],
			funcaoSelected: null,
			files: [],
			images: [],
			scks: [],
			isDragging: false,
			slack: false,
			sckRepetido: false,
			sugestoes: [],
		};
	},
	methods: {
		salvar() {
			this.$validator.validateAll().then((result) => {
				if (result) {
					this.$vs.loading();
					const formData = new FormData();
					this.files.forEach((file) => {
						formData.append("avatar", file, file.name);
					});

					formData.append("role_id", this.funcaoSelected.id);
					formData.append("status", this.usuario.status);
					formData.append("_method", "PUT");

					this.$store
						.dispatch("usersCompanies/update", {
							dados: formData,
							id: this.usuario.id,
						})
						.then(() => {
							this.$vs.notify({
								title: "Sucesso",
								text: "O usuario foi atualizado com sucesso.",
								iconPack: "feather",
								icon: "icon-check-circle",
								color: "success",
							});
							this.$router.push({ name: "usuarios" });
						})
						.catch((erro) => {
							this.$vs.notify({
								title: "Error",
								text: erro.response.data.message,
								iconPack: "feather",
								icon: "icon-alert-circle",
								color: "danger",
							});
						})
						.finally(() => {
							this.$vs.loading.close();
						});
				} else {
					this.$vs.notify({
						title: "Error",
						text: "verifique os erros específicos",
						iconPack: "feather",
						icon: "icon-alert-circle",
						color: "danger",
					});
				}
			});
		},
		enableValidate() {
			if (this.$route.name === "usuario-editar") return "";
			else return "required";
		},
		getOpcoes() {
			this.opcoesFuncoes = [];
			this.$store.dispatch("funcoes/get").then((response) => {
				let arr = [...response];
				arr.forEach((item) => {
					this.opcoesFuncoes.push({ id: item.id, label: item.nome });
				});
			});
		},
		getUsuario(id) {
			this.$vs.loading();
			this.$store.dispatch("usersCompanies/getId", id).then((data) => {
				this.usuario = { ...data };
				this.usuario.password = "";
				this.usuario.password_confirmed = "";
				this.funcaoSelected = {
					id: this.usuario.role_id,
					label: this.usuario.role_name,
				};

				this.$vs.loading.close();
			});
		},

		getUsers() {
			this.$store.dispatch("usersCompanies/get", {}).then((response) => {
				this.scks = response.map((item) => {
					if (item.id != this.$route.params.id && item.sck !== null)
						return item.sck;
				});
			});
		},

		//drag
		OnDragEnter(e) {
			e.preventDefault();
			this.dragCount++;
			this.isDragging = true;
			return false;
		},
		OnDragLeave(e) {
			e.preventDefault();
			this.dragCount--;
			if (this.dragCount <= 0) this.isDragging = false;
		},
		onInputChange(e) {
			const files = e.target.files;
			Array.from(files).forEach((file) => this.addImage(file));
		},
		onDrop(e) {
			e.preventDefault();
			e.stopPropagation();
			this.isDragging = false;
			const files = e.dataTransfer.files;
			Array.from(files).forEach((file) => this.addImage(file));
		},
		addImage(file) {
			this.files.pop();
			if (!file.type.match("image.*")) {
				this.$toastr.e(`${file.name} is not an image`);
				return;
			}
			this.files.push(file);
			this.usuario.avatar = file;
			const reader = new FileReader();
			this.images.pop();
			reader.onload = (e) => this.images.push(e.target.result);
			reader.readAsDataURL(file);
		},
		getFileSize(size) {
			const fSExt = ["Bytes", "KB", "MB", "GB"];
			let i = 0;

			while (size > 900) {
				size /= 1024;
				i++;
			}
			return `${Math.round(size * 100) / 100} ${fSExt[i]}`;
		},
		verificaExt() {
			this.slack = this.extensoes.find((element) => element == "slack");
		},
	},
	computed: {
		isValid() {
			return this.errors.any();
		},
		extensoes() {
			return this.$store.state.extensoes.extensoes.map(function (item) {
				return item.type;
			});
		},
	},
	watch: {
		currentx() {
			this.$vs.loading();
			this.dados.page = this.currentx;
			this.getContas();
		},
		$route() {
			this.routeTitle = this.$route.meta.pageTitle;
		},
	},
};
</script>

<style scoped lang="scss">
.uploader {
	width: 100%;
	background: #fff;
	color: #0c0808;
	padding: 40px 15px;
	text-align: center;
	border-radius: 10px;
	border: 3px dashed #fff;
	font-size: 20px;
	position: relative;

	&.dragging {
		background: #fff;
		color: #2196f3;
		border: 3px dashed #e7e7e7;

		.file-input label {
			background: #f0f2f4;
			color: #fff;
		}
	}

	i {
		font-size: 85px;
	}

	.file-input {
		width: 200px;
		margin: auto;
		height: 68px;
		position: relative;

		label,
		input {
			background: #f1f5f7;
			color: #0c0808;
			width: 100%;
			position: absolute;
			left: 0;
			top: 0;
			font-size: 18px;
			padding: 10px;
			border-radius: 4px;
			margin-top: 7px;
			cursor: pointer;
		}

		input {
			opacity: 0;
			z-index: -2;
		}
	}

	.images-preview {
		display: flex;
		flex-wrap: wrap;

		.img-wrapper {
			width: auto;
			display: flex;
			/*/flex-direction: column;*/
			margin: 10px;

			justify-content: space-between;
			background: #fff0;
			//box-shadow: 5px 5px 20px #3e3737;
			img {
				max-height: 200px;
				max-width: 200px;
				width: 100%;
			}
		}

		.details {
			font-size: 12px;
			background: #fff;
			color: #000;
			display: flex;
			flex-direction: column;
			padding: 3px 6px;

			.name {
				overflow: hidden;
				height: 18px;
			}
		}
	}

	.upload-control {
		button,
		label {
			background: #7e57c2;
			border: 2px solid #7e57c2;
			border-radius: 3px;
			color: #fff;
			font-size: 15px;
			cursor: pointer !important;
		}

		label {
			padding: 2px 5px;
		}
	}
}
</style>

<style>
[dir] .con-select .vs-select--input {
	padding: 1.4rem 2rem !important;
}

.list-tipo-comissao .vs-radio--label {
	font-weight: 600;
	margin-left: 2rem;
}

#copy-icon {
	position: absolute;
	top: 0.7rem;
	position: absolute;
	right: 30px;
	cursor: pointer;
}
</style>
