import api from '../../../plugins/axios'
export default {
    state: {
        equipamentos: [],
        produto: {},
        semestres: [],
        error: false,
    },
    getters: {},
    mutations: {
        set_equipamentos(state, value) {
            state.equipamentos = value;
        },
        set_produto(state, value) {
            state.produto = {...value };
        },
        set_semestres(state, value) {
            state.semestres = value;
        },
        set_error(state, value) {
            state.error = value;
        },
        clean_semestres(state) {
            state.semestres = [];
        },
    },
    actions: {
        async set_equipamento_online(context, payload) {

            let res = await api.post("/equipamentos/setOnline/", {
                data: payload
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },
        async get_equipamentos(context) {
            let res = await api.get("/equipamentos/findAll")

            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_equipamentos', res.data);
            }

        },
        async get_produto(context, payload) {

            let res = await api.get("/produto/getByCod", {
                params: {
                    cod: payload
                }
            })
            if (res.data !== false) {
                context.commit('set_produto', res.data);
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },
        async get_faculdade_semestre(context, payload) {

            let res = await api.get("/faculdades_semestres", {
                params: {
                    id_equipamento: payload
                }
            })
            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_semestres', res.data);
            }

        },
        async editar_equipamento(context, payload) {

            let res = await api.put("/equipamentos/udpateEquipamento/", {
                equipamento: payload
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },
        async adicionar_equipamento(context, payload) {

            let res = await api.post("/equipamentos/addEquipamento/", {
                equipamento: payload
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },
        async delete_equipamento_online(context, payload) {

            let res = await api.delete("/equipamentos/deleteEquipamentoOnline/", {
                params: {
                    id_lista: payload.id_lista,
                    id: payload.id
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