import React, { useEffect, useRef, useState } from "react";
import ClientLayOut from "../../layout/ClientLayOut/ClientLayOut";
import { useParams } from "react-router-dom";
import { useGetBillInOrderQuery } from "../../api/bill";
import { useGetOneOrderQuery } from "../../api/order";
import { useGetOneChekoutQuery } from "../../api/checkout";
import BillDetail from "./BillDetail";
import CurrencyFormatter from "../../utils/FormatTotal";
import { Spin } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const bill = () => {
  const { id } = useParams();
  console.log(id);

  const user = JSON.parse(localStorage.getItem("user")!);
  const token = user?.accessToken;
  const { data: bill } = useGetBillInOrderQuery(id);
  console.log(bill);
  
  const all = { id: bill?.data[0]?.order_id, token: token };
  const { data: order, isLoading } = useGetOneOrderQuery(
    bill?.data[0]?.order_id
  );
  console.log(order?.data);
  const { data: checkout } = useGetOneChekoutQuery(order?.data[0]?.checkout_id);
  console.log(checkout?.data?.product);

  const [totalSum, setTotalSum] = useState(0);
  const HandleTotal = (total: any) => {
    const totalToAdd = parseFloat(total);
    if (!isNaN(totalToAdd)) {
      setTotalSum((prevTotal: any) => prevTotal + totalToAdd);
    }
  };
  //notoken

  const { data: checkoutnotoken } = useGetOneChekoutQuery(
    order?.data[0]?.checkout_id
  );
  const [checkoutnames, setcheckoutnames] = useState<any>();
  useEffect(() => {
    try {
      const checkoutOffObject = JSON.parse(
        checkoutnotoken?.data?.checkout_off || ""
      );
      setcheckoutnames(checkoutOffObject);
    } catch (error) {
      console.error("Lỗi khi phân tích chuỗi JSON:", error);
      // Xử lý lỗi theo ý muốn
    }
  }, [checkoutnotoken?.data?.checkout_off]);
  console.log(checkoutnotoken?.data?.payment);
  const amount = parseFloat(bill?.data[0]?.total_amount) + 30000;
  const divRef = useRef<HTMLDivElement>(null);
  const handlePrint = async () => {
    if (divRef.current) {
      const canvas = await html2canvas(divRef.current);
      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait", // hoặc "landscape" nếu bạn muốn ngang
        unit: "mm",
        format: "a5", // hoặc "letter" hoặc "a3" tùy thuộc vào kích thước bạn muốn
      });
      pdf.addImage(imageData, "pdf", 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);
      pdf.save("your-bill.pdf");
    }
  }
  if (!user) {
    return (
      <>
        {isLoading ? (
          <div
            style={{ minHeight: "70px", marginLeft: "250%", marginTop: "10px" }}
          >
            <Spin tip="Loading..." size="large"></Spin>{" "}
          </div>
        ) : (
          <>
            <section
              className="favorite_area "
              style={{ padding: "50px", backgroundColor: "#f5f5f5" }}
              ref={divRef}
            >
              <div className="card">
                <div className="card-body">
                  <div className="container mb-5 mt-3">
                    <div className="row d-flex align-items-baseline">
                      <div className="col-xl-9">
                        <p style={{ color: "#7e8d9f", fontSize: "20px" }}>
                          Hoá đơn <strong>ID: {bill?.data[0]?.id}</strong>
                        </p>
                      </div>
                      <div className="col-xl-3 float-end">
                        <a
                          className="btn btn-light text-capitalize border-0"
                          data-mdb-ripple-color="dark"
                          onClick={handlePrint}
                        >

                          <PrinterOutlined /> Print
                        </a>

                      </div>
                      <hr />
                    </div>

                    <div className="container">
                      <div className="row">
                        <div className="col-xl-8">
                          <ul className="list-unstyled">
                            <li className="text-muted">
                              Người Nhận:
                              <span
                                style={{
                                  color: "#5d9fc5",
                                  marginLeft: "5px",
                                  fontWeight: "bold",
                                }}
                              >
                                {checkoutnames?.name}
                              </span>
                            </li>
                            <li className="text-muted">
                              Số Điện Thoại:
                              <span
                                style={{
                                  color: "#5d9fc5",
                                  marginLeft: "5px",
                                  fontWeight: "bold",
                                }}
                              >
                                {" "}
                                {checkoutnames?.phone || "N/A"}
                              </span>
                            </li>
                            <li className="text-muted">
                              Địa Chỉ:
                              <span
                                style={{
                                  color: "#5d9fc5",
                                  marginLeft: "5px",
                                  fontWeight: "bold",
                                }}
                              >
                                {" "}
                                  {bill?.data[0]?.customer_address || "N/A"},
                                  {bill?.data[0]?.customer_province || "N/A"},{" "}
                                  {bill?.data[0]?.customer_district || "N/A"},{" "}
                                  {bill?.data[0]?.customer_ward || "N/A"}{" "}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="row my-2 mx-1 justify-content-center">
                        <table className="table table-striped table-borderless">
                          <thead
                            style={{ backgroundColor: "#84B0CA" }}
                            className="text-white"
                          >
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Thông tin đơn hàng</th>
                              <th scope="col">Số lượng</th>
                              <th scope="col">Tổng tiền</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bill?.data[0]?.products?.map(
                              (data: any, index: any) => (
                                <BillDetail
                                  data={data}
                                  index={index}
                                  onTotal={HandleTotal}
                                />
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="row" style={{ marginTop: "50px" }}>
                        <div className="col-xl-8"></div>
                        <div className="col-xl-3">
                          <ul className="list-unstyled">
                            <li style={{ width: "200%", display: "flex" }}>
                              Phí Vận Chuyển:{" "}
                              <span style={{ fontWeight: "bold" }}>
                                <CurrencyFormatter amount="30000" />
                              </span>
                            </li>
                            <li style={{ width: "200%", display: "flex" }}>
                              Tổng Tiền:
                              <span style={{ fontWeight: "bold" }}>
                                  <CurrencyFormatter amount={bill?.data[0]?.total_amount} />
                              </span>
                            </li>
                          </ul>
                          <p className="text-black float-start">
                            <span className="text-black me-3">Thành Tiền</span>
                            <span style={{ fontSize: "25px" }}>
                              {/* <CurrencyFormatter amount={totalSum + 30000} /> */}
                              {
                                <CurrencyFormatter
                                  amount={
                                    checkoutnotoken?.data?.payment ===
                                      "Thanh toán qua VNPAY"
                                      ? 0
                                        : bill?.data[0]?.total_amount + 30000
                                  }
                                />
                              }
                            </span>
                          </p>
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-xl-10">
                          <p>Cảm ơn bạn đã tin tưởng shop</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </>
    );
  }
  return (
    <>
      {isLoading ? (
        <div
          style={{ minHeight: "70px", marginLeft: "250%", marginTop: "10px" }}
        >
          <Spin tip="Loading..." size="large"></Spin>{" "}
        </div>
      ) : (
        <>
          <section
            className="favorite_area "
            style={{ padding: "50px", backgroundColor: "#f5f5f5" }}
            ref={divRef}
          >
            <div className="card">
              <div className="card-body">
                <div className="container mb-5 mt-3">
                  <div className="row d-flex align-items-baseline">
                    <div className="col-xl-9">
                      <p style={{ color: "#7e8d9f", fontSize: "20px" }}>
                        Hoá đơn <strong>ID: {bill?.data[0]?.id}</strong>
                      </p>
                    </div>
                    <div className="col-xl-3 float-end">
                      <a
                        className="btn btn-light text-capitalize border-0"
                        data-mdb-ripple-color="dark"
                        onClick={handlePrint}
                      >
                        <PrinterOutlined /> Print
                      </a>

                    </div>
                    <hr />
                  </div>

                  <div className="container">
                    <div className="row">
                      <div className="col-xl-8">
                        <ul className="list-unstyled">
                          <li className="text-muted">
                            Người Nhận:
                            <span
                              style={{
                                color: "#5d9fc5",
                                marginLeft: "5px",
                                fontWeight: "bold",
                              }}
                            >
                                {bill?.data[0]?.customer_last_name} {""}

                                {bill?.data[0]?.customer_name}
                            </span>
                          </li>
                          <li className="text-muted">
                            Số Điện Thoại:
                            <span
                              style={{
                                color: "#5d9fc5",
                                marginLeft: "5px",
                                fontWeight: "bold",
                              }}
                            >
                                {bill?.data[0]?.customer_phone || "N/A"}
                            </span>
                          </li>
                          <li className="text-muted">
                            Địa Chỉ:
                            <span
                              style={{
                                color: "#5d9fc5",
                                marginLeft: "5px",
                                fontWeight: "bold",
                              }}
                            >
                                {bill?.data[0]?.customer_address || "N/A"},
                                {bill?.data[0]?.customer_province || "N/A"},{" "}
                                {bill?.data[0]?.customer_district || "N/A"},{" "}
                                {bill?.data[0]?.customer_ward || "N/A"}{" "}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="row my-2 mx-1 justify-content-center">
                      <table className="table table-striped table-borderless">
                        <thead
                          style={{ backgroundColor: "#84B0CA" }}
                          className="text-white"
                        >
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Thông tin đơn hàng</th>
                            <th scope="col">Số lượng</th>
                            <th scope="col">Tổng tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bill?.data[0]?.products?.map(
                            (data: any, index: any) => (
                              <BillDetail
                                data={data}
                                index={index}
                                onTotal={HandleTotal}
                              />
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="row" style={{ marginTop: "50px" }}>
                      <div className="col-xl-8"></div>
                      <div className="col-xl-3">
                        <ul className="list-unstyled">
                          <li style={{ width: "200%", display: "flex" }}>
                            Phí Vận Chuyển:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              <CurrencyFormatter amount="30000" />
                            </span>
                          </li>
                          <li style={{ width: "200%", display: "flex" }}>
                            Tổng Tiền:
                            <span style={{ fontWeight: "bold" }}>
                              <CurrencyFormatter
                                  amount={bill?.data[0]?.total_amount}
                              />
                            </span>
                          </li>
                        </ul>
                        <p className="text-black float-start">
                          <span className="text-black me-3">Thành Tiền</span>
                          <span style={{ fontSize: "25px" }}>
                            <CurrencyFormatter amount={amount} />
                          </span>
                        </p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-xl-10">
                        <p>Cảm ơn bạn đã tin tưởng shop</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default bill;
