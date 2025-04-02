import { createApp } from 'vue'
import './style.css'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import pinia from './store' // Pinia 스토어 import

const app = createApp(App)
app.use(router)
app.use(pinia) // Pinia 등록 추가
app.mount('#app')