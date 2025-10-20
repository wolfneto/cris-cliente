import Vue from 'vue'
import Router from 'vue-router'
import Painel from '@/views/Painel.vue';
import api from '@/api/api.js'
import jwrDecode from "jwt-decode";

import clienteRouter from '@/views/Cliente/router';
import financeiroRouter from '@/views/Financeiro/router';
import usuarioRouter from '@/views/Usuario/router';
import relatorioRouter from '@/views/Relatorios/router';
import academicoRouter from '@/views/Academico/router';
import licitacaoRouter from '@/views/Licitacao/router';
import sasiRouter from '@/views/Sasi/router';
import fidelidadeRouter from '@/views/Fidelidade/router';
import itemRouter from '@/views/Item/router';
import atendimentoRouter from '@/views/Atendimento/router';
import estoqueRouter from '@/views/Estoque/router';
import faturamentoRouter from '@/views/Faturamento/router';
import ecommerceRouter from '@/views/Ecommerce/router';
import fornecedorRouter from '@/views/Fornecedor/router';
import varejoRouter from '@/views/Varejo/router';

Vue.use(Router)

async function isAuthenticated() {
    if (localStorage.getItem('usuario') == null) {
        return false
    }

    let usuario = jwrDecode(localStorage.getItem('usuario'));

    let teste = await api.get('/usuario/checkLogin', {
        params: {
            id_usuario: usuario.id
        }
    });
    if (teste.status == 200) {
        return teste.data;
    } else {
        alert('SERVIDOR FORA DO AR');
        return false;
    }
}

const baseRoutes = [{
        path: '/',
        name: 'Login',
    },
    {
        path: '/painel',
        name: 'Painel',
        component: Painel
    },
];

const routes = baseRoutes.concat(atendimentoRouter, itemRouter, clienteRouter, financeiroRouter, usuarioRouter, relatorioRouter, academicoRouter, licitacaoRouter, sasiRouter, fidelidadeRouter, estoqueRouter, faturamentoRouter, ecommerceRouter, fornecedorRouter, varejoRouter);

export const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});


router.beforeEach(async(to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        let logado = await isAuthenticated();
        if (logado) {
            next({ params: { nextUrl: to.fullPath } })
            return
        }
        console.log('oporra');
        localStorage.setItem("login", false);
        router.push('/')
        router.go();
    }
    next();
})