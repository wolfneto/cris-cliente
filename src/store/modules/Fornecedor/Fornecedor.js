import api from '../../../api/api'
export default {
    state: {
        fornecedor: {
            codigo: "",
            cnpj: "",
            razao_social: "",
            fantasia: "",
            inserido_em: "",
            inserido_por: "",
            editado_em: "",
            editado_por: "",
            enderecos: [{
                cep: "",
                logradouro: "",
                numero: "",
                complemento: "",
                bairro: "",
                cidade: "",
                uf: ""
            }],
            contatos: [{
                nome: "",
                email: "",
                telefone: "",
                celular: "",
                obs: ""
            }]
        },
        error: false,
        findFornecedor: false
    },

    getters: {},

    mutations: {
        setFornecedor(state, value) {
            state.fornecedor = value;
        },
        setfindFornecedor(state, value) {
            state.findFornecedor = value;
        },
        setError(state, value) {
            state.error = value;
        }
    },

    actions: {
        async checkFornecedor(context, payload) {

            let retorno = await api.get("/fornecedor/checkFornecedor", {
                params: {
                    codigo: payload
                }
            })
            if (retorno.data !== false) {
                context.commit('setError', false);
                if (retorno.data) {
                    context.commit('setfindFornecedor', true);
                } else {
                    context.commit('setfindFornecedor', false);
                }
            } else {
                context.commit('setError', true);
            }
        },
        async saveFornecedor(context, payload) {

            let retorno = await api.post("/fornecedor/saveFornecedor/", {
                fornecedor: payload
            })
            if (retorno.data !== false) {
                context.commit('setError', false);
                context.commit('setFornecedor', payload);
            } else {
                context.commit('setError', true);
            }
        }

    }
}