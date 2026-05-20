import api from '../../../plugins/axios'
export default {
    state: {
        entregas: [],
        pedidos: [],
        error: false,
    },

    mutations: {
        set_entregas(state, value) {
            state.entregas = value;
        },
        set_pedido(state, value) {
            state.pedidos.push(value);
        },
        remove_pedido(state, value) {
            console.log(state.pedidos, value);
            state.pedidos = state.pedidos.filter(pedido => pedido.numero_pedido != value);
            console.log(state.pedidos);
        },
        reset_pedidos(state, value) {
            state.pedidos = [];
        }
    },

    actions: {
        async get_entregas(context, payload) {
            try {
                let res = await api.get("/estoque/get_entregas", {
                    params: {
                        dados: payload
                    }
                })
                if (res.data == false) {
                    context.commit('set_snackbar', { show: true, type: 'error', time: 3000, msg: "Erro no Servidor, Contate o Administrador" })
                    context.commit('set_error', true);
                } else {
                    context.commit('set_error', false);
                    context.commit('set_entregas', res.data);

                }

            } catch (error) {
                if (error.response.status == 500) {
                    context.commit('set_error', true);
                }
            }

        },
        async get_roteiro(context, payload) {
            try {
                let res = await api.get("/estoque/getRoteiro", {
                    params: {
                        pedido: payload
                    }
                })
                if (res.data == false) {
                    context.commit('set_snackbar', { show: true, type: 'warning', time: 3000, msg: "Pedido " + res.data.numero_pedido + " NÃƒO ENCONTRADO" })
                } else {
                    if (res.data.status != '4') {
                        context.commit('set_snackbar', { show: true, type: 'warning', time: 3000, msg: "Pedido " + res.data.numero_pedido + " NÃƒO FATURADO" })
                    } else {
                        context.commit('set_error', false);
                        context.commit('set_pedido', res.data);
                    }
                    // if (res.data.online) {

                    // } else {
                    //     context.commit('set_snackbar', { show: true, type: 'warning', time: 3000, msg: "Pedido " + res.data.numero_pedido + " NÃƒO Ã‰ UM PEDIDO ONLINE" })
                    // }

                }

            } catch (error) {
                if (error.response.status == 500) {
                    context.commit('set_error', true);
                }
            }

        },
        async salvar_entregas(context, payload) {
            try {
                let res = await api.post("/estoque/salvar_entregas", {
                    dados: payload
                })
                if (res.data == false) {
                    context.commit('set_snackbar', { show: true, type: 'error', time: 3000, msg: "Erro no Servidor, Contate o Administrador" })
                    context.commit('set_error', true);
                } else {
                    context.commit('set_error', false);
                }

            } catch (error) {
                if (error.response.status == 500) {
                    context.commit('set_error', true);
                }
            }

        },
    }
}