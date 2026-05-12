import PagamentoGerar from './Pagamento/PagamentoGerar';
import PagamentoVer from './Pagamento/PagamentoVer';
import ErrosPagamento from './Pagamento/ErrosPagamento';
import Bancos from './Bancos';

export default [{
        path: '/financeiro/pagamento/gerar',
        name: 'Gerar Pagamento',
        component: PagamentoGerar,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/financeiro/pagamento/ver',
        name: 'Ver Pagamentos',
        component: PagamentoVer,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/financeiro/pagamento/erros',
        name: 'Erros Pagamento',
        component: ErrosPagamento,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/financeiro/bancos',
        name: 'Bancos',
        component: Bancos,
        meta: {
            requiresAuth: true
        }
    },
];