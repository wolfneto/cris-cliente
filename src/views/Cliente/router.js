import Cliente from './Cliente';
import Cadastrar from './components/Cadastrar';
import Bloquear from './components/Bloquear';

export default [{
        path: '/clientes',
        name: 'Clientes',
        component: Cliente,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/cliente/buscar',
        name: 'Buscar Clientes',
        component: Cliente,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/cliente/cadastrar',
        name: 'Cadastrar Cliente',
        component: Cadastrar,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/cliente/bloquear',
        name: 'Bloquear Cliente',
        component: Bloquear,
        meta: {
            requiresAuth: true
        }
    },
];