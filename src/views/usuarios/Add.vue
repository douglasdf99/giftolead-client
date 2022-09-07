<template>
	<div>
		<div class="vx-row mb-3 p-5">
			<div class="vx-col w-full xlg:w-12/12 lg:w-12/12">
				<div class="vx-row mb-3">
					<div class="vx-col w-full lg:w-1/2 sm:w-full">
						<span class="font-regular mb-2">E-mail</span>
						<vs-input
							class="w-full"
							v-model="usuario.email"
							size="large"
							name="email"
							type="email"
							v-validate="'required'"
						/>
						<span
							class="text-danger text-sm"
							v-show="errors.has('email')"
							>{{ errors.first("email") }}</span
						>
					</div>
					<div class="vx-col w-full lg:w-1/2 sm:w-full">
						<span class="font-regular mb-2">Permissão</span>
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

		<div class="vx-row mb-3">
			<div class="vx-col sm:w-11/12 mb-2">
				<vs-button
					class="float-right"
					color="primary"
					type="filled"
					@click="salvar"
					:disabled="isValid && this.sckRepetido"
				>
					Salvar
				</vs-button>
			</div>
		</div>
	</div>
</template>

<script>
import vSelect from "vue-select";
import moduleFuncao from "@/store/funcoes/moduleFuncoes.js";
import { Validator } from "vee-validate";

const dict = {
	custom: {
		email: {
			required: "Por favor, insira o e-mail",
		},
	},
};
Validator.localize("pt-br", dict);
export default {
	name: "AddUser",
	components: {
		"v-select": vSelect,
	},
	created() {
		if (!moduleFuncao.isRegistered) {
			this.$store.registerModule("funcoes", moduleFuncao);
			moduleFuncao.isRegistered = true;
		}
		this.verificaExt();
		this.getOpcoes();
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
					formData.append("name", this.usuario.name);
					formData.append("email", this.usuario.email);
					formData.append("role_id", this.funcaoSelected.id);
					formData.append("status", this.usuario.status ? 1 : 0);

					this.$store
							.dispatch("usersCompanies/store", formData)
							.then(() => {
							this.$vs.notify({
								title: "Sucesso",
								text: "O usuario foi criado com sucesso.",
								iconPack: "feather",
								icon: "icon-check-circle",
								color: "success",
							});
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
							this.$parent.$emit('closeModal');
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
		getOpcoes() {
			this.opcoesFuncoes = [];
			this.$store.dispatch("funcoes/get").then((response) => {
				let arr = [...response];
				arr.forEach((item) => {
					this.opcoesFuncoes.push({ id: item.id, label: item.nome });
				});
			});
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
