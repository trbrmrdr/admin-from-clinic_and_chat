<template lang="pug">

form.g-panel.filter(@submit.prevent="submit")
    .g-field(v-for="filter in filters")
        label {{ filter.title }}
        template(v-if="filter.type == 'input'")
            input(v-model="filter.value")
        .select(v-if="filter.type == 'select'")
            g-checkbox.item(v-for="item in filter.items" :key="item.id" :active="item.active" @set="item.active = !item.active") {{ item.name }}
    button.g-btn-primary.submit(type="submit") Применить

</template>
<script>
import axios from 'axios'
export default {
    props: {
        filters: Array
    },
    data: () => ({
    }),
    methods: {
        submit() {
            this.$emit('load')
        }
    }
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

</style>
