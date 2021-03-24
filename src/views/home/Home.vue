<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control
      :titles="['流行', '新款', '精选']"
      class="tab-control"
      @tabClick="tabClick"
      ref="tabControl1"
      v-show="isTabFixed"
    />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      />
      <goods-list :goods="goods[currentType].list" />
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
// 公共组件
import NavBar from "components/common/navbar/NavBar";
import Scroll from "components/common/scroll/Scroll";

// 公共业务组件
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";


// 模块业务组件
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

// 网络请求封装组件
import { getHomeMultidata, getHomeGoods } from "network/home";

// 公共工具组件
import { itemListenerMinin, backTopMixin } from "@/common/mixin";

export default {
  components: {
    NavBar,
    Scroll,
    TabControl,
    HomeSwiper,
    RecommendView,
    FeatureView,
    GoodsList,
  },
  mixins: [itemListenerMinin, backTopMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      tabOfsetTop: 0,
      isTabFixed: false,
      saveY: 0,
    };
  },
  created() {
    this.getHomeMultidata();

    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mounted() {
    console.log("HomeMounted");
  },
  activated() {
    console.log(this.saveY);
    this.$refs.scroll.scrollTo(0, this.saveY, 10);
    this.$refs.scroll.refresh();
  },
  deactivated() {
    this.saveY = this.$refs.scroll.getScrollY();
    // console.log(this.saveY);

    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
  methods: {
    /**
     * 事件监听方法
     */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    
    contentScroll(position) {
      // console.log(-position);
      // 判断ack-top组件是否显示
      this.isShowBackTop = -position.y > 1000;
      // 判断tab-control组件是否吸顶
      this.isTabFixed = -position.y > this.tabOfsetTop;
    },
    loadMore() {
      // console.log("滚动到底部！");
      this.getHomeGoods(this.currentType);
    },
    swiperImageLoad() {
      this.tabOfsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    /**
     * 网络请求的方法
     */
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        // console.log(res);
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      let page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        this.$refs.scroll.finishPullUp();
      });
    },
  },
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /* 使用better-scroll局部滚动，头部就无需浮动了 */
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}

/* 使用better-scroll滚动，浏览器自带的吸顶样式失效 */
/* .tab-control {
  position: sticky;
  top: 44px;
  z-index: 9;
} */

.content {
  /* height: 300px; */
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  right: 0;
  left: 0;
}

/* fixed和better-scroll的核心transform: translate冲突了，这种吸顶方案行不通 */
/* .tab-control{
  position: fixed;
  top: 44px;
  right: 0;
  left: 0;
} */

.tab-control {
  position: relative;
  z-index: 9;
}
</style>