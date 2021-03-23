<template>
  <div id="detaill">
    <detail-nav-bar class="detail-nav" />
    <scroll class="content" ref="scroll">
      <detail-swiper :topImages="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info :param-info="paramInfo" />
      <detail-comment-info :comment-info="commentInfo" />

      <goods-list :goods="recommendList"/>
      <!-- <detail-recommend-info :recommend-list="recommendList" /> -->
    </scroll>
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
// import DetailRecommendInfo from "./childComps/DetailRecommendInfo";

import Scroll from "components/common/scroll/Scroll";

import GoodsList from "components/content/goods/GoodsList"

import {itemListenerMinin} from "@/common/mixin"

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

    Scroll,

    GoodsList
  },
  mixins: [itemListenerMinin],
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
    };
  },
  created() {
    this.iid = this.$route.params.iid;
    this.getDetail();
    this.getRecommend();
  },
  destroyed () {
    this.$bus.$off("itemImageLoad",this.itemImgListener)
  },
  methods: {
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
    },
  },
};
</script>

<style scoped>
#detaill {
  position: relative;
  z-index: 9;
  background: #fff;
  height: 100vh;
  overflow: hidden;
}

.content {
  height: calc(100% - 44px);
}

.detail-nav {
  position: relative;
  z-index: 9;
  background: #fff;
}
</style>