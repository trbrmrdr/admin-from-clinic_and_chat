<template lang="pug">

.timestamps
    .fade(@click="close")
    .g-panel.timestamps-panel
        .timezone *Московское время
        perfect-scrollbar.list
            .timestamp(v-for="timestamp in day.timestamps" @click="choosen = timestamp" :class="{ active: timestamp == choosen }") {{ getTimeStr(timestamp) }}
        .options
            .g-btn-danger.close(@click="close") Отменить
            .g-btn-success.choose(v-if="this.choosen" @click="choose") Записаться
            .g-btn-disabled.choose(v-else) Записаться

</template>
<script>
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
export default {
    props: {
        day: Object
    },
    data: () => ({
        choosen: null
    }),
    computed: {
    },
    methods: {
        choose() {
            if (!this.choosen) return
            this.$emit('choose', { ...this.day.date, ...this.choosen })
            this.close()
        },
        close() {
            this.$emit('close')
        },
        getTimeStr(timestamp) {
            let format = (value) => value >= 10 ? value : '0' + value

            return `${format(timestamp.hour)}:${format(timestamp.minute)}`
        },
    },
    components: { PerfectScrollbar }
}
</script>
<style src="vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"/></style>
<style lang="stylus" scoped>

.timestamps
    position absolute
    width 100%
    height 100%
    top 0
    left 0

.fade
    position absolute
    z-index 2
    width 100%
    height 100%
    top 0
    left 0
    cursor pointer
    background-color rgba(#000, .3)

.timestamps-panel
    width 90%
    max-height 90%
    overflow hidden
    z-index 3
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    display flex
    flex-direction column
    .list
        display flex
        flex-wrap wrap
        align-items flex-start
        height 100%
        padding 5px 8px 0
        margin 5px 2px 2px
        overflow-y auto
    .options
        display flex
        justify-content space-between
        flex-shrink 0
        padding 0 10px 10px
    .timestamp
        padding 3px 0
        width 55px
        flex-shrink 0
        text-align center
        margin-right 8px
        margin-bottom 8px
        font-weight 500
        background-color #eee
        cursor pointer
        border-radius 4px
        &:nth-child(4n)
            margin-right 0
        &.active
            background-color $green
            color #fff

.timezone
    padding 5px
    padding-bottom 0

</style>
