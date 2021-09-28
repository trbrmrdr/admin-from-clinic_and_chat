<template lang="pug">

form.editor(@submit.prevent="submit")

    perfect-scrollbar.files(v-if="files.length > 0")
        .file(v-for="(file, index) in files")
            img(v-if="file.image" :src="file.url")
            .file-img(v-else) {{ file.file.name }}
            .delete(@click="deleteFile(file, index)")
                g-icon(name="ui/close")
    input#upload(type="file" ref="file" multiple @change="upload")

    .main
        .input
            input(v-model="text" placeholder="Введите сообщение")
            .upload(@click="initUpload")
                g-icon(name="chat/attachment")
        .g-btn-primary.submit(v-if="loading")
            .loader
        button.g-btn-primary.submit(v-else type="submit")
            g-icon(name="chat/send")

</template>
<script>
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
import axios from 'axios'
export default {
    props: {
        chat_id: Number
    },
    data: () => ({
        files: [],
        text: null,
        loading: false
    }),
    methods: {
        async submit() {
            if (this.loading) return

            this.loading = true
            if (this.files.length > 0) {
                await this.sendFiles()
                this.loading = false
                return
            }
            
            if (!this.text) return
            await this.$store.dispatch('chat/sendMessage', {
                message: {
                    text: this.text
                },
                chat_id: this.chat_id
            })
            this.text = null
            this.loading = false
        },
        async sendFiles() {
            let formData = new FormData()

            if (this.text)
                formData.append('text', this.text)
            for (let file of this.files)
                formData.append('files[]', file.file, file.name)

            const {data} = await axios({
                method: 'POST',
				url: `/api/chat/${this.chat_id}/patient/message_files/`,
				headers: {
                    'Content-Type': 'multipart/form-data'
				},
                data: formData,
            })
            console.log(data)
            this.files = []
            this.text = null
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
            for (let file of files) {
                if (file.type.match(/image.*/))
                    this.files.push({
                        url: URL.createObjectURL(file),
                        file,
                        image: true
                    })
                else if (allowedTypes.indexOf(file.type) !== -1)
                    this.files.push({
                        file
                    })
            }
            console.log(this.files)
        },
        deleteFile(file, index) {
            this.files.splice(index, 1)
            URL.revokeObjectURL(file.url)
        },
    },
    components: { PerfectScrollbar }
}
</script>
<style lang="stylus" scoped>

input#upload
    display none

.editor
    flex-shrink 0
    padding 10px 15px
    border-top 1px solid #ebe9f1
    background-color #fff
    display flex
    flex-direction column
    align-items flex-start

.main
    display flex
    align-items center

.input
    position relative
    width 100%
    border 1px solid #d8d6de
    border-radius 5px
    display flex
    align-items center
    input
        border 0
        background transparent
        width 100%
        padding 6px 9px
        padding-right 24px
        line-height 1.4
        &::placeholder
            font inherit
            line-height inherit
    .upload
        position absolute
        right 6px
        margin-top 3px
        fill none
        cursor pointer
        .icon
            width 22px
            height 22px
.submit
    margin-left 14px
    flex-shrink 0
    display flex
    align-items center
    padding 8px 8px 6px 7px
    .loader
        width 22px
        height 22px
        border 3px solid #fff
        border-bottom-color transparent
        border-radius 100%
        animation spin .5s linear infinite
        @keyframes spin
            0%
                transform rotate(0deg)
            100%
                transform rotate(360deg)
    .icon
        fill none
        width 22px
        height 22px

.files
    display flex
    align-items center
    padding-bottom 9px
    margin-bottom 1px
    position relative
    width 100%
    overflow-x auto
    .file
        position relative
        margin-right 8px
        img
            border-radius 4px
            max-height 70px
            max-width 100px
        &-img
            width 100px
            height 70px
            align-items center
            display flex
            justify-content center
            background-color #eee
            border-radius 4px
            font-weight 500
        .delete
            background-color $danger
            width 20px
            height 20px
            border-radius 3px
            cursor pointer
            display flex
            align-items center
            justify-content center
            flex-shrink 0
            padding 4px
            top 4px
            right 4px
            position absolute
            .icon
                stroke #fff
                width 100%

</style>
