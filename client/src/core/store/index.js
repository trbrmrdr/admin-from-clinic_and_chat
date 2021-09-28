import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import ui from './ui'
import user from './user'
import chat from './chat'

const store = new Vuex.Store({
	modules: {
		ui,
		user,
        chat
	},
	actions: {
		async init({ dispatch, commit, state, getters }) {
			await dispatch('user/init')
			dispatch('ui/init')
            
            await getters['user/loaded']
            if (state.user.auth)
                await dispatch('chat/init')
		}
	}
})

export default store
