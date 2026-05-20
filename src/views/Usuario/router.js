import Usuario from './Usuario';
import UsuarioCadastrar from './UsuarioCadastrar';

export default [
    {
        path: '/usuarios',
        name: 'Usuarios',
        component: Usuario,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/usuario/cadastrar',
        name: 'Cadastrar Usuário',
        component: UsuarioCadastrar,
        meta: {
            requiresAuth: true
        }
    },
];