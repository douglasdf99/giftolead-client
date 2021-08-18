<template>
    <vs-dropdown vs-trigger-click class="cursor-pointer">
        <small class="flex cursor-pointer">
            <span>{{ label }}</span>
            <feather-icon icon='ChevronDownIcon' svgClasses='h-4 w-4' class='ml-1'/>
        </small>
        <vs-dropdown-menu class="w-60">
            <vs-dropdown-item @click="setDate('7'); label = 'Últimos 7 dias'">Últimos 7 dias</vs-dropdown-item>
            <vs-dropdown-item @click="setDate('31'); label = 'Último mês'">Último mês</vs-dropdown-item>
            <vs-dropdown-item @click="setDate('365'); label = 'Último ano'">Último ano</vs-dropdown-item>
        </vs-dropdown-menu>
    </vs-dropdown>
</template>

<script>
const moment = require('moment/moment');
require('moment/locale/pt-br');

export default {
    name: 'ChangeDateDashboard',
    components: {
        moment
    },
    data() {
        return {
            datas: {
                dt_inicio: '',
                dt_fim: moment().format('YYYY-MM-DD'),
            },
            label: 'Últimos 7 dias'
        }
    },
    created() {
    },
    methods: {
        setDate(val) {
            switch (val) {
                case '7':
                    this.datas.dt_inicio = moment().subtract(7, 'days').format('YYYY-MM-DD')
                    break;
                case '31':
                    this.datas.dt_inicio = moment().subtract(31, 'days').format('YYYY-MM-DD')
                    break;
                case '365':
                    this.datas.dt_inicio = moment().subtract(365, 'days').format('YYYY-MM-DD')
                    break;
            }
            this.$emit('changeDate', this.datas);
        }
    }
}
</script>