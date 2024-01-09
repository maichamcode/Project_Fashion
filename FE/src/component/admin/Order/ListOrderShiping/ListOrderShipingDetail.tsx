import {
    CheckOutlined,
    CloseOutlined,
    EyeOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useGetOneUserQuery } from "../../../../api/auth";
import { Link, useParams } from "react-router-dom";
import { useConfirmOrderMutation, useGetOneOrderQuery, useSendEmailStatusOrderMutation, useUpdateCancellMutation } from "../../../../api/order";
import { message } from "antd";
import { useAddActionMutation } from "../../../../api/actions";
import { useAddBillMutation } from "../../../../api/bill";
import { useGetOneChekoutQuery } from "../../../../api/checkout";
import CurrencyFormatter from "../../../../utils/FormatTotal";


const AdminOrderShipingDetail = ({ data }: any) => {
    const discountAmount: any = localStorage.getItem("discountAmount");
    const ngay = data?.order_date?.substring(1, 11);
    const gio = data?.order_date?.substring(12, 20);
    const { data: user } = useGetOneUserQuery(data?.user_id);
    const [payment, setpayment] = useState<any>();
    const users = JSON.parse(localStorage.getItem("user")!);
    const orderId = data?.order_id;
    useEffect(() => {
        if (data?.payment_status == 1) {
            setpayment("Thanh Toán Khi Nhận Hàng");
        } else if (data?.payment_status == 2) {
            setpayment("Thanh Toán Qua VNPAY");
        }
    }, []);
    const [status, setstatus] = useState<any>();
    const [css, setcss] = useState<any>();
    const [check, setcheck] = useState(false);
    useEffect(() => {
        // Update status and css based on data.status
        if (data?.status == 1) {
            setstatus("Đã Đặt Hàng");
            setcss("primary");
            setcheck(true);
        } else if (data?.status == 2) {
            setstatus("Đã Xác Nhận");
            setcss("info");
            setcheck(false);
        } else if (data?.status == 3) {
            setstatus("Đang Giao Hàng");
            setcss("success");
            setcheck(false);
        } else if (data?.status == 4) {
            setstatus("Đã Giao Hàng");
            setcss("success");
            setcheck(false);
        } else if (data?.status == 5) {
            setstatus("Đã Nhận Hàng");
            setcss("success");
            setcheck(false);
        } else if (data?.status == 6) {
            setstatus("Đã Hoàn Thành");
            setcss("success");
            setcheck(false);
        } else {
            setstatus("Đã Hủy Hàng");
            setcss("danger");
            setcheck(false);
        }
    }, [data?.status]);

    const { id } = useParams();
    const [confirm] = useConfirmOrderMutation();
    const [cancell] = useUpdateCancellMutation();
    const [messageApi, contextHolder] = message.useMessage();
    const { data: order } = useGetOneOrderQuery("");

    const [huy, sethuy] = useState<any>(false);
    const [nhan, setnhan] = useState<any>(false);
    const [dulieu, setdulieu] = useState<any>();
    const [addAction] = useAddActionMutation();
    let icons: any;
    const [sendEmail] = useSendEmailStatusOrderMutation();
    const [addBill] = useAddBillMutation();
    const HandleSubmit = () => {
        const order_id = { id: data?.order_id };
        confirm(order_id)
            .unwrap()
            .then(() => {
                const datas = {
                    user_id: users?.user?.id,
                    order_id: data?.order_id,
                };

                addBill(datas).unwrap();
                sendEmail(order_id);
                const actionData = {
                    user_id: users?.user?.id,
                    // ID của người thực hiện hành động
                    action: "Xác nhận đơn hàng", // Loại hành động
                    old_data: "Đơn hàng chờ xác nhận",
                    new_data: "Đơn hàng đã xác nhận",
                };
                addAction(actionData)
                    .unwrap()
                    .then(() => {
                        messageApi.open({
                            type: "success",
                            content: "Đã xác nhận đơn hàng này!",
                        });
                    });
            })
            .catch((error: any) => {
                messageApi.open({
                    type: "error",
                    content: error?.data?.message,
                });
            });
    };
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
                .catch((error: any) => {
                    messageApi.open({
                        type: "error",
                        content: error?.data?.message,
                    });
                });
        }
    };
    const { data: checkout } = useGetOneChekoutQuery(data?.checkout_id);
    const [checkoutnames, setcheckoutnames] = useState<any>();

    useEffect(() => {
        try {
            const checkoutOffObject = JSON.parse(checkout?.data?.checkout_off || "");
            setcheckoutnames(checkoutOffObject);
        } catch (error) {
            console.error("Lỗi khi phân tích chuỗi JSON:", error);
        }
    }, [checkout?.data]);

    return (
        <>
            {contextHolder}
            <tr>
                <td style={{ width: "11.1%", fontSize: "13px" }}>
                    <strong>
                        <UserOutlined style={{ marginRight: "15px", color: "blue" }} />
                        {checkoutnames
                            ? checkoutnames?.name
                            : `${user?.data?.user_lastname} ${user?.data?.user_firstname}`}
                    </strong>
                </td>
                <td style={{ width: "11.1%", fontSize: "13px" }}>#{data?.order_id}</td>
                <td style={{ width: "11.1%", fontSize: "13px" }}>
                    {checkoutnames ? checkoutnames?.phone : `${user?.data?.user_phone}`}
                </td>

                <td style={{ width: "11.1%", fontSize: "13px" }}>
                    <CurrencyFormatter amount={data?.order_total - discountAmount} />
                </td>
                <td style={{ width: "11.1%", fontSize: "13px" }}>
                    {ngay} - {gio}
                </td>
                <td style={{ width: "11.1%", fontSize: "13px" }}>{payment}</td>
                <td style={{ width: "11.1%", fontSize: "13px" }}>
                    <span className={`badge bg-label-${css} me-1`}>{status}</span>
                </td>

                <td style={{ width: "11.1%", fontSize: "13px" }}>
                    <Link to={`/admin/order/${data?.order_id}/detail`}>
                        <EyeOutlined
                            style={{ color: "blue", fontWeight: "bold", fontSize: "1.5em" }}
                        />
                    </Link>
                </td>
            </tr>
        </>
    );
};

export default AdminOrderShipingDetail;
