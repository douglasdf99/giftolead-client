<template>
  <div>
    <div class="vx-row">
      <div class="vx-col w-full lg:w-3/12 relative" style="height: 100%;">
        <div class="rounded-t-lg bg-dark" style="height: 100px;"></div>
        <img src="@/assets/images/util/zenvia.svg" width="50%" class="absolute"
             v-bind:style="{top: instalado ? '10%' : '20%'}" style="border-radius: 10px;left: 25%;">
        <div class="rounded-b-lg text-center" style="background-color: #E8EBF2">
          <p class="pt-20 font-bold text-black">Zenvia</p>
          <p class="my-2">Faça ligações de dentro do Saveleads e as mantenha registradas na linha do tempo de seus
            contatos!</p>
          <vs-button color="dark" class="my-5 w-10/12" @click="instalar" v-if="$acl.check('extensao_zenvia_install')">
            {{ instalado ? 'Desinstalar' : 'Instalar' }}
          </vs-button>
          <vs-button color="primary" target :href="{url: link_recarga}" class="mb-5 w-10/12" v-if="instalado"
                     :disabled="!$acl.check('extensao_zenvia_recarregar')">Recarregar
          </vs-button>
        </div>
        <div class="w-full" v-if="extensao != null">
          <statistics-card-line hideChart class="mt-3" icon="DollarSignIcon" icon-right :statistic="'R$ '+saldo"
                                statisticTitle="Saldo" color="success"/>
          <statistics-card-line hideChart class="mt-3" icon="DollarSignIcon" icon-right :statistic="custo"
                                statisticTitle="Total de recargas" color="success"/>
        </div>
      </div>
      <div class="vx-col w-full lg:w-9/12">
        <div class="vx-row mb-5">
          <div class="vx-col w-full" v-if="extensao != null">
            <vs-switch vs-icon-on="check" v-model="extensao.ativo" color="#0FB599" class="float-right switch"
                       @click="ativaExtensao" v-if="$acl.check('extensao_zenvia_ativar')"/>
            <span class="float-right mt-1 mx-4"
                  style="font-weight: bold">{{ extensao.ativo ? 'Ativado' : 'Desativado' }}</span>
          </div>
        </div>
        <div class="vx-row">
          <div class="vx-col w-full mb-4">
            <div class="p-5 rounded-lg bg-white">
              <p>
                Durante um bom tempo nós pesquisamos a melhor ferramenta para fazer ligações para integrar ao Saveleads
                e encontramos na Zenvia a qualidade e confiança que buscávamos.
                A nossa parceria com eles torna possível fazer chamadas direto do Saveleads e ter essas conversas salvas
                na linha do tempo para ouvir a qualquer momento. Habilite a integração e ganhe R$
                30,00 para
                testar!
              </p>
            </div>
          </div>
          <div class="vx-col w-full" v-if="extensao != null">
            <vs-tabs color="primary">
              <vs-tab color="primary" value="10" :label="'histórico de chamadas (' + historico.length + ')'"
                      v-if="historico">
                <div class="vx-row flex items-end">
                  <div class="vx-col w-full lg:w-5/12">
                    <p>Resultado considerando o período: <span class="destaque">{{ dateRange.startDate | formatDate }} a {{ dateRange.endDate | formatDate }}</span>
                    </p>
                  </div>
                  <div class="vx-col w-full relative lg:w-7/12 sm:w-1/2 flex justify-end">
                    <vs-button color="black" type="flat" @click="setDate('hoje')" class="btn-periodo">Hoje</vs-button>
                    <vs-button color="black" type="flat" @click="setDate('7')" class="btn-periodo">7 Dias</vs-button>
                    <vs-button color="black" type="flat" @click="setDate('15')" class="btn-periodo">15 Dias</vs-button>
                    <vs-button color="black" type="flat" @click="setDate('30')" class="btn-periodo">30 Dias</vs-button>
                    <date-range-picker ref="picker" opens="left" :locale-data="localeData" :singleDatePicker="false"
                                       :timePicker="false" :showWeekNumbers="false" :showDropdowns="true"
                                       :autoApply="true"
                                       v-model="dateRange" :linkedCalendars="true" :close-on-esc="true"
                                       :append-to-body="true" :ranges="ranges">
                    </date-range-picker>
                  </div>
                </div>
                <vs-row>
                  <vs-col vs-w="12">
                    <div class="vx-row mt-20 flex justify-center" v-if="historico.length === 0">
                      <div class="w-full lg:w-8/12 xlg:w-8/12 s:w-full sem-item">
                        <div class="w-8/12">
                          <div>
                            <p class="span-sem-item">Nenhuma chamada encontrada</p>
                          </div>
                          <br>
                        </div>
                      </div>
                    </div>
                    <div class="com-item" v-else>
                      <vs-table :data="historico" class="table-items">

                        <template slot="thead">
                          <!--<vs-th></vs-th>-->
                          <vs-th>Status</vs-th>
                          <vs-th>ID</vs-th>
                          <vs-th>Data e Hora</vs-th>
                          <vs-th>Valor Cobrado</vs-th>
                          <vs-th>Origem</vs-th>
                        </template>

                        <template slot-scope="{data}">
                          <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="mb-3">
                            <vs-td>
                              <vs-chip v-for="(status, index) in zenviaStatus" v-if="index === tr.status_geral"
                                       :color="status[1]" class="product-order-status">
                                {{ status[0] }}
                              </vs-chip>
                            </vs-td>
                            <vs-td :data="tr.id">
                              {{ tr.id }}
                            </vs-td>
                            <vs-td :data="tr.data_criacao">
                              <span class="destaque">{{ tr.data_criacao | formatDateTime }}</span>
                            </vs-td>
                            <vs-td>
                              <span class="preco">R$ {{ formatPrice((tr.destino.preco + tr.origem.preco)) }}</span>
                            </vs-td>
                            <vs-td>
                              {{ tr.origem.tipo == 'ramal' ? 'Interno' : 'Default' }}
                            </vs-td>
                          </vs-tr>
                        </template>
                      </vs-table>
                      <vs-pagination class="mt-2" :total="pagination.total" v-model="currentx"></vs-pagination>
                    </div>
                  </vs-col>
                </vs-row>
              </vs-tab>
              <vs-tab color="primary" value="10" :label="'histórico de recargas (' + recargas.length + ')'"
                      v-if="recargas">
                <vs-row>
                  <vs-col vs-w="12">
                    <div class="vx-row mt-20 flex justify-center" v-if="recargas.length === 0">
                      <div class="w-full lg:w-8/12 xlg:w-8/12 s:w-full sem-item">
                        <div class="w-8/12">
                          <div>
                            <p class="span-sem-item">Nenhuma recarga encontrada</p>
                          </div>
                          <br>
                        </div>
                      </div>
                    </div>
                    <div class="com-item" v-else>
                      <vs-table :data="recargas" class="table-items">

                        <template slot="thead">
                          <!--<vs-th></vs-th>-->
                          <vs-th>ID</vs-th>
                          <vs-th>Valor Recarga</vs-th>
                          <vs-th>Data e Hora</vs-th>
                          <vs-th>Descrição</vs-th>
                        </template>

                        <template slot-scope="{data}">
                          <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="mb-3">
                            <vs-td :data="tr.id">
                              {{ tr.id }}
                            </vs-td>
                            <vs-td>
                              <span class="preco">R$ {{ formatPrice(tr.credito) }}</span>
                            </vs-td>
                            <vs-td :data="tr.data">
                              <span class="destaque">{{ tr.data | formatDateTime }}</span>
                            </vs-td>
                            <vs-td>
                              {{ tr.descricao }}
                            </vs-td>
                          </vs-tr>
                        </template>
                      </vs-table>
                    </div>
                  </vs-col>
                </vs-row>
              </vs-tab>
              <vs-tab color="primary" value="10" :label="'ramais (' + ramais.length + ')'" v-if="ramais">
                <div class="vx-row" v-if="$acl.check('extensao_zenvia_ramal')">
                  <div class="vx-col w-full">
                    <vs-button color="primary" class="float-right" @click="addRamal">Adicionar Ramal</vs-button>
                  </div>
                </div>
                <vs-row>
                  <vs-col vs-w="12">
                    <div class="com-item">
                      <vs-table :data="ramais" class="table-items">

                        <template slot="thead">
                          <vs-th>Ramal</vs-th>
                          <vs-th>Login</vs-th>
                          <vs-th>Usuario</vs-th>
                          <vs-th>Ações</vs-th>
                        </template>

                        <template slot-scope="{data}">
                          <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="mb-3">
                            <vs-td>{{ tr.ramal }}</vs-td>
                            <vs-td>{{ tr.login }}</vs-td>
                            <vs-td v-if="showUser(tr.ramal)">
                              <div class="avatar-list"
                                   v-bind:style="{backgroundImage: 'url(' + get_img_api(showUser(tr.ramal)) + ')'}"></div>
                            </vs-td>
                            <vs-td v-else>
                              <vs-chip>Nenhum usuario vinculado</vs-chip>
                            </vs-td>
                            <vs-td>
                              <vs-dropdown vs-trigger-click v-if="$acl.check('extensao_zenvia_ramal_vincular')">
                                <vs-button radius color="#EDEDED" type="filled"
                                           class="btn-more-icon relative botao-menu"
                                           icon-pack="material-icons" icon="more_horiz"
                                ></vs-button>
                                <vs-dropdown-menu class="dropdown-menu-list dropdown-usuario">
                                  <span class="span-identifica-item-dropdown">Nº {{ tr.id }}</span>
                                  <vs-dropdown-item @click="editRamal(tr)">
                                    <vs-icon icon-pack="material-icons" icon="create"></vs-icon>
                                    Editar
                                  </vs-dropdown-item>

                                  <vs-dropdown-item @click="deletar(data[indextr].id, getUserId(tr.ramal))">
                                    <vs-icon icon-pack="material-icons" icon="delete"></vs-icon>
                                    Deletar
                                  </vs-dropdown-item>

                                </vs-dropdown-menu>
                              </vs-dropdown>
                            </vs-td>
                          </vs-tr>
                        </template>
                      </vs-table>
                    </div>
                  </vs-col>
                </vs-row>
              </vs-tab>
            </vs-tabs>
          </div>
        </div>
      </div>
    </div>
    <vs-prompt
      @cancel="val = { ramal : ''}" @accept="storeRamal" @close="modalramal = false" :acceptText="'Salvar'"
      :cancelText="'Cancelar'" title="Selecionar link"
      :max-width="'600px'" :active.sync="modalramal" :isValid="(selectedUser.id != null && val.ramal.length == 4)">
      <div class="con-exemple-prompt">
        <div class="mt-3 w-full">
          <span class="font-regular mb-2">Ramal</span>
          <vs-input sizy="large" class="bg-white w-full" @keypress="isNumber" v-model="val.ramal" v-mask="'####'"/>
        </div>
        <div class="mt-3 w-full">
          <span class="font-regular mb-2">Responsável</span>
          <v-select v-model="selectedUser" class="mb-2" :class="'select-large-base'" :clearable="false"
                    :options="users" v-validate="'required'" name="tipo"/>
        </div>
      </div>
    </vs-prompt>
    <vs-prompt
      @cancel="val = { ramal : ''}" @accept="updateRamal" @close="modalramaledit = false" :acceptText="'Salvar'"
      :cancelText="'Cancelar'" title="Selecionar link"
      :max-width="'600px'" :active.sync="modalramaledit" :isValid="(selectedUser.id != null && val.ramal.length == 4)">
      <div class="con-exemple-prompt">
        <div class="mt-3 w-full">
          <span class="font-regular mb-2">Ramal</span>
          <vs-input sizy="large" class="bg-white w-full" @keypress="isNumber" v-model="val.ramal" v-mask="'####'"/>
        </div>
        <div class="mt-3 w-full">
          <span class="font-regular mb-2">Responsável</span>
          <v-select v-model="selectedUser" class="mb-2" :class="'select-large-base'" :clearable="false"
                    :options="users" v-validate="'required'" name="tipo"/>
        </div>
        <div class="mt-3 w-full"  v-show="!val.bina_inteligente">
          <span class="font-regular mb-2">Bina</span>
          <vs-input :disabled="val.bina_inteligente" sizy="large" class="bg-white w-full" @keypress="isNumber" v-model="val.bina"
                    v-mask="'(##) #####-####'"/>

          <span class="text-secondary text-sm"
                v-show="!val.bina">Ao gravar um numero como bina ele ficara gravado a esse ramal, até que seja trocado por outro ou até que a opcção de bina inteligente seja ativada, não permitindo voltar ao estado original de nenhum numero gravado</span>
        </div>
        <span class="text-secondary text-sm"
              v-show="val.bina_inteligente">Com a bina inteligente ativada a opção de bina ficara desativada</span>
        <div class="vx-row">
          <div class="mt-3 lg:w-6/12 sm:w-12/12">
            <span class="font-regular mb-2 ml-4">Ligações Por celular</span>

            <vs-switch class="ml-4" v-model="val.ligacao_celular" vs-value="ligacao_celular">
              <span slot="on">Ativo</span>
              <span slot="off">Inativo</span>
            </vs-switch>
          </div>
          <div class="mt-3 lg:w-6/12 sm:w-12/12">
            <span class="font-regular mb-2 ml-4">Ligações externas</span>

            <vs-switch class="ml-4" v-model="val.ligacao_externa" vs-value="ligacao_externa">
              <span slot="on">Ativo</span>
              <span slot="off">Inativo</span>
            </vs-switch>
          </div>
        </div>
        <div class="vx-row">
          <div class="mt-3 lg:w-6/12 sm:w-12/12">
            <span class="font-regular mb-2 ml-4">Gravar audio</span>

            <vs-switch class="ml-4" v-model="val.gravar_audio" vs-value="gravar_audio">
              <span slot="on">Ativo</span>
              <span slot="off">Inativo</span>
            </vs-switch>
          </div>
          <div class="mt-3 lg:w-6/12 sm:w-12/12">
            <span class="font-regular mb-2 ml-4">Bina inteligente</span>

            <vs-switch class="ml-4" v-model="val.bina_inteligente" vs-value="bina_inteligente">
              <span slot="on">Ativo</span>
              <span slot="off">Inativo</span>
            </vs-switch>
          </div>
        </div>


      </div>
    </vs-prompt>
  </div>
