import { CheckOutlined, CloseOutlined, LoadingOutlined, UserOutlined } from "@ant-design/icons"
import { useGetOneUserQuery } from "../../../api/auth";
import { useEffect, useState } from "react";
import { useGetOneChekoutQuery } from "../../../api/checkout";
import { useConfirmOrderMutation, useSendEmailStatusOrderMutation, useUpdateCancellMutation } from "../../../api/order";
import { Button, Spin, message } from "antd";
import CurrencyFormatter from "../../../utils/FormatTotal";
import { useAddBillMutation } from "../../../api/bill";
import { useAddActionMutation } from "../../../api/actions";
import { Link } from "react-router-dom";
import { useSumKhoMutation } from "../../../api/product";
const OrderPlaceDetailDay = ({ data }: any) => {
    const [confirm, { isLoading: confirming }] = useConfirmOrderMutation()
    const { data: usser } = useGetOneUserQuery(data?.user_id)
    const ngay = data?.order_date?.substring(1, 11);
    const gio = data?.order_date?.substring(12, 20);
    const [payment, setpayment] = useState<any>()
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
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
    const [messageApi, contextHolder] = message.useMessage()
    const [addBill] = useAddBillMutation()
    const [addAction] = useAddActionMutation();
    const user = JSON.parse(localStorage.getItem('user')!)
    const [sendEmail] = useSendEmailStatusOrderMutation();
    const HandleConfirm = () => {
        const order_id = { id: data?.order_id }
        confirm(order_id)
            .unwrap()
            .then(async () => {
                sendEmail(order_id);
                const actionData = {
                    user_id: user?.user?.id,
                    // ID của người thực hiện hành động
                    action: "Xác nhận đơn hàng", // Loại hành động
                    old_data: "Đơn hàng chờ xác nhận",
                    new_data: "Đơn hàng đã xác nhận",
                };
                addAction(actionData)
                messageApi.open({
                    type: 'success',
                    content: 'Đã xác nhận đơn hàng !'
                })
                const datas = {
                    user_id: usser?.data?.id,
                    order_id: data?.order_id
                }

                addBill(datas)
                    .unwrap()
            })
    }
    const [cancell, { isLoading: cancelling }] = useUpdateCancellMutation()
    const [sumKho] = useSumKhoMutation()
    const HandleCancell = () => {
        const order_id = { id: data?.order_id }
        cancell(order_id)
            .unwrap()
            .then(async () => {
                sendEmail(order_id);
                const actionData = {
                    user_id: user?.user?.id,
                    // ID của người thực hiện hành động
                    action: "Xác nhận đơn hàng", // Loại hành động
                    old_data: "Đơn hàng chờ xác nhận",
                    new_data: "Đơn hàng đã xác nhận",
                };
                let quantityMap: Record<string, number> = {};
                checkout?.data?.product?.forEach((data: any) => {
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
                addAction(actionData)
                messageApi.open({
                    type: 'success',
                    content: 'Đã hủy đơn hàng thành công !'
                })
            })
    }
    return (
        <>
            {contextHolder}
            <tr >
                <td> <strong><UserOutlined style={{ marginRight: "15px", color: 'blue' }} /> {checkoutnames ? checkoutnames?.name : `${usser?.data?.user_lastname} ${usser?.data?.user_firstname}`}</strong></td>
                <td><CurrencyFormatter amount={data?.order_total} /></td>
                <td>{ngay} - {gio}</td>
                <td>
                    {payment}
                </td>
                <td>
                    <span >Chờ Xác Nhận{data?.user_id ? "" : " (OFF)"}</span>
                </td>
                <td>
                    {cancelling || confirming ? <Spin indicator={antIcon} /> : <><CheckOutlined style={{ color: 'green', fontWeight: 'bold', fontSize: '1.5em', marginRight: '15px' }} onClick={HandleConfirm} /> <CloseOutlined style={{ color: 'red', fontWeight: 'bold', fontSize: '1.5em' }} onClick={HandleCancell} /></>}
                    <span> </span>
                    <Link to={`/admin/order/${data?.order_id}/detail`}>
                        <Button>View</Button>
                    </Link>
                </td>
            </tr>
        </>
    )
}

export default OrderPlaceDetailDay