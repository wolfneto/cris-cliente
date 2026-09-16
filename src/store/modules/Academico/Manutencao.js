import api from '../../../plugins/axios'

const createDefaultAvisos = () => ([
    { id: 1, msg: "", modal: 0 },
    { id: 2, msg: "", modal: 0 },
    { id: 3, msg: "", modal: 0 },
    { id: 4, msg: "", modal: 0 },
    { id: 5, msg: "", modal: 0 },
    { id: 6, msg: "", modal: 0 }
]);

const normalizeAvisos = (value) => {
    const defaults = createDefaultAvisos();
    if (!Array.isArray(value) || !value.length) {
        return defaults;
    }

    return defaults.map((item) => {
        const found = value.find((entry) => Number(entry.id) === item.id);
        return found ? { ...item, ...found } : item;
    });
};

export default {
    state: {
        manutencao: {},
        avisoGeralAcademico: createDefaultAvisos(),
        error: false
    },

    getters: {},

    mutations: {
        setManutencao(state, value) {
            state.manutencao = {...value };
        },
        setAvisoGeralAcademico(state, value) {
            state.avisoGeralAcademico = normalizeAvisos(value);
        },
        setError(state, value) {
            state.error = value;
        }
    },

    actions: {
        async get_manutencao(context) {
            let res = await api.get("/manutencao/getManutencao", {});

            if (res.data) {
                const payload = res.data.retorno || res.data;
                context.commit('setManutencao', payload || {});
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
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
                context.commit('setError', false);
            } else {
                context.commit('setAvisoGeralAcademico', []);
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