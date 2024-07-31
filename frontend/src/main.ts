import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App);
app.use(router)
    .use(ElementPlus)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')


app.config.errorHandler = function (err, vm, info) {
    console.error('Global error handler:', err, vm, info);
    // 处理错误，例如发送错误报告或显示全局错误消息
};