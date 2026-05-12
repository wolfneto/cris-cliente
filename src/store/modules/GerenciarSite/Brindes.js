import api from '../../../plugins/axios'

export default {
    state: {
        brinde: {
            id: 0,
            id_semestre: '',
            nome: '',
            descricao: '',
            valor_desbloqueio: 0,
            status: false,
            criado_em: new Date(),
            brindes_marcas: [
                { codigo: '', descricao: '', id_brinde: '', img_path: '', valor: 0 }
            ]
        },
        brindes: [],
        produto: {},
        error: false,
    },
    getters: {},
    mutations: {
        set_brinde(state, value) {
            state.brinde = value;
        },
        set_brindes(state, value) {
            state.brindes = value;
        },
        set_produto(state, value) {
            state.produto = {...value };
        },
        set_error(state, value) {
            state.error = value;
        },
        set_reset_brindes(state, value) {
            state.brindes = [];
        },
    },
    actions: {
        async get_brindes(context, payload) {
            let res = await api.get("/brinde/findallbyfaculdadesemestre", {
                params: {
                    semestre: payload
                }
            })

            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_brindes', res.data);
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

        async salvar_brinde(context, payload) {
            let res = await api.post("/brinde", {
                brinde: payload
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },
        async deletar_brinde(context, payload) {
            let res = await api.delete("/brinde", {
                params: {
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