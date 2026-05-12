import api from '../../../plugins/axios'
export default {
    state: {
        pedidos: [],      
        error: false,
    },


    mutations: {
        set_pedidos(state, value) {
            state.pedidos = value;
        },      
        setError(state, value) {
            state.error = value;
        },

    },
    getters: {},

    actions: {
        async get_pedidos(context, payload) {

            let res = await api.get("/varejo", {});
            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_pedidos', res.data);
            }
        },
      

    }
}