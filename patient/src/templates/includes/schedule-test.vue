<template lang="pug">

.schedule
    .header
        .prev(@click="setShown(-1)")
            g-icon(name="ui/chevron")
        .info {{ monthNames[shown.getMonth()] }} {{ shown.getFullYear() }}
        .next(@click="setShown(1)")
            g-icon(name="ui/chevron")
    .week-days
        .week-day(v-for="name in daysNames") {{ name }}
    i-calendar(:from="from" :shown="shown" :choosen="choosen")
        template(#day="day")
            .day(
                @click="chooseDay(day)"
                :class="{ others: day.next || day.prev, disabled: day.before || day.after, current: day.current, choosen: day.choosen }"
            ) {{ day.day }}

</template>
<script>
import dNames from 'data/calendar-names'
import iCalendar from 'includes/calendar'
export default {
    data: (context) => ({
        choosen: null,
        shown: new Date(),
        from: new Date()
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
            if (day.before || day.after || day.choosen || day.next) return
            let date = new Date(this.shown)
            date.setDate(day.day)
            this.$emit('choosen', date)
        },
    },
    components: { iCalendar }
}
</script>
<style lang="stylus" scoped>

.schedule
    padding 20px

.header
    display flex
    margin-bottom 10px

.info
    $font-main()
    padding 0 7px

.prev, .next
    cursor pointer
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
            height 90px
            color $light-black
            cursor pointer
            text-align left
            border-left 1px solid $gray
            border-bottom 1px solid $gray
            &.others
                cursor default
                color #eee
            &.disabled, &.prev, &.next
                cursor default
                color #999
            &.current
                background-color #ddd
            &.choosen
                background-color $red
                color #fff

</style>
