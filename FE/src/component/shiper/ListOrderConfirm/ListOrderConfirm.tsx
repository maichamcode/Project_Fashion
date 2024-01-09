
import { useGetAllOrderQuery, useGetOrderConfirmQuery, useGetSearchOrderConfirmMutation } from "../../../api/order"
import { Button, Form, Select, Spin, message } from "antd"
import OrderConfirmDetail from "./OrderConfirmDetail"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"


const ListOrderConfirm = () => {
    const { data: orderconfirm, isLoading, refetch: refetchOrderConfirm } = useGetOrderConfirmQuery('')
    const [loadingInitial, setLoadingInitial] = useState(true);
    const { data: orders, refetch } = useGetAllOrderQuery('')
    useEffect(() => {
        // Khi component được render, đặt loading thành true.
        setLoadingInitial(true);

        refetchOrderConfirm().then(() => {
            // Sau khi query hoàn tất, đặt loading thành false.
            setLoadingInitial(false);
        });
    }, [refetchOrderConfirm]);
    const counts = {
        cancell: orders?.orders.filter((order: { status: number; }) => order.status == 0).length,
        confirm: orders?.orders.filter((order: { status: number; }) => order.status == 1).length,
        awaitshipper: orders?.orders.filter((order: { status: number; }) => order.status == 2).length,
        shipping: orders?.orders.filter((order: { status: number; }) => order.status == 3).length,
        shipsuccess: orders?.orders.filter((order: { status: number; }) => order.status == 4).length,
        received: orders?.orders.filter((order: { status: number; }) => order.status == 5).length,
        complete: orders?.orders.filter((order: { status: number; }) => order.status == 6).length,
        bomd: orders?.orders.filter((order: { status: number; }) => order.status == 7).length,
    };

    const [search, setSearch] = useState<any>(null);
    const [phone, setPhone] = useState();
    const [getSearch] = useGetSearchOrderConfirmMutation();
    const [form] = Form.useForm();
    const [order, setOrder] = useState();
    const [searchLoading, setSearchLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    // Function to handle the search
    const handleSearch = () => {
        setSearchLoading(true);
        if (order === "") {
            setSearch(null);
        } else if (order) {
            const searchData = {
                order_id: order,
            };
            getSearch(searchData)
                .unwrap()
                .then((data) => {
                    console.log("Search results:", data);
                    setSearch(data);
                    if (data.data && data.data.length > 0) {
                        // Hiển thị thông báo với loại "success" khi có dữ liệu
                        messageApi.open({
                            type: "success",
                            content: data.message,
                        });
                        // Xử lý đơn hàng ở đây nếu cần
                    } else {
                        // Hiển thị thông báo với loại "error" khi không có dữ liệu
                        console.log("Không tìm thấy đơn hàng");
                        messageApi.open({
                            type: "error",
                            content: "Không tìm thấy đơn hàng",
                        });
                    }
                })

                // .catch((error: any) => {
                //     console.log("Loi",error);

                //   });
                .finally(() => {
                    setSearchLoading(false); // Kết thúc tìm kiếm
                });

        }
    };
    const navigate = useNavigate()
    const handleChange = (value: any) => {
        if (value === 'confirm') {
            navigate('/admin/order/confirm');
        } else if (value === 'awaitshipper') {
            navigate('/admin/order/awaitshipper');
        } else if (value === 'received'){
            navigate('/admin/order/received');
        } else if (value === 'complete') {
            navigate('/admin/order/complete');
        } else if (value === 'cancell') {
            navigate('/admin/order/cancell');
        } else if (value === 'bomd') {
            navigate('/admin/order/bomd');
        } else if (value === 'all') {
            navigate('/admin/order');
        } else if (value === 'shipping') {
            navigate('/admin/order/shippings');
        }

    };
    return (
        <>
            {contextHolder}
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="card">
                    <h5 className="card-header" style={{ display: 'flex' }}>
                        <div className="input-group ">
                            <Form form={form} onFinish={handleSearch} style={{ width: "85%" }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm đơn hàng theo mã đơn hàng"
                                    onChange={(e: any) => setOrder(e?.target?.value)}
                                />
                            </Form>
                        </div>
                        <div style={{ width: '15%' }} >
                            <Select style={{ height: '40px', width: '100%' }} defaultValue="confirm"
                                options={[
                                    {
                                        value: 'all',
                                        label: `Tất cả`,
                                    },
                                    {
                                        value: 'confirm',
                                        label: `Đã đặt hàng (${counts?.confirm ? counts?.confirm : 0})`,
                                    },
                                    {
                                        value: 'awaitshipper',
                                        label: `Đã xác nhận (${counts?.awaitshipper ? counts?.awaitshipper : 0})`,
                                    },
                                    {
                                        value: 'shipping',
                                        label: `Vận chuyển (${counts?.shipping ? counts?.shipping : 0})`,
                                    },
                                    {
                                        value: 'received',
                                        label: `Đã nhận hàng  (${counts?.received ? counts?.received : 0})`,
                                    },
                                   
                                    {
                                        value: 'complete',
                                        label: `Hoàn tất  (${counts?.complete ? counts?.complete : 0})`,
                                    },
                                    {
                                        value: 'cancell',
                                        label: `Đã huỷ hàng  (${counts?.cancell ? counts?.cancell : 0})`,
                                    },

                                    {
                                        value: 'bomd',
                                        label: `Không nhận  (${counts?.bomd ? counts?.bomd : 0})`,
                                    },
                                ]} onChange={handleChange}>
                            </Select>
                        </div>
                    </h5>
                    <div className="table-responsive text-nowrap">
                        <table className="table">
                            <thead className="table-light" style={{ width: "100%" }}>
                                <tr>
                                    <th style={{ width: '11.1%', fontSize: '10px' }}>Tên Khách Hàng</th>
                                    <th style={{ width: '11.1%', fontSize: '10px' }}>Mã đơn hàng</th>
                                    <th style={{ width: '11.1%', fontSize: '10px' }}>Số điện thoại</th>
                                    <th style={{ width: '11.1%', fontSize: '10px' }}>Số tiền</th>
                                    <th style={{ width: '11.1%', fontSize: '10px' }}>Thời gian đặt</th>
                                    <th style={{ width: '11.1%', fontSize: '10px' }}>Phương thức thanh toán</th>
                                    <th style={{ width: '11.1%', fontSize: '10px' }}>Trạng thái đơn hàng</th>
                                    <th style={{ width: '11.1%', fontSize: '10px' }}>Hành động</th>
                                    <th style={{ width: '11.1%', fontSize: '12px' }}>Chi tiết</th>
                                </tr>
                            </thead>

                            <tbody className="table-border-bottom-0" style={{ width: "100%" }}>
                                {search ? (
                                    search?.data?.map((order: any) => (
                                        <OrderConfirmDetail key={order.order_id} data={order} />
                                    ))
                                ) : (
                                    isLoading ? (
                                        <div style={{ minHeight: "70px", marginLeft: "300%", marginTop: "10px" }}>
                                            <Spin tip="Loading..." size="large">
                                            </Spin>
                                        </div>
                                    ) : (
                                        (orderconfirm?.orders || []).map((data: any) => <OrderConfirmDetail data={data} />)
                                    )
                                )}

                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ListOrderConfirm