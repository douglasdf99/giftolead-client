<template>
    <div>
        <div class="ph-item" v-if="tipo == 'comissoes'">
            <div class="ph-col-12">
                <div class="ph-row">
                    <div class="ph-col-6"></div>
                    <div class="ph-col-6 empty"></div>
                    <div class="ph-col-6 big mb-1"></div>
                    <div class="ph-col-6 empty"></div>
                    <div class="ph-col-2"></div>
                </div>
                <div class="ph-row">
                    <div class="ph-col-6"></div>
                    <div class="ph-col-6 empty"></div>
                    <div class="ph-col-6 big mb-1"></div>
                    <div class="ph-col-6 empty"></div>
                    <div class="ph-col-2"></div>
                </div>
            </div>
        </div>
        <div class="ph-item mt-base" v-if="tipo == 'produtos'">
            <div class="ph-col-12">
                <div class="ph-row">
                    <div class="ph-col-8 big"></div>
                    <div class="ph-col-2 empty"></div>
                    <div class="ph-col-2 "></div>
                </div>
                <div class="ph-row">
                    <div class="ph-col-4"></div>
                    <div class="ph-col-8 empty"></div>
                    <div class="ph-col-2 big"></div>
                    <div class="ph-col-10 empty"></div>
                </div>
                <div class="ph-row">
                    <div class="ph-col-4"></div>
                    <div class="ph-col-8 empty"></div>
                    <div class="ph-col-2 big"></div>
                    <div class="ph-col-10 empty"></div>
                </div>
            </div>
        </div>
        <div class="ph-item mt-base" v-if="tipo == 'meusTickets'" >
            <div class="ph-col-12">
                <div class="ph-row">
                    <div class="ph-col-8 big"></div>
                    <div class="ph-col-2 empty"></div>
                    <div class="ph-col-2 "></div>
                </div>
                <div class="ph-picture mb-10"></div>
                <div class="ph-row">
                    <div class="ph-col-4"></div>
                    <div class="ph-col-6 empty"></div>
                    <div class="ph-col-2"></div>
                    <div class="ph-col-4"></div>
                    <div class="ph-col-6 empty"></div>
                    <div class="ph-col-2"></div>
                    <div class="ph-col-4"></div>
                    <div class="ph-col-6 empty"></div>
                    <div class="ph-col-2"></div>
                </div>
            </div>
        </div>
        <div class="ph-item mt-base" v-if="tipo == 'whatsapplist'">
            <div class="ph-col-12">
                <div class="ph-row">
                    <div class="ph-col-4 big"></div>
                    <div class="ph-col-8 empty"></div>
                </div>
                <div class="ph-row">
                    <div class="ph-col-6"></div>
                    <div class="ph-col-4 empty"></div>
                </div>
            </div>
        </div>
        <div class="ph-item mt-base" style="width: 96%;" v-if="tipo == 'ultimosTickets'">
            <div class="ph-col-12">
                <div class="ph-row">
                    <div class="ph-col-2"></div>
                    <div class="ph-col-2 empty"></div>
                    <div class="ph-col-6"></div>
                </div>
            </div>
            <div class="ph-col-2">
                <div class="ph-avatar"></div>
            </div>
            <div>
                <div class="ph-row">
                    <div class="ph-col-6"></div>
                    <div class="ph-col-6 empty"></div>
                </div>
                <div class="ph-row">
                    <div class="ph-col-6"></div>
                    <div class="ph-col-6"></div>
                </div>
            </div>
        </div>
        <div class="ph-item" v-if="tipo == 'media'">
            <div class="ph-col-12">
                <div class="ph-row">
                    <div class="ph-col-4 big"></div>
                    <div class="ph-col-8 empty"></div>
                </div>
                <div class="ph-row">
                    <div class="ph-picture"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "PlaceHolderLoadingDashboard",
    props: ['tipo']
}
</script>

<style scoped>

</style>