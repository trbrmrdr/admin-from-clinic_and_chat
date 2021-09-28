<template lang="pug">

.doctors
    g-breadcrumbs(:link="{ name: 'welcome' }") Выберите врача
    .specializations

    .g-panel.list(v-if="doctors.length > 0")
        .item.doctor(v-for="doctor in doctors" @click="choose(doctor.id)" :key="doctor.id")
            .about
                .photo(:style="{ backgroundImage: `url(${doctor.photo})` }")
                .info
                    .name {{ doctor.fio }}
                    .specialization(v-if="doctor.specialization") {{ doctor.specialization.name }}
            .tags
                .tag.online(v-if="doctor.online") Онлайн
                .tag.busy(v-if="doctor.busy") Занят
    .empty(v-else) Нет подходящих врачей

</template>
<script>
import axios from 'axios'
export default {
    props: {
        params: Object
    },
    async created() {
        await this.$store.dispatch('appointment/loadDoctors', this.params.type == 'now')
        console.log(this.doctors)
    },
    computed: {
        specializations() {
            return this.$store.state.appointment.specializations
        },
        doctors() {
            return this.$store.state.appointment.doctors
        },
    },
    methods: {
        choose(id) {
            if (this.params.type == 'appointment')
                this.$store.dispatch('router/set', { name: 'doctor', params: { id } })
            else if (this.params.type == 'now')
                this.$store.dispatch('appointment/createAppointmentNow', { doctor: id })
        }
    }
}
</script>
<style lang="stylus" scoped>

.doctors
    padding 20px
    height 100%
    position relative

.breadcrumbs
    margin-bottom 20px

.list
    width 100%
    .item
        display flex
        flex-direction column
        padding 0 15px
        border-bottom 1px solid #ebe9f1
        cursor pointer
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

.empty
    margin-top 50px
    text-align center

</style>
