<template lang="pug">

.g-router-link(@click="$store.dispatch('router/set', to)")
    slot(name="default")

</template>
<script>
export default {
    props: {
        to: Object
    }
}
</script>
<style lang="stylus" scoped>

.g-router-link
    cursor pointer

</style>
