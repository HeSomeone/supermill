import { debounce } from "./utils"
import BackTop from "components/content/backTop/BackTop";
export const itemListenerMinin = {
  data() {
    return {
      itemImgListener: null,
      refresh: null,
    }
  },
  mounted() {
    this.refresh = debounce(this.$refs.scroll.refresh, 50);
    this.itemImgListener = () => {
      this.refresh();
    };
    this.$bus.$on("itemImageLoad", this.itemImgListener);
    // console.log("itemListenerMinin");
  }
}

export const backTopMixin = {
  components: {
    BackTop,
  },
  data(){
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },
  }
}