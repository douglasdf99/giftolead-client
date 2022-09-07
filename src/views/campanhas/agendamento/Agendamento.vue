<template>
	<div>
		<div class="vx-row mb-4">
			<div class="vx-col lg:w-full w-full">
            <span class="float-right mt-1 mx-4"
						style="font-weight: bold">{{ campanha.status ? 'Ativado' : 'Desativado' }}</span>
				<vs-switch vs-icon-on="check" color="#0FB599" v-model="campanha.status" class="float-right switch"/>
			</div>
		</div>
		<div class="vx-row mb-3">
			<div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
				<span class="font-regular mb-2">Nome da campanha</span>
				<vs-input class="w-full" v-validate="'required'" v-model="campanha.nome" size="large" name="nome"/>
				<span class="text-danger text-sm" v-show="errors.has('nome')">Obrigatório selecionar uma origem</span>

			</div>
			<div class="vx-col w-full xlg:w-1/2 lg:w-1/2">
				<span class="font-regular mb-2">Produto da campanha</span>
				<vs-input class="w-full" v-model="campanha.produto.nome" size="large" name="produto" disabled/>
				<span class="text-danger text-sm"
						v-show="errors.has('produto')">Obrigatório selecionar uma origem</span>
			</div>
		</div>
		<div class="vx-row my-10">
			<div class="vx-col w-full lg:w-8/12">
				<div class="vx-row">
					<div class="vx-col w-full mb-4">
						<span class="font-regular mb-2">Descrição</span>
						<vs-textarea v-model="campanha.descricao" v-validate="'required'" id="text-area"
										 class="w-full bg-white" name="descricao" rows="6"/>
						<span class="text-danger text-sm"
								v-show="errors.has('descricao')">Obrigatório selecionar uma origem</span>

					</div>
					<div class="vx-col w-full mb-4">
						<span class="font-regular mb-2">Página de Obrigado</span>
						<vs-input :class="`w-full ${errors.has('obrigado') && 'input-error'}`" id="search_input_trans"
									 v-model="campanha.obrigado"
									 placeholder="https://" size="large" name="obrigado" v-validate="'required'"/>
						<span class="text-danger text-sm" v-show="errors.has('obrigado')">Obrigatório definir o gravar da página de obrigado</span>

					</div>
					<div class="vx-col w-full lg:w-1/2 mb-3">
						<span class="font-regular mb-2">Origem</span>
						<v-select v-model="selectedOrigem"
									 :class="`select-large-base ${errors.has('origem') && 'input-error'}`"
									 :clearable="false"
									 style="background-color: white"
									 :options="origens" v-validate="'required'" name="origem"/>
						<span class="text-danger text-sm"
								v-show="errors.has('origem')">Obrigatório selecionar uma origem</span>
					</div>
					<div class="vx-col w-full lg:w-1/2 mb-3">
						<span class="font-regular mb-2">Dúvida</span>
						<v-select v-model="selectedDuvida"
									 :class="`select-large-base ${errors.has('duvida') && 'input-error'}`"
									 :clearable="false"
									 style="background-color: white"
									 :options="duvidas" v-validate="'required'" name="duvida"/>
						<span class="text-danger text-sm"
								v-show="errors.has('duvida')">Obrigatório selecionar uma dúvida</span>
					</div>
				</div>
				<div class="relative">
					<div class="not-finished-config" v-if="not_configured">
                        <span class="text-xl">
                            Termine a configuração <br> para ter acesso ao formulário
                        </span>
					</div>
					<div class="vx-row" v-if="!campanha.infusion">
						<div class="vx-col w-full">
							<vs-tabs>
								<vs-tab label="Sem estilo">
									<div class="vx-row relative">
										<div class="vx-col w-full relative mb-3">
											<i class="material-icons text-white mt-5" id="copy-icon"
												@click="copyText">file_copy</i>
											<prism language="html" class="rounded-lg">
												{{ codigohtml() }}
											</prism>
										</div>
										<div class="vx-col w-full mb-2">
											<p class="destaque">
												Insira o código abaixo em seu projeto
											</p>
										</div>
										<div class="vx-col w-full relative">
											<i class="material-icons text-black mt-5" id="copy-icon" @click="copyScripts(scripts)">file_copy</i>
											<div class="w-full bg-white rounded-lg p-5">
												<p class="font-regular text-lg" v-for="(val, index) in scripts" :key='index'>
													{{ val }}
												</p>
											</div>
										</div>
									</div>
								</vs-tab>
								<vs-tab label="PopUp">
									<div class="vx-row relative my-3 align-center">
										<div class="vx-col lg:w-1/2 md:w-1/2 mb-2">
											<span class="font-regular mb-2">Abertura da Agenda (Formato 24h)</span>
											<vs-input-number v-model="schedule.horaInicio" min="00" max="23" class="justify-start"/>
										</div>
										<div class="vx-col lg:w-1/2 md:w-1/2 mb-2">
											<span class="font-regular mb-2">Fechamento</span>
											<vs-input-number v-model="schedule.horaFim" min="00" max="23" class="justify-start"/>
										</div>
									</div>
									<div class="w-full relative">
										<i class="material-icons text-black mt-5" id="copy-icon"
											@click="copy(scriptsWidget)">file_copy</i>
										<div class="w-full bg-white rounded-lg p-5">
											<p class="font-regular text-lg">
												{{ scriptsWidget }}
											</p>
										</div>
									</div>
								</vs-tab>
								<vs-tab label="Botão">
									<div class="vx-row relative my-3">
										<div class="vx-col lg:w-1/3 md:w-1/2 mb-2">
											<span class="font-regular mb-2">Abertura da Agenda (Formato 24h)</span>
											<vs-input-number v-model="schedule.horaInicio" min="00" max="23" class="justify-start"/>
										</div>
										<div class="vx-col lg:w-1/3 md:w-1/2 mb-2">
											<span class="font-regular mb-2">Fechamento</span>
											<vs-input-number v-model="schedule.horaFim" min="00" max="23" class="justify-start"/>
										</div>
									</div>
									<div class="w-full relative">
										<i class="material-icons text-black mt-5" id="copy-icon"
											@click="copy(scriptsWidgetButton)">file_copy</i>
										<div class="w-full bg-white rounded-lg p-5">
											<p class="font-regular text-lg">
												{{ scriptsWidgetButton }}
											</p>
										</div>
									</div>
								</vs-tab>
								<vs-tab label="Component">
									<div class="vx-row relative my-3">
										<div class="vx-col lg:w-1/3 md:w-1/2 mb-2">
											<span class="font-regular mb-2">Abertura da Agenda (Formato 24h)</span>
											<vs-input-number v-model="schedule.horaInicio" min="00" max="23" class="justify-start"/>
										</div>
										<div class="vx-col lg:w-1/3 md:w-1/2 mb-2">
											<span class="font-regular mb-2">Fechamento</span>
											<vs-input-number v-model="schedule.horaFim" min="00" max="23" class="justify-start"/>
										</div>
									</div>
									<div class="w-full relative">
										<i class="material-icons text-black mt-5" id="copy-icon"
											@click="copy(scriptsWidgetComponent)">file_copy</i>
										<div class="w-full bg-white rounded-lg p-5">
											<p class="font-regular text-lg">
												{{ scriptsWidgetComponent }}
											</p>
										</div>
									</div>
								</vs-tab>
								<vs-tab label="Link">
									<i class="material-icons text-black mt-5" id="copy-icon"
										@click="copy(link)">file_copy</i>
									<div class="w-full bg-white rounded-lg p-5">
										<p class="font-regular text-lg">
											{{ link }}
										</p>
									</div>
								</vs-tab>
							</vs-tabs>
						</div>
					</div>
				</div>
			</div>
			<div class="vx-col w-full lg:w-4/12">
				<div class="vx-row">
					<div class="vx-col w-full mb-4 hover-opacidade cursor-pointer" @click="contatos('pendentes')">
						<vx-card style="box-shadow: none">
							<span class="destaque">Nº de contatos pendentes</span>
							<p class="font-bold text-3xl my-5">{{ campanha.contatos_pendentes_count }}</p>
						</vx-card>
					</div>
					<div class="vx-col w-full mb-4 hover-opacidade cursor-pointer" @click="contatos('fechados')">
						<vx-card style="box-shadow: none">
							<span class="destaque">Nº de contatos fechados</span>
							<p class="font-bold text-3xl my-5">{{ campanha.contatos_fechados_count }}</p>
						</vx-card>
					</div>
					<div class="vx-col w-full mb-4 hover-opacidade cursor-pointer" @click="contatos('todos')">
						<vx-card style="box-shadow: none">
							<span class="destaque">Nº de contatos todos</span>
							<p class="font-bold text-3xl my-5">
								{{ campanha.contatos_pendentes_count + campanha.contatos_fechados_count }}</p>
						</vx-card>
					</div>
					<div class="vx-col w-full mb-4">
						<vx-card style="box-shadow: none">
							<span class="destaque">Vendas recuperadas</span>
							<p class="font-bold text-3xl my-5">{{ campanha.tickets_vendidos.length }}</p>
						</vx-card>
					</div>
					<div class="vx-col w-full mb-4">
						<vx-card style="box-shadow: none">
							<span class="destaque">Valor recuperado</span>
							<p class="font-bold text-3xl my-5">R$ {{ formatPrice(campanha.valor_recuperado) }}</p>
						</vx-card>
					</div>
				</div>
			</div>
		</div>
		<transition name="fade">
			<footer-doug>
				<div class="vx-col sm:w-11/12 mb-2">
					<vs-button class="float-right mr-3" color="dark" type="flat" icon-pack="feather" icon="x-circle"
								  @click="$router.push({name: 'planos-gerenciar' , params:{plan_id: campanha.campanhas[0].plano_id} })">
						Cancelar
					</vs-button>
					<vs-button class="float-right mr-3" color="primary" type="filled" @click="salvar"
								  :disabled="isInvalid">
						Salvar
					</vs-button>
				</div>
			</footer-doug>
		</transition>
	</div>
