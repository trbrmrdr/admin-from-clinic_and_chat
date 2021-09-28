<template lang="pug">

.header
    //- g-router-link.title(v-if="back" :to="back")
    //-     g-icon(name="ui/back")
    //-     | page.route.title
    //- .title(v-else)
    .header-container
        .title(v-if="page.route")
            | {{ page.route.title }}

</template>
<script>
export default {
    computed: {
        page() {
            return this.$store.getters['router/active']
        }
    }
}
</script>
<style lang="stylus" scoped>

.header
    padding 8px 8px 0
    &-container
        height 50px
        box-shadow 0 4px 24px 0 rgba(34,41,47,.1)
        border 1px solid #ebe9f1
        padding 0 20px
        display flex
        align-items center
        flex-shrink 0
        border-radius 5px


.title
    // color $primary
    font-weight 400
    line-height 1

</style>
