import EmissaoNotasFiscais from './EmissaoNotasFiscais';
import CancelarNotaFiscal from './CancelarNotaFiscal';


export default [{
        path: '/faturamento/emissaoNotasFiscais',
        name: 'EmissÃ£o Notas Fiscais',
        component: EmissaoNotasFiscais,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/faturamento/cancelarNotaFiscal',
        name: 'Cancelar Nota Fiscal',
        component: CancelarNotaFiscal,
        meta: {
            requiresAuth: true
        }
    }



];