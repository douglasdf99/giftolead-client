<!-- =========================================================================================
    File Name: VxBreadcrumb.vue
    Description: Breadcrumb component
    Component Name: VxBreadcrumb
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template functional>
    <div class="vx-breadcrumb" :class="data.staticClass">
        <ul class="flex flex-wrap items-center">
             <li v-for="(link, index) in props.route.meta.breadcrumb" :key="index" class="inline-flex items-center">
                <router-link :to="{name: link.url, params:{...props.route.params}}" v-if="link.url">{{ link.title }}</router-link>
                <span class="text-primary cursor-default" v-else>{{ link.title }}</span>
                <span class="breadcrumb-separator mx-2 flex items-start"><feather-icon :icon="props.isRTL ? 'ChevronsLeftIcon' : 'ChevronsRightIcon'" svgClasses="w-4 h-4" /></span>
            </li>
            <li class="inline-flex">
                <span v-if="props.route.meta.breadcrumb.active" class="cursor-default">{{ props.route.meta.breadcrumb.title }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default{
    name: 'vx-breadcrumb',
};
</script>
