import axios from 'axios'
import Cookies from 'js-cookie'

export default {
    namespaced: true,
    state: () => ({
        chats: [],
        chat: null,
        appointments: [],
        socket: null,
    }),
    mutations: {
    },
    actions: {
        async init({ commit, dispatch, state, getters }) {
            await dispatch('loadAppointments')
            await dispatch('createSocket')
            dispatch('checkAppointments')
        },

        async createSocket({ commit, dispatch, state, getters }) {
            let socket = new WebSocket(process.env.VUE_APP_WS_URL + '/ws/patient/')

            socket.onopen = function () {
                console.log("Соединение установлено.")
            }
            socket.onmessage = event => {
                let data = JSON.parse(event.data)
                console.log(data)
                if (data.type == 'get_message')
                    dispatch('getMessage', data.message)
                if (data.type == 'open_chat')
                    dispatch('openChat', data.chat_id)
                if (data.type == 'close_chat')
                    dispatch('clearChat')
            }
            socket.onclose = function (event) {
                if (event.wasClean) {
                    console.log('Соединение закрыто чисто')
                } else {
                    console.log('Обрыв соединения')
                }
                console.log('Код: ' + event.code + ' причина: ' + event.reason)
                dispatch('createSocket')
            }
            socket.onerror = function (error) {
                console.log("Ошибка " + error.message)
            }
            state.socket = socket
        },

        async openChat({ state, getters, dispatch, rootState }, id) {
            const { data } = await axios.get(`/api/chat/${id}/patient/`)
            console.log('openChat', data)
            state.chat = data
            rootState.ui.hidden = false
            dispatch('router/set', { name: 'chat' }, { root: true })
        },

        async closeChat({ state, getters, dispatch }) {
            await axios.post(`/api/chat/${state.chat.id}/patient/close/`)
            dispatch('clearChat')
        },

        async clearChat({ state, getters, dispatch }) {
            dispatch('loadAppointments')
            await dispatch('router/set', { name: 'welcome' }, { root: true })
            state.chat = null
        },

        async getMessage({ state, getters }, message) {
            state.chat.messages.push(message)
        },

        async loadAppointments({ state }) {
            const { data } = await axios.get('/api/patient/appointments/')
            console.log('loadAppointments', data)
            for (let appointment of data) {
                appointment.date_tz = new Date(appointment.date_tz)
            }
            state.appointments = data
        },

        async checkAppointments({ state, dispatch }, id) {
            check()
            setInterval(check, 15000)
            async function check() {
                state.socket.send(JSON.stringify({
                    check: true
                }))
            }
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

        async call({ state, getters, dispatch }) {
            const { data } = await axios.post(`/api/chat/call/`, {
                user_type: 'patient',
                to: state.chat.doctors[0].id
            })
        },

    }
}
