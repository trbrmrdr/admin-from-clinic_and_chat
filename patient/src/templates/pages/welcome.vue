<template lang="pug">

.welcome
    .hide(@click="hide") Скрыть
        //- g-icon(name="ui/chevron")
    g-router-link.settings(:to="{ name: 'settings' }")
        g-icon(name="nav/settings")
    .form
        .title Начать чат:
        template(v-if="settings.is_working")
            g-router-link.g-btn-primary.btn(:to="{ name: 'specializations' }") По специальности
            .g-btn-primary.btn(@click="createNow") Дежурный врач
        template(v-else)
            .g-btn-disabled.btn По специальности
            .g-btn-disabled.btn Дежурный врач
    .form
        .title Записаться на приём:
        g-router-link.g-btn-primary.btn(:to="{ name: 'specializations', params: { type: 'appointment' } }") Выбрать врача
    .form
        g-router-link.g-btn-primary.btn(:to="{ name: 'history' }") История обращений
    .form(v-if="auth")
        .g-btn-danger.btn(@click="logout") Выйти
    .form(v-else)
        .g-btn-primary.btn(@click="login") Войти
    .worktime Сервис работает с {{ settings.work_from.substring(0, 5) }} до {{ settings.work_to.substring(0, 5) }} по МСК

</template>
<script>
import axios from 'axios'
export default {
    data: () => ({
    }),
    computed: {
        auth() {
            return this.$store.state.user.auth
        },
        settings() {
            return this.$store.state.appointment.settings
        }
    },
    methods: {
        async createNow() {
            if (this.auth)
                await this.$store.dispatch('appointment/createAppointmentNow', { duty: true })
            else
                await this.login()
        },
        async login() {
            this.$store.state.router.redirect = { name: 'welcome' }
            await this.$store.dispatch('router/set', { name: 'auth', params: { type: 'signup' } })
        },
        async logout() {
            await this.$store.dispatch('user/logout')
        },
        hide() {
            this.$store.state.ui.hidden = true
        }
    }
}
</script>
<style lang="stylus" scoped>

.welcome
    padding 0 20px
    height 100%
    display flex
    justify-content center
    flex-direction column

.form
    .title
        margin-bottom 5px
        font-weight 500
    .btn
        margin-bottom 15px

.settings
    position absolute
    top 20px
    right 20px
    height 25px
    width 25px
    .icon
        fill none
        stroke #666

.hide
    position absolute
    top 20px
    left 20px
    height 30px
    cursor pointer
    height 25px
    display flex
    align-items center
    font-weight 500
    color $primary
    .icon
        fill #666

.worktime
    font-weight 500
    position absolute
    bottom 20px
    font-size 12px
    text-align center

</style>
