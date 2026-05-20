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
        name: 'Relatório Previsão Acadêmico',
        component: PrevisaoAcademico,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/relatorios/compararPrecoFornecedor',
        name: 'Comparar Preço Fornecedor',
        component: CompararPrecoFornecedor,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/relatorios/listasEmPrevisao',
        name: 'Listas Em Previsão',
        component: ListasEmPrevisao,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/relatorios/financeiroAcademico',
        name: 'Financeiro Acadêmico',
        component: FinanceiroAcademico,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/relatorios/relatorioEndereco',
        name: 'Relatório de Endereços',
        component: Endereco,
        meta: {
            requiresAuth: true
        }
    },
];