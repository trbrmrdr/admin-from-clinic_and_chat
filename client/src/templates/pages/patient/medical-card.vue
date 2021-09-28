<template lang="pug">

.g-panel.medical-card
    .title Медицинская карта
    .add-note(v-if="!editor.active" @click="edit(null)")
        g-icon(name="ui/add")
        | Добавить запись
    l-editor(v-if="editor.active && !editor.note" :patient="patient" @close="editor.active = false")
    .note(v-for="(note, index) in patient.medical_card" :key="index")
        l-editor(v-if="editor.active && editor.note === note" :patient="patient" :note="editor.note" @close="editor.active = false")
        template(v-else)
            router-link.doctor(:to="{ name: 'doctor', params: { id: note.doctor.id } }")
                .photo(:style="{ backgroundImage: `url(${note.doctor.photo})` }")
                .info
                    .name {{ note.doctor.fio }}
                    .specialization {{ note.doctor.specialization.name }}
            .text {{ note.text }}
            .files
                a.file(v-for="file in note.files" :href="file.url" target="_blank")
                    img(v-if="file.image" :src="file.url")
                    .file-img(v-else) {{ file.url.split('/')[file.url.split('/').length - 1] }}
            .footer
                .options(v-if="note.doctor.id == user.id")
                    .option.edit(@click="edit(note)") Редактировать
                    .option.delete(@click="deleteNote(note)") Удалить
                .options(v-else)
                .date 18.05.2020 17:39

</template>
<script>
import axios from 'axios'
import lEditor from './editor'
export default {
    props: {
        patient: Object
    },
    mounted() {
        console.log(this.patient)
    },
    data: () => ({
        editor: {
            active: false,
            note: null
        }
    }),
    methods: {
        edit(note) {
            this.editor.active = true
            this.editor.note = note
        },
        async deleteNote(note) {
            await axios.post('/api/doctor/patient/card/delete/', { note_id: note.id })
            this.patient.medical_card.splice(this.patient.medical_card.indexOf(note), 1)
        },
        closeEditor() {
            this.editor.active = false
            this.editor.note = null
        }
    },
    computed: {
        user() {
            return this.$store.state.user.user
        }
    },
    components: { lEditor }
}
</script>
<style lang="stylus" scoped>

.medical-card
    margin-top 20px
    padding 20px

.title
    font-size 18px
    font-weight 500
    // margin-bottom 30px

.note
    margin-top 25px
    .text
        line-height 1.3

.doctor
    display flex
    align-items center
    margin-bottom 15px
    .photo
        width 40px
        height 40px
        border-radius 100%
        background-size cover
        background-position center
        margin-right 20px
    .info
        .name
            font-weight 500
        .specialization
            margin-top 3px
            font-size 15px
            color $secondary

.files
    display flex
    align-items center
    margin-top 15px
    .file
        position relative
        margin-right 15px
        img
            border-radius 4px
            max-height 90px
            max-width 110px
        &-img
            height 90px
            width 120px
            border-radius 4px
            background-color #eee
            display flex
            align-items center
            justify-content center
            text-align center
            font-weight 500


.add-note
    display flex
    align-items center
    height 30px
    margin-top 20px
    margin-bottom 20px
    cursor pointer
    .icon
        fill none
        stroke $green
        margin-right 15px

.footer
    display flex
    justify-content space-between
    margin-top 15px
    .options
        display flex
        .option
            margin-right 20px
            font-size 14px
            cursor pointer
            &.edit
                color $primary
            &.delete
                color $danger
    .date
        text-align right
        font-size 14px
        color $secondary

</style>
