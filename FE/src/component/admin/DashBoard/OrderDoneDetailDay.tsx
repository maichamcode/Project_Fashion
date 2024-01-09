import React, { useEffect, useState } from 'react'
import { useGetOneUserQuery } from '../../../api/auth';
import { UserOutlined } from '@ant-design/icons';
import { useGetOneChekoutQuery } from '../../../api/checkout';
import { Button } from 'antd';
import CurrencyFormatter from '../../../utils/FormatTotal';
import { Link } from 'react-router-dom';

type Props = {}

const OrderDoneDetailDay = ({ data }: any) => {
    const { data: usser } = useGetOneUserQuery(data?.user_id)
    console.log(usser);
    const ngay = data?.order_date?.substring(1, 11);
    const gio = data?.order_date?.substring(12, 20);
    const [payment, setpayment] = useState<any>()
    useEffect(() => {
        if (data?.payment_status == 1) {
            setpayment('Thanh Toán Khi Nhận Hàng')
        } else if (data?.payment_status == 2) {
            setpayment('Thanh Toán VNPAY')
        }
    })
    const { data: checkout } = useGetOneChekoutQuery(data?.checkout_id)
    const [checkoutnames, setcheckoutnames] = useState<any>()
    useEffect(() => {
        try {
            const checkoutOffObject = JSON.parse(checkout?.data?.checkout_off || "");
            setcheckoutnames(checkoutOffObject);
        } catch (error) {
            console.error("Lỗi khi phân tích chuỗi JSON:", error);
        }
    }, [checkout?.data])
    return (
        <>
            <tr >
                <td> <strong><UserOutlined style={{ marginRight: "15px", color: 'blue' }} />{checkoutnames ? checkoutnames?.name : `${usser?.data?.user_lastname} ${usser?.data?.user_firstname}`}</strong></td>
                <td><CurrencyFormatter amount={data?.order_total}/></td>
                <td>{ngay} - {gio}</td>
                <td>
                    {payment}
                </td>
                <td>
                    <span >Đã Nhận Hàng</span>
                </td>
                <td>
                    <Link to={`/admin/order/${data?.order_id}/detail`}>
                    <Button>View</Button>
                    </Link>
                </td>
            </tr>
        </>
    )
}

export default OrderDoneDetailDay