<template>
    <div class="py-5">
        <div class="vx-row mb-5">
            <div class="vx-col w-full">
                <p class="destaque text-black mb-2">Informações de follow-up</p>
                <vs-textarea v-model="ticket.info" id="text-area" class="w-full bg-white" rows="6"/>
            </div>
        </div>
        <div class="vx-row mb-5">
            <div class="vx-col w-full">
                <div class="w-full p-5 rounded-lg" style="background-color: #EDEDED">
                    <div class="vx-row mb-4">
                        <div class="vx-col lg:w-3/12 md:w-1/3 sm:w-full">
                            <div class="card-finalizacao ganhou bg-white"
                                 v-bind:class="{'tipoAtivo' : (ticket.tipo == 0)}"
                                 @click="ticket.tipo = 0">
                                <span>Ganhou</span>
                                <img src="@/assets/images/util/ganhou.svg">
                            </div>
                        </div>
                        <div class="vx-col lg:w-3/12 md:w-1/3 sm:w-full">
                            <div class="card-finalizacao aguardando bg-white"
                                 v-bind:class="{'tipoAtivo' : (ticket.tipo == 1)}"
                                 @click="ticket.tipo = 1">
                                <span>Aguardando</span>
                                <img src="@/assets/images/util/aguardando.svg">
                            </div>
                        </div>
                        <div class="vx-col lg:w-3/12 md:w-1/3 sm:w-full">
                            <div class="card-finalizacao perdeu bg-white"
                                 v-bind:class="{'tipoAtivo' : (ticket.tipo == 2)}"
                                 @click="ticket.tipo = 2">
                                <span>Perdeu</span>
                                <img src="@/assets/images/util/perdeu.svg">
                            </div>
                        </div>
                    </div>
                    <div class="vx-row" v-if="ticket.tipo == 0">
                        <div class="vx-col w-full">
                            <p class="destaque text-black">
                                Como você concluiu a venda?
                            </p>
                        </div>
                        <div class="vx-col w-full lg:w-11/12 ml-auto">
                            <ul class="list-tipo-comissao mt-10">
                                <li class="my-3">
                                    <vs-radio color="dark" v-model="ticket.conclusao" vs-value="1">
                                        Vendido no cartão
                                    </vs-radio>
                                </li>
                                <li>
                                    <vs-radio color="dark" v-model="ticket.conclusao" vs-value="0">
                                        Vendido no boleto
                                    </vs-radio>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="vx-row" v-if="ticket.tipo == 1">
                        <div class="vx-col w-full mb-3">
                            <p class="destaque text-black">
                                Qual dia e horário deseja fazer o agenda do novo atendimento?
                            </p>
                        </div>
                        <div class="vx-col w-full lg:w-3/12">
                            <flat-pickr :config="configdateTimePicker" v-model="datetime" id="teste" class="flatpickr-custom w-full rounded-lg px-5 py-4 border-none cursor-pointer ml-0"
                                        placeholder="Agendar para uma data futura"/>
                        </div>
                        <div class="vx-col w-full lg:w-11/12 ml-auto">
                            <ul class="list-tipo-comissao mt-10">
                                <li class="mb-3">
                                    <vs-radio color="dark" v-model="ticket.motivoAguardando" vs-value="whatsapp">
                                        Andamento no whatsapp
                                    </vs-radio>
                                </li>
                                <li class="mb-3">
                                    <vs-radio color="dark" v-model="ticket.motivoAguardando" vs-value="telefone">
                                        Não atendeu telefone
                                    </vs-radio>
                                </li>
                                <li class="mb-3">
                                    <vs-radio color="dark" v-model="ticket.motivoAguardando" vs-value="email">
                                        Andamento por e-mail
                                    </vs-radio>
                                </li>
                                <li class="mb-3">
                                    <vs-radio color="dark" v-model="ticket.motivoAguardando" vs-value="contato">
                                        Pediu novo contato
                                    </vs-radio>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="vx-row" v-if="ticket.tipo == 2">
                        <div class="vx-col w-full">
                            <p class="destaque text-black">
                                Por que você não concluiu a venda?
                            </p>
                        </div>
                        <div class="vx-col w-full lg:w-11/12 ml-auto">
                            <ul class="list-tipo-comissao mt-10">
                                <li class="mb-3">
                                    <vs-radio color="dark" v-model="ticket.motivoPerda" vs-value="incorreto">
                                        Número incorreto
                                    </vs-radio>
                                </li>
                                <li class="mb-3">
                                    <vs-radio color="dark" v-model="ticket.motivoPerda" vs-value="naovendido">
                                        Não vendido
                                    </vs-radio>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="ticket.tipo == 0">
            <div class="vx-row mb-10">
                <div class="vx-col w-full">
                    <vs-checkbox color="dark" v-model="ticket.hasbrinde">
                        <span class="label-bold-underline">Inserir brinde físico para esta venda</span>
                    </vs-checkbox>
                </div>
            </div>
            <transition name="fade">
                <div class="vx-row mb-10" v-if="ticket.hasbrinde">
                    <div class="vx-col w-full mb-4">
                        <p class="text-black text-xl font-bold">
                            Preencha com as informações do brinde
                        </p>
                    </div>
                    <div class="vx-col w-full lg:w-1/3">
                        <span class="font-regular mb-2">Selecione o brinde</span>
                        <v-select v-model="selectedBrinde" :class="'select-large-base'" :clearable="false"
                                  style="background-color: white"
                                  :options="brindes" v-validate="'required'" name="brinde"/>
                    </div>
                    <div class="vx-col w-full lg:w-1/3">
                        <span class="font-regular mb-2">Nome do destinatário</span>
                        <vs-input class="w-full" v-model="ticket.nome_destinatario" size="large"/>
                    </div>
                    <div class="vx-col w-full lg:w-1/3">
                        <span class="font-regular mb-2">E-mail para solicitação de endereço</span>
                        <vs-input class="w-full" v-model="ticket.email_endereco" size="large"/>
                    </div>
                </div>
            </transition>
            <vs-divider class="mb-10"/>
            <div class="vx-row mb-10">
                <div class="vx-col w-full">
                    <vs-checkbox color="dark" v-model="ticket.hasupsell">
                        <span class="label-bold-underline">Oferecer um produto de Upsell</span>
                    </vs-checkbox>
                </div>
            </div>
            <transition name="fade">
                <div class="vx-row mb-10" v-if="ticket.hasupsell">
                    <div class="vx-col w-full mb-4">
                        <p class="text-black text-xl font-bold">
                            Qual produto você ofereceu?
                        </p>
                    </div>
                    <div class="vx-col w-full lg:w-1/3 mb-10">
                        <span class="font-regular mb-2">Selecione o produto</span>
                        <v-select v-model="selectedUpsell" :class="'select-large-base'" :clearable="false"
                                  style="background-color: white"
                                  :options="produtos" v-validate="'required'" name="brinde"/>
                    </div>
                    <div class="vx-col w-full">
                        <p class="destaque text-black mb-3">Nas seguintes condições abaixo</p>
                        <div class="w-full text-black text-sm p-3" style="background-color: #EDEDED">
                            A comissão de só é gerada como Upsell quando a transação do produto de Upsell for recebida
                            com
                            status de aprovada ou de boleto gerado no prazo máximo de 30 minutos após a venda que deu
                            origem. Caso a solicitação ultrapasse este prazo, será necessário lançar um ticket
                            especifico
                            para a venda do produto de upsell.
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
    import vSelect from 'vue-select'
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import {Portuguese} from 'flatpickr/dist/l10n/pt.js';

    export default {
        name: "Atendimento",
        components: {
            'v-select': vSelect,
            flatPickr
        },
        data() {
            return {
                ticket: {
                    tipo: 0,
                    conclusao: 1,
                    hasbrinde: 0,
                    hasupsell: 0,
                    motivoAguardando: 'whatsapp',
                    motivoPerda: 'incorreto'
                },
                selectedBrinde: {},
                brindes: [],
                selectedUpsell: {},
                produtos: [],
                datetime: null,

                configdateTimePicker: {
                    enableTime: true,
                    dateFormat: 'Y-m-d H:i',
                    altInput: true,
                    altFormat: 'd/m/Y H:i',
                    locale: Portuguese,
                    minDate: moment().format('Y-MM-DD H:mm')
                },
            }
        },
    }
</script>

<style scoped>

</style>