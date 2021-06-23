<template>
    <div>
        <div class="vx-row">
            <vs-tabs :position="isSmallerScreen ? 'top' : 'left'" class="tabs-leads tabs-shadow-none tabs-detalhe"
                     id="profile-tabs"
                     :key="isSmallerScreen">

                <!-- GENERAL -->
                <vs-tab label="Dados do contato">
                    <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
                        <div class="vx-row mb-4">
                            <div class="vx-col w-1/2">
                                <p class="font-regular mb-2">Nome</p>
                                <vs-input class="w-full" v-model="lead.nome" size="large" v-validate="'required'"/>
                                <span class="text-danger text-sm"
                                      v-show="errors.has('nome')">Preenchimento obrigatório</span>
                            </div>
                            <div class="vx-col w-1/2">
                                <p class="font-regular mb-2">CPF</p>
                                <vs-input class="w-full" v-model="lead.cpf" size="large" v-mask="'###.###.###-##'"/>
                            </div>
                        </div>
                        <div class="vx-row mb-4">
                            <div class="vx-col w-full lg:w-6/12">
                                <p class="font-regular mb-2">Telefone</p>
                                <div class="vx-row">
                                    <div class="vx-col w-9/12" v-if="lead.id">
                                        <VuePhoneNumberInput name="telefone" id="phoneNumber2" v-model="lead.telefone"
                                                             :translations="translations" no-flags required
                                                             clearable :border-radius="8" show-code-on-list
                                                             @update="onUpdate"
                                                             v-validate="'required'"
                                                             :default-country-code="countryAbbr"/>
                                    </div>
                                </div>
                            </div>
                            <div class="vx-col w-full lg:w-6/12">
                                <p class="font-regular mb-2">E-mail</p>
                                <vs-input class="w-full" v-model="lead.email" disabled size="large"/>
                                <span class="text-danger text-sm"
                                      v-show="errors.has('email')">Preenchimento obrigatório</span>
                            </div>
                        </div>
                        <div class="vx-row relative">
                            <div class="vx-col w-full">
                                <vs-button class="mr-3" color="primary" type="filled" @click="salvar"
                                           :disabled="isValid">
                                    Salvar
                                </vs-button>
                            </div>
                        </div>
                    </div>
                </vs-tab>
                <vs-tab :label="'Transações (' + lead.transacaos.length + ')'">
                    <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
                        <div class="vx-col w-full">
                            <p class="black font-bold text-x1 my-5">Histórico de transações</p>
                            <vs-table :data="lead.transacaos" class="table-items">
                                <template slot="thead">
                                    <vs-th>Transação</vs-th>
                                    <vs-th>Lead</vs-th>
                                    <vs-th>Data e Hora</vs-th>
                                    <vs-th>Comissão do Hotmart</vs-th>
                                    <vs-th>Produto</vs-th>
                                    <vs-th>Status</vs-th>
                                </template>

                                <template slot-scope="{data}">
                                    <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="mb-3">
                                        <vs-td :data="tr.transaction">
                                            {{ tr.transaction }}
                                        </vs-td>
                                        <vs-td :data="lead.nome">
                                            <span class="destaque">{{ lead.nome }}</span>
                                        </vs-td>
                                        <vs-td :data="tr.confirmation_purchase_date">
                                            <span class="destaque">{{ tr.confirmation_purchase_date | formatDate
                                                }}</span>
                                        </vs-td>
                                        <vs-td>
                                            <span class="preco">R$ {{ formatPrice(tr.full_price) }}</span>
                                        </vs-td>
                                        <vs-td>
                                            <vs-chip :color="tr.produto.cor" class="product-order-status">
                                                {{ tr.produto.nome }}
                                            </vs-chip>
                                        </vs-td>
                                        <vs-td class="flex justify-center">
                                            <vx-tooltip :text="status[0]" position="top"
                                                        v-for="(status, index) in hotmartStatus" :key="index"
                                                        v-if="index === tr.status">
                                                <vs-chip :color="status[1]"
                                                         class="product-order-status rounded-full"></vs-chip>
                                            </vx-tooltip>
                                        </vs-td>
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </div>
                    </div>
                </vs-tab>
                <vs-tab :label="'Tickets (' + tickets.length + ')'">
                    <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
                        <div class="vx-col w-full">
                            <p class="black font-bold text-x1 my-5">Histórico de transações</p>
                            <vs-table :data="tickets" class="table-items">
                                <template slot="thead">
                                    <vs-th>ID</vs-th>
                                    <vs-th>Responsável</vs-th>
                                    <vs-th>Detalhamento</vs-th>
                                    <vs-th>Status</vs-th>
                                    <vs-td></vs-td>
                                </template>

                                <template slot-scope="{data}">
                                    <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="mb-3">
                                        <vs-td :data="tr.id">
                                            {{ tr.id }}
                                        </vs-td>
                                        <vs-td>
                                            <identify-responsible :ticket="tr"/>
                                        </vs-td>
                                        <vs-td>
                                            {{tr.detalhamento}}
                                        </vs-td>
                                        <vs-td class="flex items-center justify-center">
                                            <vx-tooltip text="Aberto">
                                                <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                                         class="icon-grande text-success" v-if="tr.status == 0"></vs-icon>
                                            </vx-tooltip>
                                            <vx-tooltip text="Pendente">
                                                <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                                         class="icon-grande text-warning" v-if="tr.status == 1"></vs-icon>
                                            </vx-tooltip>
                                            <vx-tooltip text="Fechado">
                                                <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                                         class="icon-grande text-black" v-if="tr.status == 2"></vs-icon>
                                            </vx-tooltip>
                                            <vx-tooltip text="Reaberto">
                                                <vs-icon icon-pack="material-icons" icon="fiber_manual_record"
                                                         class="icon-grande text-primary" v-if="tr.status == 3"></vs-icon>
                                            </vx-tooltip>
                                        </vs-td>
                                        <vs-td>
                                            <i class="material-icons hover:text-primary cursor-pointer" v-if="$acl.check('ticket_detalhar')"
                                               @click="visualizar(tr.id)">visibility</i>
                                        </vs-td>
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </div>
                    </div>
                </vs-tab>
                <vs-tab :label="'Solicitações (' + lead.solicitacaos.length + ')'">
                    <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
                        <div class="vx-col w-full">
                            <p class="black font-bold text-x1 my-5">Histórico de transações</p>
                            <vs-table :data="lead.solicitacaos" class="table-items">
                                <template slot="thead">
                                    <vs-th>Email</vs-th>
                                    <vs-th>Destinatário</vs-th>
                                    <vs-th>Brinde</vs-th>
                                </template>

                                <template slot-scope="{data}">
                                    <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="mb-3">
                                        <vs-td :data="tr.transaction">
                                            {{ tr.nome_destinatario }}
                                        </vs-td>
                                        <vs-td :data="lead.nome">
                                            {{ tr.email_destinatario }}
                                        </vs-td>
                                        <vs-td :data="tr.confirmation_purchase_date">
                                            {{ tr.brinde.nome }}
                                        </vs-td>
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </div>
                    </div>
                </vs-tab>
                <vs-tab :label="'Envio de Brindes (' + lead.automacaos.length + ')'">
                    <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
                        <div class="vx-col w-full">
                            <p class="black font-bold text-x1 my-5">Histórico de transações</p>
                            <vs-table :data="lead.automacaos" class="table-items">
                                <template slot="thead">
                                    <vs-th>Inserção</vs-th>
                                    <vs-th>Brinde</vs-th>
                                    <vs-th>E-mail</vs-th>
                                    <vs-th>Token</vs-th>
                                    <vs-th>Ordem de envio</vs-th>
                                    <vs-th>Status</vs-th>
                                </template>

                                <template slot-scope="{data}">
                                    <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="mb-3">
                                        <vs-td>
                                            <p class="font-bold">{{ getResponsavel(tr) }}</p>
                                        </vs-td>
                                        <vs-td>
                                            <p class="font-bold">{{ tr.brinde.nome }}</p>
                                        </vs-td>
                                        <vs-td>
                                            <vs-icon icon-pack="material-icons" icon="watch_later" color="gray"
                                                     v-if="tr.eventos.length == 0"
                                                     class="text-2xl"/>
                                            <vs-icon icon-pack="material-icons" icon="cancel" color="danger"
                                                     v-if="getEventoRed(tr)"
                                                     class="text-2xl"/>
                                            <vs-icon icon-pack="material-icons" icon="check" color="success"
                                                     v-if="getEventoGreen(tr)"
                                                     class="text-2xl"/>
                                        </vs-td>
                                        <vs-td>
                                            {{ tr.uuid }}
                                        </vs-td>
                                        <vs-td>
                                            <p class="font-bold flex items-center" v-bind:class="getOrdemColor(tr)">
                                                {{ getOrdemEnvio(tr) }}
                                                <i class="material-icons ml-3" v-bind:class="getOrdemColor(tr)">fiber_manual_record</i>
                                            </p>
                                        </vs-td>
                                        <vs-td class="flex">
                                            <vx-tooltip :text="tr.rastreio" v-if="tr.rastreio != null" class="mb-1">
                                                <img src="@/assets/images/util/delivery-icon.svg" width="40px"
                                                     class="cursor-pointer" @click="copyText(tr.rastreio)">
                                            </vx-tooltip>
                                            <vx-tooltip :text="'Expedição Nº '+tr.expedicao.id" class="flex"
                                                        v-if="tr.expedicao && tr.expedicao != null">
                                                <img src="@/assets/images/util/expedicao-icon.svg" width="25px" class="ml-2">
                                            </vx-tooltip>
                                        </vs-td>
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </div>
                    </div>
                </vs-tab>
                <vs-tab :label="'Historico (' + lead.acoesrecebidas.length + ')'">
                    <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
                        <div class="vx-col w-full">
                            <p class="black font-bold text-x1 my-5">Histórico sofrido</p>
                            <ul class="vx-timeline">
                                <li v-for="(historico, index) in lead.acoesrecebidas" :key="index">
                                    <div class="timeline-icon p-0" v-if="historico.causer">
                      <span class="feather-icon select-none relative">
                        <img :src="get_img_api(historico.causer.avatar)" width="40" height="40" class="rounded-full"
                             v-if="IsUser(historico.causer_type)">
                        <img src="@/assets/images/util/boleto.svg" width="40" height="40" class="rounded-full"
                             v-if="historico.causer_type == 'App\Models\CampanhaBoleto'">
                        <img src="@/assets/images/util/whatsapp.svg" width="40" height="40" class="rounded-full"
                             v-if="historico.causer_type == 'App\Models\CampanhaWhatsapp'">
                        <img src="@/assets/images/util/agendamento.svg" width="40" height="40" class="rounded-full"
                             v-if="historico.causer_type == 'App\Models\CampanhaAgendamento'">
                        <img src="@/assets/images/util/cancelado.svg" width="40" height="40" class="rounded-full"
                             v-if="historico.causer_type == 'App\Models\CampanhaCancelado'">
                      </span>
                                    </div>
                                    <div class="timeline-info">
                                        <div class="" v-if="historico.causer">
                                            <p class="font-semibold" v-if="IsUser(historico.causer_type)">
                                                {{ historico.causer.name }}</p>
                                            <p class="font-semibold" v-else>{{ historico.causer.nome }}</p>
                                        </div>
                                        <span class="activity-desc">{{ historico.description }}</span>
                                        <div class="vx-row my-3">
                                            <div class="vx-col w-full">
                                                <vs-button class="rounded-full mx-3 px-3 py-2"
                                                           v-if="historico.properties && historico.properties.tipo == 'whatsapp'"
                                                           color="#8ED839" type="filled"
                                                           @click="$emit('whatsapp')">
                                <span class="text-md font-bold flex items-center justify-center">
                                    <i class="fab fa-whatsapp text-2xl mr-3 text-white"></i>
                                Mensagem enviada
                                </span>
                                                </vs-button>
                                                <vs-button class="rounded-full mx-3 px-3 py-2"
                                                           v-if="historico.properties && historico.properties.tipo == 'email'"
                                                           color="#F23257"
                                                           type="filled"
                                                           @click="exibirMensagem = true; mensagem = historico.properties.mensagem">
                                <span class="text-md font-bold flex items-center justify-center">
                                    <i class="fa fa-envelope-open text-2xl mr-3 text-white"></i>
                                Mensagem enviada
                                </span>
                                                </vs-button>
                                                <vs-button class="rounded-full mx-3 px-3 py-2"
                                                           v-if="historico.properties && historico.properties.identificacao"
                                                           color="#F23257"
                                                           type="filled"
                                                           @click="exibirLigacao = true; chamadaResgatada = historico.properties; consultaChamada(historico.properties.id)">
                                <span class="text-md font-bold flex items-center justify-center">
                                    <i class="fa fa-phone text-2xl mr-3 text-white"></i>
                                Chamada
                                </span>
                                                </vs-button>
                                            </div>
                                        </div>
                                    </div>
                                    <small
                                        class="text-grey activity-e-time">{{ historico.created_at | formatDateHumanize
                                        }}</small>
                                </li>
                            </ul>
                        </div>
                    </div>
                </vs-tab>
            </vs-tabs>
        </div>
    </div>
