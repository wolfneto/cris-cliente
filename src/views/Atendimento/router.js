import Status from './Status';
import Orcamento from './Orcamento';
// import Externo from './Externo';
// import Status from './Status';

export default [{
        path: '/atendimento/status',
        name: 'Atendimento - Status',
        component: Status,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/atendimento/orcamento',
        name: 'Atendimento - OrÃ§amento',
        component: Orcamento,
        meta: {
            requiresAuth: true
        }
    },
    // {
    //     path: '/atendimento/externo',
    //     name: 'Pedido Externo',
    //     component: Externo,
    //     meta: {
    //         requiresAuth: true
    //     }
    // }, , {
    //     path: '/atendimento/statusPedidosExterno',
    //     name: 'Status Pedidos Externo',
    //     component: Status,
    //     meta: {
    //         requiresAuth: true
    //     }
    // }
]