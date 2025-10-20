import api from '../../../api/api'

export default {
    state: {
        data_inicial: '',
        data_final: ''
    },

    mutations: {
        setDatas(state, value) {
            state.data_inicial = value.data_inicial_padrao;
            state.data_final = value.data_final_padrao;
        },
        setDataInicial(state, value) {
            state.data_inicial = value;
        },
        setDataFinal(state, value) {
            state.data_final = value;
        }
    },

    actions: {
        async getDatas(context, payload) {
            let res = await api.get("/usuario/configs")

            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('setDatas', res.data);
            }
        }
    }
}