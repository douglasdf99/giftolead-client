<template>
  <div id="dashboard-analytics">
    <!-- Topo -->
    <div class="vx-row">
      <div class="vx-col w-full mb-base">
        <vx-card slot="no-body" class="greet-user rounded-none bg-white text-black">
          <div class="vx-row">
            <div class="vx-col w-5/12">
              <div class="vx-row items-center">
                <div class="vx-col w-1/4 text-center">
                  <vs-avatar size="80px" :text="userInfo.displayName" class="text-3xl"/>
                </div>
                <div class="vx-col w-3/2">
                  <p class="mb-1">{{ userInfo.email }}</p>
                  <p class="mb-1 text-3xl font-light">
                    {{ userInfo.displayName }}
                  </p>
                  <p class="mb-0 text-lg">
                    {{ userInfo.userRole }}
                  </p>
                </div>
              </div>
            </div>
            <div class="vx-col w-7/12" v-if="user.conquistas.length > 0">
              <p class="text-white mb-3">Consquistas</p>
              <div class="flex">
                <div v-for="conq in user.conquistas" :key="conq.id">
                  <vx-tooltip position="top" :text="conq.conquista.nome">
                    <img :src="get_img_cdn(conq.conquista.imagem)" class="rounded-full mx-3" width="40"/>
                  </vx-tooltip>
                </div>
              </div>
            </div>
          </div>
        </vx-card>
      </div>
    </div>
    <div class="vx-row">
      <div class="vx-col w-full md:w-1/3 mb-base">
        <div class="vx-row">
          <!-- Meus Tickets -->
          <div class="vx-col w-full mb-base">
            <place-holder-loading-dashboard
              tipo="meus_tickets"
              v-if="meus_tickets.analyticsData.length == 0"
            />
            <vx-card
              v-else
              :title="
                'Meus tickets ' +
                (tipo_meus_tickets == 'atendimento' ? 'atendidos' : 'inseridos')
              "
            >
              <!-- CARD ACTION -->
              <template slot="actions">
                <vs-dropdown vs-trigger-click class="cursor-pointer">
                  <feather-icon
                    icon="SettingsIcon"
                    svgClasses="w-6 h-6 text-grey mr-4"
                  ></feather-icon>
                  <vs-dropdown-menu class="w-32">
                    <vs-dropdown-item @click="tipo_meus_tickets = 'atendimento'"
                      >Atendidos
                    </vs-dropdown-item>
                    <vs-dropdown-item @click="tipo_meus_tickets = 'inseridor'"
                      >Inseridos
                    </vs-dropdown-item>
                  </vs-dropdown-menu>
                </vs-dropdown>
                <change-date-dashboard
                  @changeDate="getMeusTickets"
                ></change-date-dashboard>
              </template>

              <!-- Chart -->
              <div slot="no-body">
                <vue-apex-charts
                  type="radialBar"
                  height="420"
                  :options="chart_options"
                  :series="meus_tickets.series"
                />
              </div>
              <ul>
                <li
                  v-for="orderData in meus_tickets.analyticsData"
                  :key="orderData.orderType"
                  class="flex mb-3 justify-between"
                >
                  <span class="flex items-center">
                    <span
                      class="
                        inline-block
                        h-4
                        w-4
                        rounded-full
                        mr-2
                        bg-white
                        border-3 border-solid
                      "
                      :class="`border-${orderData.color}`"
                    ></span>
                    <span class="font-semibold">{{ orderData.orderType }}</span>
                  </span>
                  <span>{{ orderData.counts }}</span>
                </li>
              </ul>
            </vx-card>
          </div>
        </div>
      </div>
      <div
        class="vx-col w-full md:w-1/3 mb-base"
        style="max-height: calc(var(--vh) * 90); overflow-y: auto"
      >
        <VuePerfectScrollbar class="scroll-area--data-list-add-new">
          <vx-card
            v-for="(item, index) in ultimos_tickets"
            class="mb-base"
            :key="index"
            v-show="
              ultimos_tickets_pesquisados && ultimos_tickets.length > 0 && item
            "
            style="width: 96%"
          >
            <div class="vx-row mb-4">
              <div class="vx-col w-3/12">
                <p class="text-lg mb-3">#{{ item.id }}</p>
                <div class="flex items-center text-center">
                  <vx-tooltip
                    position="top"
                    :text="
                      'Responsável | ' +
                      nameCauser(item.responsavel, item.responsavel_type)
                    "
                    v-if="item.responsavel != null"
                  >
                    <img
                      src="@/assets/images/util/checkout.svg"
                      width="40px"
                      class="rounded-full agente"
                      v-if="
                        item.responsavel_type == 'App\\Models\\CampanhaCarrinho'
                      "
                    />
                    <img
                      src="@/assets/images/util/boleto.svg"
                      width="40px"
                      class="rounded-full agente"
                      v-else-if="
                        item.responsavel_type == 'App\\Models\\CampanhaBoleto'
                      "
                    />
                    <img
                      src="@/assets/images/util/whatsapp.svg"
                      width="40px"
                      class="rounded-full agente"
                      v-else-if="
                        item.responsavel_type == 'App\\Models\\CampanhaWhatsapp'
                      "
                    />
                    <img
                      src="@/assets/images/util/whatsapp.svg"
                      width="40px"
                      class="rounded-full agente"
                      v-else-if="
                        item.responsavel_type == 'App\\Models\\Whatsapplist'
                      "
                    />
                    <img
                      src="@/assets/images/util/agendamento.svg"
                      width="40px"
                      class="rounded-full agente"
                      v-else-if="item.responsavel_type == 'App\\Models\\CampanhaAgendamento'"
                    />
                    <img
                      src="@/assets/images/util/cancelado.svg"
                      width="40px"
                      class="rounded-full agente"
                      v-else-if="
                        item.responsavel_type ==
                        'App\\Models\\CampanhaCancelado'
                      "
                    />
                    <vs-avatar
                      v-else
                      color="primary"
                      size="40px"
                      :text="item.ultima_acao.causer.name"
                    />
                  </vx-tooltip>
                  <vx-tooltip
                    v-if="item.ultima_acao"
                    position="top"
                    :text="
                      'Última Ação | ' + nameCauser(item.ultima_acao || null)
                    "
                    style="margin-left: -15px"
                    class="img-criador"
                  >
                    <img
                      src="@/assets/images/util/checkout.svg"
                      width="40px"
                      class="ml-2 rounded-full agente"
                      v-if="
                        item.ultima_acao.causer_type ==
                        'App\\Models\\CampanhaCarrinho'
                      "
                    />
                    <img
                      src="@/assets/images/util/boleto.svg"
                      width="40px"
                      class="ml-2 rounded-full agente"
                      v-else-if="
                        item.ultima_acao.causer_type ==
                        'App\\Models\\CampanhaBoleto'
                      "
                    />
                    <img
                      src="@/assets/images/util/whatsapp.svg"
                      width="40px"
                      class="ml-2 rounded-full agente"
                      v-else-if="
                        item.ultima_acao.causer_type ==
                        'App\\Models\\CampanhaWhatsapp'
                      "
                    />
                    <img
                      src="@/assets/images/util/whatsapp.svg"
                      width="40px"
                      class="ml-2 rounded-full agente"
                      v-else-if="
                        item.ultima_acao.causer_type ==
                        'App\\Models\\Whatsapplist'
                      "
                    />
                    <img
                      src="@/assets/images/util/agendamento.svg"
                      width="40px"
                      class="ml-2 rounded-full agente"
                      v-else-if="
                        item.ultima_acao.causer_type ==
                        'App\\Models\\CampanhaAgendamento'
                      "
                    />
                    <img
                      src="@/assets/images/util/cancelado.svg"
                      width="40px"
                      class="ml-2 rounded-full agente"
                      v-else-if="
                        item.ultima_acao.causer_type ==
                        'App\\Models\\CampanhaCancelado'
                      "
                    />
                    <vs-avatar
                      v-else
                      color="primary"
                      size="40px"
                      :text="item.ultima_acao.causer.name"
                    />
                  </vx-tooltip>
                </div>
              </div>
              <div
                class="
                  vx-col
                  w-7/12
                  text-center
                  flex flex-col
                  items-center
                  justify-center
                "
              >
                <p class="font-bold">{{ item.lead.nome }}</p>
                <vs-chip
                  color="primary"
                  class="text-white font-bold p-2 pr-4 mt-1 mx-auto"
                >
                  {{ item.produto.nome }}
                </vs-chip>
              </div>
              <div class="vx-col w-2/12">
                <p class="mb-3 text-center">
                  <vs-icon
                    icon-pack="material-icons"
                    icon="fiber_manual_record"
                    class="icon-grande mx-auto"
                    :class="`text-${
                      item.status == 0 || item.status == 3
                        ? 'success'
                        : item.status == 1
                        ? 'warning'
                        : 'dark'
                    }`"
                  ></vs-icon>
                </p>
              </div>
            </div>
            <div
              class="vx-row p-2"
              v-if="item.ultima_acao"
              style="background-color: #f4f4f4"
            >
              <div class="vx-col w-full">
                <p class="text-sm">
                  {{ elapsedTime(item.ultima_acao.created_at) }}
                </p>
                <p class="text-lg">
                  {{ item.ultima_acao.description }}
                </p>
              </div>
            </div>
          </vx-card>
          <place-holder-loading-dashboard
            tipo="ultimos_tickets"
            v-if="!ultimos_tickets_pesquisados"
          />

          <vx-card
            class="mb-base"
            v-if="ultimos_tickets.length == 0 && ultimos_tickets_pesquisados"
          >
            <p>Últimos Tickets em que você participou</p>
            <nenhum-registro
              :add="false"
              module="Dashboard"
              img-width="100px"
              img-height="100px"
            />
          </vx-card>

          <div
            class="text-center"
            v-if="
              this.paginationUltimos &&
              this.paginationUltimos.current_page <
                this.paginationUltimos.last_page
            "
          >
            <p
              class="font-bold text-primary text-lg cursor-pointer"
              @click="loadMoreTicket"
            >
              Carregar mais...
            </p>
          </div>
        </VuePerfectScrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import VuePerfectScrollbar from "vue-perfect-scrollbar";
import VueApexCharts from "vue-apexcharts";
import StatisticsCardLine from "@/components/statistics-cards/StatisticsCardLine.vue";
import ChangeTimeDurationDropdown from "@/components/ChangeTimeDurationDropdown.vue";
import VxTimeline from "@/components/timeline/VxTimeline";
import ChangeDateDashboard from "@/views/components/ChangeDateDashboard";
import PlaceHolderLoadingDashboard from "@/views/components/PlaceHolderLoadingDashboard";
import MediaMensalTickets from "@/views/dashboard/TicketsMediaMensal";
import WhatsapplistMediaMensal from "@/views/dashboard/WhatsapplistMediaMensal";

const moment = require("moment/moment");
require("moment/locale/pt-br");

export default {
  data() {
    return {
      user: {
        conquistas: [],
      },
      conquistas: [],

      //Venda por Produto
      por_produto: [],
      produtos: [],
      por_produto_pesquisado: false,

      //Meus tickets
      meus_tickets: {
        analyticsData: [],
        series: [],
      },
      chart_options: {
        labels: ["Perdeu", "Aguardando", "Ganhou"],
        plotOptions: {
          radialBar: {
            size: 165,
            offsetY: -5,
            hollow: {
              size: "20%",
            },
            track: {
              background: "#ebebeb",
              strokeWidth: "100%",
              margin: 15,
            },
            dataLabels: {
              show: true,
              name: {
                fontSize: "18px",
              },
              value: {
                fontSize: "16px",
                color: "#636a71",
                offsetY: 11,
              },
              total: {
                show: true,
                label: "Total",
                formatter: this.somaTickets,
              },
            },
          },
        },
        responsive: [
          {
            breakpoint: 576,
            options: {
              plotOptions: {
                radialBar: {
                  size: 150,
                  hollow: {
                    size: "20%",
                  },
                  track: {
                    background: "#ebebeb",
                    strokeWidth: "100%",
                    margin: 15,
                  },
                },
              },
            },
          },
        ],
        colors: ["#EA5455", "#FF9F43", "#4DE98A"],
        fill: {
          type: "gradient",
          gradient: {
            // enabled: true,
            shade: "dark",
            type: "vertical",
            shadeIntensity: 0.5,
            gradientToColors: ["#f29292", "#FFC085", "#65dd91"],
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        stroke: {
          lineCap: "round",
        },
        chart: {
          height: 355,
          dropShadow: {
            enabled: true,
            blur: 3,
            left: 1,
            top: 1,
            opacity: 0.1,
          },
        },
      },
      tipo_meus_tickets: "atendimento",
      datas_tipo_meus_tickets: {
        dt_inicio: moment().subtract(7, "days").format("YYYY-MM-DD"),
        dt_fim: moment().format("YYYY-MM-DD"),
      },

      //Últimos Tickets
      ultimos_tickets: [],
      ultimos_tickets_pesquisados: false,
      paginationUltimos: null,

      //Quantidades
      qtdWhats: null,
      qtdAtrasados: null,
    };
  },
  components: {
    WhatsapplistMediaMensal,
    MediaMensalTickets,
    VueApexCharts,
    VuePerfectScrollbar,
    StatisticsCardLine,
    ChangeTimeDurationDropdown,
    VxTimeline,
    ChangeDateDashboard,
    PlaceHolderLoadingDashboard,
  },
  computed: {
    ...mapGetters({
      userInfo:'AppActiveUser'
    }),
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      getData: 'dashboard/getData',
    }),
    async init() {
      await this.getMeusTickets();
      await this.getUltimosTickets();
    },
    nameCauser(obj, responsavel_type = null) {
      if (obj && obj.causer_type) {
        switch (obj.causer_type) {
          case "App\\Models\\User":
            return obj.causer.name;
          default:
            return obj.causer.nome;
        }
      } else if (responsavel_type) {
        switch (responsavel_type) {
          case "App\\Models\\User":
            return obj.name;
          default:
            return obj.nome;
        }
      }
    },
    getMeusTickets(datas = null) {
      if (datas == null) datas = this.datas_tipo_meus_tickets;
      else this.datas_tipo_meus_tickets = datas;

      return new Promise((resolve) => {
        this.getData( {
            rota: "meus_tickets",
            params: { ...datas, type: this.tipo_meus_tickets },
          })
          .then((response) => {
            let soma = 0;
            this.meus_tickets = {
              analyticsData: [],
              series: [],
            };
            if (this.tipo_meus_tickets == "atendimento") {
              this.chart_options.colors[0] = "#EA5455";
              this.chart_options.fill.gradient.gradientToColors[0] = "#f29292";
              this.chart_options.labels = ["Perdeu", "Aguardando", "Ganhou"];

              soma =
                response.tickets_aguardando +
                response.tickets_ganhou +
                response.tickets_perdeu;
              this.meus_tickets.analyticsData.push({
                color: "danger",
                counts: response.tickets_perdeu,
                orderType: "Perdeu",
              });
              this.meus_tickets.analyticsData.push({
                color: "warning",
                counts: response.tickets_aguardando,
                orderType: "Aguardando",
              });
              this.meus_tickets.analyticsData.push({
                color: "success",
                counts: response.tickets_ganhou,
                orderType: "Ganhou",
              });

              this.meus_tickets.series.push(
                ((response.tickets_perdeu * 100) / soma).toFixed(2)
              );
              this.meus_tickets.series.push(
                ((response.tickets_aguardando * 100) / soma).toFixed(2)
              );
              this.meus_tickets.series.push(
                ((response.tickets_ganhou * 100) / soma).toFixed(2)
              );
            } else {
              this.chart_options.colors[0] = "#0c0c0c";
              this.chart_options.fill.gradient.gradientToColors[0] = "#353434";
              this.chart_options.labels = [
                "Finalizadas",
                "Pendentes",
                "Abertas",
              ];

              soma =
                response.tickets_pendentes +
                response.tickets_abertos +
                response.tickets_finalizados;
              this.meus_tickets.analyticsData.push({
                color: "dark",
                counts: response.tickets_finalizados,
                orderType: "Finalizados",
              });
              this.meus_tickets.analyticsData.push({
                color: "warning",
                counts: response.tickets_pendentes,
                orderType: "Pendentes",
              });
              this.meus_tickets.analyticsData.push({
                color: "success",
                counts: response.tickets_abertos,
                orderType: "Abertos",
              });

              this.meus_tickets.series.push(
                ((response.tickets_finalizados * 100) / soma).toFixed(2)
              );
              this.meus_tickets.series.push(
                ((response.tickets_pendentes * 100) / soma).toFixed(2)
              );
              this.meus_tickets.series.push(
                ((response.tickets_abertos * 100) / soma).toFixed(2)
              );
            }
            resolve();
          });
      });
    },
    getTicketsAtrasados() {
      return new Promise((resolve) => {
        this.getData( {
            rota: "tickets_atrasados",
            params: {},
          })
          .then((response) => {
            this.qtdAtrasados = response;
            resolve();
          });
      });
    },
    getWhatsList() {
      return new Promise((resolve) => {
        this.getData( {
            rota: "whatsapplist_respondidos",
            params: {},
          })
          .then((response) => {
            this.qtdWhats = response;
            resolve();
          });
      });
    },
    getUltimosTickets(page = 1) {
      this.ultimos_tickets_pesquisados = false;
      return new Promise((resolve) => {
        this.getData( {
            rota: "meus_tickets_atividades",
            params: { page: page, lenght: 4 },
          })
          .then((response) => {
            this.ultimos_tickets = response.data;
            this.paginationUltimos = response;
            this.ultimos_tickets_pesquisados = true;
            resolve();
          });
      });
    },
    somaTickets() {
      let soma = 0;
      this.meus_tickets.analyticsData.forEach((item) => {
        soma += item.counts;
      });
      return soma;
    },
    loadMoreTicket() {
      if (
        this.paginationUltimos.current_page < this.paginationUltimos.last_page
      ) {
        let page = this.paginationUltimos.current_page + 1;
        this.getData( {
            rota: "meus_tickets_atividades",
            params: { page: page },
          })
          .then((response) => {
            response.data.forEach((item) => {
              this.ultimos_tickets.push(item);
            });
            this.paginationUltimos = response;
            this.ultimos_tickets_pesquisados = true;
          });
      }
    },
  },
  watch: {
    tipo_meus_tickets() {
      this.getMeusTickets(this.datas_tipo_meus_tickets);
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
