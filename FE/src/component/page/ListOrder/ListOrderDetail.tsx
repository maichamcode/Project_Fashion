import { HeartOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom"
import { useGetOneChekoutQuery } from "../../../api/checkout";
import { useGetOneProductQuery } from "../../../api/product";
import { useGetSizeQuery } from "../../../api/size";
import { useGetColorQuery } from "../../../api/color";
import CurrencyFormatter from "../../../utils/FormatTotal";
import { useEffect, useState } from "react";
import { useGetAllOrderQuery, useGetOneOrderQuery } from "../../../api/order";


const ListOrderDetail = ({ data }: any) => {
    const [status, setstatus] = useState<any>()
    const [css, setcss] = useState<any>()
    useEffect(() => {
        // Update status and css based on data.status
        if (data?.status == 1) {
            setstatus('Đã Đặt Hàng');
            setcss('primary');

        } else if (data?.status == 2) {
            setstatus('Đã Xác Nhận');
            setcss('info');

        } else if (data?.status == 3) {
            setstatus('Đang Giao Hàng');
            setcss('success');

        } else if (data?.status == 4) {
            setstatus('Đã Giao Hàng');
            setcss('success');

        } else if (data?.status == 5) {
            setstatus('Đã Nhận Hàng');
            setcss('success');

        } else if (data?.status == 6) {
            setstatus('Đã Hoàn Thành');
            setcss('success');

        } else {
            setstatus('Đã Hủy Hàng');
            setcss('danger');

        }
    }, [data?.status]);
    const { data: checkout } = useGetOneChekoutQuery(data?.checkout_id)
    const { data: product } = useGetOneProductQuery(checkout?.data?.product[0]?.product_id)
    const imageArray = product?.data[0]?.image[0]?.split(",");
    const { data: size } = useGetSizeQuery('')
    const { data: color } = useGetColorQuery('')
    const { data: getorder} = useGetOneOrderQuery('')
console.log(getorder);

    // const OrderId = getorder?.orders?.map(order =>order?.order_id)
   
    
    const sizeName = size?.data?.find((data: any) => data?.size_id == checkout?.data?.product[0]?.size)?.size_name
    const colorName = color?.data?.find((data: any) => data?.color_id == checkout?.data?.product[0]?.color)?.color_name
    const ngay = data?.order_date?.substring(1, 11);
    const gio = data?.order_date?.substring(12, 20);
    return (
        <>
            <div className="col-md-12">
                <div className="card shadow-0 border rounded-3">
                    <div className="card-body">
                        <div className="row g-0">
                            <div className="col-xl-3 col-md-4 d-flex justify-content-center">
                                <div className="bg-image hover-zoom ripple rounded ripple-surface me-md-3 mb-3 mb-md-0">
                                    <img src={imageArray ? imageArray[0] : ""} className="w-100" />
                                    <a href="#!">
                                        <div className="hover-overlay">
                                            <div
                                                className="mask"
                                                style={{
                                                    backgroundColor: "rgba(253, 253, 253, 0.15)",
                                                }}
                                            ></div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div className="col-xl-6 col-md-5 col-sm-7">
                                <h5>{product?.data[0]?.product_name}</h5>
                                <p className="text mb-4 mb-md-0">
                                    Thời gian: {ngay ? ngay : ""} {gio ? gio : ""}
                                </p>
                                <p className="text mb-4 mb-md-0">
                                    Kích cỡ: {sizeName ? sizeName : ""}
                                </p>
                                <p className="text mb-4 mb-md-0">
                                    Màu: {colorName ? colorName : ""}
                                </p>
                                <p className="text mb-4 mb-md-0">
                                    Số lượng: {checkout?.data?.product ? checkout?.data?.product[0]?.quantity : ""}
                                </p>
                            </div>
                            <div className="col-xl-3 col-md-3 col-sm-5">
                                <div className="d-flex flex-row align-items-center mb-1">
                                    <h4 className="mb-1 me-1">
                                        <CurrencyFormatter amount={checkout?.data?.total} />
                                    </h4>
                                </div>
                                <h6 className="text-success"><CurrencyFormatter amount="30000" /></h6>
                                <p style={{ color: 'blue', textDecoration: 'underline' }}>{status ? status : ""}</p>
                                <div className="mt-4">

                                    <Link to={`${data?.order_id}/orderdetail`}>
                                        <button
                                            className="btn btn-primary shadow-0"
                                            type="button"
                                            style={{ marginRight: "10px" }}
                                        >
                                            Chi tiết
                                        </button>
                                    </Link>
                                    <p className="text mb-4 mb-md-0">
                                        {checkout?.data ? checkout?.data?.product?.length : ""} sản phẩm
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div></>
    )
}

export default ListOrderDetail