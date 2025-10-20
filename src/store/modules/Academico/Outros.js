import api from '../../../api/api'
export default {
    state: {   
        aluno_pedido_outros: [],     
          
        error: false,
    },


    mutations: {
      
        set_aluno_pedido_outros(state, value) {
            state.aluno_pedido_outros = value;
        }, 

        clean_aluno_pedido_outros(state) {
            state.aluno_pedido_outros = [];
        },
         
        setError(state, value) {
            state.error = value;
        },

    },
    getters: {},

    actions: {
    
        async get_aluno_pedidos_outros(context, payload) {
      
            let res = await api.get("/pedido_outros/findAllPedidosByCpf", {
                params: {
                    cpf: payload.cpf,                    
                }
            });
            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                console.log("data", res.data);
                context.commit('set_error', false);
                context.commit('set_aluno_pedido_outros', res.data);
            }
        },

        async set_pedido_outros(context, payload) {
        
            let res = await api.put("/pedido_outros/setPedidoOutros", {
                data: payload
            })
            if (res.data !== false) {
                context.commit('set_error', false);
            } else {
                context.commit('set_error', true);
            }
        },
        
       
    }
}