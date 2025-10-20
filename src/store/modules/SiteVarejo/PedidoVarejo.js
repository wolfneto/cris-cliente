import api from '../../../api/api'
export default {
    state: {
        pedidos_varejo: [],      
        error: false,
    },


    mutations: {
        set_pedidos_varejo(state, value) {
            state.pedidos_varejo = value;
        },      
        setError(state, value) {
            state.error = value;
        },

    },
    getters: {},

    actions: {
        async get_pedidos_varejo(context, payload) {
            // console.log("payload", payload);
            let res = await api.get("pedidos_varejo", {
                params: {
                    de: payload.de,
                    ate: payload.ate,
                    emitido: payload.emitido,                    
                    usuario: payload.usuario
                }
            });
            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_pedidos_varejo', res.data);
            }
        },
      

    }
}