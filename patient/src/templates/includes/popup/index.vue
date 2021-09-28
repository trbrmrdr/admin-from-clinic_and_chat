<template lang="pug">

transition(name="show" :duration="{ enter: 800, leave: 600 }")
    .popups(v-if="popup !== null")
        .fade(@click="popup = null")
        .popup(v-if="component" :is="component" :query="popup.query" @close="popup = null")

</template>
<script>
export default {
    computed: {
        popup: {
            get() {
                return this.$store.state.ui.popup
            },
            set(value) {
                this.$store.state.ui.popup = value
            }
        },
        component() {
            let name = this.popup.name
            if (name)
                return () => import('./' + name)
            return null
        }
    },
}

</script>
<style lang="stylus" scoped>

.popups
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    z-index 100
    &.show-enter, &.show-leave-to
        .fade
            opacity 0
        .popup
            top -100%
            box-shadow 0 0 0 0 rgba(#000, 0)
    &.show-enter-active .popup
        animation showPopup .8s
    &.show-leave-active .popup
        animation hidePopup .6s

.fade
    position absolute
    width 100%
    height 100%
    top 0
    left 0
    z-index 1
    background-color rgb(77, 77, 77)
    cursor pointer
    opacity .5
    transition opacity .5s

.popup
    z-index 2
    position absolute
    left 50%
    top 50%
    transform translate(-50%, -50%)
    border-radius 5px
    background-color #fff
    box-shadow 0 2px 8px 0 rgba(#000, .2)
    max-height calc(100% - 20px)
    overflow-y auto
    overflow-x hidden

@keyframes hidePopup
	0%
		margin-top 0
		top 50%
	30%
		margin-top 35px
		top 50%
	100%
		margin-top 0
		top -100%
@keyframes showPopup
	0%
		margin-top 0
		top -100%
	60%
		margin-top 45px
		top 50%
	100%
		margin-top 0
		top 50%

>>> 
    .close
        position absolute
        z-index 10
        width 20px
        height 20px
        top 10px
        right 10px
        cursor pointer
        .icon
            width 100%
            height 100%
            position relative
            stroke #777
            stroke-width 1
    
    .popup-name
        font-size 18px
        line-height 1
        padding 4px 6px 2px
        color $grey
        border 2px solid $grey
        border-radius 5px
        display inline-flex
        &.active
            color $red
            border-color $red

</style>
