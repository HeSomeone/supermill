import { ADD_COUNT, ADD_TO_CART } from "./mutations-types"

export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      let oldPrice = context.state.cartList.find(item => item.iid === payload.iid);
      // console.log(oldPrice);
      if (oldPrice) {
        context.commit(ADD_COUNT, oldPrice)
        resolve("商品数量加1");
      } else {
        context.commit(ADD_TO_CART, payload)
        resolve("添加一个新商品");
      }
    })
  }
}