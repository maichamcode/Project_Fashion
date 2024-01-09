import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetOneChekoutQuery } from '../../../api/checkout';
import { useGetOneOrderQuery } from '../../../api/order';
import { useGetOneUserQuery } from '../../../api/auth';
import CurrencyFormatter from '../../../utils/FormatTotal';
import DetailOneOrderAdmin from './DetailOneOrderAdmin';
import { Steps } from 'antd';
import '../../../layout/ClientLayOut/css/all.css';
import { useGetOneProductQuery } from '../../../api/product';
import { useGetSaleQuery } from '../../../api/sale';
import { useGetSizeQuery } from '../../../api/size';
import { useGetColorQuery } from '../../../api/color';


const OrderDetailAdmin = ({ data }: any) => {
    const { id } = useParams()
    const { data: order } = useGetOneOrderQuery(id)
    const ngay = order?.data[0]?.order_date?.substring(1, 11);
    const gio = order?.data[0]?.order_date?.substring(12, 20);
    const [payment, setpayment] = useState<any>()
    useEffect(() => {
        if (order?.data[0]?.payment_status == 1) {
            setpayment('COD')
        } else {
            setpayment('VNPAY')
        }
    }, [order])
    const { data: checkout } = useGetOneChekoutQuery(order?.data[0]?.checkout_id)
    const { data: size } = useGetSizeQuery('')
    const { data: color } = useGetColorQuery('')


    console.log(checkout?.data);
    // const user = JSON.parse(localStorage.getItem('user')!)
    const user_id = checkout?.data?.user_id;
    console.log("user id: ", user_id);
    const sizeName = size?.data?.find((data1: any) => data1?.size_id == data?.size)?.size_name
    const colorName = color?.data?.find((data1: any) => data1?.color_id == data?.color)?.color_name
    console.log(colorName);

    const { data: userData } = useGetOneUserQuery(user_id);
    console.log("user data: ", userData);

    // // Lấy user_firstname từ kết quả truy vấn người dùng
    // const userFirstName = data?.userData?.user_firstname;
    // console.log("name: ", userFirstName);

    const [payments, setpayments] = useState<any>()

    const [checkbill, setcheckbill] = useState(false);
    useEffect(() => {
        if (order?.data[0]?.status == 1) {
            setpayments('Chờ Xác Nhận')
            setcheckbill(true)
        } else if (order?.data[0]?.status == 2) {
            setpayments('Đã Xác Nhận')
            setcheckbill(false)
        } else if (order?.data[0]?.status == 3) {
            setpayments('Đang Giao Hàng')
            setcheckbill(false)
        } else if (order?.data[0]?.status == 4) {
            setpayments('Đã Giao Hàng')
            setcheckbill(false)
        } else if (order?.data[0]?.status == 5) {
            setpayments('Đã Nhận Hàng')
            setcheckbill(false)
        } else if (order?.data[0]?.status == 6) {
            setpayments('Hoàn Thành')
            setcheckbill(false)
        } else if (order?.data[0]?.status == 7) {
            setpayments('Không nhận hàng')
            setcheckbill(false)
        } else {
            setpayments('Đã Hủy Hàng')
            setcheckbill(true)
        }
    }, [order])
    const { data: product } = useGetOneProductQuery(data?.product_id)

    const { data: sale } = useGetSaleQuery('')
    const saleName = sale?.data?.find((id: any) => id?.sale_id == product?.data[0]?.sale_id)?.sale_distcount
    const totalSale = (product?.data[0]?.product_price * saleName) / 100
    const total = (product?.data[0]?.product_price - totalSale)
    const [totals, settotals] = useState<any>()
    const [checkoutnames, setcheckoutnames] = useState<any>()
    useEffect(() => {
        try {
            const checkoutOffObject = JSON.parse(checkout?.data?.checkout_off || "");
            setcheckoutnames(checkoutOffObject);
        } catch (error) {
            console.error("Lỗi khi phân tích chuỗi JSON:", error);
        }
    }, [checkout?.data])
    useEffect(() => {
        if (total) {
            settotals(data?.quantity * total)
        } else {
            settotals(data?.quantity * product?.data[0]?.product_price)
        }
    }, [product?.data[0]?.product_price])
    return (
        <>

            <section className=" gradient-custom" >
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-lg-10 col-xl-8" style={{ minWidth: "109%" }}>
                            <div className="card" style={{ borderRadius: '10px' }}>
                                <div className="card-header px-4 py-5">
                                    <h5 className="text-muted mb-0">Thông tin đơn hàng của  <span style={{ color: '#a8729a' }}>{checkoutnames ? checkoutnames?.name : `${userData?.data?.user_lastname} ${userData?.data?.user_firstname}`}</span>!   <div className="d-flex">
                                        <button
                                            style={{border:"none"}}
                                            disabled={checkbill}
                                        >
                                            <i className="bi bi-download"></i>{" "}
                                            <Link to={`/${id}/bill`} className="text">
                                                xem hóa đơn
                                            </Link>
                                        </button>
                                    </div></h5>
                                    <h5 style={{ textAlign: "right", marginTop: "-20px" }}>
                                        <span className={order?.data[0]?.status === 2 ? "status-confirmed" : (order?.data[0]?.status === 3 ? "status-delivered" : "status-cancelled")}>
                                            {payments ? payments : ""}
                                        </span>
                                    </h5>
                                </div>

                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <p className="lead fw-normal mb-0" style={{ color: '#a8729a' }}> <a href="#" className="text-muted">
                                            Order #{order?.data[0]?.order_id}
                                        </a></p>
                                        <p className="small text-muted-bold mb-0">{ngay}-{gio}</p>
                                    </div>
                                    <div className="card shadow-0 border mb-4">
                                        {checkout?.data?.product?.map((data: any) => <DetailOneOrderAdmin data={data} />)}
                                    </div>
                                    <div className="d-flex justify-content-between pt-2">
                                        <p className="fw-bold mb-0">Thông tin người mua</p>
                                    </div>
                                    <div className="d-flex justify-content-between pt-2">
                                        <p className="text-muted-bold mb-0">Họ và Tên</p>
                                        <p style={{ textAlign: "right" }}>{checkoutnames ? checkoutnames?.name : `${userData?.data?.user_lastname} ${userData?.data?.user_firstname}`}</p>

                                    </div>
                                    <div className="d-flex justify-content-between pt-2">
                                        <p className="text-muted-bold mb-0">Số Điện Thoại</p>
                                        <p style={{ textAlign: "right" }}>{checkoutnames ? checkoutnames?.phone : `${userData?.data?.user_phone}`}</p>
                                    </div>
                                    <div className="d-flex justify-content-between pt-2">
                                        <p className="text-muted-bold mb-0">Địa chỉ</p>
                                        <p style={{ textAlign: "right" }}>{checkout?.data?.address},
                                            <br />
                                            {checkout?.data?.ward}
                                            <br />
                                            {checkout?.data?.district},
                                            <br />
                                            {checkout?.data?.province}</p>
                                    </div>
                                    <div className="d-flex justify-content-between pt-2">
                                        <p className="text-muted-bold mb-0">Email</p>
                                        <p style={{ textAlign: "right" }}>{checkoutnames ? checkoutnames?.email : `${userData?.data?.user_email}`}</p>
                                    </div>
                                    <div className="d-flex justify-content-between pt-2">
                                        <p className="text-muted-bold mb-0">Phí ship</p>
                                        <p style={{ textAlign: "right" }}><CurrencyFormatter amount="30000" /></p>
                                    </div>
                                    <div className="d-flex justify-content-between pt-2">
                                        <p className="text-muted-bold mb-0">Phương thức thanh toán</p>
                                        <p style={{ textAlign: "right" }}>{payment ? payment : ""}</p>
                                    </div>

                                </div>
                                <div className="card-footer border-0 px-4 py-5" style={{ backgroundColor: '#eeeeee', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}>
                                    {/* <h5 className="d-flex align-items-center justify-content-end text-white text-uppercase mb-0">Giá Tiền: <span className="h2 mb-0 ms-2"><CurrencyFormatter amount={Number(order?.data[0]?.order_total)} /></span></h5>
                                    <h5 className="d-flex align-items-center justify-content-end text-white text-uppercase mb-0">Phí Ship: <span className="h2 mb-0 ms-2"><CurrencyFormatter amount="30000" /></span></h5>                                    */}
                                    <h5 className="d-flex align-items-center justify-content-end text-black text-uppercase mb-0">Thành tiền: <span className="h3 mb-0 ms-2 text-black"><CurrencyFormatter amount={Number(order?.data[0]?.order_total) + 30000} /></span></h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >



        </>
    )
}

export default OrderDetailAdmin