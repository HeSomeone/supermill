<template>
  <div id="shopcart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{ length }})</div>
    </nav-bar>
    <cart-list />
    <cart-bottom-bar />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

import CartList from "./childComps/CartList";
import CartBottomBar from "./childComps/CartBottomBar"

//  Vuex自带的getters辅助函数，可以让getters里面的函数当作计算属性在组件中调用，而不是使用$store.getters.方法名
import { mapGetters } from "vuex";

export default {
  components: {
    NavBar,
    CartList,
    CartBottomBar,
  },
  computed: {
    // 数组使用方法
    // ...mapGetters(["cartLength"])
    // 对象使用方法，可以更改别名
    ...mapGetters({
      length: "cartLength",
    }),
  },
};
</script>

<style scoped>
#shopcart {
  height: 100vh;
}
.nav-bar {
  background: var(--color-tint);
  color: #fff;
  position: relative;
  z-index: 9;
}
</style>