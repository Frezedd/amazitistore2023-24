import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  userInfo: {
    orders: [],
  },
};

export const calculateTotal = (products) => {
  return products.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

export const amazonSlice = createSlice({
  name: "amazon",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.products.push(action.payload);
      }
    },
    inCrementQuantity: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload);
      item.quantity++;
    },
    deCrementQuantity: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload);
      if (item.quantity === 1) {
        item.quantity = 1;
      } else {
        item.quantity--;
      }
    },
    deleteItem: (state, action) => {
      state.products = state.products.filter(
        (item) => item.id !== action.payload
      );
    },
    resetCart: (state) => {
      state.products = [];
    },
    setUserInfo: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        ...action.payload,
      };
    },
    userSignOut: (state) => {
      state.userInfo = null;
    },
    resetOrders: (state) => {
      state.userInfo.orders = [];
    },

    addOrder: (state, action) => {
      // Action to place an order
      const order = {
        id: (state.userInfo.orders || []).length + 1,
        total: calculateTotal(state.products),
        created: Date.now() / 1000,
        items: state.products.map((product) => ({ ...product })),
      };

      // Update orders in userInfo
      state.userInfo.orders = [...(state.userInfo.orders || []), order];

      // Reset products array
      state.products = [];
      // Make sure to return the state
      return state;
    },
  },
});

export const {
  addToCart,
  deleteItem,
  resetCart,
  inCrementQuantity,
  deCrementQuantity,
  setUserInfo,
  userSignOut,
  addOrder,
  resetOrders,
  setOrders,
} = amazonSlice.actions;

export default amazonSlice.reducer;
