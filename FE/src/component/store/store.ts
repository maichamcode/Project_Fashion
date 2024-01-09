import authApi from "../../api/auth"
import apiProduct ,{ productReducer } from "../../api/product"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
const rootReducer = combineReducers({
    [apiProduct.reducerPath]: productReducer,
    [authApi.reducerPath]: authApi.reducer

})
const middleware = [apiProduct.middleware, apiProduct.middleware]
export const store = configureStore({
    reducer: rootReducer,

    middleware: (getDefaultMiddleware: any) =>
        getDefaultMiddleware({}).concat(...middleware)
})