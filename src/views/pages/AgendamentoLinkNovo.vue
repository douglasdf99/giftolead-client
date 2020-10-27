<template>

  <div class="h-screen flex w-full bg-agendamento content">
    <vs-row>
      <vs-col vs-offset="2" v-tooltip="'col - 8'" vs-type="flex" vs-justify="center" vs-align="center" vs-w="8">
        <div class="w-1/2 bg-grid-color  vx-col w-full sm:w-1/2 lg:w-1/1 mb-base">
          <div class="vx-card"><!---->
            <div class="vx-card__collapsible-content vs-con-loading__container">
              <div class="vx-card__body center">
                <vs-row>
                  <vs-col vs-offset="2" v-tooltip="'col - 10'" vs-type="flex" vs-justify="center" vs-align="center"
                          vs-w="8">
                    <h3 class="mb-2 text-center">Nos diga qual melhor horario e dia para te ligarmos</h3>
                  </vs-col>
                </vs-row>
                <div class="flex justify-between flex-wrap">
                  <div class="campos">
                    <select id="dia" @change="horasfunc(diaSelecionado)" v-model="diaSelecionado">
                      <option v-for="dia in dias" v-bind:value="dia.diaForm">
                        {{ dia.dia }}
                      </option>
                    </select>

                    <select>
                      <option v-for="hora in horas" v-bind:value="hora">
                        {{ hora }}
                      </option>
                    </select>

                  </div>

                  <button onclick="sendData()" type="button">
                    Enviar
                  </button>

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
      datetime: null,
      leadInfo: this.$route.query,
      enviado: false,
      dias: [],
      horas: [],
      horaInicio: 8,
      horaFim: "19",
      diaSelecionado: 'Hoje'
    }
  },
  created() {
    console.log(this.$route)
    console.log('minDate', moment().format('Y-MM-DD H:mm'))

    if (!moduleAgendamentoLink.isRegistered) {
      this.$store.registerModule('agendamento', moduleAgendamentoLink)
      moduleAgendamentoLink.isRegistered = true
    }
  },
  methods: {
    salvar() {
      this.leadInfo.data_agendamento = this.datetime;
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
      }).catch(erro => console.log(erro))
    },
    datas() {
      let hoje = new Date();
      this.dias.push({dia:this.formatarData(hoje),diaForm:this.formatarDataForm(hoje)})
      let day = hoje;
      for (var i = 0; i < 10; i++) {
        var nextDay = new Date(day);
        nextDay.setDate(day.getDate() + 1);
        if (nextDay.getUTCDay() == 0) {
          nextDay.setDate(day.getDate() + 1);
        } else if (nextDay.getUTCDay() == 6) {
          nextDay.setDate(day.getDate() + 3);
        }
        this.dias.push({dia:this.formatarData(nextDay),diaForm:this.formatarDataForm(nextDay)})
        day = nextDay;
      }
      console.log(this.dias)
    },
    horasfunc() {
      this.horas = [];
      let now = new Date();
      if (this.diaSelecionado == 'Hoje') {
        now = new Date();
      } else if (this.diaSelecionado == 'Amanha') {
        now = new Date();
        now.setDate(now.getDate() + 1);
        now.setHours(0);
      } else {
        now = new Date(this.diaSelecionado);
      }
      let minutes = now.getMinutes();
      let hours = now.getHours();
      if (hours < this.horaInicio) {
        hours = this.horaInicio;
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
        return mesF + "/" + diaF + "/" + anoF;
      }
    },formatarDataForm(data) {

        var data = data,
          dia = data.getDate().toString(),
          diaF = (dia.length == 1) ? '0' + dia : dia,
          mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
          mesF = (mes.length == 1) ? '0' + mes : mes,
          anoF = data.getFullYear();
        return mesF + "/" + diaF + "/" + anoF;

    }


  },
  mounted() {
    this.datas();
    this.horasfunc(new Date());
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

</style>
