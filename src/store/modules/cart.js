const cart = {
  namespaced: true,
  state: {
    cartCount: 0,
    cartList: [],
  },
  mutations: {
    addCartCount(state) {
      state.cartCount++;
    },
    addCart(state, payload) {
      state.cartCount++;

      if (state.cartList.length > 0) {
        let product = state.cartList.find((item) => item.id === payload.id);
        if (product) {
          product.count++;
        } else {
          state.cartList.push(payload);
        }
      } else {
        state.cartList.push(payload);
      }
    },
    reduceCartCount(state) {
      state.cartCount--;
    },
    reduceCart(state, payload) {
      state.cartCount--;

      if (state.cartList.length > 0) {
        let productIndex = state.cartList.findIndex(
          (item) => item.id === payload.id
        );
        console.log("productIndex", productIndex);
        if (productIndex !== null && productIndex !== undefined) {
          state.cartList.splice(productIndex, 1);
        }
      }
    },
  },
  actions: {},
};

export default cart;
