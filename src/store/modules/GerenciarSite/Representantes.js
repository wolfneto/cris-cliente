import api from '../../../api/api'
export default {
    state: {
        representantes: [],

    },
    getters: {},
    mutations: {
        set_representantes(state, value) {
            state.representantes = value;
        },
        clean_representante(state) {
            state.representantes = [];
        },

    },
    actions: {

        async get_all_representantes(context, payload) {
            let res = await api.get("/representante/findallbyfaculdadesemestreperiodo", {
                params: {
                    faculdade: payload.faculdade,
                    semestre: payload.semestre,
                    periodo: payload.periodo
                }
            });
            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_representantes', res.data);
            }
        },

        async create_representante(context, payload) {
            let res = await api.post("/representante/", {
                representante: payload.representante,
                id_faculdade: payload.id_faculdade,
                id_semestre: payload.id_semestre,
                periodo: payload.periodo,
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },

        async update_representante(context, payload) {
            let res = await api.put("/representante/", {
                representante: payload.representante
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },

        async delete_representante(context, payload) {
            let res = await api.delete("/representante", {
                params: {
                    id: payload
                }
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },

        async update_status_representante(context, payload) {
            let res = await api.put("/representante/updateStatus/", {
                representante: payload
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },

        async update_situacao_representante(context, payload) {
            let res = await api.put("/representante/updateSituacao/", {
                representante: payload
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },
    }

}