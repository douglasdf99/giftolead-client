<template>
    <div class="flex items-center mb-4 p-2" v-if="retorno">
        <vs-switch class="mr-4" v-model="retorno" vs-value="database">
            <span slot="on">Interno</span>
            <span slot="off">Interno</span>
        </vs-switch>
        <vs-switch class="mr-4" v-model="retorno" vs-value="mail">
            <span slot="on">Email</span>
            <span slot="off">Email</span>
        </vs-switch>
        <vs-switch class="mr-4" v-model="retorno" vs-value="slack" v-if="slack">
            <span slot="on">Slack</span>
            <span slot="off">Slack</span>
        </vs-switch>
    </div>
</template>

<script>
export default {
    name: "OptionNotification",
    props: {
        option: {
            type: Array
        },
        slack: {
            type: Boolean
        }
    },
    data() {
        return {
            retorno: null
        }
    },
    created() {
        this.retorno = this.option;
    },
    watch: {
        retorno(val) {
            console.log('mudou', val)
            this.$emit('update:option', val)
        }
    }

}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
