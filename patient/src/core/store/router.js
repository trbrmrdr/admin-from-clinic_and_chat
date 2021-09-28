import axios from 'axios'

export default {
    namespaced: true,
    state: () => ({
        default: {
            name: 'welcome'
        },
        page: {
            name: null,
        },
        history: [],
        redirect: null,
        routes: [
            {
                name: 'welcome',
                component: () => import('pages/welcome'),
                auth: false
            },
            {
                name: 'auth',
                component: () => import('pages/auth'),
                auth: false
            },
            {
                name: 'specializations',
                component: () => import('pages/specializations'),
            },
            {
                name: 'doctors',
                component: () => import('pages/doctors'),
            },
            {
                name: 'doctor',
                component: () => import('pages/doctor'),
            },
            {
                name: 'chat',
                component: () => import('pages/chat'),
            },
            {
                name: 'appointment-success',
                component: () => import('pages/appointment-success'),
            },
            {
                name: 'settings',
                component: () => import('pages/settings'),
            },
            {
                name: 'history',
                component: () => import('pages/history/appointments'),
            },
            {
                name: 'history/chat',
                component: () => import('pages/history/chat'),
            },
        ]
    }),
    getters: {
        route: (state) => (name) => state.routes.find(route => route.name == name),
        active: (state, getters) => ({ page: state.page, route: state.routes.find(route => route.name == state.page.name) || null}),
    },
    mutations: {
    },
    actions: {
        async init({ state, getters, dispatch }) {
            dispatch('set', state.default)
        },
        async set({ state, getters, dispatch, rootState }, page) {
            if (page == state.page) return

            let route = getters.route(page.name)
            console.log(page)

            if (route.auth !== false && !rootState.user.auth) {
                state.redirect = page
                dispatch('set', { name: 'auth', params: { type: 'signup' } })
                return
            }

            if (!page.params)
                page.params = {}
            if (route.beforeEnter)
                await route.beforeEnter()
                
            state.history.push(state.page)
            state.page = page
        },
        async back({ state, getters, dispatch }, page) {
            dispatch('set', page || state.history[state.history.length])
        },
    }
}
