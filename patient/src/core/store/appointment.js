import axios from 'axios'

export default {
    namespaced: true,
    state: () => ({
        doctors: [],
        doctor: null,
        specializations: [],
        specializationsLoaded: false,
        settings: null
    }),
    getters: {
    },
    mutations: {
    },
    actions: {
        async init({ state }) {
            const { data } = await axios.get('/api/chat/settings/')
            state.settings = data
        },
        async loadDoctors({ state, getters, dispatch }, now = false) {
            const { data } = await axios.post('/api/patient/doctors/', {
                specializations: state.specializations.filter(item => item.active).map(item => item.id),
                now
            })
            console.log(data)
            state.doctors = data
        },
        async loadDoctor({ state, getters, dispatch }, id) {
            const { data } = await axios.get(`/api/patient/doctor/${id}/`, { id })
            console.log(data)
            state.doctor = data
        },
        async loadSpecializations({ state }) {
            const { data } = await axios.get('/api/patient/specializations/')
            for (let specialization of data)
                specialization.active = false
            state.specializations = data
            state.specializationsLoaded = true
        },
        async createAppointment({ state, dispatch, rootState }, { doctor, datetime }) {
            const { data } = await axios.post('/api/chat/appointment/create/', {
                doctor,
                datetime,
                specializations: state.specializations.filter(item => item.active).map(item => item.id)
            })
            console.log(data)
            if (data.error)
                return data
                
            dispatch('chat/loadAppointments', null, { root: true })
            dispatch('router/set', { name: 'appointment-success', params: data }, { root: true })
        },
        async createAppointmentNow({ state, dispatch }, { doctor, duty }) {
            const { data } = await axios.post('/api/chat/appointment/create/now/', {
                specializations: duty ? [] : state.specializations.filter(item => item.active).map(item => item.id),
                doctor
            })
            console.log(data)
            if (data.error)
                return data

            dispatch('chat/loadAppointments', null, { root: true })
            dispatch('router/set', { name: 'appointment-success', params: { ...data, now: true } }, { root: true })
        },
    }
}
