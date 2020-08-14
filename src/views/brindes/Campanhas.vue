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
                <div class="vx-col col-conquista mb-10">
                    <div class="conquista">
                        <div class="py-2 w-full flex justify-between">
                            <vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash"></vs-button>
                            <vs-switch vs-icon-on="check" color="#0FB599" class="float-right switch"/>
                        </div>
                        <div class="conquista-clicavel w-full cursor-pointer">
                            <img src="@/assets/images/util/brinde.svg" class="img-conquista rounded-none my-8" width="120">
                            <p class="nome-conq">
                                Kit de Pomporismo Webnário
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Campanhas",
        data(){
            return {
                dados: {
                    search: ''
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
