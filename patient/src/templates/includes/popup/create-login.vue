<template lang="pug">

form.create-login(@submit.prevent="save")
    .g-title Создайте логин и пароль
    .g-field
        label Логин
        input(v-model="username")
    .g-field
        label Пароль
        input(v-model="password" type="password")
    button.g-btn-success.btn(type="submit") Сохранить
    .g-btn-primary.btn(@click="$emit('close')") Отменить

</template>
<script>
import axios from 'axios'
export default {
    data: () => ({
        username: null,
        password: null
    }),
    computed: {
        user() {
            return this.$store.state.user.user
        }
    },
    methods: {
        async save() {
            if (!this.username || !this.password)
                return

            await this.$store.dispatch('user/changeLogin', {
                username: this.username,
                password: this.password
            })

            this.$emit('close')
        }
    }
}
</script>
<style lang="stylus" scoped>

.create-login
    padding 10px

.g-field
    margin-top 10px

.btn
    margin-top 10px
    width 100%

</style>
