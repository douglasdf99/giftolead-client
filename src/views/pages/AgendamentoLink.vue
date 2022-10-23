<template>
	<div class="h-screen flex w-full bg-agendamento content">
		<vs-row>
			<vs-col vs-offset="2" vs-type="flex" vs-justify="center" v-show="formDisplay" vs-align="center" vs-w="8">
				<div class="w-1/2 bg-grid-color  vx-col w-full sm:w-1/2 lg:w-1/1 mb-base">
					<div class="vx-card">
						<div class="vx-card__collapsible-content vs-con-loading__container">
							<div class="vx-card__body center">
								<vs-row>
									<vs-col vs-offset="2" vs-type="flex" vs-justify="center" vs-align="center" vs-w="8">
										<h4 class="mb-2 text-center">
											Nos diga qual o melhor dia e horário para que possamos entrar em contato
										</h4>
									</vs-col>
								</vs-row>
								<div class="grid grid-cols-1 gap-3 mt-5 mb-4" v-if="$route.query">
									<div class="w-full mb-3" v-if="!$route.query.nome || errorsForm.nomeError">
										<label for="leadName">Nome</label>
										<vs-input class="w-full" id="leadName" type="text" v-model="leadInfo.nome" required/>
										<small class="text-danger text-md" v-if="errorsForm.nomeError">{{ errorsForm.nomeError }}</small>
									</div>
									<div class="w-full mb-3" v-if="!$route.query.email || errorsForm.emailError">
										<label for="leadEmail">E-mail</label>
										<vs-input class="w-full" id="leadEmail" type="email" v-model="leadInfo.email" required/>
										<small class="text-danger text-md" v-if="errorsForm.emailError">{{ errorsForm.emailError }}</small>
									</div>
									<div class="w-full" v-if="!$route.query.telefone || errorsForm.telefoneError">
										<label for="phoneNumber2">Telefone</label>
										<VuePhoneNumberInput name="phone" id="phoneNumber2" v-model="leadInfo.telefone"
																	:translations="translations" no-flags required
																	clearable :border-radius="8" show-code-on-list class="w-full"
																	@update="onUpdateDdi"
																	:default-country-code="''"/>
										<small class="text-danger text-md" v-if="errorsForm.telefoneError">{{ errorsForm.telefoneError }}</small>
									</div>
								</div>
								<div class="flex justify-center flex-wrap">
									<div class="campos">
										<input id="date" type="date" @change="horasfunc(diaSelecionado)" v-model="diaSelecionado" :min="dias[0].diaForm" :max="dias[dias.length - 1].diaForm">
										<select v-model="horaSelecionada">
											<option v-for="hora in horas" :key="hora" v-bind:value="hora">
												{{ hora }}
											</option>
										</select>
									</div>
									<button @click="salvar()" class="my-6 cursor-pointer transition duration-100 send shadow-md hover:shadow" type="button" :disabled="validate">
										Enviar
									</button>
									<div class="powerby">
										<h4>Power By</h4>
										<img :src="get_img_local('logo2.svg')" alt="save leads logo">
									</div>
								</div>
							</div>
						</div>
						<div class="vx-card__code-container collapsed" style="max-height: 0px; display: none;">
							<div class="code-content">
								<pre class="language-markup"><code class="language-markup"></code></pre>
							</div>
						</div>
					</div>
				</div>
			</vs-col>
			<vs-col vs-offset="2" vs-type="flex" vs-justify="center" style="" vs-align="center" vs-w="8" v-show="sucessDisplay">
				<div class="w-1/2 bg-grid-color  vx-col w-full sm:w-1/2 lg:w-1/1 mb-base">
					<div class="vx-card"><!---->
						<div class="vx-card__collapsible-content vs-con-loading__container">
							<div class="vx-card__body center">
								<vs-row>
									<vs-col vs-offset="2" vs-type="flex" vs-justify="center" vs-align="center" vs-w="8">
										<p class="mb-3 text-center text-xl">Obrigado pelo contato! Nós te ligaremos no dia
											<b>{{ diaformated }} às </b>
											<b>{{ horaSelecionada }}</b>
										</p>
									</vs-col>
								</vs-row>
								<div class="flex justify-center flex-wrap">
									<div class="powerby">
										<h4>Power By</h4>

										<img :src="get_img_local('logo2.svg')" alt="save leads logo">
									</div>
								</div>
							</div>
						</div>
						<div class="vx-card__code-container collapsed" style="max-height: 0px; display: none;">
							<div class="code-content">
								<pre class="language-markup"><code class="language-markup"></code></pre>
							</div>
						</div>
					</div>
				</div>
			</vs-col>
		</vs-row>
	</div>
