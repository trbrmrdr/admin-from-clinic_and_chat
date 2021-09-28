<template lang="pug">

#exteranal-chat.external-chat(:class="{ hidden }")
    .hidden-toggle(@click="hidden = false")
        g-icon(name="nav/chat")
    g-router-view.page
    i-popup

</template>
<script>
import iHeader from 'includes/header'
import iPopup from 'includes/popup'
export default {
    computed: {
        hidden: {
            get() {
                return this.$store.state.ui.hidden
            },
            set(value) {
                this.$store.state.ui.hidden = value
            }
        },
        page: {
            get() {
                console.log(this.$store.state)
                return this.$store.state.page
            },
            set(page) {
                this.$store.dispatch('page', page)
            }
        }
    },
    methods: {
    },
    components: { iHeader, iPopup },
}
</script>
<style lang="stylus" scoped>

.external-chat
    position relative
    width 300px
    height 500px
    max-height 85vh
    margin auto
    box-shadow 0 4px 24px 0 rgba(34,41,47,.1)
    border 1px solid #ebe9f1
    border-radius 5px
    overflow hidden
    background-color #fff
    display flex
    flex-direction column
    overflow-y hidden
    position fixed
    right 10px
    bottom 10px
    margin 0
    &.hidden
        width 50px
        height 50px
        box-shadow 0 4px 24px 0 rgba(34,41,47,.2)
        .hidden-toggle
            display flex
        .page
            position absolute
            top 0
            left 0
            opacity 0

.hidden-toggle
    display none
    width 100%
    height 100%
    align-items center
    justify-content center
    position absolute
    top 0
    left 0
    cursor pointer
    z-index 100
    .icon
        width 50%
        height 50%
        stroke $primary
        fill none

.page
    overflow-y auto
    height 100%
    transition all .3s


</style>
