import api from '../../../api/api'
export default {
    state: {
        financeiro_academico: [],
        error: false,
    },

    getters: {

    },

    mutations: {
        set_financeiro_academico(state, value) {
            state.financeiro_academico = value;
        },
    },

    actions: {
        async get_financeiro_academico(context, payload) {
            try {
                let res = await api.get("/relatorio/financeiroAcademico", {
                    params: {
                        de: payload.de,
                        ate: payload.ate
                    }
                })
                context.commit('set_error', false);
                context.commit('set_financeiro_academico', res.data);
            } catch (error) {
                console.log('oporra', error);
                if (error.response.status == 500) {
                    context.commit('set_error', true);
                }
            }

        },
    }
}