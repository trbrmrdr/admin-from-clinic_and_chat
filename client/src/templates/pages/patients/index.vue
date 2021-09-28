<template lang="pug">

.patients
    l-filter(:filters="filters" @load="load")
    .g-panel.list
        router-link.item(v-for="patient in patients" :to="{ name: 'patient', params: { id: patient.id } }" :key="patient.id")
            .field.name {{ patient.fio }}
            .field.birth-date {{ patient.birth_date }}
            .field.phone {{ patient.phone }}
        router-link.item(v-if="isAdmin" :to="{ name: 'patient', params: { id: 'new' } }")
            .field.add
                g-icon(name="ui/add")
            .field.name Добавить пациента

</template>
<script>
import axios from 'axios'
import lFilter from './filter'
export default {
    async beforeMount() {
        await this.load()
    },
    data: () => ({
        patients: [],
        filters: [
            {
                title: 'ID',
                key: 'id',
                type: 'input',
                value: null
            },
            {
                title: 'ФИО',
                key: 'fio',
                type: 'input',
                value: null
            },
            {
                title: 'Телефон',
                key: 'phone',
                type: 'input',
                value: null
            },
        ],
        offset: 0
    }),
    computed: {
        isAdmin() {
            return this.$store.state.user.user.admin
        }
    },
    methods: {
        async load() {
            let id = this.filters.find(item => item.key == 'id').value,
                fio = this.filters.find(item => item.key == 'fio').value,
                phone = this.filters.find(item => item.key == 'phone').value
            const { data: patients } = await axios.post('/api/doctor/patients/', { id, fio, phone })

            this.patients = patients
        },
    },
    components: { lFilter }
}
</script>
<style lang="stylus" scoped>

.patients
    display flex
    align-items flex-start

.list
    width 100%
    .item
        height 60px
        display flex
        align-items center
        padding 0 20px
        border-bottom 1px solid #ebe9f1
        &:last-child
            border-bottom 0
        .field
            &.add
                width 50px
                fill none
                stroke $success
            &.name
                width 350px
                font-weight 500
            &.birth-date
                width 150px
            &.phone
                width 130px
</style>
