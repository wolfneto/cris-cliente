import Vuex from 'vuex';
import Vue from 'vue';
import 'es6-promise/auto';

import pedidoAtendimento from './modules/Atendimento/Pedido';
import pedidoAcademico from './modules/Academico/Pedido';
import pedidoCobranca from './modules/Academico/Cobranca';
import frete from './modules/Academico/Frete';
import aluno from './modules/Academico/Aluno';
import config from './modules/Configuracoes/Config';
import cliente from './modules/Atendimento/Cliente';
import listas from './modules/Listas/Listas';
import item from './modules/Item/Item'
import fornecedor from './modules/Fornecedor/Fornecedor'
import EntradaSaidaManual from './modules/EntradaSaidaManual/ItemEntradaSaidaManual'
import banco from './modules/Banco/Banco'
import financeiro from './modules/Financeiro/Financeiro'
import varejo from './modules/Varejo/Pagamentos'
import estoque from './modules/Estoque/Estoque'
import manutencao from './modules/Academico/Manutencao'
import gerenciarCarteirinha from './modules/GerenciarSite/Carteirinha'
import gerenciarEquipamentos from './modules/GerenciarSite/Equipamentos'
import gerenciarBrindeSite from './modules/GerenciarSite/BrindeSite'
import errosPagamento from './modules/Financeiro/ErrosPagamento'
import gerenciarFaculdades from './modules/GerenciarSite/Faculdades'
import gerenciarSemestres from './modules/GerenciarSite/Semestres'
import gerenciarPeriodos from './modules/GerenciarSite/Periodos'
import gerenciarRepresentantes from './modules/GerenciarSite/Representantes'
import gerenciarAvisos from './modules/GerenciarSite/Avisos'
import produtoVarejo from './modules/SiteVarejo/ProdutoVarejo'
import pedidoVarejo from './modules/SiteVarejo/PedidoVarejo'
import vendedorVarejo from './modules/SiteVarejo/VendedorVarejo'
import pedidoOutros from './modules/Academico/Outros'
import api from '../api/api'

Vue.use(Vuex);

export default new Vuex.Store({

    modules: {
        aluno,
        pedidoAtendimento,
        pedidoAcademico,
        pedidoCobranca,
        frete,
        config,
        cliente,
        listas,
        item,
        fornecedor,
        EntradaSaidaManual,
        banco,
        financeiro,
        varejo,
        estoque,
        manutencao,
        gerenciarCarteirinha,
        gerenciarEquipamentos,
        gerenciarBrindeSite,
        errosPagamento,
        gerenciarFaculdades,
        gerenciarSemestres,
        gerenciarPeriodos,
        gerenciarRepresentantes,
        gerenciarAvisos,
        produtoVarejo,
        pedidoVarejo,
        vendedorVarejo,
        pedidoOutros
    },

    state: {
        index_tabs: 0,
        telaPedidoOrcamento: false,
        snackbar: {
            msg: "",
            tiny: "",
            type: "",
            show: false,
            time: 2000,
        },
        loading: false,
        permissoes: {}

    },
    mutations: {
        set_index_tabs(state, value) {
            state.index_tabs = value;
        },
        set_tela_pedido_orcamento(state, value) {
            state.telaPedidoOrcamento = value;
        },
        set_snackbar(state, value) {
            state.snackbar = {...value }
        },
        set_loading(state, value) {
            state.loading = value;
        },
        set_permissoes(state, value) {
            state.permissoes = {...value };
        }
    },

    actions: {
        close_snackbar(context) {
            context.commit('set_snackbar', {
                show: false,
            });
        },
        async get_permissoes(context, payload) {
            let res = await api.get("/usuario/permissao/pagina", {
                params: {
                    id_usuario: payload.id_usuario,
                    pagina: payload.pagina,
                },
            });

            if (res.data === false) {
                context.commit('set_error', true);
            } else {
                context.commit('set_error', false);
                context.commit('set_permissoes', res.data);
            }
        }
    }
});