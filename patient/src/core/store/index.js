import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import ui from './ui'
import user from './user'
import chat from './chat'
import router from './router'
import appointment from './appointment'

const store = new Vuex.Store({
	modules: {
		ui,
		user,
        chat,
        router,
        appointment
	},
	actions: {
		async init({ dispatch, commit, state, getters }) {
            await dispatch('user/init')
            await dispatch('appointment/init')
			dispatch('ui/init')

            await getters['user/loaded']
            await dispatch('router/init')
            if (state.user.auth)
                await dispatch('chat/init')
		},
	}
})

export default store
