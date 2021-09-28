<template lang="pug">

.message(:class="{ me }")
    .text(v-if="message.text") {{ message.text }}
    .files(v-if="message.files")
        a.file(v-for="file in message.files" :href="baseURL + file.url" target="_blank")
            .img(v-if="file.image" :style="{ backgroundImage: `url(${baseURL + file.url})` }")
            //- img(v-if="file.image" :src="baseURL + file.url")
            .file-img(v-else) {{ file.name }}
        //- .date {{ date }}
    //- .person

</template>
<script>
export default {
    props: {
        message: Object,
        me: Boolean
    },
    computed: {
        baseURL() {
            return process.env.VUE_APP_SERVER_URL
        }
        // date() {
        //     let hours = this.message.date.getHours(),
        //         minutes = this.message.date.getMinutes()
            
        //     if (hours < 10) hours = '0' + hours
        //     if (minutes < 10) minutes = '0' + minutes

        //     return hours + ':' + minutes
        // }
    }
}
</script>
<style lang="stylus" scoped>

.message
    background-color #fff
    // padding 4px 0
    margin-bottom 15px
    display flex
    align-self flex-start
    flex-direction column
    position relative
    border-radius 5px
    box-shadow 0 4px 8px 0 rgba(34,41,47,.12)
    font-size 14px
    line-height 1.4
    max-width 75%
    &:last-child
        margin-bottom 0
    &.me
        align-self flex-end
        // text-align right
        background linear-gradient(80deg,#7367f0,#9e95f5)
        color #fff
        .date
            text-align right

.text
    padding 8px 15px 8px
    white-space pre-line

.files
    display flex
    align-items flex-start
    flex-wrap wrap
    margin -1px
    .file
        margin 1px
        .img
            width 99px
            height 99px
            background-size cover
            background-position center
            border-radius 4px
        &-img
            width 100px
            height 70px
            align-items center
            display flex
            justify-content center
            background-color #fff
            color #333
            border-radius 4px
            font-weight 500

.date
    font-size 12px
    margin-top 1px
    font-weight 300

</style>
