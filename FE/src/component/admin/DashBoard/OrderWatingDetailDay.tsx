import { useEffect, useState } from "react";
import { useGetOneUserQuery } from "../../../api/auth";
import { UserOutlined } from "@ant-design/icons";
import { useGetOneChekoutQuery } from "../../../api/checkout";
import { Button, message } from "antd";
import { useSendEmailStatusOrderMutation, useUpdateOrderDoneMutation, useUpdateOrderShipMutation } from "../../../api/order";
import { pause } from "../../../utils/pause";
import CurrencyFormatter from "../../../utils/FormatTotal";
import { useAddActionMutation } from "../../../api/actions";
import { Link } from "react-router-dom";


const OrderWatingDetailDay = ({ data }: any) => {
    console.log(data);
    const { data: usser } = useGetOneUserQuery(data?.user_id)
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
    const [doneorder] = useUpdateOrderDoneMutation()
    const [check, setcheck] = useState(false)
    const [messageApi, contextHolder] = message.useMessage()
    const [sendEmail] = useSendEmailStatusOrderMutation();
    const user = JSON.parse(localStorage.getItem('user')!)
    const [addAction] = useAddActionMutation();
    const [orderShip, { isLoading: shiping }] = useUpdateOrderShipMutation()
    const HandleDoneOrder = () => {
        setcheck(true)
        const order_id = { id: data?.order_id }
        orderShip(order_id)
            .unwrap()
            .then(async () => {
                sendEmail(order_id)
                const actionData = {
                    user_id: user?.user?.id,
                    action: "Đang giao hàng",
                    old_data: "Đã xác nhận",
                    new_data: "Đang giao hàng"
                };
                addAction(actionData)
                messageApi.open({
                    type: 'success',
                    content: 'Đơn hàng đã bàn giao cho đơn vị vận chuyển!'
                })
                await pause(1500)
                setcheck(false)
            })
    }
    return (
        <>
            {contextHolder}
            <tr >
                <td> <strong><UserOutlined style={{ marginRight: "15px", color: 'blue' }} />{checkoutnames ? checkoutnames?.name : `${usser?.data?.user_lastname} ${usser?.data?.user_firstname}`}</strong></td>
                <td><CurrencyFormatter amount={data?.order_total} /></td>
                <td>{ngay} - {gio}</td>
                <td>
                    {payment}
                </td>
                <td>
                    <span >Chờ Nhận Hàng{data?.user_id ? "" : " (OFF)"}</span>
                </td>
                <td>
                   <Button onClick={HandleDoneOrder} disabled={check}>
                        Vận Chuyển
                    </Button>
                    <span> </span>
                    <Link to={`/admin/order/${data?.order_id}/detail`}>
                        <Button>View</Button>
                    </Link>
                </td>
            </tr>
        </>
    )
}

export default OrderWatingDetailDay