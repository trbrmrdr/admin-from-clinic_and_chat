<template lang="pug">

.contacts
    .types
        .type(@click="setArchive(false)" :class="{ active: !archive }") Текущие
        .type(@click="setArchive(true)" :class="{ active: archive }") История
    perfect-scrollbar.list
        router-link.contact(v-for="chat in chats" :to="{ name: 'chat', params: { id: chat.id } }" :key="chat.id" @click="setActive(chat)" :class="{ active: active == chat.id }") 
            .name {{ chat.patient.fio }}
            .phone {{ chat.patient.phone }}
            .new(v-if="chat.new") {{ chat.new }}

</template>
<script>
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
export default {
    data: () => ({
        archive: false
    }),
    computed: {
        chats() {
            return this.$store.getters[this.archive ? 'chat/archive' : 'chat/active']
        },
        active() {
            if (this.$route.name == 'chat')
                return this.$route.params.id
            return null
        }
    },
    methods: {
        setArchive(value) {
            if (value && !this.$store.state.chat.loaded.archive)
                this.$store.dispatch('chat/loadChats', true)
            this.archive = value
        },
        setActive(chat) {
            this.$emit('setActive', chat.id)
        }
    },
    components: { PerfectScrollbar }
}
</script>
<style lang="stylus" scoped>

.contacts
    position relative
    width 320px
    height 100%
    border-right 1px solid #ebe9f1
    flex-shrink 0
    background-color #fff
    display flex
    flex-direction column

.types
    height 65px
    flex-shrink 0
    display flex
    border-bottom 1px solid #ebe9f1
    .type
        border-right 1px solid #ebe9f1
        width 100%
        height 100%
        display flex
        align-items center
        justify-content center
        cursor pointer
        font-weight 500
        &:last-child
            border-right 0
        &.active
            background linear-gradient(80deg,#7367f0,#9e95f5)
            color #fff

.list
    overflow-y auto
    position relative
    height 100%
    >>> .ps__rail-y
        z-index 2

.contact
    height 65px
    position relative
    cursor pointer
    display flex
    justify-content center
    flex-direction column
    padding 11px 18px
    font-weight 500
    &:hover
        background-color #f6f6f6
    &.active
        background linear-gradient(80deg,#7367f0,#9e95f5)
        color #fff
    .new
        position absolute
        right 18px
        width 20px
        height 20px
        border-radius 100%
        background-color #7367f0
        color #fff
        display flex
        align-items center
        justify-content center
        padding-bottom 1px
    .phone
        font-weight 400
        margin-top 4px


</style>
