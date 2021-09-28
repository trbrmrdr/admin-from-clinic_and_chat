<template lang="pug">

.chat
    g-breadcrumbs(:link="{ name: 'history' }") К истории обращений
    .header
        .user
            .name {{ chat.doctors[0].fio }}
            .phone(v-if="chat.doctors[0].specialization") {{ chat.doctors[0].specialization.name }}
        .options
            a.download(:href="`${url}/api/chat/download/${chat.id}/`" target="_blank") Скачать

    perfect-scrollbar.messages
        .messages-container
            l-message(v-for="message in chat.messages" :key="message.id" :message="message" :class="{ me: message.user == me.id }")

</template>
<script>
import { TheMask } from 'vue-the-mask'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
import lMessage from './message'
import axios from 'axios'
export default {
    props: {
        params: Object
    },
    computed: {
        me() {
            return this.$store.state.user.user
        },
        chat() {
            return this.params.appointment.chat
        },
        url() {
            return process.env.VUE_APP_SERVER_URL
        }
    },
    components: { lMessage, PerfectScrollbar, TheMask }
}
</script>

<style src="vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"/></style>
<style lang="stylus" scoped>

.chat
    position relative
    width 100%
    max-height 100%
    display flex
    flex-direction column

.breadcrumbs
    padding 10px
    padding-bottom 5px

.header
    height 65px
    flex-shrink 0
    background-color #fff
    display flex
    justify-content space-between
    align-items center
    padding 0 15px
    border-bottom 1px solid #ebe9f1
    .user
        .name
            font-weight 500
        .phone
            margin-top 4px
    .options
        display flex
        align-items center
        .download
            font-weight 500
            cursor pointer

.messages
    position relative
    overflow-y auto
    height 100%
    background-color #eee
    display flex
    flex-direction column
    &-container
        position absolute
        top 0
        left 0
        padding 15px
        min-height 100%
        width 100%
        flex-shrink 0
        display flex
        flex-direction column

</style>
