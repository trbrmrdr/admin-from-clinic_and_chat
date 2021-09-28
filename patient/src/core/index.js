import Vue from 'vue'

import 'styles/base.styl'
import 'global'
import 'icons'

import axios from 'axios'
import Cookies from 'js-cookie'
// console.log('csrf cookie', Cookies.get('csrftoken'))
// axios.defaults.headers.common['X-CSRFToken'] = Cookies.get('csrftoken')
axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL
axios.defaults.withCredentials = true
// axios.defaults.xsrfCookieName = 'csrftoken'
// axios.defaults.xsrfHeaderName = 'X-CSRFToken'

import Template from 'templates'
import store from 'core/store'

new Vue({
	async beforeCreate() {
		await store.dispatch('init')
	},
	el: '#app',
	// router,
	store,
	render: h => h(Template)
})
