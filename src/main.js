import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import './styles/main.css';
import { colors } from './design-tokens';

const theme = {
  defaultTheme: 'light',
  themes: {
    light: {
      colors: {
        // Map Vuetify theme slots to semantic design tokens
        primary: colors.brand.primary,
        secondary: colors.text.secondary,
        surface: colors.surface.primary,
        background: colors.surface.background,
        error: colors.status.error.icon,
        info: colors.status.info.icon,
        success: colors.status.success.icon,
        warning: colors.status.warning.icon,
      },
    },
  },
};

createApp(App)
  .use(
    createVuetify({
      components,
      directives,
      icons: { defaultSet: 'mdi' },
      theme,
    }),
  )
  .mount('#app');
