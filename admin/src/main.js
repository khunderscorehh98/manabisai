import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.use(Vuetify);

const vuetify = new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#39FF14',
        secondary: '#1a1a1a',
        accent: '#39FF14',
        error: '#FF5252',
        warning: '#FFB300',
        info: '#40C4FF',
        success: '#39FF14',
        background: '#0A0A0A',
        surface: '#141414',
      },
    },
  },
});

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
