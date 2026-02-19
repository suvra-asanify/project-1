import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import './styles/main.css';

createApp(App)
  .use(createVuetify({ components, directives, icons: { defaultSet: 'mdi' } }))
  .mount('#app');
