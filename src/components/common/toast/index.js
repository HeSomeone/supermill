import Toast from "./Toast"

const obj = {};

obj.install = function(Vue){
  // 创建组件构造器
  let toastContrustor =  Vue.extend(Toast);

  // 用new的方式根据组件构造器，创建出一个组件对象
  const toast = new toastContrustor();

  // 将组件对象挂载在某一个元素中
  toast.$mount(document.createElement("div"))

  // 挂载之后就会生成$el对象，使用$el对象将节点获取到并加载到页面中
  document.body.appendChild(toast.$el);

  // 将toast放置到Vue原型中，供所有组件使用
  Vue.prototype.$toast = toast;

}

export default obj;