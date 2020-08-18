<template>
    <div>
        <div class="vx-row mb-3">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form>
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="dados.search" id="search_input" size="large" placeholder="Pesquisar por nome ou conta"/>
                            <!-- SEARCH LOADING -->
                            <!-- SEARCH ICON -->
                            <div slot="submit-icon" class="absolute top-0 right-0 py-4 px-6">
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
        </div>
        <vs-divider class="my-10"/>
        <div class="list-campanha-plano">
            <div class="vx-row">
                <div class="vx-col w-full mb-10">
                    <p class="destaque">Configure a estrutura do seu plano de brindes</p>
                </div>
            </div>
            <div class="vx-row">
                <div class="vx-col col-conquista mb-10">
                    <div class="conquista nova cursor-pointer"
                         @click="$router.push({path: '/brindes/campanhas/criar'})">
                        <div class="img-plus cursor-pointer">
                            <i class="material-icons">add</i>
                        </div>
                        <p class="nome-conq">
                            Adicionar nova campanha
                        </p>
                    </div>
                </div>
                <div class="vx-col col-conquista mb-10" v-for="item in items">
                    <div class="conquista">
                        <div class="py-2 w-full flex justify-between">
                            <div class="flex">
                                <vs-button type="border" color="danger" class="mr-2" icon-pack="feather" icon="icon-trash"></vs-button>
                                <vs-button type="border" color="primary" icon-pack="feather" icon="icon-sliders" @click="$router.push({path: '/brindes/campanhas/config/' + item.id})"></vs-button>
                            </div>
                            <vs-switch vs-icon-on="check" color="#0FB599" class="float-right switch" v-model="item.status" @click="ativaCamp(item)"/>
                        </div>
                        <div class="conquista-clicavel w-full cursor-pointer" @click="$router.push({path: '/brindes/campanhas/editar/' + item.id})">
                            <img src="@/assets/images/util/brinde.svg" class="img-conquista rounded-none my-8" width="120">
                            <p class="nome-conq">
                                {{item.nome}}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moduleBrindes from "../../store/brindes/moduleBrindes";

    export default {
        name: "Campanhas",
        data() {
            return {
                dados: {
                    search: ''
                },
                items: [],
                countSwitch: [],
            }
        },
        created() {
            if (!moduleBrindes.isRegistered) {
                this.$store.registerModule('brindes', moduleBrindes)
                moduleBrindes.isRegistered = true
            }

            this.getCampanhas();
        },
        methods: {
            getCampanhas() {
                this.$vs.loading();
                this.$store.dispatch('brindes/getCampanhas').then(response => {
                    console.log('ué', response)
                    this.items = [...response];
                    this.$vs.loading.close();
                });
            },
            ativaCamp(e) {
                console.log(this.countSwitch)
                if (this.countSwitch[e.id] !== undefined && this.countSwitch[e.id] === 3) {
                    e.status = !e.status;
                    this.$vs.notify({
                        title: '',
                        text: 'Muitas tentativas de ativação',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    });
                } else {
                    console.log(e)
                    let text = e.status ? 'Desativada' : 'Ativada';
                    let obj = {...e}
                    obj.status = !e.status;
                    /*formData.append('nome', e.nome);
                    formData.append('descricao', e.descricao);
                    formData.append('tipos', e.tipo);*/
                    this.$store.dispatch('brindes/storeCampanha', obj).then(() => {
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
                    this.countSwitch[e.id] = this.countSwitch[e.id] !== undefined ? this.countSwitch[e.id] + 1 : 1;
                }
            }
        }
    }
</script>

<style>
    [dir] .con-select .vs-select--input {
        padding: 1.4rem 2rem !important;
    }

    .list-tipo-comissao .vs-radio--label {
        font-weight: 600;
        margin-left: 2rem;
    }

    #copy-icon {
        position: absolute;
        top: 0.7rem;
        position: absolute;
        right: 30px;
        cursor: pointer;
    }

    .list-campanha-plano.disabled {
        opacity: .5;
        cursor: default !important;
    }
</style>
