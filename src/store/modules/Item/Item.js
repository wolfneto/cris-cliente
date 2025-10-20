import api from '../../../api/api'
export default {
    state: {
        item: {},
        selected_item: 0,
        error: false,
        itens: [],
        fornecedores: [],
        marcas: [],
        status: [],
        enderecos: [],
        armazens: [],

        itens_historico: [],
        itens_realizado_entrada: [],
        selected_item_realizado_entrada: null,
        itens_realizado_saida: [],
        selected_item_realizado_saida: null,
        item_pendente_entrada: {},
        selected_item_pendente_entrada: null,
        item_pendente_saida: {},
        selected_item_pendente_saida: null,


    },

    getters: {},

    mutations: {
        set_item(state, value) {
            state.item = {...value };
        },
        set_selected_item(state, value) {
            state.selected_item = value;
        },
        setItens(state, value) {
            state.itens = value;
        },
        setError(state, value) {
            state.error = value;
        },
        setFornecedores(state, value) {
            state.fornecedores = value;
        },
        setMarcas(state, value) {
            state.marcas = value;
        },
        setStatus(state, value) {
            state.status = value;
        },
        setEnderecos(state, value) {
            state.enderecos = value;
        },
        setArmazens(state, value) {
            state.armazens = value;
        },

        set_itens_historico(state, value) {
            state.itens_historico = value;
        },
        set_itens_realizado_entrada(state, value) {
            state.itens_realizado_entrada = value;
        },
        set_selected_item_realizado_entrada(state, value) {
            state.selected_item_realizado_entrada = value;
        },
        set_itens_realizado_saida(state, value) {
            state.itens_realizado_saida = value;
        },
        set_selected_item_realizado_saida(state, value) {
            state.selected_item_realizado_saida = value;
        },
        set_item_pendente_entrada(state, value) {
            state.item_pendente_entrada = {...value };
        },
        set_selected_item_pendente_entrada(state, value) {
            state.selected_item_pendente_entrada = value;
        },
        set_item_pendente_saida(state, value) {
            state.item_pendente_saida = {...value };
        },
        set_selected_item_pendente_saida(state, value) {
            state.selected_item_pendente_saida = value;
        },
    },

    actions: {
        async saveItem(context, payload) {
            let retorno = await api.post("/produto/cadastrarItem/", {
                item: payload
            })
            if (retorno.data !== false) {
                context.commit('setError', false);
                context.commit('setItem', payload);
            } else {
                context.commit('setError', true);
            }
        },
        async getItensDCInfo(context) {
            let retorno = await api.get("/produto/getItensDCInfo")
            if (retorno.data !== false) {
                context.commit('setItens', retorno.data);
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },
        async saveEditItem(context, payload) {
            let retorno = await api.post("/produto/editarItem/", {
                item: payload
            })
            if (retorno.data !== false) {
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },
        async getFornecedores(context) {
            let retorno = await api.get("/produto/getFornecedores")

            if (retorno.data !== false) {

                context.commit('setFornecedores', retorno.data);
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },
        async getMarcas(context, payload) {
            let retorno = await api.get("/produto/getMarcas", {
                params: {
                    id_fornecedor: payload
                }
            })
            if (retorno.data !== false) {
                context.commit('setMarcas', retorno.data);
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },
        async getStatus(context) {
            let retorno = await api.get("/produto/getStatus")

            if (retorno.data) {
                context.commit('setStatus', retorno.data);
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },
        async getItemEnderecos(context) {
            let retorno = await api.get("/produto/getItemEnderecos")

            if (retorno.data) {
                context.commit('setEnderecos', retorno.data);
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },
        async getItemArmazens(context) {
            let retorno = await api.get("/produto/getItemArmazens")

            if (retorno.data) {
                context.commit('setArmazens', retorno.data);
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },
        async getRealizadoEntrada(context, payload) {

            let retorno = await api.get("/entrada_saida/getRealizadoEntradaSaida", {
                params: {
                    codigo: payload.codigo,
                    tipo: 1
                }
            })
            if (retorno.data !== false) {
                context.commit('set_itens_realizado_entrada', retorno.data);
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },
        async getRealizadoSaida(context, payload) {

            let retorno = await api.get("/entrada_saida/getRealizadoEntradaSaida", {
                params: {
                    codigo: payload.codigo,
                    tipo: 0
                }
            })
            if (retorno.data !== false) {
                context.commit('set_itens_realizado_saida', retorno.data);
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },
        async save_desconto_geral(context, payload) {
            let retorno = await api.post("/produto/saveDescontoGeral/", {
                desconto: payload
            })
            if (retorno.data !== false) {
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },
        async saveItemImage(context, payload) {

            let retorno = await api.post("/produto/saveItemImage/", payload);

            if (retorno.data !== false) {
                context.commit('setError', false);
            } else {
                context.commit('setError', true);
            }
        },
    }
}