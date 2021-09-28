<template lang="pug">

.doctor(v-if="loaded" :key="id")
    .g-panel.about
        l-photo(:canEdit="canEdit" :doctor="doctor")
        //- .photo(:class="{ edit: canEdit }" :style="{ backgroundImage: `url(${doctor.photo})` }")
        
        .fields.personal
            .g-field.name
                label ФИО
                input(v-model="doctor.fio" :disabled="!canEdit")
            .g-field.phone-personal
                label Телефон
                the-mask(v-model="doctor.phone_personal" placeholder="+7 ### ###-##-##" :disabled="!canEdit" :mask="['+7 ### ###-##-##']")
            .g-field.phone-ats
                label Телефон АТС
                the-mask(v-model="doctor.phone_ats" placeholder="+7 ### ###-##-##" :disabled="!canEdit" :mask="['+7 ### ###-##-##']")

        .fields.job
            .g-field.field.specialization
                label Специализация
                .value 
                    .select(v-if="canEdit")
                        g-checkbox.item(v-for="item in specializations" :key="item.id" :active="doctor.specialization && item.id == doctor.specialization.id" @set="doctor.specialization == item ? doctor.specialization = null : doctor.specialization = item") {{ item.name }}
                    template(v-else) {{ doctor.specialization ? doctor.specialization.name : 'Нет' }}
            .g-field.statuses
                label Статусы
                .value
                    g-checkbox.status.color-success(:active="doctor.online" @set="doctor.online = !doctor.online" :disabled="!canEdit") Онлайн
                    g-checkbox.status(:active="doctor.duty" @set="doctor.duty = !doctor.duty" :disabled="!canEdit") Дежурный
                    g-checkbox.status.color-danger(:active="doctor.busy" @set="doctor.busy = !doctor.busy" :disabled="!canEdit") Занят

        .fields.settings(v-if="canEdit")
            .g-field
                label Логин
                input(v-model="doctor.username")
            .g-field
                label Пароль
                input(v-if="id == 'new'" v-model="doctor.password" type="password")
                .value(v-else @click="$store.commit('ui/popup', { name: 'password', query: 'doctor|' + id })")
                    .g-link Сменить пароль
            .g-btn-primary.save(@click="id == 'new' ? create() : edit()") Сохранить
            .submit-status.success(v-if="status == 'success'") Успешно сохранено
            .submit-status.error(v-else-if="status == 'error'") Произошла ошибка
            .g-btn-danger.delete(v-if="id != 'new' && deleteDoctor" @click="deleteDoctor") Удалить врача

    l-schedule.g-panel.schedule(:doctor="doctor")

</template>
<script>
import { TheMask } from 'vue-the-mask'
import axios from 'axios'
import lSchedule from './schedule'
import lPhoto from './photo'
export default {
    props: {
        id: [Number, String]
    },
    async created() {
        await this.loadSpecializations()
    },
    data: () => ({
        doctor: null,
        specializations: [],
        status: null,
        loaded: false
    }),
    watch: {
        id: {
            immediate: true,
            async handler(id, oldId) {
                if (!oldId || oldId != id) {
                    this.loaded = false
                    await this.load(id)
                    this.loaded = true
                }
            }
        }
    },
    computed: {
        canEdit() {
            if (this.$store.state.user.user.admin)
                return true
            else if (this.$store.state.user.user.id == this.doctor.id)
                return true
            return false
        },
        isAdmin() {
            return this.$store.state.user.user.admin
        }
    },
    methods: {
        async load(id) {
            this.doctor = {
                photo: null,
                fio: null,
                phone_personal: null,
                specialization: null,
                phone_ats: null,
                online: false,
                duty: false,
                busy: false,
                username: null,
                password: null
            }
            if (id == 'new') return

            const { data } = await axios.get(`/api/doctor/${id}/`)
            console.log('loaded', data)
            this.doctor = data
        },
        async edit() {
            try {
                let phone_personal = this.doctor.phone_personal && this.doctor.phone_personal.length > 0 ? '+7' + this.doctor.phone_personal : null,
                    phone_ats = this.doctor.phone_ats && this.doctor.phone_ats.length > 0 ? '+7' + this.doctor.phone_ats : null
                console.log(phone_personal, phone_ats)
                const { data: doctor } = await axios.post('/api/doctor/edit/', { fields: { ...this.doctor, phone_ats, phone_personal } })
                
                this.doctor = doctor
                if (this.doctor.id == this.$store.state.user.user.id) {
                    this.$store.state.user.user = doctor
                }
                this.setStatus('success')
            } catch (error) {
                this.setStatus('error')
            }
        },
        async create() {
            try {
                let phone_personal = this.doctor.phone_personal && this.doctor.phone_personal.length > 0 ? '+7' + this.doctor.phone_personal : null,
                    phone_ats = this.doctor.phone_ats && this.doctor.phone_ats.length > 0 ? '+7' + this.doctor.phone_ats : null
                console.log(phone_personal, phone_ats)
                const { data: doctor } = await axios.post('/api/doctor/create/', { fields: { ...this.doctor, phone_ats, phone_personal } })
                this.setStatus('success')
                await this.$router.push({name: 'doctor', params: {id: doctor.id}})
            } catch (error) {
                this.setStatus('error')
            }
        },
        setStatus(status) {
            this.status = status
            setTimeout(() => {
                this.status = null
            }, 5000)
        },
        async loadSpecializations() {
            const { data } = await axios.get('/api/doctor/specializations/')
            this.specializations = data
        },
        deleteDoctor() {
            this.$store.commit('ui/popup', { name: 'delete-doctor', query: this.id })
        }
    },
    components: { lSchedule, lPhoto, TheMask }
}
</script>
<style lang="stylus" scoped>

.about
    display flex
    padding 20px

.photo
    width 180px
    height 180px
    border-radius 100%
    background-size cover
    background-position center
    background-color #ccc
    flex-shrink 0
    &.edit
        cursor pointer

.g-field
    margin-bottom 20px
    &:last-child
        margin-bottom 0
    input
        max-width 230px

.fields
    margin-left 40px

.job
    .statuses
        .value
            display flex
            .status
                margin-right 20px

.select
    .item
        margin-bottom 8px
        &:last-child
            margin-bottom 0

.submit-status
    font-size 15px
    margin-top 5px
    &.success
        color $success
    &.error
        color $danger

.save
    margin-top -10px

.delete
    margin-top 10px

</style>
