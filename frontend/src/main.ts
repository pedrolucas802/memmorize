import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import ConfirmPopup from 'primevue/confirmpopup';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import locale from '../src/assets/locale.json'
import router from './router';

const app = createApp(App);

app.use(PrimeVue, locale);
app.use(router);
app.use(ConfirmationService);
app.use(ToastService);

app.component('ConfirmPopup', ConfirmPopup);


app.mount('#app');
