import api from '../../../api/api'
export default {
    state: {
        periodos: [],
        vendedores: [],
    },
    getters: {},
    mutations: {
        set_periodos(state, value) {
            state.periodos = value;
        },
        set_vendedores(state, value) {
            state.vendedores = value;
        },
        clean_periodo(state) {
            state.periodos = [];
        },
    },
    actions: {

        async get_periodos(context, payload) {
            let res = await api.get("/periodo/findallbyfaculdadesemestre", {
                params: {
                    faculdade: payload.faculdade,
                    semestre: payload.semestre
                }
            });
            res.data.forEach((periodo) => {
                periodo.cod_periodo = {
                    id: periodo.cod_periodo,
                    nome: periodo.nome_periodo,
                };
                periodo.codigo_vendedor = {
                    codigo: periodo.codigo_vendedor,
                    nome: periodo.nome_vendedor,
                };
            });
            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_periodos', res.data);
            }
        },

        async get_vendedores(context) {
            let res = await api.get("/periodo/getvendedores", {});

            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_vendedores', res.data);
            }

        },

        async create_periodo(context, payload) {
            let res = await api.post("/periodo/", {
                periodo: payload.periodo,
                id_faculdade: payload.id_faculdade,
                id_semestre: payload.id_semestre
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },

        async update_periodo(context, payload) {
            let res = await api.put("/periodo/", {
                periodo: payload.periodo,
                id_faculdade: payload.id_faculdade,
                id_semestre: payload.id_semestre
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },

        async delete_periodo(context, payload) {
            let res = await api.delete("/periodo/", {
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

        async update_status_periodo(context, payload) {
            let res = await api.put("/periodo/updateStatus/", {
                periodo: payload
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },

        async update_situacao_periodo(context, payload) {
            let res = await api.put("/periodo/updateSituacao/", {
                periodo: payload
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },
    }

}