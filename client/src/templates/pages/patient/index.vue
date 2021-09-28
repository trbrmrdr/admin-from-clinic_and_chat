<template lang="pug">

.patient
    .g-panel.about
        .fields.personal
            .g-field.name
                label ФИО
                input(v-model="patient.fio" :disabled="!canEdit")
            .g-field.phone-personal
                label Телефон
                the-mask(v-model="patient.phone" placeholder="+7 ### ###-##-##" :disabled="!canEdit" :mask="['+7 ### ###-##-##']")
        .fields.dates
            .g-field
                label Дата рождения
                the-mask(v-model="patient.birth_date" placeholder="День.Месяц.Год" :mask="['##.##.####']" :disabled="!canEdit")
            .g-field
                label Дата создания
                .value {{ patient.create_date ? patient.create_date : 'Нет' }}
        .fields.settings(v-if="canEdit")
            .g-field
                label Логин
                input(v-model="patient.username")
            .g-field
                label Пароль
                input(v-if="id == 'new'" v-model="patient.password" type="password")
                .value(v-else @click="$store.commit('ui/popup', { name: 'password', query: 'patient|' + patient.id })")
                    .g-link Сменить пароль
        .fields(v-if="canEdit")
            .g-btn-primary.save(@click="id == 'new' ? create() : edit()") Сохранить
            .submit-status.success(v-if="status == 'success'") Успешно сохранено
            .submit-status.error(v-else-if="status == 'error'") Произошла ошибка

    l-medical-card(:patient="patient")

</template>
<script>
import { TheMask } from 'vue-the-mask'
import axios from 'axios'
import lMedicalCard from './medical-card'
export default {
    props: {
        id: [Number, String]
    },
    async beforeRouteUpdate(to) {
        await this.load(to.params.id)
    },
    async created() {
        await this.load(this.id)
    },
    data: () => ({
        patient: null,
        status: null
    }),
    computed: {
        canEdit() {
            if (this.$store.state.user.user.admin)
                return true
            return false
        }
    },
    methods: {
        async load(id) {
            this.patient = {
                fio: null,
                phone: null,
                birth_date: null,
                create_date: null,
                username: null,
                password: null,
                medical_card: []
            }
            if (id === 'new') return

            const {data} = await axios.get(`/api/doctor/patient/${id}/`)
            console.log(data)
            this.setPatient(data)
        },
        async edit() {
            try {
                let birth_date = this.patient.birth_date,
                phone = this.patient.phone && this.patient.phone.length > 0 ? '+7' + this.patient.phone : null
                birth_date = birth_date && birth_date.length == 8 ? `${birth_date.substr(4, 4)}-${birth_date.substr(2,2)}-${birth_date.substr(0, 2)}` : null
                
                const { data: patient } = await axios.post('/api/doctor/patient/edit/', { fields: { id: this.patient.id, fio: this.patient.fio, username: this.patient.username, birth_date, phone } })
                
                this.setPatient(patient)
                this.setStatus('success')
            } catch (error) {
                this.setStatus('error')
            }
        },
        async create() {
            try {
                const { data: patient } = await axios.post('/api/doctor/patient/create/', { fields: this.patient })
                this.setPatient(patient)
                this.setStatus('success')
                await this.$router.push({name: 'patient', params: {id: patient.id}})
            } catch (error) {
                this.setStatus('error')
            }
        },
        setPatient(patient) {
            if (patient.birth_date)
                patient.birth_date = `${patient.birth_date.substr(8, 2)}-${patient.birth_date.substr(5,2)}-${patient.birth_date.substr(0, 4)}`
            this.patient = patient
        },
        setStatus(status) {
            this.status = status
            setTimeout(() => {
                this.status = null
            }, 5000)
        }
    },
    components: { lMedicalCard, TheMask }
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
    &:first-child
        margin-left 0

.job
    .statuses
        .value
            display flex
            .status
                margin-right 20px

.submit-status
    font-size 15px
    margin-top 5px
    &.success
        color $success
    &.error
        color $danger

</style>
