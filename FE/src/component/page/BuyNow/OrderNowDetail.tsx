import { useEffect, useState } from "react";
import { useGetOneProductQuery } from "../../../api/product";
import { useGetSizeQuery } from "../../../api/size";
import { useGetColorQuery } from "../../../api/color";
import { useGetSaleQuery } from "../../../api/sale";
import CurrencyFormatter from "../../../utils/FormatTotal";



const OrderNowDetail = ({ data, onTotal }: any) => {
    console.log(data);

    const { data: product } = useGetOneProductQuery(data?.product_id)
    const { data: size } = useGetSizeQuery('')
    const { data: color } = useGetColorQuery('')
    const sizeName = size?.data?.find((id: any) => id?.size_id == data?.productSize)?.size_name
    const colorName = color?.data?.find((id: any) => id?.color_id == data?.productColor)?.color_name
    const { data: sale } = useGetSaleQuery('')
    const saleName = sale?.data?.find((id: any) => id?.sale_id == product?.data[0]?.sale_id)?.sale_distcount
    const totalSale = (product?.data[0]?.product_price * saleName) / 100
    const total = (product?.data[0]?.product_price - totalSale)
    const [tongtien, settongtien] = useState<any>()
    useEffect(() => {
        if (total) {
            const totals = (data?.quantity * total)
            settongtien(totals)
            onTotal(totals)
        } else {
            const totals = (data?.quantity * product?.data[0]?.product_price)
            settongtien(totals)
            onTotal(totals)
        }
    }, [total, product?.data[0]?.product_price])
    return (
        <>
            {/* <li >
                <a href="#" style={{ width: "100%" }}>
                    <span style={{ width: "25%" }}> <div style={{ float: "right" }}><CurrencyFormatter amount={tongtien} /></div> </span>
                    <span style={{ width: "15%" }}><div style={{ textAlign: "center" }}>{data?.quantity}</div></span>
                    <span style={{ width: "20%" }}><div style={{ textAlign: 'center' }}>{colorName}</div></span>
                    <span style={{ width: "10%" }}><div style={{ textAlign: 'center' }}>{sizeName}</div></span>
                    <span style={{ width: "30%" }}>{product?.data[0]?.product_name}</span>
                </a>
            </li> */}
            <li>
                <a href="#" style={{ width: "100%" }}>
                    <span style={{ width: "25%" }}> <div style={{ float: "right" }}><CurrencyFormatter amount={tongtien} /></div> </span>
                    <span style={{ width: "15%" }}><div style={{ textAlign: "center" }}>{data?.quantity}</div></span>
                    <span style={{ width: "20%" }}><div style={{ textAlign: 'center' }}>{colorName}</div></span>
                    <span style={{ width: "10%" }}><div style={{ textAlign: 'center' }}>{sizeName}</div></span>
                    <span style={{ width: "30%" }}> {product?.data[0]?.product_name?.slice(0, 20)}</span>
                </a>
            </li>
        </>
    )
}

export default OrderNowDetail