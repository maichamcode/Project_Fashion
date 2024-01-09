import { Button, Form, Skeleton, message, Spin, Select } from "antd";

import io from 'socket.io-client';
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetAllOrderQuery, useGetOrderBomdQuery, useGetOrderDeleveredQuery, useGetOrderPendingAllQuery, useGetSearchOrderCancell1Mutation, useGetSearchOrderMutation } from "../../../../api/order";
import AdminOrderDetail from "../AdminOrderDetail";
import AdminOrderShipDetail from "../ListOrderShip/ListOrderShipDetail";
import ListOrderBomdAdminDetail from "./ListOrderBomdAdminDetail";

const socket = io('http://localhost:8080');

const ListOrderBomdAdmin = () => {
    const [search, setSearch] = useState<any>(null);
    const [order, setOrder] = useState();
    const [getSearch] = useGetSearchOrderCancell1Mutation();
    const { data: orders, isLoading, refetch } = useGetOrderBomdQuery('');
    const { data: orderss } = useGetAllOrderQuery('')
    const [form] = Form.useForm();
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
                .then((data: any) => {
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
    console.log(orders?.orders);

    const counts = {
        cancell: orderss?.orders.filter((order: { status: number; }) => order.status == 0).length,
        confirm: orderss?.orders.filter((order: { status: number; }) => order.status == 1).length,
        awaitshipper: orderss?.orders.filter((order: { status: number; }) => order.status == 2).length,
        shipping: orderss?.orders.filter((order: { status: number; }) => order.status == 3).length,
        shipsuccess: orders?.orders.filter((order: { status: number; }) => order.status == 4).length,
        received: orders?.orders.filter((order: { status: number; }) => order.status == 5).length,
        complete: orderss?.orders.filter((order: { status: number; }) => order.status == 6).length,
        bomd: orderss?.orders.filter((order: { status: number; }) => order.status == 7).length,
    };
    useEffect(() => {
        socket.on('addorder', (data) => {
            alert(data.message);
            refetch();
        });
        socket.on('cancell', (data) => {
            alert(data.message);
            refetch();
        });
        return () => {
            socket.disconnect();
        };
    }, [refetch]);
    const navigate = useNavigate()
    const handleChange = (value: any) => {
        if (value === 'confirm') {
            navigate('/admin/order/confirm');
        } else if (value === 'awaitshipper') {
            navigate('/admin/order/awaitshipper');
        } else if (value === 'received') {
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

            <div className="container-xxl flex-grow-1 container-p-y" >
                <div className="card" >
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
                            <Select style={{ height: '40px', width: '100%' }} defaultValue="bomd"
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
                                        label: `Vận chuyển (${counts?.awaitshipper ? counts?.shipping : 0})`,
                                    },
                                    {
                                        value: 'received',
                                        label: `Đã nhận hàng  (${counts?.shipsuccess ? counts?.shipsuccess : 0})`,
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
                        {searchLoading ? (
                            <Spin tip="Loading..." size="large">
                                <div style={{ minHeight: "300px" }} />
                            </Spin>
                        ) : (
                            <table className="table">

                                <thead className="table-light" style={{ width: "100%" }}>
                                    <tr>
                                        <th style={{ width: '11.1%', fontSize: '10px' }}>Tên Khách Hàng</th>
                                        <th style={{ width: '10.1%', fontSize: '10px' }}>Mã đơn hàng</th>
                                        <th style={{ width: '11.1%', fontSize: '10px' }}>Số điện thoại</th>
                                        <th style={{ width: '11.1%', fontSize: '10px' }}>Số tiền</th>
                                        <th style={{ width: '11.1%', fontSize: '10px' }}>Thời gian đặt</th>
                                        <th style={{ width: '11.1%', fontSize: '10px' }}>Phương thức thanh toán</th>
                                        <th style={{ width: '11.1%', fontSize: '10px' }}>Trạng thái đơn hàng</th>
                                        <th style={{ width: '12.1%', fontSize: '12px' }}>Chi tiết</th>
                                    </tr>
                                </thead>

                                <tbody className="table-border-bottom-0" style={{ width: "100%" }}>
                                    {search ? ( // Render search results if search is not null
                                        search?.data?.map((order: any) => (
                                            <AdminOrderShipDetail key={order.order_id} data={order} />
                                        ))
                                    ) : (
                                        // Render original order list if search is null
                                        isLoading ? <Skeleton /> : (
                                            orders?.orders.map((order: any) => (
                                                <ListOrderBomdAdminDetail key={order.order_id} data={order} />
                                            ))
                                        )
                                    )}
                                </tbody>

                            </table>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
export default ListOrderBomdAdmin