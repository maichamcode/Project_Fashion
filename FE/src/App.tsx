import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AdminLayOut from "./layout/AdminLayOut/AdminLayOut";
import DashBoard from "./component/admin/DashBoard/DashBoard";
import ClientLayOut from "./layout/ClientLayOut/ClientLayOut";
import ListProduct from "./component/admin/ListProduct/ListProduct";
import ListCategory from "./component/admin/ListCategory/ListCategory";
import ProductDetail from "./component/page/ProductDetaile";
import ShopProduct from "./component/page/ShopProduct";
import HomePage from "./component/page/HomePage/HomePage";
import AddProduct from "./component/admin/AddProduct/AddProduct";
import UpdateProduct from "./component/admin/UpdateProduct/UpdateProduct";
import AddCategory from "./component/admin/AddCategory/AddCategory";
import ListUser from "./component/admin/ListUser/ListUser";

import ProfileUser from "./component/page/Profile/Profile";
import Cart from "./component/cart/Cart";
import UpdateCategory from "./component/admin/UpdateCategory/UpdateCategory";
import LisOrDerUser from "./component/page/ListOrder/LisOrDer";

import OrderDetail from "./component/page/OrderDetail/OrderDetail";
import Login from "./component/auth/Login/Login";
import Checkout from "./component/checkout/Checkout";
import Register from "./component/auth/Register/Register";
import Bill from "./component/bill/bill";
import FavoriteProduct from "./component/page/FavoriteProduct/FavoriteProduct";
import Search from "./component/page/Search/Search";
import OrderSucces from "./component/page/OrderSucces/OrderSucces";
import ListOrder from "./component/admin/Order/ListOrder";
import ListRecyclebin from "./component/admin/Recyclebin/listRecyclebin";
import OrderPlaceDay from "./component/admin/DashBoard/OrderPlaceDay";
import OrderWatingDay from "./component/admin/DashBoard/OrderWatingDay";
import OrderDoneDay from "./component/admin/DashBoard/OrderDoneDay";
import CartNoTokenDetail from "./component/cart/CartNoTokenDetail";
import ListOrderOff from "./component/orderOff/ofderOff/ListOrderOff";
import OrderDetailInUser from "./component/page/ListOrder/OrderDetailInUser";
import OrderDetailAdmin from "./component/admin/Order/OrderDetailAdmin";
import UpdateProfile from "./component/page/UpdateProfile/UpdateProfile";
import ListOrderShip from "./component/shiper/ListOrderShip/ListOrderShip";
import ListOrderShipDone from "./component/shiper/ListOrderShipDone/ListORderShipDone";

import ListProductSale from "./component/admin/Sale/ListProductSale";

import ListOrderConfirm from "./component/shiper/ListOrderConfirm/ListOrderConfirm";
import ListOrderDelivered from "./component/shiper/ListOrderDelivered/ListOrderDelivered";
import ListReceivedOrder from "./component/shiper/ListOrderReceived/ListReceivedOrder";
import ListOrderComplete from "./component/shiper/ListOrderComplete/ListOrderComplete";
import ListOrderCancell from "./component/shiper/ListOrderCancell/ListOrderCancell";
import { CheckPassword } from "./utils/pause";

