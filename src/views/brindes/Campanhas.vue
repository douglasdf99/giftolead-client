<template>
    <div>
        <div class="vx-row mb-3">
            <div class="vx-col w-full sm:w-full md:w-full lg:w-6/12 xlg:w-5/12">
                <div class="flex items-center">
                    <div class="relative w-full">
                        <!-- SEARCH INPUT -->
                        <form @submit="pesquisar">
                            <vs-input autocomplete
                                      class="w-full vs-input-shadow-drop vs-input-no-border d-theme-input-dark-bg"
                                      v-model="dados.search" id="search_input" size="large" placeholder="Pesquisar por nome da campanha"/>
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
                <div class="vx-col col-conquista mb-10" v-if="$acl.check('brinde_campanha_adicionar')">
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
                    <div class="conquista" v-bind:class="{'desativado': !item.status}">
                        <div class="py-2 w-full flex justify-between">
                            <div class="flex">
                                <vs-button @click="deletar(item.id)" :disabled="!$acl.check('brinde_campanha_deletar')" type="border" color="danger" class="mr-2" icon-pack="feather" icon="icon-trash"></vs-button>
                                <vs-button type="border" color="primary" :disabled="!$acl.check('brinde_campanha_editar')" icon-pack="feather" icon="icon-sliders" @click="$router.push({path: '/brindes/campanhas/config/' + item.id})"></vs-button>
                            </div>
                            <vs-switch vs-icon-on="check" :disabled="!$acl.check('brinde_campanha_editar')" color="#0FB599" class="float-right switch" v-model="item.status" @click="ativaModal(item)"/>
                        </div>
                        <div class="conquista-clicavel w-full cursor-pointer" @click="editar(item.id)">
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
                this.$store.dispatch('brindes/getCampanhas', this.dados).then(response => {
                    console.log('ué', response)
                    this.items = [...response];
                    this.$vs.loading.close();
                });
            },
            ativaModal(obj){
                if(obj.brinde.ativo){
                    if(!obj.status){
                        this.$vs.dialog({
                            type: 'confirm',
                            color: 'danger',
                            title: `Você realmente deseja ativar a campanha?`,
                            text: 'Mais de uma campanha ativa para o mesmo produto pode ocasionar duplicação de brinde.',
                            acceptText: 'Ativar',
                            cancelText: 'Cancelar',
                            accept: () => {this.ativaCamp(obj);},
                            cancel: () => {obj.status = !obj.status}

                        });
                    } else {
                        this.ativaCamp(obj);
                    }
                } else {
                    obj.status = !obj.status;
                    this.$vs.notify({
                        color: 'primary',
                        text: 'O brinde da campanha encontra-se desativado.'
                    });
                }
            },
            ativaCamp(obj) {
                console.log('status', obj)
                console.log('status2', obj.status)
                let obj2 = {...obj}
                obj2.status = obj.status === true ? 1 : 0;
                let text = obj2.status ? 'Ativada' : 'Desativada';
                if (this.countSwitch[obj.id] !== undefined && this.countSwitch[obj.id] === 3) {
                    obj.status = !obj.status;
                    this.$vs.notify({
                        title: '',
                        text: 'Muitas tentativas de ativação',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    });
                } else {
                    this.$store.dispatch('brindes/storeCampanha', obj2).then(() => {
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
                    this.countSwitch[obj.id] = this.countSwitch[obj.id] !== undefined ? this.countSwitch[obj.id] + 1 : 1;
                }
            },
            deletar(id) {
                this.$vs.dialog({
                    color: 'danger',
                    title: `Deletar registro?`,
                    text: 'Deseja deletar este registro? Procedimento irreversível',
                    acceptText: 'Sim, deletar!',
                    accept: () => {
                        this.$vs.loading();
                        this.$store.dispatch('deleteItem', {rota: 'campanha_brindes', id: id}).then(() => {
                            this.$vs.notify({
                                color: 'success',
                                title: '',
                                text: 'Deletado com sucesso!'
                            });
                            this.getCampanhas();
                        }).catch(erro => {
                            this.$vs.notify({
                                color: 'danger',
                                title: 'Erro',
                                text: 'Erro ao deletar. Contate o suporte.'
                            });
                            console.log('erro', erro)
                        }).finally(()=>{
                          this.$vs.loading.close();
                        })
                    }
                });
            },
            pesquisar(e){
                e.preventDefault();
                this.$vs.loading();
                this.getCampanhas();
            },
            editar(id){
                if(this.$acl.check('brinde_campanha_editar'))
                    this.$router.push({path: '/brindes/campanhas/editar/' + id})
                else {
                    this.$vs.notify({
                        color: 'danger',
                        text: 'Você não possui permissão parar editar campanhas.'
                    });
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
