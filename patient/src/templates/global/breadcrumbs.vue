<template lang="pug">

g-router-link.breadcrumbs(:to="link")
    g-icon(name="ui/chevron")
    .text
        slot(name="default")

</template>
<script>
export default {
    props: {
        link: Object
    }
}
</script>
<style lang="stylus" scoped>

.breadcrumbs
    color $primary
    display flex
    align-items center
    // padding 5px
    .icon
        width 12px
        height 12px
        fill $primary
        margin-right 6px
        transform rotate(90deg)

</style>
