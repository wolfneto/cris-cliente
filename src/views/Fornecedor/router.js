import Cadastrar from './components/Cadastrar';

export default [{
    path: '/fornecedor/cadastrar',
    name: 'Cadastrar Fornecedor',
    component: Cadastrar,
    meta: {
        requiresAuth: true
    }
}, ];