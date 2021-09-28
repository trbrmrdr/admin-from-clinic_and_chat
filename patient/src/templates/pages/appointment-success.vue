<template lang="pug">

.appointment-success(v-if="params.now")
    .title Запись создана
    .text Скоро вы будете перенаправлены в чат с доктором
    
.appointment-success(v-else)
    g-breadcrumbs(:link="{ name: 'welcome' }") На главную
    .title Вы записались на приём
    .info
        .label Время и дата:
        .value {{ date }}
    .info(v-if="params.doctor")
        .label Доктор:
        .value {{ params.doctor.fio }}
    .info(v-if="params.specializations.length > 0")
        .label Специальности:
        .value
            template(v-for="specialization in params.specializations") {{ specialization.name }}  
    .text {{ date }} войдите на сайт, и вы будете автоматически перенаправлены в чат с доктором
    .text(v-if="!user.has_login") Для того, чтобы войти в чат с другого устройства или браузера создайте логин и пароль
        .btn.g-btn-primary(@click="createLogin") Создать логин

</template>
<script>
export default {
    props: {
        params: Object
    },
    mounted() {
        console.log(this.params)
    },
    computed: {
        date() {
            let date = new Date(this.params.date),
                day = date.getDate(),
                month = date.getMonth(),
                year = date.getFullYear(),
                hour = date.getHours(),
                minute = date.getMinutes()

            day = day < 10 ? '0' + day : day
            month = month < 10 ? '0' + month : month
            hour = hour < 10 ? '0' + hour : hour
            minute = minute < 10 ? '0' + minute : minute

            return `${day}.${month}.${year} ${hour}:${minute}`
        },
        user() {
            console.log(this.$store.state.user.user)
            return this.$store.state.user.user
        }
    },
    methods: {
        createLogin() {
            this.$store.state.ui.popup = { name: 'create-login' }
        }
    }
}
</script>
<style lang="stylus" scoped>

.appointment-success
    padding 20px

.title
    font-weight 500
    font-size 18px
    margin-top 20px

.info
    margin-top 10px
    // .label
    .value
        font-weight 500
        margin-top 3px
        line-height 1.2

.text
    margin-top 20px
    line-height 1.2
    .btn
        margin-top 10px

</style>
