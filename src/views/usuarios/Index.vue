<template>
	<div>
		<div class="vx-row flex items-center lg:mt-20 sm:mt-6">
			<div
				class="vx-col w-full sm:w-0 md:w-0 lg:w-6/12 xlg:w-5/12 col-btn-incluir-mobile mb-3"
				v-if="$acl.check('configuracao_usuario_incluir')"
			>
				<vs-button
					color="primary"
					class="float-right botao-incluir"
					type="filled"
					@click="addNewData"
				>
					<vs-icon
						icon-pack="material-icons"
						icon="check_circle"
						class="icon-grande"
					></vs-icon>
					Incluir Usuário
				</vs-button>
				<!-- SEARCH INPUT -->
			</div>
			<div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
				<div class="flex items-center">
					<div class="relative w-full">
						<!-- SEARCH INPUT -->
						<form @submit.prevent="pesquisar">
							<vs-input
								autocomplete
								class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
								v-model="dados.search"
								id="search_input"
								size="large"
								placeholder="Pesquisar por nome, e-mail ou função"
							/>
							<!-- SEARCH LOADING -->
							<!-- SEARCH ICON -->
							<div
								slot="submit-icon"
								class="absolute top-0 right-0 py-4 px-6"
							>
								<button type="submit" class="btn-search-bar">
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
				class="vx-col w-full lg:w-6/12 xlg:w-5/12 col-btn-incluir-desktop"
				v-if="$acl.check('configuracao_usuario_incluir')"
			>
				<vs-button
					color="primary"
					class="float-right botao-incluir"
					type="filled"
					@click="addNewData"
				>
					<vs-icon
						icon-pack="material-icons"
						icon="check_circle"
						class="icon-grande"
					></vs-icon>
					Convidar Usuário
				</vs-button>
				<!-- SEARCH INPUT -->
			</div>
		</div>
		<vs-row>
			<vs-col vs-w="12">
				<div
					class="vx-row mt-20 flex justify-center"
					v-if="items.length === 0"
				>
					<nenhum-registro />
				</div>
				<div class="com-item" v-else>
					<vs-table
						:data="items"
						class="table-items"
						style="border-spacing: 0 8px; border-collapse: separate"
					>
						<template slot="thead">
							<vs-th></vs-th>
							<vs-th>Nome</vs-th>
							<vs-th>E-mail</vs-th>
							<vs-th>Status</vs-th>
							<vs-th></vs-th>
						</template>
						<template slot-scope="{ data }">
							<vs-tr
								:key="indextr"
								v-for="(tr, indextr) in data"
								class="mb-3 relative"
							>
								<vs-td :data="tr.avatar" class="flex justify-center">
									<!--<img key="onlineImg" :src="url_api(tr.avatar)"
                                         alt="user-img" width="50" height="50"
                                         class="rounded-full shadow-md cursor-pointer block" style="margin: 0 auto"/>-->
									<vs-avatar
										color="primary"	
										size="large"
										:text="tr.name"
									/>
								</vs-td>
								<vs-td :data="tr.name">
									<p><span class="destaque">{{ tr.name || '-- Wait user --' }}</span></p>
									<p><span>{{ tr.role_name }}</span></p>
								</vs-td>
								<vs-td :data="tr.email">
									{{ tr.email }}
								</vs-td>
								<vs-td :data="tr.role_name">
									<vs-chip v-if="tr.status == 'pending'" color="warning">Aguardando</vs-chip>
									<vs-chip  v-if="tr.status == 'active'" color="primary">Ativo</vs-chip>
									<vs-chip v-if="tr.status == 'inactive'" color="danger">Inativo</vs-chip>
								</vs-td>
								<vs-td class="relative">
									<vs-dropdown
										vs-trigger-click
										v-if="
											$acl.check('configuracao_usuario_editar') ||
											$acl.check('configuracao_usuario_deletar')
										"
									>
										<vs-button
											radius
											color="#EDEDED"
											type="filled"
											class="btn-more-icon relative botao-menu"
											icon-pack="material-icons"
											icon="more_horiz"
										></vs-button>
										<vs-dropdown-menu
											class="dropdown-menu-list dropdown-usuario"
										>
											<span class="span-identifica-item-dropdown"
												>Nº {{ tr.id }}</span
											>
											<vs-dropdown-item
												@click="updateData(tr.id)"
												v-if="$acl.check('configuracao_usuario_editar')"
											>
												<vs-icon
													icon-pack="material-icons"
													icon="account_circle"
												></vs-icon>
												Gerenciar
											</vs-dropdown-item>
														<vs-dropdown-item
												@click="sendInvite(tr)"
												v-if="tr.status == 'pending'"
											>
												<vs-icon
													icon-pack="material-icons"
													icon="refresh"
												></vs-icon>
												Reenviar convite
											</vs-dropdown-item>

											<vs-dropdown-item
												@click="deletar(tr.id)"
												v-if="$acl.check('configuracao_usuario_deletar') && tr.status == 'pending'">
												<vs-icon
													icon-pack="material-icons"
													icon="delete"
												></vs-icon>
												Deletar
											</vs-dropdown-item>
										</vs-dropdown-menu>
									</vs-dropdown>
								</vs-td>
							</vs-tr>
						</template>
					</vs-table>
					<vs-pagination
						class="mt-2"
						:total="pagination.last_page"
						v-model="currentx"
					></vs-pagination>
				</div>
			</vs-col>
		</vs-row>
		<custom-popup
			:active.sync="modal"
			@closeModal="modal = false"
			title="Convidar usuário"
		>
			<add-user />
		</custom-popup>
	</div>
