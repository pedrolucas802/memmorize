import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';

// Import PrimeVue and PrimeFlex CSS
import 'primevue/resources/themes/saga-blue/theme.css';  // or any other theme
import 'primevue/resources/primevue.min.css';            // Core CSS
import 'primeicons/primeicons.css';                      // PrimeIcons
import 'primeflex/primeflex.css';                        // PrimeFlex for layout

const app = createApp(App);

app.use(PrimeVue);

app.mount('#app');