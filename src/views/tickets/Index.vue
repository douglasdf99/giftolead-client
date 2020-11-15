<template>
    <div>
        <side-bar v-if="addNewDataSidebar" :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar"
                  :data="sidebarData"/>
        <div class="vx-row flex items-end lg:mt-5 sm:mt-6">
            <div class="vx-col w-full sm:w-0 md:w-0 lg:w-6/12 xlg:w-5/12 col-btn-incluir-mobile mb-3">
                <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="addNewData">
                    <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                    Incluir Ticket
                </vs-button>
                <!-- SEARCH INPUT -->
            </div>
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="search" id="search_input_trans" size="large"
                                      placeholder="Pesquisar por n de ticket ou e-mail do lead"/>
                            <!-- SEARCH LOADING -->
                            <!-- SEARCH ICON -->
                            <div slot="submit-icon" class="absolute top-0 right-0 py-3 px-6">
                                <button type="submit" class="btn-search-bar">
                                    <feather-icon icon="SearchIcon" svgClasses="h-6 w-6"/>
                                </button>
                                <!--<feather-icon icon="SearchIcon" svgClasses="h-6 w-6" />-->
                            </div>
                        </form>
                    </div>

                </div>
                <!-- SEARCH INPUT -->
            </div>
            <div class="vx-col w-full lg:w-4/12 sm:w-full">
                <label class="vs-input--label">Produto</label>
                <v-select v-model="selectedProduto" :class="'select-large-base'" :clearable="true" class="bg-white"
                          :options="produtos"/>
            </div>
            <div class="vx-col w-full lg:w-2/12 xlg:w-5/12 col-btn-incluir-desktop">
                <vs-button color="primary" class="float-right botao-incluir" type="filled" @click="addNewData">
                    <vs-icon icon-pack="material-icons" icon="check_circle" class="icon-grande"></vs-icon>
                    Incluir Ticket
                </vs-button>
                <!-- SEARCH INPUT -->

            </div>
        </div>
        <div class="vx-row mt-10 -mb-4">
            <div class="vx-col w-full">
                <vs-dropdown vs-trigger-click class="cursor-pointer float-right">
                    <div class="p-4 border border-solid d-theme-border-grey-light rounded-lg d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                        <span class="mr-2">{{ currentx * dados.length - (dados.length - 1) }} - {{
                                pagination.total - currentx * dados.length > 0 ? currentx * dados.length : pagination.total
                            }} de {{ pagination.total }}</span>
                        <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4"/>
                    </div>
                    <vs-dropdown-menu>
                        <vs-dropdown-item v-for="item in lengths" @click="dados.length = item">
                            <span>{{ item }}</span>
                        </vs-dropdown-item>
                    </vs-dropdown-menu>
                </vs-dropdown>
            </div>
        </div>
        <vs-row>
            <vs-col vs-w="12">
                <vs-tabs :color="colorx">
                    <vs-tab @click="colorx = 'rgb(16, 233, 179)'; getTickets('abertos')" color="success" value="10"
                            :label="'abertos ( ' + nums.abertos + ' )'">
                        <vs-alert :active="newTickets" class="mt-2 cursor-pointer hover:bg-white shadow text-white hover:text-dark" style="background-color: #90cdf4" @click="getTickets" icon-pack="feather" icon="icon-loader">
                            Clique aqui e atualize a listagem para visualizar os novos Tickets.
                        </vs-alert>
                        <listagem @update="updateData" @transfer="popupTransferir" @atender="atender" @detalhar="detalhar" @delete="deletar" :items="tickets"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab @click="colorx = 'rgb(51, 51, 51)'; getTickets('fechados')" color="black" :label="'fechados ( ' + nums.fechados + ' )'">
                        <vs-alert :active="newTickets" class="mt-2 cursor-pointer hover:bg-white shadow text-white hover:text-dark" style="background-color: #90cdf4" @click="getTickets" icon-pack="feather" icon="icon-loader">
                            Clique aqui e atualize a listagem para visualizar os novos Tickets.
                        </vs-alert>
                        <listagem @update="updateData" @atender="atender" @detalhar="detalhar" @delete="deletar" :items="tickets"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                    <vs-tab @click="colorx = 'warning'; getTickets('todos')" label="todos">
                        <vs-alert :active="newTickets" class="mt-2 cursor-pointer hover:bg-white shadow text-white hover:text-dark" style="background-color: #90cdf4" @click="getTickets" icon-pack="feather" icon="icon-loader">
                            Clique aqui e atualize a listagem para visualizar os novos Tickets.
                        </vs-alert>
                        <listagem @update="updateData" @transfer="popupTransferir" @atender="atender" @detalhar="detalhar" @delete="deletar" :items="tickets"></listagem>
                        <vs-pagination class="mt-2" :total="pagination.last_page"
                                       v-model="currentx"></vs-pagination>
                    </vs-tab>
                </vs-tabs>
                <nenhum-registro :add="true" module="Ticket" @addEvent="addNewData" v-if="tickets.length === 0"/>
            </vs-col>
        </vs-row>
        <!-- Prompt Reagendamento -->
        <vs-prompt
            class="calendar-event-dialog"
            title="Transferir Ticket para"
            accept-text="Confirmar"
            cancel-text="Cancelar"
            button-cancel="border"
            @cancel="selectedUser = {}; modalTransfer = false;"
            @accept="transferir"
            :active.sync="modalTransfer">
            <div class="p-5 flex justify-center w-full">
                <div class="vx-col w-full">
                    <label class="vs-input--label">Usuário</label>
                    <v-select v-model="selectedUser" :class="'select-large-base'" :clearable="false" class="bg-white w-full"
                              :options="users"/>
                </div>
            </div>
        </vs-prompt>
    </div>
