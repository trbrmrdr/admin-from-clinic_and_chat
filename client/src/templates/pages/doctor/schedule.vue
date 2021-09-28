<template lang="pug">

.schedule

    .header
        .date
            .prev(@click="setShown(-1)")
                g-icon(name="ui/chevron")
            .date-text {{ monthNames[shown.getMonth()] }} {{ shown.getFullYear() }}
            .next(@click="setShown(1)")
                g-icon(name="ui/chevron")

    .week-days
        .week-day(v-for="name in daysNames") {{ name }}

    i-calendar(:from="from" :shown="shown" :choosen="choosen")
        template(#day="day")
            .day(
                @click="editDay(day)"
                :class="{ others: day.next || day.prev, disabled: day.before || day.after, current: day.current, choosen: day.choosen }"
            ) 
                .date {{ day.day }}
                .time(v-if="day.shown && !(day.before || day.after) && getDayInSchedule(day)") {{ getTimeStr(day) }}
                .day-appointments(v-if="day.shown && !(day.before || day.after) && getDayInSchedule(day) && getDayInSchedule(day).appointments.length > 0") Записи: {{ getDayInSchedule(day).appointments.length }}

    .editor-popup(v-if="edit.day")
        .fade(@click="cancel")
        .editor
            .appointments(v-if="edit.schedule && edit.schedule.appointments.length > 0")
                .appointments-title Записи на чат:
                .appointment(v-for="appointment in edit.schedule.appointments" :key="appointment.id")
                    a.appointment-patient(:href="`/patient/${appointment.patient.id}`" target="_blank") Пациент: {{ appointment.patient.fio }}
                    .appointment-date Дата: {{ appointment.date }}
            form.form(@submit.prevent="save")
                .title Рабочее время
                .timezone *Московское время
                .g-field
                    .g-inputset
                        the-mask(v-model="edit.start" :mask="['##:##']" placeholder="00:00")
                        .devider -
                        the-mask(v-model="edit.end" :mask="['##:##']" placeholder="00:00")
                button.g-btn-success.btn(type="submit") Сохранить
                .g-btn-danger.btn(@click="clear") Свободный день
                .g-btn-primary.btn(@click="cancel") Отменить

</template>
<script>
import { TheMask } from 'vue-the-mask'
import dNames from 'data/calendar-names'
import iCalendar from 'includes/calendar'
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
        edit: {
            schedule: null,
            day: null,
            start: null,
            end: null
        }
    }),
    computed: {
        daysNames() {
            return dNames.week
        },
        monthNames() {
            return dNames.month
        },
        isAdmin() {
            return this.$store.state.user.user.admin
        },
        canEdit() {
            return this.isAdmin || this.$store.state.user.user.id == this.doctor.id
        },
    },
    methods: { 
        setShown(value) {
            this.shown = new Date(this.shown.getFullYear(), this.shown.getMonth() + value)
        },
        editDay(day) {
            // if (day.before || day.after || day.current || !day.shown) return
            if (day.before || day.after || !day.shown) return
            this.edit.day = day
            this.edit.schedule = this.getDayInSchedule(day)
        },
        getDayInSchedule(day) {
            let date = {
                year: this.shown.getFullYear(),
                month: this.shown.getMonth() + 1,
                day: day.day
            }
            return this.doctor.schedule.find(item => item.date.year == date.year && item.date.month == date.month && item.date.day == date.day)
        },
        getTimeStr(day) {
            let { start, end } = this.getDayInSchedule(day)

            let format = (value) => value >= 10 ? value : '0' + value

            return `${format(start.hour)}:${format(start.minute)} - ${format(end.hour)}:${format(end.minute)}`
        },
        async save() {
            const { data } = await axios.post('/api/doctor/schedule/', {
                doctor_id: this.doctor.id,
                date: {
                    year: this.shown.getFullYear(),
                    month: this.shown.getMonth() + 1,
                    day: this.edit.day.day
                },
                start: {
                    hour: parseInt(this.edit.start.substr(0, 2)),
                    minute: parseInt(this.edit.start.substr(2, 2))
                },
                end: {
                    hour: parseInt(this.edit.end.substr(0, 2)),
                    minute: parseInt(this.edit.end.substr(2, 2))
                },
            })

            if (data.error)
                return
            
            this.doctor.schedule = data
            this.edit.day = null
        },
        async clear() {
            const { data } = await axios.post('/api/doctor/schedule/', {
                doctor_id: this.doctor.id,
                date: {
                    year: this.shown.getFullYear(),
                    month: this.shown.getMonth() + 1,
                    day: this.edit.day.day
                },
                clear: true
            })
            if (data.error)
                return
            
            this.doctor.schedule = data
            this.edit.day = null
        },
        cancel() {
            this.edit.day = null
        }
    },
    components: { iCalendar, TheMask }
}
</script>
<style lang="stylus" scoped>

.schedule
    padding 20px
    margin-top 25px
    width 800px
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
    border-right 1px solid $gray
    .week-day
        border 1px solid $gray
        border-right 0
        width 100%
        padding 5px

.calendar-container
    padding 5px

>>> .calendar
        // width 255px
        width 100%
        // padding 7px 10px
        // border-top 1px solid $gray
        border-right 1px solid $gray
        .day
            // width auto
            padding 5px
            height 70px
            color $light-black
            cursor pointer
            text-align left
            border-left 1px solid $gray
            border-bottom 1px solid $gray
            display flex
            flex-direction column
            justify-content space-between
            // align-items flex-start
            position relative
            &-appointments
                position absolute
                right 5px
                top 5px
                font-size 14px
                font-weight 500
                background-color $warning
                color #fff
                padding 3px
                border-radius 3px
            .date
                font-weight 500

            .time
                // margin-top 20px
                font-weight 500
                font-size 14px
                background-color $success
                color #fff
                text-align center
                padding 3px 0
                border-radius 4px
            &.others
                cursor default
                color #eee
            &.disabled, &.prev, &.next
                cursor default
                color #999
            // &.current
                // background-color #ddd
            &.choosen
                background-color $red
                color #fff


.editor-popup
    position absolute
    z-index 3
    width 100%
    height 100%
    top 0
    left 0
    .fade
        position absolute
        width 100%
        height 100%
        top 0
        left 0
        z-index 2
        cursor pointer
        background-color rgba(#000, .2)
        border-radius 5px
    .editor
        position absolute
        top 50%
        left 50%
        transform translate(-50%, -50%)
        z-index 3
        background-color #fff
        border-radius 5px
        display flex
    .appointments
        flex-shrink 0
        width 240px
        padding 20px
        &-title
            font-weight 500
            margin-bottom 10px
        .appointment
            font-weight 500
            font-size 15px
            margin-bottom 10px
            &:last-child
                margin-bottom 0
            &-patient
                margin-bottom 2px
                display block
    .form
        padding 20px
        width 240px
        flex-shrink 0

    .title
        font-weight 500
        padding-right 30px
        line-height 1.2
    
    .timezone
        padding 3px 0 10px

    .g-inputset
        justify-content center
        input
            padding 6px 0
            width 70px
            line-height 1
            text-align center
        .devider
            width 20px
            text-align center

    .btn
        margin-top 10px
        width 100%

</style>
