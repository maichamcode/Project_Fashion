import authApi from "../api/auth";
import apiProduct from "../api/product";
import apiCategory from "../api/category";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import sizeApi from "../api/size";
import colorApi from "../api/color";
import cartApi from "../api/cart";
import saleApi from "../api/sale";
import countryApi from "../api/countruy";
import checkoutApi from "../api/checkout";
import orderApi from "../api/order";
import vnpayApi from "../api/vnpay";
import apiDashboard from "../api/dashboard";
import billApi from "../api/bill";
import apiRecyclebin from "../api/recyclebin";
import apiActions from "../api/actions";
import apiFavoriteProduct, { FavoriteProductReducer } from "../api/favorite_product";
import commentApi from "../api/comment";
import voucherApi from "../api/voucher";
import blogApi from "../api/blog";

const rootReducer = combineReducers({
  [apiProduct.reducerPath]: apiProduct.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [apiCategory.reducerPath]: apiCategory.reducer,
  [sizeApi.reducerPath]: sizeApi.reducer,
  [colorApi.reducerPath]: colorApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [saleApi.reducerPath]: saleApi.reducer,
  [countryApi.reducerPath]: countryApi.reducer,
  [checkoutApi.reducerPath]: checkoutApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [vnpayApi.reducerPath]: vnpayApi.reducer,
  [apiDashboard.reducerPath]: apiDashboard.reducer,
  [billApi.reducerPath]: billApi.reducer,
  [apiRecyclebin.reducerPath]: apiRecyclebin.reducer,
  [apiActions.reducerPath]: apiActions.reducer,
  [apiFavoriteProduct.reducerPath]: FavoriteProductReducer,
  [commentApi.reducerPath]: commentApi.reducer,
  [voucherApi.reducerPath]:voucherApi.reducer,
  [blogApi.reducerPath]:blogApi.reducer,

});
const middleware = [
  apiProduct.middleware,
  authApi.middleware,
  apiCategory.middleware,
  sizeApi.middleware,
  colorApi.middleware,
  cartApi.middleware,
  saleApi.middleware,
  countryApi.middleware,
  checkoutApi.middleware,
  orderApi.middleware,
  vnpayApi.middleware,
  apiDashboard.middleware,
  billApi.middleware,
  apiRecyclebin.middleware,
  apiActions.middleware,
  apiFavoriteProduct.middleware,
  commentApi.middleware,
  voucherApi.middleware,
  blogApi.middleware,
];

// const middleware = [apiProduct.middleware, authApi.middleware, apiCategory.middleware, sizeApi.middleware, colorApi.middleware, cartApi.middleware, saleApi.middleware, countryApi.middleware, checkoutApi.middleware, orderApi.middleware,]
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({}).concat(...middleware),
});
