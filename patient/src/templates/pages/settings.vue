<template lang="pug">

.settings
    g-breadcrumbs(:link="{ name: 'welcome' }") На главную
    .g-field
        label ФИО
        input(v-model="fio")
    .g-field
        label Номер телефона
        the-mask(v-model="phone" placeholder="+7 ### ###-##-##" :mask="['+7 ### ###-##-##']")
    .g-btn-success.save(@click="save") Сохранить
    .g-btn-primary.login(@click="setLogin") Сменить логин и пароль

</template>
<script>
import axios from 'axios'
import { TheMask } from 'vue-the-mask'
export default {
    data: (context) => ({
        fio: context.$store.state.user.user.fio,
        phone: context.$store.state.user.user.phone,
    }),
    methods: {
        async save() {
            const { data } = await axios.post('/api/patient/edit/', {
                fio: this.fio,
                phone: this.phone ? '+7' + this.phone : null
            })
            this.$store.state.user.user = data
        },
        setLogin() {
            this.$store.state.ui.popup = { name: 'create-login' }
        }
    },
    components: { TheMask }
}
</script>
<style lang="stylus" scoped>

.settings
    padding 20px

.g-field
    margin-bottom 20px

.save
    margin-bottom 10px

.breadcrumbs
    margin-bottom 20px

</style>
