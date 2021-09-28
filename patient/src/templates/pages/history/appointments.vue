<template lang="pug">

.appointments
    g-breadcrumbs(:link="{ name: 'welcome' }") На главную
    .g-panel.list
        .appointment(v-for="appointment in appointments" @click="openChat(appointment)")
            template(v-if="appointment.done == false")
                .tag.success(v-if="appointment.date_tz > new Date()") Запись на приём
                .tag.danger(v-else) Вы пропустили запись
            .tag.primary(v-else) Запись состоялась
            .date Дата: {{ appointment.date_tz.getDate() }}.{{ appointment.date_tz.getMonth() + 1 }}.{{ appointment.date_tz.getFullYear() }} {{ appointment.date_tz.getHours() }}:{{ appointment.date_tz.getMinutes() }}
            .doctor
                .about
                    .photo(:style="{ backgroundImage: `url(${appointment.doctor.photo})` }")
                    .info
                        .name {{ appointment.doctor.fio }}
                        .specialization(v-if="appointment.doctor.specialization") {{ appointment.doctor.specialization.name }}
            
</template>
<script>
import axios from 'axios'
export default {
    async created() {
        const { data } = await axios.get('/api/patient/history/')
        console.log(data)
        for (let item of data)
            item.date_tz = new Date(item.date_tz)
        this.appointments = data
    },
    data: () => ({
        appointments: []
    }),
    methods: {
        openChat(appointment) {
            if (appointment.chat)
                this.$store.dispatch('router/set', { name: 'history/chat', params: { appointment } })
        }
    }
}
</script>
<style lang="stylus" scoped>

.appointments
    padding 20px

.breadcrumbs
    margin-bottom 20px

.appointment
    border-bottom 1px solid #ebe9f1
    cursor pointer
    padding 0 15px
    &:last-child
        border-bottom 0

.doctor
    display flex
    flex-direction column
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
            font-size 14px
            // line-height 1
        .specialization
            font-size 14px
            color $secondary
            margin-top 3px

.tag
    font-size 14px
    font-weight 500
    color #fff
    padding 3px 7px
    border-radius 4px
    display inline-block
    margin 10px 0 5px
    &.success
        background-color $success
    &.danger
        background-color $danger
    &.primary
        background-color $primary

.date
    font-weight 500
    font-size 15px
    margin-bottom 5px

</style>
