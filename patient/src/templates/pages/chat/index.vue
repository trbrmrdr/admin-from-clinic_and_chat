<template lang="pug">

.chat(v-if="chat")

    .header
        .user
            .name {{ chat.doctors[0].fio }}
            .phone(v-if="chat.doctors[0].specialization") {{ chat.doctors[0].specialization.name }}
        .options
            .call(v-if="chat.doctors[0].phone_ats" @click="call" :class="{ loading: callStatus == 'loading', success: callStatus == 'success', error: callStatus == 'error' }")
                g-icon.phone(name="chat/phone")
                g-icon.success(name="ui/check")
                g-icon.error(name="ui/close")
                .loader
            .close(@click="close = true")
                g-icon(name="ui/close")

    perfect-scrollbar.messages
        .messages-container
            l-message(v-for="message in chat.messages" :key="message.id" :message="message" :class="{ me: message.user == me.id }")

    l-editor(:chat_id="chat.id")

    .close-confirm(v-if="close")
        .fade(@click="close = false")
        .form
            .form-title Закончить чат?
            .form-btns
                .g-btn-danger.form-btn(@click="closeChat") Закончить чат
                .g-btn-primary.form-btn(@click="close = false") Отменить
    .phone-editor(v-if="phoneEdit")
        .fade(@click="phoneEdit = false")
        .form
            .form-title Введите свой номер телефона
            .g-field
                the-mask(v-model="phone" placeholder="+7 ### ###-##-##" :mask="['+7 ### ###-##-##']")
            .g-btn-success.form-btn(@click="savePhone") Сохранить
            .g-btn-primary.form-btn(@click="close = false") Отменить
.chat(v-else)

</template>
<script>
import { TheMask } from 'vue-the-mask'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
import lMessage from './message'
import lEditor from './editor'
import axios from 'axios'
export default {
    props: {
        // params: [Number, String]
    },
    async mounted() {
        // await this.$store.dispatch('chat/loadChat', this.params)
        this.mounted = true
        this.scrollBot()
    },
    data: () => ({
        message: {
            text: null
        },
        mounted: false,
        close: false,
        phoneEdit: false,
        phone: null,
        callStatus: null
    }),
    computed: {
        me() {
            return this.$store.state.user.user
        },
        chat() {
            return this.$store.state.chat.chat
        },
    },
    watch: {
        'chat.messages': {
            immediate: true,
            async handler(value) {
                console.log('watcher', value)
                if (value) {
                    await this.$nextTick()
                    this.scrollBot()
                }
            }
        }
    },
    methods: {
        async submit() {
            if (!this.message.text) return
            await this.$store.dispatch('chat/sendMessage', {
                message: {
                    text: this.message.text
                },
                chat_id: this.chat.id
            })
            this.message.text = null
        },
        async closeChat() {
            this.$store.dispatch('chat/closeChat')
        },
        async savePhone() {
            const { data } = await axios.post('/api/patient/phone/', { phone: '+7' + this.phone })
            this.phoneEdit = false
            this.me.phone = data
            this.call()
        },
        async call() {
            if (this.me.phone) {
                try {
                    this.callStatus = 'loading'
                    await this.$store.dispatch('chat/call')
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
            }
            else
                this.phoneEdit = true
        },
        scrollBot() {
            console.log(this.chat)
            if (!this.mounted) return
            let chat_el = this.$el.querySelector(".messages")
            if (!chat_el) return
            chat_el.scrollTo(0, chat_el.scrollHeight)
        }
    },
    components: { lMessage, PerfectScrollbar, lEditor, TheMask }
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
            cursor pointer
            flex-shrink 0
            width 20px
            height 20px
            margin-right 10px
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
        .close
            background-color $danger
            width 20px
            height 20px
            border-radius 3px
            cursor pointer
            display flex
            align-items center
            justify-content center
            flex-shrink 0
            padding 4px
            position relative
            .icon
                stroke #fff
                width 100%

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

.close-confirm, .phone-editor
    width 100%
    height 100%
    position absolute
    .fade
        position absolute
        width 100%
        height 100%
        top 0
        left 0
        background-color rgba(#000, .3)
        cursor pointer
    .form
        background-color #fff
        border-radius 5px
        position absolute
        top 50%
        left 50%
        transform translate(-50%, -50%)
        display flex
        flex-direction column
        padding 10px
        &-title
            font-weight 500
            margin-bottom 5px
        &-btns
            display flex
            flex-direction column
        &-btn
            flex-shrink 0
            white-space nowrap
            margin-top 10px

</style>
