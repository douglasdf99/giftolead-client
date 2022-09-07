<template>
	<vx-tooltip :text="data.atendimento ? data.atendimento.follow_up : 'Sem Follow Up'" position="right">
		<div class="vx-card py-2 px-3 mb-4 cursor-pointer" @click="verificacao(data.ticket_id)">
			<div class="flex align-center justify-between">
				<span :class="`mr-2 text-muted text-xl ${data.label === 'atrasado' ? 'text-danger' : 'text-warning'}`">
					{{ data.hour }}
				</span>
				<span class="text-xl">
					#{{ data.ticket_id }}
				</span>
			</div>
			<span>
					{{ identify.substr(0, 20) }}
			</span>
		</div>
	</vx-tooltip>
</template>

<script>
export default {
	name: "CardSchedule",
	props: {
		data: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			identify: ''
		};
	},
	created() {
		this.identify = this.data.lead.nome.split(' ');
		this.identify = this.identify[0] + (this.identify[1] ? ` ${this.identify[1].charAt(0)}.` : '');
	},
	computed: {
		calendarLabels() {
			return [
				{text: 'Atrasado', color: 'danger', value: 'atrasado'},
				{text: 'Dentro do prazo', color: 'warning', value: 'dentrodoprazo'},
				{text: 'Futuro', color: 'success', value: 'futuro'},
			];
		},
	},
	methods: {
		verificacao(id) {
			this.$store.dispatch('tickets/verificaDisponibilidade', id).then(response => {
				if (response.status == 'ok')
					this.$router.push({name: 'tickets-atender', params: {id: id}});
				else if (response.status == 'atendendo') {
					this.openAlert('Ticket em atendimento', response.msg, 'danger');
				} else if (response.status == 'jaatendendo') {
					this.openAlert('Atendimento em andamento, Ticket #' + response.id, response.msg, 'primary', response.id);
				} else {
					this.openAlert('Este Ticket já encontra-se fechado', response.msg, 'danger');
				}
			});
		},
		openAlert(title, text, color, id = null) {
			this.$vs.dialog({
				color: color,
				title: title,
				text: text,
				type: 'confirm',
				cancelText: 'Cancelar',
				accept: () => {
					if (id != null) {
						this.$router.push({name: 'tickets-atender', params: {id}});
						this.getId(id);
					} else
						this.$router.push({name: 'tickets-list'});
				},
				cancel: () => {
					this.$router.push({name: 'tickets-list'});
				},
				acceptText: 'Ir até ele'
			});
		}
	}
};
</script>

<style scoped>

</style>
