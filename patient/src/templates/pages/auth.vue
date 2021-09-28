<template lang="pug">

form.auth(@submit.prevent="submit")
    g-breadcrumbs(:link="{ name: 'welcome' }") На главную
    .text Для того чтобы начать чат 
        g-router-link.g-btn-primary.switch(:to="{ name: 'auth', params: { type: 'signup' } }") введите ФИО
        |  или если вы уже пользовались сервисом -  
        g-router-link.g-btn-primary.switch(:to="{ name: 'auth', params: { type: 'login' } }") войдите в свой профиль
    template(v-if="type == 'login'")
        .g-field
            label Логин
            input(v-model="username")
        .g-field
            label Пароль
            input(v-model="password" type="password")
    template(v-else-if="type == 'signup'")
        .g-field
            label Введите ФИО
            input(v-model="fio")
    //- g-router-link.g-link.switch(:to="{ name: 'auth', params: { type: 'login' } }") Войти с существующим логином
    button.g-btn-primary.submit(type="submit") Войти

</template>
<script>
import axios from 'axios'
export default {
    data: () => ({
        fio: null,
        username: null,
        password: null,
        error: null
    }),
    computed: {
        type() {
            return this.$store.getters['router/active'].page.params.type
        }
    },
    methods: {
        submit() {
            this.error = null
            if (this.type == 'login') this.login()
            else if (this.type == 'signup') this.signup()
        },
        async login() {
            const res = await this.$store.dispatch('user/login', { username: this.username, password: this.password })

            if (res.error)
                this.error = res.error.text
            else this.$store.dispatch('router/set', this.$store.state.router.redirect)
        },
        async signup() {
            const res = await this.$store.dispatch('user/signup', { fio: this.fio })

            if (res.error)
                this.error = res.error.text
            else this.$store.dispatch('router/set', this.$store.state.router.redirect)
        }
    }
}
</script>
<style lang="stylus" scoped>

.auth
    padding 20px

.breadcrumbs
    margin-bottom 15px

.title
    font-size 18px
    font-weight 500
    text-align center
    margin-bottom 15px

.text
    font-size 16px
    margin-bottom 30px

.switch
    // display inline-flex
    margin 5px 0

.g-field
    margin-bottom 10px

.submit
    width 100%
    margin-top 10px
    // margin-top 20px

</style>
