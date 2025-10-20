import Listar from './Listas/Listar';
import Inserir from './Listas/Inserir';
import Importar from './ImportarLista';
import TrocarItens from './TrocarItens';

export default [{
        path: '/sasi/listas',
        name: 'Listas',
        component: Listar,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/sasi/inserirLista',
        name: 'Inserir',
        component: Inserir,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/sasi/importar',
        name: 'Importar',
        component: Importar,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/sasi/trocarItens',
        name: 'Consulta Codigo Listas',
        component: TrocarItens,
        meta: {
            requiresAuth: true
        }
    },
];