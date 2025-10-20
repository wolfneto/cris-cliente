import api from '../../../api/api'
export default {
    state: {
        produtos: [],      
        categorias: [],      
        error: false,
    },


    mutations: {
        set_produtos(state, value) {
            state.produtos = value;
        }, 
        set_categorias(state, value) {
            state.categorias = value;
        },     
        setError(state, value) {
            state.error = value;
        },

    },
    getters: {},

    actions: {
        async get_produtos(context) {
            let res = await api.get("/varejo", {});
            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_produtos', res.data);
            }
        },

        async get_categorias(context) {
            let res = await api.get("/categorias", {});
            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_categorias', res.data);
            }
        },

        async adicionar_produto(context, payload) {
            console.log("payload", payload);
            let retorno = await api.post("/varejo/salvar/", {
                produto: payload,
               
            })
            if (retorno.data !== false) {
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },

        async update_status(context, payload) {
            let res = await api.put("/varejo/updateStatus/", {
                data: payload
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },

        async saveProdutoImage(context, payload) {

            let retorno = await api.post("/produto/uploadImg/", payload);

            if (retorno.data !== false) {
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },
      

    }
}