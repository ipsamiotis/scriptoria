import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-orange/theme.css'       //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'
// import Slider from 'primevue/slider';

const app = createApp(App)

app.use(router)
app.use(PrimeVue)

// Only start the app after VerovioHelper is initialized

app.mount('#app')
// VerovioHelper.init().then(() => {
//     app.mount('#app')
// });

// app.component('Slider', Slider)

