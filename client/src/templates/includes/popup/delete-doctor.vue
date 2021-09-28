<template lang="pug">

.delete-doctor
    .close(@click="$emit('close')")
        g-icon(name="ui/close")
    .text Вы уверены что хотите удалить врача?
    .btns
        .g-btn-primary.cancel(@click="$emit('close')") Отменить
        .g-btn-danger.submit(@click="submit") Удалить врача

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
    computed: {
        me() {
            return this.$store.state.user.user.id
        }
    },
    methods: {
        async submit() {
            console.log(this.query)
            const { data } = await axios.post('/api/doctor/delete/', { id: this.query })
            if (this.query == this.me) {
                this.$store.commit('user/clearUser')
                this.$router.push({ name: 'auth' })
            }
            else
                this.$router.push({ name: 'doctors' })
        }
    }
}
</script>
<style lang="stylus" scoped>

.delete-doctor
    padding 35px 20px 20px
    width 320px

.text
    font-weight 500
    margin-bottom 20px

.btns
    display flex
    align-items center
    justify-content space-between


</style>
