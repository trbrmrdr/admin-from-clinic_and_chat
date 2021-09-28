<template lang="pug">

.calendar
    slot(
        v-for="(day, index) in calendar"
        name="day"
        :day="day.date"
        :shown="day.type == 'shown'"
        :current="day.type == 'shown' && day.date === status.current"
        :choosen="day.type == 'shown' && day.date === status.choosen"
        :before="day.type == 'shown' && day.date < status.from"
        :after="day.type == 'shown' && day.date > status.to"
        :prev="day.type == 'prev'"
        :next="day.type == 'next'"
    )
        .day(:key="day+'-'+index") {{ day.date }}

</template>
<script>
export default {
    props: {
        shown: {
            type: Date,
            default: () => new Date()
        },
        choosen: {
            type: Date,
            default: null
        },
        from: {
            type: Date,
            default: null
        },
        to: {
            type: Date,
            default: null
        },
    },
    computed: {
        status() {
            let shown = this.d_shown,
                current = this.d_current,
                prev = this.d_prev,
                next = this.d_next,
                choosen = this.d_choosen,
                from = this.d_from,
                to = this.d_to
                
            return {
                current: shown.month == current.month && shown.year == current.year ? current.day : null,
                from: from === null ? 1
                    : (shown.month == from.month && shown.year == from.year) ? from.day
                    : ((shown.month >= from.month && shown.year == from.year) || shown.year > from.year) ? 1 : 32,
                to: to === null ? 32
                    : (shown.month == to.month && shown.year == to.year) ? to.day
                    : ((shown.month >= to.month && shown.year == to.year) || shown.year > to.year) ? 0 : 32,
                choosen: choosen && shown.month == choosen.month && shown.year == choosen.year ? choosen.day : null,
                prev: shown.month == prev.month && shown.year == prev.year,
                next: shown.month == next.month && shown.year == next.year,
            }
        },
        d_choosen() {
            return this.choosen ? this.dateGenerator(this.choosen) : null
        },
        d_shown() {
            return this.dateGenerator(this.shown)
        },
        d_prev() {
            return this.dateGenerator(new Date(this.d_shown.year, this.d_shown.month - 1))
        },
        d_next() {
            return this.dateGenerator(new Date(this.d_shown.year, this.d_shown.month + 1))
        },
        d_current() {
            return this.dateGenerator(new Date())
        },
        d_from() {
            return this.from ? this.dateGenerator(this.from) : null
        },
        d_to() {
            return this.to ? this.dateGenerator(this.to) : null
        },
        calendar() {
            let shown = this.d_shown,
                days = []

            prevMonth()
            activeDays()
            nextMonth()
            return days

            function activeDays() {
                for (let i = 1; i <= shown.length; i++)
                    days.push({ date: i, type: 'shown'})
            }

            function prevMonth() {
                let prevMonth = new Date(shown.date)
                prevMonth.setDate(0)
                let prevDay = prevMonth.getDay(),
                    prevDate = prevMonth.getDate()
    
                for (let i = prevDay - 1; i >= 0; i--)
                    days.push({ date: prevDate - i, type: 'prev'})
            }

            function nextMonth() {
                let lastDay = days.length % 7
                if (lastDay > 0)
                    for (let i = 1; i <= 7 - lastDay; i++)
                        days.push({ date: i, type: 'next'})
            }
        },
    },
    methods: {
        dateGenerator(date) {
            let res = {
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate(),
                dayWeek: date.getDay(),
                time: date.getHours(),
                date: date
            }
            res.length = new Date(res.year, res.month + 1, 0).getDate()

            return res
        },
    },
}
</script>
<style lang="stylus" scoped>

.calendar
    display flex
    align-items center
    justify-content space-between
    flex-wrap wrap
    .day
        width calc(100% / 7)
        text-align center

</style>
