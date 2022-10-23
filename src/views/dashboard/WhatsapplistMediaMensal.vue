<template>
  <div class="vx-row">
    <div class="vx-col w-full">
      <place-holder-loading-dashboard
        v-if="this.chart_media_options.xaxis.categories.length == 0"
        tipo="media"
      />
      <vx-card
        v-if="this.chart_media_options.xaxis.categories.length > 0"
        :title="`Whatsapplist Respondidos- Comparativo Mensal`"
      >
        <div slot="no-body" class="p-6 pb-0">
          <div class="flex">
            <div class="mr-6">
              <p class="mb-1 font-semibold">Esse mês</p>
              <p class="text-3xl" :style="{ color: '#F97794' }">
                {{ media_tickets.analyticsData.thisMonth.toLocaleString() }}
              </p>
            </div>
            <div>
              <p class="mb-1 font-semibold">Mês passado</p>
              <p class="text-3xl">
                {{ media_tickets.analyticsData.lastMonth.toLocaleString() }}
              </p>
            </div>
          </div>
          <vue-apex-charts
            type="line"
            height="266"
            :options="chart_media_options"
            :series="media_tickets.series"
          />
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import VueApexCharts from "vue-apexcharts";
import StatisticsCardLine from "@/components/statistics-cards/StatisticsCardLine.vue";
import ChangeTimeDurationDropdown from "@/components/ChangeTimeDurationDropdown.vue";
import VxTimeline from "@/components/timeline/VxTimeline";
import ChangeDateDashboard from "@/views/components/ChangeDateDashboard";
import PlaceHolderLoadingDashboard from "@/views/components/PlaceHolderLoadingDashboard";
import { mapActions } from 'vuex';

const moment = require("moment/moment");
require("moment/locale/pt-br");

export default {
  data() {
    return {
      //Média Mensagel
      media_tickets: {
        analyticsData: {
          thisMonth: 0,
          lastMonth: 0,
        },
        series: [
          { name: "Este mês", data: [] },
          { name: "Mês passado", data: [] },
        ],
      },
      chart_media_options: {
        chart: {
          toolbar: { show: false },
          dropShadow: {
            enabled: true,
            top: 5,
            left: 0,
            blur: 4,
            opacity: 0.1,
          },
        },
        stroke: {
          curve: "smooth",
          dashArray: [0, 8],
          width: [4, 2],
        },
        grid: {
          borderColor: "#e7e7e7",
        },
        legend: {
          show: false,
        },
        colors: ["#F97794", "#b8c2cc"],
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            inverseColors: false,
            gradientToColors: ["#7367F0", "#b8c2cc"],
            shadeIntensity: 1,
            type: "horizontal",
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100],
          },
        },
        markers: {
          size: 0,
          hover: {
            size: 5,
          },
        },
        xaxis: {
          labels: {
            style: {
              cssClass: "text-grey fill-current",
            },
          },
          axisTicks: {
            show: false,
          },
          categories: [],
          axisBorder: {
            show: false,
          },
        },
        yaxis: {
          tickAmount: 5,
          labels: {
            style: {
              cssClass: "text-grey fill-current",
            },
            formatter: function (val) {
              return val > 999 ? (val / 1000).toFixed(1) + "k" : val;
            },
          },
        },
        tooltip: {
          x: { show: false },
        },
      },
    };
  },
  components: {
    VueApexCharts,
    VuePerfectScrollbar,
    StatisticsCardLine,
    ChangeTimeDurationDropdown,
    VxTimeline,
    ChangeDateDashboard,
    PlaceHolderLoadingDashboard,
  },
  async mounted() {
    await this.getMediaMensal();
  },
  methods: {
    ...mapActions({
      getData: 'dashboard/getData',
    }),
    getMediaMensal() {
      let datas = {
        dt_inicio: moment().subtract(30, "days").format("YYYY-MM-DD"),
        dt_fim: moment().format("YYYY-MM-DD"),
      };
      this.media_tickets.series[0].data = [];
      this.media_tickets.series[1].data = [];
      this.media_tickets.analyticsData.thisMonth = 0;
      this.media_tickets.analyticsData.lastMonth = 0;
      return new Promise((resolve) => {
        this.getData( {
            rota: 'whatsapp_respondidos',
            params: datas,
          })
          .then((response) => {
            response.periodo_anterior.forEach((item) => {
              this.media_tickets.analyticsData.lastMonth += item.quantidade;
              this.media_tickets.series[1].data.push(item.quantidade);
            });
            response.periodo_atual.forEach((item) => {
              this.media_tickets.analyticsData.thisMonth += item.quantidade;
              this.media_tickets.series[0].data.push(item.quantidade);
              this.chart_media_options.xaxis.categories.push(item.dia);
            });
            resolve();
          });
      });
    },
  },
};
</script>

<style lang="scss">
@import "node_modules/placeholder-loading/src/scss/placeholder-loading.scss";

[dir] .venda-por-produto .vx-card__header {
  padding-bottom: 1.5rem !important;
}

.main-content-row {
  margin-top: 40vh;
}

.row-top-dashboard {
  width: 102%;
  left: 0;
  top: 60px;
  z-index: 2;
}

.card-top-dashboard {
  background: rgb(147, 68, 196);
  background: linear-gradient(
    90deg,
    rgba(147, 68, 196, 1) 0%,
    rgba(94, 44, 124, 1) 72%
  );
}

/*! rtl:begin:ignore */
#dashboard-analytics {
  .greet-user {
    position: relative;

    .decore-left {
      position: absolute;
      left: 0;
      top: 0;
    }

    .decore-right {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  @media (min-width: 1300px) {
    .main-content-row {
      margin-top: 30vh;
    }
  }

  @media (max-width: 576px) {
    .row-top-dashboard {
      width: 100vw;
      margin: 0 auto;
    }
    .decore-left,
    .decore-right {
      width: 140px;
    }
    .main-content-row {
      margin-top: 45vh;
    }
  }
}

/*! rtl:end:ignore */
</style>
<style scoped>
.scroll-area--data-list-add-new {
  /*/ /height: calc(var(--vh, 1 vh) * 100 - 4.3 rem);*/
  height: calc(var(--vh, 1vh) * 100px - 16px - 45px);
}

::-webkit-scrollbar-track {
  z-index: 5000;
}

/* Handle */
::-webkit-scrollbar-thumb {
  z-index: 5000;
}

[dir] .main-vertical.navbar-sticky .router-content {
  margin: 20.5rem 0 !important;
}
</style>
