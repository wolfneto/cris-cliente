import api from '../../../plugins/axios'
export default {
    state: {
        cpf_cnpj_exist: false,
        clientes: [],
        total_clientes: null,
        cliente_salvo: {},
        error: false,
        condicoes: [],
        atividades: [],
        tipos: [],
        grupos: [],
        vendedores: []

    },

    getters: {

    },

    mutations: {
        set_cpf_cnpj_exist(state, value) {
            state.cpf_cnpj_exist = value;
        },
        set_clientes(state, value) {
            for (let cliente of value) {
                if (cliente.cliente_enderecos.length == 0) {
                    cliente.cliente_enderecos.push({
                        codigo_cliente: cliente.codigo,
                        tipo: 1,
                        logradouro: "",
                        numero: "",
                        complemento: "",
                        bairro: "",
                        cidade: "",
                        uf: "",
                        cep: ""
                    });
                    cliente.cliente_enderecos.push({
                        codigo_cliente: cliente.codigo,
                        tipo: 2,
                        logradouro: "",
                        numero: "",
                        complemento: "",
                        bairro: "",
                        cidade: "",
                        uf: "",
                        cep: ""
                    })
                } else if (cliente.cliente_enderecos.length == 1) {
                    cliente.cliente_enderecos[1] = {
                        codigo_cliente: cliente.codigo,
                        tipo: 2,
                        logradouro: "",
                        numero: "",
                        complemento: "",
                        bairro: "",
                        cidade: "",
                        uf: "",
                        cep: ""
                    };
                }

            }
            state.clientes = value;
        },
        set_total_clientes(state, value) {
            state.total_clientes = value;
        },
        set_cliente_salvo(state, value) {
            state.cliente_salvo = {...value }
        },
        set_deselect_cliente(state) {
            state.cliente_selected = {};
            state.cliente_selected.selecionado = 0;
        },
        set_empty_cliente(state) {
            let obj = {
                codigo: "",
                cpf_cnpj: "",
                tipo: "",
                atividade: "",
                condicao: "",
                razao_social: "",
                fantasia: "",
                inscricao_estadual: "",
                inscricao_municipal: "",
                limite_credito: 0,
                vendedor: "",
                observacao: "",
                telefone: "",
                celular: "",
                email: "",
                criado_em: "",
                criado_por: "",
                editado_em: "",
                editado_por: "",
                selecionado: "",
                selected: "",
                endereco_principal: {
                    bairro: "",
                    cep: "",
                    cidade: "",
                    codigo_cliente: "",
                    complemento: "",
                    id: "",
                    logradouro: "",
                    numero: "",
                    tipo: "",
                    uf: ""
                },
                cliente_enderecos: [],
                cliente_atividade: {
                    descricao: "",
                    id: ""
                },
                cliente_contatos: [],
                cliente_tipo: {
                    descricao: "",
                    id: ""
                }

            }
            state.cliente = {...obj }
        },
        set_error(state, value) {
            state.error = value;
        },
        set_condicoes(state, value) {
            state.condicoes = value;
        },
        set_atividades(state, value) {
            state.atividades = value;
        },
        set_tipos(state, value) {
            state.tipos = value;
        },
        set_grupos(state, value) {
            state.grupos = value
        },
        set_vendedores(state, value) {
            state.vendedores = value
        }
    },

    actions: {
        async check_cpf_cnpj(context, payload) {
            let res = await api.get("/cliente/checkCpfCnpj", {
                params: {
                    value: payload
                }
            });

            if (res.data == false) {
                context.commit('set_cpf_cnpj_exist', false);
            } else {
                context.commit('set_cpf_cnpj_exist', true);
            }


        },
        async get_cliente_by_cod(context, payload) {
            let res = await api.get("/cliente/findByCod", {
                params: {
                    value: payload
                }
            });
            // console.log("enois", res.data);

            if (res.data == false) {
                context.commit('set_error', true);
                context.commit('set_cliente', {});
            } else {
                context.commit('set_cliente', res.data[0]);
                context.commit('set_error', false);
            }


        },
        async update_cliente(context, payload) {
            api.put("/cliente", {
                    cliente: payload
                })
                .then(res => {
                    console.log(res.data);

                    if (res.data === false) {
                        context.commit('set_error', true);

                    }
                })
        },
        async save_cliente(context, payload) {
            let res = await api.post("/cliente", {
                cliente: payload
            });
            if (res.data === false) {
                context.commit('set_error', true);

            } else {
                if (Array.isArray(res.data.cliente_enderecos)) {
                    let endereco = res.data.cliente_enderecos[0];
                    res.data.cliente_enderecos = endereco;
                }


                console.log('oporra', res.data);
                context.commit('set_cliente_salvo', res.data);
            }
        },
        async get_clientes(context, payload) {
            let res = await api.get("/clientes", {
                params: {
                    usuario: payload
                }
            });

            //context.commit('set_total_clientes', res.data.total);
            context.commit('set_clientes', res.data);

        },
        async get_cliente(context, payload) {
            let res = await api.get("/cliente/find", {
                params: {
                    value: payload.value,
                    vendedor: payload.vendedor
                }
            });


            if (res.data) {
                context.commit('set_total_clientes', res.data.length);
                context.commit('set_clientes', res.data);
            } else {
                context.commit('set_error', true);
            }

        },
        async get_cliente_by_code(context, payload) {

            let res = await api.get("/cliente/findByCod", {
                params: {
                    value: payload
                }
            });
            if (res.data) {
                context.commit('set_total_clientes', res.data.length);
                context.commit('set_clientes', res.data);
            } else {
                context.commit('set_error', true);
            }
        },
        async get_condicoes(context) {
            let res = await api.get("/cliente/condicoes");

            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_condicoes', res.data);
            }
        },
        async get_atividades(context) {
            let res = await api.get("/cliente/atividades");

            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_atividades', res.data);
            }
        },
        async get_tipos(context) {
            let res = await api.get("/cliente/tipos");

            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_tipos', res.data);
            }
        },
        async get_grupos(context) {
            let res = await api.get("/cliente/grupos");

            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_grupos', res.data);
            }
        },
        async get_vendedores(context) {
            let res = await api.get("/vendedores");

            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_vendedores', res.data);
            }
        }
    }
}