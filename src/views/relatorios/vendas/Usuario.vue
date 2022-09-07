<template>
    <div>
        <rel-header :data="dados"  @animate="animateStatisticNumbers"/>
        <div class="vx-row mb-base">
            <div class="vx-col w-full vs-con-loading__container" id="relatorio-line-chart">
                <LineChart v-if="!loading.vendas"/>
                <vx-card title="Overview" class="card-overlay w-full h-75 relative" v-else>
                    <div style="height: 30vh" class="py-5 w-full rounded-lg relative flex items-center justify-center"/>
                </vx-card>
            </div>
        </div>
        <coorecuperados :items="statistics.coorecuperados"/>
        <automaticas :items="statistics.automaticas"/>
        <metodos-pagamento :items="payment_methods"/>
    </div>
</template>

<script>
import LineChart from "./LineChart";
import CustomStatisticsCard from './CustomStatisticsCard';
import moduleRelatorios from "../../../store/relatorios/moduleRelatorios";
import gsap from 'gsap';
import moduleProdutos from "../../../store/produtos/moduleProdutos";
import moduleUsuario from "../../../store/usuarios/moduleUsuario";
import Coorecuperados from "./Coorecuperados";
import Automaticas from "./Automaticas";
import MetodosPagamento from "./MetodosPagamento";
import RelHeader from "../rel-header";

export default {
    name: "Index",
    components: {
        RelHeader,
        MetodosPagamento,
        Automaticas,
        Coorecuperados,
        LineChart, CustomStatisticsCard},
    data() {
        return {
            dados: {
                route: 'relatorio-vendas-usuario',
                mutation: 'SET_REL_VENDAS',
                dt_inicio: '',
                dt_fim: '',
                produtos: [],
                daysInterval: 7
            },
            //Statistics só existe para a animação ser aplicada corretamente
            statistics: {
                automaticas: {
                    boleto: 0,
                    carrinho: 0,
                    colaborador: 0
                },
                coorecuperados: {
                    agendamento: 0,
                    boleto: 0,
                    cancelado: 0,
                    checkout: 0,
                    whatsapp: 0,
                    link: 0,
                    user: 0,
                },
                payment_methods: []
            },
        };
    },
    created() {
        if (!moduleRelatorios.isRegistered) {
            this.$store.registerModule('relatorios', moduleRelatorios);
            moduleRelatorios.isRegistered = true;
        }

        if (!moduleProdutos.isRegistered) {
            this.$store.registerModule('produtos', moduleProdutos);
            moduleProdutos.isRegistered = true;
        }

        if (!moduleUsuario.isRegistered) {
            this.$store.registerModule('users', moduleUsuario);
            moduleUsuario.isRegistered = true;
        }
    },
    methods: {
        animateStatisticNumbers() {
            let duration = 2;
            //Animação dos números estatísticos
            gsap.to(this.statistics.automaticas, {
                duration, carrinho: this.automaticas.carrinho,
                boleto: this.automaticas.boleto,
                colaborador: this.automaticas.colaborador
            });
            gsap.to(this.statistics.coorecuperados, {
                duration, carrinho: this.coorecuperados.carrinho,
                boleto: this.coorecuperados.boleto, whatsapp: this.coorecuperados.whatsapp,
                agendamento: this.coorecuperados.agendamento, cancelado: this.coorecuperados.cancelado,
                user: this.coorecuperados.user, link: this.coorecuperados.link
            });
        }
    },
    computed: {
        loading() {
            return this.$store.state.relatorios.loading;
        },
        vendas() {
            return this.$store.state.relatorios.vendas;
        },
        coorecuperados() {
            return this.$store.getters['relatorios/coorecuperadosObject'];
        },
        automaticas() {
            return this.$store.getters['relatorios/automaticasObject'];
        },
        payment_methods() {
            return this.$store.getters['relatorios/paymentMethodsObject'];
        }
    }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"/>
