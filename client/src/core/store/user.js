import axios from 'axios'
import router from 'core/router'
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
            sessionStorage.setItem('auth', true)
            state.auth = true
            state.user = user
        },
        clearUser(state) {
            state.user = null
        },
        setToken() {
            console.log('setToken', Cookies.get('csrftoken'))
            axios.defaults.headers.common['X-CSRFToken'] = Cookies.get('csrftoken')
        }
    },
    actions: {
        init({ commit, dispatch, state }) {
            state.auth = JSON.parse(sessionStorage.getItem('auth')) || false
            if (state.auth)
                commit('setUser', JSON.parse(sessionStorage.getItem('user_data')))
            
            state.loaded = true
            commit('setToken')
        },

        async login({ state, commit, rootState, dispatch }, { username, password }) {
            try {
                const { data } = await axios.post('/api/auth/doctor/login/', { username, password })

                if (data.error)
                    return data

                commit('setUser', data.user)
                commit('setToken')
                dispatch('chat/init', null, { root: true })
                commit('ui/redirect', { name: 'messanger' }, { root: true })

                return true
            } catch (error) {
                console.log(error)
                return false
            }
        },

        async logout({ state, commit }) {
            await axios.post('/api/auth/doctor/logout/')

            commit('setToken')
            sessionStorage.setItem('auth', false)
            state.auth = false
            await router.push({ name: 'auth' })

            commit('clearUser')
            return true
        },

        async setStatus({ state, commit }, { name, value }) {
            await axios.post('/api/doctor/status/', { name, value })
            state.user[name] = value
            return true
        },

        async changePassword({ state, commit }, password) {
            const { data } = await axios.post('/api/auth/doctor/change_password/', {
                password
            })
            
            commit('setToken')

            return data
        },

    }
}
