import Inicio from './Gerenciar/Inicio';
import Faculdades from './Gerenciar/Faculdades';
import Semestres from './Gerenciar/Semestres';
import Periodos from './Gerenciar/Periodos';
import Representantes from './Gerenciar/Representantes';
import Brindes from './Gerenciar/BrindeSite';
import Avisos from './Gerenciar/Avisos';
import Carteirinha from './Gerenciar/Carteirinha';
import Equipamentos from './Gerenciar/Equipamentos';
import Pedidos from './Pedidos';
import PedidosStatus from './Status';
import App from './App';
import Retirada from './Retirada';
import Frete from './Frete';
import Cobranca from './Cobranca';
import Aluno from './Aluno';
import Outros from './Outros';

export default [{
        path: '/academico/gerenciar/inicio',
        name: 'Gerenciar Site Acadêmico',
        component: Inicio,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/academico/gerenciar/faculdades',
        name: 'Gerenciar Faculdades',
        component: Faculdades,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/academico/gerenciar/semestres',
        name: 'Gerenciar Semestres',
        component: Semestres,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/academico/gerenciar/periodos',
        name: 'Gerenciar Periodos',
        component: Periodos,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/academico/gerenciar/representantes',
        name: 'Gerenciar Representantes',
        component: Representantes,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/academico/gerenciar/brindeSite',
        name: 'Gerenciar Brindes',
        component: Brindes,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/academico/gerenciar/avisos',
        name: 'Gerenciar Avisos',
        component: Avisos,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/academico/gerenciar/Carteirinha',
        name: 'Gerenciar Carteirinha',
        component: Carteirinha,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/academico/gerenciar/equipamentos',
        name: 'Gerenciar Equipamentos',
        component: Equipamentos,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/academico/pedidos',
        name: 'Pedidos Acadêmico',
        component: Pedidos,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/academico/pedidosStatus',
        name: 'Status Pedidos',
        component: PedidosStatus,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/academico/app',
        name: 'App Acadêmico',
        component: App,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/academico/retirada',
        name: 'Retirada',
        component: Retirada,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/academico/frete',
        name: 'Frete',
        component: Frete,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/academico/cobranca',
        name: 'Cobrança - Pagamento Parcial',
        component: Cobranca,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/academico/aluno',
        name: 'Aluno',
        component: Aluno,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/academico/outros',
        name: 'Outros',
        component: Outros,
        meta: {
            requiresAuth: true
        }
    },
];