</template>

<script>
import moduleExtensoes from "../../../store/extensoes/moduleExtensoes";
import Datepicker from 'vuejs-datepicker';
import * as lang from 'vuejs-datepicker/src/locale';
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue';
import vSelect from 'vue-select'
import moduleUsuario from "../../../store/usuarios/moduleUsuario";

const moment = require('moment/moment');
require('moment/locale/pt-br');

export default {
  name: "TotalVoice",
  components: {
    Datepicker, StatisticsCardLine,
    moment, 'v-select': vSelect,
    DateRangePicker
  },
  data() {
    return {
      status: false,
      dateRange: {},
      localeData: {
        direction: 'ltr',
        format: 'dd/mm/yyyy',
        separator: ' - ',
        applyLabel: 'Aplicar',
        cancelLabel: 'Cancelar',
        weekLabel: 'M',
        customRangeLabel: 'Período',
        daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        monthNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        firstDay: 0,
        startDate: '05/26/2020',
        endDate: '05/26/2020',
      },
      ranges: {
        //Definindo ranges padronizados
        'Hoje': [this.getDay(true), this.getDay(true)],
        'Ontem': [this.getDay(false), this.getDay(false)],
        'Este mês': [new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth(), 1), new Date(this.getDay(true))],
        'Este ano': [new Date(this.getDay(true).getFullYear(), 0, 1), new Date(this.getDay(true))],
        'Último mês': [new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth() - 1, 1), new Date(this.getDay(true).getFullYear(), this.getDay(true).getMonth(), 0)],
      },
      languages: lang,
      dados: {
        dt_inicio: '',
        dt_fim: '',
        subdomain: 'app',
        type: 'App\\Models\\Extensoes\\Totalvoice',
        page: 1
      },
      pagination: {
        last_page: 1,
        page: 1,
        current_page: 1,
        total: 0
      },
      extensao: null,
      currentx: 1,
      instalado: false,
      historico: [],
      recargas: [],
      ramais: [],
      saldo: 0,
      custo: 0,
      link_recarga: '',
      zenviaStatus: {
        finalizada: ['Finalizada', '#2ecc71'],
        billet_printed: ['Boleto Impresso', '#848a91'],
        delayed: ['Atrasado', '#e74c3c'],
      },
      countSwitch: 0,

      //Modal Criar Ramal
      modalramal: false,
      modalramaledit: false,
      val: {
        ramal: '',
        bina: '',
        ligacao_celular: '',
        gravar_audio: '',
        bina_inteligente: '',
        ligacao_externa: ''
      },
      selectedUser: {id: null, label: 'Selecione o responsável pelo ramal'},
      usersall: []
    }
  },
  created() {
    if (!moduleExtensoes.isRegistered) {
      this.$store.registerModule('extensoes', moduleExtensoes)
      moduleExtensoes.isRegistered = true
    }

    if (!moduleUsuario.isRegistered) {
      this.$store.registerModule('users', moduleUsuario)
      moduleUsuario.isRegistered = true
    }

    this.dados.dt_inicio = moment().subtract(1, 'days').format('YYYY-MM-DD');
    this.dados.dt_fim = moment().format('YYYY-MM-DD');
    this.dateRange.startDate = moment().subtract(1, 'days')
    this.dateRange.endDate = moment();
    this.verifica();
  },
  computed: {
    users() {
      let users = [];
      this.usersall.forEach(val => {
        if (val.ramal == null)
          users.push({id: val.id, label: val.name});
      });
      return users;
    }
  },
  methods: {
    showUser(ramal) {
      let avatar = false;
      this.usersall.forEach(val => {
        if (val.ramal == ramal)
          avatar = val.avatar
      });
      console.log('avatar', avatar);
      return avatar
    },
    getUserId(ramal) {
      let id = '';
      this.usersall.forEach(val => {
        if (val.ramal == ramal)
          id = val.id;
      });
      return id
    },
    verifica() {
      this.dados.subdomain = window.location.host.split('.')[1] ? window.location.host.split('.')[0] : 'app';
      this.$store.dispatch('extensoes/get', this.dados.subdomain).then(response => {
        let arr = response.extensoes;
        if (arr.length > 0) {
          arr.forEach(item => {
            if (item.extensao_type === "App\\Models\\Extensoes\\Totalvoice") {
              this.getHistorico();
            }
          });
        } else {
          this.$vs.loading.close();
        }
      });
    },
    getHistorico() {
      this.$vs.loading();
      if (this.dateRange.startDate)
        this.dados.dt_inicio = moment(this.dateRange.startDate).format('YYYY-MM-DD');
      if (this.dateRange.endDate)
        this.dados.dt_fim = moment(this.dateRange.endDate).format('YYYY-MM-DD');
      this.$store.dispatch('extensoes/getZenviaHistorico', this.dados).then(response => {
        if (response.chamadas.dados.relatorio.length > 0)
          this.historico = [...response.chamadas.dados.relatorio]; //Histórico de chamadas
        if (response.recarga.dados.relatorio != null)
          this.recargas = [...response.recarga.dados.relatorio]; //Histórico de recargas
        if (response.ramais.dados.relatorio.length > 0)
          this.ramais = [...response.ramais.dados.relatorio]; //Histórico de chamadas

        this.link_recarga = response.regargaUrl.dados.url; //Link para recarga de crédito
        this.instalado = (response.geral.status == 200);
        this.custo = 0; //Armazena a soma de todas as cargas
        this.extensao = response.extensao; //Objeto de informações da extensão
        this.recargas.forEach(item => {
          this.custo += item.credito;
        });
        this.saldo = response.geral.dados.saldo;
        this.pagination.total = Math.round(response.chamadas.dados.total / response.chamadas.dados.limite);
        this.$vs.loading.close();
        this.getUsers();
      })

    },
    setDate(val) {
      this.$vs.loading();
      switch (val) {
        case 'hoje':
          this.dateRange.startDate = moment();
          break;
        case '7':
          this.dateRange.startDate = moment().subtract(7, 'days');
          break;
        case '15':
          this.dateRange.startDate = moment().subtract(15, 'days');
          break;
        case '30':
          this.dateRange.startDate = moment().subtract(30, 'days');
          break;
      }
      this.getHistorico();
    },
    getDay(dia) {
      //Definindo datas usadas nos ranges padronizados
      let today = new Date()
      today.setHours(0, 0, 0, 0)

      let yesterday = new Date()
      yesterday.setDate(today.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0);
      return (dia ? today : yesterday)
    },
    ativaExtensao() {
      console.log(this.countSwitch)
      if (this.countSwitch === 3) {
        this.extensao.ativo = !this.extensao.ativo;
        this.$vs.notify({
          title: '',
          text: 'Muitas tentativas de ativação',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'danger'
        });
      } else {
        const formData = new FormData();
        let ativo = this.extensao.ativo ? 0 : 1;
        let text = this.extensao.ativo ? 'Desativada' : 'Ativada';
        formData.append('ativo', ativo);
        formData.append('_method', 'PUT');
        this.$store.dispatch('extensoes/ativa', {id: this.extensao.id, dados: formData}).then(() => {
          this.$vs.notify({
            title: '',
            text: text + " com sucesso.",
            iconPack: 'feather',
            icon: 'icon-check-circle',
            color: 'success'
          });
        }).catch(erro => {
          this.$vs.notify({
            title: 'Error',
            text: erro.message,
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          })
        })
        this.countSwitch += 1;
      }
    },
    instalar() {
      this.$vs.dialog({
        color: 'primary',
        title: `Instalar extensão?`,
        text: 'Você confirma que leu e aceita os termos da instalação?',
        acceptText: 'Sim, prosseguir!',
        accept: () => {
          this.$vs.loading();
          this.$store.dispatch('extensoes/instalar', {subdomain: this.dados.subdomain, type: 'Totalvoice'}).then(() => {
            this.$vs.notify({
              color: 'success',
              title: '',
              text: 'Instalado com sucesso'
            });
            this.verifica();
          }).catch(erro => {
            console.log(erro)
            this.$vs.notify({
              color: 'danger',
              title: '',
              text: 'Algo deu errado ao instalar. Contate o suporte.'
            })
          })
        }
      })
    },

    //Modal
    addRamal() {
      this.modalramal = true;
    },
    editRamal(obj) {
      this.val = obj;

      this.usersall.forEach(val => {
        if (val.email_fake == obj.login || val.email == obj.login) {
          this.selectedUser = {id: val.id, label: val.name}
        }
      });

      this.modalramaledit = true;
    },
    getUsers() {
      this.$store.dispatch('users/get').then(response => {
        console.log('usuarios', response);
        this.usersall = response;
      });
    },
    storeRamal() {
      this.$vs.loading();
      this.val.user_id = this.selectedUser.id;
      this.val.type = 'totalvoiceRamal';
      this.val.subdomain = this.dados.subdomain;
      this.$store.dispatch('extensoes/storeRamal', this.val).then(response => {
        console.log('retornou', response);
        this.getHistorico();
        this.$vs.notify({
          title: '',
          text: 'Ramal criado com sucesso',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'success'
        });
        this.$vs.loading.close();
      }).catch((erro) => {
        this.$vs.loading.close();
        this.$vs.notify({
          title: '',
          text: erro.response.menssagem,
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'danger'
        });
      })
      this.$vs.loading.close();
    },
    updateRamal() {
      this.$vs.loading();
      this.val.ramal_id = this.val.id;
      this.val.user_id = this.selectedUser.id;
      this.val.type = 'totalvoiceUpdateRamal';
      this.val.subdomain = this.dados.subdomain;
      this.$store.dispatch('extensoes/updateRamal', this.val).then(response => {
        console.log('retornou', response);
        this.getHistorico();
        this.$vs.notify({
          title: '',
          text: 'Alterações realizadas com sucesso',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'success'
        });
        this.$vs.loading.close();
      })
        .catch((erro) => {
          this.$vs.loading.close();
          this.$vs.notify({
            title: '',
            text: erro.response.menssagem,
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          });
        })
      this.$vs.loading.close();
    },
    deletar(id, user_id) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'primary',
        title: `Deletar Ramal?`,
        text: 'Deseja mesmo deletar este Ramal?',
        acceptText: 'Sim!',
        cancelText: 'Cancelar',
        accept: () => {
          this.$vs.loading();
          let obj = {};
          obj.ramal_id = id;
          obj.user_id = user_id;
          obj.type = 'totalvoiceRamal';
          obj._method = 'DELETE';
          this.$store.dispatch('extensoes/deletarRamal', obj).then(() => {
            this.$vs.notify({
              color: 'success',
              title: '',
              text: 'Deletado com sucesso'
            });
            this.verifica();
          }).catch(erro => {
            console.log(erro)
            this.$vs.notify({
              color: 'danger',
              title: '',
              text: 'Algo deu errado no procedimento. Contate o suporte.'
            })
          })
        }
      })
    },
  },
  watch: {
    dateRange() {
      this.$vs.loading();
      this.getHistorico();
    },
    currentx() {
      this.$vs.loading();
      this.dados.page = this.currentx;
      this.getHistorico();
    },
  },mounted() {

  }}
</script>

<style scoped>

</style>
