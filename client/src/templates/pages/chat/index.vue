<template lang="pug">

.messanger
    .messanger-panel
        l-contacts
        router-view

</template>
<script>
import lContacts from './contacts'
import lChat from './chat'
import axios from 'axios'
export default {
    computed: {
        
    },
    methods: {
    },
    components: { lChat, lContacts }
}
</script>
<style lang="stylus" scoped>

.messanger
    height 100vh
    max-height 100vh
    &-panel
        position relative
        width 100%
        height 100%
        display flex
        border 1px solid #ebe9f1
        border-radius 5px
        overflow hidden
        background-color #eee


</style>
