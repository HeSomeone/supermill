<template>
  <div class="tab-bar-item" @click="itemClick">
    <!-- slot插槽是会直接被传入的标签替换掉，所以在插槽外面最好加一层div用来放置属性参数之类的数据 -->

    <!-- 活跃的图片 -->
    <div v-if="isActive">
      <slot name="item-icon-active" />
    </div>
    <!-- 未点击的图片 -->
    <div v-else>
      <slot name="item-icon" />
    </div>
    <!-- 文字 -->
    <div :style="activeStyle">
      <slot name="item-text" />
    </div>

    <!-- <img src="../../assets/img/tabbar/home.png" alt="" />
      <div>首页</div> -->
  </div>
</template>

<script>
export default {
  props: {
    path: String,
    activeColor: {
      type: String,
      default: "#ff0000",
    },
  },
  data() {
    return {};
  },
  computed: {
    isActive() {
      // console.log(this.$route.path);
      return this.$route.path.indexOf(this.path) !== -1;
    },
    activeStyle() {
      return this.isActive ? { color: this.activeColor } : {};
    },
  },
  methods: {
    itemClick() {
      this.$router.replace(this.path);
    },
  },
};
</script>

<style scoped>
.tab-bar-item {
  flex: 1;
  text-align: center;
  height: 49px;
  font-size: 14px;
}

.tab-bar-item img {
  width: 24px;
  height: 24px;
  margin-top: 3px;
}
</style>