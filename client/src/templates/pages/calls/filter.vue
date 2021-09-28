<template lang="pug">

form.g-panel.filter(@submit.prevent="submit")
    .g-field(v-for="filter in filters")
        label {{ filter.title }}
        template(v-if="filter.type == 'input'")
            input(v-model="filter.value")
        template(v-if="filter.type == 'phone'")
            the-mask(v-model="filter.value" placeholder="+7 ### ###-##-##" :mask="['+7 ### ###-##-##']")
        .select(v-if="filter.type == 'select'")
            g-checkbox.item(v-for="item in filter.items" :key="item.id" :active="item.active" @set="item.active = !item.active") {{ item.name }}
    .g-btn-primary.submit.loading(v-if="loading")
        .spin
    button.g-btn-primary.submit(v-else type="submit") Применить

</template>
<script>
import { TheMask } from 'vue-the-mask'
import axios from 'axios'
export default {
    props: {
        filters: Array,
        loading: Boolean
    },
    data: () => ({
    }),
    methods: {
        submit() {
            if (this.loading) return
            this.$emit('load')
        }
    },
    components: { TheMask }
}
</script>
<style lang="stylus" scoped>

.filter
    flex-shrink 0
    width 250px
    margin-right 20px
    padding 20px

.g-field
    margin-bottom 20px

.select
    border 1px solid $gray
    border-radius 5px
    padding 5px 13px
    .item
        padding 7px 0

.submit
    width 100%
    &.loading
        cursor default
        .spin
            display inline-block
            border 3px solid #fff
            width 14px
            height 14px
            border-bottom-color transparent
            border-radius 100%
            animation spin .5s linear infinite

@keyframes spin
    0%
        transform rotate(0deg)
    100%
        transform rotate(360deg)

</style>
