<template lang="pug">

.g-router-view(v-if="page.route" :is="page.route.component" :params="page.page.params")

</template>
<script>
export default {
    computed: {
        page() {
            return this.$store.getters['router/active']
        },
    },
}
</script>
<style lang="stylus" scoped>


</style>