</template>

<script>
import SideBar from './SideBar'
import listagem from './Listagem'
import vSelect from 'vue-select'
import moduleTickets from '@/store/tickets/moduleTickets.js'
import moduleOrigens from '@/store/origens/moduleOrigens.js'
import moduleDuvidas from '@/store/tipoDuvida/moduleDuvidas.js'
import moduleProdutos from '@/store/produtos/moduleProdutos.js'
import saveleadsConfig from "../../../saveleadsConfig";
import NenhumRegistro from "@/views/components/NenhumRegistro";
import moduleUsuario from "@/store/usuarios/moduleUsuario";

var subdomain = window.location.host.split('.')[1] ? window.location.host.split('.')[0] : 'app';
export default {
    name: "Index",
    components: {NenhumRegistro, SideBar, listagem, 'v-select': vSelect},
    channel: subdomain + '_lista-ticket',
    echo: {
        'ListaTicket': (payload, vm) => {
            console.log('evento disparado', payload);
        },
    },
    data() {
        return {
            colorx: 'rgb(16, 233, 179)',
            iconsucess: '<vs-icon icon-pack="material-icons" icon="fiber_manual_record"\n' +
                '                                           class="icon-grande text-success"\n' +
                '                                           ></vs-icon>',
            // Data Sidebar
            addNewDataSidebar: false,
            sidebarData: {},
            routeTitle: 'Contas',
            search: '',
            dados: {
                search: '',
                page: 1,
                length: 25
            },
            pagination: {
                last_page: 1,
                page: 1,
                current_page: 1
            },
            lengths: saveleadsConfig.lengths,
            currentx: 1,
            tickets: [],
            tipoTicket: 'abertos',
            nums: {},
            selectedProduto: null,
            produtos: [],
            newTickets: false,

            //modal transferência
            modalTransfer: false,
            selectedUser: {},
            users: [],
            ticket_id_transfer: null
        }
    },
    created() {
        this.$vs.loading();
        if (!moduleTickets.isRegistered) {
            this.$store.registerModule('tickets', moduleTickets)
            moduleTickets.isRegistered = true
        }

        if (!moduleProdutos.isRegistered) {
            this.$store.registerModule('produtos', moduleProdutos)
            moduleProdutos.isRegistered = true
        }

        if (!moduleOrigens.isRegistered) {
            this.$store.registerModule('origens', moduleOrigens)
            moduleOrigens.isRegistered = true
        }

        if (!moduleDuvidas.isRegistered) {
            this.$store.registerModule('duvidas', moduleDuvidas)
            moduleDuvidas.isRegistered = true
        }

        if (!moduleUsuario.isRegistered) {
            this.$store.registerModule('users', moduleUsuario)
            moduleUsuario.isRegistered = true
        }

        this.getProdutos();
        this.getTickets();
    },
    methods: {
        openAlert(title, text, color, id = null) {
            this.$vs.dialog({
                color: color,
                title: title,
                text: text,
                accept: () => {
                    if (id != null)
                        this.$router.push({path: `/tickets/atender/${id}`});
                    else
                        this.getTickets();
                },
                acceptText: color == 'danger' ? 'Ok' : 'Ir até ele'
            })
        },
        addNewData() {
            this.sidebarData = {}
            this.toggleDataSidebar(true)
        },
        updateData(obj) {
            console.log('editando', obj)
            this.sidebarData = obj
            this.toggleDataSidebar(true)
        },
        popupTransferir(ticket_id) {
            console.log('transferindo', ticket_id);
            this.modalTransfer = true;
        },
        transferir() {
            let obj = {
                ticket_id: id,
                user_id: this.selectedUser.id
            };
            this.$vs.loading();
            this.$store.dispatch('tickets/transferir', obj).then(() => {
                this.newTickets = true;
            }).finally(() => this.$vs.loading.close());
        },
        toggleDataSidebar(val = false) {
            this.addNewDataSidebar = val
        },
        getTickets(tipo = this.tipoTicket) {
            this.tipoTicket = tipo;
            this.$store.dispatch('tickets/getNums').then(response => {
                console.log('nums', response)
                this.nums = response
            });

            let url = '';
            let control = 0;//Controla entradas em cada condição
            if (this.search !== '') {
                url += 'lead.email:' + this.search + ';';
                url += 'id:' + this.search + ';';
                url += 'lead.telefone:' + this.search;
                control++;
            }

            if (this.selectedProduto) {
                if (control)
                    url += ';'

                url += 'produto_id:' + this.selectedProduto.id;
                control++;
            }

            if (control >= 2)
                url += '&searchJoin=and';

            this.dados.search = url;

            this.$store.dispatch('tickets/getTickets', {tipo: tipo, params: this.dados}).then(response => {
                console.log('retornado com sucessso', response)
                this.pagination = response;
                this.tickets = response.data;
                this.newTickets = false;
                //this.dados.page = this.pagination.current_page
                this.$vs.loading.close();
            }).finally(() => {
                this.$vs.loading.close();
            });

        },
        getProdutos() {
            this.$store.dispatch('produtos/get').then(response => {
                let arr = [...response];
                arr.forEach(item => {
                    this.produtos.push({id: item.id, label: item.nome})
                });
            });
            this.$store.dispatch('users/get').then(response => {
                this.users = [...this.arraySelect(response)];
            });
        },
        deletar(id) {
            this.$vs.dialog({
                color: 'danger',
                title: `Deletar registro`,
                text: 'Deseja deletar este registro? Procedimento irreversível',
                acceptText: 'Sim, deletar!',
                accept: () => {
                    this.$vs.loading();
                    this.$store.dispatch('deleteItem', {id: id, rota: 'tickets'}).then(() => {
                        this.$vs.notify({
                            color: 'success',
                            title: 'Sucesso',
                            text: 'A URL foi deletada com sucesso'
                        });
                        this.$vs.loading.close()
                    }).catch(erro => {
                        console.log(erro)
                        this.$vs.notify({
                            color: 'danger',
                            title: 'Erro',
                            text: 'Algo deu errado ao deletar a conta. Contate o suporte.'
                        })
                    }).finally(() => {
                        this.$vs.loading.close();
                    })
                }
            })
        },
        atender(id) {
            this.$store.dispatch('tickets/verificaDisponibilidade', id).then(response => {
                console.log('olha o response', response)
                if (response.status == 'ok')
                    this.$router.push({path: '/tickets/atender/' + id})
                else if (response.status == 'atendendo') {
                    this.openAlert('Ticket em atendimento', response.msg, 'danger');
                } else if (response.status == 'jaatendendo') {
                    this.openAlert('Atendimento em andamento, Ticket #' + response.id, response.msg, 'primary', response.id);
                } else {
                    this.openAlert('Este Ticket já encontra-se fechado', response.msg, 'danger');
                }
            });
        },
        detalhar(id) {
            this.$router.push({path: '/tickets/detalhar/' + id})
        },
        pesquisar(e) {
            e.preventDefault();
            this.$vs.loading();
            this.getTickets();
        }
    },
    watch: {
        currentx(val) {
            this.$vs.loading();
            console.log('val', val);
            this.dados.page = this.currentx;
            this.getTickets();
        },
        "$route"() {
            this.routeTitle = this.$route.meta.pageTitle
        },
        selectedProduto(val) {
            this.$vs.loading();
            this.dados.page = 1;
            this.getTickets();
        },
        dados: {
            handler(val) {
                console.log(val.length)
                if (val.length != this.pagination.per_page) {
                    this.dados.page = 1;
                    this.$vs.loading();
                    this.getTickets();
                }
            },
            deep: true
        },
    },
    mounted() {
        this.channel.listen('ListaTicket', (payload) => {
            this.tickets = this.tickets.filter(function (item) {
                console.log('Playload', payload);
                if (payload.array.tipo == "excluir") {
                    if (item.id !== payload.array.ticket.id) {
                        return item;
                    }
                } else return item
            });
            if(payload.array.tipo != "excluir" && payload.array.tipo != 'alterar') this.newTickets = true;
        });
    },
}
</script>
