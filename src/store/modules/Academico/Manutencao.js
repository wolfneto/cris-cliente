import api from '../../../plugins/axios'
export default {
    state: {
        manutencao: {},
        avisoGeralAcademico: [
            { id: 0, msg: "", modal: 0},
            { id: 1, msg: "", modal: 0},
            { id: 2, msg: "", modal: 0},
            { id: 3, msg: "", modal: 0},
            { id: 4, msg: "", modal: 0},
            { id: 5, msg: "", modal: 0}
        ],
        error: false
    },

    getters: {},

    mutations: {
        setManutencao(state, value) {
            state.manutencao = {...value };
        },
        setAvisoGeralAcademico(state, value) {
            state.avisoGeralAcademico = value ;
        },
        setError(state, value) {
            state.error = value;
        }
    },

    actions: {
        async get_manutencao(context) {
            let res = await api.get("/manutencao/getManutencao", {});

            if (res.data) {
                context.commit('setManutencao', res.data.retorno);
            } else {
                context.commit('set_error', true);
            }
        },

        async save(context, payload) {
            let retorno = await api.post("/manutencao/editar", {
                obj: payload
            })
            if (retorno.data !== false) {
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },
        async get_aviso_geral_academico(context){
            let res = await api.get("/manutencao/getAvisoGeralAcademico", {});
            if (res.data) {
                context.commit('setAvisoGeralAcademico', res.data);
            } else {
                context.commit('setError', true);
            }
        },
        async save_aviso_geral_academico(context, payload) {            
            let retorno = await api.post("/manutencao/salvarAvisoGeralAcademico", {
                obj: payload
            })

            if (retorno.data !== false) {
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },
    }
}