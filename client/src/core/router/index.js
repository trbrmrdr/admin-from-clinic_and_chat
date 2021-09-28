import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import store from 'core/store'

const router = new VueRouter({
	routes: [
        {
            path: '',
            component: () => import('layouts/default'),
            children: [
                {
                    path: '/',
                    redirect: '/chat'
                },
                {
                    path: '/chat/',
                    name: 'messanger',
                    component: () => import('pages/chat'),
                    children: [
                        {
                            path: ':id',
                            name: 'chat',
                            props: (route) => ({ id: route.params.id }),
                            component: () => import('pages/chat/chat'),
                        },
                        // {
                        //     path: 'archive',
                        //     name: 'archive',
                        //     props: (route) => ({ archive: true }),
                        //     children: [
                        //         {
                        //             path: ':id',
                        //             name: 'archive/chat',
                        //             props: (route) => ({ id: route.params.id, archive: true }),
                        //             component: () => import('pages/chat/chat'),
                        //         },
                        //     ]
                        // },
                    ]
                },
                {
                    path: '/doctors',
                    name: 'doctors',
                    component: () => import('pages/doctors'),
                },
                {
                    path: '/doctor/:id',
                    name: 'doctor',
                    props: (route) => ({ id: route.params.id }),
                    component: () => import('pages/doctor'),
                },
                {
                    path: '/patients',
                    name: 'patients',
                    component: () => import('pages/patients'),
                },
                {
                    path: '/patient/:id',
                    name: 'patient',
                    props: (route) => ({ id: route.params.id }),
                    component: () => import('pages/patient'),
                },
                {
                    path: '/calls',
                    name: 'calls',
                    component: () => import('pages/calls'),
                },
                {
                    path: '/settings',
                    name: 'settings',
                    meta: { admin: true },
                    component: () => import('pages/settings'),
                },
                {
                    path: '*',
                    name: '404',
                    component: () => import('pages/404')
                },
            ]
        },
        {
            path: '/auth',
            name: 'auth',
            meta: { authPage: true },
            component: () => import('pages/auth'),
        },
	],

	mode: 'history',
	scrollBehavior(to, from, savedPosition) {
		if (to.name == from.name) return
		if (savedPosition) {
			return savedPosition
		} else {
			return { x: 0, y: 0 }
		}
	}
})

router.beforeEach(async (to, from, next) => {
    await store.getters['user/loaded']
    const auth = store.state.user.auth,
        authPage = to.matched.find(route => route.meta.authPage) ? true : false

    if (auth)
        if (authPage) next({ name: 'main' })
        else next()
    else
        if (authPage) next()
        else {
            store.state.ui.redirect = to
            next({ name: 'auth' })
        }
})
// router.afterEach(async (to, from) => {
// })

export default router
