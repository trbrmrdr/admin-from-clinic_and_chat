<template lang="pug">

.settings(v-if="settings")
    form.g-panel.panel(@submit.prevent="submit")
        .g-field
            label Ограничение по времени переписки (минуты:секунды)
            the-mask.time(v-model="settings.chat_duration" placeholder="Мин:Сек" :mask="[ '##:##' ]")
        .g-field
            label Время работы сервиса (часы:минуты)
            .inputs
                | От 
                the-mask.time(v-model="settings.work_from" placeholder="Час:Мин" :mask="[ '##:##' ]")
                |  До 
                the-mask.time(v-model="settings.work_to" placeholder="Час:Мин" :mask="[ '##:##' ]")
        button.g-btn-primary.submit(type="submit") Сохранить
        .status.success(v-if="status == 'success'") Успешно
        .status.error(v-if="status == 'error'") Произошла ошибка

</template>
<script>
import axios from 'axios'
import { TheMask } from 'vue-the-mask'
export default {
    async created() {
        const { data } = await axios.get('/api/chat/settings/')
        this.setSettings(data)
    },
    data: () => ({
        settings: null,
        status: null
    }),
    methods: {
        async submit() {
            if (this.status == 'loading') return

            this.status = 'loading'
            try {
                const { data } = await axios.post('/api/chat/settings/', {
                    chat_duration: {
                        minutes: this.settings.chat_duration.substr(0, 2),
                        seconds: this.settings.chat_duration.substr(2, 2),
                    },
                    work_from: {
                        hours: this.settings.work_from.substr(0, 2),
                        minutes: this.settings.work_from.substr(2, 2),
                    },
                    work_to: {
                        hours: this.settings.work_to.substr(0, 2),
                        minutes: this.settings.work_to.substr(2, 2),
                    },
                })
                this.setSettings(data)
                this.status = 'success'
            } catch (error) {
                this.status = 'error'
            }
            setTimeout(() => {
                this.status = null
            }, 5000);
        },
        setSettings(settings) {
            let duration = settings.chat_duration.split(':'),
                from = settings.work_from.split(':'),
                to = settings.work_to.split(':')

            settings.chat_duration = duration[1] + duration[2]
            settings.work_from = from[0] + from[1]
            settings.work_to = to[0] + to[1]
            
            this.settings = settings
        }
    },
    components: { TheMask }
}
</script>
<style lang="stylus" scoped>

.panel
    padding 20px

.time
    width 75px
    margin-right 5px
        

.title
    margin-bottom 20px

.g-field
    margin-bottom 20px
    label
        font-size 16px
        margin-bottom 8px
    &:last-child
        margin-bottom 0

.submit
    width 150px

.status
    font-weight 500
    margin-top 5px
    &.success
        color $success
    &.error
        color $danger

</style>
