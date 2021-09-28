import axios from 'axios'
import router from 'core/router'
import Cookies from 'js-cookie'

export default {
    namespaced: true,
    state: () => ({
        chats: [],
        socket: null,
        loaded: {
            active: false,
            archive: false
        }
    }),
    getters: {
        chat: (state) => (id) => state.chats.find(chat => chat.id == id),
        active: (state) => state.chats.filter(chat => chat.ended == null),
        archive: (state) => state.chats.filter(chat => chat.ended)
    },
    mutations: {
    },
    actions: {
        async init({ commit, dispatch, state, getters }) {
            await dispatch('loadChats')
            await dispatch('createSocket')
            dispatch('checkChats')
        },

        async createSocket({ commit, dispatch, state, getters }) {
            let socket = new WebSocket(process.env.VUE_APP_WS_URL + '/ws/doctor/')
            socket.onopen = () => {
                console.log("Соединение установлено.")
            }
            socket.onmessage = event => {
                let data = JSON.parse(event.data)
                console.log(data)
                if (data.type == 'get_message')
                    dispatch('getMessage', data)
                else if (data.type == 'open_chat')
                    dispatch('addChat', data.chat_id)
                else if (data.type == 'close_chat')
                    dispatch('clearChat', data.chat_id)
                else if (data.type == 'change_status')
                    dispatch('changeStatus', data.statuses)
            }
            socket.onclose = (event) => {
                if (event.wasClean) {
                    console.log('Соединение закрыто чисто')
                } else {
                    console.log('Обрыв соединения')
                }
                console.log('Код: ' + event.code + ' причина: ' + event.reason)
                dispatch('createSocket')
            }
            socket.onerror = (error) => {
                console.log("Ошибка " + error.message)
            }
            state.socket = socket
        },

        async loadChats({ state }, archive = false) {
            const { data } = await axios.get('/api/doctor/chats/' + (archive ? 'archive/' : ''))
            console.log(data)
            state.chats.push(...data)

            if (archive) state.loaded.archive = true
            else state.loaded.active = true
        },

        async loadChat({ state }, id) {
            const { data } = await axios.get(`/api/chat/${id}/doctor/`)
            console.log(data)
            let index = state.chats.findIndex(item => item.id == id)
            if (index == -1)
                state.chats.unshift(data)
            else
                state.chats.find(chat => chat.id == id).messages = data.messages

            return true
        },

        async closeChat({ state }, id) {
            await axios.post(`/api/chat/${id}/doctor/close/`)
        },
        async clearChat({ state }, id) {
            const { data } = await axios.get(`/api/chat/${id}/doctor/`)
            let index = state.chats.findIndex(chat => chat.id == id)
            state.chats[index].ended = data.ended
            
            if (router.history.current.name == 'chat' && router.history.current.params.id == id)
                router.push({ name: 'messanger' })
        },

        async addChat({ state, dispatch }, id) {
            const { data: chat } = await axios.get(`/api/chat/${id}/doctor/`)
            let index = state.chats.findIndex(item => item.id == chat.id)
            if (index == -1) {
                state.chats.unshift(chat)
                dispatch('ui/setNotification', {
                    type: 'addChat',
                    data: chat
                }, { root: true })
            }
        },

        async getMessage({ state, getters, dispatch }, { message, chat_id }) {
            getters.chat(chat_id).messages.push(message)
            dispatch('ui/setNotification', {
                type: 'getMessage',
                data: {
                    chat: getters.chat(chat_id),
                    message
                }
            }, { root: true })
        },

        async sendMessage({ state }, { message, chat_id }) {
            state.socket.send(JSON.stringify({
                chat_id,
                message
            }))
        },

        async sendImages({ state }, { images, chat_id }) {
            console.log(images)
            state.socket.send(JSON.stringify({
                chat_id,
            }))
        },

        async changeStatus({ rootState }, statuses) {
            for (let name in statuses)
                rootState.user.user[name] = statuses[name]
        },

        async checkChats({ state }) {
            check()
            setInterval(check, 15000)
            async function check() {
                state.socket.send(JSON.stringify({
                    check: true
                }))
            }
        },

        async call({ state, getters, dispatch }, id) {
            const { data } = await axios.post(`/api/chat/call/`, {
                user_type: 'doctor',
                to: id
            })
            return data
        },

    }
}