import ListVoucher from "./component/admin/ListVoucher/ListVoucher";
import AddVoucher from "./component/admin/AddVoucher/AddVoucher";
import UpdateVoucher from "./component/admin/UpdateVoucher/UpdateVoucher";
import ListProductOutStan from "./component/admin/Outstan/ListOutStan";
import ListComment from "./component/admin/ListComment/ListComment";
import ListBlog from "./component/admin/ListBlog/ListBlog";
import AddBlog from "./component/admin/AddBlog/AddBlog";
import UpdateBlog from "./component/admin/UpdateBlog/UpdateBlog";
import ProfileAdmin from "./component/page/Profile/ProfileAdmin";
import Blog from "./component/page/Blog/Blog";
import BlogDetail from "./component/page/Blog/BlogDetail";
import AddProductSale from "./component/admin/Sale/AddProductSale";
import ForgotPassword from "./component/auth/ForgotPassword/ForgotPassword";
import AllSaleProduct from "./component/page/product_in_Page/product_in_Page";
import AllOutstanProduct from "./component/page/product_in_Page/oustan_in_page";
import AllNewProduct3Days from "./component/page/product_in_Page/productnew_in_page";
import { useState } from "react";
import ProductCategory from "./component/page/product_in_Page/product_in_category";
import ListSize from "./component/admin/ListSize/ListSize";
import AddSize from "./component/admin/AddSize/AddSize";
import ListColor from "./component/admin/ListColor/ListColor";
import AddColor from "./component/admin/AddColor/AddColor";
import Map from "./component/page/Map/Map";
import OrderNow from "./component/page/BuyNow/OrderNow";
import SearchOrder from "./component/page/OrderDetail/SearchOrder";
import ListFlashSale from "./component/admin/FlashSale/ListFlashSale";
import ChangePassword from "./component/page/Profile/ChangePassword";
import ListBill from "./component/admin/ListBill/ListBill";
import UpdateBill from "./component/admin/UpdateBill/UpdateBill";
import UpdateProfileAdmin from "./component/page/UpdateProfile/UpdateProfileAdmin";
import ChangerPasswordAdmin from "./component/page/Profile/ChangerPasswordAdmin";
import ListOrderBomd from "./component/shiper/ListOrderBomd/ListOrderBomd";
import ListOrderShipAdmin from "./component/admin/Order/ListOrderShip/ListOrderShip";
import ListOrderDoneAdmin from "./component/admin/Order/ListOrderDone/ListOrderDoneAdmin";
import ListOrderBomdAdmin from "./component/admin/Order/ListOrderBomd/ListOrderBomdAdmin";
import Detail from "./component/shiper/OrderShipDetail/Detail";
import ListOrderShiping from "./component/admin/Order/ListOrderShiping/ListOrderShiping";

