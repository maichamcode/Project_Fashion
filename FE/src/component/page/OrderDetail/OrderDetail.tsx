import { Link, useParams } from "react-router-dom";
import {
  useGetOneOrderQuery,
  useSendEmailStatusOrderMutation,
  useUpdateCancellMutation,
  useUpdateOrderDoneMutation,
} from "../../../api/order";
import { useEffect, useState } from "react";
import { useGetOneChekoutQuery } from "../../../api/checkout";
import ProductInOrder from "./ProductInOrder";
import { Button, Steps, message } from "antd";
import io from "socket.io-client";
import ProductInOrderNoToken from "./ProductInOrderNoToken";
import CurrencyFormatter from "../../../utils/FormatTotal";
import { pause } from "../../../utils/pause";
import { useSumKhoMutation } from "../../../api/product";
const socket = io("http://localhost:8080");
const OrderDetail = () => {
  // const discountAmount = localStorage.getItem("discountAmount");
  const [messageApi, TextHorder] = message.useMessage();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user")!);
  const token: any = user?.accessToken;
  const { data: order, refetch } = useGetOneOrderQuery(id);
  const [sendEmail] = useSendEmailStatusOrderMutation();
  useEffect(() => {
    socket.on("confirm", (data: any) => {
      messageApi.open({
        type: "success",
        content: data.message,
      });
      refetch();
    });
    return () => {
      socket.disconnect();
    };
  }, [refetch]);
  useEffect(() => {
    socket.on("shiping", (data: any) => {
      messageApi.open({
        type: "success",
        content: data.message,
      });
      refetch();
    });
    return () => {
      socket.disconnect();
    };
  }, [refetch]);
  useEffect(() => {
    socket.on("statusdone", (data: any) => {
      messageApi.open({
        type: "success",
        content: data.message,
      });
      refetch();
    });
    return () => {
      socket.disconnect();
    };
  }, [refetch]);
  useEffect(() => {
    socket.on("complete", (data: any) => {
      messageApi.open({
        type: "success",
        content: 'Đơn hàng hoàn thành',
      });
      refetch();
    });
    return () => {
      socket.disconnect();
    };
  }, [refetch]);
  const ngay = order?.data[0]?.order_date?.substring(1, 11);
  const gio = order?.data[0]?.order_date?.substring(12, 20);
  const [payment, setpayment] = useState<any>();
  const { data: checkout } = useGetOneChekoutQuery(order?.data[0]?.checkout_id);

  useEffect(() => {
    if (order?.data[0]?.payment_status == 2) {
      setpayment("VNPAY");
    } else if (order?.data[0]?.payment_status == 1) {
      setpayment("COD");
    }
  }, [order]);
  const [check, setcheck] = useState(0);
  const [huy, sethuy] = useState<any>(false);
  const [nhan, setnhan] = useState<any>(false);
  const [dulieu, setdulieu] = useState<any>();
  const [color, setcolor] = useState<any>("process");
  const [status, setstatus] = useState<any>();
  const [checkbill, setcheckbill] = useState(false);

  let icons: any;
  useEffect(() => {
    if (order?.data[0]?.status == "1") {
      icons = [
        {
          title: "Đã Đặt Hàng",
        },
        {
          title: "Đã Xác Nhận",
        },
        {
          title: "Đang Giao Hàng",
        },
        {
          title: "Giao Hàng Thành Công",
        },
        {
          title: "Đã Nhận Hàng",
        },
        {
          title: "Hoàn Thành",
        },
      ];
      setdulieu(icons);
      setcheckbill(true);
      setcheck(0);
      sethuy(false);
      setnhan(true);
    } else if (order?.data[0]?.status == "2") {
      icons = [
        {
          title: "Đã Đặt Hàng",
        },
        {
          title: "Đã Xác Nhận",
        },
        {
          title: "Đang Giao Hàng",
        },
        {
          title: "Giao Hàng Thành Công",
        },
        {
          title: "Đã Nhận Hàng",
        },
        {
          title: "Hoàn Thành",
        },
      ];
      setdulieu(icons);
      setcheckbill(false);
      setcheck(1);
      sethuy(true);
      setnhan(true);
    } else if (order?.data[0]?.status == "3") {
      icons = [
        {
          title: "Đã Đặt Hàng",
        },
        {
          title: "Đã Xác Nhận",
        },
        {
          title: "Đang Giao Hàng",
        },
        {
          title: "Giao Hàng Thành Công",
        },
        {
          title: "Đã Nhận Hàng",
        },
        {
          title: "Hoàn Thành",
        },
      ];
      setdulieu(icons);
      setcheckbill(false);
      setcheck(2);
      sethuy(true);
      setnhan(true);
    } else if (order?.data[0]?.status == "4") {
      icons = [
        {
          title: "Đã Đặt Hàng",
        },
        {
          title: "Đã Xác Nhận",
        },
        {
          title: "Đang Giao Hàng",
        },
        {
          title: "Giao Hàng Thành Công",
        },
        {
          title: "Đã Nhận Hàng",
        },
        {
          title: "Hoàn Thành",
        },
      ];
      setdulieu(icons);
      setcheckbill(false);
      setcheck(3);
      sethuy(true);
      setnhan(false);
    } else if (order?.data[0]?.status == "5") {
      icons = [
        {
          title: "Đã Đặt Hàng",
        },
        {
          title: "Đã Xác Nhận",
        },
        {
          title: "Đang Giao Hàng",
        },
        {
          title: "Giao Hàng Thành Công",
        },
        {
          title: "Đã Nhận Hàng",
        },
        {
          title: "Hoàn Thành",
        },
      ];
      setdulieu(icons);
      setcheckbill(false);
      setcheck(4);
      sethuy(true);
      setnhan(true);
    } else if (order?.data[0]?.status == "6") {
      icons = [
        {
          title: "Đã Đặt Hàng",
        },
        {
          title: "Đã Xác Nhận",
        },
        {
          title: "Đang Giao Hàng",
        },
        {
          title: "Giao Hàng Thành Công",
        },
        {
          title: "Đã Nhận Hàng",
        },
        {
          title: "Hoàn Thành",
        },
      ];
      setdulieu(icons);
      setcheckbill(false);
      setcheck(5);
      sethuy(true);
      setnhan(true);
    } else if (order?.data[0]?.status == "0") {
      setcheckbill(true);
      icons = [
        {
          title: "Đã Hủy",
        },
        {
          title: "",
        },
        {
          title: "",
        },
        {
          title: "",
        },
        {
          title: "",
        },
        {
          title: "",
        },
      ];
      sethuy(true);
      setdulieu(icons);
      setcolor("error");
      setstatus("error");
      setnhan(true);
    } else if (order?.data[0]?.status == "7") {
      icons = [
        {
          title: "Đã Đặt Hàng",
        },
        {
          title: "Đã Xác Nhận",
        },
        {
          title: "Đang Giao Hàng",
        },
        {
          title: "Không nhận hàng",
        },
        {
          title: "",
        },
        {
          title: "",
        },
      ];
      setdulieu(icons);
      setcolor("error");
      setcheckbill(false);
      setcheck(4);
      sethuy(true);
      setnhan(true);
    } else {
      icons = [
        {
          title: "Đã Đặt Hàng",
        },
        {
          title: "Đã Xác Nhận",
        },
        {
          title: "Đang Giao Hàng",
        },
        {
          title: "Giao Hàng Thành Công",
        },
        {
          title: "Đã Nhận Hàng",
        },
        {
          title: "Hoàn Thành",
        },
      ];
      setdulieu(icons);
      setnhan(true);
    }
  }, [order, refetch]);
  const [sumKho] = useSumKhoMutation()
  const [cancel] = useUpdateCancellMutation();
  const HandleCancellOrder = () => {
    const datas = {
      id: id,
      productId: checkout?.data?.product
    }
    console.log("test", datas);

    cancel(datas)
      .unwrap()
      .then((data: any) => {
        sendEmail(datas);
        messageApi.open({
          type: "success",
          content: "Bạn đã hủy đơn hàng này!",
        });
        let quantityMap: Record<string, number> = {};

        datas?.productId?.forEach((data: any) => {
          if (quantityMap[data.product_id] === undefined) {
            quantityMap[data.product_id] = data.quantity;
          } else {
            quantityMap[data.product_id] += data.quantity;
          }
        });

        Object.keys(quantityMap)?.forEach((id) => {
          const kho = {
            quantity: quantityMap[id],
            productId: id
          };
          sumKho(kho);
        });

      })
      .catch((error: any) => {
        messageApi.open({
          type: "error",
          content: error?.data?.message,
        });
      });
  };
  const [done] = useUpdateOrderDoneMutation();
  const HandleDoneOrder = async () => {
    const idorder = { id: id };
    done(idorder)
      .unwrap()
      .then(() => {
        messageApi.open({
          type: "success",
          content: '',
        });
      })
      .catch((error: any) => {
        messageApi.open({
          type: "error",
          content: error?.data?.message,
        });
      });
  };

  // Nếu người dùng chưa đăng nhập, chuyển hướng sang CartNoTokenDetail
  const cartData = JSON.parse(localStorage.getItem("cartItems") || "[]");
  console.log(checkout?.data);
  const checkoutname = checkout?.data;
  const [checkoutnames, setcheckoutnames] = useState<any>();
  useEffect(() => {
    try {
      const checkoutOffObject = JSON.parse(checkout?.data?.checkout_off || "");
      setcheckoutnames(checkoutOffObject);
    } catch (error) {
      console.error("Lỗi khi phân tích chuỗi JSON:", error);
      // Xử lý lỗi theo ý muốn
    }
  }, [checkout?.data]);

  if (!user) {
    return (
      <>
        {TextHorder}
        <section
          className="breadcrumb breadcrumb_bg"
          style={{ marginTop: "70px", backgroundColor: "#eeee" }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="breadcrumb_iner">
                  <div className="breadcrumb_iner_item">
                    <h2>Chi tiết đơn hàng</h2>
                    <p>
                      Trang chủ <span>-</span> Chi tiết đơn hàng
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="container-fluid order-detail-section">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center py-3">
              <Steps
                style={{
                  marginTop: "10px",
                  marginBottom: "30px",
                  padding: "10px 40px",
                }}
                // current={1}
                status={color}
                current={check}
                items={dulieu}
              />
            </div>
            <div className="row">
              <div className="col-lg-8">
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="mb-3 d-flex justify-content-between">
                      <div>
                        <span className="me-3">{ngay}</span>
                        <span className="me-3">{gio}</span>
                        <span className="me-3">{payment}</span>
                        <span className="badge rounded-pill bg-info">
                          SHIPPING
                        </span>
                      </div>
                      <div className="d-flex">
                        <button
                          className="btn btn-link p-0 me-3 d-none d-lg-block btn-icon-text"
                          disabled={checkbill}
                        >
                          <i className="bi bi-download"></i>{" "}
                          <Link to={`/${id}/bill`} className="text">
                            xem hóa đơn
                          </Link>
                        </button>
                      </div>
                    </div>
                    <table className="table table-borderless">
                      <tbody>
                        {checkout?.data?.product?.map((data: any) => (
                          <ProductInOrderNoToken data={data} />
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={2}>Subtotal</td>
                          <td className="text-end">
                            <CurrencyFormatter
                              amount={Number(checkout?.data?.total)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2}>Shipping</td>
                          <td className="text-end">
                            <CurrencyFormatter amount="30000" />
                          </td>
                        </tr>
                        <tr className="fw-bold">
                          <td colSpan={2}>TOTAL</td>
                          <td className="text-end">
                            {payment == "VNPAY" ? (
                              <CurrencyFormatter amount={0} />
                            ) : (
                              <CurrencyFormatter
                                amount={
                                  Number(order?.data[0]?.order_total) + 30000
                                }
                              />
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-6">
                        <h3 className="h6">Phương thức thanh toán</h3>
                        <p style={{ color: 'red' }}>{payment}</p>
                      </div>
                      <div className="col-lg-6">
                        <h3 className="h6">Địa chỉ nhận hàng</h3>
                        <address>
                          <strong>{checkoutnames?.name}</strong>
                          <br />
                          {checkout?.data?.address}, {checkout?.data?.ward}
                          <br />
                          {checkout?.data?.district}, {checkout?.data?.province}
                          <br />
                          <span title="Phone">Số điện thoại: </span>
                          <b>{checkoutnames?.phone}</b>
                        </address>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card mb-4">
                  <div className="card-body">
                    <h3 className="h6">Mã Đơn Hàng</h3>
                    <p>
                      {" "}
                      <h2 className="h5 mb-0">
                        <a href="#" className="text-muted">
                          Order #{order?.data[0]?.order_id}
                        </a>
                      </h2>
                    </p>
                  </div>
                </div>
                <div className="card mb-4">
                  <div className="card-body">
                    <h3 className="h6">Shipping Information</h3>
                    <strong>FedEx</strong>
                    <span>
                      <a
                        href="#"
                        className="text-decoration-underline"
                        target="_blank"
                      >
                        FF1234567890
                      </a>
                      <i className="bi bi-box-arrow-up-right"></i>{" "}
                    </span>
                    <hr />
                    <h3 className="h6">Address</h3>
                    <address>
                      <strong>{checkoutnames?.name}</strong>
                      <br />
                      {checkout?.data?.address}, {checkout?.data?.ward}
                      <br />
                      {checkout?.data?.district}, {checkout?.data?.province}
                      <br />
                      <abbr title="Phone">Phone:</abbr> {checkoutnames?.phone}
                    </address>
                  </div>
                </div>
                {/* <Button disabled={huy} onClick={HandleCancellOrder}>
                  Hủy Đơn Hàng
                </Button> */}
                <span> </span>
                <Button disabled={nhan} onClick={HandleDoneOrder}>
                  Đã Nhận Được Hàng
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      {TextHorder}
      <section
        className="breadcrumb breadcrumb_bg"
        style={{ marginTop: "70px", backgroundColor: "#eeee" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="breadcrumb_iner">
                <div className="breadcrumb_iner_item">
                  <h2>Chi tiết đơn hàng</h2>
                  <p>
                    Trang chủ <span>-</span> Chi tiết đơn hàng
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container-fluid order-detail-section">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center py-3">
            <Steps
              style={{
                marginTop: "10px",
                marginBottom: "30px",
                padding: "10px 40px",
              }}
              // current={1}
              status={color}
              current={check}
              items={dulieu}
            />
          </div>
          <div className="row">
            <div className="col-lg-8">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="mb-3 d-flex justify-content-between">
                    <div>
                      <span className="me-3">{ngay}</span>
                      <span className="me-3">{gio}</span>
                      <span className="me-3">{payment}</span>
                      <span className="badge rounded-pill bg-info">
                        SHIPPING
                      </span>
                    </div>
                    <div className="d-flex">
                      <button
                        className="btn btn-link p-0 me-3 d-none d-lg-block btn-icon-text"
                        disabled={checkbill}
                      >
                        <i className="bi bi-download"></i>{" "}
                        <Link to={`/${id}/bill`} className="text">
                          Xem hoá đơn
                        </Link>
                      </button>
                    </div>
                  </div>
                  <table className="table table-borderless">
                    <tbody>
                      {checkout?.data?.product?.map((data: any) => (
                        <ProductInOrder data={data} />
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={2}>Tổng Tiền</td>
                        <td className="text-end">
                          <CurrencyFormatter amount={Number(order?.data[0]?.order_total)} />
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>Phí Vận Chuyển</td>
                        <td className="text-end">
                          <CurrencyFormatter amount="30000" />
                        </td>
                      </tr>
                      <tr className="fw-bold">
                        <td colSpan={2}>Thành Tiền</td>
                        <td className="text-end">
                          {payment == "VNPAY" ? (
                            <CurrencyFormatter amount={Number(0)} />
                          ) : (
                            <CurrencyFormatter
                              amount={
                                Number(order?.data[0]?.order_total) + 30000
                              }
                            />
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <div className="card mb-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-6">
                      <h3 className="h6">Phương thức thanh toán</h3>
                      <p style={{ color: 'red', fontWeight: 500 }}>{payment ? payment : ""}</p>
                    </div>
                    <div className="col-lg-6">
                      <h3 className="h6">Địa chỉ nhận hàng</h3>
                      <address>
                        <strong>
                          {user?.user?.user_lastname}{" "}
                          {user?.user?.user_firstname}
                        </strong>
                        <br />
                        {checkout?.data?.address}, {checkout?.data?.ward}
                        <br />
                        {checkout?.data?.district}, {checkout?.data?.province}
                        <br />
                        <span title="Phone">Số điện thoại: </span>
                        <b style={{ color: 'black' }}>{user?.user?.user_phone}</b>
                      </address>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card mb-4">
                <div className="card-body">
                  <h3 className="h6">Mã Đơn Hàng</h3>
                  <p>
                    <h2 className="h5 mb-0">
                      <a href="#" className="text-muted">
                        Đơn hàng #{order?.data[0]?.order_id}
                      </a>
                    </h2>
                  </p>
                </div>
              </div>
              <div className="card mb-4">
                <div className="card-body">
                  <h3 className="h6">Địa chỉ nhận hàng</h3>
                  <address>
                    <strong>
                      {user?.user?.user_lastname} {user?.user?.user_firstname}
                    </strong>
                    <br />
                    {checkout?.data?.address}, {checkout?.data?.ward}
                    <br />
                    {checkout?.data?.district}, {checkout?.data?.province}
                    <br />
                    <span title="Phone">Số điện thoại: </span>
                    <b style={{ color: 'black' }}>{user?.user?.user_phone}</b>
                  </address>
                </div>
              </div>
              <Button disabled={huy} onClick={HandleCancellOrder}>
                Hủy Đơn Hàng
              </Button>
              <span> </span>
              <Button disabled={nhan} onClick={HandleDoneOrder}>
                Đã Nhận Được Hàng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
