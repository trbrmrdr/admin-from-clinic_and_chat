<template lang="pug">

form.password(@submit.prevent="submit")
    .close(@click="$emit('close')")
        g-icon(name="ui/close")
    .g-field
        label Введите новый пароль
        input(v-model="password")
    button.g-btn-success.submit(type="submit") Сохранить

</template>
<script>
import axios from 'axios'
export default {
    beforeCreate() {
        console.log('PASSWORD POPUP')
    },
    props: {
        query: String
    },
    data: () => ({
        password: null
    }),
    methods: {
        async submit() {
            let type = this.query.split('|')[0],
                id = this.query.split('|')[1]
            const { data } = await axios.post('/api/auth/doctor/change_password/', {
                id,
                type,
                password: this.password
            })
            console.log(data)
            this.$emit('close')
        }
    }
}
</script>
<style lang="stylus" scoped>

.password
    padding 30px
    display flex
    flex-direction column

.submit
    margin-top 15px

</style>
