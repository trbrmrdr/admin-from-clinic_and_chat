<template lang="pug">

.nav
    .logo СМД
    .links
        router-link.link(v-for="(link, index) in links" :key="index" :to="link.link")
            g-icon(:name="link.icon")
            |{{ link.text }}
        router-link.link(v-if="isAdmin" :to="{ name: 'settings' }")
            g-icon(name="nav/settings")
            | Настройки
        //- router-link.link(:to="{ name: 'login' }") Аутентификация
        //- .link(@click="$store.dispatch('user/logout')") Выйти

</template>
<script>
export default {
    data: () => ({
        links: [
            {
                text: 'Чат',
                link: { name: 'messanger' },
                icon: 'nav/chat'
            },
            {
                text: 'База врачей',
                link: { name: 'doctors' },
                icon: 'nav/user'
            },
            {
                text: 'База пациентов',
                link: { name: 'patients' },
                icon: 'nav/users'
            },
            {
                text: 'Звонки',
                link: { name: 'calls' },
                icon: 'nav/phone'
            },
        ]
    }),
    computed: {
        isAdmin() {
            return this.$store.state.user.user.admin
        }
    }
}
</script>
<style lang="stylus" scoped>

.nav
    position fixed
    top 0
    left 0
    height 100%
    width 260px
    display flex
    flex-direction column
    flex-shrink 0
    box-shadow 0 0 15px 0 rgba(34,41,47,.05)
    background-color #fff
    padding 20px 15px

.logo
    padding 0 15px
    font-weight 500

.links
    margin-top 20px
    .link
        padding 10px 15px 10px 15px
        margin 5px 0
        display flex
        align-items center
        cursor pointer
        border-radius 4px
        &.router-link-active
            background linear-gradient(118deg,#7367f0,rgba(115,103,240,.7))
            box-shadow 0 0 10px 1px rgba(115,103,240,.7)
            color #fff
            .icon
                stroke #fff
        .icon
            fill none
            stroke #625f6e
            margin-right 15px
            width 20px
            height 20px

</style>
