<template lang="pug">

form.login(@submit.prevent="submit")
    .title Войти
    .g-input
        label Номер телефона
        the-mask.phone(v-model="phone" :mask="[ '+7 (###) ### ##-##' ]")
    .g-input
        label Пароль
        input.password(v-model="password" type="password")
    .error(v-if="error") {{ error }}
    button.g-btn.g-btn-primary.submit(type="submit") Войти
    .switch Не зарегестриованы? 
        router-link.g-link.link(:to="{ name: 'signup' }") Зарегестрироваться

</template>
<script>
import { TheMask } from 'vue-the-mask'
export default {
    data: () => ({
        phone: '',
        password: '',
        error: null
    }),
    methods: {
        async submit() {
            this.error = null

            const res = await this.$store.dispatch('user/login', {
                phone: '+7' + this.phone,
                password: this.password
            })

            if (res.error)
                this.error = res.error.text
        }
    },
    components: { TheMask }
}
</script>
<style lang="stylus" scoped>



</style>
