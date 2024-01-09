import { CheckOutlined, CloseOutlined, EyeOutlined, LoadingOutlined, UserOutlined } from "@ant-design/icons";
import CurrencyFormatter from "../../../utils/FormatTotal";
import { Link } from "react-router-dom";
import { useGetOneChekoutQuery } from "../../../api/checkout";
import { useEffect, useState } from "react";
import { useGetOneUserQuery } from "../../../api/auth";
import { Button, Spin, message } from "antd";
import { useSendEmailStatusOrderMutation, useUpdateOrderBomdMutation, useUpdateOrderShipDoneMutation } from "../../../api/order";
import { useAddActionMutation } from "../../../api/actions";
import { pause } from "../../../utils/pause";


const OrderShipDoneDetail = ({ data }: any) => {
    const discountAmount: any = localStorage.getItem("discountAmount");
    const { data: checkout } = useGetOneChekoutQuery(data?.checkout_id)
    const [sendEmail] = useSendEmailStatusOrderMutation()
    const [checkoutnames, setcheckoutnames] = useState<any>()
    const { data: user } = useGetOneUserQuery(data?.user_id)
    useEffect(() => {
        try {
            const checkoutOffObject = JSON.parse(checkout?.data?.checkout_off || "");
            setcheckoutnames(checkoutOffObject);
        } catch (error) {
            console.error("Lỗi khi phân tích chuỗi JSON:", error);
        }
    }, [checkout?.data])
    const ngay = data?.order_date?.substring(1, 11);
    const gio = data?.order_date?.substring(12, 20);
    const [payment, setpayment] = useState<any>()
    const [check, setcheck] = useState(false)
    const users = JSON.parse(localStorage.getItem('user')!)
    const [addAction] = useAddActionMutation()
    useEffect(() => {
        if (data?.payment_status == 1) {
            setpayment('Thanh Toán Khi Nhận Hàng')
        } else if (data?.payment_status == 2) {
            setpayment('Thanh Toán Qua VNPAY')
        }
    }, [])
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
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
    const [orderShipDone, { isLoading: shiping }] = useUpdateOrderShipDoneMutation()
    const [orderShipBomd, { isLoading: bomding }] = useUpdateOrderBomdMutation()
    const [messageApi, contextHolder] = message.useMessage()
    const HandleShip = async () => {
        const order_id = { id: data?.order_id }
        orderShipDone(order_id)
            .unwrap()
            .then(() => {

                messageApi.open({
                    type: 'success',
                    content: 'Đã giao thành công đơn hàng này!'
                });

                setcss('success');
                setcheck(false);
            })
        await pause(2000)
        sendEmail(order_id)
            .catch((error: any) => {
                messageApi.open({
                    type: "error",
                    content: error?.data?.message,
                });
            });
    }
    const HandleShipBomd = () => {
        const order_id = { id: data?.order_id }
        orderShipBomd(order_id)
            .unwrap()
            .then(() => {
                sendEmail(order_id)
                setstatus('Không nhận hàng');
                setcss('error');
                setcheck(false);
            })
            .catch((error: any) => {
                messageApi.open({
                    type: "error",
                    content: error?.data?.message,
                });
            });
    }

    return (
        <>
            {contextHolder}
            <tr >
                <td style={{ width: '11.1%', fontSize: '13px' }}>
                    <strong>
                        <UserOutlined style={{ marginRight: "15px", color: "blue" }} />
                        {checkoutnames
                            ? checkoutnames?.name
                            : `${user?.data?.user_lastname} ${user?.data?.user_firstname}`}
                    </strong>
                </td>
                <td style={{ width: '11.1%', fontSize: '13px' }}>
                    #{data?.order_id}
                </td>
                <td style={{ width: '11.1%', fontSize: '13px' }}>
                    {checkoutnames ? checkoutnames?.phone : `${user?.data?.user_phone}`}
                </td>

                <td style={{ width: '11.1%', fontSize: '13px' }}>
                    <CurrencyFormatter amount={data?.order_total - discountAmount} />
                </td>
                <td style={{ width: '11.1%', fontSize: '13px' }}>
                    {ngay} - {gio}
                </td>
                <td style={{ width: '11.1%', fontSize: '13px' }}>{payment}</td>
                <td style={{ width: '11.1%', fontSize: '13px' }}>
                    <span className={`badge bg-label-${css} me-1`}>{status}</span>
                </td>
                <td style={{ width: '150%' }}>
                    {shiping || bomding ? <Spin indicator={antIcon} /> : <> <Button onClick={HandleShip} style={{ width: '40%' }}>Thành Công</Button> <Button onClick={HandleShipBomd} style={{ width: '40%', border: '1px solid red' }}>Hoàn trả</Button></>}
                </td>
                <td>
                    <Link to={`/shiper/${data?.order_id}/detail`}>
                        <EyeOutlined style={{ color: 'blue', fontWeight: 'bold', fontSize: '1.5em' }} />
                    </Link>
                </td>
            </tr>
        </>
    )
}

export default OrderShipDoneDetail