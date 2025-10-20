import LicitacaoItem from './LicitacaoItem';
import LicitacaoListar from './LicitacaoListar';

export default [
    {
        path: '/licitacao/:id',
        name: 'Licitacao',
        component: LicitacaoListar,
        props: true,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/licitacao',
        name: 'Licitacao ',
        component: LicitacaoListar,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/licitacao/listar/:id',
        name: 'Listar',
        component: LicitacaoItem,
        props: true,
        meta: {
            requiresAuth: true
        }
    },
];