<template lang="pug">

.doctor(v-if="doctor")
    g-breadcrumbs(:link="{ name: 'doctors', params: { type: 'appointment' } }") Выберите дату приёма
    .g-panel.description
        .about
            .photo(:style="{ backgroundImage: `url(${doctor.photo})` }")
            .info
                .name {{ doctor.fio }}
                .specialization {{ doctor.specialization.name }}
        .tags
            .tag.online(v-if="doctor.online") Онлайн
            .tag.busy(v-if="doctor.busy") Занят
    l-schedule(:doctor="doctor")
    
</template>
<script>
import lSchedule from './schedule'
export default {
    async created() {
        await this.$store.dispatch('appointment/loadDoctor', this.id)
    },
    computed: {
        id() {
            return this.$store.getters['router/active'].page.params.id
        },
        doctor() {
            return this.$store.state.appointment.doctor
        }
    },
    components: {
        lSchedule
    }
}
</script>
<style lang="stylus" scoped>

.doctor
    padding 20px

.breadcrumbs
    margin-bottom 20px

.description
    display flex
    flex-direction column
    padding 0 15px
    &:last-child
        border-bottom 0
    .about
        display flex
        align-items center
    .photo
        width 40px
        height 40px
        flex-shrink 0
        border-radius 100%
        background-size cover
        background-position center
        margin-right 10px
        background-color #eee
    .info
        padding 10px 0
        .name
            font-weight 500
            // line-height 1
        .specialization
            font-size 14px
            color $secondary
            margin-top 3px
    .tags
        padding 2px 0 8px
        display flex
        .tag
            font-size 14px
            font-weight 500
            color #fff
            padding 3px 7px
            border-radius 4px
            margin-right 10px
            &.online
                background-color $success
            &.busy
                background-color $danger

</style>
