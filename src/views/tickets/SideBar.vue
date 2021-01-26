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
      <h4>{{ Object.entries(this.data).length === 0 ? "Novo" : "Atualizar" }} Ticket</h4>
      <!--<feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>-->
    </div>
    <VuePerfectScrollbar class="scroll-area--data-list-add-new" :key="$vs.rtl">
      <div class="p-6">
        <div class="wizard-ticket"></div>
        <div class="vx-row flex relative justify-around">
          <div class="vx-col w-3/12 flex items-center justify-center flex-col relative cursor-pointer"
               @click="prosseguiu = false">
            <div class="wizard-atual" v-if="!prosseguiu"></div>
            <i class="material-icons wizard-ticket-icon">people_out</i>
            <span class="wizard-ticket-span"
                  v-bind:class="{'text-white': !prosseguiu}">Dados do Ticket</span>
          </div>
          <div class="vx-col w-3/12 flex items-center justify-center flex-col relative"
               v-bind:class="{'cursor-pointer': validado}" @click="validado ? prosseguiu = true : ''">
            <div class="wizard-atual" v-if="prosseguiu"></div>
            <i class="material-icons wizard-ticket-icon">favorite</i>
            <span class="wizard-ticket-span"
                  v-bind:class="{'text-white': prosseguiu}">Dados do Lead</span>
          </div>
        </div>
        <div v-if="!prosseguiu">
          <div class="vx-row mt-10">
            <div class="vx-col w-full lg:w-1/2">
              <span class="font-regular mb-2">Origem</span>
              <v-select id="origem" name="origem" class="bg-white" v-validate="'required'"
                        v-model="selectedOrigem" :options="origens" :clearable="false"/>
              <span class="text-danger text-sm"
                    v-show="errors.has('origem')">{{ errors.first('origem') }}</span>
            </div>
            <div class="vx-col w-full lg:w-1/2">
              <span class="font-regular mb-2">Dúvida</span>
              <v-select id="duvida" name="duvida" v-validate="'required'" v-model="selectedDuvida"
                        :options="duvidas" :clearable="false"/>
              <span class="text-danger text-sm"
                    v-show="errors.has('duvida')">{{ errors.first('duvida') }}</span>
            </div>
          </div>
          <div class="vx-row mt-5">
            <div class="vx-col w-full">
              <span class="font-regular mb-2">Produto</span>

              <v-select id="produto" name="produto" v-validate="'required'" v-model="selectedProduto"
                        :options="produtos" :clearable="false"/>
              <span class="text-danger text-sm"
                    v-show="errors.has('produto')">{{ errors.first('produto') }}</span>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="vx-row mt-10">
            <div class="vx-col w-full">
              <span class="font-regular mb-2">E-mail</span>
              <vs-input class="w-full" type="email" v-model="ticket.lead.email" size="large"
                        name="lead_email"
                        v-validate="'required'" @blur="verificaLead"/>
              <span class="text-danger text-sm"
                    v-show="errors.has('lead_email')">{{ errors.first('lead_email') }}</span>
              <span class="text-danger text-sm"
                    v-show="verificaLeadEmail">Já existe um ticket para este Lead vinculado a este Produto.</span>
            </div>
          </div>
          <div class="vx-row mt-5">
            <div class="vx-col w-full">
              <span class="font-regular mb-2">Lead</span>
              <vs-input class="w-full" v-model="ticket.lead.nome" size="large" name="lead_nome"
                        v-validate="'required'"/>
              <span class="text-danger text-sm"
                    v-show="errors.has('lead_nome')">{{ errors.first('lead_nome') }}</span>
            </div>
          </div>
          <div class="vx-row mt-5">
            <div class="vx-col w-full">
              <!--              <vue-phone-number-input :translate="translations" @update="onUpdate" size="lg" v-model="ticket.lead.telefone"></vue-phone-number-input>-->
              <span class="font-regular mb-2">Telefone</span>

              <VuePhoneNumberInput
                name="telefone"
                id="phoneNumber2"
                v-model="ticket.lead.telefone"
                :translations="translations"
                no-flags
                required="true"
                no-use-browser-locale
                default-country-code="BR"
                class="mb-2"
                clearable
                :border-radius="8"
                show-code-on-list
                @update="onUpdate"
                :error="!payload.isValid"
                v-validate="'required'"
              />
            </div>
          </div>

          <vs-input class="w-full" hidden v-model="ticket.lead.telefone" size="large"
                    name="lead_telefone"
                    v-validate="'required'" @keypress="isNumber"/>
          <span class="text-danger text-sm"
                v-show="errors.has('telefone')  ">{{ errors.first('lead_telefone') }}</span>
          <span class="text-danger text-sm"
                v-show="!payload.isValid">Verifique se o telefone e valido</span>
          <div class="vx-row mt-5">
            <div class="vx-col w-full">
              <span class="font-regular mb-2">Detalhamento da solicitação</span>
              <vs-textarea name="detalhamento" v-validate="'required'" v-model="ticket.detalhamento"
                           id="text-area" class="w-full bg-white" rows="6"/>
              <span class="text-danger text-sm"
                    v-show="errors.has('detalhamento')">{{ errors.first('detalhamento') }}</span>
            </div>
          </div>
        </div>
      </div>
    </VuePerfectScrollbar>

    <div class="flex flex-wrap items-center p-6" slot="footer">
      <vs-button class="mr-6" @click="submitData" :disabled="verificaLeadEmail">{{
          !prosseguiu ? 'Prosseguir' :
            'Salvar'
        }}
      </vs-button>
      <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">Cancelar</vs-button>
    </div>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import vSelect from 'vue-select'
