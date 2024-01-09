import React, { useEffect, useState } from 'react'
import { useGetColorQuery } from '../../../api/color';
import { useGetOneProductQuery } from '../../../api/product';
import { useGetSaleQuery } from '../../../api/sale';
import { useGetSizeQuery } from '../../../api/size';
import CurrencyFormatter from '../../../utils/FormatTotal';
import { useGetOneOrderQuery } from '../../../api/order';
import { Link, useParams } from 'react-router-dom';


const DetailOneOrderAdmin = ({ data }: any) => {
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
    const { id } = useParams()
    const { data: order } = useGetOneOrderQuery(id)
    const oldPrice = product?.data[0]?.product_price;
    useEffect(() => {
        if (total) {
            settotals(data?.quantity * total)
        } else {
            settotals(data?.quantity * product?.data[0]?.product_price)
        }
    }, [product?.data[0]?.product_price])
    return (
        <>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-2">
                        <img src={imageArray ? imageArray[0] : ""} alt="" width="65" className="img-fluid" />
                    </div>
                    <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                        <p className="text-muted mb-0"><a href="#" className="text-reset">{product?.data[0] ? product?.data[0]?.product_name : ""}</a></p>
                    </div>
                    <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                        <p className="text-muted mb-0 small">{colorName ? colorName : ""}</p>
                    </div>
                    <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                        <p className="text-muted mb-0 small">{sizeName ? sizeName : ""}</p>
                    </div>
                    <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                        <p className="text-muted mb-0 small">x {data?.quantity}</p>
                    </div>

                    <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                        <p className="text-muted mb-0 small">
                            {total ? (
                                <div style={{ display: 'flex' }}>
                                    <del style={{ marginRight: '10px' }}>
                                        <CurrencyFormatter amount={oldPrice} />
                                    </del>
                                    <span>{" "}</span>
                                    <CurrencyFormatter amount={totals} />
                                </div>
                            ) : (
                                <CurrencyFormatter amount={totals} />
                            )}
                        </p>
                    </div>

                </div>
            </div>
        </>
    )
}



export default DetailOneOrderAdmin