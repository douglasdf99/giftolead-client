<template>
	<div>
		<detalhe
			v-if="addNewDataSidebar"
			:expedicao="expedicao"
			:isSidebarActive="addNewDataSidebar"
			@closeSidebar="toggleDataSidebar"
			:data="sidebarData"
		/>
		<endereco
			v-if="modalEndereco"
			:expedicao="expedicao"
			:isSidebarActive="modalEndereco"
			@closeSidebar="toggleDataSidebarEnd"
			:data="endereco"
			@validar="requestValidar"
		/>
		<reenviar
			v-if="responderTicket"
			:isSidebarActive="responderTicket"
			@closeSidebar="toggleRespostaSidebar"
			:data="aresponder"
		/>

		<div class="vx-row mb-5">
			<div class="vx-col w-full">
				<div class="flex items-center justify-around" v-if="expedicao">
					<p class="flex items-center">
						{{ expedicao.fechado ? "Fechada" : "Pendente" }}
						<vs-icon
							icon-pack="material-icons"
							icon="fiber_manual_record"
							class="ml-5 icon-grande"
							v-bind:style="{
								color: expedicao.fechado ? '#4DE98A' : '#E7BE00',
							}"
						></vs-icon>
					</p>
					<p>
						PLP: <b>{{ expedicao.plp || "Sem PLP gerada" }}</b>
					</p>
					<p class="flex items-center">
						Produto:
						<vs-chip
							class="ml-4 text-lg"
							:color="expedicao.brinde.produto.cor"
						>
							{{ expedicao.brinde.produto.nome }}</vs-chip
						>
					</p>
					<p class="flex items-center">
						Brinde: {{ expedicao.brinde.nome }}
					</p>
					<p class="flex items-center">
						Contrato:
						<b>
							{{
								expedicao.contrato_type ==
								"App\\Models\\Extensoes\\MelhorEnvio"
									? "Melhor Envio"
									: expedicao.contrato.nome
							}}</b
						>
						<vx-tooltip position="top" text="Selecionar Contrato">
							<vs-button
								color="primary"
								class="p-2 ml-3"
								@click="modalContrato = true"
								icon-pack="material-icons"
								icon="create"
							></vs-button>
						</vx-tooltip>
					</p>
				</div>
			</div>
		</div>
		<div class="vx-row flex items-center">
			<div class="vx-col w-10/12 sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
				<div class="flex items-center">
					<div class="relative w-full">
						<!-- SEARCH INPUT -->
						<form>
							<vs-input
								autocomplete
								class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
								v-model="dados.pesquisa"
								id="search_input_trans"
								size="large"
								placeholder="Pesquisar"
							/>
							<!-- SEARCH LOADING -->
							<!-- SEARCH ICON -->
							<div
								slot="submit-icon"
								class="absolute top-0 right-0 py-3 px-6"
							>
								<button type="button" class="btn-search-bar">
									<feather-icon
										icon="SearchIcon"
										svgClasses="h-6 w-6"
									/>
								</button>
								<!--<feather-icon icon="SearchIcon" svgClasses="h-6 w-6" />-->
							</div>
						</form>
					</div>
				</div>
				<!-- SEARCH INPUT -->
			</div>
			<div
				class="vx-col w-1/12 lg:1/12 xlg:1/12 float-right flex items-center col justify-center"
			>
				<vx-tooltip
					text="Validar informações das automações"
					position="top"
				>
					<vs-button
						color="primary"
						class="p-2 ml-3"
						@click="validarAutomacoes"
						:disabled="validando"
						icon-pack="material-icons"
						icon="youtube_searched_for"
					></vs-button>
				</vx-tooltip>
			</div>
		</div>
		<vs-table :data="list" class="table-items">
			<template slot="thead">
				<vs-th></vs-th>
				<vs-th>Destinatário</vs-th>
				<vs-th>E-mail</vs-th>
				<vs-th>Objeto nos correios</vs-th>
				<vs-th>CEP</vs-th>
				<vs-th></vs-th>
			</template>
			<template slot-scope="{ data }">
				<vs-tr
					:key="'row-with-loading-' + indextr"
					v-for="(tr, indextr) in data"
					:data="tr"
				>
					<vs-td class="flex justify-center items-center">
						<vs-dropdown vs-trigger-click>
							<vs-button
								radius
								color="#EDEDED"
								type="filled"
								class="btn-more-icon relative botao-menu"
								icon-pack="material-icons"
								icon="more_horiz"
							></vs-button>
							<vs-dropdown-menu class="dropdown-menu-list">
								<vs-dropdown-item @click="visualizar(tr)">
									<vs-icon
										icon-pack="material-icons"
										icon="visibility"
									></vs-icon>
									Detalhar
								</vs-dropdown-item>
								<vs-dropdown-item
									@click="arquivar(tr)"
									v-if="
										!expedicao.plp &&
										$acl.check('brinde_automacao_arquivar')
									"
								>
									<vs-icon
										icon-pack="material-icons"
										icon="work"
									></vs-icon>
									Arquivar
								</vs-dropdown-item>
								<vs-dropdown-item
									@click="imprimir(tr.id)"
									v-if="
										expedicao.fechado &&
										$acl.check('brinde_automacao_imprimir')
									"
								>
									<vs-icon
										icon-pack="material-icons"
										icon="print"
									></vs-icon>
									Etiqueta
								</vs-dropdown-item>
								<vs-dropdown-item
									@click="imprimirDeclaracao(tr.id)"
									v-if="expedicao.fechado"
								>
									<vs-icon
										icon-pack="material-icons"
										icon="print"
									></vs-icon>
									Declaração de Conteúdo
								</vs-dropdown-item>
								<vs-dropdown-item
									v-if="tr.erro"
									@click="reenviarWhats(tr)"
								>
									<vs-icon
										icon-pack="material-icons"
										icon="forward"
									></vs-icon>
									Enviar por whatsapp
								</vs-dropdown-item>
								<vs-dropdown-item
									v-if="tr.erro"
									@click="reenviarWhats(tr)"
								>
									<vs-icon
										icon-pack="material-icons"
										icon="forward"
									></vs-icon>
									Enviar por whatsapp
								</vs-dropdown-item>
								<vs-dropdown-item
									@click="
										automacaoSelected = tr.id;
										modaltransferencia = true;
									"
								>
									<i
										class="material-icons hover:text-primary cursor-pointer"
										>forward</i
									>
									Transferir Automação
								</vs-dropdown-item>
								<vs-dropdown-item
									@click="
										tr.index = indextr;
										editarEndereco(tr);
									"
									v-if="!expedicao.fechado"
								>
									<vs-icon
										icon-pack="material-icons"
										icon="home"
									></vs-icon>
									Editar Endereço
								</vs-dropdown-item>
								<vs-dropdown-item
									v-if="expedicao.fechado"
									@click="enviarRastreio(tr.id)"
								>
									<vs-icon
										icon-pack="material-icons"
										icon="email"
									></vs-icon>
									Enviar Rastreio
								</vs-dropdown-item>
							</vs-dropdown-menu>
						</vs-dropdown>
					</vs-td>
					<vs-td
						><span class="font-bold">{{
							tr.nome_destinatario
						}}</span></vs-td
					>
					<vs-td>{{ tr.email_destinatario }}</vs-td>
					<vs-td class="flex mb-2">
						<vx-tooltip
							position="top"
							text="Clique para copiar código de rastreio"
						>
							<span
								class="cursor-pointer font-bold text-primary"
								@click="copyRastreio(tr.rastreio)"
							>
								{{ tr.rastreio }}
							</span>
						</vx-tooltip>
					</vs-td>
					<vs-td>{{ tr.endereco.cep | VMask("##.###-###") }}</vs-td>
					<vs-td
						class="td-icons flex flex-col items-center justify-center vs-con-loading__container"
						:id="'td-loading-' + tr.id"
					>
						<vx-tooltip
							v-if="tr.erro"
							:text="showErro(tr.erro)"
							position="top"
							class="flex items-center justify-center"
						>
							<vs-icon
								icon-pack="material-icons"
								icon="highlight_off"
								class="icon-grande mx-auto font-bold text-danger"
							></vs-icon>
						</vx-tooltip>
						<vs-icon
							icon-pack="material-icons"
							icon="check_circle_outline"
							v-else
							class="icon-grande mx-auto font-bold"
							style="color: #00acc1"
						></vs-icon>
					</vs-td>
				</vs-tr>
			</template>
		</vs-table>

		<transition name="fade">
			<footer-doug>
				<div class="vx-col sm:w-11/12 mb-2">
					<vs-button
						class="float-right ml-3 px-6 py-4 mx-3"
						color="dark"
						type="border"
						icon-pack="feather"
						icon="x-circle"
						@click="$router.push({ name: 'brindes-expedicoes' })"
					>
						Voltar
					</vs-button>
					<vs-button
						color="primary"
						class="float-right text-white px-6 py-4 mx-3"
						@click="gerarPlp"
						v-if="
							!expedicao.plp && $acl.check('brinde_expedicao_gerarplp')
						"
						>Gerar PLP</vs-button
					>
					<vs-button
						color="primary"
						class="float-right text-white px-6 py-4 mx-3"
						@click="imprimirPlp"
						v-else
						>Imprimir PLP</vs-button
					>
					<vs-dropdown vs-trigger-click class="float-right">
						<vs-button
							color="primary"
							class="float-right text-white px-6 py-4"
							v-if="expedicao.fechado"
							>Imprimir Etiquetas</vs-button
						>
						<vs-dropdown-menu class="dropdown-menu-list">
							<vs-dropdown-item @click="imprimirEtiquetas('multi')">
								<vs-icon
									icon-pack="material-icons"
									icon="print"
								></vs-icon>
								Imprimir 4 por página
							</vs-dropdown-item>
							<vs-dropdown-item @click="imprimirEtiquetas('single')">
								<vs-icon
									icon-pack="material-icons"
									icon="print"
								></vs-icon>
								Imprimir 1 por página
							</vs-dropdown-item>
						</vs-dropdown-menu>
					</vs-dropdown>
					<vs-button
						color="primary"
						class="float-right text-white px-6 py-4 mx-3"
						@click="imprimirDeclaracao(null)"
						>Imprimir Declaração de conteúdo</vs-button
					>
				</div>
			</footer-doug>
		</transition>
		<custom-popup
			id="pdf-with-loading"
			class="popup-iframe vs-con-loading__container"
			style="overflow: hidden"
			title="Imprimindo etiquetas"
			:active.sync="modalIframe"
		>
			<iframe
				v-if="urlIframe"
				:src="urlIframe"
				width="100%"
				height="100%"
				title="Imprimindo Etiqueta"
			></iframe>
		</custom-popup>
		<vs-prompt
			@cancel="modalContrato = false"
			@accept="update"
			acceptText="Salvar"
			cancelText="Cancelar"
			:title="'Trocar o contrato'"
			:max-width="'600px'"
			:active.sync="modalContrato"
		>
			<div class="con-exemple-prompt">
				<span class="font-regular mb-2">Selecione</span>
				<v-select
					v-model="selectedContrato"
					:class="'select-large-base'"
					:clearable="false"
					style="background-color: white"
					:options="contratos"
					v-validate="'required'"
					name="produtoUpsell"
				/>
			</div>
		</vs-prompt>
		<vs-prompt
			@cancel="modaltransferencia = false"
			@accept="transferir"
			acceptText="Salvar"
			cancelText="Cancelar"
			:title="'Transferencia de Expedição'"
			:max-width="'600px'"
			:active.sync="modaltransferencia"
		>
			<div class="con-exemple-prompt">
				<span class="font-regular mb-2"
					>Selecione a expedição a ser transferida</span
				>
				<v-select
					v-model="selectedExpedicao"
					:class="'select-large-base'"
					:clearable="false"
					style="background-color: white"
					:options="expedicaos"
					v-validate="'required'"
					name="produtoUpsell"
				/>
			</div>
		</vs-prompt>
		<!-- inicio popup gerar plp-->
		<div
			class="vs-component con-vs-popup holamundo vs-popup-primary"
			style=""
			v-show="modalGerarPlp"
		>
			<div class="vs-popup--background"></div>
			<div class="vs-popup" style="background: rgb(255, 255, 255)">
				<header class="vs-popup--header">
					<div class="vs-popup--title"></div>
				</header>
				<div class="vs-popup--content">
					<div class="vx-col w-full">
						<vx-card class="p-2">
							<div class="text-left mb-10">
								<h2 class="text-center">Gerando PLP</h2>
								<h6 class="mb-2 mt-4">
									<b>Numero da Expedição :</b> #{{ expedicao.id }}
								</h6>
								<h6 class="mb-2">
									<b>Brinde a ser enviado :</b>
									{{ expedicao.brinde.nome }}
								</h6>
								<h6 class="mb-2 flex">
									<b>Pertencente ao produto :</b>
									<vs-chip
										class="ml-4 text-lg"
										:color="expedicao.brinde.produto.cor"
										>{{ expedicao.brinde.produto.nome }}</vs-chip
									>
								</h6>
								<p class="mb-2"></p>
							</div>
							<vs-divider />

							<div class="flex items-center">
								<div class="fill-row-loading w-full" v-if="step == 0">
									<h6 class="mb-6">
										<b>Status atual:</b>
										<span> Verificando etiquetas </span>
									</h6>
									<h6 class="text-center mb-2">
										{{ count }}/{{ expedicao.automacaos.length }}
									</h6>
									<vs-progress
										:height="12"
										:percent="percent"
										color="success"
									></vs-progress>
								</div>

								<!--                steep2-->
								<div class="fill-row-loading w-full" v-if="step == 1">
									<div class="" v-if="!plpGerada">
										<h6 class="mb-6">
											<b>Status atual:</b>
											<span>
												Realizando comunicação com o sistema de
												correios
											</span>
										</h6>
										<vs-progress
											indeterminate
											color="primary"
										></vs-progress>
									</div>
									<div class="" v-if="plpGerada">
										<h6 class="mb-6">
											<b>Status atual:</b>
											<span class="text-daner"> PLP GERADA </span>
										</h6>
										<h5 class="text-center text-success">
											PLP GERADA COM SUCESSO!
										</h5>
										<vs-progress
											:height="12"
											:percent="100"
											color="success"
										></vs-progress>
										<div class="flex justify-center flex-wrap mt-10">
											<vs-button
												color="success"
												type="filled"
												icon-pack="material-icons"
												icon="call_made"
												@click="atualiza"
												>Ir para Expedição</vs-button
											>
										</div>
									</div>
								</div>
							</div>
						</vx-card>
					</div>
				</div>
			</div>
		</div>
		<!-- fim popup-->
	</div>
