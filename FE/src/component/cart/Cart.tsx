import "../../layout/ClientLayOut/css/all.css";
import "../../layout/ClientLayOut/css/animate.css";
import "../../layout/ClientLayOut/css/bootstrap.min.css";
import "../../layout/ClientLayOut/css/owl.carousel.min.css";
import "../../layout/ClientLayOut/css/nice-select.css";
import "../../layout/ClientLayOut/css/flaticon.css";
import "../../layout/ClientLayOut/css/themify-icons.css";
import "../../layout/ClientLayOut/css/magnific-popup.css";
import "../../layout/ClientLayOut/css/slick.css";
import "../../layout/ClientLayOut/css/price_rangs.css";
import "../../layout/ClientLayOut/css/style.css";
import { useGetAllCartQuery, useGetCartQuery } from "../../api/cart";
import CartDetail from "./CartDetail";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import useScrollToTopOnMount from "../../utils/useScrollToTopOnMount";
import CartNoTokenDetail from "./CartNoTokenDetail";
import CurrencyFormatter from "../../utils/FormatTotal";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

const Cart = () => {
  const user = JSON.parse(localStorage.getItem("user")!);
  const userid = user?.user?.id;
  const { data: cart } = useGetCartQuery(userid);
  const { data: dataCart } = useGetAllCartQuery("");

  const [totalSum, setTotalSum] = useState(0);
  const [check, setcheck] = useState(false);
  let totals = 0;
  const HandleTotal = (total: any) => {
    if (!isNaN(total) && total != 0) {
      totals += total;
      setTotalSum(totals);
    }
  };

  useEffect(() => {
    if (!cart?.data || cart?.data?.length == 0) {
      setcheck(true);
    } else if (cart?.data?.length > 0) {
      setcheck(false);
    }
  }, [cart]);
  useScrollToTopOnMount(cart?.data);

  const HandleCheck = (checks: any) => {
    if (checks == true) {
      setcheck(checks);
    } else {
      setcheck(checks);
    }
  };
  // Nếu người dùng chưa đăng nhập, chuyển hướng sang CartNoTokenDetail
  const cartData = JSON.parse(localStorage.getItem("cartItems") || "[]");
  // Kiểm tra xem giỏ hàng có sản phẩm hay không
  const hasItemsInCart = cartData.length > 0;
  if (!user) {
    return (
      <>
        <div id="top"></div>
        <section
          className="breadcrumb breadcrumb_bg"
          style={{ marginTop: "70px", backgroundColor: "#eeee" }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="breadcrumb_iner">
                  <div className="breadcrumb_iner_item">
                    <h2>Giỏ Hàng</h2>
                    <p>
                      Trang chủ <span>-</span> Giỏ Hàng
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="cart_area padding_top">
          <div className="container">
            <div className="cart_inner">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col" style={{ width: '35%' }}>Sản phẩm</th>
                      <th scope="col" style={{ width: '20%' }}>Giá</th>
                      <th scope="col" style={{ width: '20%' }}>Số lượng</th>
                      <th scope="col" style={{ width: '20%' }}>Tổng tiền</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {cartData?.map((item: any) => (
                      <CartNoTokenDetail
                        data={item}
                        onTotal={HandleTotal}
                        quantity={item?.quantity}
                      />
                    ))}
                    <tr>
                      <td></td>
                      <td></td>
                      <td>
                        <h5>Tổng Tiền</h5>
                      </td>
                      <td>
                        <h3>
                          {" "}
                          <CurrencyFormatter amount={totalSum} />
                        </h3>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="checkout_btn_inner float-right">
                  <a
                    className="btn_1"
                    href="/shopProduct"
                    style={{
                      backgroundColor: "#eeee",
                      color: "black",
                      textDecoration: "none",
                    }}
                  >
                    <ArrowLeftOutlined style={{ marginRight: 15 }} />
                    Tiếp tục mua sắm
                  </a>
                  <Button
                    className="btn_1 checkout_btn_1"
                    style={{
                      height: "41px",
                      backgroundColor: "black",
                      color: "white",
                      border: "none",
                      marginLeft: 5,
                    }}
                    disabled={!hasItemsInCart}
                  >
                    <a href={"/checkout"} style={{ textDecoration: "none" }}>
                      Tiến hành thanh toán{" "}
                      <ArrowRightOutlined style={{ marginLeft: 10 }} />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
  return (
    <>
      <div id="top"></div>
      <section
        className="breadcrumb breadcrumb_bg"
        style={{ marginTop: "70px", backgroundColor: "#eeee" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="breadcrumb_iner">
                <div className="breadcrumb_iner_item">
                  <h2>Giỏ Hàng</h2>
                  <p>
                    Trang chủ <span>-</span> Giỏ Hàng
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="cart_area padding_top">
        <div className="container">
          <div className="cart_inner">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" style={{width:'35%'}}>Sản phẩm</th>
                    <th scope="col" style={{ width: '20%' }}>Giá</th>
                    <th scope="col" style={{ width: '20%' }}>Số lượng</th>
                    <th scope="col" style={{ width: '20%' }}>Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {cart?.data?.map((data: any) => (
                    <CartDetail
                      data={data}
                      onTotal={HandleTotal}
                      onCheck={HandleCheck}
                      quantity={data?.quantity}
                    />
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td>
                      <h5>Tổng tiền</h5>
                    </td>
                    <td>
                      <h3>
                        <CurrencyFormatter amount={totalSum} />
                      </h3>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="checkout_btn_inner float-right">
                <a
                  className="btn_1"
                  href="/shopProduct"
                  style={{
                    backgroundColor: "#eeee",
                    color: "black",
                    textDecoration: "none",
                  }}
                >
                  <ArrowLeftOutlined style={{ marginRight: 15 }} />
                  Tiếp tục mua sắm
                </a>
                <Button
                  className="btn_1 checkout_btn_1"
                  disabled={check}
                  style={{
                    height: "41px",
                    backgroundColor: "black",
                    color: "white",
                    border: "none",
                    marginLeft: 5,
                  }}
                >
                  <a style={{ textDecoration: "none" }} href={"/checkout"}>
                    Tiến hành thanh toán{" "}
                    <ArrowRightOutlined style={{ marginLeft: 10 }} />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