import {Validator} from 'vee-validate';
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

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
      ddis: [
        {
          codigo: "004",
          id: "93",
          iso: "AF",
          iso3: "AFG",
          label: "Afeganistão",
          nomeFormal: "República Islâmica do Afeganistão"
        },
        {codigo: "008", id: "355", iso: "AL", iso3: "ALB", label: "Albânia", nomeFormal: "República da Albânia"},
        {
          codigo: "012",
          id: "213",
          iso: "DZ",
          iso3: "DZA",
          label: "Algéria",
          nomeFormal: "República Democrática Popular da Algéria"
        },
        {
          codigo: "016",
          id: "1684",
          iso: "AS",
          iso3: "ASM",
          label: "Samoa Americana",
          nomeFormal: "Território de Samoa Americana"
        },
        {codigo: "020", id: "376", iso: "AD", iso3: "AND", label: "Andorra", nomeFormal: "Principado Andorra"},
        {codigo: "024", id: "244", iso: "AO", iso3: "AGO", label: "Angola", nomeFormal: "República de Angola"},
        {codigo: "660", id: "1264", iso: "AI", iso3: "AIA", label: "Anguilla", nomeFormal: "Anguilla"},
        {codigo: "010", id: "672", iso: "AQ", iso3: "ATA", label: "Antártida", nomeFormal: "Antártida"},
        {
          codigo: "028",
          id: "1268",
          iso: "AG",
          iso3: "ATG",
          label: "Antigua e Barbuda",
          nomeFormal: "Antigua e Barbuda"
        },
        {codigo: "032", id: "54", iso: "AR", iso3: "ARG", label: "Argentina", nomeFormal: "República Argentina"},
        {codigo: "051", id: "374", iso: "AM", iso3: "ARM", label: "Armênia", nomeFormal: "República da Armênia"},
        {codigo: "533", id: "297", iso: "AW", iso3: "ABW", label: "Aruba", nomeFormal: "Aruba"},
        {codigo: "036", id: "61", iso: "AU", iso3: "AUS", label: "Austrália", nomeFormal: "Comunidade da Austrália"},
        {codigo: "040", id: "43", iso: "AT", iso3: "AUT", label: "Áustria", nomeFormal: "República da Áustria"},
        {
          codigo: "031",
          id: "994",
          iso: "AZ",
          iso3: "AZE",
          label: "Azerbaijão",
          nomeFormal: "República do Azerbaijão"
        },
        {codigo: "044", id: "1242", iso: "BS", iso3: "BHS", label: "Bahamas", nomeFormal: "Comunidade de Bahamas"},
        {codigo: "048", id: "973", iso: "BH", iso3: "BHR", label: "Bahrein", nomeFormal: "Reino do Bahrein"},
        {
          codigo: "050",
          id: "880",
          iso: "BD",
          iso3: "BGD",
          label: "Bangladesh",
          nomeFormal: "República Popular de Bangladesh"
        },
        {codigo: "052", id: "246", iso: "BB", iso3: "BRB", label: "Barbados", nomeFormal: "Barbados"},
        {
          codigo: "112",
          id: "375",
          iso: "BY",
          iso3: "BLR",
          label: "Bielorrússia",
          nomeFormal: "República da Bielorrússia"
        },
        {codigo: "056", id: "32", iso: "BE", iso3: "BEL", label: "Bélgica", nomeFormal: "Reino da Bélgica"},
        {codigo: "084", id: "501", iso: "BZ", iso3: "BLZ", label: "Belize", nomeFormal: "Belize"},
        {codigo: "204", id: "229", iso: "BJ", iso3: "BEN", label: "Benin", nomeFormal: "República do Benin"},
        {codigo: "060", id: "1441", iso: "BM", iso3: "BMU", label: "Bermuda", nomeFormal: "Bermuda"},
        {codigo: "064", id: "975", iso: "BT", iso3: "BTN", label: "Butão", nomeFormal: "Reino do Butão"},
        {
          codigo: "068",
          id: "591",
          iso: "BO",
          iso3: "BOL",
          label: "Bolívia",
          nomeFormal: "Estado Plurinacional da Bolívia"
        },
        {
          codigo: "070",
          id: "387",
          iso: "BA",
          iso3: "BIH",
          label: "Bósnia e Herzegovina",
          nomeFormal: "Bósnia e Herzegovina"
        },
        {codigo: "072", id: "267", iso: "BW", iso3: "BWA", label: "Botswana", nomeFormal: "República da Botswana"},
        {codigo: "074", id: "47", iso: "BV", iso3: "BVT", label: "Ilha Bouvet", nomeFormal: "Ilha Bouvet"},
        {
          codigo: "076",
          id: "55",
          iso: "BR",
          iso3: "BRA",
          label: "Brasil",
          nomeFormal: "República Federativa do Brasil"
        },
        {
          codigo: "086",
          id: "246",
          iso: "IO",
          iso3: "IOT",
          label: "Território Britânico do Oceano Índico",
          nomeFormal: "Território Britânico do Oceano Índico"
        },
        {
          codigo: "096",
          id: "673",
          iso: "BN",
          iso3: "BRN",
          label: "Brunei",
          nomeFormal: "Estado do Brunei Darussalam"
        },
        {codigo: "100", id: "359", iso: "BG", iso3: "BGR", label: "Bulgária", nomeFormal: "República da Bulgária"},
        {codigo: "854", id: "226", iso: "BF", iso3: "BFA", label: "Burkina Faso", nomeFormal: "Burkina Faso"},
        {codigo: "108", id: "257", iso: "BI", iso3: "BDI", label: "Burundi", nomeFormal: "República do Burundi"},
        {codigo: "116", id: "855", iso: "KH", iso3: "KHM", label: "Camboja", nomeFormal: "Reino do Camboja"},
        {codigo: "120", id: "237", iso: "CM", iso3: "CMR", label: "Camarões", nomeFormal: "República de Camarões"},
        {codigo: "124", id: "01", iso: "CA", iso3: "CAN", label: "Canadá", nomeFormal: "Canadá"},
        {
          codigo: "132",
          id: "238",
          iso: "CV",
          iso3: "CPV",
          label: "Cabo Verde",
          nomeFormal: "República do Cabo Verde"
        },
        {codigo: "136", id: "1345", iso: "KY", iso3: "CYM", label: "Ilhas Cayman", nomeFormal: "Ilhas Cayman"},
        {
          codigo: "140",
          id: "236",
          iso: "CF",
          iso3: "CAF",
          label: "República Centro-Africana",
          nomeFormal: "República Centro-Africana"
        },
        {codigo: "148", id: "235", iso: "TD", iso3: "TCD", label: "Chade", nomeFormal: "República do Chade"},
        {codigo: "152", id: "56", iso: "CL", iso3: "CHL", label: "Chile", nomeFormal: "República do Chile"},
        {codigo: "156", id: "86", iso: "CN", iso3: "CHN", label: "China", nomeFormal: "República Popular da China"},
        {
          codigo: "162",
          id: "61",
          iso: "CX",
          iso3: "CXR",
          label: "Ilha Christmas",
          nomeFormal: "Território da Ilha Christmas"
        },
        {
          codigo: "166",
          id: "672",
          iso: "CC",
          iso3: "CCK",
          label: "Ilhas Cocos (Keeling)",
          nomeFormal: "Território das Ilhas Cocos (Keeling)"
        },
        {codigo: "170", id: "57", iso: "CO", iso3: "COL", label: "Colômbia", nomeFormal: "República da Colômbia"},
        {codigo: "174", id: "269", iso: "KM", iso3: "COM", label: "Comores", nomeFormal: "União das Comores"},
        {codigo: "178", id: "242", iso: "CG", iso3: "COG", label: "Congo", nomeFormal: "República do Congo"},
        {
          codigo: "180",
          id: "242",
          iso: "CD",
          iso3: "COD",
          label: "Congo (DR)",
          nomeFormal: "República Democrática do Congo"
        },
        {codigo: "184", id: "682", iso: "CK", iso3: "COK", label: "Ilhas Cook", nomeFormal: "Ilhas Cook"},
        {
          codigo: "188",
          id: "506",
          iso: "CR",
          iso3: "CRI",
          label: "Costa Rica",
          nomeFormal: "República da Costa Rica"
        },
        {
          codigo: "384",
          id: "225",
          iso: "CI",
          iso3: "CIV",
          label: "Costa do Marfim",
          nomeFormal: "República da Costa do Marfim"
        },
        {codigo: "191", id: "385", iso: "HR", iso3: "HRV", label: "Croácia", nomeFormal: "República da Croácia"},
        {codigo: "192", id: "53", iso: "CU", iso3: "CUB", label: "Cuba", nomeFormal: "República de Cuba"},
        {codigo: "196", id: "357", iso: "CY", iso3: "CYP", label: "Chipre", nomeFormal: "República do Chipre"},
        {codigo: "203", id: "420", iso: "CZ", iso3: "CZE", label: "República Tcheca", nomeFormal: "República Tcheca"},
        {codigo: "208", id: "45", iso: "DK", iso3: "DNK", label: "Dinamarca", nomeFormal: "Reino da Dinamarca"},
        {codigo: "262", id: "253", iso: "DJ", iso3: "DJI", label: "Djibuti", nomeFormal: "República do Djibuti"},
        {codigo: "212", id: "1767", iso: "DM", iso3: "DMA", label: "Dominica", nomeFormal: "Comunidade da Dominica"},
        {
          codigo: "214",
          id: "1809",
          iso: "DO",
          iso3: "DOM",
          label: "República Dominicana",
          nomeFormal: "República Dominicana"
        },
        {codigo: "218", id: "593", iso: "EC", iso3: "ECU", label: "Equador", nomeFormal: "República do Equador"},
        {codigo: "818", id: "20", iso: "EG", iso3: "EGY", label: "Egito", nomeFormal: "República Árabe do Egito"},
        {codigo: "222", id: "503", iso: "SV", iso3: "SLV", label: "El Salvador", nomeFormal: "República El Salvador"},
        {
          codigo: "226",
          id: "240",
          iso: "GQ",
          iso3: "GNQ",
          label: "Guiné Equatorial",
          nomeFormal: "República do Guiné Equatorial"
        },
        {codigo: "232", id: "291", iso: "ER", iso3: "ERI", label: "Eritreia", nomeFormal: "Estado da Eritreia"},
        {codigo: "233", id: "372", iso: "EE", iso3: "EST", label: "Estônia", nomeFormal: "República da Estônia"},
        {
          codigo: "231",
          id: "251",
          iso: "ET",
          iso3: "ETH",
          label: "Etiópia",
          nomeFormal: "República Democrática Federal da Etiópia"
        },
        {codigo: "238", id: "500", iso: "FK", iso3: "FLK", label: "Ilhas Malvinas", nomeFormal: "Ilhas Malvinas"},
        {codigo: "234", id: "298", iso: "FO", iso3: "FRO", label: "Ilhas Faroe", nomeFormal: "Ilhas Faroe"},
        {codigo: "242", id: "679", iso: "FJ", iso3: "FJI", label: "Fiji", nomeFormal: "República do Fiji"},
        {codigo: "246", id: "358", iso: "FI", iso3: "FIN", label: "Finlândia", nomeFormal: "República da Finlândia"},
        {codigo: "250", id: "33", iso: "FR", iso3: "FRA", label: "França", nomeFormal: "República Francesa"},
        {codigo: "254", id: "594", iso: "GF", iso3: "GUF", label: "Guiana Francesa", nomeFormal: "Guiana Francesa"},
        {
          codigo: "258",
          id: "689",
          iso: "PF",
          iso3: "PYF",
          label: "Polinésia Francesa",
          nomeFormal: "Polinésia Francesa"
        },
        {
          codigo: "260",
          id: "33",
          iso: "TF",
          iso3: "ATF",
          label: "Terras Austrais e Antárticas Francesas",
          nomeFormal: "Território das Terras Austrais e Antárticas Francesas"
        },
        {codigo: "266", id: "241", iso: "GA", iso3: "GAB", label: "Gabão", nomeFormal: "República Gabonesa"},
        {codigo: "270", id: "220", iso: "GM", iso3: "GMB", label: "Gâmbia", nomeFormal: "República da Gâmbia"},
        {codigo: "268", id: "995", iso: "GE", iso3: "GEO", label: "Geórgia", nomeFormal: "Geórgia"},
        {
          codigo: "276",
          id: "49",
          iso: "DE",
          iso3: "DEU",
          label: "Alemanha",
          nomeFormal: "República Federal da Alemanha"
        },
        {codigo: "288", id: "233", iso: "GH", iso3: "GHA", label: "Gana", nomeFormal: "Repúblia de Gana"},
        {codigo: "292", id: "350", iso: "GI", iso3: "GIB", label: "Gibraltar", nomeFormal: "Gibraltar"},
        {codigo: "300", id: "30", iso: "GR", iso3: "GRC", label: "Grécia", nomeFormal: "República Helênica"},
        {codigo: "304", id: "299", iso: "GL", iso3: "GRL", label: "Groelândia", nomeFormal: "Groelândia"},
        {codigo: "308", id: "1473", iso: "GD", iso3: "GRD", label: "Granada", nomeFormal: "Granada"},
        {codigo: "312", id: "590", iso: "GP", iso3: "GLP", label: "Guadalupe", nomeFormal: "Guadalupe"},
        {codigo: "316", id: "1671", iso: "GU", iso3: "GUM", label: "Guão", nomeFormal: "Território do Guão"},
        {codigo: "320", id: "502", iso: "GT", iso3: "GTM", label: "Guatemala", nomeFormal: "República da Guatemala"},
        {codigo: "324", id: "224", iso: "GN", iso3: "GIN", label: "Guiné", nomeFormal: "República do Guiné"},
        {
          codigo: "624",
          id: "245",
          iso: "GW",
          iso3: "GNB",
          label: "Guiné-Bissau",
          nomeFormal: "República da Guiné-Bissau"
        },
        {
          codigo: "328",
          id: "592",
          iso: "GY",
          iso3: "GUY",
          label: "Guiana",
          nomeFormal: "República Cooperativa da Guiana"
        },
        {codigo: "332", id: "509", iso: "HT", iso3: "HTI", label: "Haiti", nomeFormal: "República do Haiti"},
        {
          codigo: "334",
          id: "672",
          iso: "HM",
          iso3: "HMD",
          label: "Ilhas Heard e McDonald",
          nomeFormal: "Território das Ilhas Heard e McDonald"
        },
        {
          codigo: "336",
          id: "39",
          iso: "VA",
          iso3: "VAT",
          label: "Vaticano",
          nomeFormal: "Estado da Cidade do Vaticano"
        },
        {codigo: "340", id: "504", iso: "HN", iso3: "HND", label: "Honduras", nomeFormal: "República de Honduras"},
        {
          codigo: "344",
          id: "852",
          iso: "HK",
          iso3: "HKG",
          label: "Hong Kong",
          nomeFormal: "Região Administrativa Especial de Hong Kong da República Popular da China"
        },
        {codigo: "348", id: "36", iso: "HU", iso3: "HUN", label: "Hungria", nomeFormal: "Hungria"},
        {codigo: "352", id: "354", iso: "IS", iso3: "ISL", label: "Islândia", nomeFormal: "Islândia"},
        {codigo: "356", id: "91", iso: "IN", iso3: "IND", label: "Índia", nomeFormal: "República da Índia"},
        {codigo: "360", id: "62", iso: "ID", iso3: "IDN", label: "Indonésia", nomeFormal: "República da Indonésia"},
        {codigo: "364", id: "98", iso: "IR", iso3: "IRN", label: "Iran", nomeFormal: "República Islâmica do Iran"},
        {codigo: "368", id: "964", iso: "IQ", iso3: "IRQ", label: "Iraque", nomeFormal: "República do Iraque"},
        {codigo: "372", id: "353", iso: "IE", iso3: "IRL", label: "Irlanda", nomeFormal: "Irlanda"},
        {codigo: "376", id: "972", iso: "IL", iso3: "ISR", label: "Israel", nomeFormal: "Estado de Israel"},
        {codigo: "380", id: "39", iso: "IT", iso3: "ITA", label: "Itália", nomeFormal: "República Italiana"},
        {codigo: "388", id: "1876", iso: "JM", iso3: "JAM", label: "Jamaica", nomeFormal: "Jamaica"},
        {codigo: "392", id: "81", iso: "JP", iso3: "JPN", label: "Japão", nomeFormal: "Japão"},
        {
          codigo: "400",
          id: "962",
          iso: "JO",
          iso3: "JOR",
          label: "Jordânia",
          nomeFormal: "Reino Hachemita da Jordânia"
        },
        {
          codigo: "398",
          id: "07",
          iso: "KZ",
          iso3: "KAZ",
          label: "Cazaquistão",
          nomeFormal: "República do Cazaquistão"
        },
        {codigo: "404", id: "254", iso: "KE", iso3: "KEN", label: "Quênia", nomeFormal: "República do Quênia"},
        {codigo: "296", id: "686", iso: "KI", iso3: "KIR", label: "Kiribati", nomeFormal: "República do Kiribati"},
        {
          codigo: "408",
          id: "850",
          iso: "KP",
          iso3: "PRK",
          label: "Coreia do Norte",
          nomeFormal: "República Democrática Popular da Coreia"
        },
        {codigo: "410", id: "82", iso: "KR", iso3: "KOR", label: "Coreia do Sul", nomeFormal: "República da Coreia"},
        {codigo: "414", id: "965", iso: "KW", iso3: "KWT", label: "Kuwait", nomeFormal: "Estado do Kuwait"},
        {codigo: "417", id: "996", iso: "KG", iso3: "KGZ", label: "Quirguistão", nomeFormal: "República Quirguiz"},
        {
          codigo: "418",
          id: "856",
          iso: "LA",
          iso3: "LAO",
          label: "Laos",
          nomeFormal: "República Democrática Popular Lau"
        },
        {codigo: "428", id: "371", iso: "LV", iso3: "LVA", label: "Letônia", nomeFormal: "República da Letônia"},
        {codigo: "422", id: "961", iso: "LB", iso3: "LBN", label: "Líbano", nomeFormal: "República Libanesa"},
        {codigo: "426", id: "266", iso: "LS", iso3: "LSO", label: "Lesoto", nomeFormal: "Reino do Lesoto"},
        {codigo: "430", id: "231", iso: "LR", iso3: "LBR", label: "Libéria", nomeFormal: "República da Libéria"},
        {codigo: "434", id: "218", iso: "LY", iso3: "LBY", label: "Líbia", nomeFormal: "Líbia"},
        {
          codigo: "438",
          id: "423",
          iso: "LI",
          iso3: "LIE",
          label: "Liechtenstein",
          nomeFormal: "Principado de Liechtenstein"
        },
        {codigo: "440", id: "370", iso: "LT", iso3: "LTU", label: "Lituânia", nomeFormal: "República da Lituânia"},
        {
          codigo: "442",
          id: "352",
          iso: "LU",
          iso3: "LUX",
          label: "Luxemburgo",
          nomeFormal: "Grão-Ducado do Luxemburgo"
        },
        {codigo: "446", id: "853", iso: "MO", iso3: "MAC", label: "Macao", nomeFormal: "Macao"},
        {codigo: "807", id: "389", iso: "MK", iso3: "MKD", label: "Macedônia", nomeFormal: "República da Macedônia"},
        {
          codigo: "450",
          id: "261",
          iso: "MG",
          iso3: "MDG",
          label: "Madagascar",
          nomeFormal: "República de Madagascar"
        },
        {codigo: "454", id: "265", iso: "MW", iso3: "MWI", label: "Malawi", nomeFormal: "República de Malawi"},
        {codigo: "458", id: "60", iso: "MY", iso3: "MYS", label: "Malásia", nomeFormal: "Malásia"},
        {codigo: "462", id: "960", iso: "MV", iso3: "MDV", label: "Maldivas", nomeFormal: "Reública de Maldivas"},
        {codigo: "466", id: "223", iso: "ML", iso3: "MLI", label: "Mali", nomeFormal: "República do Mali"},
        {codigo: "470", id: "356", iso: "MT", iso3: "MLT", label: "Malta", nomeFormal: "República de Malta"},
        {
          codigo: "584",
          id: "692",
          iso: "MH",
          iso3: "MHL",
          label: "Ilhas Marshall",
          nomeFormal: "República das Ilhas Marshall"
        },
        {codigo: "474", id: "596", iso: "MQ", iso3: "MTQ", label: "Martinica", nomeFormal: "Martinica"},
        {
          codigo: "478",
          id: "222",
          iso: "MR",
          iso3: "MRT",
          label: "Mauritânia",
          nomeFormal: "República Islâmica da Mauritânia"
        },
        {codigo: "480", id: "230", iso: "MU", iso3: "MUS", label: "Maurício", nomeFormal: "República de Maurício"},
        {codigo: "175", id: "269", iso: "YT", iso3: "MYT", label: "Mayotte", nomeFormal: "Departamento de Mayotte"},
        {codigo: "484", id: "52", iso: "MX", iso3: "MEX", label: "México", nomeFormal: "Estados Unidos Mexicanos"},
        {
          codigo: "583",
          id: "691",
          iso: "FM",
          iso3: "FSM",
          label: "Micronésia",
          nomeFormal: "Estados Federados da Micronesia"
        },
        {codigo: "498", id: "373", iso: "MD", iso3: "MDA", label: "Moldova", nomeFormal: "República de Moldova"},
        {codigo: "492", id: "377", iso: "MC", iso3: "MCO", label: "Mônaco", nomeFormal: "Principado de Mônaco"},
        {codigo: "496", id: "976", iso: "MN", iso3: "MNG", label: "Mongólia", nomeFormal: "Mongólia"},
        {codigo: "500", id: "1664", iso: "MS", iso3: "MSR", label: "Montserrat", nomeFormal: "Montserrat"},
        {codigo: "504", id: "212", iso: "MA", iso3: "MAR", label: "Marrocos", nomeFormal: "Reino de Marrocos"},
        {
          codigo: "508",
          id: "258",
          iso: "MZ",
          iso3: "MOZ",
          label: "Moçambique",
          nomeFormal: "República de Moçambique"
        },
        {
          codigo: "104",
          id: "95",
          iso: "MM",
          iso3: "MMR",
          label: "Birmânia",
          nomeFormal: "República da União de Myanmar"
        },
        {codigo: "516", id: "264", iso: "NA", iso3: "NAM", label: "Namíbia", nomeFormal: "República da Namíbia"},
        {codigo: "520", id: "674", iso: "NR", iso3: "NRU", label: "Nauru", nomeFormal: "República de Nauru"},
        {
          codigo: "524",
          id: "977",
          iso: "NP",
          iso3: "NPL",
          label: "Nepal",
          nomeFormal: "República Democrática Federativa do Nepal"
        },
        {codigo: "528", id: "31", iso: "NL", iso3: "NLD", label: "Holanda", nomeFormal: "Holanda"},
        {
          codigo: "530",
          id: "599",
          iso: "AN",
          iso3: "ANT",
          label: "Antilhas Holandesas",
          nomeFormal: "Antilhas Holandesas"
        },
        {codigo: "540", id: "687", iso: "NC", iso3: "NCL", label: "Nova Caledônia", nomeFormal: "Nova Caledônia"},
        {codigo: "554", id: "64", iso: "NZ", iso3: "NZL", label: "Nova Zelândia", nomeFormal: "Nova Zelândia"},
        {codigo: "558", id: "505", iso: "NI", iso3: "NIC", label: "Nicarágua", nomeFormal: "República da Nicarágua"},
        {codigo: "562", id: "227", iso: "NE", iso3: "NER", label: "Niger", nomeFormal: "República do Niger"},
        {
          codigo: "566",
          id: "234",
          iso: "NG",
          iso3: "NGA",
          label: "Nigéria",
          nomeFormal: "República Federativa da Nigéria"
        },
        {codigo: "570", id: "683", iso: "NU", iso3: "NIU", label: "Niue", nomeFormal: "Niue"},
        {
          codigo: "574",
          id: "672",
          iso: "NF",
          iso3: "NFK",
          label: "Ilha Norfolk",
          nomeFormal: "Território da Ilha Norfolk"
        },
        {
          codigo: "580",
          id: "1670",
          iso: "MP",
          iso3: "MNP",
          label: "Ilhas Marianas do Norte",
          nomeFormal: "Comunidade das Ilhas Marianas do Norte"
        },
        {codigo: "578", id: "47", iso: "NO", iso3: "NOR", label: "Noruega", nomeFormal: "Reino da Noruega"},
        {codigo: "512", id: "968", iso: "OM", iso3: "OMN", label: "Omã", nomeFormal: "Sultanato de Omã"},
        {
          codigo: "586",
          id: "92",
          iso: "PK",
          iso3: "PAK",
          label: "Paquistão",
          nomeFormal: "República Islâmica do Paquistão"
        },
        {codigo: "585", id: "680", iso: "PW", iso3: "PLW", label: "Palau", nomeFormal: "República de Palau"},
        {codigo: "275", id: "970", iso: "PS", iso3: "PSE", label: "Palestina", nomeFormal: "Estado da Palestina"},
        {codigo: "591", id: "507", iso: "PA", iso3: "PAN", label: "Panamá", nomeFormal: "República do Panamá"},
        {
          codigo: "598",
          id: "675",
          iso: "PG",
          iso3: "PNG",
          label: "Papua-Nova Guiné",
          nomeFormal: "Estado Independente da Papua-Nova Guiné"
        },
        {codigo: "600", id: "595", iso: "PY", iso3: "PRY", label: "Paraguai", nomeFormal: "República do Paraguai"},
        {codigo: "604", id: "51", iso: "PE", iso3: "PER", label: "Peru", nomeFormal: "República do Peru"},
        {codigo: "608", id: "63", iso: "PH", iso3: "PHL", label: "Filipinas", nomeFormal: "República das Filipinas"},
        {codigo: "612", id: "672", iso: "PN", iso3: "PCN", label: "Ilhas Picárnia", nomeFormal: "Ilhas Picárnia"},
        {codigo: "616", id: "48", iso: "PL", iso3: "POL", label: "Polônia", nomeFormal: "República da Polônia"},
        {codigo: "620", id: "351", iso: "PT", iso3: "PRT", label: "Portugal", nomeFormal: "República Portuguesa"},
        {
          codigo: "630",
          id: "1787",
          iso: "PR",
          iso3: "PRI",
          label: "Porto Rico",
          nomeFormal: "Comunidade do Porto Rico"
        },
        {codigo: "634", id: "974", iso: "QA", iso3: "QAT", label: "Catar", nomeFormal: "Estado do Catar"},
        {codigo: "638", id: "262", iso: "RE", iso3: "REU", label: "Reunião", nomeFormal: "Polônia"},
        {codigo: "642", id: "40", iso: "RO", iso3: "ROM", label: "Romênia", nomeFormal: "Romênia"},
        {codigo: "643", id: "70", iso: "RU", iso3: "RUS", label: "Rússia", nomeFormal: "Federação Russa"},
        {codigo: "646", id: "250", iso: "RW", iso3: "RWA", label: "Ruanda", nomeFormal: "República da Ruanda"},
        {codigo: "654", id: "290", iso: "SH", iso3: "SHN", label: "Santa Helena", nomeFormal: "Saint Helena"},
        {codigo: "659", id: "1869", iso: "KN", iso3: "KNA", label: "São Cristóvão", nomeFormal: "São Cristóvão"},
        {codigo: "662", id: "1758", iso: "LC", iso3: "LCA", label: "Santa Lúcia", nomeFormal: "Santa Lúcia"},
        {
          codigo: "666",
          id: "508",
          iso: "PM",
          iso3: "SPM",
          label: "São Pedro e Miquelon",
          nomeFormal: "Coletividade Territorial de São Pedro e Miquelon"
        },
        {
          codigo: "670",
          id: "1784",
          iso: "VC",
          iso3: "VCT",
          label: "São Vicente e Granadinas",
          nomeFormal: "São Vicente e Granadinas"
        },
        {
          codigo: "882",
          id: "684",
          iso: "WS",
          iso3: "WSM",
          label: "Samoa",
          nomeFormal: "Estado Independente de Samoa"
        },
        {
          codigo: "674",
          id: "378",
          iso: "SM",
          iso3: "SMR",
          label: "São Marino",
          nomeFormal: "República de São Marino"
        },
        {
          codigo: "678",
          id: "239",
          iso: "ST",
          iso3: "STP",
          label: "Sao Tomé e Príncipe",
          nomeFormal: "República Democrática de Sao Tomé e Príncipe"
        },
        {
          codigo: "682",
          id: "966",
          iso: "SA",
          iso3: "SAU",
          label: "Arábia Saudita",
          nomeFormal: "Reino da Arábia Saudita"
        },
        {codigo: "686", id: "221", iso: "SN", iso3: "SEN", label: "Senegal", nomeFormal: "República do Senegal"},
        {
          codigo: "688",
          id: "381",
          iso: "CS",
          iso3: "SRB",
          label: "Sérvia e Montenegro",
          nomeFormal: "União Estatal de Sérvia e Montenegro"
        },
        {codigo: "690", id: "248", iso: "SC", iso3: "SYC", label: "Seicheles", nomeFormal: "República das Seicheles"},
        {
          codigo: "694",
          id: "232",
          iso: "SL",
          iso3: "SLE",
          label: "República da Serra Leoa",
          nomeFormal: "República da Serra Leoa"
        },
        {codigo: "702", id: "65", iso: "SG", iso3: "SGP", label: "Singapura", nomeFormal: "República da Singapura"},
        {codigo: "703", id: "421", iso: "SK", iso3: "SVK", label: "Eslováquia", nomeFormal: "República Eslovaca"},
        {codigo: "705", id: "386", iso: "SI", iso3: "SVN", label: "Eslovênia", nomeFormal: "República da Eslovênia"},
        {codigo: "090", id: "677", iso: "SB", iso3: "SLB", label: "Ilhas Salomão", nomeFormal: "Ilhas Salomão"},
        {codigo: "706", id: "252", iso: "SO", iso3: "SOM", label: "Somália", nomeFormal: "República da Somália"},
        {
          codigo: "710",
          id: "27",
          iso: "ZA",
          iso3: "ZAF",
          label: "África do Sul",
          nomeFormal: "República da África do Sul"
        },
        {
          codigo: "239",
          id: "500",
          iso: "GS",
          iso3: "SGS",
          label: "Ilhas Geórgia do Sul e Sandwich do Sul",
          nomeFormal: "Ilhas Geórgia do Sul e Sandwich do Sul"
        },
        {codigo: "724", id: "34", iso: "ES", iso3: "ESP", label: "Espanha", nomeFormal: "Reino da Espanha"},
        {
          codigo: "144",
          id: "94",
          iso: "LK",
          iso3: "LKA",
          label: "Sri Lanka",
          nomeFormal: "República Democrática Socialista do Sri Lanka"
        },
        {codigo: "736", id: "249", iso: "SD", iso3: "SDN", label: "Sudão", nomeFormal: "República do Sudão"},
        {codigo: "740", id: "597", iso: "SR", iso3: "SUR", label: "Suriname", nomeFormal: "República do Suriname"},
        {codigo: "744", id: "47", iso: "SJ", iso3: "SJM", label: "Esvalbarde", nomeFormal: "Esvalbarde"},
        {codigo: "748", id: "268", iso: "SZ", iso3: "SWZ", label: "Suazilândia", nomeFormal: "Reino da Suazilândia"},
        {codigo: "752", id: "46", iso: "SE", iso3: "SWE", label: "Suécia", nomeFormal: "Reino da Suécia"},
        {codigo: "756", id: "41", iso: "CH", iso3: "CHE", label: "Suiça", nomeFormal: "Confederação Suiça"},
        {codigo: "760", id: "963", iso: "SY", iso3: "SYR", label: "Síria", nomeFormal: "República Árabe Síria"},
        {codigo: "158", id: "886", iso: "TW", iso3: "TWN", label: "Taiwan", nomeFormal: "Taiwan"},
        {
          codigo: "762",
          id: "992",
          iso: "TJ",
          iso3: "TJK",
          label: "Tajiquistão",
          nomeFormal: "República do Tajiquistão"
        },
        {
          codigo: "834",
          id: "255",
          iso: "TZ",
          iso3: "TZA",
          label: "Tanzânia",
          nomeFormal: "República Unida da Tanzânia"
        },
        {codigo: "764", id: "66", iso: "TH", iso3: "THA", label: "Tailândia", nomeFormal: "Reino da Tailândia"},
        {
          codigo: "626",
          id: "670",
          iso: "TL",
          iso3: "TLS",
          label: "Timor-Leste",
          nomeFormal: "República Democrática de Timor-Leste"
        },
        {codigo: "768", id: "228", iso: "TG", iso3: "TGO", label: "Togo", nomeFormal: "República Togolesa"},
        {codigo: "772", id: "690", iso: "TK", iso3: "TKL", label: "Toquelau", nomeFormal: "Toquelau"},
        {codigo: "776", id: "676", iso: "TO", iso3: "TON", label: "Tonga", nomeFormal: "Reino de Tonga"},
        {
          codigo: "780",
          id: "1868",
          iso: "TT",
          iso3: "TTO",
          label: "Trinidad e Tobago",
          nomeFormal: "República da Trinidad e Tobago"
        },
        {codigo: "788", id: "216", iso: "TN", iso3: "TUN", label: "Tunísia", nomeFormal: "República da Tunísia"},
        {codigo: "792", id: "90", iso: "TR", iso3: "TUR", label: "Turquia", nomeFormal: "República da Turquia"},
        {codigo: "795", id: "7370", iso: "TM", iso3: "TKM", label: "Turcomenistão", nomeFormal: "Turcomenistão"},
        {
          codigo: "796",
          id: "1649",
          iso: "TC",
          iso3: "TCA",
          label: "Ilhas Turks e Caicos",
          nomeFormal: "Ilhas Turks e Caicos"
        },
        {codigo: "798", id: "688", iso: "TV", iso3: "TUV", label: "Tuvalu", nomeFormal: "Tuvalu"},
        {codigo: "800", id: "256", iso: "UG", iso3: "UGA", label: "Uganda", nomeFormal: "República de Uganda"},
        {codigo: "804", id: "380", iso: "UA", iso3: "UKR", label: "Ucrânia", nomeFormal: "Ucrânia"},
        {
          codigo: "784",
          id: "971",
          iso: "AE",
          iso3: "ARE",
          label: "Emirados Árabes",
          nomeFormal: "Emirados Árabes Unidos"
        },
        {
          codigo: "826",
          id: "44",
          iso: "GB",
          iso3: "GBR",
          label: "Reino Unido",
          nomeFormal: "Reino Unido da Grã-Bretanha e Irlanda do Norte"
        },
        {
          codigo: "840",
          id: "01",
          iso: "US",
          iso3: "USA",
          label: "Estados Unidos",
          nomeFormal: "Estados Unidos da América"
        },
        {
          codigo: "581",
          id: "01",
          iso: "UM",
          iso3: "UMI",
          label: "Ilhas Menores Distantes dos Estados Unidos",
          nomeFormal: "Ilhas Menores Distantes dos Estados Unidos"
        },
        {
          codigo: "858",
          id: "598",
          iso: "UY",
          iso3: "URY",
          label: "Uruguai",
          nomeFormal: "República Oriental do Uruguai"
        },
        {
          codigo: "860",
          id: "998",
          iso: "UZ",
          iso3: "UZB",
          label: "Uzbequistão",
          nomeFormal: "República do Uzbequistão"
        },
        {codigo: "548", id: "678", iso: "VU", iso3: "VUT", label: "Vanuatu", nomeFormal: "República de Vanuatu"},
        {
          codigo: "862",
          id: "58",
          iso: "VE",
          iso3: "VEN",
          label: "Venezuela",
          nomeFormal: "República Bolivariana da Venezuela"
        },
        {
          codigo: "704",
          id: "84",
          iso: "VN",
          iso3: "VNM",
          label: "Vietnam",
          nomeFormal: "República Socialista do Vietnam"
        },
        {
          codigo: "092",
          id: "1284",
          iso: "VG",
          iso3: "VGB",
          label: "Ilhas Virgens Inglesas",
          nomeFormal: "Ilhas Virgens"
        },
        {
          codigo: "850",
          id: "1340",
          iso: "VI",
          iso3: "VIR",
          label: "Ilhas Virgens (USA)",
          nomeFormal: "Ilhas Virgens dos Estados Unidos"
        },
        {codigo: "876", id: "681", iso: "WF", iso3: "WLF", label: "Wallis e Futuna", nomeFormal: "Wallis e Futuna"},
        {codigo: "732", id: "212", iso: "EH", iso3: "ESH", label: "Saara Ocidental", nomeFormal: "Saara Ocidental"},
        {codigo: "887", id: "967", iso: "YE", iso3: "YEM", label: "Iêmen", nomeFormal: "República do Iêmen"},
        {codigo: "894", id: "260", iso: "ZM", iso3: "ZMB", label: "Zâmbia", nomeFormal: "República do Zâmbia"},
        {codigo: "716", id: "263", iso: "ZW", iso3: "ZWE", label: "Zimbábue", nomeFormal: "República do Zimbábue"}

      ],
      prosseguiu: false,
      origens: [],
      produtos: [],
      duvidas: [],
      selectedOrigem: null,
      selectedProduto: null,
      selectedDuvida: null,
      ticket: {
        lead: {
          nome: '',
          email: '',
          ddi: '55',
          ddd: '',
          telefone: '',
        }
      },
      validado: false,
      verificaLeadEmail: false,
      translations: {
        countrySelectorLabel: 'Codigo do Pais',
        countrySelectorError: 'Selecione um Pais',
        phoneNumberLabel: 'Numero do telefone',
        example: 'Exemplo :'
      },
      payload: {
        isValid: true
      },
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
    onUpdate(payload) {
      this.ticket.lead.ddi = payload.countryCallingCode;
      this.payload = payload;
    },
    getOpcoes() {
      this.$store.dispatch('origens/get').then(response => {
        let origens = [...response];
        origens.forEach(item => {
          this.origens.push({id: item.id, label: item.nome})
        });
      });
      this.$store.dispatch('produtos/get').then(response => {
        let produtos = [...response];
        produtos.forEach(item => {
          this.produtos.push({id: item.id, label: item.nome})
        });
      });
      this.$store.dispatch('duvidas/get').then(response => {
        let duvidas = [...response];
        duvidas.forEach(item => {
          this.duvidas.push({id: item.id, label: item.nome})
        });
      });
    },
    verificaLead() {
      console.log('ticket', this.ticket, 'data', this.data)
      if (this.data.lead) {
        if (this.ticket.lead.email !== this.data.lead.email) {
          this.$store.dispatch('tickets/verificaLead', {
            email: this.ticket.lead.email,
            produto_id: this.selectedProduto.id
          }).then(response => {
            this.verificaLeadEmail = response.verificacao;
          });
        } else {
          this.verificaLeadEmail = false;
        }
      } else {
        this.$store.dispatch('tickets/verificaLead', {
          email: this.ticket.lead.email,
          produto_id: this.selectedProduto.id
        }).then(response => {
          this.verificaLeadEmail = response.verificacao;
        });
      }
    },
    initValues() {
      if (this.data.id) {
        console.log(this.data)
        return
      } else {
        this.ticket.id = null
        this.ticket.lead.nome = ''
        this.selectedDuvida = null
        this.selectedProduto = null
        this.selectedOrigem = null
      }
    },
    submitData() {
      this.$validator.validateAll().then(result => {
        if (result) {
          if (!this.prosseguiu) {
            this.validado = true;
            this.prosseguiu = true;
          } else {
            if (!this.verificaLeadEmail) {
              this.$vs.loading()
              const obj = {};
              if (this.selectedDuvida != null)
                obj.tipo_duvida_id = this.selectedDuvida.id;

              if (this.selectedProduto != null)
                obj.produto_id = this.selectedProduto.id;

              if (this.selectedOrigem != null)
                obj.origem_id = this.selectedOrigem.id;

              obj.nome = this.ticket.lead.nome;
              obj.email = this.ticket.lead.email;
              obj.ddd = this.ticket.lead.ddd;
              obj.ddi = this.ticket.lead.ddi;
              obj.telefone = this.ticket.lead.telefone;
              obj.detalhamento = this.ticket.detalhamento;
              if (this.data.id) {
                obj.id = this.data.id;
                obj._method = 'PUT';
                console.log('obj atualizando', obj)
                this.$store.dispatch("updateItem", {rota: 'tickets', item: obj}).then(() => {
                  this.$vs.notify({
                    title: 'Sucesso',
                    text: "O Ticket foi editado com sucesso.",
                    iconPack: 'feather',
                    icon: 'icon-check-circle',
                    color: 'success'
                  });
                  this.$store.dispatch('getVarios', {
                    rota: 'tickets',
                    params: {page: 1}
                  }).then(() => {
                    this.$vs.loading.close();
                  });
                }).catch(err => {
                  console.error(err)
                })
              } else {
                delete obj.id
                console.log('obj criando', obj)
                this.$store.dispatch("addItem", {rota: 'tickets', item: obj}).then(() => {
                  this.$vs.notify({
                    title: '',
                    text: "Ticket criado com sucesso.",
                    iconPack: 'feather',
                    icon: 'icon-check-circle',
                    color: 'success'
                  })

                }).catch(error => {
                  this.$vs.notify({
                    title: '',
                    text: error.response.data.message,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                  })
                }).finally(() => {
                  this.$vs.loading.close();
                })
              }

              this.$emit('closeSidebar')
              this.initValues()
            }
          }
        } else {
          this.$vs.notify({
            title: '',
            text: 'verifique os erros específicos',
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          })
        }
      })
    },
  },
  components: {
    VuePhoneNumberInput,
    VuePerfectScrollbar,
    'v-select': vSelect
  },
  created() {
    this.initValues();
    if (Object.entries(this.data).length === 0) {
      //this.initValues()
      this.$validator.reset()
    } else {
      console.log('entrou aqui', this.data);
      this.ticket = JSON.parse(JSON.stringify(this.data));
      //this.selected = this.ticket.integracao_id;
      this.selectedProduto = {id: this.data.produto.id, label: this.data.produto.nome};
      this.selectedDuvida = {id: this.data.tipoduvida.id, label: this.data.tipoduvida.nome};
      this.selectedOrigem = {id: this.data.origem.id, label: this.data.origem.nome};
    }
    this.getOpcoes();
  }
}
</script>

<style lang="scss" scoped>


.input-select vs-select--input {
  padding: 1.0rem 2rem !important;
}

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

.con-select .vs-select--input {
  padding: 1rem 1rem !important;
}
</style>
