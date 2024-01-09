import { Button, Form, Input, Radio, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styleVoucher.css";

const { Option } = Select;
import io from "socket.io-client";

import { useUpdateKhoMutation } from "../../../api/product";
import {
  useGetAllDistrictQuery,
  useGetAllProvinceQuery,
  useGetAllWardQuery,
} from "../../../api/countruy";
import {
  useAddOrderMutation,
  useSendEmailStatusOrderMutation,
} from "../../../api/order";
import { useGetCartQuery } from "../../../api/cart";
import {
  useGetAllVoucherQuery,
  useGetAllVoucherRuleQuery,
} from "../../../api/voucher";
import {
  useAddBCheckoutMutation,
  useAddBCheckoutNowMutation,
  useAddCheckoutNoTokenMutation,
} from "../../../api/checkout";
import {
  useCreate_vnpayMutation,
  useGetOneVnpayQuery,
} from "../../../api/vnpay";
import { pause } from "../../../utils/pause";
import useScrollToTopOnMount from "../../../utils/useScrollToTopOnMount";
import CurrencyFormatter from "../../../utils/FormatTotal";
import OrderNowDetail from "./OrderNowDetail";
import OrderNoToken from "./OrderNowNoToken";
import VoucherDetail from "../../checkout/VoucherDetail";
import ModelProfile from "../../checkout/ModelProfile";
const socket = io("http://localhost:8080");

const OrderNow = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { data: province } = useGetAllProvinceQuery("");
  const [provinceId, setprovinceId] = useState<any>();
  const [provinceName, setprovinceName] = useState<any>();
  const { data: district } = useGetAllDistrictQuery(provinceId);
  const [districtId, setdistrictId] = useState<any>();
  const [districtName, setDistrictName] = useState<any>();
  const { data: ward } = useGetAllWardQuery(districtId);
  const [sendEmail] = useSendEmailStatusOrderMutation();
  const handleProvince = (e: any) => {
    const selectedValue = e;
    const selectedProvinceId = selectedValue.split(":")[1];
    setprovinceId(selectedProvinceId);
    const selectedProvinceName = selectedValue.split(":")[0];
    setprovinceName(selectedProvinceName);
  };
  const handleDistrict = (e: any) => {
    const selectedValue = e;
    const selectedDistrictId = selectedValue.split(":")[1];
    setdistrictId(selectedDistrictId);
    const selectedDistrictName = selectedValue.split(":")[0];
    setDistrictName(selectedDistrictName);
  };
  const user = JSON.parse(localStorage.getItem("user")!);
  useEffect(() => {
    form.setFieldsValue(user?.user);
  }, [user?.user]);
  const userid = user?.user?.id;
  const { data: cart } = useGetCartQuery(userid);

  //voucher
  const [totalSum, setTotalSum] = useState(0);
  const [totalSumRoot, setTotalSumRoot] = useState(0);
  const iduser = user?.user?.id;
  console.log("iduser: ", iduser);
  const { data: getAllVoucherRule } = useGetAllVoucherRuleQuery({
    total: totalSum,
    iduser: iduser,
  });
  console.log("getVoucherRule: ", getAllVoucherRule);

  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [validVoucher, setValidVoucher] = useState<boolean | null>(null);
  const [originalTotal, setOriginalTotal] = useState(0);

  const handleApplyVoucher = (e: any) => {
    e.preventDefault();
    const selectedVoucherCode = selectedVoucher; // Lấy mã giảm giá từ select
    const vouchers = getAllVoucherRule?.data || [];
    // Danh sách mã giảm giá từ API

    // Tìm mã giảm giá hợp lệ trong danh sách
    const validVoucher = vouchers.find(
      (voucher: any) => voucher.voucher_code === selectedVoucherCode
    );
    if (validVoucher && validVoucher.voucher_status === "active") {
      // Cập nhật giá trị giảm giá và tái tính toán tổng tiền
      const discountAmount = validVoucher.voucher_amount;
      setDiscountAmount(discountAmount);
      // Cập nhật trạng thái thông báo
      setValidVoucher(true);
    } else {
      console.log("Mã giảm giá không hợp lệ hoặc hết hạn");
      setDiscountAmount(0);
      setValidVoucher(false);
      // Hiển thị thông báo lỗi hoặc thực hiện xử lý khác
    }
  };
  const HandleTotal = (total: any) => {
    const totalToAdd = parseFloat(total);
    if (!isNaN(totalToAdd)) {
      setTotalSum((prevTotal: any) => prevTotal + totalToAdd);
      setTotalSumRoot((prevTotal: any) => prevTotal + totalToAdd);
    }
  };
  useEffect(() => {
    setTotalSum(totalSumRoot - discountAmount);
  }, [discountAmount, cart]);

  const [payment, setpayment] = useState<any>();
  const [dis, setdis] = useState(true);
  const checkPayment = (_: any, value: any) => {
    if (!value) {
      setdis(true);
      return Promise.reject(
        "Vui lòng chọn ít nhất một phương thức thanh toán!"
      );
    } else {
      setdis(false);
      return Promise.resolve();
    }
  };
  const [checkout, { isLoading: checking }] = useAddBCheckoutMutation();
  const [checkoutnotoken] = useAddCheckoutNoTokenMutation();

  const [wardname, setwardname] = useState<any>();
  const HandleWard = (e: any) => {
    const selectedValue = e;
    const selectedProvinceName = selectedValue.split(":")[0];
    setwardname(selectedProvinceName);
  };

  const [address, setAddres] = useState<any>();

  const navigate = useNavigate();
  const [paymentstatus, setpaymentstatus] = useState<any>();
  const [total, settoal] = useState<any>();
  //vnpay
  const [createVnpay] = useCreate_vnpayMutation();
  console.log(totalSum);

  const { data: vnpays, isLoading, refetch } = useGetOneVnpayQuery("");
  const [vnpay, setvnpay] = useState<any>();
  useEffect(() => {
    socket.on("vnpay", (data) => {
      // alert(data.message);
      refetch();
      setvnpay(data);
    });
    return () => {
      socket.disconnect();
    };
  }, [refetch]);
  console.log(vnpay);
  const HandleVnpay = async () => {
    try {
      if (
        !lastname &&
        !firstname &&
        !phone &&
        !email &&
        !provinceName &&
        !districtName &&
        !address
      ) {
        messageApi.error("Bạn cần nhập đủ các thông tin giao hàng!");
        await pause(1500);
        window.location.href = "/checkout";
      } else if (
        lastname &&
        firstname &&
        phone &&
        email &&
        provinceName &&
        districtName &&
        address
      ) {
        const paymentVnpay = {
          amount: totalSum,
          bankCode: "VNPAY",
          language: "vn",
        };
        // Gọi mutation để khởi tạo thanh toán VNPAY
        createVnpay(paymentVnpay)
          .unwrap()
          .then((response: any) => {
            const vnpUrl = response.vnpUrl;
            if (vnpUrl) {
              const newTab = window.open(vnpUrl, "_blank");
              if (newTab) {
                newTab.focus();
              } else {
                console.log("Trình duyệt đã chặn mở cửa sổ mới.");
              }
            } else {
              console.log("Không nhận được URL thanh toán từ VNPAY.");
            }
          })
          .catch((error: any) => {
            console.log("Lỗi thanh toán VNPAY", error);
          });
      } else if (!userid && !provinceName && !districtName && !address) {
        messageApi.error("Bạn cần nhập đủ các thông tin giao hàng!");
        await pause(1500);
        window.location.href = "/checkout";
      } else if (userid && provinceName && districtName && address) {
        const paymentVnpay = {
          amount: totalSum,
          bankCode: "VNPAY",
          language: "vn",
        };
        // Gọi mutation để khởi tạo thanh toán VNPAY
        createVnpay(paymentVnpay)
          .unwrap()
          .then((response: any) => {
            const vnpUrl = response.vnpUrl;
            if (vnpUrl) {
              const newTab = window.open(vnpUrl, "_blank");
              if (newTab) {
                newTab.focus();
              } else {
                console.log("Trình duyệt đã chặn mở cửa sổ mới.");
              }
            } else {
              console.log("Không nhận được URL thanh toán từ VNPAY.");
            }
          })
          .catch((error: any) => {
            console.log("Lỗi thanh toán VNPAY", error);
          });
      }
    } catch (error) {
      console.log("Lỗi thanh toán VNPAY", error);
    }
  };

  //end vnpay
  useEffect(() => {
    if (payment == "Thanh toán khi nhận hàng") {
      setpaymentstatus(1);
      settoal(totalSum);
    } else if (payment == "Thanh toán qua VNPAY") {
      setpaymentstatus(2);
      settoal(0);
    }
  }, [payment]);
  const [check, setcheck] = useState(false);
  const [order, { isLoading: ordering }] = useAddOrderMutation();
  const [checkpayment, setcheckpayment] = useState(false);
  useEffect(() => {
    if (totalSum > 3000000) {
      setcheckpayment(true);
    } else if (totalSum < 3000000) {
      setcheckpayment(false);
    } else {
      setcheckpayment(true);
    }
  }, [totalSum]);
  const [checkoutnow] = useAddBCheckoutNowMutation();
  const buynow = JSON.parse(localStorage.getItem("buynow") || "[]");

  const HandleCheckOut = () => {
    const countMap = {};
    setcheck(true);
    const datas = {
      user_id: userid,
      total: totalSum,
      payment: payment,
      province: provinceName,
      district: districtName,
      ward: wardname,
      address: address,
      product: [
        {
          size: buynow?.productSize,
          color: buynow?.productColor,
          product_id: buynow?.product_id,
          quantity: buynow?.quantity,
        },
      ],
    };

    checkoutnow(datas)
      .unwrap()
      .then(async (data: any) => {
        const datass = {
          checkout_id: data?.data?.id,
          user_id: userid,
          order_total: totalSum,
          payment_status: paymentstatus,
        };
        console.log(datas);

        order(datass)
          .unwrap()
          .then(async (data: any) => {
            setcheck(false);
            localStorage.removeItem("buynow");
            sendEmail({ id: data?.data?.order_id });
            messageApi
              .open({
                type: "loading",
                content: "Đang tiến hành đặt hàng ...",
                duration: 1,
              })
              .then(() => messageApi.success("Đặt hàng thành công!"));
            await pause(3000);
            navigate(`/order/success/${data?.data?.order_id}`);
            let quantityMap: Record<string, number> = {};

            // Object.keys(quantityMap)?.forEach((id) => {
            const kho = {
              quantity: buynow?.quantity,
              productId: buynow?.product_id,
            };
            updatekho(kho);
            // });
          })
          .catch(({ data }: any) => {
            messageApi.open({
              type: "error",
              content: data?.message,
            });
          });
      })
      .catch(({ data }: any) => {
        messageApi.open({
          type: "error",
          content: data?.message,
        });
      });
  };

  const [lastname, setLastname] = useState<any>();
  const [firstname, setFirstname] = useState<any>();
  const [phone, setPhone] = useState<any>();
  const [email, setEmail] = useState<any>();
  const [updatekho] = useUpdateKhoMutation();
  const HandleCheckOutNoToken = () => {
    // setcheck(true);
    // proId?.map((data: any) => {
    //   // console.log(data);
    const kho = {
      quantity: buynow?.quantity,
      productId: buynow?.product_id,
    };
    updatekho(kho);
    // })

    const name = {
      name: `${lastname} ${firstname}`,
      phone: phone,
      email: email,
    };
    const datas = {
      total: totalSum,
      payment: payment,
      product: [
        {
          size: buynow?.productSize,
          color: buynow?.productColor,
          product_id: buynow?.product_id,
          quantity: buynow?.quantity,
        },
      ],
      checkout_off: name,
      province: provinceName,
      district: districtName,
      ward: wardname,
      address: address,
    };

    checkoutnotoken(datas)
      .unwrap()
      .then(async (data: any) => {
        const datass = {
          checkout_id: data?.data?.id,
          user_id: null,
          order_total: totalSum,
          payment_status: paymentstatus,
        };
        order(datass)
          .unwrap()
          .then(async (data: any) => {
            setcheck(false);
            localStorage.removeItem("buynow");
            sendEmail({ id: data?.data?.order_id });
            messageApi
              .open({
                type: "loading",
                content: "Đang tiến hành đặt hàng ...",
                duration: 1,
              })
              .then(() => messageApi.success("Đặt hàng thành công!"));
            await pause(3000);
            navigate(`/order/success/${data?.data?.order_id}`);
          })
          .catch(({ data }: any) => {
            messageApi.open({
              type: "error",
              content: data?.message,
            });
          });
      })
      .catch(({ data }: any) => {
        messageApi.open({
          type: "error",
          content: data?.message,
        });
      });
  };
  const checkBothHandle = () => {
    if (user) {
      // Đã đăng nhập
      if (payment === "Thanh toán khi nhận hàng") {
        HandleCheckOut();
      } else if (payment === "Thanh toán qua VNPAY") {
        if (vnpay?.data[0]?.status == "success") {
          HandleCheckOut();
        } else {
          HandleVnpay();
        }
      }
    } else {
      // Chưa đăng nhập
      if (payment === "Thanh toán khi nhận hàng") {
        HandleCheckOutNoToken();
      } else if (payment === "Thanh toán qua VNPAY") {
        if (vnpay?.data[0]?.status == "success") {
          HandleCheckOutNoToken();
        } else {
          HandleVnpay();
        }
      }
    }
  };

  useScrollToTopOnMount(cart);
  const handlePaymentChange = (e: any) => {
    if (e.target.value == "Thanh toán khi nhận hàng") {
      setpayment(e.target.value);
    } else {
      setpayment(e.target.value);
      HandleVnpay();
    }
  };
  //validate sdt-email
  const validatePhone = (
    rule: any,
    value: string,
    callback: (arg0: string | undefined) => void
  ) => {
    const phonePattern = /^[0-9]{10}$/; // Regular expression for 10-digit Vietnamese phone number

    if (value && !phonePattern.test(value)) {
      callback("Số điện thoại không hợp lệ");
    } else {
      callback(undefined);
    }
  };

  const validateEmail = (
    rule: any,
    value: string,
    callback: (arg0: string | undefined) => void
  ) => {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/; // Basic email pattern

    if (value && !emailPattern.test(value)) {
      callback("Email không hợp lệ");
    } else {
      callback(undefined);
    }
  };
  useEffect(() => {
    if (vnpay?.data[0]?.status == "error") {
      window.location.href = "/";
    }
  }, [vnpay?.data[0]?.status]);
  // no token
  // Nếu người dùng chưa đăng nhập, chuyển hướng sang checkoutnotoken
  const cartData = JSON.parse(localStorage.getItem("buynow") || "[]");

  useEffect(() => {
    if (vnpay?.data[0]?.status == "success") {
      if (!user) {
        HandleCheckOutNoToken();
      } else {
        HandleCheckOut();
      }
      return;
    }
  }, [vnpay?.data[0]?.status]);

  if (!user) {
    return (
      <>
        <div id="top"></div>
        {contextHolder}
        <section
          className="breadcrumb breadcrumb_bg"
          style={{ marginTop: "70px", backgroundColor: "#eeee" }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="breadcrumb_iner">
                  <div className="breadcrumb_iner_item">
                    <h2>Thủ tục thanh toán</h2>
                    <p>
                      Trang chủ <span>-</span> Thanh toán
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="checkout_area padding_top">
          <div className="container">
            <div className="billing_details">
              <div className="row">
                <Form
                  onFinish={HandleCheckOutNoToken}
                  className="row contact_form"
                  form={form}
                >
                  <div style={{ width: "50%" }}>
                    <h3>Thông tin khách hàng</h3>

                    <label htmlFor="largeInput" className="form-label">
                      Tên
                    </label>
                    <Form.Item
                      className="mt-2 mb-3"
                      name="user_firstname"
                      rules={[
                        {
                          required: true,
                          message: "Không được để trống tên ",
                        },
                      ]}
                    >
                      <Input
                        id="largeInput"
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Nhập tên khách hàng"
                        onChange={(e) => setFirstname(e.target.value)}
                      />
                    </Form.Item>
                    <label htmlFor="largeInput" className="form-label">
                      Họ
                    </label>
                    <Form.Item
                      className="mt-2 mb-3"
                      name="user_lastname"
                      rules={[
                        {
                          required: true,
                          message: "Không được để trống họ ",
                        },
                      ]}
                    >
                      <Input
                        id="largeInput"
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Nhập họ khách hàng"
                        onChange={(e) => setLastname(e.target.value)}
                      />
                    </Form.Item>
                    <label htmlFor="largeInput" className="form-label">
                      Số điện thoại
                    </label>
                    <Form.Item
                      className="mt-2 mb-3"
                      name="user_phone"
                      rules={[
                        {
                          required: true,
                          message: "Không được để trống số điện thoại",
                        },
                        {
                          validator: validatePhone,
                        },
                      ]}
                    >
                      <Input
                        id="largeInput"
                        className="form-control form-control-lg"
                        type="number"
                        placeholder="Nhập số điện thoại"
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Form.Item>
                    <label htmlFor="largeInput" className="form-label">
                      Email
                    </label>
                    <Form.Item
                      className="mt-2 mb-3"
                      name="user_email"
                      rules={[
                        {
                          required: true,
                          message: "Không được để trống email",
                        },
                        {
                          validator: validateEmail,
                        },
                      ]}
                    >
                      <Input
                        id="largeInput"
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Nhập email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Item>
                    <label htmlFor="largeSelect" className="form-label">
                      Tỉnh
                    </label>
                    <Form.Item
                      className="mt-2 mb-3"
                      name="user_povinces"
                      rules={[
                        {
                          required: true,
                          message: "Không được để trống tỉnh ",
                        },
                      ]}
                    >
                      <Select
                        id="largeSelect"
                        style={{ height: "50px", width: "100%" }}
                        onChange={handleProvince}
                        defaultValue=""
                      >
                        <Option value="">Chọn Tỉnh</Option>
                        {province?.results?.map((data: any) => {
                          return (
                            <Option
                              value={`${data?.province_name}:${data?.province_id}`}
                            >
                              {data?.province_name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <label htmlFor="largeSelect" className="form-label">
                      Huyện
                    </label>
                    <Form.Item
                      className="mt-2 mb-3"
                      name="user_districts"
                      rules={[
                        {
                          required: true,
                          message: "Không được để trống huyện ",
                        },
                      ]}
                    >
                      <Select
                        id="largeSelect"
                        style={{ height: "50px", width: "100%" }}
                        onChange={handleDistrict}
                        defaultValue=""
                      >
                        <Option value="">Chọn Huyện</Option>
                        {district?.results?.map((data: any) => {
                          return (
                            <Option
                              value={`${data?.district_name}:${data?.district_id}`}
                            >
                              {data?.district_name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      className="mt-2 mb-3"
                      rules={[{ required: true }]}
                    >
                      <label htmlFor="largeSelect" className="form-label">
                        Xã
                      </label>
                      <Select
                        id="largeSelect"
                        style={{ height: "50px", width: "100%" }}
                        defaultValue=""
                        onChange={HandleWard}
                      >
                        <Option value="">Chọn Xã</Option>
                        {ward?.results?.map((data: any) => {
                          return (
                            <Option
                              value={`${data?.ward_name}:${data?.ward_id}`}
                            >
                              {data?.ward_name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <label htmlFor="largeInput" className="form-label">
                      Địa chỉ cụ thể
                    </label>
                    <Form.Item
                      className="mt-2 mb-3"
                      name="user_addresss"
                      rules={[
                        {
                          required: true,
                          message: "Không được để trống địa chỉ",
                        },
                      ]}
                    >
                      <Input
                        id="largeInput"
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Địa chỉ cụ thể"
                        onChange={(e) => setAddres(e.target.value)}
                      />
                    </Form.Item>
                  </div>
                  <div style={{ width: "50%" }}>
                    <div
                      className="order_box"
                      style={{ backgroundColor: "#EEEEEE" }}
                    >
                      <h2>Thông tin đơn hàng của bạn</h2>
                      <ul className="list">
                        <li
                          style={{
                            textDecoration: "none",
                            backgroundColor: "white",
                            color: "white",
                          }}
                        >
                          <a
                            href="#"
                            style={{ width: "100%", borderBottom: "none" }}
                          >
                            <span style={{ width: "25%", fontWeight: "bold" }}>
                              <div style={{ float: "right" }}> Tiền</div>
                            </span>
                            <span style={{ width: "15%", fontWeight: "bold" }}>
                              <div style={{ textAlign: "center" }}>
                                Số lượng
                              </div>
                            </span>
                            <span style={{ width: "20%", fontWeight: "bold" }}>
                              <div style={{ textAlign: "center" }}>Màu</div>
                            </span>
                            <span style={{ width: "10%", fontWeight: 600 }}>
                              <div style={{ textAlign: "center" }}>Kích cỡ</div>
                            </span>
                            <span style={{ width: "30%", fontWeight: "bold" }}>
                              Sản phẩm
                            </span>
                          </a>
                        </li>

                        <OrderNoToken data={cartData} onTotal={HandleTotal} />
                      </ul>
                      <ul className="list list_2">
                        <li>
                          <a href="#">
                            Tổng tiền hàng
                            <span>
                              <CurrencyFormatter amount={totalSum} />
                            </span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            Phí giao hàng
                            <span>30.000</span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            Tổng cộng
                            <span style={{ marginLeft: "310px" }}>
                              {vnpay?.data[0]?.status == "success" ? (
                                <CurrencyFormatter amount={0} />
                              ) : (
                                <CurrencyFormatter amount={totalSum + 30000} />
                              )}
                            </span>
                          </a>
                        </li>
                      </ul>
                      <Form.Item
                        className="checkout__input__checkbox"
                        name="payment1"
                        rules={[{ validator: checkPayment }]}
                      >
                        <label htmlFor="payment" style={{ display: "flex" }}>
                          <Input
                            type="radio"
                            style={{ width: "10%" }}
                            id="payment"
                            name="a"
                            value="Thanh toán khi nhận hàng"
                            onChange={handlePaymentChange}
                            disabled={checkpayment}
                          />
                          <span className="checkmark">
                            Thanh toán khi nhận hàng
                          </span>
                          <div
                            style={{
                              fontSize: "10px",
                              color: "red",
                              marginTop: "5px",
                              marginLeft: "3px",
                            }}
                          >
                            {checkpayment
                              ? "* Không thể chọn khi đơn hàng lớn hơn 3 triệu"
                              : ""}
                          </div>
                        </label>
                      </Form.Item>
                      <Form.Item
                        className="checkout__input__checkbox"
                        name="payment1"
                        rules={[{ validator: checkPayment }]}
                      >
                        <label htmlFor="paypal" style={{ display: "flex" }}>
                          <Input
                            type="radio"
                            style={{ width: "10%" }}
                            id="paypal"
                            name="a"
                            value="Thanh toán qua VNPAY"
                            onChange={handlePaymentChange}
                          />
                          <span className="checkmark">
                            Vnpay{" "}
                            {vnpay?.data[0]?.status == "success"
                              ? "(Đã Thanh Toán)"
                              : ""}
                          </span>
                        </label>
                      </Form.Item>
                      {payment == "Thanh toán qua VNPAY" ? (
                        <Button
                          htmlType="submit"
                          className="btn_3"
                          style={{
                            height: "60px",
                            backgroundColor: "black",
                            border: "none",
                          }}
                          disabled={
                            vnpay?.data[0]?.status == "success" ? false : true
                          }
                        >
                          {ordering ? "Đang đặt hàng..." : "Đặt hàng"}
                        </Button>
                      ) : (
                        <Button
                          htmlType="submit"
                          className="btn_3"
                          style={{
                            height: "60px",
                            backgroundColor: "black",
                            border: "none",
                          }}
                          disabled={check}
                        >
                          {ordering ? "Đang đặt hàng..." : "Đặt hàng"}
                        </Button>
                      )}

                      {/* <Button
                        htmlType='submit'
                        className="btn_3"
                        style={{ height: "56px" }}
                        onClick={checkBothHandle}
                      >
                        <Link to="#">Proceed To Order</Link>
                      </Button> */}

                      {/* <label>Thanh Toán Khi Nhận Hàng</label> */}

                      {/* <div style={{ display: "flex", marginBottom: "50px" }}> */}
                      {/* <Form.Item style={{ width: "30%" }} name='payment_status'>
                        <Input
                          name="a"
                          type="radio"
                          style={{ width: "70%", fontSize: "30px" }}
                          value="Thanh toán qua VNPAY"
                          onChange={(e) => handlePaymentChange(e)}
                        />
                      </Form.Item>
                      <label>VNPAY </label> */}
                      {/* </div> */}
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
  // end no token

  return (
    <>
      <div id="top"></div>
      {contextHolder}
      <section
        className="breadcrumb breadcrumb_bg"
        style={{ marginTop: "70px", backgroundColor: "#eeee" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="breadcrumb_iner">
                <div className="breadcrumb_iner_item">
                  <h2>Thủ Tục Thanh Toán</h2>
                  <p>
                    Trang chủ <span>-</span> Thanh toán
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="checkout_area padding_top">
        <div className="container">
          <div className="billing_details">
            <div className="row">
              <Form
                onFinish={HandleCheckOut}
                className="row contact_form"
                form={form}
              >
                <div style={{ width: "40%" }}>
                  <h3>Thông tin khách hàng</h3>

                  <label htmlFor="largeInput" className="form-label">
                    Tên
                  </label>
                  <Form.Item
                    className="mt-2 mb-3"
                    name="user_firstname"
                    rules={[
                      {
                        required: true,
                        message: "Không được để trống tên ",
                      },
                    ]}
                  >
                    <Input
                      id="largeInput"
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Nhập tên"
                      disabled
                    />
                  </Form.Item>
                  <label htmlFor="largeInput" className="form-label">
                    Họ
                  </label>
                  <Form.Item
                    className="mt-2 mb-3"
                    name="user_lastname"
                    rules={[
                      {
                        required: true,
                        message: "Không được để trống họ ",
                      },
                    ]}
                  >
                    <Input
                      id="largeInput"
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Nhập họ"
                      disabled
                    />
                  </Form.Item>
                  <label htmlFor="largeInput" className="form-label">
                    Số điện thoại
                  </label>
                  <Form.Item
                    className="mt-2 mb-3"
                    name="user_phone"
                    rules={[
                      {
                        required: true,
                        message: "Không được để trống số điện thoại ",
                      },
                    ]}
                  >
                    <Input
                      id="largeInput"
                      className="form-control form-control-lg"
                      type="number"
                      placeholder="Nhập số điện thoại"
                      disabled
                    />
                  </Form.Item>
                  <label htmlFor="largeInput" className="form-label">
                    Email
                  </label>
                  <Form.Item
                    className="mt-2 mb-3"
                    name="user_email"
                    rules={[
                      { required: true, message: "Không được để trống email " },
                    ]}
                  >
                    <Input
                      id="largeInput"
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Nhập email"
                      disabled
                    />
                  </Form.Item>
                 <ModelProfile/>
                  <label htmlFor="largeSelect" className="form-label">
                    Tỉnh
                  </label>
                  <Form.Item
                    className="mt-2 mb-3"
                    name="user_povinces"
                    rules={[
                      { required: true, message: "Không được để trống tỉnh " },
                    ]}
                  >
                    <Select
                      id="largeSelect"
                      style={{ height: "50px", width: "100%" }}
                      onChange={handleProvince}
                      defaultValue=""
                    >
                      <Option value="">Chọn Tỉnh</Option>
                      {province?.results?.map((data: any) => {
                        return (
                          <Option
                            value={`${data?.province_name}:${data?.province_id}`}
                          >
                            {data?.province_name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <label htmlFor="largeSelect" className="form-label">
                    Huyện
                  </label>
                  <Form.Item
                    className="mt-2 mb-3"
                    name="user_districts"
                    rules={[
                      { required: true, message: "Không được để trống huyện " },
                    ]}
                  >
                    <Select
                      id="largeSelect"
                      style={{ height: "50px", width: "100%" }}
                      onChange={handleDistrict}
                      defaultValue=""
                    >
                      <Option value="">Chọn Huyện</Option>
                      {district?.results?.map((data: any) => {
                        return (
                          <Option
                            value={`${data?.district_name}:${data?.district_id}`}
                          >
                            {data?.district_name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item className="mt-2 mb-3" rules={[{ required: true }]}>
                    <label htmlFor="largeSelect" className="form-label">
                      Xã
                    </label>
                    <Select
                      id="largeSelect"
                      style={{ height: "50px", width: "100%" }}
                      defaultValue=""
                      onChange={HandleWard}
                    >
                      <Option value="">Chọn Xã</Option>
                      {ward?.results?.map((data: any) => {
                        return (
                          <Option value={`${data?.ward_name}:${data?.ward_id}`}>
                            {data?.ward_name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <label htmlFor="largeInput" className="form-label">
                    Địa chỉ cụ thể
                  </label>
                  <Form.Item
                    className="mt-2 mb-3"
                    name="user_addresss"
                    rules={[
                      {
                        required: true,
                        message: "Không được để trống địa chỉ",
                      },
                    ]}
                  >
                    <Input
                      id="largeInput"
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Địa chỉ cụ thể"
                      onChange={(e) => setAddres(e.target.value)}
                    />
                  </Form.Item>
                </div>
                <div style={{ width: "60%" }}>
                  <div
                    className="order_box"
                    style={{ backgroundColor: "#EEEEEE" }}
                  >
                    <h2>Thông tin đơn hàng của bạn</h2>
                    <ul className="list">
                      <li
                        style={{
                          textDecoration: "none",
                          backgroundColor: "white",
                          color: "white",
                        }}
                      >
                        <a
                          href="#"
                          style={{ width: "100%", borderBottom: "none" }}
                        >
                          <span style={{ width: "25%", fontWeight: "bold" }}>
                            <div style={{ float: "right" }}> Tiền</div>
                          </span>
                          <span style={{ width: "15%", fontWeight: "bold" }}>
                            <div style={{ textAlign: "center" }}>Số lượng</div>
                          </span>
                          <span style={{ width: "20%", fontWeight: "bold" }}>
                            <div style={{ textAlign: "center" }}>Màu</div>
                          </span>
                          <span style={{ width: "10%", fontWeight: 600 }}>
                            <div style={{ textAlign: "center" }}>Kích cỡ</div>
                          </span>
                          <span style={{ width: "30%", fontWeight: "bold" }}>
                            Sản phẩm
                          </span>
                        </a>
                      </li>

                      <OrderNowDetail data={cartData} onTotal={HandleTotal} />
                    </ul>
                    <ul className="list list_2">
                      <li>
                        <a
                          style={{ textDecoration: "none" }}
                          href="javascript:;"
                        >
                          Tổng tiền Hàng
                          <span
                            style={{
                              textDecoration: validVoucher
                                ? "line-through"
                                : "none",
                            }}
                          >
                            <CurrencyFormatter amount={totalSumRoot} />
                          </span>
                          {validVoucher && (
                            <p
                              style={{
                                display: "flex",
                                marginLeft: "522px",
                                fontSize: "11px",
                                color: "red",
                              }}
                            >
                              - <CurrencyFormatter amount={discountAmount} />
                            </p>
                          )}
                        </a>
                      </li>
                      {validVoucher && (
                        <li>
                          <a
                            style={{ textDecoration: "none" }}
                            href="javascript:;"
                          >
                            Tổng tiền (Đã Giảm)
                            <span>
                              <CurrencyFormatter amount={totalSum} />
                            </span>
                          </a>
                        </li>
                      )}

                      <li>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            // marginTop: "80px",
                          }}
                        >
                          <a
                            href="javascript:;"
                            style={{
                              marginRight: "327px",
                              textDecoration: "none",
                            }}
                          >
                            Voucher
                          </a>
                          <select
                            value={selectedVoucher}
                            onChange={(e) => setSelectedVoucher(e.target.value)}
                            style={{
                              boxShadow: "0 0 0 1px #d9d9d9",
                              transition: "all 0.2s ease-out",
                              backgroundColor: "white",
                              color: "#333333",
                              borderRadius: "4px",
                              border: "none",
                            }}
                          >
                            <option value="">Chọn mã giảm giá</option>
                            {getAllVoucherRule?.data?.map((data: any) => (
                              <VoucherDetail data={data} />
                            ))}

                            {/* Add more options as needed */}
                          </select>
                          <button
                            onClick={handleApplyVoucher}
                            style={{
                              backgroundColor: "gray",
                              padding: "0 15px",
                              marginTop: "0px",
                              marginLeft: "5px",
                              border: "none",
                              borderRadius: "4px",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            OK
                          </button>
                        </div>
                        {validVoucher === true && (
                          <p style={{ marginLeft: "378px", color: "green" }}>
                            Áp dụng mã thành công
                            {/* <CurrencyFormatter amount={discountAmount} /> */}
                          </p>
                        )}
                      </li>
                      <li>
                        <a
                          href="javascript:;"
                          style={{ textDecoration: "none" }}
                        >
                          Phí Giao Hàng
                          <span style={{ marginLeft: "420px" }}>
                            <CurrencyFormatter amount={30000} />
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="javascript:;"
                          style={{ marginTop: "30px", textDecoration: "none" }}
                        >
                          Thành Tiền
                          <span>
                            {vnpay?.data[0]?.status == "success" ? (
                              <CurrencyFormatter amount={0} />
                            ) : (
                              <CurrencyFormatter amount={totalSum + 30000} />
                            )}
                          </span>
                        </a>
                      </li>
                    </ul>
                    <Form.Item
                      className="checkout__input__checkbox"
                      name="payment1"
                      rules={[{ validator: checkPayment }]}
                    >
                      <label htmlFor="payment" style={{ display: "flex" }}>
                        <Input
                          disabled={checkpayment}
                          type="radio"
                          style={{ width: "10%" }}
                          id="payment"
                          name="a"
                          value="Thanh toán khi nhận hàng"
                          onChange={handlePaymentChange}
                        />
                        <span className="checkmark">
                          Thanh toán khi nhận hàng
                        </span>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "red",
                            marginTop: "5px",
                            marginLeft: "3px",
                          }}
                        >
                          {checkpayment
                            ? "* Không thể chọn khi đơn hàng lớn hơn 3 triệu"
                            : ""}
                        </div>
                      </label>
                    </Form.Item>
                    <Form.Item
                      className="checkout__input__checkbox"
                      name="payment1"
                      rules={[{ validator: checkPayment }]}
                    >
                      <label htmlFor="paypal" style={{ display: "flex" }}>
                        <Input
                          type="radio"
                          style={{ width: "10%" }}
                          id="paypal"
                          name="a"
                          value="Thanh toán qua VNPAY"
                          onChange={handlePaymentChange}
                        />
                        <span className="checkmark">
                          Vnpay
                          {vnpay?.data[0]?.status == "success"
                            ? "(Đã Thanh Toán)"
                            : ""}
                        </span>
                      </label>
                    </Form.Item>
                    {payment == "Thanh toán qua VNPAY" ? (
                      <Button
                        htmlType="submit"
                        className="btn_3"
                        style={{
                          height: "60px",
                          backgroundColor: "black",
                          border: "none",
                        }}
                        disabled={
                          vnpay?.data[0]?.status == "success" ? false : true
                        }
                      >
                        {ordering ? "Đang đặt hàng..." : "Đặt hàng"}
                      </Button>
                    ) : (
                      <Button
                        htmlType="submit"
                        className="btn_3"
                        style={{
                          height: "60px",
                          backgroundColor: "black",
                          border: "none",
                        }}
                        disabled={check}
                      >
                        {ordering ? "Đang đặt hàng..." : "Đặt hàng"}
                      </Button>
                    )}

                    {/* <Button
                    htmlType='submit'
                    className="btn_3"
                    style={{ height: "56px" }}
                    onClick={checkBothHandle}
                  >
                    <Link to="#">Proceed To Order</Link>
                  </Button> */}

                    {/* <label>Thanh Toán Khi Nhận Hàng</label> */}

                    {/* <div style={{ display: "flex", marginBottom: "50px" }}> */}
                    {/* <Form.Item style={{ width: "30%" }} name='payment_status'>
                    <Input
                      name="a"
                      type="radio"
                      style={{ width: "70%", fontSize: "30px" }}
                      value="Thanh toán qua VNPAY"
                      onChange={(e) => handlePaymentChange(e)}
                    />
                  </Form.Item>
                  <label>VNPAY </label> */}
                    {/* </div> */}
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderNow;
