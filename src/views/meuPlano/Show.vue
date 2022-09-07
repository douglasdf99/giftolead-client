<template>
	<div>
		<div class="vx-row">
			<div class="vx-col w-full lg:w-1/3 pr-1">
				<div class="w-full h-full bg-white p-5 rounded-lg">
					<div class="vx-row my-auto">
						<div class="vx-col w-full col-mx-auto text-center mb-base">
							<img :src="get_img_cdn(empresa.logo ? empresa.logo : 'default.png')" style="width: 200px" alt="logotipo" class="grid-view-img px-4" @error="get_img_default_cdn_company">
						</div>
						<div class="vx-col w-full">
							<p class="text-black text-xl font-bold">
								{{ empresa.razao_social }}
							</p>
							<p class="font-semibold text-md" style="color: #9B9B9B">Email financeiro: {{ empresa.email }}</p>
							<p class="font-semibold text-md mb-4" style="color: #9B9B9B">CNPJ: {{ empresa.cnpj }}</p>
						</div>
					</div>
				</div>
			</div>

			<div class="vx-col w-full lg:w-1/3 p1-1">
				<div class="w-full bg-white p-5 rounded-lg h-full">
					<h3 class="font-bold">Plano Atual : {{ plan.nome }}</h3>
					<div class="vs-row my-4">
						<table class="w-full text-lg">
							<tr>
								<th class="text-left text-xl mb-5 p-0">Dados</th>
								<th class="text-right text-xl mb-5 p-0">Utilizado / Máximo</th>
							</tr>
							<tr v-html="renderTr('Planos', plan.config_planos.planos_campanhas)"></tr>
							<tr v-html="renderTr('Campanhas', plan.config_planos.campanhas)"/>
							<tr v-html="renderTr('Usuários', plan.config_planos.numero_usuarios)"/>
							<tr v-html="renderTr('Conquistas', plan.config_planos.numero_conquistas)"/>
							<tr v-html="renderTr('SMS', plan.config_planos.sms, true)"/>
							<tr
								v-html="renderTr('Ligações pelo sis.', plan.config_planos.ligacoes_direto_do_dashboard, true)"/>
							<tr v-html="renderTr('E-mails p/ mês', plan.config_planos.numero_emails_mes)"/>
							<tr v-html="renderTr('SMSs p/ mês', plan.config_planos.numero_sms_mes)"/>
						</table>
					</div>
				</div>
			</div>

			<div class="vx-col w-full lg:w-1/3 p1-1">
				<div class="w-full bg-white p-5 rounded-lg h-full">
					<h3 class="font-bold">Consumo mensal</h3>
					<div class="vs-row my-4">
						<table class="w-full text-lg">
							<tr>
								<th class="text-left p-0 text-xl mb-5">Dados</th>
								<th class="text-right p-0 text-xl mb-5">Utilizado / Máximo</th>
							</tr>
							<tr
								v-html="renderTr('Envios de E-mails', `${empresa.consumo_mensal_ativo.numero_emails || 0}/${plan.config_planos.numero_emails_mes}`)"></tr>
							<tr
								v-html="renderTr('Envios de SMS', `${empresa.consumo_mensal_ativo.numero_sms || 0}/${plan.config_planos.numero_sms_mes}`)"/>
						</table>
					</div>
				</div>
			</div>
		</div>
		<!--		<vs-table :data="items" class="table-items" style="border-spacing: 0 8px;border-collapse: separate;">-->

		<!--			<template slot="thead">-->
		<!--				<vs-th>Periodo Inicial</vs-th>-->
		<!--				<vs-th>Periodo final</vs-th>-->
		<!--				<vs-th>Emails enviados</vs-th>-->
		<!--				<vs-th>Sms enviados</vs-th>-->
		<!--			</template>-->
		<!--			<template slot-scope="{data}">-->
		<!--				<vs-tr :key="indextr" v-for="(tr, indextr) in data" class="mb-3 relative">-->
		<!--					<vs-td class="relative">-->
		<!--						aba 1-->
		<!--					</vs-td>-->
		<!--					<vs-td>-->
		<!--						aba 1-->
		<!--					</vs-td>-->
		<!--					<vs-td>-->
		<!--						aba 1-->
		<!--					</vs-td>-->
		<!--					<vs-td>-->
		<!--						aba 1-->
		<!--					</vs-td>-->
		<!--				</vs-tr>-->
		<!--			</template>-->
		<!--		</vs-table>-->
	</div>
