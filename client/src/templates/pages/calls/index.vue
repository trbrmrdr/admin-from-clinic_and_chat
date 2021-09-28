<template lang="pug">

.calls
    l-filter(:filters="filters" @load="load" :loading="loading")
    .g-panel.list
        .item
            .field.from Исходящий номер
            .field.to Входящий номер
            .field.date Дата
            .field.duration Длительность звонка (в сек)
        .item(v-for="(call, index) in calls" :key="index")
            .field.from {{ call.phone_from }}
            .field.to {{ call.phone_to }}
            .field.date {{ call.date }}
            .field.duration {{ call.duration }} сек

</template>
<script>
import axios from 'axios'
import lFilter from './filter'
export default {
    async created() {
        await this.load()
    },
    data: () => ({
        calls: [],
        filters: [
            {
                title: 'Номер телефона (можно не полностью)',
                key: 'phone',
                type: 'phone',
                value: null
            },
        ],
        loading: false
    }),
    methods: {
        async load() {
            this.loading = true
            const { data } = await axios.post('/api/doctor/calls/', {
                phone: this.filters.find(filter => filter.key == 'phone').value
            })
            this.calls = data
            this.loading = false
        }
    },
    components: { lFilter }
}
</script>
<style lang="stylus" scoped>

.calls
    display flex
    align-items flex-start
    position relative

.list
    width 100%
    display flex
    flex-direction column
    .item
        height 60px
        display flex
        align-items center
        padding 0 20px
        border-bottom 1px solid #ebe9f1
        &:last-child
            border-bottom 0
        .field
            &.from
                width 230px
            &.to
                width 230px
            &.date
                width 230px
            &.duration
                width 180px

</style>
