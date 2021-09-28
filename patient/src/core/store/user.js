import axios from 'axios'
import Cookies from 'js-cookie'

export default {
    namespaced: true,
    state: () => ({
        user: null,
        auth: false,
        loaded: false,
    }),
    getters: {
        loaded(state) {
            return new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                    if (state.loaded) {
                        resolve(true)
                        clearInterval(interval)
                    }
                }, 50)
            })
        },
    },
    mutations: {
        setUser(state, user) {
            state.auth = true
            state.user = user
        },
        clearUser(state) {
            state.auth = false
            state.user = null
        },
        setToken(state, token) {
            axios.defaults.headers.common['X-CSRFToken'] = token
        }
    },
    actions: {
        async init({ commit, dispatch, state }) {
            const test = await axios.get('/api/auth/patient/auth/')
            console.log(test)
            const data = test.data
            console.log(data)
            
            if (data.user)
                commit('setUser', data.user)
            
            state.loaded = true
            commit('setToken', data.token)
        },

        async login({ state, commit, rootState, dispatch }, { username, password }) {
            try {
                const { data } = await axios.post('/api/auth/patient/login/', { username, password })
                console.log(data)

                if (data.error)
                    return data

                commit('setUser', data.user)
                commit('setToken', data.token)
                dispatch('chat/init', null, { root: true })

                return true
            } catch (error) {
                console.log(error)
                return false
            }
        },

        async signup({ state, commit, rootState, dispatch }, { fio }) {
            try {
                const { data } = await axios.post('/api/auth/patient/signup/', { fio })
                console.log(data)

                if (data.error)
                    return data

                commit('setUser', data.user)
                commit('setToken', data.token)
                dispatch('chat/init', null, { root: true })

                return true
            } catch (error) {
                console.log(error)
                return false
            }
        },

        async logout({ state, commit }) {
            const { data } = await axios.post('/api/auth/patient/logout/')

            commit('setToken', data.token)
            commit('clearUser')

            return true
        },

        async changeLogin({ state, commit }, { username, password }) {
            const { data } = await axios.post('/api/auth/patient/change_login/', {
                username,
                password
            })
            state.user.has_login = true
            state.user.token = data.token
            commit('setToken', data.token)

            return data
        },

    }
}