</template>

<script>
import moduleEmpresa from "@/store/empresa/moduleEmpresa.js";
// register custom messages
import {Validator} from 'vee-validate';

const dict = {
	custom: {
		razao_social: {
			required: 'Por favor, insira a razão social',
		},
		cnpj: {
			required: 'Por favor, insira o cnpj',
		},
		email: {
			required: 'Por favor, insira o email comercial',
			email: 'O email informado está com formato inválido'
		},
		site: {
			required: 'Por favor, insira o website da empresa',
		},
		descricao: {
			max: 'O limite máximo da descrição foi atingido',
		},
		rodape: {
			max: 'O limite máximo do rodapé foi atingido',
		}
	}
};
Validator.localize('pt-br', dict);
export default {
	data: () => ({
		name: "DadosEmpresa",
		empresa: {
			razao: '',
			cnpj: '',
			email: '',
			site: '',
			descricao: '',
			rodape: '',
			consumo_mensal_ativo: {numero_emails: 0, numero_sms: 0}
		},
		plan: {
			company: [],
			config_planos: {}
		},
		empresaOld: {},
		files: [],
		images: [],
		isDragging: false,
		error: 0,
		edited: false,
		counterDanger: false,
		data: []
	}),
	beforeCreate() {
		if (!moduleEmpresa.isRegistered) {
			this.$store.registerModule('empresa', moduleEmpresa);
			moduleEmpresa.isRegistered = true;
		}
	},

	created() {
		this.getPlan();
	},

	computed: {
		empresaDb() {
			return this.$store.state.empresa.empresa;
		}
	},
	mounted() {
		this.verifica();
	},
	watch: {
		empresa: {
			handler(val) {
				if (val) {
					this.verifica();
				}
			},
			deep: true
		},
	},
	methods: {
		verifica() {
			if (JSON.stringify(this.empresaOld) === JSON.stringify(this.empresa)) {
				this.edited = false;
			} else {
				this.edited = true;
			}
		},
		getPlan() {
			this.$vs.loading();
			this.$store.dispatch('empresa/getMyPlan')
				.then(response => {
					this.$vs.loading.close();
					this.empresa = response.company;
					this.empresaOld = JSON.parse(JSON.stringify(response.company));
					this.plan = response.plano;
				})
				.catch(error => {
					this.$vs.loading.close();
					this.$vs.notify({
						title: 'Error',
						text: error.response.data.message,
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					});
				});
		},
		updateEmpresa() {
			this.$validator.validateAll().then(result => {
				if (result) {
					this.$vs.loading();
					const formData = new FormData();
					this.files.forEach(file => {
						formData.append('logo', file, file.name);
					});
					formData.append('_method', 'PUT');
					formData.append('name', this.empresa.razao_social);
					formData.append('email', this.empresa.email);
					formData.append('cnpj', this.empresa.cnpj);
					formData.append('site', this.empresa.site);
					formData.append('descricao', this.empresa.descricao);
					formData.append('rodape', this.empresa.rodape);

					this.$store.dispatch('empresa/updateEmpresa', {id: 1, dados: formData})
						.then(() => {
							this.$vs.loading.close();
							this.$vs.notify({color: 'success', title: 'Sucesso!', text: 'Dados alterados com sucesso'});
						})
						.catch(error => {
							this.$vs.loading.close();
							this.$vs.notify({
								title: 'Error',
								text: error.response.data.message,
								iconPack: 'feather',
								icon: 'icon-alert-circle',
								color: 'danger'
							});
						});
				} else {
					this.$vs.notify({
						title: 'Error',
						text: 'verifique os erros específicos',
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					});
				}
			});

		},
		renderTr(label, value, boolean = false) {
			return "<td>" + label + " </td> <td class='text-right'>" + (boolean ? value ? "<i class='material-icons'>check</i>" : "<i class='material-icons'>close</i>" : value) + "</td>";
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
			if (this.dragCount <= 0)
				this.isDragging = false;
		},
		onInputChange(e) {
			const files = e.target.files;
			Array.from(files).forEach(file => this.addImage(file));
		},
		onDrop(e) {
			e.preventDefault();
			e.stopPropagation();
			this.isDragging = false;
			const files = e.dataTransfer.files;
			Array.from(files).forEach(file => this.addImage(file));
		},
		addImage(file) {
			this.files.pop();
			if (!file.type.match('image.*')) {
				this.$toastr.e(`${file.name} is not an image`);
				return;
			}
			this.files.push(file);
			this.empresa.logo = file;
			const reader = new FileReader();
			this.images.pop();
			reader.onload = (e) => this.images.push(e.target.result);
			reader.readAsDataURL(file);
		},
		getFileSize(size) {
			const fSExt = ['Bytes', 'KB', 'MB', 'GB'];
			let i = 0;

			while (size > 900) {
				size /= 1024;
				i++;
			}
			return `${(Math.round(size * 100) / 100)} ${fSExt[i]}`;
		},
	}
};
</script>

