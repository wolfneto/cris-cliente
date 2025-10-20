import Produtos from './Produtos';
import Categorias from './Categorias';
import Relatorios from './Relatorios';
import Resgates from './Resgates';

export default [{
        path: '/fidelidade/produtos',
        name: 'Fidelidade Produtos',
        component: Produtos,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/fidelidade/categorias',
        name: 'Fidelidade Categorias',
        component: Categorias,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/fidelidade/relatorios',
        name: 'Fidelidade Relatórios',
        component: Relatorios,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/fidelidade/resgates',
        name: 'Fidelidade Resgates',
        component: Resgates,
        meta: {
            requiresAuth: true
        }
    },
];