</template>

<script>
import 'flatpickr/dist/flatpickr.css';
import moduleAgendamentoLink from "../../store/agendamento_link/moduleAgendamentoLink";
import saveleadsConfig from "../../../saveleadsConfig";
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import countries from "../../countries";

export default {
	name: "AgendamentoLinkNovo",
	components: {
		VuePhoneNumberInput
	},
	data() {
		return {
			translations: {...saveleadsConfig.phoneNumberInputTranslations},
			leadInfo: {...this.$route.query},
			enviado: false,
			dias: [],
			horas: [],
			horaInicio: 9,
			horaFim: 16,
			diaSelecionado: '',
			horaSelecionada: '',
			sucessDisplay: false,
			formDisplay: true,
			errorsForm: {nomeError: '', telefoneError: '', emailError: '', dddError: ''},
			saveleadsConfig,
			countries: countries
		};
	},
	created() {
		if (!moduleAgendamentoLink.isRegistered) {
			this.$store.registerModule('agendamento', moduleAgendamentoLink);
			moduleAgendamentoLink.isRegistered = true;
		}

		if (this.leadInfo.nomeError || this.leadInfo.emailError || this.leadInfo.telefoneError || this.leadInfo.dddError) {
			this.errorsForm = {...this.leadInfo};
			this.$vs.notify({
				color: 'danger',
				title: 'Corriga os campos',
				text: 'Alguns campos precisam ser corrigidos.',
				iconPack: 'feather',
				icon: 'icon-check',
				time: 10000,
			});
		}
	},
	methods: {
		salvar() {
			if (!this.validate) {
				this.leadInfo.telefone = this.leadInfo.telefone;
				this.leadInfo.data_agendamento = this.diaSelecionado + ' ' + this.horaSelecionada;
				this.$vs.loading();
				this.$store.dispatch('agendamento/store', this.leadInfo).then((response) => {
					this.enviado = true;
					this.$vs.notify({
						color: 'success',
						title: 'Pronto!',
						text: 'Seu atendimento foi agendado com sucesso! Aguarde até que entremos em contato.',
						iconPack: 'feather',
						icon: 'icon-check',
						time: 120000,
					});
					this.formDisplay = false;
					this.sucessDisplay = true;
					if (response.data.obrigado) {
						window.open(response.data.obrigado, '_blank');
					}
				}).catch((erro) => {
					if (erro.response.status === 500) {
						this.$vs.notify({
							color: 'danger',
							title: 'Erro ao Enviar',
							text: 'Ocorreu um erro ao tentar enviar o formulário. Tente novamento mais tarde.',
							iconPack: 'feather',
							icon: 'icon-check',
							time: 10000,
						});
					}

					if (erro.response.status === 422) {
						let {errors} = erro.response.data;
						this.errorsForm.emailError = errors['email'] ? errors['email'][0] : null;
						this.errorsForm.nomeError = errors['nome'] ? errors['nome'][0] : null;
						this.errorsForm.telefoneError = errors['telefone'] ? errors['telefone'][0] : null;
						this.errorsForm.dddError = errors['ddd'] ? errors['ddd'][0] : null;
					}
				}).finally(() => this.$vs.loading.close());
			}
		},
		datas() {
			let hoje = new Date();
			this.dias.push({dia: this.formatarData(hoje), diaForm: this.formatarDataForm(hoje)});
			let day = hoje;
			for (var i = 0; i < 5; i++) {
				var nextDay = new Date(day);
				nextDay.setDate(day.getDate() + 1);
				if (nextDay.getUTCDay() == 0) {
					nextDay.setDate(day.getDate() + 1);
				} else if (nextDay.getUTCDay() == 6) {
					nextDay.setDate(day.getDate() + 3);
				}
				this.dias.push({dia: this.formatarData(nextDay), diaForm: this.formatarDataForm(nextDay)});
				day = nextDay;
			}
		},
		horasfunc(dia) {
			this.horas = [];
			let now = new Date(dia);
			let hoje = new Date();
			let amanha = new Date();
			amanha.setDate(now.getDate() + 1);

			if (this.diaSelecionado == this.formatarDataForm(hoje)) {
				now = new Date();
			} else if (this.diaSelecionado == this.formatarDataForm(amanha)) {
				now = new Date();
				now.setDate(now.getDate() + 1);
				now.setHours(0);
				now.setMinutes(0);
			} else {
				now = new Date(this.diaSelecionado);
				now.setHours(0);
				now.setMinutes(0);
			}

			let minutes = now.getMinutes();
			let hours = now.getHours();
			if (hours < this.horaInicio) {
				hours = this.horaInicio;
				hours = hours - 1;
				minutes = 30;
			}
			let horaAtual = now.getHours() + ':' + now.getMinutes();
			let minutesWile = minutes;
			if (minutes < 30) {
				horaAtual = hours + ':' + 30;
				minutesWile = 30;
			} else {
				hours = hours + 1;
				horaAtual = hours + ':00';
				minutesWile = 0;
			}

			if (horaAtual < this.horaInicio) {
				this.horas.push(this.horaInicio);
			} else {
				this.horas.push(horaAtual);
			}
			let horaWhile = hours;
			while (horaWhile < this.horaFim) {
				if (minutesWile < 30) {
					minutesWile = 30;
					this.horas.push(horaWhile + ':' + minutesWile);
				} else {
					minutesWile = '00';
					this.horas.push(horaWhile + 1 + ':' + minutesWile);
				}
				if (minutesWile != 30) {
					horaWhile++;
				}
			}
			if (now.getHours() >= this.horaFim)
				this.horas = ['S/ horário disponível'];

			this.horaSelecionada = this.horas[0];
		},
		formatarData(data) {
			let hoje = new Date();

			if (data.getDate() == hoje.getDate()) {
				return 'Hoje';
			} else if (data.getDate() == hoje.getDate() + 1) {
				return 'Amanha';
			} else {
				let dia = data.getDate().toString(),
					diaF = (dia.length == 1) ? '0' + dia : dia,
					mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
					mesF = (mes.length == 1) ? '0' + mes : mes,
					anoF = data.getFullYear();
				return diaF + "/" + mesF + "/" + anoF;
			}
		},
		formatarDataForm(data) {
			let dia = data.getDate().toString(),
				diaF = (dia.length == 1) ? '0' + dia : dia,
				mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
				mesF = (mes.length == 1) ? '0' + mes : mes,
				anoF = data.getFullYear();
			return anoF + "-" + mesF + "-" + diaF;
		},
		onUpdateDdi(payload) {
			this.leadInfo.ddi = payload.countryCallingCode;
		},
		getPhoneDdd(phone, retorno = false) {
			var ddd;
			// Remove todos os caractéres que não são números
			phone = phone.replace(/\D/g, "");
			// (00) 0000-0000 agora é 0000000000, etc
			if (phone.length === 10) {
				// Telefone fixo
				ddd = phone.substr(0, 2);
				phone = phone.substr(2, 8);
			} else if (phone.length === 11) {
				// Telefone celular
				ddd = phone.substr(0, 2);
				phone = phone.substr(2, 9);
			}

			return retorno ? ddd : phone;
		}
	},
	async mounted() {
		await this.datas();
		this.diaSelecionado = this.formatarDataForm(new Date());
		this.horasfunc(this.diaSelecionado);
	},
	computed: {
		diaformated: function () {
			let res = this.diaSelecionado.split("-");
			return res[2] + '/' + res[1];
		},
		validate() {
			return (!this.leadInfo.nome || !this.leadInfo.telefone || !this.leadInfo.email || (this.horaSelecionada === 'S/ horário disponível'));
		}
	}
};
</script>

<style scoped lang="scss">
.bg-agendamento {
	background-color: #282a36;
}

.send {
	background-color: #9344c4;
	color: #fff;
	font-weight: bold;
	font-size: 17px;
	width: 100%;
	height: 45px;
	padding: 5px;
	border-radius: 6px;
	margin-top: 5px;
	cursor: pointer;
	border: none;

	&:disabled {
		background-color: #80808047;
		border: none;
		cursor: default !important;
	}
}

select, #date {
	width: 50%;
	height: 45px;
	padding: 5px;
	border-radius: 6px;
	font-size: 14px;
	margin-right: 1rem;
	border: 3px solid rgb(224, 224, 224);
}

.campos {
	width: 100%;
	display: flex;
	font-family: Maven Pro, Helvetica, sans-serif !important;
	justify-content: space-around !important;
}

.powerby {
	display: flex;
	justify-content: start;
	align-items: center;
	margin-bottom: 5px;
	opacity: 0.7
}

.powerby h4 {
	font-family: system-ui;
	margin-right: 5px;
	font-size: 8px;
	color: #222222;
}

.powerby img {
	width: 60px;
}

.vx-card {
	max-width: 600px;
}

</style>
