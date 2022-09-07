<template>
	<div>
		<vs-row>
			<vs-col vs-w="12">
				<div class="vx-row mt-20 flex justify-center" v-if="items.length === 0">
					<div class="w-full lg:w-6/12 xlg:w-6/12 s:w-full sem-item">
						<div class="w-8/12">
							<p class="span-sem-item">Nenhuma notificação encontrada</p>
							<br>
						</div>
					</div>
				</div>
				<div class="com-item mt-10" v-else>
					<div class="vx-row bg-white p-4 rounded-lg w-full my-3 lg:w-8/12 mx-auto" v-for="(ntf, index) in paginados" :key="index">
						<div class="vx-col w-1/12 flex justify-center">
							<vs-icon :icon="ntf.data.icon" icon-pack="material-icons" class="icon-grande text-xl" v-bind:class="`text-${ntf.data.category}`" :svgClasses="[`text-${ntf.data.category}`, 'stroke-current mr-1 h-6 w-6']"></vs-icon>
						</div>
						<div class="vx-col w-3/12">
							<span class="font-medium block notification-title" :class="[`text-${ntf.data.category}`]">{{ ntf.data.title }}</span>
						</div>
						<div class="vx-col w-4/12">
							<small>{{ ntf.data.message }}</small>
						</div>
						<div class="vx-col w-4/12 text-right">
							{{ elapsedTime(ntf.data.time) }}
						</div>
					</div>
					<div class="vx-row mt-10" v-if="paginados.length != items.length">
						<div class="vx-col w-full text-center">
							<vs-button @click="carregarMais" color="primary" size="medium" class="font-bold">
								Carregar mais
							</vs-button>
						</div>
					</div>
				</div>
			</vs-col>
		</vs-row>
	</div>
</template>

<script>
import moduleNotificacoes from "@/store/notificacoes/moduleNotificacoes";

export default {
	name: "Index",
	data() {
		return {
			dados: {
				search: '',
				page: 1
			},
			pagination: {
				last_page: 1,
				page: 1,
				current_page: 1
			},
			items: [],
			count: 10,
			currentx: 1
			//items: {}
		};
	},
	created() {
		this.$vs.loading();
		if (!moduleNotificacoes.isRegistered) {
			this.$store.registerModule('notificacoes', moduleNotificacoes);
			moduleNotificacoes.isRegistered = true;
		}

		this.getItems();
	},
	methods: {
		getItems() {
			this.$vs.loading();
			this.$store.dispatch('notificacoes/getAll', this.dados).then(response => {
				this.items = response;
			}).catch(error => {
				this.$vs.notify({
					text: error.response.data.message,
					iconPack: 'feather',
					icon: 'icon-alert-circle',
					color: 'danger'
				});
			}).finally(() => this.$vs.loading.close());
		},
		carregarMais() {
			this.count += 10;
		}
	},
	computed: {
		paginados() {
			let arr = [];
			for (let i = 0; i <= this.count; i++) {//Inserindo os primeiros 10
				if (this.items[i])
					arr.push(this.items[i]);
			}
			return arr;
		}
	}
};
</script>
