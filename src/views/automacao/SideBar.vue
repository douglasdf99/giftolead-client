<!-- =========================================================================================
  File Name: AddNewDataSidebar.vue
  Description: Add New Data - Sidebar component
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary"
              class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>Nova Automação</h4>
      <!--<feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>-->
    </div>
    <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
      <div class="p-6">
        <div>
          <div class="vx-row mt-10">
            <div class="vx-col w-full lg:w-1/2">
              <span class="font-regular mb-2">Email</span>
              <vs-input autocomplete
                        class="w-full "
                        v-model="lead.email" id="lead_email" size="large"
                        placeholder="Email do lead" type="email"/>

              <span class="text-danger text-sm"
                    v-show="errors.has('lead.email')">{{ errors.first('lead.email') }}</span>
            </div>
            <div class="vx-col w-full lg:w-1/2">
              <span class="font-regular mb-2">Campanha</span>
              <vs-input autocomplete
                        class="w-full "
                        v-model="lead.nome" id="lead_nome" size="large"
                        placeholder="Nome do lead"/>
              <span class="text-danger text-sm"
                    v-show="errors.has('lead.nome')">{{ errors.first('lead.nome') }}</span>
            </div>
          </div>
          <div class="vx-row mt-5">
            <div class="vx-col w-full">
              <span class="font-regular mb-2">Brinde</span>
              <v-select id="produto" name="produto" v-validate="'required'" v-model="selectedBrinde"
                        :options="brindes" :clearable="false"/>
              <span class="text-danger text-sm"
                    v-show="errors.has('selectedBrinde')">{{ errors.first('selectedBrinde') }}</span>
            </div>
          </div>
          <div class="vx-row mt-5">
            <div class="vx-col w-full">
              <span class="font-regular mb-2">Campanha</span>
              <v-select id="campanha" name="campanha" v-validate="'required'" v-model="selectedCampanha"
                        :options="campanhas" :clearable="false" label="nome" />

              <span class="text-danger text-sm"
                    v-show="errors.has('selectedCampanha')">{{ errors.first('selectedCampanha') }}</span>
            </div>
          </div>
        </div>
      </div>
    </VuePerfectScrollbar>

    <div class="flex flex-wrap items-center p-6" slot="footer">
      <vs-button class="mr-6" @click="submitData" :disabled="verificaLeadEmail">Salvar
      </vs-button>
      <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">Cancelar</vs-button>
    </div>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import vSelect from 'vue-select'
import {Validator} from 'vee-validate';
import moduleContas from '@/store/contas/moduleContas.js'
import moduleAutomacao from "../../store/automacao/moduleAutomacao";


const dict = {
  custom: {
    origem: {
      required: 'Por favor, selecione uma origem',
    },
    produto: {
      required: 'Por favor, selecione um produto',
    },
    duvida: {
      required: 'Por favor, selecione uma dúvida',
    },
    lead_nome: {
      required: 'Por favor, insira o nome',
    },
    lead_email: {
      required: 'Por favor, insira o e-mail',
    },
    lead_ddd: {
      required: 'Insira o DDD',
    },
    lead_telefone: {
      required: 'Por favor, insira o Telefone',
    },
    detalhamento: {
      required: 'Por favor, insira detalhamento do ticket',
    },
  }
};
Validator.localize('pt-br', dict);

export default {
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      default: () => {
      },
    },
  },
  watch: {},
  data() {
    return {
      prosseguiu: false,
      origens: [],
      produtos: [],
      duvidas: [],
      lead: {
        email: '',
        nome: '',
      },
      campanhas: '',
      brindes: '',
      selectedLead: null,
      selectedOrigem: null,
      selectedBrinde: null,
      selectedCampanha: null,
      ticket: {
        lead: {
          nome: '',
          email: '',
          ddd: '',
          telefone: '',
        }
      },
      validado: false,
      verificaLeadEmail: false
    }
  },
  computed: {
    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive
      },
      set(val) {
        if (!val) {
          this.$emit('closeSidebar')
          // this.$validator.reset()
          // this.initValues()
        }
      }
    },
  },
  methods: {
    alertinha() {
      console.log(this.lead, this.selectedBrinde, this.selectedCampanha)
    },

    submitData() {
      const obj = {};

      obj.nome = this.lead.nome;
      obj.email = this.lead.email;
      obj.brinde = this.selectedBrinde.id;
      obj.campanha = this.selectedCampanha.id
      this.$vs.loading()

      console.log(obj);
      this.$store.dispatch("automacao/store", {rota: 'automacaos', item: obj}).then(() => {
        this.$vs.notify({
          title: '',
          text: "Automação criada com sucesso.",
          iconPack: 'feather',
          icon: 'icon-check-circle',
          color: 'success'
        })
        this.$vs.loading.close();
      }).catch(error => {
        this.$vs.notify({
          title: '',
          text: error.message,
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'danger'
        })
      })

      this.$emit('closeSidebar')

    },
    getLeads() {
      this.$store.dispatch('getVarios', {rota: 'leads', params: this.dados}).then(response => {
        console.log('retornado com sucesso', response)
        this.leads = response.data;
        console.log(this.leads.nome)
        //this.items = response.data
        //this.dados.page = this.pagination.current_page
        this.$vs.loading.close()
      });
    },
    getBrindes() {
      this.$store.dispatch('brindes/get').then(response => {
        this.brindes = [...this.arraySelect(response)];
      });
    },
    getCampanhas() {
      this.$vs.loading();
      this.$store.dispatch('brindes/getCampanhas', this.dados).then(response => {
        console.log('ué', response)
        this.campanhas = [...response];
        this.$vs.loading.close();
      });
    },
  },
  components: {
    VuePerfectScrollbar,
    'v-select': vSelect
  },
  created() {
    this.$vs.loading()

    if (!moduleAutomacao.isRegistered) {
      this.$store.registerModule('automacao', moduleAutomacao)
      moduleAutomacao.isRegistered = true
    }

    this.getLeads();
    this.getBrindes();
    this.getCampanhas();
  }
}
</script>

<style lang="scss" scoped>
.add-new-data-sidebar {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }

  ::v-deep .vs-sidebar {
    z-index: 52010;
    width: 750px;
    max-width: 90vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
  }
}

.scroll-area--data-list-add-new {
  // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
  height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);
}
</style>

<style>
.vs-sidebar--background {
  background: rgba(0, 0, 0, .2) !important;
}
</style>
