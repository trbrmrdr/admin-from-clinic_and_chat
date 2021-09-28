<template lang="pug">

.schedule
    .g-panel
        .header
            .date
                .prev(@click="setShown(-1)")
                    g-icon(name="ui/chevron")
                .date-text {{ monthNames[shown.getMonth()] }} {{ shown.getFullYear() }}
                .next(@click="setShown(1)")
                    g-icon(name="ui/chevron")
        .week-days
            .week-day(v-for="name in daysNames") {{ name }}
        i-calendar(:from="from" :shown="shown")
            template(#day="day")
                .day(
                    @click="chooseDay(day)"
                    :class="{ others: day.next || day.prev, disabled: day.before || day.after, current: day.current, choosen: day.choosen, available: isAvailable(day) }"
                ) {{ day.day }}

    l-timestamps(v-if="choosen" :day="choosen" @close="choosen = null" @choose="createAppointment")

</template>
<script>
import { TheMask } from 'vue-the-mask'
import dNames from 'data/calendar-names'
import iCalendar from 'includes/calendar'
import lTimestamps from './timestamps'
import axios from 'axios'
export default {
    props: {
        doctor: Object
    },
    data: (context) => ({
        choosen: null,
        shown: new Date(),
        from: new Date(),
        daysInSchedule: [],
    }),
    computed: {
        daysNames() {
            return dNames.week
        },
        monthNames() {
            return dNames.month
        },
    },
    methods: { 
        setShown(value) {
            this.shown = new Date(this.shown.getFullYear(), this.shown.getMonth() + value)
        },
        chooseDay(day) {
            if (day.before || day.after || !day.shown) return
            this.choosen = this.getDayInSchedule(day)
        },
        async createAppointment(datetime) {
            const res = await this.$store.dispatch('appointment/createAppointment', {
                datetime,
                doctor: this.doctor.id
            })
        },
        getDayInSchedule(day) {
            if (day.before || day.after || !day.shown) return null
            let date = {
                year: this.shown.getFullYear(),
                month: this.shown.getMonth() + 1,
                day: day.day
            }
            return this.doctor.schedule.find(item => item.date.year == date.year && item.date.month == date.month && item.date.day == date.day)
        },
        isAvailable(day) {
            let scheduleDay = this.getDayInSchedule(day)

            return scheduleDay ? scheduleDay.timestamps.length > 0 : false
        }
    },
    components: { iCalendar, lTimestamps }
}
</script>
<style lang="stylus" scoped>

.g-panel
    padding 20px
    margin-top 25px
    width 100%
    position relative

.header
    display flex
    margin-bottom 10px

    .date
        display flex
        align-items center
        &-text
            font-weight 500
            padding 0 7px

    .prev, .next
        cursor pointer
        width 14px
        height 14px
        .icon
            fill $light-black
            width 14px

.prev
    .icon
        transform rotate(90deg)
.next
    .icon
        transform rotate(-90deg)

.week-days
    display flex
    width 100%
    .week-day
        border-right 0
        width 100%
        padding 5px
        font-weight 500

.calendar-container
    padding 5px

>>> .calendar
        width 100%
        .day
            height 30px
            color $light-black
            display flex
            align-items center
            justify-content center
            font-weight 500
            border-radius 5px
            cursor default
            &.others
                cursor default
                color #eee
            &.disabled, &.prev, &.next
                cursor default
                color #999
            &.current
                color $primary
            &.choosen
                background-color $red
                color #fff
            &.available
                background-color $success
                color #fff
                cursor pointer


</style>
