<template lang="pug">

form.g-panel.filter(@submit.prevent="submit")
    .g-field(v-for="filter in filters" :class="['filter-' + filter.key]")
        label {{ filter.title }}
        template(v-if="filter.type == 'input'")
            input(v-model="filter.value")
        .select(v-if="filter.type == 'select'")
            g-checkbox.item(v-for="item in filter.items" :key="item.id" :active="item.active" @set="item.active = !item.active") {{ item.name }}
                .remove(v-if="filter.remove && isAdmin" @click.stop="remove(filter, item)")
                    g-icon(name="ui/close-circle")
        .add(v-if="isAdmin && filter.type == 'add'")
            form(v-if="filter.active" @submit.prevent="add(filter)")
                input(v-model="filter.value")
                button.add-submit(type="submit")
                    g-icon(name="ui/add")
                .add-cancel(@click="filter.active = false")
                    g-icon(name="ui/close-circle")
            .add-btn(v-else @click="filter.active = true")
                g-icon(name="ui/add")
                | {{ filter.text }}
    button.g-btn-primary.submit(type="submit") Применить

</template>
<script>
import axios from 'axios'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
export default {
    props: {
        filters: Array
    },
    data: () => ({
    }),
    computed: {
        isAdmin() {
            return this.$store.state.user.user.admin
        }
    },
    methods: {
        submit() {
            this.$emit('load')
        },
        add(filter) {
            this.$emit('add', filter)
            filter.active = false
        },
        remove(filter, item) {
            this.$emit('remove', { filter, item })
        }
    },
    components: { PerfectScrollbar }
}
</script>
<style src="vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"/></style>
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
        display flex
        >>> .text
            display flex
            justify-content space-between
            align-items center
            width 100%
        .remove
            fill none
            stroke $danger
            width 20px
            height 20px

.submit
    width 100%

.add
    margin-top -14px
    &-btn
        font-weight 500
        font-size 14px
        display flex
        align-items center
        cursor pointer
        .icon
            fill none
            stroke $success
            margin-right 10px
            flex-shrink 0
    form
        display flex
        align-items center
        .add-cancel, .add-submit
            cursor pointer
            border 0
            padding 0 5px
            fill none
            width 30px
            height 20px
            flex-shrink 0
        .add-cancel
            stroke $danger
        .add-submit
            stroke $success
        input
            width 100%

</style>