</template>

<script>
import moduleLeads from '@/store/leads/moduleLeads.js'
import moduleTickets from "../../store/tickets/moduleTickets";
import Tooltip from "../components/vuesax/tooltip/Tooltip";
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import IdentifyResponsible from "../components/IdentifyResponsible";


export default {
    name: "Detalhe",
    components: {IdentifyResponsible, Tooltip, VuePhoneNumberInput},
    data() {
        return {
            lead: {
                transacaos: [],
                solicitacaos: [],
                automacaos: [],
                acoesrecebidas: [],
            },
            tickets: [],
            hotmartStatus: {
                started: ['Iniciado', '#3498db'],
                billet_printed: ['Boleto Impresso', '#848a91'],
                expired: ['Expirado', '#848a91'],
                pending_analysis: ['Pendente', '#848a91'],
                delayed: ['Atrasado', '#e74c3c'],
                canceled: ['Cancelado', '#e74c3c'],
                approved: ['Aprovado', '#2ecc71'],
                completed: ['Concluído', '#2ecc71'],
                chargeback: ['Chargeback', '#e74c3c'],
                blocked: ['Bloqueado', '#848a91'],
                refunded: ['Devolvido', '#e74c3c'],
                admin_free: ['Cadastrado', '#848a91'],
                dispute: ['Disputa', '#e74c3c']
            },
            translations: {
                countrySelectorLabel: 'Codigo do Pais',
                countrySelectorError: 'Selecione um Pais',
                phoneNumberLabel: 'Numero do telefone',
                example: 'Exemplo :'
            },
            countryAbbr: '',
            countries: [{"name": "Israel", "dial_code": "+972", "code": "IL"},
                {
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
            payload: {}
        }
    },
    created() {
        if (!moduleLeads.isRegistered) {
            this.$store.registerModule('leads', moduleLeads)
            moduleLeads.isRegistered = true
        }
        if (!moduleTickets.isRegistered) {
            this.$store.registerModule('tickets', moduleTickets)
            moduleTickets.isRegistered = true
        }

        if (this.$route.name === 'leads-detalhe') {
            this.getId(this.$route.params.id);
        }
    },
    methods: {
        clickOut() {
            this.editable = false;
            if (this.lead.ddi == '55') {
                let sepadados = this.lead.telefone.split(' ');
                this.lead.ddd = sepadados[0];
                this.lead.telefone = sepadados[1];
            }
        },
        onUpdate(payload) {
            this.lead.ddi = payload.countryCallingCode;
            this.payload = payload;
        },
        findddi() {
            this.countries.map(country => {
                if (country.dial_code) {
                    let ddi = country.dial_code.replace(/[{+}]/g, '');
                    if (ddi == this.lead.ddi) {
                        this.countryAbbr = country.code;
                        return country.code;
                    }
                }
            })
        },
        IsUser(type) {
            return (type == `App\\Models\\User`) ? true : false;
        },
        getId(id) {
            this.$vs.loading();
            this.$store.dispatch('leads/getId', id).then(data => {
                console.log(data);
                this.lead = data;
                this.lead.telefone = this.lead.ddd + this.lead.telefone;
                this.lead.lead_produtos.forEach(item => {//Separando os tickets registrados para este lead
                    if(item.tickets != null){
                        this.tickets.push(item.tickets)
                    }
                    console.log('ticketsassss', this.tickets)
                })
                this.findddi();
            }).catch(erro => {
                console.log('front erro', erro);
                //Redirecionando caso 404
                if (erro.response.status == 404) this.$router.push({
                    name: 'page-error-404',
                    params: {back: 'leads-list', text: 'Retornar à listagem de Leads'}
                });
            }).finally(() => this.$vs.loading.close());
        },
        getResponsavel(obj) {
            switch (obj.responsavel_type) {
                case 'App\\Models\\User':
                    return obj.responsavel.name;
                default:
                    return obj.responsavel.nome;
            }
        },
        getOrdemEnvio(obj) {
            if (obj.endereco == null)
                return 'Pendente'
            else
                return 'Preenchida'
        },
        getOrdemColor(obj) {
            if (obj.endereco == null)
                return 'text-warning'
            else
                return 'text-primary'
        },
        getEventoRed(obj) {
            console.log('obj', obj)
            console.log(obj.eventos[obj.eventos.length - 1])
            if (obj.eventos.length > 0)
                return obj.eventos[obj.eventos.length - 1].resposta == 'error';
            else
                return false;
        },
        getEventoGreen(obj) {
            if (obj.eventos.length > 0)
                return obj.eventos[obj.eventos.length - 1].resposta == 'success';
            else
                return false;
        },
        formatPrice(value) {
            let val = (value / 1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        copyText(val) {
            const thisIns = this;
            this.$copyText(val).then(function () {
                thisIns.$vs.notify({
                    title: 'Success',
                    text: 'Código de rastreio copiado para sua área de transferência',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check-circle'
                })
            }, function () {
                thisIns.$vs.notify({
                    title: 'Failed',
                    text: 'Erro ao copiar código',
                    color: 'danger',
                    iconPack: 'feather',
                    position: 'top-center',
                    icon: 'icon-alert-circle'
                })
            })
        },
        salvar() {
            this.clickOut();
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.$vs.loading();
                    //this.usuario.role_id = this.funcaoSelected.id;
                    const formData = new FormData();
                    formData.append('nome', this.lead.nome);
                    formData.append('email', this.lead.email);
                    formData.append('cpf', this.lead.cpf);
                    formData.append('telefone', this.lead.telefone);
                    formData.append('ddd', this.lead.ddd);
                    formData.append('ddi', this.lead.ddi);
                    formData.append('empresa_id', this.lead.empresa_id);
                    formData.append('_method', 'PUT');
                    this.$store.dispatch('leads/update', {dados: formData, id: this.lead.id}).then(response => {
                        console.log('response', response);
                        this.$vs.notify({
                            title: '',
                            text: "Atualizado com sucesso.",
                            iconPack: 'feather',
                            icon: 'icon-check-circle',
                            color: 'success'
                        });
                        //this.$router.push({name: 'leads'});
                    }).catch(erro => {
                        this.$vs.notify({
                            title: '',
                            text: erro.response.data.message,
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    }).finally(() => {
                        this.$vs.loading.close()
                        this.lead.telefone = this.lead.ddd + this.lead.telefone

                    });
                } else {
                    this.$vs.notify({
                        title: 'Error',
                        text: 'verifique os erros específicos',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                }
            })
        },
        consultaChamada(id) {
            this.$vs.loading({
                container: `#loading-chamada`,
                type: 'default',
            });
            this.$store.dispatch('tickets/consultaChamada', {identificacao: id}).then(response => {
                console.log('response consultaChamada', response);

                this.detalheChamada = response
            });
        },
        tipoChamada(val) {
            switch (val) {
                case 'movel':
                    return 'Celular';
                case 'ramal':
                    return 'Interno';
                default:
                    return val;
            }
        },
        visualizar(id){
            let routeData = this.$router.resolve({path: '/tickets/detalhar/' + id});
            window.open(routeData.href, '_blank');
        }
    },
    computed: {
        isSmallerScreen() {
            return this.$store.state.windowWidth < 768
        },
        isValid() {
            return this.errors.any();
        },
    }
}
</script>

<style scoped>
.main-info-lead {
    font-size: 1.5rem;
    font-weight: 700;
}

.secundary-info-lead {
    color: #9B9B9B;
    font-size: 1.2rem;
    font-weight: 600;
}
</style>