</template>

<script>
import vSelect from 'vue-select';
import moduleCampAgendamentos from "@/store/campanha_agendamento/moduleCampAgendamentos";
import Prism from 'vue-prism-component';
import moduleOrigens from "../../../store/origens/moduleOrigens";
import moduleDuvidas from "../../../store/tipoDuvida/moduleDuvidas";
import saveleadsConfig from "../../../../saveleadsConfig";

export default {
	name: "Agendamento",
	components: {
		'v-select': vSelect,
		Prism
	},
	created() {
		if (!moduleCampAgendamentos.isRegistered) {
			this.$store.registerModule('agendamento', moduleCampAgendamentos);
			moduleCampAgendamentos.isRegistered = true;
		}

		if (!moduleOrigens.isRegistered) {
			this.$store.registerModule('origens', moduleOrigens);
			moduleOrigens.isRegistered = true;
		}

		if (!moduleDuvidas.isRegistered) {
			this.$store.registerModule('duvidas', moduleDuvidas);
			moduleDuvidas.isRegistered = true;
		}

		this.getOpcoes().then(() => this.getId(this.$route.params.id));
		this.montaScripts();
	},
	data() {
		return {
			campanha: {
				nome: '',
				produto: {},
				status: null,
				checkout: '',
				infusion: false,
				tickets_vendidos: [],
				tipo_duvida: {}
			},
			not_configured: true,
			customcor: '',
			html: '',
			origens: [],
			selectedOrigem: {id: '', text: ''},
			duvidas: [],
			selectedDuvida: {id: '', text: ''},
			scripts: [],
			scriptsWidget: '',
			scriptsWidgetButton: '',
			scriptsWidgetComponent: '',
			link: ``,
			buttonWidget: '',
			schedule: {
				horaInicio: 9,
				horaFim: 17
			}
		};
	},
	methods: {
		montaLink() {
			let url = saveleadsConfig.url_app.split('//');
			this.link = `${url[0]}//${saveleadsConfig.identity}.${url[1]}agendamento?token=${this.campanha.token}`;
		},
		salvar() {
			this.$validator.validateAll().then(result => {
				if (result) {
					this.$vs.loading();

					this.campanha.origem_id = this.selectedOrigem.id;
					this.campanha.tipo_duvida_id = this.selectedDuvida.id;

					this.campanha.plano_id = this.$route.params.id;
					this.campanha._method = 'PUT';
					if (this.campanha.id !== undefined) {
						this.$store.dispatch('agendamento/update', {
							id: this.campanha.id,
							dados: this.campanha
						}).then(() => {
							this.$vs.notify({
								title: '',
								text: "Atualizado com sucesso.",
								iconPack: 'feather',
								icon: 'icon-check-circle',
								color: 'success'
							});
							this.validateInputsToScript();
						}).catch(erro => {
							this.$vs.notify({
								title: 'Error',
								text: erro.response.data.message,
								iconPack: 'feather',
								icon: 'icon-alert-circle',
								color: 'danger'
							});
						}).finally(() => this.$vs.loading.close());
					} else {
						this.$store.dispatch('agendamento/store', this.campanha).then(() => {
							this.$vs.notify({
								title: '',
								text: "Criado com sucesso.",
								iconPack: 'feather',
								icon: 'icon-check-circle',
								color: 'success'
							});
							this.$router.push({name: 'planos-gerenciar' , params:{id: this.campanha.campanhas[0].plano_id}});
						}).catch(erro => {
							this.$vs.notify({
								title: 'Error',
								text: erro.response.data.message,
								iconPack: 'feather',
								icon: 'icon-alert-circle',
								color: 'danger'
							});
						});
					}
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
		codigohtml() {
			this.html = `
<form accept-charset="UTF - 8" action="${this.url_api('campanhaagendamento/' + this.campanha.token)}" id="formulario-saveleads" method="POST">
    <label for="nome">Nome</label>
    <input type="text" name="nome" id="nome" placeholder="Nome completo">
    <label for="email">E-mail</label>
    <input type="email" name="email" id="email" placeholder="Insira seu melhor e-mail">
    <label for="email">Whatsapp</label>
    <input type="text" name="ddi" id="ddi" value="+55">
    <input type="text" name="ddd" id="ddd">
    <input type="text" name="telefone" id="telefone" placeholder="Insira seu Whatsapp">
    <input type="hidden" name="origem" id="origem" value="${this.selectedOrigem.id}">
    <input type="hidden" name="duvida" id="duvida" value="${this.selectedDuvida.id}">
    <input type="text" id="data_agendamento" name="data_agendamento"/>
    <button type="submit">Enviar</button>

    <!-- Biblioteca do Datepicker https://www.daterangepicker.com/ -->
</form>`;
			return this.html;
		},
		selecionaCor(cor) {
			if (cor) {
				this.campanha.cor = cor;
			} else {
				this.campanha.cor = this.customcor;
			}
			this.errors.remove('cor');
		},
		selecionaTipoComissao(val) {
			this.campanha.comissao_tipo = val;
		},
		contatos(val) {
			this.$router.push({
				name: `campanha-config-agendamento-contatos-${val}`, params:{id: this.$route.params.id}});
		},
		getId(id) {
			this.$vs.loading();
			this.$store.dispatch('agendamento/getId', id).then(response => {
				this.campanha = {...response};

				if (this.campanha.origem_id != null) {
					this.selectedOrigem.id = this.campanha.origem_id;
					this.selectedOrigem.label = this.campanha.origem.nome;
				}

				if (this.campanha.tipo_duvida_id != null) {
					this.selectedDuvida.id = this.campanha.tipo_duvida_id;
					this.selectedDuvida.label = this.campanha.tipo_duvida.nome;
				}

				if (this.campanha.infusion == "0")
					this.campanha.infusion = false;

				this.montaLink();
				this.montaScriptsWidget();
				this.validateInputsToScript();
			}).catch(erro => {
				//Redirecionando caso 404
				if (erro.response.status == 404) this.$router.push({
					name: 'page-error-404',
					params: {back: 'meus-planos', text: 'Retornar à listagem de Planos'}
				});
			}).finally(() => this.$vs.loading.close());
		},
		validateInputsToScript() {
			let {obrigado, origem_id, tipo_duvida_id} = this.campanha;
			if (origem_id && obrigado && tipo_duvida_id) this.not_configured = false;
		},
		formatPrice(value) {
			let val = (value / 1).toFixed(2).replace('.', ',');
			return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
		},
		copyText() {
			const thisIns = this;
			this.$copyText(this.html).then(function () {
				thisIns.$vs.notify({
					title: '',
					text: 'Copiado para sua área de transferência',
					color: 'success',
					iconPack: 'feather',
					icon: 'icon-check-circle'
				});
			}, function () {
				thisIns.$vs.notify({
					title: 'Failed',
					text: 'Erro ao copiar',
					color: 'danger',
					iconPack: 'feather',
					position: 'top-center',
					icon: 'icon-alert-circle'
				});
			});
		},
		copyScripts(scripts) {
			const thisIns = this;
			let str = '';
			scripts.forEach(val => {
				str += val + '\n';
			});
			this.$copyText(str).then(function () {
				thisIns.$vs.notify({
					title: '',
					text: 'Copiado para sua área de transferência',
					color: 'success',
					iconPack: 'feather',
					icon: 'icon-check-circle'
				});
			}, function () {
				thisIns.$vs.notify({
					title: 'Failed',
					text: 'Erro ao copiar',
					color: 'danger',
					iconPack: 'feather',
					position: 'top-center',
					icon: 'icon-alert-circle'
				});
			});
		},
		copyUrl() {
			const thisIns = this;
			let value = this.url_api('campanhaagendamento/' + this.campanha.token);
			this.$copyText(value).then(function () {
				thisIns.$vs.notify({
					title: '',
					text: 'Copiado para sua área de transferência',
					color: 'success',
					iconPack: 'feather',
					icon: 'icon-check-circle'
				});
			}, function () {
				thisIns.$vs.notify({
					title: 'Failed',
					text: 'Erro ao copiar',
					color: 'danger',
					iconPack: 'feather',
					icon: 'icon-alert-circle'
				});
			});
		},
		copy(value) {
			const thisIns = this;
			this.$copyText(value).then(function () {
				thisIns.$vs.notify({
					title: '',
					text: 'Copiado para sua área de transferência',
					color: 'success',
					iconPack: 'feather',
					icon: 'icon-check-circle'
				});
			}, function () {
				thisIns.$vs.notify({
					title: 'Failed',
					text: 'Erro ao copiar',
					color: 'danger',
					iconPack: 'feather',
					icon: 'icon-alert-circle'
				});
			});
		},
		getOpcoes() {
			return new Promise((resolve) => {
				this.origens = [];
				this.$store.dispatch('origens/get').then(response => {
					let arr = [...response];
					arr.forEach(item => {
						this.origens.push({id: item.id, label: item.nome});
					});
				});

				this.duvidas = [];
				this.$store.dispatch('duvidas/get').then(response => {
					let arr = [...response];
					arr.forEach(item => {
						this.duvidas.push({id: item.id, label: item.nome});
					});
				});

				resolve();
			});
		},
		montaScripts() {
			this.scripts = [];
			var scripts = [
				"https://cdn.jsdelivr.net/jquery/latest/jquery.min.js",
				"https://cdn.jsdelivr.net/momentjs/latest/moment.min.js",
				'https://cdn.jsdelivr.net/npm/flatpickr',
				'https://npmcdn.com/flatpickr/dist/l10n/pt.js',
				'https://api.saveleads.com.br/js/formularioAgendamento.js'
			];
			scripts.forEach((script) => {
				let tag = document.createElement("script");
				tag.setAttribute("type", 'text/javascript');
				tag.setAttribute("src", script);
				this.scripts.push(tag.outerHTML);
			});

			let link = document.createElement('link');
			link.setAttribute("type", 'text/css');
			link.setAttribute("rel", 'stylesheet');
			link.setAttribute("href", 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css');

			this.scripts.push(link.outerHTML);
		},
		montaScriptsWidget() {
			let script = saveleadsConfig.url_cdn + "/widgets/agendamento/agendamento.js";

			const horainicio = `${this.schedule.horaInicio}`;
			const horafim = `${this.schedule.horaFim}`;

			let tag = document.createElement("script");
			tag.setAttribute("type", 'text/javascript');
			tag.setAttribute("src", script);
			tag.setAttribute("token", this.campanha.token);
			tag.setAttribute("horaInicio", horainicio.padStart(2, '0'));
			tag.setAttribute("horaFim", horafim.padStart(2, '0'));
			tag.setAttribute("slug", (window.location.host.split('.')[1] ? window.location.host.split('.')[0] : 'app'));
			this.scriptsWidget = tag.outerHTML;
			tag.setAttribute("typewid", 'button');
			this.scriptsWidgetButton = tag.outerHTML;
			tag.setAttribute("typewid", 'component');
			this.scriptsWidgetComponent = tag.outerHTML;
		},
	},
	computed: {
		isInvalid() {
			return this.errors.any() || (this.selectedOrigem.id == '' && this.selectedDuvida.id == '');
		},
	},
	watch: {
		"$route"() {
			this.routeTitle = this.$route.meta.pageTitle;
		},
		schedule: {
			handler() {
				this.montaScriptsWidget();
			},
			deep: true
		}
	},
};
</script>

<style>
[dir] .con-select .vs-select--input {
	padding: 1.4rem 2rem !important;
}

#copy-icon {
	position: absolute;
	top: 0.7rem;
	right: 30px;
	cursor: pointer;
}

#copy-icon-input {
	position: absolute;
	top: 2.2rem;
	right: 30px;
	cursor: pointer;
}

.vs-input-number--input {
	background: white !important;
}
</style>
