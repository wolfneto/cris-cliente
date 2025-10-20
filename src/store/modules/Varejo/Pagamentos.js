import api from '../../../api/api'
export default {
    state: {
        clientes_pagamentos: [],
        excel_pagamentos: [],
        error: false,
    },


    mutations: {
        setClientesPagamentos(state, value) {
            state.clientes_pagamentos = value;
        },
        setExcelPagamentos(state, value) {
            state.excel_pagamentos = value;
        },
        filtered_pagamentos(state, value) {
            state.clientes_pagamentos = value;
        },
        setError(state, value) {
            state.error = value;
        },

    },
    getters: {},

    actions: {
        async get_clientes_pagamentos(context, payload) {

            let res = await api.get("/cliente/getPagamentos", {
                params: {
                    status: payload.status,
                    data_de: payload.data_de,
                    data_ate: payload.data_ate
                }
            });
            if (res.data !== false) {
                context.commit('setClientesPagamentos', res.data);
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },

        async get_excel_pagamentos(context, payload) {
            let res = await api.get("/cliente/getPagamentos", {
                params: {
                    status: payload.status,
                    data_de: payload.data_de,
                    data_ate: payload.data_ate
                }
            });

            if (res.data !== false) {
                context.commit('setExcelPagamentos', res.data);
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },
        async deletar_link(context, payload) {
            let res = await api.post("cliente/pagamento/deletarLink", {
                codigo: payload
            })
            if (res.data !== false) {
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },
        async enviar_email(context, payload) {
            let res = await api.post("cliente/pagamento/email", {
                pagamento: payload
            })
            if (res.data !== false) {
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },
        async baixar_impressao(context, payload) {
            let res = await api.post("/cliente/pagamento/baixarImpressao", {
                pagamento: payload
            })
            if (res.data !== false) {
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },
        async baixar(context, payload) {
            let res = await api.post("/cliente/pagamento/baixar", {
                pagamento: payload
            })
            if (res.data !== false) {
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        }

    }
}