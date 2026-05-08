import api from '../../../plugins/axios'
export default {
    state: {
        produtos: [],
        valor_total_listas_online: 0,
        relatorio_listas_online_site: [],
        retorno_valor_minimo_venda_semestre: {},
        
        error: false,
    },

    mutations: {
        storeSetProdutos(state, value) {
            state.produtos = value;
        },
        setSelectedProduto(state, index) {
            state.produtos[index].selected = true;
        },
        set_valor_total_listas_online(state, value) {
            state.valor_total_listas_online = value;
        },
        set_relatorio_listas_online_site(state, value) {
            state.relatorio_listas_online_site = value;
        },
        set_retorno_valor_minimo_venda_semestre(state, value) {
            state.retorno_valor_minimo_venda_semestre = value;
        },
        clean_retorno_valor_minimo_venda_semestre(state){
            state.retorno_valor_minimo_venda_semestre = {}
        },
        setError(state, value) {
            state.error = value;
        }
    },

    actions: {
        async salvar_minimo_venda(context, payload) {                       
                let res = await api.post("/lista/salvarMinimoVenda", {
                    data: payload                   
                })                              
                    if (res.data !== false) {               
                        context.commit('set_error', false);
                        context.commit('set_retorno_valor_minimo_venda_semestre', res.data);
                    } else {
                        context.commit('set_error', true);
                    }
        },
        storeGetProduto(context, payload) {
            api
                .get("/produto/find", {
                    params: {
                        descricao: payload.trim()
                    }
                })
                .then(res => {
                    console.log(res.data);
                    if (res.data !== false) {
                        context.commit('storeSetProdutos', res.data);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        async gerar_relatorio_listas_online_site(context) {        
            let res = await api.get("/lista/gerarRelatorioListasOnline", {});

            if (res.data !== false) {               
                context.commit('set_error', false);
                context.commit('set_relatorio_listas_online_site', res.data);
            } else {
                context.commit('set_error', true);
            }
        },
    }
}