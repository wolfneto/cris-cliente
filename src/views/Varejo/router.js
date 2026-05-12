import Produto from './Produto';
import Pedido from './PedidoVarejo.vue';
import Vendedor from './Vendedor';

export default [
    {
        path: '/varejo/produto',
        name: 'Produto',
        component: Produto,
        props: true,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/varejo/pedido',
        name: 'Pedido ',
        component: Pedido,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/varejo/vendedor',
        name: 'Vendedor ',
        component: Vendedor,
        meta: {
            requiresAuth: true
        }
    } 
];