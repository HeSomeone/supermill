<template>
  <div id="detail">
    <detail-nav-bar
      class="detail-nav"
      @titleClick="titleClick"
      ref="detailNav"
    />
    <scroll class="content" ref="scroll" :probeType="3" @scroll="cotentScroll">
      <detail-swiper :topImages="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />

      <goods-list ref="recommend" :goods="recommendList" />
      <!-- <detail-recommend-info :recommend-list="recommendList" /> -->
    </scroll>
    <detail-bottom-bar @addToCart="addToCart" />

    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";
// import DetailRecommendInfo from "./childComps/DetailRecommendInfo";

import Scroll from "components/common/scroll/Scroll";

import GoodsList from "components/content/goods/GoodsList";

import { itemListenerMinin, backTopMixin } from "@/common/mixin";
import { debounce } from "@/common/utils";

import { mapActions } from "vuex";

import {
  getDetail,
  getRecommend,
  Goods,
  Shop,
  GoodsParam,
} from "network/detail";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    // DetailRecommendInfo,
    DetailBottomBar,

    Scroll,

    GoodsList,
  },
  mixins: [itemListenerMinin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommendList: [],
      themeTopYs: [],
      getThemeTopYs: null,
      currentIndex: 0,
    };
  },
  created() {
    this.iid = this.$route.params.iid;
    this.getDetail();
    this.getRecommend();

    this.getThemeTopYs = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop - 49);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 49);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 49);
      // console.log(this.themeTopYs);
    }, 500);
  },
  destroyed() {
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
  methods: {
    ...mapActions(["addCart"]),
    getDetail() {
      getDetail(this.iid).then((res) => {
        // console.log(res);
        // 获取结果
        const data = res.result;

        // 获取轮播图图片
        this.topImages = data.itemInfo.topImages;

        // 获取商品信息
        this.goods = new Goods(
          data.itemInfo,
          data.columns,
          data.shopInfo.services
        );

        // 获取店铺信息
        this.shop = new Shop(data.shopInfo);

        // 获取商品信息
        this.detailInfo = data.detailInfo;

        // 保存参数信息
        this.paramInfo = new GoodsParam(
          data.itemParams.info,
          data.itemParams.rule
        );

        // 保存评论信息
        if (data.rate.list) {
          this.commentInfo = data.rate.list[0];
        }

        // 正常情况下，数据加载完毕后，页面需要一定的时间去渲染，而不是直接显示到页面中
        // $nextTick()方法就是会等待页面渲染完毕后
        // 但是$nextTick无法监听图片的渲染
        // this.$nextTick(() => {
        //   this.themeTopYs.push(0);
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        //   console.log(this.themeTopYs);
        // });
      });
    },
    getRecommend() {
      getRecommend().then((res, error) => {
        if (error) return;
        this.recommendList = res.data.list;
      });
    },
    imageLoad() {
      this.refresh();

      this.getThemeTopYs();
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500);
    },
    cotentScroll(position) {
      // console.log(-position.y);

      for (let i = 0; i < this.themeTopYs.length; i++) {
        if (
          (this.themeTopYs.length - 1 != i &&
            -position.y >= this.themeTopYs[i] &&
            -position.y <
              this.themeTopYs[i === this.themeTopYs.length - 1 ? i : i + 1]) ||
          (this.themeTopYs.length - 1 === i &&
            -position.y >= this.themeTopYs[i])
        ) {
          this.$refs.detailNav.currentIndex = i;
        }
      }
      // 判断ack-top组件是否显示
      this.isShowBackTop = -position.y > 1000;
    },
    addToCart() {
      // 1.创建对象
      const obj = {};
      // 2.对象信息
      obj.iid = this.iid;
      obj.imgURL = this.topImages[0];
      obj.title = this.goods.title;
      obj.desc = this.goods.desc;
      obj.newPrice = this.goods.nowPrice;
      obj.checked = true;
      // 3.添加到Store中
      this.addCart(obj).then((res) => {
        this.$toast.show(res, 1500);
      });
      // this.$store.dispatch("addCart", obj).then(res => {
      //   console.log(res);
      // });
    },
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background: #fff;
  height: 100vh;
  overflow: hidden;
}

.content {
  height: calc(100% - 44px - 49px);
}

.detail-nav {
  position: relative;
  z-index: 9;
  background: #fff;
}
</style>