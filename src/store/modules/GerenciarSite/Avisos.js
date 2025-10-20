import api from '../../../api/api'
export default {
    state: {
        avisos: [],


    },
    getters: {},
    mutations: {
        set_avisos(state, value) {
            state.avisos = value;
        },
        clean_aviso(state) {
            state.avisos = [];
        },

    },
    actions: {
        async get_avisos(context, payload) {
            let res = await api.get("/aviso/findallbyfaculdadesemestre", {
                params: {
                    faculdade: payload.faculdade,
                    semestre: payload.semestre,
                }
            });
            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_avisos', res.data);
            }
        },

        async create_aviso(context, payload) {
            let res = await api.post("/aviso/", {
                aviso: payload.aviso,
                id_faculdade: payload.id_faculdade,
                id_semestre: payload.id_semestre
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },
        async update_aviso(context, payload) {
            let res = await api.put("/aviso/", {
                aviso: payload.aviso,
                id_faculdade: payload.id_faculdade,
                id_semestre: payload.id_semestre,

            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },
        async delete_aviso(context, payload) {
            let res = await api.delete("/aviso/", {
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


    }

}