<template lang="pug">

router-link.g-panel.notification(v-if="notification && type == 'addChat'" :to="{ name: 'chat', params: { id: data.id } }")
    .name {{ data.patient.fio }}
    .text Создан чат
router-link.g-panel.notification(v-else-if="notification && type == 'getMessage'" :to="{ name: 'chat', params: { id: data.chat.id } }")
    .name {{ data.chat.patient.fio }}
    .text(v-if="data.message.text") {{ data.message.text }}
    .text(v-if="data.message.files") {{ data.message.files.length }} файл

</template>
<script>
export default {
    computed: {
        notification() {
            console.log('COMPUTED NOTIFIcATION', this.$store.state.ui.notification)
            return this.$store.state.ui.notification
        },
        data() {
            return this.notification.data
        },
        type() {
            return this.notification.type
        }
    }
}
</script>
<style lang="stylus" scoped>

.notification
    position fixed
    z-index 20
    bottom 20px
    right 20px
    padding 15px
    max-width 250px
    max-height 200px

.name
    font-weight 500

.text
    margin-top 5px

</style>
