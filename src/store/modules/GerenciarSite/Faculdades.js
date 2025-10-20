import api from '../../../api/api'
export default {
    state: {
        faculdades: [],
        error: false,
    },
    getters: {},
    mutations: {
        set_faculdades(state, value) {
            state.faculdades = value;
        },
        set_error(state, value) {
            state.error = value;
        },
        clean_faculdade(state) {
            state.faculdades = [];
        },
    },
    actions: {
        async get_faculdades(context) {
            let res = await api.get("/faculdades", {});
            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_faculdades', res.data);
            }

        },

        async create_faculdade(context, payload) {
            let res = await api.post("/faculdade/", {
                faculdade: payload
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },

        async update_faculdade(context, payload) {
            let res = await api.put("/faculdade/", {
                faculdade: payload
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },

        async update_status(context, payload) {
            let res = await api.put("/faculdade/updateStatus/", {
                faculdade: payload
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },

        async update_situacao(context, payload) {
            let res = await api.put("/faculdade/updateSituacao/", {
                faculdade: payload
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },

        async delete_faculdade(context, payload) {
            let res = await api.delete("/faculdade/", {
                params: {
                    id_faculdade: payload.id_faculdade
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