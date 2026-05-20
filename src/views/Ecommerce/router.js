import Pedido from './Pedido';

export default [{
        path: '/ecommerce/pedido',
        name: 'Pedido',
        component: Pedido,
        meta: {
            requiresAuth: true
        }
    }

];