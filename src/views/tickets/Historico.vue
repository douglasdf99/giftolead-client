<template>
    <ul class="vx-timeline">
        <li key="TEste 1">
            <div class="timeline-icon bg-red">
                <feather-icon icon="SearchIcon" svgClasses="text-white stroke-current w-5 h-5" />
            </div>
            <div class="timeline-info">
                <p class="font-semibold">Título</p>
                <span class="activity-desc">Descrição maluca</span>
            </div>
            <small class="text-grey activity-e-time">15 dias atrás</small>
        </li>
        <li key="Lucas">
            <div class="timeline-icon bg-blue">
                <feather-icon icon="SearchIcon" svgClasses="text-white stroke-current w-5 h-5" />
            </div>
            <div class="timeline-info">
                <p class="font-semibold">Título</p>
                <span class="activity-desc">Descrição maluca</span>
            </div>
            <small class="text-grey activity-e-time">15 dias atrás</small>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "Historico"
    }
</script>

<style lang="scss">
    @import "@/assets/scss/vuexy/components/vxTimeline.scss";
</style>