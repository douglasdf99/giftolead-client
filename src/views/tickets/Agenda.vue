<template>
	<div>
		<vs-tabs color="primary" class="tabs-shadow-none">
			<vs-tab color="primary" value="10" label="meus agendamentos" @click="getAtendimentos('agendamentos')">
				<div class="vx-row mt-2">
					<div class="vx-col w-2/12">
						<h3 class="text-bold text-xl text-color-base mb-5">Atrasados</h3>
						<card-schedule :data="item" v-for="item in atrasados" :key="item.id"/>
					</div>
					<div class="vx-col w-2/12">
						<h3 class="text-bold text-xl text-color-base mb-5">Para Hoje</h3>
						<card-schedule :data="item" v-for="item in agendadosHoje" :key="item.id"/>
					</div>
					<div class="vx-col w-8/12">
						<calendario :items="items" class="mt-2" :agendadosHoje="agendadosHoje" @getItems="getAtendimentos"></calendario>
					</div>
				</div>
			</vs-tab>
			<vs-tab color="success" value="10" label="agendados para qualquer usuário" @click="getAtendimentos('agendamentos_natendimento')">
				<calendario :items="items" class="mt-2" @getItems="getAtendimentos('agendamentos_natendimento')"></calendario>
			</vs-tab>
			<vs-tab color="success" value="10" label="todos os agendamentos" @click="getAtendimentos('agendamentos_todos')">
				<calendario :items="items" class="mt-2" @getItems="getAtendimentos('agendamentos_todos')"></calendario>
			</vs-tab>
		</vs-tabs>

	</div>
</template>

<script>
import Calendario from "./Calendario";
import moduleTickets from "../../store/tickets/moduleTickets";
import CardSchedule from "../components/tickets/CardSchedule";

const moment = require('moment/moment');
require('moment/locale/pt-br');

export default {
	name: "Agenda",
	components: {
		'calendario': Calendario,
		CardSchedule
	},
	data() {
		return {
			items: [],
			agendadosHoje: [],
			atrasados: [],
		};
	},
	methods: {
		getAtendimentos(val = 'agendamentos') {
			this.$vs.loading();
			this.agendadosHoje = [];
			this.$store.dispatch('tickets/rotaAtual', val);
			this.$store.dispatch('tickets/getAgenda', val).then(response => {
				this.items = response;
				this.organize();
			}).finally(() => this.$vs.loading.close());
		},
		async organize() {
			this.$vs.loading();
			await this.items.forEach(item => {
				let {data_agendamento} = item;
				let nome = item.lead.nome.split(' ');

				item.hour = moment(item.data_agendamento).format('H:mm');
				item.title = `<img class='rounded-full responsavel-img mr-2' src='`;

				if (item.responsavel)
					item.title += this.get_img_cdn(item.responsavel.avatar);
				else
					item.title += this.get_img_cdn('utils/avatar-padrao.png');

				item.title += `' width='30px' alt=''>`;

				item.title += ` ${item.hour} - ${nome[0] + (nome[1] ? ' ' + nome[1].charAt(0) : '')}`;

				item.startDate = data_agendamento;
				item.endDate = data_agendamento;
				item.label = this.getSituacao(data_agendamento);
				item.classes = 'event-' + this.getColorLabel(item.label);
				let hoje = moment().format('Y-MM-D H:mm');
				var amanha = moment().add(1, 'days').set({
					hour: 0,
					minute: 0,
					second: 0,
					millisecond: 0
				}).format('Y-MM-D H:mm');
				item.data_agendamento = moment(item.data_agendamento).format('Y-MM-D H:mm');
				if (((item.data_agendamento > hoje) && (item.data_agendamento < amanha))) {
					item.nomeHoje = nome[0] + (nome[1] ? ' ' + nome[1].charAt(0) : '');
					this.agendadosHoje.push(item);
				}

				if (item.label === 'atrasado')
					this.atrasados.push(item);
			});

			this.atrasados.sort(this.compare);

			this.$vs.loading.close();
		},
		getSituacao(data) {
			var hoje = new Date();
			var data2 = new Date(data);
			var amanha = moment().add(1, 'days').set({
				hour: 0,
				minute: 0,
				second: 0,
				millisecond: 0
			}).format('Y-MM-D H:mm');
			amanha = new Date(amanha);

			if ((data2.getTime() > hoje.getTime()) && (data2.getTime() < amanha.getTime())) return 'dentrodoprazo';
			if (data2.getTime() < hoje.getTime()) return 'atrasado';
			if (data2.getTime() >= amanha.getTime()) return 'futuro';
		},
		getColorLabel(val) {
			if (val == 'futuro') return 'success';
			if (val == 'atrasado') return 'danger';
			return 'warning';
		},
		compare(a, b) {
			var time1 = parseFloat(a.hour.replace(':', '.'));
			var time2 = parseFloat(b.hour.replace(':', '.'));
			if (time1 < time2) return -1;
			if (time1 > time2) return 1;
			return 0;
		}
	},
	created() {
		if (!moduleTickets.isRegistered) {
			this.$store.registerModule('tickets', moduleTickets);
			moduleTickets.isRegistered = true;
		}
		this.getAtendimentos();
	},
	updated() {
		let imgs = document.getElementsByClassName('cv-event');
		for (let i = 0; i < imgs.length; i++) {
			imgs[i].removeAttribute('title');
		}
	}
};
</script>

<style scoped>

</style>
