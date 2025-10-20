import Vue from 'vue'
import App from './App.vue'
import { router } from './router'

import './plugins/axios'
import './plugins/xlsx'
import './plugins/print'
import './plugins/crypto'
import './plugins/moment'
import './plugins/utils'

import vuetify from './plugins/vuetify';

import VueTheMask from 'vue-the-mask';
import money from 'v-money'
import { VueContext } from 'vue-context'
import BootstrapVue from 'bootstrap-vue'
import VueScrollTo from 'vue-scrollto'
import './plugins/money';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './quasar';
import VCurrencyField from 'v-currency-field'
import { VTextField } from 'vuetify/lib' //Globally import VTextField
import Vuelidate from 'vuelidate'

import store from '@/store/index';


Vue.use(VueTheMask);
Vue.use(money);
Vue.use(VueScrollTo);
Vue.use(BootstrapVue);

Vue.component('v-text-field', VTextField)
Vue.use(VCurrencyField)
Vue.use(Vuelidate)


Vue.prototype.$money = {
    decimal: ',',
    thousands: '.',
    prefix: 'R$ ',
    precision: 2,
    masked: false,
    allowBlank: false,
    min: Number.MIN_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER
}
Vue.prototype.$rota = router;
Vue.prototype.$usuario = { value: false };
Vue.prototype.$showMenu = { value: true };
Vue.config.productionTip = false

Vue.component('login', require('./views/Login.vue').default)
Vue.component('menuBar', require('./components/MenuBar.vue').default)
Vue.component('appBar', require('./components/AppBar.vue').default)
Vue.component('vue-context', VueContext)

new Vue({
    store,
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')