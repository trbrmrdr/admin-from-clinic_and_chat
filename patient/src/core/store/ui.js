import axios from 'axios'

export default {
    namespaced: true,

    state: () => ({
        window: {
            width: 0,
            height: 0
        },
        select: null,
        loader: false,
        disableScroll: false,
        hidden: true,
        popup: null
    }),
    getters: {
        mediaBaseURL: () => process.env.VUE_APP_SERVER_URL
    },
    mutations: {
        resize(state) {
            state.window.width = window.innerWidth
            state.window.height = window.innerHeight
        },
    },
    
    actions: {
        init({ commit }) {
            resize()
            window.addEventListener('resize', resize)

            function resize() {
                commit('resize')
            }
        },
    }
}
