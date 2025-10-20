import api from '../../../api/api'
export default {
    state: {
        errosPagamento: [],
        error: false
    },

    getters: {},

    mutations: {
        setErrosPagamento(state, value) {
            state.errosPagamento = value;
        },
        set_filter_erro_pagamentos(state, value) {
            state.errosPagamento = value;
        },
        setError(state, value) {
            state.error = value;
        }
    },

    actions: {
        async get_log_erros_pagamento(context, payload) {
            let res = await api.get("/pagamentos/erros", {
                params: {
                    de: payload.de,
                    ate: payload.ate
                }
            });
            if (res.data) {
                context.commit('set_error', false);
                context.commit('setErrosPagamento', res.data);
            } else {
                context.commit('set_error', true);
            }
        },

    }
}