import api from '../../../plugins/axios'
export default {
    state: {
        codigo_link: {},
        pedidos: [],
        pedido_emitido: {},
        error: false
    },
    getters: {
        filteredPedidos: (state) => (filter) => {
            filter.status = filter.status ? "PAGO" : "NÃƒO PAGO";
            let arrayAux = state.pedidos.filter((p) => p.status == filter.status);
            let arrayAuxFiltered = []
            arrayAuxFiltered = arrayAux.filter((p) => p.id_pedidos == filter.val);

            if (arrayAuxFiltered.length) {
                arrayAux = arrayAuxFiltered;
            }
            arrayAuxFiltered = arrayAux.filter((p) => p.cpf_aluno == filter.val);
            if (arrayAuxFiltered.length) {
                arrayAux = arrayAuxFiltered;
            }
            arrayAuxFiltered = arrayAux.filter((p) =>
                p.aluno.nome
                .trim()
                .toUpperCase()
                .includes(filter.val.toUpperCase())
            );
            if (arrayAuxFiltered.length) {
                arrayAux = arrayAuxFiltered;
            }
            arrayAuxFiltered = arrayAux.filter((p) =>
                p.aluno.sobrenome
                .trim()
                .toUpperCase()
                .includes(filter.val.toUpperCase())
            );
            if (arrayAuxFiltered.length) {
                arrayAux = arrayAuxFiltered;
            }

            return arrayAux;
        }
    },

    mutations: {
        set_pedidos(state, value) {
            state.pedidos = value;
        },
        set_codigo_link(state, value) {
            state.codigo_link = value;
        },
        set_pedido_emitido(state, value) {
            state.pedido_emitido = value;
        }
    },
    actions: {
        async get_pedidos_cobranca_outros(context, payload) {
            let res = await api.get("/academico/pedidos/cobranca_outros", {
                params: {
                    de: payload.de,
                    ate: payload.ate,
                }
            })

            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_pedidos', res.data);
            }
        },

        async criar_link(context, payload) {
            let res = await api.post("/academico/pedidos/cobranca_outros/create", {
                link: payload
            })

            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_codigo_link', res.data);
            }
        },

        async delete_link(context, payload) {
            let res = await api.delete("/academico/pedidos/cobranca_outros/delete", {
                params: {
                    id: payload
                }
            })

            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
            }
        },

        async enviar_email_link(context, payload) {
            let res = await api.post("/academico/pedidos/cobranca_outros/enviar_email_link", {
                link: payload
            })

            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
            }
        },
        async emitir_pedido_cobranca(context, payload) {
            let res = await api.post("/academico/pedidos/cobranca_outros/emitir", {
                pedido: payload
            })
            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_pedido_emitido', res.data);
            }
        },

        async excluir_pedido(context, payload) {
            let res = await api.post("/academico/pedidos/cobranca_outros/excluir_pedido", {
                id: payload.id_pedidos
            })
            if (res.data == false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
            }
        },

    }

}