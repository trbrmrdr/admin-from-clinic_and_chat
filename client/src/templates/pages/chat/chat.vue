<template lang="pug">

.chat(v-if="chat")
    .header
        router-link.user(:to="{ name: 'patient', params: { id: chat.patient.id } }")
            .name {{ chat.patient.fio }}
            .phone {{ chat.patient.phone }}
        .options
            a.download(:href="`/api/chat/download/${chat.id}/`") Скачать чат
            template(v-if="!ended")
                .close.g-btn-danger(@click="closeChat") Закончить чат
                //- .call(v-if="chat.patient.phone" @click="call")
                //-     g-icon(name="chat/phone")
                .call(v-if="chat.patient.phone" @click="call" :class="{ loading: callStatus == 'loading', success: callStatus == 'success', error: callStatus == 'error' }")
                    g-icon.phone(name="chat/phone")
                    g-icon.success(name="ui/check")
                    g-icon.error(name="ui/close")
                    .loader
        
    perfect-scrollbar.messages
        .messages-container
            l-message(v-for="message in chat.messages" :key="message.id" :message="message" :class="{ me: message.user == me.id }")
    
    l-editor(v-if="!ended" :chat_id="chat.id")
    
.chat(v-else)

</template>
<script>
import axios from 'axios'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
import lEditor from './editor'
import lMessage from './message'
export default {
    async beforeRouteUpdate(to, from, next) {
        await this.$store.dispatch('chat/loadChat', to.params.id)
        next()
    },
    async mounted() {
        await this.$store.dispatch('chat/loadChat', this.id)
        this.mounted = true
        this.scrollBot()
    },
    data: () => ({
        message: {
            text: null
        },
        mounted: false,
        callStatus: null
    }),
    computed: {
        id() {
            return this.$route.params.id
        },
        me() {
            return this.$store.state.user.user
        },
        chat() {
            return this.$store.getters['chat/chat'](this.id)
        },
        ended() {
            return this.chat.ended
        }
    },
    watch: {
        'chat.messages': {
            immediate: true,
            async handler(value) {
                if (value) {
                    await this.$nextTick()
                    this.scrollBot()
                }
            }
        }
    },
    methods: {
        // async download() {
        //     const
        // },
        async submit() {
            if (!this.message.text) return
            await this.$store.dispatch('chat/sendMessage', {
                message: {
                    text: this.message.text
                },
                chat_id: this.id
            })
            this.message.text = null
        },
        scrollBot() {
            if (!this.mounted) return
            let chat_el = this.$el.querySelector(".messages")
            if (!chat_el) return
            chat_el.scrollTo(0, chat_el.scrollHeight)
        },
        async closeChat() {
            this.$store.dispatch('chat/closeChat', this.chat.id)
        },
        async call() {
            try {
                this.callStatus = 'loading'
                await this.$store.dispatch('chat/call', this.chat.patient.id)
                this.callStatus = 'success'
                setTimeout(() => {
                    this.callStatus = null
                }, 10000)
            } catch (error) {
                this.callStatus = 'error'
                setTimeout(() => {
                    this.callStatus = null
                }, 5000)
            }
        },
    },
    components: { lMessage, lEditor, PerfectScrollbar }
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
        .call
            margin-left 20px
            margin-top 3px
            cursor pointer
            .phone, .success, .error, .loader
                fill none
                display none
            .phone
                stroke #777
                display flex
            .success
                stroke $success
            .error
                stroke $danger
            .loader
                border 3px solid #777
                border-bottom-color transparent
                border-radius 100%
                width 20px
                height 20px
                animation loader .5s linear infinite
                @keyframes loader
                    0%
                        transform rotate(0deg)
                    100%
                        transform rotate(360deg)
            &.loading
                cursor default
                .phone
                    display none
                .loader
                    display flex
            &.error
                .phone
                    display none
                .error
                    display flex
            &.success
                .phone
                    display none
                .success
                    display flex

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

.editor
    flex-shrink 0
    padding 13px 15px
    border-top 1px solid #ebe9f1
    background-color #fff
    display flex
    align-items center
    .input
        position relative
        width 100%
        border 1px solid #d8d6de
        border-radius 5px
        input
            border 0
            background transparent
            width 100%
            padding 6px 14px
            line-height 1.4
            &::placeholder
                font inherit
                line-height inherit
    .submit
        margin-left 14px
        flex-shrink 0

.download
    font-weight 500
    margin-right 20px

</style>