</template>

<script>
import moduleContas from "@/store/contas/moduleContas.js";
import AddUser from "./Add";
import moduleUsersCompanies from "@/store/usersCompanies/moduleUsersCompanies.js";

export default {
	components: {
		"add-user": AddUser,
	},
	name: "IndexUser",
	data() {
		return {
			modal: false,
			addNewDataSidebar: false,
			sidebarData: {},
			routeTitle: "Contas",
			dados: {
				search: "",
				page: 1,
			},
			pagination: {
				last_page: 1,
				page: 1,
				current_page: 1,
			},
			currentx: 1,
		};
	},
	created() {
		this.$vs.loading();
		if (!moduleContas.isRegistered) {
			this.$store.registerModule("contas", moduleContas);
			moduleContas.isRegistered = true;
		}
		if (!moduleUsersCompanies.isRegistered) {
			this.$store.registerModule("usersCompanies", moduleUsersCompanies);
			moduleUsersCompanies.isRegistered = true;
		}

		this.getItems();
	},
	methods: {
		addNewData() {
			//this.$router.push({ name: "usuario-criar" });
			this.modal = true;
		},
		updateData(id) {
			this.$router.push({ path: "/configuracoes/usuarios/editar/" + id });
		},
		toggleDataSidebar(val = false) {
			this.addNewDataSidebar = val;
		},
		getItems() {
				this.$store
							.dispatch("usersCompanies/get", { params: this.dados, })
							.then((response) => {
								this.pagination = response.meta;
							})
							.catch((err) => {
								this.$vs.notify({
									color: "danger",
									title: "Erro",
									text: err.response? err.response.data.message : null,
								});
								
							}).finally(()=>{this.$vs.loading.close();});
			
		},
		deletar(id) {
			this.$vs.dialog({
				color: "danger",
				title: `Deletar usuário id: ${id}`,
				text: "Deseja deletar este Usuário? Procedimento irreversível",
				acceptText: "Sim, deletar!",
				accept: () => {
					this.$vs.loading();
					this.$store
							.dispatch("usersCompanies/delete", { id: id })
							.then((res) => {
								this.$vs.notify({
									color: "success",
									title: "Sucesso",
									text: res.response? res.response.data.message : null,
								});
							})
							.catch((err) => {
								this.$vs.notify({
									color: "danger",
									title: "Erro",
									text: err.response? err.response.data.message : null,
								});
								
							}).finally(()=>{this.$vs.loading.close();});
				},
			});
		},
		sendInvite(user) {
			this.$vs.dialog({
				color: "primary",
				title: `Reenviar convite`,
				text: `Deseja reenviar o convite para este Usuário? Convite será enviado para o email: ${user.email}`,
				acceptText: "Sim, Enviar!",
				accept: () => {
					this.$vs.loading();
					this.$store
						.dispatch("usersCompanies/sendInvite", { id: user.id })
						.then(() => {
							this.$vs.notify({
								color: "success",
								title: "Sucesso",
								text: "Convite enviado com sucesso",
							});
						})
						.catch((err) => {
							this.$vs.notify({
								color: "danger",
								title: "Erro",
								text: err.response? err.response.data.message : null,
							});
							
						}).finally(()=>{this.$vs.loading.close();});
				},
			});
		},
		pesquisar(e) {
			this.dados.page = 1;
			e.preventDefault();
			this.$vs.loading();
			this.getItems();
		},
	},
	watch: {
		currentx() {
			this.$vs.loading();
			this.dados.page = this.currentx;
			this.getItems();
		},
		$route() {
			this.routeTitle = this.$route.meta.pageTitle;
		},
	},
	computed: {
		items() {
			return this.$store.state.usersCompanies.users;
		},
		/*pagination() {
                return this.$store.state.pagination;
            },*/
	},
};
</script>
