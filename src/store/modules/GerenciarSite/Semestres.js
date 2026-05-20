import api from '../../../plugins/axios'

export default {
    state: {
        semestres: [],
        error: false,
    },
    getters: {},
    mutations: {

        set_semestres(state, value) {
            state.semestres = value;
        },
        set_error(state, value) {
            state.error = value;
        },
        clean_semestre(state) {
            state.semestres = [];
        },
    },
    actions: {

        async get_semestres(context, payload) {
            let res = await api.get("/semestre/findallbyfaculdade", {
                params: {
                    faculdade: payload.faculdade,
                    graduacao: payload.graduacao
                }
            });
            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_semestres', res.data);
            }
        },

        async create_semestre(context, payload) {
            let res = await api.post("/semestre/", {
                semestre: payload
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },

        async update_semestre(context, payload) {
            let res = await api.put("/semestre/", {
                semestre: payload
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },

        async update_status_semestre(context, payload) {
            let res = await api.put("/semestre/updateStatus/", {
                semestre: payload
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },

        async update_situacao_semestre(context, payload) {
            let res = await api.put("/semestre/updateSituacao/", {
                semestre: payload
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },

        async delete_semestre(context, payload) {
            let res = await api.delete("/semestre/", {
                params: {
                    id: payload
                }
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        }

    }

}