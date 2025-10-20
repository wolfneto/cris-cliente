import { parseFloat } from 'core-js/fn/number';
import api from '../../../api/api'
export default {
    state: {
        editar: false,
        pedido: {},
        pedido_editar: {},
        // pedido: {
        //     id: "",
        //     numero: "",
        //     prefix: "",
        //     suffix: "",
        //     desconto: "",
        //     total: "",
        //     cliente: "",
        //     id_endereco: "",
        //     vendedor: "",
        //     atendente: "",
        //     obs: "",
        //     excluido: "",
        //     criado_em: "",
        //     criado_por: "",
        //     aprovado_em: "",
        //     aprovado_por: "",
        //     excluido_em: "",
        //     excluido_por: "",
        //     orcamento_pedido_status: {
        //         id: 1,
        //         descricao: "PENDENTE"
        //     }
        // },
        pedidos: [],
        itens: [],
        item: {
            qtd: 1,
            codigo: "",
            descricao: "",
            marca: "",
            saldo: "",
            valor: "",
            valor_ultima_compra: "",
            ipi: "",
            valor_fabricante: "",
            valido: false,
            editing: false,
            index: ""
        },
        selected_item: 0,
        itens_pedido: [],
        itens_pedido_editar: [],
        itens_pedido_impressao: [],
        cliente_impressao: {},
        item_pedido: {
            qtd: "",
            codigo: "",
            descricao: "",
            marca: "",
            saldo: "",
            valor: "",
            valor_ultima_compra: "",
            ipi: "",
            valor_fabricante: "",
            total: "",
            valido: false,
            editing: false
        },
        selected_item_pedido: "",
        status: [],
        error: false,
        lucro_total_itens_pedido: 0,
        qtd_total_itens_pedido: 0,
        valor_total_itens_pedido: 0,
        qtd_total_itens_pedido_editar: 0,
        valor_total_itens_pedido_editar: 0,
        desconto_pedido: 0,
        desconto_pedido_editar: 0,
        next_id: 0,
        item_previsao: {},
        item_repetido: false,
        tem_desconto: false,
        previa: false,
        itemScrollIndex: 0,
        qtdItemAdicionado: 1,
        itemRemovido: false,
        itemExcluido: false
    },

    getters: {
        itensPedido: state => {
            if (state.editar) {
                return state.itens_pedido_editar;
            } else {
                return state.itens_pedido
            }
        },
        totalPedido: state => {
            if (state.editar) {
                return state.valor_total_itens_pedido_editar;
            } else {
                return state.valor_total_itens_pedido
            }
        },
        qtdItens: state => {
            if (state.editar) {
                return state.qtd_total_itens_pedido_editar;
            } else {
                return state.qtd_total_itens_pedido
            }
        },
        desconto: state => {
            if (state.editar) {
                return state.desconto_pedido_editar;
            } else {
                return state.desconto_pedido;
            }
        }
    },

    mutations: {
        set_tem_desconto(state, value) {
            state.tem_desconto = value;
        },
        set_editar(state, value) {
            state.editar = value;
        },
        set_pedido_externo(state, value) {
            if (typeof value == 'object') {
                state.pedido = {...value };
            } else {
                state.pedido = value;
            }
        },
        set_pedido_editar(state, value) {
            state.pedido_editar = {...value };
        },
        set_pedidos_externo(state, value) {
            state.pedidos = value;
        },
        set_itens(state, value) {
            state.itens = value;
        },
        set_item(state, value) {
            Object.assign(state.item, value);
        },
        set_item_null(state) {
            state.item.qtd = 1;
            state.item.codigo = "";
            state.item.descricao = "";
            state.item.marca = "";
            state.item.saldo = "";
            state.item.valor = "";
            state.item.valido = false;
            state.item.editing = false;
            state.item.index = "";

        },
        set_selected_item(state, value) {
            state.selected_item = value;
        },

        set_itens_pedido(state, value) {
            state.itens_pedido = value;
        },

        set_itens_pedido_editar(state, value) {
            state.itens_pedido_editar = value;
        },

        async set_itens_pedido_impressao(state, value) {
            let itensPorPagina = 36;
            let array = value.slice(0);

            state.itens_pedido_impressao = new Array(
                    Math.ceil(array.length / itensPorPagina)
                )
                .fill()
                .map((_) => array.splice(0, itensPorPagina))

        },

        set_cliente_impressao(state, value) {
            state.cliente_impressao = {...value };
        },

        push_itens_pedido(state, value) {
            state.itemRemovido = false;
            state.itemExcluido = false;
            state.qtdItemAdicionado = 1;
            let insertItem = value.item,
                plus = value.plus;

            if (state.itens_pedido.some(item => item.codigo == insertItem.codigo)) {
                var index = state.itens_pedido.findIndex(item => item.codigo == insertItem.codigo);
                if (plus) {
                    // somar
                    state.itens_pedido[index].qtd += parseInt(insertItem.qtd);
                    state.itens_pedido[index].total = (state.itens_pedido[index].valor * state.itens_pedido[index].qtd).toFixed(2);
                    state.itemScrollIndex = index;
                    state.qtdItemAdicionado = state.itens_pedido[index].qtd;
                } else {
                    if (state.itens_pedido[index].qtd == 1) {
                        //remover
                        state.itens_pedido.splice(index, 1)
                        state.itemExcluido = true;
                    } else {
                        // subtrair
                        state.itens_pedido[index].qtd -= parseInt(insertItem.qtd);
                        state.itens_pedido[index].total = (state.itens_pedido[index].valor * state.itens_pedido[index].qtd).toFixed(2);
                        state.itemScrollIndex = index;
                        state.itemRemovido = true;
                        state.qtdItemAdicionado = state.itens_pedido[index].qtd;
                    }
                }

            } else if (plus) {
                state.itens_pedido.push(insertItem);
                state.itemScrollIndex = state.itens_pedido.length;
            }

        },
        check_item_repetido(state, value) {
            if (state.editar) {
                if (state.itens_pedido_editar.some(item => item.codigo == value.codigo)) {
                    state.item_repetido = true;
                } else {
                    state.item_repetido = false;
                }
            } else {
                if (state.itens_pedido.some(item => item.codigo == value.codigo)) {
                    state.item_repetido = true;
                } else {
                    state.item_repetido = false;
                }
            }
        },
        change_itens_pedido(state, value) {
            if (state.editar) {
                Object.assign(state.itens_pedido_editar[value.index], value);
            } else {
                Object.assign(state.itens_pedido[value.index], value);
            }
        },
        set_item_pedido(state, value) {
            state.item_pedido = value;
        },
        set_selected_item_pedido(state, value) {
            state.selected_item_pedido = value;
        },
        set_status(state, value) {
            state.status = value;
        },
        set_error(state, value) {
            state.error = value;
        },
        set_qtd_total_itens_pedido(state, value) {
            if (state.editar) {
                state.qtd_total_itens_pedido_editar = value;
            } else {
                state.qtd_total_itens_pedido = value;
            }
        },
        set_valor_total_itens_pedido(state, value) {
            if (state.editar) {
                state.valor_total_itens_pedido_editar = value;
            } else {
                state.valor_total_itens_pedido = value;
            }
        },
        set_desconto(state, value) {
            if (state.editar) {
                state.desconto_pedido_editar = value;
            } else {
                state.desconto_pedido = value;
            }
        },
        set_lucro_total_itens_pedido(state, value) {
            state.lucro_total_itens_pedido = value;
        },
        set_next_id(state, value) {
            state.next_id = value;
        },
        set_item_previsao(state, value) {
            state.item_previsao = {...value }
        },
        set_previa(state, value) {
            state.previa = value;
        }
    },

    actions: {
        async sync_itens_pedido(context, payload) {
            let res = await api.post("/orcamento/sync_itens", {
                itens: payload
            });

            if (res.data === false) {
                context.commit('set_error', true);

            } else {
                context.commit('set_itens_pedido', res.data);
            }
        },
        calcular_itens_pedido(context) {
            let qtd_total = 0;
            let valor_total = 0;
            let ultima_compra = 0;
            let total_ultima_compra = 0;
            let lucro_site = 0;
            let itens = [];

            if (context.state.editar) {
                itens = context.state.itens_pedido_editar
            } else {
                itens = context.state.itens_pedido
            }

            itens.forEach(i => {
                i.qtd = parseInt(i.qtd)
                ultima_compra = parseFloat(i.valor_ultima_compra);
                if (ultima_compra == 0) {
                    ultima_compra = parseFloat(i.valor_fabricante);
                } else {
                    ultima_compra = parseFloat(i.valor_ultima_compra) * ((100 + parseFloat(i.ipi)) / 100);
                }

                qtd_total += parseInt(i.qtd);
                valor_total += parseFloat(i.valor).toFixed(2) * i.qtd;
                total_ultima_compra += parseFloat(ultima_compra).toFixed(2) * i.qtd;

                if (i.saldo < i.qtd || i.saldo <= 0) {
                    i.sem_saldo = true;
                } else {
                    i.sem_saldo = false;
                }
            });
            lucro_site = (valor_total / total_ultima_compra) * 100 - 100;

            lucro_site = lucro_site.toFixed(2);

            if (isNaN(lucro_site)) {
                lucro_site = 0;
            }
            context.commit('set_qtd_total_itens_pedido', qtd_total);
            context.commit('set_valor_total_itens_pedido', valor_total);
            context.commit('set_lucro_total_itens_pedido', lucro_site);
        },
        async get_pedido(context, payload) {
            let res = await api.get("/pedido", {
                params: {
                    numero: payload
                }
            });

            if (res.data !== false) {
                res.data.clientes[0].cliente_enderecos = res.data.cliente_enderecos;
                res.data.clientes[0].enderecos_entrega = [];
                for (let endereco of res.data.clientes[0].cliente_enderecos) {
                    if (endereco.id == res.data.id_endereco) {
                        res.data.endereco_selecionado = endereco;
                    }
                    if (endereco.tipo == 1) {
                        res.data.clientes[0].endereco_principal = endereco;
                    } else {
                        endereco.loading = false;
                        endereco.cep_ok = true;
                        endereco.disabled = false;
                        res.data.clientes[0].enderecos_entrega.push(endereco);
                    }
                }
                res.data.clientes[0].cliente_contatos = res.data.cliente_contatos;

                context.commit('set_pedido', res.data);
                context.commit('set_itens_pedido', res.data.orcamento_itens);

            } else {
                context.commit('set_error', true);
            }
        },
        async save_orcamento(context, payload) {
            let res = await api.post("/orcamento", {
                orcamento: payload
            });

            if (res.data === false) {
                context.commit('set_error', true);

            } else {
                // nao sei
            }

        },
        async edit_orcamento(context, payload) {
            let res = await api.put("/orcamento", {
                orcamento: payload
            });

            if (res.data === false) {
                context.commit('set_error', true);

            } else {
                // nao sei
            }
        },
        async delete_pedido(context, payload) {
            let res = await api.delete("/pedido", {
                params: {
                    data: payload
                }
            });

            if (res.data === false) {
                context.commit('set_error', true);
            }
        },
        getProdutos(context, payload) {
            api
                .get("/produto/find", {
                    params: {
                        descricao: payload
                    }
                }).then(res => {
                    if (res.data !== false) {
                        console.log(res.data);
                        context.commit('set_itens', res.data);
                    } else {
                        // error
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        getProdutoByCod(context, payload) {
            api
                .get("/produto/findByCod", {
                    params: {
                        codigo: payload
                    }
                })
                .then(res => {
                    if (res.data !== false) {
                        context.commit('set_itens', res.data);
                    } else {
                        // error
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        async get_status(context) {
            let res = await api.get("/pedido/status");

            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_status', res.data);
            }

        },
        async get_next_id(context) {
            let res = await api.get("/pedido/next");

            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_next_id', res.data.id);
            }

        },
        async get_pedidos_externo(context, payload) {
            let res = await api.get("/pedidos", {
                params: {
                    payload: payload
                }
            });

            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_pedidos_externo', res.data);
            }

        },
        async emitir_pedido_externo(context, payload) {
            let res = await api.post("/pedido", {
                pedido: payload
            })
            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_pedido_externo', res.data);
            }
        },
        async get_previsao(context, payload) {
            let res = await api.get("/pedido/previsao", {
                params: {
                    codigo: payload
                }
            })
            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_item_previsao', res.data);
            }
        }
    }
}