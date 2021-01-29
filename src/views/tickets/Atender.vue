<template>
    <div>
        <div id="widget-evoline-api-container" style="display:inline" width="10" height="20"></div>
        <side-bar v-if="responderTicket" :isSidebarActive="responderTicket" @getId="getId($route.params.id)"
                  @closeSidebar="toggleRespostaSidebar" :data="aresponder"/>
        <email v-if="enviarEmail" :isSidebarActive="enviarEmail" @getId="getId($route.params.id)"
               @closeSidebar="toggleEmailSidebar" :data="aresponder"/>
        <links v-if="listLinks" :isSidebarActive="listLinks" @getId="getId($route.params.id)"
               @closeSidebar="toggleLinksSidebar" :data="aresponder"/>
        <div class="vx-row mb-3">
            <div class="vx-col w-1/2">
                <p class="destaque text-2xl">
                    #{{ ticket.id }} <!--{{$route.params.id}}-->
                </p>
            </div>
            <div class="vx-col w-1/2">
                <p class="destaque text-2xl float-right flex items-center">
                    Status
                    <vs-chip color="primary" class="text-lg ml-4">{{ getStatus(ticket.status) }}</vs-chip>
                </p>
            </div>
        </div>
        <!-- inicio popup-->
        <div class="vs-component con-vs-popup holamundo vs-popup-primary" style="" v-if="ticket.lead" v-show="isCallActive">
            <div class="vs-popup--background"></div>
            <div class="vs-popup" style="background: rgb(255, 255, 255);">
                <header class="vs-popup--header">
                    <div class="vs-popup--title">
                    </div>
                </header>
                <div class="vs-popup--content">
                    <div class="vx-col w-full">
                        <vx-card class="p-2">
                            <div class="text-left mb-10">
                                <h6 class="mb-2"><b>Nome do lead:</b> {{ ticket.lead.nome }}</h6>
                                <h6 class="mb-2"><b>Numero de telefone:</b>
                                    <span v-if="ticket.lead.ddi">{{ '+' + ticket.lead.ddi }} </span>
                                    <span v-if="ticket.lead.ddd">{{ ' (' + ticket.lead.ddd + ') ' }} </span>
                                    <span v-if="ticket.lead.telefone">{{ ticket.lead.telefone }} </span></h6>
                                <p class="mb-2"></p>
                            </div>
                            <div class="flex items-center">
                                <div class="fill-row-loading w-full">
                                    <h3><span class="font-14">Status:</span> {{ statustext }}</h3>
                                    <div id="loading-sound" :class="{'activeLoading':activeLoading}"
                                         class="vs-con-loading__container loading-example w-full" v-show="chamada.id">
                                    </div>
                                    <div id="loading-default" :class="{'activeLoading':activeLoading}"
                                         class="vs-con-loading__container loading-example w-full" v-show="!chamada.id">
                                    </div>
                                    <h5><span class="font-14 my-2">Tempo:</span> {{ time }}</h5>
                                </div>
                            </div>
                            <div class="flex justify-center flex-wrap mt-10">
                                <vs-button size="large" class="font-bold mx-2 rounded-full" color="success" type="filled" v-if="!muted"
                                           icon-pack="material-icons" icon="volume_up" @click="mute">
                                </vs-button>
                                <vs-button size="large" class="font-bold mx-2 rounded-full" color="danger" type="filled" v-else
                                           icon-pack="material-icons" icon="volume_off" @click="mute">
                                </vs-button>
                                <vs-button size="large" class="font-bold mx-2 rounded-full" color="danger" type="filled"
                                           icon-pack="material-icons" icon="call_end" @click="desligaChamada">

                                </vs-button>
                            </div>
                            <template slot="footer">
                                <vs-divider/>
                                <div class="flex justify-between">
                                    <span class="flex items-center">
                                        <vs-icon icon="signal_cellular_alt"></vs-icon>
                                        <span>Internet: {{ status.internet }} </span>
                                    </span>
                                    <span class="flex items-center">
                                        <vs-icon icon="computer"></vs-icon>
                                        <span>computador: {{ status.computador }} </span>
                                     </span>
                                </div>
                            </template>
                        </vx-card>
                    </div>
                </div>
            </div>
        </div>
        <!-- fim popup-->
        <div class="vx-row" v-if="ticket.lead">
            <div class="vx-col w-full lg:w-1/2 pr-1">
                <div class="w-full h-full bg-white p-5 rounded-lg">
                    <div class="vx-row my-4">
                        <div class="vx-col w-1/4 text-center">
                            <img :src="getAvatar(ticket.lead.email)" width="80" class="rounded-full">
                        </div>
                        <div class="vx-col w-3/4" v-if="ticket.lead">
                            <p class="text-black text-xl font-bold">
                                {{ ticket.lead.nome }}
                            </p>
                            <p class="text-black text-xl font-bold mb-2" v-if="ticket.lead.telefone && !editable">
                                <span v-if="ticket.lead.ddi">{{ '+' + ticket.lead.ddi }} </span>
                                <span v-if="ticket.lead.ddd">{{ ' (' + ticket.lead.ddd + ') ' }} </span>
                                <span v-if="ticket.lead.telefone">{{ ticket.lead.telefone }} </span>
                                <span class="mt-5">
                                <vs-icon icon="create" icon-pack="material-icons" style="color: #9344C4;font-size: 1.2rem;cursor: pointer;margin-top: 5px"
                                         @click="editable=true;ticket.lead.telefone=ticket.lead.ddd+ticket.lead.telefone "></vs-icon>
                                </span>
                            </p>
                            <div class="vx-row my-2">
                                <div class="vx-col w-9/12" v-if="editable">
                                    <VuePhoneNumberInput name="telefone" id="phoneNumber2" v-model="ticket.lead.telefone" :translations="translations" no-flags required no-use-browser-locale
                                                         clearable :border-radius="8" show-code-on-list @update="onUpdate" :error="!payload.isValid" v-validate="'required'" :default-country-code="countryAbbr"
                                                         v-click-outside="clickOut"/>
                                </div>
                                <div class="vx-col w-3/12" v-if="editable">
                                    <span class="font-regular "></span>
                                    <vs-button class="font-bold text-white" color="#8ED839" type="filled" icon-pack="material-icons" icon="check" @click="updatePhone"></vs-button>
                                </div>
                            </div>


                            <p class="font-semibold text-md" style="color: #9B9B9B">{{ ticket.lead.email }}</p>
                            <p class="font-semibold text-md mb-4" style="color: #9B9B9B" v-if="ticket.lead.cpf">CPF:
                                {{ ticket.lead.cpf }}</p>
                            <div class="w-full flex my-5">
                                <vs-button class="font-bold rounded-full mx-2" color="primary" type="filled" icon-pack="material-icons"
                                           icon="call" @click="chamaNumero" :disabled="!conectado" v-if="conectado">
                                    Ligar
                                    <div class="h-3 w-3 inline-block rounded-full mr-2"
                                         :class="{'bg-success' : conectado,'bg-danger' : !conectado}"></div>
                                </vs-button>
                                <vx-tooltip text="Enviar whatsapp" position="top">
                                    <vs-button class="rounded-full mx-2 px-1 py-2" color="#8ED839" type="filled"
                                               @click="whatsapp(ticket)">
                                        <i class="fab fa-whatsapp text-3xl mx-2 text-white"></i>
                                    </vs-button>
                                </vx-tooltip>
                                <vx-tooltip text="Enviar Email" position="top">
                                    <vs-button class="rounded-full mx-2 px-1 py-2" color="#F23257" type="filled" @click="email(ticket)">
                                        <i class="fa fa-envelope-open text-2xl mx-2 text-white"></i>
                                    </vs-button>
                                </vx-tooltip>
                                <vx-tooltip text="Links de venda" position="top">
                                    <vs-button class="rounded-full mx-2 px-1 py-2" color="#1e1e1e" type="filled" @click="links(ticket)">
                                        <i class="fa fa-link text-2xl mx-2 text-white"></i>
                                    </vs-button>
                                </vx-tooltip>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full lg:w-1/2 p1-1">
                <div class="w-full bg-white p-5 rounded-lg h-full">
                    <div class="vx-row my-4 flex justify-between">
                        <div class="vx-col w-full lg:w-1/2">
                            <p class="text-black text-xl">
                                <b>{{ ticket.created_at | formatDateTime }}</b>
                            </p>
                            <p class="text-xl" v-if="ticket.origem">
                                Origem: {{ ticket.origem.nome }}
                            </p>
                            <vs-chip v-if="ticket.produto" :color="ticket.produto.cor" class="text-lg mt-3 py-2 font-bold">
                                {{ ticket.produto.nome }}
                            </vs-chip>
                        </div>
                        <div class="vx-col w-full lg:w-1/2">
                            <p class="text-lg font-semibold text-right mb-2" style="color: #9B9B9B">
                                Criado por:
                            </p>
                            <p class="text-right flex items-center font-bold float-right" v-if="ticket.responsavel">
                                {{ ticket.responsavel.nome || ticket.responsavel.name }}
                                <img src="@/assets/images/util/checkout.svg" width="40" class="ml-2 rounded-full"
                                     v-if="ticket.responsavel_type == 'App\\Models\\CampanhaCarrinho'">
                                <img src="@/assets/images/util/boleto.svg" width="40" class="ml-2 rounded-full"
                                     v-if="ticket.responsavel_type == 'App\\Models\\CampanhaBoleto'">
                                <img src="@/assets/images/util/whatsapp.svg" width="40" class="ml-2 rounded-full"
                                     v-if="ticket.responsavel_type == 'App\\Models\\CampanhaWhatsapp'">
                                <img src="@/assets/images/util/agendamento.svg" width="40" class="ml-2 rounded-full"
                                     v-if="ticket.responsavel_type == 'App\\Models\\CampanhaAgendamento'">
                                <img src="@/assets/images/util/cancelado.svg" width="40" class="ml-2 rounded-full"
                                     v-if="ticket.responsavel_type == 'App\\Models\\CampanhaCancelado'">
                                <img :src="null" width="40" class="ml-2 rounded-full" v-if="ticket.responsavel.avatar"
                                     :style="{ backgroundImage: 'url('+get_img_api(ticket.responsavel.avatar)+')',backgroundRepeat: 'no-repeat',backgroundSize:'cover', width: '60px', height:'60px' }">

                            </p>
                        </div>
                    </div>
                    <div class="vx-row my-3">
                        <div class="vx-col w-full">
                            <p class="text-xl">
                                {{ ticket.detalhamento }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="vx-row mt-5" v-if="ticket.lead">
            <div class="vx-col w-full">
                <vs-tabs color="primary" v-model="selectedTab">
                    <vs-tab color="primary" value="10" label="atendimento">
                        <atendimento></atendimento>
                    </vs-tab>
                    <vs-tab color="primary" :label="`histórico (${ticket.acoesrecebidas.length})`">
                        <historico :data="ticket.acoesrecebidas" :atendimentos="ticket.atendimentos"
                                   @whatsapp="whatsapp(ticket)"></historico>
                    </vs-tab>
                    <vs-tab color="primary" :label="`transações (${ticket.lead.transacaos.length})`">
                        <transacoes :items="ticket.lead.transacaos"></transacoes>
                    </vs-tab>
                    <vs-tab color="primary" :label="`solicitações de brinde (${ticket.lead.solicitacaos.length})`">
                        <div class="vx-row mt-20 flex justify-center" v-if="ticket.lead.solicitacaos.length === 0">
                            <div class="w-full lg:w-8/12 xlg:w-8/12 s:w-full sem-item">
                                <div class="w-8/12">
                                    <div>
                                        <p class="span-sem-item">Nenhum registro encontrado</p>
                                    </div>
                                    <br>
                                </div>
                            </div>
                        </div>
                        <vs-table :data="ticket.lead.solicitacaos" class="table-items" v-else>
                            <template slot="thead">
                                <vs-th>Destinatário</vs-th>
                                <vs-th>E-mail</vs-th>
                                <vs-th>Brinde</vs-th>
                                <vs-th></vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr">
                                    <vs-td>{{ tr.nome_destinatario }}</vs-td>
                                    <vs-td>{{ tr.email_destinatario }}</vs-td>
                                    <vs-td>
                                        <vs-chip color="primary" class="text-md py-2 font-bold">
                                            {{ tr.brinde.nome }}
                                        </vs-chip>
                                    </vs-td>
                                    <vs-td :data="data[indextr].status" class="td-icons flex flex-col items-center justify-center">
                                        <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                                 class="icon-grande" v-bind:style="{color: getStatusSoli(tr.status)}"
                                                 v-if="data[indextr].status"></vs-icon>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </vs-tab>
                    <vs-tab color="primary" :label="`automações de brinde (${ticket.lead.automacaos.length})`">
                        <automacaos :items="ticket.lead.automacaos" tipo="todos"></automacaos>
                    </vs-tab>
                </vs-tabs>
            </div>
        </div>

    </div>
</template>

<script>
import moduleTickets from "../../store/tickets/moduleTickets";
import moduleUsuario from "../../store/usuarios/moduleUsuario";
import atendimento from "./Atendimento";
import SideBar from "./Responder";
import Email from "./Email"
import links from "./Links"
import historico from './Historico'
import transacoes from "./Transacoes"
import automacaos from "../automacao/Listagem"
import solicitacoes from '../solicitacao_brinde/Listagem'
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import moduleLeads from "@/store/leads/moduleLeads";

export default {
    name: "Atender",
    components: {
        VuePhoneNumberInput,
        atendimento, SideBar, historico,
        Email, transacoes, automacaos, solicitacoes, links
    },
    data() {
        return {
            translations: {
                countrySelectorLabel: 'Codigo do Pais',
                countrySelectorError: 'Selecione um Pais',
                phoneNumberLabel: 'Numero do telefone',
                example: 'Exemplo :'
            },
            countries: [{"name": "Israel", "dial_code": "+972", "code": "IL"}, {
                "name": "Afghanistan",
                "dial_code": "+93",
                "code": "AF"
            }, {"name": "Albania", "dial_code": "+355", "code": "AL"}, {
                "name": "Algeria",
                "dial_code": "+213",
                "code": "DZ"
            }, {"name": "AmericanSamoa", "dial_code": "+1 684", "code": "AS"}, {
                "name": "Andorra",
                "dial_code": "+376",
                "code": "AD"
            }, {"name": "Angola", "dial_code": "+244", "code": "AO"}, {
                "name": "Anguilla",
                "dial_code": "+1 264",
                "code": "AI"
            }, {"name": "Antigua and Barbuda", "dial_code": "+1268", "code": "AG"}, {
                "name": "Argentina",
                "dial_code": "+54",
                "code": "AR"
            }, {"name": "Armenia", "dial_code": "+374", "code": "AM"}, {
                "name": "Aruba",
                "dial_code": "+297",
                "code": "AW"
            }, {"name": "Australia", "dial_code": "+61", "code": "AU"}, {
                "name": "Austria",
                "dial_code": "+43",
                "code": "AT"
            }, {"name": "Azerbaijan", "dial_code": "+994", "code": "AZ"}, {
                "name": "Bahamas",
                "dial_code": "+1 242",
                "code": "BS"
            }, {"name": "Bahrain", "dial_code": "+973", "code": "BH"}, {
                "name": "Bangladesh",
                "dial_code": "+880",
                "code": "BD"
            }, {"name": "Barbados", "dial_code": "+1 246", "code": "BB"}, {
                "name": "Belarus",
                "dial_code": "+375",
                "code": "BY"
            }, {"name": "Belgium", "dial_code": "+32", "code": "BE"}, {
                "name": "Belize",
                "dial_code": "+501",
                "code": "BZ"
            }, {"name": "Benin", "dial_code": "+229", "code": "BJ"}, {
                "name": "Bermuda",
                "dial_code": "+1 441",
                "code": "BM"
            }, {"name": "Bhutan", "dial_code": "+975", "code": "BT"}, {
                "name": "Bosnia and Herzegovina",
                "dial_code": "+387",
                "code": "BA"
            }, {"name": "Botswana", "dial_code": "+267", "code": "BW"}, {
                "name": "Brazil",
                "dial_code": "+55",
                "code": "BR"
            }, {"name": "British Indian Ocean Territory", "dial_code": "+246", "code": "IO"}, {
                "name": "Bulgaria",
                "dial_code": "+359",
                "code": "BG"
            }, {"name": "Burkina Faso", "dial_code": "+226", "code": "BF"}, {
                "name": "Burundi",
                "dial_code": "+257",
                "code": "BI"
            }, {"name": "Cambodia", "dial_code": "+855", "code": "KH"}, {
                "name": "Cameroon",
                "dial_code": "+237",
                "code": "CM"
            }, {"name": "Canada", "dial_code": "+1", "code": "CA"}, {
                "name": "Cape Verde",
                "dial_code": "+238",
                "code": "CV"
            }, {"name": "Cayman Islands", "dial_code": "+ 345", "code": "KY"}, {
                "name": "Central African Republic",
                "dial_code": "+236",
                "code": "CF"
            }, {"name": "Chad", "dial_code": "+235", "code": "TD"}, {
                "name": "Chile",
                "dial_code": "+56",
                "code": "CL"
            }, {"name": "China", "dial_code": "+86", "code": "CN"}, {
                "name": "Christmas Island",
                "dial_code": "+61",
                "code": "CX"
            }, {"name": "Colombia", "dial_code": "+57", "code": "CO"}, {
                "name": "Comoros",
                "dial_code": "+269",
                "code": "KM"
            }, {"name": "Congo", "dial_code": "+242", "code": "CG"}, {
                "name": "Cook Islands",
                "dial_code": "+682",
                "code": "CK"
            }, {"name": "Costa Rica", "dial_code": "+506", "code": "CR"}, {
                "name": "Croatia",
                "dial_code": "+385",
                "code": "HR"
            }, {"name": "Cuba", "dial_code": "+53", "code": "CU"}, {
                "name": "Cyprus",
                "dial_code": "+537",
                "code": "CY"
            }, {"name": "Czech Republic", "dial_code": "+420", "code": "CZ"}, {
                "name": "Denmark",
                "dial_code": "+45",
                "code": "DK"
            }, {"name": "Djibouti", "dial_code": "+253", "code": "DJ"}, {
                "name": "Dominica",
                "dial_code": "+1 767",
                "code": "DM"
            }, {"name": "Dominican Republic", "dial_code": "+1 849", "code": "DO"}, {
                "name": "Ecuador",
                "dial_code": "+593",
                "code": "EC"
            }, {"name": "Egypt", "dial_code": "+20", "code": "EG"}, {
                "name": "El Salvador",
                "dial_code": "+503",
                "code": "SV"
            }, {"name": "Equatorial Guinea", "dial_code": "+240", "code": "GQ"}, {
                "name": "Eritrea",
                "dial_code": "+291",
                "code": "ER"
            }, {"name": "Estonia", "dial_code": "+372", "code": "EE"}, {
                "name": "Ethiopia",
                "dial_code": "+251",
                "code": "ET"
            }, {"name": "Faroe Islands", "dial_code": "+298", "code": "FO"}, {
                "name": "Fiji",
                "dial_code": "+679",
                "code": "FJ"
            }, {"name": "Finland", "dial_code": "+358", "code": "FI"}, {
                "name": "France",
                "dial_code": "+33",
                "code": "FR"
            }, {"name": "French Guiana", "dial_code": "+594", "code": "GF"}, {
                "name": "French Polynesia",
                "dial_code": "+689",
                "code": "PF"
            }, {"name": "Gabon", "dial_code": "+241", "code": "GA"}, {
                "name": "Gambia",
                "dial_code": "+220",
                "code": "GM"
            }, {"name": "Georgia", "dial_code": "+995", "code": "GE"}, {
                "name": "Germany",
                "dial_code": "+49",
                "code": "DE"
            }, {"name": "Ghana", "dial_code": "+233", "code": "GH"}, {
                "name": "Gibraltar",
                "dial_code": "+350",
                "code": "GI"
            }, {"name": "Greece", "dial_code": "+30", "code": "GR"}, {
                "name": "Greenland",
                "dial_code": "+299",
                "code": "GL"
            }, {"name": "Grenada", "dial_code": "+1 473", "code": "GD"}, {
                "name": "Guadeloupe",
                "dial_code": "+590",
                "code": "GP"
            }, {"name": "Guam", "dial_code": "+1 671", "code": "GU"}, {
                "name": "Guatemala",
                "dial_code": "+502",
                "code": "GT"
            }, {"name": "Guinea", "dial_code": "+224", "code": "GN"}, {
                "name": "Guinea-Bissau",
                "dial_code": "+245",
                "code": "GW"
            }, {"name": "Guyana", "dial_code": "+595", "code": "GY"}, {
                "name": "Haiti",
                "dial_code": "+509",
                "code": "HT"
            }, {"name": "Honduras", "dial_code": "+504", "code": "HN"}, {
                "name": "Hungary",
                "dial_code": "+36",
                "code": "HU"
            }, {"name": "Iceland", "dial_code": "+354", "code": "IS"}, {
                "name": "India",
                "dial_code": "+91",
                "code": "IN"
            }, {"name": "Indonesia", "dial_code": "+62", "code": "ID"}, {
                "name": "Iraq",
                "dial_code": "+964",
                "code": "IQ"
            }, {"name": "Ireland", "dial_code": "+353", "code": "IE"}, {
                "name": "Israel",
                "dial_code": "+972",
                "code": "IL"
            }, {"name": "Italy", "dial_code": "+39", "code": "IT"}, {
                "name": "Jamaica",
                "dial_code": "+1 876",
                "code": "JM"
            }, {"name": "Japan", "dial_code": "+81", "code": "JP"}, {
                "name": "Jordan",
                "dial_code": "+962",
                "code": "JO"
            }, {"name": "Kazakhstan", "dial_code": "+7 7", "code": "KZ"}, {
                "name": "Kenya",
                "dial_code": "+254",
                "code": "KE"
            }, {"name": "Kiribati", "dial_code": "+686", "code": "KI"}, {
                "name": "Kuwait",
                "dial_code": "+965",
                "code": "KW"
            }, {"name": "Kyrgyzstan", "dial_code": "+996", "code": "KG"}, {
                "name": "Latvia",
                "dial_code": "+371",
                "code": "LV"
            }, {"name": "Lebanon", "dial_code": "+961", "code": "LB"}, {
                "name": "Lesotho",
                "dial_code": "+266",
                "code": "LS"
            }, {"name": "Liberia", "dial_code": "+231", "code": "LR"}, {
                "name": "Liechtenstein",
                "dial_code": "+423",
                "code": "LI"
            }, {"name": "Lithuania", "dial_code": "+370", "code": "LT"}, {
                "name": "Luxembourg",
                "dial_code": "+352",
                "code": "LU"
            }, {"name": "Madagascar", "dial_code": "+261", "code": "MG"}, {
                "name": "Malawi",
                "dial_code": "+265",
                "code": "MW"
            }, {"name": "Malaysia", "dial_code": "+60", "code": "MY"}, {
                "name": "Maldives",
                "dial_code": "+960",
                "code": "MV"
            }, {"name": "Mali", "dial_code": "+223", "code": "ML"}, {
                "name": "Malta",
                "dial_code": "+356",
                "code": "MT"
            }, {"name": "Marshall Islands", "dial_code": "+692", "code": "MH"}, {
                "name": "Martinique",
                "dial_code": "+596",
                "code": "MQ"
            }, {"name": "Mauritania", "dial_code": "+222", "code": "MR"}, {
                "name": "Mauritius",
                "dial_code": "+230",
                "code": "MU"
            }, {"name": "Mayotte", "dial_code": "+262", "code": "YT"}, {
                "name": "Mexico",
                "dial_code": "+52",
                "code": "MX"
            }, {"name": "Monaco", "dial_code": "+377", "code": "MC"}, {
                "name": "Mongolia",
                "dial_code": "+976",
                "code": "MN"
            }, {"name": "Montenegro", "dial_code": "+382", "code": "ME"}, {
                "name": "Montserrat",
                "dial_code": "+1664",
                "code": "MS"
            }, {"name": "Morocco", "dial_code": "+212", "code": "MA"}, {
                "name": "Myanmar",
                "dial_code": "+95",
                "code": "MM"
            }, {"name": "Namibia", "dial_code": "+264", "code": "NA"}, {
                "name": "Nauru",
                "dial_code": "+674",
                "code": "NR"
            }, {"name": "Nepal", "dial_code": "+977", "code": "NP"}, {
                "name": "Netherlands",
                "dial_code": "+31",
                "code": "NL"
            }, {"name": "Netherlands Antilles", "dial_code": "+599", "code": "AN"}, {
                "name": "New Caledonia",
                "dial_code": "+687",
                "code": "NC"
            }, {"name": "New Zealand", "dial_code": "+64", "code": "NZ"}, {
                "name": "Nicaragua",
                "dial_code": "+505",
                "code": "NI"
            }, {"name": "Niger", "dial_code": "+227", "code": "NE"}, {
                "name": "Nigeria",
                "dial_code": "+234",
                "code": "NG"
            }, {"name": "Niue", "dial_code": "+683", "code": "NU"}, {
                "name": "Norfolk Island",
                "dial_code": "+672",
                "code": "NF"
            }, {"name": "Northern Mariana Islands", "dial_code": "+1 670", "code": "MP"}, {
                "name": "Norway",
                "dial_code": "+47",
                "code": "NO"
            }, {"name": "Oman", "dial_code": "+968", "code": "OM"}, {
                "name": "Pakistan",
                "dial_code": "+92",
                "code": "PK"
            }, {"name": "Palau", "dial_code": "+680", "code": "PW"}, {
                "name": "Panama",
                "dial_code": "+507",
                "code": "PA"
            }, {"name": "Papua New Guinea", "dial_code": "+675", "code": "PG"}, {
                "name": "Paraguay",
                "dial_code": "+595",
                "code": "PY"
            }, {"name": "Peru", "dial_code": "+51", "code": "PE"}, {
                "name": "Philippines",
                "dial_code": "+63",
                "code": "PH"
            }, {"name": "Poland", "dial_code": "+48", "code": "PL"}, {
                "name": "Portugal",
                "dial_code": "+351",
                "code": "PT"
            }, {"name": "Puerto Rico", "dial_code": "+1 939", "code": "PR"}, {
                "name": "Qatar",
                "dial_code": "+974",
                "code": "QA"
            }, {"name": "Romania", "dial_code": "+40", "code": "RO"}, {
                "name": "Rwanda",
                "dial_code": "+250",
                "code": "RW"
            }, {"name": "Samoa", "dial_code": "+685", "code": "WS"}, {
                "name": "San Marino",
                "dial_code": "+378",
                "code": "SM"
            }, {"name": "Saudi Arabia", "dial_code": "+966", "code": "SA"}, {
                "name": "Senegal",
                "dial_code": "+221",
                "code": "SN"
            }, {"name": "Serbia", "dial_code": "+381", "code": "RS"}, {
                "name": "Seychelles",
                "dial_code": "+248",
                "code": "SC"
            }, {"name": "Sierra Leone", "dial_code": "+232", "code": "SL"}, {
                "name": "Singapore",
                "dial_code": "+65",
                "code": "SG"
            }, {"name": "Slovakia", "dial_code": "+421", "code": "SK"}, {
                "name": "Slovenia",
                "dial_code": "+386",
                "code": "SI"
            }, {"name": "Solomon Islands", "dial_code": "+677", "code": "SB"}, {
                "name": "South Africa",
                "dial_code": "+27",
                "code": "ZA"
            }, {"name": "South Georgia and the South Sandwich Islands", "dial_code": "+500", "code": "GS"}, {
                "name": "Spain",
                "dial_code": "+34",
                "code": "ES"
            }, {"name": "Sri Lanka", "dial_code": "+94", "code": "LK"}, {
                "name": "Sudan",
                "dial_code": "+249",
                "code": "SD"
            }, {"name": "Suriname", "dial_code": "+597", "code": "SR"}, {
                "name": "Swaziland",
                "dial_code": "+268",
                "code": "SZ"
            }, {"name": "Sweden", "dial_code": "+46", "code": "SE"}, {
                "name": "Switzerland",
                "dial_code": "+41",
                "code": "CH"
            }, {"name": "Tajikistan", "dial_code": "+992", "code": "TJ"}, {
                "name": "Thailand",
                "dial_code": "+66",
                "code": "TH"
            }, {"name": "Togo", "dial_code": "+228", "code": "TG"}, {
                "name": "Tokelau",
                "dial_code": "+690",
                "code": "TK"
            }, {"name": "Tonga", "dial_code": "+676", "code": "TO"}, {
                "name": "Trinidad and Tobago",
                "dial_code": "+1 868",
                "code": "TT"
            }, {"name": "Tunisia", "dial_code": "+216", "code": "TN"}, {
                "name": "Turkey",
                "dial_code": "+90",
                "code": "TR"
            }, {"name": "Turkmenistan", "dial_code": "+993", "code": "TM"}, {
                "name": "Turks and Caicos Islands",
                "dial_code": "+1 649",
                "code": "TC"
            }, {"name": "Tuvalu", "dial_code": "+688", "code": "TV"}, {
                "name": "Uganda",
                "dial_code": "+256",
                "code": "UG"
            }, {"name": "Ukraine", "dial_code": "+380", "code": "UA"}, {
                "name": "United Arab Emirates",
                "dial_code": "+971",
                "code": "AE"
            }, {"name": "United Kingdom", "dial_code": "+44", "code": "GB"}, {
                "name": "United States",
                "dial_code": "+1",
                "code": "US"
            }, {"name": "Uruguay", "dial_code": "+598", "code": "UY"}, {
                "name": "Uzbekistan",
                "dial_code": "+998",
                "code": "UZ"
            }, {"name": "Vanuatu", "dial_code": "+678", "code": "VU"}, {
                "name": "Wallis and Futuna",
                "dial_code": "+681",
                "code": "WF"
            }, {"name": "Yemen", "dial_code": "+967", "code": "YE"}, {
                "name": "Zambia",
                "dial_code": "+260",
                "code": "ZM"
            }, {"name": "Zimbabwe", "dial_code": "+263", "code": "ZW"}, {
                "name": "land Islands",
                "dial_code": "",
                "code": "AX"
            }, {"name": "Antarctica", "dial_code": null, "code": "AQ"}, {
                "name": "Bolivia, Plurinational State of",
                "dial_code": "+591",
                "code": "BO"
            }, {"name": "Brunei Darussalam", "dial_code": "+673", "code": "BN"}, {
                "name": "Cocos (Keeling) Islands",
                "dial_code": "+61",
                "code": "CC"
            }, {"name": "Congo, The Democratic Republic of the", "dial_code": "+243", "code": "CD"}, {
                "name": "Cote d´Ivoire",
                "dial_code": "+225",
                "code": "CI"
            }, {"name": "Falkland Islands (Malvinas)", "dial_code": "+500", "code": "FK"}, {
                "name": "Guernsey",
                "dial_code": "+44",
                "code": "GG"
            }, {"name": "Holy See (Vatican City State)", "dial_code": "+379", "code": "VA"}, {
                "name": "Hong Kong",
                "dial_code": "+852",
                "code": "HK"
            }, {"name": "Iran, Islamic Republic of", "dial_code": "+98", "code": "IR"}, {
                "name": "Isle of Man",
                "dial_code": "+44",
                "code": "IM"
            }, {"name": "Jersey", "dial_code": "+44", "code": "JE"}, {
                "name": "Korea, Democratic Peoples Republic of",
                "dial_code": "+850",
                "code": "KP"
            }, {"name": "Korea, Republic of", "dial_code": "+82", "code": "KR"}, {
                "name": "Lao Peoples Democratic Republic",
                "dial_code": "+856",
                "code": "LA"
            }, {"name": "Libyan Arab Jamahiriya", "dial_code": "+218", "code": "LY"}, {
                "name": "Macao",
                "dial_code": "+853",
                "code": "MO"
            }, {
                "name": "Macedonia, The Former Yugoslav Republic of",
                "dial_code": "+389",
                "code": "MK"
            }, {"name": "Micronesia, Federated States of", "dial_code": "+691", "code": "FM"}, {
                "name": "Moldova, Republic of",
                "dial_code": "+373",
                "code": "MD"
            }, {"name": "Mozambique", "dial_code": "+258", "code": "MZ"}, {
                "name": "Palestinian Territory, Occupied",
                "dial_code": "+970",
                "code": "PS"
            }, {"name": "Pitcairn", "dial_code": "+872", "code": "PN"}, {
                "name": "Réunion",
                "dial_code": "+262",
                "code": "RE"
            }, {"name": "Russia", "dial_code": "+7", "code": "RU"}, {
                "name": "Saint Barthélemy",
                "dial_code": "+590",
                "code": "BL"
            }, {
                "name": "Saint Helena, Ascension and Tristan Da Cunha",
                "dial_code": "+290",
                "code": "SH"
            }, {"name": "Saint Kitts and Nevis", "dial_code": "+1 869", "code": "KN"}, {
                "name": "Saint Lucia",
                "dial_code": "+1 758",
                "code": "LC"
            }, {"name": "Saint Martin", "dial_code": "+590", "code": "MF"}, {
                "name": "Saint Pierre and Miquelon",
                "dial_code": "+508",
                "code": "PM"
            }, {
                "name": "Saint Vincent and the Grenadines",
                "dial_code": "+1 784",
                "code": "VC"
            }, {"name": "Sao Tome and Principe", "dial_code": "+239", "code": "ST"}, {
                "name": "Somalia",
                "dial_code": "+252",
                "code": "SO"
            }, {"name": "Svalbard and Jan Mayen", "dial_code": "+47", "code": "SJ"}, {
                "name": "Syrian Arab Republic",
                "dial_code": "+963",
                "code": "SY"
            }, {"name": "Taiwan, Province of China", "dial_code": "+886", "code": "TW"}, {
                "name": "Tanzania, United Republic of",
                "dial_code": "+255",
                "code": "TZ"
            }, {"name": "Timor-Leste", "dial_code": "+670", "code": "TL"}, {
                "name": "Venezuela, Bolivarian Republic of",
                "dial_code": "+58",
                "code": "VE"
            }, {"name": "Viet Nam", "dial_code": "+84", "code": "VN"}, {
                "name": "Virgin Islands, British",
                "dial_code": "+1 284",
                "code": "VG"
            }, {"name": "Virgin Islands, U.S.", "dial_code": "+1 340", "code": "VI"}],
            editable: false,
            payload: {},
            countryAbbr: '',
            activeLoading: false,
            statustext: 'Realizando chamada',

            muted: false,
            isCallActive: false,
            conectado: false,
            status: {},
            chamada: {
                id: null,
                origem: null,
                destino: null
            },
            selectedTab: 0,
            phonevar: '',
            //whats
            responderTicket: false,
            aresponder: {},
            //email
            enviarEmail: false,
            listLinks: false,
            hh: 0,
            mm: 0,
            ss: 0,
            tempo: 1000,//Quantos milésimos valem 1 segundo?
            cron: '',
            time: '00:00:00',
        }
    },
    created() {
        if (!moduleTickets.isRegistered) {
            this.$store.registerModule('tickets', moduleTickets)
            moduleTickets.isRegistered = true
        }
        if (!moduleLeads.isRegistered) {
            this.$store.registerModule('leads', moduleLeads)
            moduleLeads.isRegistered = true
        }
        if (!moduleUsuario.isRegistered) {
            this.$store.registerModule('users', moduleUsuario)
            moduleUsuario.isRegistered = true
        }
        this.verificacao();
        this.$store.dispatch('users/getUserAuth').then(response => {
            let recaptchaScript = document.createElement('script');
            if (recaptchaScript) {
                recaptchaScript.setAttribute('src', 'https://api2.totalvoice.com.br/w3/?key=' + response.user.webphone + '&tipo=hidden&ver=2');
                document.body.appendChild(recaptchaScript)
            }
        });

    },
    methods: {
        updatePhone() {
            this.editable = false;
            console.log('updatephoner', this.ticket.lead);
            this.updateLead();
        },
        clickOut() {
            this.editable = false;
            if (this.ticket.lead.ddi == '55') {
                let sepadados = this.ticket.lead.telefone.split(' ');
                this.ticket.lead.ddd = sepadados[0];
                this.ticket.lead.telefone = sepadados[1];
            }


        },
        updateLead() {
            this.$vs.loading();
            //this.usuario.role_id = this.funcaoSelected.id;
            const formData = new FormData();
            formData.append('nome', this.ticket.lead.nome);
            formData.append('email', this.ticket.lead.email);
            formData.append('telefone', this.ticket.lead.telefone);
            if (this.ticket.lead.ddd) {
                formData.append('ddd', this.ticket.lead.ddd);
            }
            formData.append('ddi', this.ticket.lead.ddi);
            formData.append('empresa_id', this.ticket.lead.empresa_id);
            formData.append('_method', 'PUT');
            console.log(formData, 'formdata');
            this.$store.dispatch('leads/update', {dados: formData, id: this.ticket.lead.id}).then(response => {
                console.log(response)
                this.$vs.notify({
                    title: '',
                    text: "Atualizado com sucesso.",
                    iconPack: 'feather',
                    icon: 'icon-check-circle',
                    color: 'success'
                });
                this.ticket.lead.ddi = response.data.data.ddi;
                this.ticket.lead.ddd = response.data.data.ddd;
                this.ticket.lead.telefone = response.data.data.telefone;
                this.findddi();
            }).catch(erro => {
                this.$vs.notify({
                    title: '',
                    text: erro.response.data.message,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })
            }).finally(() => this.$vs.loading.close());

        },
        onUpdate(payload) {
            this.ticket.lead.ddi = payload.countryCallingCode;
            this.payload = payload;
        },
        findddi() {
            this.countries.map(country => {
                if (country.dial_code) {
                    let ddi = country.dial_code.replace(/[{+}]/g, '');
                    if (ddi == this.ticket.lead.ddi) {
                        this.countryAbbr = country.code;
                        return country.code;
                    }
                }
            })
        },
        getId(id) {
            this.$vs.loading();
            this.$store.dispatch('tickets/getId', id).then(response => {
                this.findddi();
            }).catch((erro => console.log('erro'. erro.response))).finally(() => this.$vs.loading.close());
        },
        toggleRespostaSidebar(val = false) {
            this.responderTicket = val;
        },
        toggleEmailSidebar(val = false) {
            this.enviarEmail = val;
        },
        toggleLinksSidebar(val = false) {
            this.listLinks = val;
        },
        whatsapp(dados) {
            this.aresponder = dados;
            this.toggleRespostaSidebar(true);
        },
        email(dados) {
            this.aresponder = dados;
            this.toggleEmailSidebar(true);
        },
        links(dados) {
            this.aresponder = dados;
            this.toggleLinksSidebar(true);
        },
        getStatusSoli(status) {
            switch (status) {
                case 'pendente':
                    return '#ff9f43'
                case 'aprovado':
                    return '#28c76f'
                case 'emexpedicao':
                    return '#31aef0'
                default:
                    return ''
            }
        },
        cancelarAtendimento(id) {
            this.$vs.dialog({
                color: 'danger',
                title: `Cancelar atendimento?`,
                text: 'Deseja mesmo cancelar este atendimento?',
                acceptText: 'Sim!',
                accept: () => {
                    this.$vs.loading();
                    this.$store.dispatch('tickets/cancelar', id).then(response => {
                        if (response.status) {
                            this.$vs.notify({
                                color: 'success',
                                title: '',
                                text: 'Atendimento cancelado com sucesso'
                            });
                            localStorage.removeItem('atendimento');
                            this.$router.push({name: 'tickets-list'})
                        }
                    }).catch(erro => {
                        this.$vs.notify({
                            color: 'danger',
                            title: 'Erro',
                            text: 'Algo deu errado ao deletar. Contate o suporte.'
                        })
                    }).finally(() => {
                        this.$vs.loading.close();
                    })
                }
            })
        },
        finalizar() {
            this.$vs.dialog({
                    color: 'primary',
                    title: `Finalizar atendimento?`,
                    text: 'Deseja mesmo finalizar este atendimento?',
                    acceptText: 'Sim!',
                    accept: () => {
                        this.$vs.loading();
                        this.$store.dispatch('tickets/finalizar', this.ticket).then(response => {
                            this.$vs.notify({
                                color: 'success',
                                title: '',
                                text: 'Atendimento finalizado com sucesso'
                            });
                        }).catch(erro => {
                            this.$vs.notify({
                                color: 'danger',
                                title: 'Erro',
                                text: 'Algo deu errado ao finalizar. Reinicie a página.'
                            })
                        }).finally(() => {
                            this.$vs.loading.close();
                        })
                    }
                }
            )
        },
        verificacao() {
            console.log('alou', this.$route.params)
            this.$store.dispatch('tickets/verificaDisponibilidade', this.$route.params.id).then(response => {
                if (response.status == 'ok') {
                    localStorage.removeItem("atendimento");
                    this.getId(this.$route.params.id);
                } else if (response.status == 'atendendo') {
                    this.openAlert('Ticket em atendimento', response.msg, 'danger');
                } else if (response.status == 'jaatendendo') {
                    this.openAlert('Atendimento em andamento, Ticket #' + response.id, response.msg, 'primary', response.id);
                } else {
                    this.openAlert('Este Ticket já encontra-se fechado', response.msg, 'danger');
                }
            }).catch(erro => {
                console.log('front erro', erro.response);
                //Redirecionando caso 404
                if (erro.response.status == 404) this.$router.push({name: 'page-error-404', params: {back: 'tickets-list', text: 'Retornar à listagem de Tickets'}});
            }).finally(() => this.$vs.loading.close());
            localStorage.removeItem('atendimento');
        },
        openAlert(title, text, color, id = null) {
            this.$vs.dialog({
                color: color,
                title: title,
                text: text,
                type: 'confirm',
                cancelText: 'Voltar',
                accept: () => {
                    if (id != null) {
                        this.$router.push({name: 'tickets-atender', params: {id}});
                        this.getId(id);
                    } else
                        this.$router.push({name: 'tickets-list'});
                },
                cancel: () => {
                    this.$router.push({name: 'tickets-list'});
                },
                acceptText: 'Ir até ele'
            })
        }
        ,
        sendChamada(id) {
            this.$store.dispatch('tickets/chamaNumero', {ticket: this.ticket, chamada_id: id}).then(response => {
            });
        }
        ,
        getStatus(val) {
            switch (val) {
                case 0:
                    return 'aberto';
                case 1:
                    return 'pendente';
                case 2:
                    return 'fechado';
                case 3:
                    return 'reaberto';
            }
        }
        ,

        /* TOTAL VOICE */
//Conecta o webphone para coloca-lo em operação
        conectar() {
            webphone.contentWindow.postMessage({message: 'conectar'}, '*');
        }
        ,

//desconecta o webphone - ele nao recebe nem envia mais chamadas
        desconectar() {
            webphone.contentWindow.postMessage({message: 'desconectar'}, '*');
        }
        ,

        tratamentoTelefone(ddi, ddd, telefone) {
            if (ddi) {

            } else {
                ddi = '55';
            }
            if (ddd) {
                ddd = ddd.replace(/[{()}]/g, '');
            } else {
                ddd = '';
            }
            if (telefone) {
                telefone = telefone.replace(/-/g, '')
                telefone = telefone.replace(/[{()}]/g, '')
                telefone = telefone.replace(/\s/g, '')
            } else {
                telefone = '';
            }
            if (ddi == '55') {
                console.log(ddd + telefone, 'telefone')
                return ddd + telefone;
            } else {
                console.log('00' + ddi + ddd + telefone, 'telefone')

                return '00' + ddi + ddd + telefone;
            }
        }
        ,

//telefona para um número
        chamaNumero() {
            this.isCallActive = true;

            this.$vs.loading({
                container: `#loading-sound`,
                type: 'sound',
            });
            this.$vs.loading({
                container: `#loading-default`,
                type: 'default',
            });

            let teletone = this.tratamentoTelefone(this.ticket.lead.ddi, this.ticket.lead.ddd, this.ticket.lead.telefone)
            console.log('teletone', teletone);
            webphone.contentWindow.postMessage({
                message: 'chamaNumero',
                //'numero': '61981489175',
                'numero': teletone
            }, '*');
        }
        ,
        desligaChamada() {
            webphone.contentWindow.postMessage({
                message: 'hangup'
            }, '*');
            let text = (this.chamada.id != null) ? 'Chamada encerrada e registrada no histórico do Ticket.' : 'Chamada encerrada.';
            this.$vs.notify({
                color: 'primary',
                title: '',
                text: text
            });
            this.getId(this.$route.params.id);
            /* this.$store.dispatch('tickets/desligaChamada', this.chamada).then(response => {
               this.$vs.loading.close();
             });*/
        }
        ,


//mute microfone
        mute() {
            this.muted = !this.muted;
            webphone.contentWindow.postMessage({
                message: 'mute'
            }, '*');

        }
        ,


//cronometro//

        start() {
            this.cron = setInterval(() => {
                this.timer();
            }, this.tempo);
        }
        ,
//Para o temporizador e limpa as variáveis
        stop() {
            clearInterval(this.cron);
            this.hh = 0;
            this.mm = 0;
            this.ss = 0;

            this.time = '00:00:00';
        }
        ,

//Faz a contagem do tempo e exibição
        timer() {
            this.ss++; //Incrementa +1 na variável ss

            if (this.ss == 59) { //Verifica se deu 59 segundos
                this.ss = 0; //Volta os segundos para 0
                this.mm++; //Adiciona +1 na variável mm

                if (this.mm == 59) { //Verifica se deu 59 minutos
                    this.mm = 0;//Volta os minutos para 0
                    this.hh++;//Adiciona +1 na variável hora
                }
            }
            //Cria uma variável com o valor tratado HH:MM:SS
            let format = (this.hh < 10 ? '0' + this.hh : this.hh) + ':' + (this.mm < 10 ? '0' + this.mm : this.mm) + ':' + (this.ss < 10 ? '0' + this.ss : this.ss);
            this.time = format;
        }
        ,

    },
    computed: {
        ticket() {
            return this.$store.state.tickets.ticketAtendimento;
        }
        ,
        valido() {
            let temfollow = this.ticket.follow_up != null && this.ticket.follow_up != "";
            return (temfollow && this.ticket.status_atendimento_id != '');
        }
    }
    ,
    watch: {
        '$refs':
            {
                handler: function (e) {
                }
                ,
                deep: true
            }
        ,
        phonevar: {
            handler: function (e) {
            }
            ,
            deep: true
        }
        ,
    }
    ,
    mounted() {

        //this.getAvailableCustomers();
        var vm = this;
        window.onmessage = function (e) {
            //quando receber uma ligacao
            if (e.data.message == 'chegandoChamada') {
                alert('Chegando Chamada de ' + e.data.numeroChegando + ' para: ' + e.data.numeroDestino + ' chamada_recebida_id: ' + e.data.chamadaRecebidaId);
            }
            //conectado, chamando, encerrada, conversando
            if (e.data.message == 'status') {
                vm.statustext = e.data.status;
                if (e.data.status == 'encerrada') {
                    vm.stop();
                    vm.isCallActive = false;
                } else if (e.data.status == 'chamando') {
                    vm.isCallActive = true;
                } else if (e.data.status == 'conectado') {
                    vm.conectado = true;
                } else if (e.data.status == 'conversando') {
                    vm.start();
                    vm.isCallActive = true;
                }
            }
            //o id é único e pode ser utilizado na api para recuperação de mais informações (get na api ou webhooks)
            if (e.data.message == 'chamada_id') {
                vm.chamada.id = e.data.chamada_id;
                if (e.data.chamada_id) {
                    vm.sendChamada(e.data.chamada_id);
                }

            }
            //os erros são finais
            if (e.data.message == 'status_erro') {
                alert('Sem Permissão: ' + e.data.status_erro);
                vm.isCallActive = false;
                vm.conectado = false;
            }
            //rebendo o statu0s de diagnóstico de internet e computador para verificar qualidade de ligação
            if (e.data.message == 'stats_webphone') {
                vm.status.internet = e.data.internet;
                vm.status.computador = e.data.computador;

            }
            //os erros são finais
            if (e.data.message == 'status_erro') {
                alert('Sem Permissão: ' + e.data.status_erro);
            }
        };
    }
}
</script>

<style lang="scss">
.fill-row-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;

    .loading-example {
        width: 120px;
        float: left;
        height: 120px;
        box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.05);
        border-radius: 10px;
        margin: 8px;
        transition: all 0.3s ease;

        h4 {
            z-index: 40000;
            position: relative;
            text-align: center;
            padding: 10px;
        }

        &.activeLoading {
            opacity: 0 !important;
            transform: scale(0.5);
        }
    }
}
</style>