function App() {
  const [check, setcheck] = useState<any>();
  const login = (data: any) => {
    setcheck(data);
  };
 const users = JSON.parse(localStorage.getItem("user")!)
 const requiredRegister = () => {
  if (users) {
    return  <Navigate to="/" />;
  } 
};
  const user = JSON.parse(localStorage.getItem("user")!);
  const requiredAdmin = () => {
    if (check == 0) {
      return <AdminLayOut />;
    } else {
      return <Navigate to="/" />;
    }
  };
  const [searchs, setsearch] = useState<any>();
  const search = (data: any) => {
    setsearch(data);
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/orderoff" element={<ListOrderOff />} />
          <Route path="/register" element={ !users?<Register />:  requiredRegister()}/>
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path=":id/bill" element={<Bill />} />
          <Route
            path="admin"
            element={user?.user?.role != 0 ? requiredAdmin() : <AdminLayOut />}
          >
            <Route index element={<Navigate to="dashboard" replace={true} />} />
            <Route path="actions" element={<CheckPassword />} />
            <Route path="profile">
              <Route index element={<ProfileAdmin />} />
              <Route path=":id/edit" element={<UpdateProfileAdmin />} />
              <Route path="changePassword" element={<ChangerPasswordAdmin />} />
            </Route>
            <Route path="dashboard">
              <Route index element={<DashBoard />} />
              <Route path="placeOrder" element={<OrderPlaceDay />} />
              <Route path="watingorder" element={<OrderWatingDay />} />
              <Route path="doneorder" element={<OrderDoneDay />} />
            </Route>
            <Route path="product">
              <Route index element={<ListProduct />} />
              <Route path="add" element={<AddProduct />} />
              <Route path=":id/update" element={<UpdateProduct />} />
              <Route path="recyclebin" element={<ListRecyclebin />} />
            </Route>
            <Route path="sale">
              <Route index element={<ListProductSale />} />
              <Route path="add" element={<AddProductSale />} />\
              
            </Route>
            <Route path="flashsale" element={<ListFlashSale />} />
            <Route path="outstan">
              <Route index element={<ListProductOutStan />} />
            </Route>
            <Route path="order">
              <Route index element={<ListOrder />} />
              <Route path=":id/detail" element={<OrderDetailAdmin />} />
              <Route path="awaitshipper" element={<ListOrderShipAdmin />} />
              <Route path="received" element={<ListOrderDoneAdmin />} />
              <Route path="confirm" element={<ListOrderConfirm />} />
              <Route path="complete" element={<ListOrderComplete />} />
              <Route path="cancell" element={<ListOrderCancell />} />
              <Route path="bomd" element={<ListOrderBomdAdmin />} />
              <Route path="shippings" element={<ListOrderShiping/>} />
            </Route>
            <Route path="category">
              <Route index element={<ListCategory />} />
              <Route path="add" element={<AddCategory />} />
              <Route path=":id/update" element={<UpdateCategory />} />
            </Route>
            <Route path="user">
              <Route index element={<ListUser />} />
            </Route>
            <Route path="voucher">
              <Route index element={<ListVoucher />} />
              <Route path="add" element={<AddVoucher />} />
              <Route path=":id/update" element={<UpdateVoucher />} />
            </Route>
            <Route path="comment">
              <Route index element={<ListComment />} />
            </Route>
            <Route path="blog">
              <Route index element={<ListBlog />} />
              <Route path="add" element={<AddBlog />} />
              <Route path=":id/update" element={<UpdateBlog />} />
            </Route>
            <Route path="size">
              <Route index element={<ListSize />} />
              <Route path="add" element={<AddSize />} />
            </Route>
            <Route path="color">
              <Route index element={<ListColor />} />
              <Route path="add" element={<AddColor />} />
            </Route>
            <Route path="bill">
              <Route index element={<ListBill />} />
              <Route path=":id/update" element={<UpdateBill />} />
            </Route>
          </Route>
          <Route path="/shiper" >
            <Route path="awaitshipper" element={<ListOrderShip />} />
            <Route path=":id/detail" element={<Detail />} />
            <Route path="shipping" element={<ListOrderShipDone />} />
            <Route path="shipsuccess" element={<ListOrderDelivered />} />
            <Route path="received" element={<ListReceivedOrder />} />
            <Route path="bomd" element={<ListOrderBomd />} />
          </Route>
          <Route path="/" element={<ClientLayOut onSearchs={search} />}>
            <Route index element={<HomePage />} />
            <Route path="ordernow" element={<OrderNow />} />
            <Route path="lienhe" element={<Map />} />
            <Route path="search" element={<Search data={searchs} />} />
            <Route path="allsale" element={<AllSaleProduct />} />
            <Route path="alloutstan" element={<AllOutstanProduct />} />
            <Route path="allnewproduct3days" element={<AllNewProduct3Days />} />
            <Route path="category/:id" element={<ProductCategory />} />
            <Route path="shopProduct">
              <Route index element={<ShopProduct />} />
              <Route path=":id" element={<ProductDetail />} />
            </Route>
            <Route path="blog">
              <Route index element={<Blog />} />
              <Route path=":id" element={<BlogDetail />} />
              {/* <Route path=":id/detail" element={<BlogDetail />} /> */}
            </Route>
            <Route path="cart" element={<Cart />} />
            <Route path="cartnotokendetail" element={<CartNoTokenDetail />} />
            <Route path="favoriteProduct" element={<FavoriteProduct />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order">
              <Route index element={<LisOrDerUser />} />
              <Route path=":id/orderdetail" element={<OrderDetailInUser />} />
              <Route path=":id/searchorder" element={<SearchOrder />} />
            </Route>

            <Route path="orderdetail/:id" element={<OrderDetail />} />
            <Route path="order/success/:id" element={<OrderSucces />} />
            <Route path="checkout/vnpay" element={<Checkout />} />
            <Route path="orderdetail/:id/bill" element={<Bill />} />
            <Route path="profile">
              <Route index element={<ProfileUser />} />
              <Route path=":id/edit" element={<UpdateProfile />} />
              <Route path="changePassword" element={<ChangePassword />} />
            </Route>
          </Route>
          <Route path="login"  element={!users ? <Login onLogin={login} /> : requiredRegister()}  />
        </Routes>
      </Router>

    </>
  );
}
export default App;
