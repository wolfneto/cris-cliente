import MargemLucro from './MargemLucro';
import CadastroImagem from './CadastroImagem.vue';
import ItemControlarSaldo from './ItemControlarSaldo';
import Item from './Item';


export default [{
        path: '/item/margemlucro',
        name: 'Margem de Lucro',
        component: MargemLucro,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/item/cadastro',
        name: 'Cadastro de Imagem',
        component: CadastroImagem,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/item',
        name: 'Item',
        component: Item,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/item_controlar_saldo/:codigo',
        name: 'Item Controlar Saldo',
        component: ItemControlarSaldo,
        props: true,
        meta: {
            requiresAuth: true
        }
    }
];