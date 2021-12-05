import BootstrapVue from 'bootstrap-vue'
import '@/../bootstrap/css/bootstrap.css'
import Vue from 'vue';
import store from './store';
import vuetify from './plugins/vuetify';
import App from './App.vue';
import './styles/styles.scss';

Vue.use(BootstrapVue)
Vue.config.productionTip = false;

new Vue({
    vuetify,
    store,
    render: h => h(App)
}).$mount('#app');
