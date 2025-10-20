import api from '../../../api/api'
export default {
    state: {
        pedidos: [],
        pedidosAluno: [],
        pendentesRetirada: [],
        pagamentosRetirada: [],
        pedido: { result: {} },
        itens: [],
        pagamento: {},
        getnet: {},
        pedidoDcinfo: {},
        itensPedidoDcinfo: [],
        pedidosSaldoDcInfo: {
            array: [],
            total: 0
        },
        alunoReceita: {
            nascimento: '',
            nome: '',
            situacao: {
                descricao: ''
            }
        },
        statusPedidoDcInfo: {},
        endereco_entrega: {},
        financeiro_dcinfo: [],
        pix_cancelado: {},
        error: false,
    },

    getters: {
        colorStatusSistema: () => (status) => {
            if (status == "RESERVADO") return "light-blue lighten-1";
            if (status == "AGUARDANDO PAGAMENTO" || status == "BOLETO EM ABERTO") return "warning";
            if (status == "EXCLUIDO") return "error";
            if (status == "APROVADO" || status == "EMITIDO") return "primary";
            if (status == "FATURADO" || status == "RESERVA PAGA" || status == "BOLETO PAGO" || status == "CREDITO PAGO") return "success";
            if (status == "NAO EMITIDO") return "black";
            if (status == "CONFERINDO" || status == "PENDENTE") return "black";
            if (status == "SEPARANDO" || status == 'SEPARADO' || status == 'PAUSADO' || status == 'CANCELADO') return "red lighten-1";
            if (status == "PAGO OUTROS") return "deep-purple lighten-2";
            if (status == "NÃO PAGO OUTROS") return "deep-purple";
            if (status == "PIX PAGO") return "teal";
            if (status == "RECUSADO") return "warning";
        },

        formatDateToExcel: () => (data) => {
            data = data.split(' ');
            let date = data[0].split(/\//);
            let time = data[1];

            let newData = date[1] + '/' + date[0] + '/' + date[2] + ' ' + time;
            let returnDate = new Date(newData);
            if (returnDate != 'Invalid Date') {
                return new Date(newData);
            }
            return "";

        }
    },

    mutations: {
        set_pedidos(state, value) {
            state.pedidos = value;
        },
        set_PedidosAluno(state, value) {
            state.pedidosAluno = value;
        },
        set_pendentesRetirada(state, value) {
            state.pendentesRetirada = value;
        },
        set_pagamentosRetirada(state, value) {
            state.pagamentosRetirada = value;
        },
        set_pedido(state, value) {
            state.pedido = {...value };
        },
        set_itens(state, value) {
            state.itens = value;
        },
        set_pagamento(state, value) {
            state.pagamento = {...value };
        },
        set_getnet(state, value) {
            state.getnet = {...value }
        },
        set_pedidoDcinfo(state, value) {
            state.pedidoDcinfo = {...value }
        },
        set_statusPedidoDcInfo(state, value) {
            state.statusPedidoDcInfo = {...value }
        },
        set_alunoReceita(state, value) {
            state.alunoReceita = {...value }
        },
        set_info_pedido_saldo_dcinfo(state, value) {
            state.pedidosSaldoDcInfo.array = value.array;
            state.pedidosSaldoDcInfo.total = value.total;
        },
        set_itens_pedido_dcinfo(state, value) {
            state.itensPedidoDcinfo = value;
        },
        empty_pedidosSaldoDcInfo(state, value) {
            state.pedidosSaldoDcInfo = {
                array: [],
                total: 0
            };
        },
        empty_pedidosAluno(state, value) {
            state.pedidosAluno = [];
        },
        set_enderecoEntrega(state, value) {
            state.endereco_entrega = {...value };
        },
        set_financeiro_dcinfo(state, value) {
            state.financeiro_dcinfo = value;
        },
        set_error(state, value) {
            state.error = value;
        }
    },

    actions: {
        async enviar_outros_cobranca(context, payload) {
            let res = await api.post("/academico/pedido/enviar_outros_cobranca", {
                id: payload
            })

            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
            }
        },

        async get_pedidos(context, payload) {
            let res = await api.get("/academico/pedidos", {
                params: {
                    de: payload.de,
                    ate: payload.ate,
                    emitido: payload.emitido,
                    entregue: payload.entregue,
                    limite: payload.limite,
                    usuario: payload.usuario
                }
            })

            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_pedidos', res.data);
            }

        },
        async get_pedido_aluno(context, payload) {
            let res = await api.get("/academico/getPedidoAluno", {
                params: {
                    cpf_aluno: payload
                }
            })
            if (res.data == false) {
                context.commit('set_error', true);
            }
            if (!res.data.length) {
                context.commit('set_error', false);
                context.commit('set_PedidosAluno', []);
            } else {
                context.commit('set_error', false);
                context.commit('set_PedidosAluno', res.data);
            }
        },
        async update_pagamento_retirada(context, payload) {

            let res = await api.post("/academico/updatePagamentoRetirada", {
                pedido: payload
            })
            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
            }
        },
        async get_pendentes_retirada(context, payload) {
            let res = await api.get("/academico/getPendentesRetirada");
            if (res.data == false) {
                context.commit('set_error', true);
            }
            if (!res.data.length) {
                context.commit('set_error', false);
                context.commit('set_PedidosAluno', []);
            } else {
                context.commit('set_error', false);
                if (payload) {
                    context.commit('set_pendentesRetirada', res.data);
                } else {
                    context.commit('set_PedidosAluno', res.data);
                }
            }
        },
        async get_pagamentos_retirada(context, payload) {
            let res = await api.get("/academico/getPagamentosRetirada");
            if (res.data == false) {
                context.commit('set_error', true);
            }
            if (!res.data.length) {
                context.commit('set_error', false);
                context.commit('set_PedidosAluno', []);
            } else {
                context.commit('set_error', false);
                if (payload) {
                    context.commit('set_pagamentosRetirada', res.data);
                } else {
                    context.commit('set_PedidosAluno', res.data);
                }
            }
        },
        async get_pagamento(context, payload) {
            let res = await api.get("/academico/pedido/pagamento", {
                params: {
                    id_pedido: payload.id_pedidos
                }
            })
            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_pagamento', res.data);
            }
        },
        async post_pedido(context, payload) {
            let res = await api.post("/academico/pedido/baixar", {
                pedido: payload
            })
            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_pedido', res.data);
                context.commit('set_pedidoDcinfo', res.data.dados);
                context.commit('set_enderecoEntrega', res.data.dadosEndereco);
            }
        },
        async get_endereco_Entrega(context, payload) {
            let res = await api.get("/academico/pedido/getEnderecoEntrega", {
                params: {
                    cpf_aluno: payload
                }
            })
            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_enderecoEntrega', res.data);
            }
        },

        async aprovar_reserva_academico(context, payload) {
            //http://academicosolident.com.br:21135/pagamento/aprovar
            let res = await api.post("http://192.168.0.96:3010/pagamento/aprovar", {
                payment: payload
            })
            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_getnet', res.data);
            }
        },
        async cancelar_reserva_academico(context, payload) {
            //http://academicosolident.com.br:21135/pagamento/aprovar
            let res = await api.post("http://192.168.0.96:3010/pagamento/cancelar", {
                payment: payload
            })
            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_getnet', res.data);
            }
        },
        async cancelar_pix_academico(context, payload) {
            //http://academicosolident.com.br:21135/pagamento/aprovar
            let res = await api.post("https://solident.com.br/node/pix_estorno", {
                dados: payload
            })
            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('pix_cancelado', res.data);
                console.log('PIX CANCELADO', res.data);
            }
        },
        async update_pagamento(context, payload) {
            let url = "";
            if (payload.tipo == 'CANCELAR') {
                url = "/academico/pedido/cancelarReserva";
            } else if (payload.tipo == 'COBRAR') {
                url = "/academico/pedido/cobrarReserva";
            }
            let res = await api.post(url, {
                pagamento: payload
            })
            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
            }
        },
        async get_pedido_dcinfo(context, payload) {
            let res = await api.get("academico/pedido/printdcinfo", {
                params: {
                    pedido: payload
                }
            })

            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_pedidoDcinfo', res.data);
            }

        },
        async get_financeiro_dcinfo(context, payload) {
            let res = await api.post("academico/pedido/financeirodcinfo", {

                pedido: payload

            })

            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_financeiro_dcinfo', res.data)
            }
        },
        async get_info_pedido_saldo_dcinfo(context, payload) {
            let res = await api.get("academico/pedido/saldodcinfo", {
                params: {
                    pedido: payload
                }
            })

            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_info_pedido_saldo_dcinfo', res.data)
            }
        },

        async get_status_pedido_dcinfo(context, payload) {
            let res = await api.get("/academico/pedido/statusdcinfo", {
                params: {
                    pedido: payload
                }
            })
            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_statusPedidoDcInfo', res.data);
            }
        },

        async get_itens_pedido_dcinfo(context, payload) {
            let res = await api.get("/academico/pedido/itensdcinfo", {
                params: {
                    pedido: payload
                }
            })
            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_itens_pedido_dcinfo', res.data);
            }
        },

        async marcar_entregue(context, payload) {
            let res = await api.post("/academico/pedido/entregue", {
                pedido: payload
            })
            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
            }
        },
        async marcar_cancelado(context, payload) {
            let res = await api.post("/academico/pedido/cancelado", {
                pedido: payload
            })
            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
            }
        },

        async get_itens(context, payload) {
            let res = await api.get("/academico/pedido/itens", {
                params: {
                    pedido: payload
                }
            })
            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_itens', res.data);
            }
        },

        async get_cpf_receita(context, payload) {
            let res = await api.post("/academico/pedido/getCpfReceita", {
                cpf: payload
            })
            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_alunoReceita', res.data);
            }
        },
        
        async save_obs_pagamento(context, payload) {
            let res = await api.post("/academico/pedido/salvaObspagamento", {
                obj: payload
            })
            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
            }
        },

        // ajuste virus
        async emitir_pedido_DC_info(context, payload) {        
            let res = await api.post("/academico/pedido/emitirPedidoDCInfo", {
                params: {
                    pedido: payload
                }
            })
            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_itens', res.data);
            }
        },
        // ajuste virus
    }
}