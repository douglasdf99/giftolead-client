<template>
	<div>
	
		<vs-row>
			<vs-col vs-w="12">
				<div
					class="vx-row mt-20 flex justify-center"
					v-if="user.companies.length === 0"
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
							<vs-th class="lg:w-1/12"></vs-th>
							<vs-th class="lg:w-2/12">Nome</vs-th>
							<vs-th class="lg:w-2/12">Função</vs-th>
							<vs-th class="lg:w-2/12">Status</vs-th>
							<vs-th class="lg:w-2/12">Ações</vs-th>
						</template>
						<template slot-scope="{ data }">
							<vs-tr
								:key="indextr"
								v-for="(tr, indextr) in user.companies"
								class="mb-3 relative"
							>
						
                                <vs-td class="relative">
                                 <div class="flex justify-center">
                                 
                                    <vs-avatar color="primary" size="large"
                                    class="flex-shrink-0 " :text="tr.apelido"></vs-avatar>
                                 </div>
								</vs-td>
								<vs-td class="relative">
									<span class="destaque">{{ tr.apelido }}</span>
								</vs-td>
							
								<vs-td class="relative">
									<vs-chip color="primary">{{ tr.role_name }}</vs-chip>
								</vs-td>
                                <vs-td class="relative">
	                                <vs-chip v-if="tr.status == 'pending'" color="warning">Aguardando</vs-chip>
									<vs-chip  v-if="tr.status == 'active'" color="primary">Ativo</vs-chip>
									<vs-chip v-if="tr.status == 'inactive'" color="danger">Inativo</vs-chip>								</vs-td>
								<vs-td class="relative">
                               
                                   <vs-button v-if="tr.status == 'pending'" color="primary" type="filled" class="font-bold"
                                        @click="$router.push({
                                            name: 'dashboard', 
                                            params:{company_slug: tr.slug}
                                            })">
                                    Aceitar convite
                                </vs-button>
                                   <vs-button v-if="tr.status == 'active'" color="primary" type="filled" class="font-bold"
                                        @click="$router.push({
                                            name: 'dashboard', 
                                            params:{company_slug: tr.slug}
                                            })">
                                    Acessar
                                </vs-button>
                                   
								</vs-td>
							</vs-tr>
						</template>
					</vs-table>
				</div>
			</vs-col>
		</vs-row>

	</div>
</template>

<script>
import modulePlanos from "@/store/planos/modulePlanos.js";

export default {
	name: "PanelIndex",
	data() {
		return {
			routeTitle: "Panel",

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
			//items: {}
		};
	},
	created() {
		//this.$vs.loading();
	},
	methods: {
		addNewData() {
			this.$router.push({ name: "planos-criar" });
		},
		updateData(obj) {
			this.$router.push({
				name: "planos-gerenciar",
				params: { id: obj.id },
			});
		},
		toggleDataSidebar(val = false) {
			this.addNewDataSidebar = val;
		},
		getItems() {},
		deletar(id) {
			this.$vs.dialog({
				color: "danger",
				title: `Deletar registro`,
				text: "Deseja deletar este registro? Procedimento irreversível",
				acceptText: "Sim, deletar!",
				accept: () => {
					this.$vs.loading();
					this.$store
						.dispatch("deleteItem", { id: id, rota: "planos" })
						.then(() => {
							this.$vs.notify({
								color: "success",
								title: "",
								text: "O registro foi deletada com sucesso",
							});
							this.getItems();
						})
						.catch(() => {
							this.$vs.notify({
								color: "danger",
								title: "Erro",
								text: "Algo deu errado ao deletar a conta. Contate o suporte.",
							});
						})
						.finally(() => {
							this.$vs.loading.close();
						});
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
			return this.$store.state.items;
		},
		user() {
			return this.$store.state.AppActiveUser;
		},
		/*pagination() {
                return this.$store.state.pagination;
            },*/
	},
};
</script>
