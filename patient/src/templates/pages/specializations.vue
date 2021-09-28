<template lang="pug">

.specializations
    g-breadcrumbs(:link="{ name: 'welcome' }") Выберите специальность
    .list
        .g-panel
            g-checkbox.specialization(v-for="specialization in specializations" :active="specialization.active" :key="specialization.id" @set="specialization.active = $event") {{ specialization.name }}
    .options(v-if="type == 'appointment'")
        g-router-link.g-btn-primary.option(:to="{ name: 'doctors', params: { type: 'appointment' } }") Выбрать врача
    .options(v-else)
        g-router-link.g-btn.option(:to="{ name: 'doctors', params: { type: 'now' } }") Выбрать врача самостоятельно
        .g-btn-primary.option(@click="automaticly") Автоматически подобрать врача по специальности

</template>
<script>
export default {
    async created() {
        if (!this.loaded)
            await this.$store.dispatch('appointment/loadSpecializations')
    },
    computed: {
        specializations() {
            return this.$store.state.appointment.specializations
        },
        loaded() {
            return this.$store.state.appointment.specializationsLoaded
        },
        type() {
            return this.$store.getters['router/active'].page.params.type
        }
    },
    methods: {
        automaticly() {
            this.$store.dispatch('appointment/createAppointmentNow', {})
        }
    }
}
</script>
<style lang="stylus" scoped>

.specializations
    height 100%
    display flex
    flex-direction column
    padding 20px 20px 10px

.list
    padding 20px
    padding-bottom 30px
    margin-bottom -30px
    height 100%
    overflow-y hidden
    position relative
    display flex
    flex-direction column
    .g-panel
        padding 15px
        padding-bottom 0
        // height 100%
        overflow-y auto
        position relative
        max-height 100%

.specialization
    margin-bottom 15px
    >>> .text
        font-size 16px
    &:last-child
        margin-bottom 15px

.options
    position relative
    z-index 2
    flex-shrink 0
    // padding 10px 20px
    .option
        margin-bottom 10px
        &:last-child
            margin-bottom 0
    

</style>
