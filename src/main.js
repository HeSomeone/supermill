import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import toast from "./components/common/toast"
import FastClick from "fastclick"
import VueLazyload from "vue-lazyload"

// 安装滴定仪Toast插件
Vue.use(toast);
// 安装Vue图片懒加载插件
Vue.use(VueLazyload,{
  loading: require("./assets/img/common/placeholder.png")
});

Vue.config.productionTip = false
// 创建事件总线对象
Vue.prototype.$bus = new Vue()
// 解决移动端点击时300ms延迟
FastClick.attach(document.body);


new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
