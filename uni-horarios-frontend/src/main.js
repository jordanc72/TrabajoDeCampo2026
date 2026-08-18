
import { createApp } from 'vue'
import './style.css'
import router from './router' //configuración del router
import App from './components/App.vue' 

const app = createApp(App)
app.use(router) //Le decimos a Vue que use el router
app.mount('#app')