<style>
.fade-enter-active, .fade-leave-active {
	transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
	opacity: 0;
}

.con-input-upload.disabled-upload {
	display: none;
}

.con-img-upload {
	width: 100%;
	background: unset;
	margin-top: 5px;
	padding-right: 5px;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	-webkit-column-gap: 5px;
	-moz-column-gap: 5px;
	column-gap: 5px;
}

.con-input-upload {
	background: #ffffff;
	width: 300px;
	height: 300px;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	border-radius: 8px;
	position: relative;
	-webkit-transition: all .25s ease;
	transition: all .25s ease;
	border: 1px dashed rgba(0, 0, 0, .1);
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	-ms-flex-direction: column;
	flex-direction: column;
	margin: 0px;
}

.con-img-upload .img-upload {
	-webkit-backface-visibility: hidden;
	backface-visibility: hidden;
	background: rgba(0, 80, 0, .5);
	background: #fff;
	-webkit-box-shadow: 0 5px 20px 0 rgba(0, 0, 0, .1);
	box-shadow: 0 5px 20px 0 rgba(0, 0, 0, .1);
	-webkit-transition: all .3s ease;
	transition: all .3s ease;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	-ms-flex-direction: column;
	flex-direction: column;
	width: 300px;
	height: 300px;
	margin: 5px;
	cursor: pointer;
}

.vs-con-textarea {
	background: white;
	width: 100%;
	position: relative;
	border: 1px solid rgba(0, 0, 0, .08);
	-webkit-box-shadow: 0 0 0 0 transparent;
	box-shadow: 0 0 0 0 transparent;
	border-radius: 6px;
	-webkit-transition: boxShadow .25s ease, border .25s ease, -webkit-transform .25s ease;
	transition: boxShadow .25s ease, border .25s ease, -webkit-transform .25s ease;
	transition: boxShadow .25s ease, border .25s ease, transform .25s ease;
	transition: boxShadow .25s ease, border .25s ease, transform .25s ease, -webkit-transform .25s ease;
	-webkit-transform: translate(0);
	transform: translate(0);
	margin-bottom: 16px;
}
</style>
<style lang="scss" scoped>
.botaofechar {
	position: absolute;
	top: 0;
	right: 0;
	margin-top: 5px;
}

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
			cursor: pointer;
		}

		label {
			padding: 2px 5px;
		}
	}

}
</style>