</template>

<script>
import moduleExpedicoesBrindes from "../../store/expedicoes/moduleExpedicoesBrindes";
import detalhe from "./Detalhe";
import endereco from "./Endereco";
import vSelect from "vue-select";
import moduleContrato from "../../store/contratos/moduleContrato";
import axios from "@/axios.js";
import moduleAutomacao from "../../store/automacao/moduleAutomacao";
import reenviar from "./Whatsapp";
import moduleWhatsList from "@/store/whatsapplist/moduleWhatsList";

//const { consultarCep } = require("correios-brasil");

export default {
	name: "ListDetal",
	//channel: `laravel_database_listarautomacao${this.$route.params.id}`,
	components: {
		endereco,
		detalhe,
		"v-select": vSelect,
		reenviar,
	},
	data() {
		return {
			expedicao: {
				brinde: {
					produto: {},
				},
				automacaos: [{ rastreio: null }],
				contrato: {},
			},
			modaltransferencia: false,
			aresponder: {},
			automacaosErros: [],
			city_id: "",
			dados: {
				pesquisa: "",
			},
			validando: false,
			responderTicket: false,
			//Iframe de impressões
			modalIframe: false,
			urlIframe: "",

			//Editando endereco
			modalEndereco: false,
			modalGerarPlp: false,
			percent: 0,
			count: 0,
			step: 0,
			erroMensage: false,
			plpGerada: false,
			endereco: {
				telefone: "",
			},
			valido: true,
			antigoCep: "",

			// Data Sidebar
			addNewDataSidebar: false,
			sidebarData: {},

			//Modal Contratos
			modalContrato: false,
			contratos: [],
			expedicaos: [],
			selectedContrato: {},
			selectedExpedicao: {},
			automacaoSelected: null,
		};
	},
	created() {
		if (!moduleExpedicoesBrindes.isRegistered) {
			this.$store.registerModule("expedicaos", moduleExpedicoesBrindes);
			moduleExpedicoesBrindes.isRegistered = true;
		}

		if (!moduleContrato.isRegistered) {
			this.$store.registerModule("contratos", moduleContrato);
			moduleContrato.isRegistered = true;
		}

		if (!moduleAutomacao.isRegistered) {
			this.$store.registerModule("automacao", moduleAutomacao);
			moduleAutomacao.isRegistered = true;
		}
		if (!moduleWhatsList.isRegistered) {
			this.$store.registerModule("whatsapplist", moduleWhatsList);
			moduleWhatsList.isRegistered = true;
		}
		if (moduleExpedicoesBrindes.isRegistered)
			this.getItem(this.$route.params.id);

		this.getContratos();

		this.getExpedicaos();
	},
	methods: {
		toggleRespostaSidebar(val = false) {
			this.responderTicket = val;
		},
		getItem(id) {
			this.$vs.loading();
			this.$store
				.dispatch("expedicaos/getId", id)
				.then((response) => {
					this.expedicao = { ...response };
					this.selectedContrato = {
						id: this.expedicao.contrato.id,
						label: this.expedicao.contrato.nome,
					};
				})
				.catch((erro) => {
					this.$vs.notify({
						color: "danger",
						text: "Algo deu errado ao carregar a exepdição.",
					});
					//Redirecionando caso 404
					if (erro.response.status == 404)
						this.$router.push({
							name: "page-error-404",
							params: {
								back: "brindes-expedicoes",
								text: "Retornar à listagem de Expedições",
							},
						});
				})
				.finally(() => {
					this.$vs.loading.close();
				});
		},
		atualiza() {
			this.modalGerarPlp = false;
			this.getItem(this.expedicao.id);
		},
		pesquisar(e) {
			e.preventDefault();
			this.$vs.loading();
			this.getItem(this.$route.params.id);
		},
		toggleDataSidebar(val = false) {
			this.addNewDataSidebar = val;
		},
		toggleDataSidebarEnd(val = false) {
			this.modalEndereco = val;
		},
		visualizar(obj) {
			this.sidebarData = obj;
			this.toggleDataSidebar(true);
		},
		arquivar(obj) {
			this.$vs.dialog({
				color: "primary",
				type: "confirm",
				title: `Arquivar Automação`,
				text: "Ao arquivar a automação ela sairá da expedição e irá para listagem de arquivas.",
				acceptText: "Sim, arquivar!",
				cancelText: "Cancelar",
				accept: () => {
					this.$store
						.dispatch("expedicaos/arquivar", obj.id)
						.then(() => {
							this.atualiza();
							this.$vs.notify({
								color: "success",
								text: "Arquivado realizado com sucesso",
							});
						})
						.catch(() => {
							this.modalGerarPlp = false;
							this.$vs.notify({
								color: "danger",
								text: "Algo deu errado ao arquivar a automação. Contate o suporte",
							});
						});
				},
			});
		},
		imprimir(id) {
			this.urlIframe = false;
			this.modalIframe = true;
			this.$vs.loading({
				container: "#pdf-with-loading",
			});
			axios
				.get("expedicaos/imprimiretiqueta", {
					params: {
						expedicao_id: this.$route.params.id,
						tipo: "single",
						automacao_id: id,
					},
					responseType: "arraybuffer",
				})
				.then((response) => {
					var blob = new Blob([response.data], {
						type: "application/pdf",
					});
					var url = window.URL.createObjectURL(blob);
					this.urlIframe = url;
					//window.open(url);
					this.$vs.loading.close("#pdf-with-loading > .con-vs-loading");
				})
				.catch(() => {
					this.$vs.notify({
						color: "danger",
						text: "Algo deu errado. Contate o suporte",
					});
					this.$vs.loading.close("#pdf-with-loading > .con-vs-loading");
				});
		},
		imprimirEtiquetas(tipo) {
			this.urlIframe = false;
			this.modalIframe = true;
			this.$vs.loading({
				container: "#pdf-with-loading",
			});
			axios
				.get("expedicaos/imprimiretiqueta", {
					params: { expedicao_id: this.expedicao.id, tipo: tipo },
					responseType: "arraybuffer",
				})
				.then((response) => {
					var blob = new Blob([response.data], {
						type: "application/pdf",
					});
					var url = window.URL.createObjectURL(blob);
					this.urlIframe = url;
					//window.open(url);
					this.$vs.loading.close("#pdf-with-loading > .con-vs-loading");
				})
				.catch(() => {
					this.$vs.notify({
						color: "danger",
						text: "Algo deu errado. Contate o suporte",
					});
					this.$vs.loading.close("#pdf-with-loading > .con-vs-loading");
				});
		},
		reenviarWhats(dados) {
			this.aresponder = dados;
			this.toggleRespostaSidebar(true);
		},
		imprimirDeclaracao(automacao) {
			this.urlIframe = false;
			this.modalIframe = true;
			this.$vs.loading({
				container: "#pdf-with-loading",
			});
			let params = {
				expedicao_id: this.expedicao.id,
				automacao_id: automacao,
			};
			axios
				.get("expedicaos/declaracaodeconteudo", {
					params: params,
					responseType: "arraybuffer",
				})
				.then((response) => {
					var blob = new Blob([response.data], {
						type: "application/pdf",
					});
					var url = window.URL.createObjectURL(blob);
					this.urlIframe = url;
					//window.open(url);
					this.$vs.loading.close("#pdf-with-loading > .con-vs-loading");
				})
				.catch(() => {
					this.$vs.notify({
						color: "danger",
						text: "Algo deu errado. Contate o suporte",
					});
					this.$vs.loading.close("#pdf-with-loading > .con-vs-loading");
				});
		},
		enviarRastreio(id) {
			this.$vs.loading();
			this.$store
				.dispatch("expedicaos/enviarRastreio", {
					expedicao_id: this.expedicao.id,
					automacao_id: id,
				})
				.then(() => {
					this.$vs.notify({
						color: "success",
						text: "Rastreio enviado com sucesso.",
					});
					this.getItem(this.expedicao.id);
				})
				.catch(() => {
					this.$vs.notify({
						color: "danger",
						text: "Algo deu errado. Contate o suporte",
					});
					this.$vs.loading.close();
				});
		},
		gerarPlp() {
			// this.$vs.loading();
			this.$vs.dialog({
				color: "primary",
				title: `Gerar PLP`,
				text: "Ao gerar PLP, não será mais possível editar os objetos contidos nela.",
				acceptText: "Sim, gerar!",
				accept: async () => {
					this.modalGerarPlp = true;
                    this.step = 0;
					await this.$store
						.dispatch("expedicaos/gerarEtiquetas", this.expedicao.id)
						.then(() => {
							this.count++;
							this.percent =
								(this.count / this.expedicao.automacaos.length) * 100;
                            this.step = 1;
                            this.plpGerada = false;
						})
						.catch((erro) => {
							this.modalGerarPlp = false;
							this.$vs.dialog({
								color: "danger",
								title: `Algo deu errado ao gerar as Etiquetas`,
								text: erro.response.data.message,
							});
						});

					await this.$store
						.dispatch("expedicaos/gerarPlp", this.expedicao.id)
						.then(() => {
                            this.count++;
							this.percent =
								(this.count / this.expedicao.automacaos.length) * 100;
                            this.plpGerada = true;
                        })
						.catch((erro) => {
							this.modalGerarPlp = false;
							this.$vs.dialog({
								color: "danger",
								title: `Algo deu errado ao gerar a PLP`,
								text: erro.response.data.message,
							});
						});
				},
			});
		},
		imprimirPlp() {
			/*this.modalIframe = true;
            this.urlIframe = saveleadsConfig.url_api + '/expedicaos/imprimirplp?expedicao_id=' + this.$route.params.id;*/
			this.urlIframe = false;
			this.modalIframe = true;
			this.$vs.loading({
				container: "#pdf-with-loading",
			});
			axios
				.get("expedicaos/imprimirplp", {
					params: { expedicao_id: this.expedicao.id },
					responseType: "arraybuffer",
				})
				.then((response) => {
					var blob = new Blob([response.data], {
						type: "application/pdf",
					});
					var url = window.URL.createObjectURL(blob);
					this.urlIframe = url;
					//window.open(url);
					this.$vs.loading.close("#pdf-with-loading > .con-vs-loading");
				})
				.catch(() => {
					this.$vs.notify({
						color: "danger",
						text: "Algo deu errado. Contate o suporte",
					});
					this.$vs.loading.close("#pdf-with-loading > .con-vs-loading");
				});
		},
		copyRastreio(val) {
			const thisIns = this;
			this.$copyText(val).then(
				function () {
					thisIns.$vs.notify({
						title: "Success",
						text: "Rastreio copiado para sua área de transferência",
						color: "success",
						iconPack: "feather",
						icon: "icon-check-circle",
					});
				},
				function () {
					thisIns.$vs.notify({
						title: "Failed",
						text: "Erro ao copiar rastreio",
						color: "danger",
						iconPack: "feather",
						position: "top-center",
						icon: "icon-alert-circle",
					});
				}
			);
		},
		//Editar endereço da automação
		editarEndereco(obj) {
			this.endereco = { ...obj.endereco };
			this.endereco.ddd = this.endereco.telefone.substring(0, 2);
			this.endereco.telefone = this.endereco.telefone.replace(
				this.endereco.ddd,
				""
			);
			this.modalEndereco = true;
		},
		buscaCep(e) {
			e.preventDefault();
			if (!this.valido) {
				this.endereco.complemento = "";
				this.endereco.numero = "";
				this.$store.dispatch('consultCep', this.endereco.cep)
					.then((response) => {
						this.valido = true;
						this.antigoCep = this.endereco.cep;
						this.endereco.cidade = this.removeAccents(response.city);
						this.endereco.bairro = this.removeAccents(response.neighborhood);
						this.endereco.endereco = this.removeAccents(response.street);
						this.endereco.estado = this.removeAccents(response.state);
					})
					.catch((erro) => {
						this.$vs.notify({
							title: "",
							color: "danger",
							text: erro.response.data.message,
						});
					});
			}
		},
		storeEndereco() {
			this.endereco.nome = this.removeAccents(this.endereco.nome);
		},
		//Trocando contrato
		getContratos() {
			this.$store.dispatch("contratos/get").then((response) => {
				this.contratos = [...this.arraySelect(response)];
			});
		},
		//Trocando contrato
		getExpedicaos() {
			this.$store.dispatch("expedicaos/get").then((response) => {
				let arraysend = response.data.data.filter((item) => {
					if (
						item.brinde &&
						item.contrato_type == "App\\Models\\Correio" &&
						item.fechado == 0
					) {
						return item;
					}
				});
				this.expedicaos = [...this.arraySelectExpedicao(arraysend)];
			});
		},
		update() {
			this.$vs.loading();
			this.expedicao.contrato_id = this.selectedContrato.id;
			this.$store
				.dispatch("expedicaos/store", this.expedicao)
				.then(() => {
					this.val = {};
					this.$vs.notify({
						color: "success",
						text: "Salvo com sucesso",
					});
					this.getItem(this.$route.params.id);
				})
				.catch(() => {
					this.$vs.notify({
						color: "danger",
						text: "Algo deu errado ao finalizar. Reinicie a página.",
					});
				});
		},
		transferir() {
			this.$vs.loading();
			let payload = {
				id: this.automacaoSelected,
				expedicao_id: this.selectedExpedicao.id,
			};
			this.$store
				.dispatch("expedicaos/tranferir", payload)
				.then(() => {
					this.val = {};
					this.$vs.notify({
						color: "success",
						text: "Salvo com sucesso",
					});
					this.getItem(this.$route.params.id);
				})
				.catch(() => {
					this.$vs.notify({
						color: "danger",
						text: "Algo deu errado ao finalizar. Reinicie a página.",
					});
				});
		},
		async validarAutomacoes() {
			this.validando = true;
			for (let [index, item] of this.expedicao.automacaos.entries()) {
				this.$vs.loading({
					container: "#td-loading-" + index,
					scale: 0.6,
				});
				await this.requestValidar(item);
			}
			this.validando = false;
		},
		requestValidar(item) {
			return new Promise((resolve, reject) => {
				this.$store
					.dispatch("automacao/validarAutomacao", item.id)
					.then((response) => {
						if (!response.success) item.erro = response.erro;
						else item.erro = null;

						resolve();
					})
					.catch(() => {
						reject();
					})
					.finally(() =>
						this.$vs.loading.close(
							"#td-loading-" + item.id + " > .con-vs-loading"
						)
					);
			});
		},
		showErro(arr) {
			let message = "Erro - ";
			arr = Object.entries(arr);
			arr.forEach((area) => {
				area.forEach((text) => {
					message += text + "\r\n";
				});
			});

			return message;
		},
	},
	computed: {
		invalidoEntrega() {
			return (
				!this.endereco.complemento ||
				!this.endereco.numero ||
				!this.endereco.ddd ||
				!this.endereco.telefone ||
				!this.endereco.nome ||
				this.endereco.telefone.length <= 8
			);
		},
		list() {
			return this.expedicao.automacaos.filter((automacao) => {
				let email = automacao.email_destinatario
					? automacao.email_destinatario
							.toLowerCase()
							.includes(this.dados.pesquisa.toLowerCase())
					: false;
				let rastreio = automacao.rastreio
					? automacao.rastreio
							.toLowerCase()
							.includes(this.dados.pesquisa.toLowerCase())
					: false;
				let nome = automacao.nome_destinatario
					? automacao.nome_destinatario
							.toLowerCase()
							.includes(this.dados.pesquisa.toLowerCase())
					: false;

				return email || rastreio || nome;
			});
		},
	},
	watch: {
		endereco: {
			handler: function (e) {
				if (e.cep != this.antigoCep) {
					this.valido = false;
				}
			},
			deep: true,
		},
	},
};
</script>

<style>
.popup-iframe .vs-popup {
	width: 100vw !important;
	height: 100vh !important;
}

.popup-iframe .vs-popup--content {
	height: 100% !important;
	overflow: hidden;
}

.popup-endereco .vs-popup--content {
	background-color: rgb(238 232 232) !important;
	margin-top: 0;
}
</style>
