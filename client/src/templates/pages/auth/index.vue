<template lang="pug">

.auth
    form.form(@submit.prevent="submit")
        .title Войти
        .g-field
            label Логин
            input.phone(v-model="username")
        .g-field
            label Пароль
            input.password(v-model="password" type="password")
        .error(v-if="error") {{ error }}
        button.g-btn.g-btn-primary.submit(type="submit") Войти

</template>
<script>
export default {
    data: () => ({
        username: '',
        password: '',
        error: null
    }),
    methods: {
        async submit() {
            this.error = null

            const res = await this.$store.dispatch('user/login', {
                username: this.username,
                password: this.password
            })

            if (res.error)
                this.error = res.error.text
        }
    },
}
</script>
<style lang="stylus" scoped>

.auth
    // background-color #eee
    position relative

.form
    background-color #fff
    position absolute
    height 100%
    width 500px
    right 0
    top 0
    display flex
    flex-direction column
    justify-content center
    padding 0 75px
    
    .title
        font-size 24px
        font-weight 500
        line-height 1.1
        margin-bottom 30px
    .g-field
        margin-bottom 14px
    .switch
        font-size 14px
        line-height 1.5
        text-align center
        margin-top 21px
    .error
        color $danger
        font-weight 500
        font-size 14px
        text-align center
        margin-bottom 15px

</style>
