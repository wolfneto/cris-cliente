import Separacao from './Separacao';
import Consulta from './Consulta';
import Impressao from './ImpressaoSeparacao';
import EntradaSaidaManual from './EntradaSaidaManual';
import ImpressaoEtiquetaExpedicao from './ImpressaoEtiquetaExpedicao';
import Conferencia from './Conferencia';
import RoteiroExpedicao from './RoteiroExpedicao';
import Entregas from './Entregas';
import EntregasRelatorio from './EntregasRelatorio';
import EntregasControle from './EntregasControle';

export default [{
        path: '/estoque/separacao',
        name: 'SeparaÃ§Ã£o',
        component: Separacao,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/estoque/consulta',
        name: 'Consulta Estoques',
        component: Consulta,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/estoque/Impressao',
        name: 'Impressao SeparaÃ§Ã£o',
        component: Impressao,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/estoque/EntradaSaidaManual',
        name: 'Entrada ou SaÃ­da Manual',
        component: EntradaSaidaManual,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/estoque/impressaoEtiquetaExpedicao',
        name: 'Etiquetas ExpediÃ§Ãµes',
        component: ImpressaoEtiquetaExpedicao,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/estoque/Conferencia',
        name: 'ConferÃªncia',
        component: Conferencia,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/estoque/roteiroExpedicao',
        name: 'Roteiro ExpediÃ§Ã£o',
        component: RoteiroExpedicao,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/estoque/entregas',
        name: 'Entregas',
        component: Entregas,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/estoque/entregas_controle',
        name: 'Entregas Controle',
        component: EntregasControle,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/estoque/entregas_relatorio',
        name: 'Entregas Relatorio',
        component: EntregasRelatorio,
        meta: {
            requiresAuth: true
        }
    }
];