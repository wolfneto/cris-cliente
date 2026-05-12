import ItensPedidosxItensFaturados from './Academico/ItensPedidosxItensFaturados';
import PrevisaoAcademico from './Academico/PrevisaoAcademico';
import ListasEmPrevisao from './Academico/ListasEmPrevisao';
import CompararPrecoFornecedor from './Fornecedor/CompararPrecoFornecedor';
import FinanceiroAcademico from './Financeiro/FinanceiroAcademico';
import Endereco from './Aluno/Endereco';

export default [{
        path: '/relatorio/itenspedidosxitensfaturados',
        name: 'Itens Pedidos X Itens Faturados',
        component: ItensPedidosxItensFaturados,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/relatorios/previsaoAcademico',
        name: 'RelatÃ³rio PrevisÃ£o AcadÃªmico',
        component: PrevisaoAcademico,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/relatorios/compararPrecoFornecedor',
        name: 'Comparar PreÃ§o Fornecedor',
        component: CompararPrecoFornecedor,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/relatorios/listasEmPrevisao',
        name: 'Listas Em PrevisÃ£o',
        component: ListasEmPrevisao,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/relatorios/financeiroAcademico',
        name: 'Financeiro AcadÃªmico',
        component: FinanceiroAcademico,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/relatorios/relatorioEndereco',
        name: 'RelatÃ³rio de EndereÃ§os',
        component: Endereco,
        meta: {
            requiresAuth: true
        }
    },
];