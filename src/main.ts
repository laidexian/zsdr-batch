import { createApp } from 'vue'
import App from './App.vue'



createAppDiv()

createApp(App).mount('#zsbatch')
function createAppDiv(){
    let app = document.createElement('div')
    app.id='zsbatch'
    let ul = document.querySelector('#portal > section > div > section > aside > div > ul')
    ul?.appendChild(app)
}
