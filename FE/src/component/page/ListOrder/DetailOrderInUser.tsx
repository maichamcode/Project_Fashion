import { useEffect, useState } from "react";
import { useGetColorQuery } from "../../../api/color";
import { useGetOneProductQuery } from "../../../api/product";
import { useGetSaleQuery } from "../../../api/sale";
import { useGetSizeQuery } from "../../../api/size";
import CurrencyFormatter from "../../../utils/FormatTotal";


const DetailOrderInUser = ({ data }: any) => {
    console.log(data?.size);
    const { data: product } = useGetOneProductQuery(data?.product_id)
    const imageArray = product?.data[0]?.image[0]?.split(",");
    const { data: size } = useGetSizeQuery('')
    const { data: color } = useGetColorQuery('')
    const sizeName = size?.data?.find((data1: any) => data1?.size_id == data?.size)?.size_name
    const colorName = color?.data?.find((data1: any) => data1?.color_id == data?.color)?.color_name
    const { data: sale } = useGetSaleQuery('')
    const saleName = sale?.data?.find((id: any) => id?.sale_id == product?.data[0]?.sale_id)?.sale_distcount
    const totalSale = (product?.data[0]?.product_price * saleName) / 100
    const total = (product?.data[0]?.product_price - totalSale)
    const [totals, settotals] = useState<any>()
    useEffect(() => {
        if (total) {
            settotals(data?.quantity * total)
        } else {
            settotals(data?.quantity * product?.data[0]?.product_price)
        }
    }, [product?.data[0]?.product_price])
    return (
        <>
            <tr>
                <td>
                    <div className="d-flex mb-2">
                        <div className="flex-shrink-0">
                            <img src={imageArray ? imageArray[0] : ""} alt="" width="65" className="img-fluid" />
                        </div>
                        <div className="flex-lg-grow-1 ms-3">
                            <h6 className="small mb-0"><a href="#" className="text-reset">{product?.data[0] ? product?.data[0]?.product_name : ""}</a></h6>
                            <div className="small">
                                <span className="d-block">Màu sắc: {colorName ? colorName : ""} </span>
                                <span className="d-block">Kích cỡ: {sizeName ? sizeName : ""} </span>
                            </div>
                        </div>
                    </div>
                </td>
                <td className="text-end">x {data?.quantity}</td>
                <td className="text-end"><CurrencyFormatter amount={totals}/></td>
            </tr>
        </>
    )
}

export default DetailOrderInUser