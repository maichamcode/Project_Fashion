import { CheckOutlined, CloseOutlined, EyeOutlined, LoadingOutlined, UserOutlined } from "@ant-design/icons";
import CurrencyFormatter from "../../../utils/FormatTotal";
import { Link } from "react-router-dom";
import { useGetOneChekoutQuery } from "../../../api/checkout";
import { useEffect, useState } from "react";
import { useGetOneUserQuery } from "../../../api/auth";
import { Button, Spin, message } from "antd";
import { useConfirmOrderMutation, useSendEmailStatusOrderMutation, useUpdateCancellMutation, useUpdateOrderShipMutation } from "../../../api/order";
import { useAddActionMutation } from "../../../api/actions";


const OrderConfirmDetail = ({ data }: any) => {
    const users = JSON.parse(localStorage.getItem("user")!);
    const discountAmount: any = localStorage.getItem("discountAmount");
    const { data: checkout } = useGetOneChekoutQuery(data?.checkout_id)
    console.log(checkout);

    const [checkoutnames, setcheckoutnames] = useState<any>()
    console.log(checkoutnames);
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
    useEffect(() => {
        if (data?.payment_status == 1) {
            setpayment('Thanh Toán Khi Nhận Hàng')
        } else if (data?.payment_status == 2) {
            setpayment('Thanh Toán Qua VNPAY')
        }
    }, [])
    const [status, setstatus] = useState<any>()
    const [css, setcss] = useState<any>()
    const [check, setcheck] = useState(false);
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
    const [sendEmail] = useSendEmailStatusOrderMutation()
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
    const [orderShip, { isLoading: shiping }] = useConfirmOrderMutation()
    const [cancell] = useUpdateCancellMutation();
    const [addAction] = useAddActionMutation();
    const [messageApi, contextHolder] = message.useMessage()
    const HandleShip = () => {
        const order_id = { id: data?.order_id }
        orderShip(order_id)
            .unwrap()
            .then(() => {
                sendEmail(order_id)
                messageApi.open({
                    type: 'success',
                    content: 'Đã xác nhận đơn hàng này!'
                })
            })
    }
    const [cancelReason, setCancelReason] = useState<string | null>(null);
    const CancellSubmit = () => {
        const inputReason = window.prompt("Lý do hủy đơn hàng:");
        if (inputReason !== null) {
            setCancelReason(inputReason);
            const order_id = { id: data?.order_id, text: inputReason };
            cancell(order_id)
                .unwrap()
                .then(() => {
                    sendEmail(order_id);
                    const actionData = {
                        user_id: users?.user?.id,
                        // ID của người thực hiện hành động
                        action: "Hủy đơn hàng", // Loại hành động
                        old_data: "Đơn hàng chờ xác nhận",
                        new_data: "Đã hủy đơn hàng",
                    };
                    addAction(actionData)
                        .unwrap()
                        .then(() => {
                            messageApi.open({
                                type: "success",
                                content: "Đã huỷ đơn hàng này!",
                            });
                        });

                    // Cập nhật trạng thái và biến liên quan ở đây
                    setstatus("Đã Hủy Hàng");
                    setcss("danger");
                    setcheck(false);
                })
                .catch((error) => {
                    messageApi.open({
                        type: "error",
                        content: error?.data?.message,
                    });
                });
        }
    };
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
                <td>
                    <CheckOutlined
                        style={{
                            color: "green",
                            fontWeight: "bold",
                            fontSize: "1.5em",
                            marginRight: "15px",
                        }}
                        onClick={HandleShip}
                    />
                    <CloseOutlined
                        style={{ color: "red", fontWeight: "bold", fontSize: "1.5em" }}
                        onClick={CancellSubmit}
                    />
                </td>
                <td>
                    <Link to={`/admin/order/${data?.order_id}/detail`}>
                        <EyeOutlined style={{ color: 'blue', fontWeight: 'bold', fontSize: '1.5em' }} />
                    </Link>
                </td>
            </tr>
        </>
    )
}

export default OrderConfirmDetail