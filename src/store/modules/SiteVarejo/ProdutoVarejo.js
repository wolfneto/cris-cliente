import api from '../../../plugins/axios'
export default {
    state: {
        produtos_varejo: [],      
        categorias_varejo: [],      
        error: false,
    },


    mutations: {
        set_produtos_varejo(state, value) {
            state.produtos_varejo = value;
        }, 
        set_categorias_varejo(state, value) {
            state.categorias_varejo = value;
        },     
        setError(state, value) {
            state.error = value;
        },

    },
    getters: {},

    actions: {
        async get_produtos_varejo(context) {
            let res = await api.get("/varejo", {});
            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_produtos_varejo', res.data);
            }
        },

        async get_categorias_varejo(context) {
            let res = await api.get("/categorias", {});
            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_categorias_varejo', res.data);
            }
        },

        // async adicionar_produto_varejo(context, payload) {
        //     console.log("payload", payload);
        //     let retorno = await api.post("/varejo/salvar/", {
        //         produto: payload,
               
        //     })
        //     if (retorno.data !== false) {
        //         context.commit('setError', false);
        //     } else {
        //         context.commit('setError', true);
        //     }
        // },

        async update_status_produto_varejo(context, payload) {
            let res = await api.put("/varejo/updateProdutoStatus/", {
                data: payload
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },

        async saveProdutoImage_varejo(context, payload) {

            let retorno = await api.post("/produto/uploadImg/", payload);

            if (retorno.data !== false) {
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },
      

    }
}