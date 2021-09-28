<template lang="pug">

.photo.edit(v-if="canEdit" :style="{ backgroundImage: `url(${doctor.photo})` }" @click="initUpload" @drop.prevent="drop" @dragover.prevent)
    input#upload(type="file" ref="file" @change="upload")
.photo(v-else :style="{ backgroundImage: `url(${doctor.photo})` }")

</template>
<script>
import axios from 'axios'
export default {
    props: {
        doctor: Object,
        canEdit: Boolean
    },
    data: () => ({
        uploaded: null
    }),
    methods: { 
        initUpload() {
            this.$el.querySelector('#upload').click()
        },
        drop(event) {
            this.read(event.dataTransfer.files[0])
        },
        upload(event) {
            this.read(this.$refs.file.files[0])
        },
        async read(img) {
            if (!img.type.match(/image.*/))
                return
            
            let formData = new FormData()
            formData.append('id', this.doctor.id)
            formData.append('image', img)
            
            const { data } = await axios({
                method: 'POST',
				url: `/api/doctor/photo/`,
				headers: {
                    'Content-Type': 'multipart/form-data'
				},
                data: formData,
            })
            this.doctor.photo = data
        },
    }
}
</script>
<style lang="stylus" scoped>

#upload
    display none

</style>
