<template>
	<div>
		<div class="vx-row mb-3">
			<div class="vx-col w-full xlg:w-12/12 lg:w-12/12">
				<div class="vx-row mb-3">
					<div class="vx-col w-full">
						<span class="font-regular mb-2">Nome</span>
						<vs-input class="w-full" v-model="usuario.name" size="large" v-validate="'required'" disabled/>
						<span class="text-danger text-sm" v-show="errors.has('name')">{{ errors.first('name') }}</span>
					</div>
				</div>
				<div class="vx-row mb-3">
					<div class="vx-col w-full md:w-1/2 lg:w-1/2 xlg:w-1/2">
						<span class="font-regular mb-2">E-mail</span>
						<vs-input class="w-full" v-model="usuario.email" size="large" type="email" disabled/>
					</div>
					<div class="vx-col w-full md:w-1/2 lg:w-1/2 xlg:w-1/2">
						<span class="font-regular mb-2">Função</span>
						<vs-input class="w-full" v-model="usuario.role_name" size="large" type="text" disabled/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import moduleUsuario from '@/store/usersCompanies/moduleUsersCompanies.js';
import {Validator} from 'vee-validate';

const dict = {
	custom: {
		name: {
			required: 'Por favor, insira o nome',
		},
		password: {
			required: 'Por favor, insira o senha',
		},
		password_confirmed: {
			required: 'Por favor, confirme a senha',
			confirmed: 'Confirme corretamente a senha'
		},
	}
};
Validator.localize('pt-br', dict);
export default {
	name: "Edit",
	async created() {
		if (!moduleUsuario.isRegistered) {
			this.$store.registerModule('usersCompanies', moduleUsuario);
			moduleUsuario.isRegistered = true;
		}
		this.$vs.loading();
		await this.getUsuario();
	},
	data() {
		return {
			customcor: '',
			usuario: {
				name: '',
				email: '',
				status: true,
				password: null,
				password_confirmed: null,
				avatar: '',
				sck: '',
				url_slack: null,
				roles: {
					nome: null
				}
			},
			opcoesFuncoes: [],
			funcaoSelected: null,
			files: [],
			images: [],
			isDragging: false,
			slack: false
		};
	},
	methods: {
		getUsuario() {
			let user = JSON.parse(localStorage.getItem('userInfo'));
			this.$vs.loading();
			this.$store.dispatch('usersCompanies/getId', user.uid).then(data => {
				this.usuario = data;
				this.usuario.password = "";
				this.usuario.password_confirmed = "";
			}).catch(erro => {
				//Redirecionando caso 404
				//if (erro.response.status == 404) this.$router.push({name: 'page-error-404'});
			}).finally(() => this.$vs.loading.close());
		}
	},
	computed: {
		isValid() {
			return this.errors.any();
		}
	},
	watch: {
		currentx() {
			this.$vs.loading();
			this.dados.page = this.currentx;
			this.getContas();
		},
		"$route"() {
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
		color: #2196F3;
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
		button, label {
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
