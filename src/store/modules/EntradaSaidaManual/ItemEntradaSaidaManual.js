import api from '../../../api/api'
export default {
    state: {
        item: {},
        itens: [],
        error: false,
    },

    mutations: {
        setItem(state, value) {
            state.item = {...value };
        },
        setItens(state, value) {
            state.itens = {...value };
        },
        setError(state, value) {
            state.error = value;
        }
    },

    actions: {
        async getItemByCod(context, payload) {
            let retorno = await api.get("/entrada_saida/getItemByCod", {
                params: {
                    codigo: payload
                }
            })
            if (retorno.data !== false) {
                context.commit('setItem', retorno.data);
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },
        async saveItens(context, payload) {
            console.log(payload);

            let retorno = await api.post("/entrada_saida/saveEntradaSaidaManual/", {
                items: payload
            })
            if (retorno.data !== false) {
                context.commit('setError', false);
                context.commit('setItens', payload);
            } else {
                context.commit('setError', true);
            }
        },



    }
}