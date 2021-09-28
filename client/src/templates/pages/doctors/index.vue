<template lang="pug">

.doctors
    l-filter(:filters="filters" @load="load" @add="add" @remove="remove")
    .g-panel.list
        router-link.item(v-for="doctor in doctors" :to="{ name: 'doctor', params: { id: doctor.id } }" :key="doctor.id")
            .field.photo
                .image(:style="{ backgroundImage: `url(${doctor.photo})` }")
            .field.name {{ doctor.fio }}
            .field.specialization {{ doctor.specialization ? doctor.specialization.name : '' }}
        router-link.item(v-if="isAdmin" :to="{ name: 'doctor', params: { id: 'new' } }")
            .field.photo
                g-icon.add(name="ui/add")
            .field.name Добавить врача


</template>
<script>
import axios from 'axios'
import lFilter from './filter'
export default {
    async beforeMount() {
        await this.loadSpecializations()
        await this.load()
    },
    data: () => ({
        doctors: [],
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
            {
                title: 'Специализация',
                key: 'specialization',
                type: 'select',
                mode: 'many',
                remove: true,
                items: []
            },
            {
                key: 'add-specialization',
                type: 'add',
                text: 'Добавить специализацию',
                value: null,
                active: false
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
                phone = this.filters.find(item => item.key == 'phone').value,
                specializations = this.filters.find(item => item.key == 'specialization').items.filter(item => item.active).map(item => item.id)
            const { data: doctors } = await axios.post('/api/doctor/doctors/', { id, fio, phone, specializations })

            this.doctors = doctors
        },
        async loadSpecializations() {
            const { data } = await axios.get('/api/doctor/specializations/')
            for (let item of data)
                item.active = false

            this.filters.find(item => item.key == 'specialization').items = data
        },
        async add(filter) {
            if (filter.key == 'add-specialization') {
                const { data } = await axios.put('/api/doctor/specializations/', {
                    name: filter.value
                })
                await this.loadSpecializations()
            }
        },
        async remove({filter, item}) {
            console.log(filter, item)
            if (filter.key == 'specialization') {
                const { data } = await axios.post('/api/doctor/specializations/', {
                    id: item.id,
                    method: 'delete'
                })
                // const { data } = await axios.post('/api/doctor/specializations/' + item.id)
                await this.loadSpecializations()
            }
        },
    },
    components: { lFilter }
}
</script>
<style lang="stylus" scoped>

.doctors
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
            &.photo
                width 60px
                .add
                    fill none
                    stroke $success
            &.name
                width 350px
                font-weight 500
            &.specialization
                width 200px
        .image
            width 40px
            height 40px
            border-radius 100%
            background-size cover
            background-position center

>>> .filter-specialization
    .select
        overflow-y auto
        max-height 150px

</style>
