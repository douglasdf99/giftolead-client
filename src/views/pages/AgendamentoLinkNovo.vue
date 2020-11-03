<template>
  <div class="h-screen flex w-full bg-agendamento content">
    <vs-row>
      <vs-col vs-offset="2" vs-type="flex" vs-justify="center" v-show="formDisplay"
              vs-align="center" vs-w="8">
        <div class="w-1/2 bg-grid-color  vx-col w-full sm:w-1/2 lg:w-1/1 mb-base">
          <div class="vx-card"><!---->
            <div class="vx-card__collapsible-content vs-con-loading__container">
              <div class="vx-card__body center">
                <vs-row>
                  <vs-col vs-offset="2" vs-type="flex" vs-justify="center" vs-align="center"
                          vs-w="8">
                    <h4 class="mb-2 text-center">Nos diga qual melhor horario e dia para te ligarmos</h4>
                  </vs-col>
                </vs-row>
                <div class="flex justify-between flex-wrap mt-6 ">
                  <div class="campos">
                    <select id="dia" @change="horasfunc(diaSelecionado)" v-model="diaSelecionado">
                      <option v-for="dia in dias" v-bind:value="dia.diaForm">
                        {{ dia.dia }}
                      </option>
                    </select>
                    <select v-model="horaSelecionada">
                      <option v-for="hora in horas" v-bind:value="hora">
                        {{ hora }}
                      </option>
                    </select>
                  </div>
                  <button @click="salvar()" class="my-6" type="button">
                    Enviar
                  </button>
                  <div class="powerby">
                    <h4>Power By</h4>
                    <img src="https://api.saveleads.com.br/images/logo2.svg" alt="save leads logo">
                  </div>
                </div>
              </div>
            </div>
            <div class="vx-card__code-container collapsed" style="max-height: 0px; display: none;">
              <div class="code-content">
                <pre class="language-markup"><code class="language-markup"></code></pre>
              </div>
            </div>
          </div>
        </div>
      </vs-col>
      <vs-col vs-offset="2" vs-type="flex" vs-justify="center" style="" vs-align="center"
              vs-w="8" v-show="sucessDisplay">
        <div class="w-1/2 bg-grid-color  vx-col w-full sm:w-1/2 lg:w-1/1 mb-base">
          <div class="vx-card"><!---->
            <div class="vx-card__collapsible-content vs-con-loading__container">
              <div class="vx-card__body center">
                <vs-row class="mb-10">
                  <vs-col vs-offset="2" vs-type="flex" vs-justify="center" vs-align="center"
                          vs-w="8">
                    <img src="https://d1nc450dx9gaoz.cloudfront.net/widgets/Agendamento/check.svg" height="150">
                  </vs-col>
                </vs-row>
                <vs-row>
                  <vs-col vs-offset="2" vs-type="flex" vs-justify="center" vs-align="center"
                          vs-w="8">
                    <h4 class="mb-10 text-center">Obrigado pelo contato nos te ligaremos no dia {{ diaformated }} ás
                      {{ horaSelecionada }}</h4>
                  </vs-col>
                </vs-row>
                <div class="flex justify-between flex-wrap">
                  <div class="powerby">
                    <h4>Power By</h4>
                    <img src="https://api.saveleads.com.br/images/logo2.svg" alt="save leads logo">
                  </div>
                </div>
              </div>
            </div>
            <div class="vx-card__code-container collapsed" style="max-height: 0px; display: none;">
              <div class="code-content">
                <pre class="language-markup"><code class="language-markup"></code></pre>
              </div>
            </div>
          </div>
        </div>
      </vs-col>
      <vs-col vs-offset="2" vs-type="flex" vs-justify="center" style="" vs-align="center" vs-w="8" v-show="errorDisplay">
        <div class="w-1/2 bg-grid-color  vx-col w-full sm:w-1/2 lg:w-1/1 mb-base">
          <div class="vx-card"><!---->
            <div class="vx-card__collapsible-content vs-con-loading__container">
              <div class="vx-card__body center">
                <vs-row class="mb-10">
                  <vs-col vs-offset="2" vs-type="flex" vs-justify="center" vs-align="center"
                          vs-w="8">
                    <img src="https://d1nc450dx9gaoz.cloudfront.net/widgets/Agendamento/error.svg" height="100">
                  </vs-col>
                </vs-row>
                <vs-row>
                  <vs-col vs-offset="2" vs-type="flex" vs-justify="center" vs-align="center"
                          vs-w="8">
                    <h4 class="mb-10 text-center">Não foi possivel agendar a sua ligação por favor tente novamente mais
                      tarde</h4>
                  </vs-col>
                </vs-row>
                <div class="flex justify-between flex-wrap">
                  <div class="campos">

                  </div>
                  <div class="powerby">
                    <h4>Power By</h4>
                    <img src="https://api.saveleads.com.br/images/logo2.svg" alt="save leads logo">
                  </div>
                </div>
              </div>  <!----></div>
            <div class="vx-card__code-container collapsed" style="max-height: 0px; display: none;">
              <div class="code-content">
                <pre class="language-markup"><code class="language-markup"></code></pre>
              </div>
            </div>
          </div>
        </div>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  import {Portuguese} from 'flatpickr/dist/l10n/pt.js';
  import moduleAgendamentoLink from "../../store/agendamento_link/moduleAgendamentoLink";

  const moment = require('moment/moment');
  require('moment/locale/pt-br');

  export default {
    name: "AgendamentoLinkNovo",
    data() {
      return {
        leadInfo: this.$route.query,
        enviado: false,
        dias: [],
        horas: [],
        horaInicio: 8,
        horaFim: "19",
        diaSelecionado: '',
        horaSelecionada: '',
        sucessDisplay: false,
        formDisplay: true,
        errorDisplay: false,
      }
    },
    created() {
      if (!moduleAgendamentoLink.isRegistered) {
        this.$store.registerModule('agendamento', moduleAgendamentoLink)
        moduleAgendamentoLink.isRegistered = true
      }
    },
    methods: {
      salvar() {
        this.leadInfo.data_agendamento = this.diaSelecionado + ' ' + this.horaSelecionada;
        this.$store.dispatch('agendamento/store', this.leadInfo).then(() => {
          this.enviado = true;
          this.$vs.notify({
            color: 'success',
            title: 'Pronto!',
            text: 'Seu atendimento foi agendado com sucesso! Aguarde até que entremos em contato.',
            iconPack: 'feather',
            icon: 'icon-check',
            time: 120000,
          });
          this.formDisplay = false;
          this.sucessDisplay = true;
        }).catch((erro) => {
          this.formDisplay = false;
          this.errorDisplay = true;
        })
      },
      datas() {
        let hoje = new Date();
        this.dias.push({dia: this.formatarData(hoje), diaForm: this.formatarDataForm(hoje)})
        let day = hoje;
        for (var i = 0; i < 5; i++) {
          var nextDay = new Date(day);
          nextDay.setDate(day.getDate() + 1);
          if (nextDay.getUTCDay() == 0) {
            nextDay.setDate(day.getDate() + 1);
          } else if (nextDay.getUTCDay() == 6) {
            nextDay.setDate(day.getDate() + 3);
          }
          this.dias.push({dia: this.formatarData(nextDay), diaForm: this.formatarDataForm(nextDay)})
          day = nextDay;
        }
      },
      horasfunc(dia) {
        this.horas = [];
        let now = new Date(dia);
        let hoje = new Date();
        let amanha = new Date();
        amanha.setDate(now.getDate() + 1);

        if (this.diaSelecionado == this.formatarDataForm(hoje)) {
          now = new Date();
        } else if (this.diaSelecionado == this.formatarDataForm(amanha)) {
          now = new Date();
          now.setDate(now.getDate() + 1);
          now.setHours(0);
          now.setMinutes(0);

        } else {
          now = new Date(this.diaSelecionado);
          now.setHours(0);
          now.setMinutes(0);
        }
        let minutes = now.getMinutes();
        let hours = now.getHours();
        if (hours < this.horaInicio) {
          hours = this.horaInicio;
          hours = hours - 1;
          minutes = 30;
        }
        let horaAtual = now.getHours() + ':' + now.getMinutes();
        let minutesWile = minutes;
        if (minutes < 30) {
          horaAtual = hours + ':' + 30;
          minutesWile = 30;
        } else {
          hours = hours + 1
          horaAtual = hours + ':00';
          minutesWile = 0;
        }
        if (horaAtual < this.horaInicio) {
          this.horas.push(this.horaInicio);
        } else {
          this.horas.push(horaAtual);
        }
        let horaWhile = hours;
        while (horaWhile < this.horaFim) {
          if (minutesWile < 30) {
            minutesWile = 30;
            this.horas.push(horaWhile + ':' + minutesWile);
          } else {
            minutesWile = '00';
            this.horas.push(horaWhile + 1 + ':' + minutesWile);
          }
          if (minutesWile != 30) {
            horaWhile++;
          }
        }
        this.horaSelecionada = this.horas[0];
      },
      formatarData(data) {
        let hoje = new Date();

        if (data.getDate() == hoje.getDate()) {
          return 'Hoje';
        } else if (data.getDate() == hoje.getDate() + 1) {
          return 'Amanha';
        } else {
          var data = data,
            dia = data.getDate().toString(),
            diaF = (dia.length == 1) ? '0' + dia : dia,
            mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
            mesF = (mes.length == 1) ? '0' + mes : mes,
            anoF = data.getFullYear();
          return diaF + "/" + mesF + "/" + anoF;
        }
      },
      formatarDataForm(data) {
        var data = data,
          dia = data.getDate().toString(),
          diaF = (dia.length == 1) ? '0' + dia : dia,
          mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
          mesF = (mes.length == 1) ? '0' + mes : mes,
          anoF = data.getFullYear();
        return anoF + "-" + mesF + "-" + diaF;
      }
    },
    mounted() {
      this.datas();
      this.diaSelecionado = this.formatarDataForm(new Date())
      this.horasfunc(this.diaSelecionado);
    },
    computed: {
      diaformated: function () {
        let res = this.diaSelecionado.split("-");
        return res[2] + '/' + res[1];
      }
    }
  }
</script>

<style scoped>
  .bg-agendamento {
    background-color: #282a36;
  }

  button {
    background-color: #9344c4;
    color: #fff;
    font-weight: bold;
    font-size: 17px;
    width: 100%;
    height: 45px;
    padding: 5px;
    border-radius: 6px;
    border: 3px solid rgb(224, 224, 224);
    margin-top: 5px;
  }

  select {
    width: 50%;
    height: 45px;
    padding: 5px;
    border-radius: 6px;
    font-size: 14px;
    margin-right: 10px;
    border: 3px solid rgb(224, 224, 224);
  }

  .campos {
    width: 100%;
    display: flex;
    font-family: Maven Pro, Helvetica, sans-serif !important;
  }

  .powerby {
    display: flex;
    justify-content: start;
    align-items: center;
    margin-bottom: 5px;
    opacity: 0.7
  }

  .powerby h4 {
    font-family: system-ui;
    margin-right: 5px;
    font-size: 8px;
    color: #222222;
  }

  .powerby img {
    width: 60px;
  }

  .vx-card {
    max-width: 600px;
  }

</style>
