<template lang="pug">

form.editor(@submit.prevent="send")
    .close(@click="$emit('close')")
        g-icon(name="ui/close-circle")
        | Отменить
    textarea.text(v-model="text")
    .files
        .file(v-for="(file, index) in files")
            img(v-if="file.image" :src="file.url")
            .file-img(v-else) {{ file.file ? file.file.name : file.url.split('/')[file.url.split('/').length - 1] }}
            .delete(@click="deleteFile(file, index)")
                g-icon(name="ui/close")
        .add-file(@click="initUpload" @drop.prevent="drop" @dragover.prevent)
            g-icon(name="ui/add")
            input#upload(type="file" ref="file" multiple @change="upload")
    button.g-btn-success.submit(type="submit") Сохранить

</template>
<script>
import axios from 'axios'
export default {
    props: {
        note: Object,
        patient: Object
    },
    created() {
        if (this.note) {
            this.files = JSON.parse(JSON.stringify(this.note.files))
            this.text = this.note.text
        }
    },
    data: () => ({
        files: [],
        uploaded: [],
        text: '',
    }),
    methods: {
        async send() {
            let formData = new FormData()

            formData.append('patient_id', this.patient.id)
            formData.append('text', this.text)
            if (this.note)
                formData.append('note_id', this.note.id)
                
            for (let file of this.files)
                if (file.file)
                    formData.append('files[]', file.file, file.file.name)
                else formData.append('files[]', file.url)
            console.log('FILES!!!', formData.getAll('files[]'))
            
            const { data: res } = await axios({
                method: 'POST',
				url: `/api/doctor/patient/card/${this.note ? 'edit' : 'create'}/`,
				headers: {
                    'Content-Type': 'multipart/form-data'
				},
                data: formData,
            })
            console.log(res)
            if (this.note) {
                this.note.files = res.files
                this.note.text = res.text
            }
            else
                this.patient.medical_card.unshift(res)
            this.$emit('close')
        },
        initUpload() {
            this.$el.querySelector('#upload').click()
        },
        drop(event) {
            this.read(event.dataTransfer.files)
        },
        upload(event) {
            this.read(this.$refs.file.files)
        },
        read(files) {
            let allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.ms-excel', 'text/html', 'application/zip']
            for (let file of files)
                if (file.type.match(/image.*/))
                    this.files.push({
                        url: URL.createObjectURL(file),
                        file,
                        image: true
                    })
                else if (allowedTypes.indexOf(file.type) !== -1)
                    this.files.push({
                        url: URL.createObjectURL(file),
                        file
                    })
            console.log(this.files)
        },
        deleteFile(file, index) {
            this.files.splice(index, 1)
            if (file.url)
                URL.revokeObjectURL(file.url)
        },
    }
}
</script>
<style lang="stylus" scoped>


.editor
    display flex
    flex-direction column
    margin 30px 0 10px
    width 500px
    .close
        display flex
        align-items center
        cursor pointer
        margin-bottom 15px
        .icon
            fill none
            stroke $danger
            margin-right 15px
    .text
        border-radius 5px
        padding 11px 14px
        border 1px solid $gray
        height 100px
        font inherit
    .submit
        margin-top 20px
        width 300px
    .add-file
        width 80px
        height 80px
        display flex
        align-items center
        justify-content center
        cursor pointer
        background-color #f8f8f8
        border-radius 5px
        .icon
            fill none
            stroke $green
        input
            display none

.files
    display flex
    align-items center
    margin-top 15px
    .file
        position relative
        margin-right 15px
        img
            border-radius 4px
            max-height 100px
            max-width 140px
        &-img
            height 100px
            width 140px
            border-radius 4px
            background-color #eee
            display flex
            align-items center
            justify-content center
            font-weight 500
        .delete
            cursor pointer
            width 20px
            height 20px
            top 5px
            right 5px
            position absolute
            stroke #fff
            background-color rgba(#000, .4)
            padding 3px
            border-radius 4px


</style>
