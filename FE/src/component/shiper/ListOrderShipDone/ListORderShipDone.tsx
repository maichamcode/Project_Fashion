
import { useGetAllOrderQuery, useGetOrderShipingQuery, useGetSearchOrderShipDoneMutation, useGetSearchOrderShippingMutation } from "../../../api/order"
import { Button, Form, Spin, message } from "antd"
import OrderShipDoneDetail from "./OrderShipDoneDetail"
import { useEffect, useState } from "react"
import io from "socket.io-client";
import { Link } from "react-router-dom";
const socket = io("http://localhost:8080");


const ListOrderShipDone = () => {
    const { data: ordershiping, isLoading, refetch } = useGetOrderShipingQuery('')
    const { data: orders } = useGetAllOrderQuery('')
    const counts = {
        cancell: orders?.orders.filter((order: { status: number; }) => order.status == 7).length,
        confirm: orders?.orders.filter((order: { status: number; }) => order.status == 1).length,
        awaitshipper: orders?.orders.filter((order: { status: number; }) => order.status == 2).length,
        shipping: orders?.orders.filter((order: { status: number; }) => order.status == 3).length,
        shipsuccess: orders?.orders.filter((order: { status: number; }) => order.status == 6 || order.status == 5).length,
        received: orders?.orders.filter((order: { status: number; }) => order.status == 5).length,
        complete: orders?.orders.filter((order: { status: number; }) => order.status == 6).length,
    };
    useEffect(() => {
        socket.on("shiping", (data: any) => {
            messageApi.open({
                type: "success",
                content: data.message
            });
            refetch();
        });
        return () => {
            socket.disconnect();
        };
    }, [refetch]);

    const [search, setSearch] = useState<any>(null);
    const [getSearch] = useGetSearchOrderShippingMutation();
    const [form] = Form.useForm();
    const [order, setOrder] = useState();
    const [messageApi, contextHolder] = message.useMessage();
    // Function to handle the search
    const handleSearch = () => {
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

                .catch((error: any) => {
                    console.log("Loi", error);

                });


        }
    };
    return (
        <>
            {contextHolder}
            <h5 className="card-header" style={{ paddingTop: 40 }}>
                <div style={{ textAlign: "center" }}>
                    <Button type="primary" style={{ marginLeft: "15px" }}><a href={`awaitshipper`}>Đơn hàng mới ({counts.awaitshipper})</a></Button>
                    <Button type="primary" style={{ marginLeft: "15px" }}><a href={`shipping`}>Đang giao hàng ({counts.shipping})</a></Button>
                    <Button type="primary" style={{ marginLeft: "15px" }}><a href={`shipsuccess`}>Đã giao hàng ({counts.shipsuccess})</a></Button>
                    <Button type="primary" danger style={{ marginLeft: "15px" }}><a href={`bomd`}>Không nhận hàng ({counts.cancell})</a></Button></div></h5>
                   
            <div className="input-group mb-3" style={{ width: '95%', margin: '0 auto' }}>
                <Form form={form} onFinish={handleSearch} style={{ width: "96%", marginLeft: "25px", marginTop: "2em", marginBottom: "1em" }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm đơn hàng theo mã đơn hàng"
                        onChange={(e: any) => setOrder(e?.target?.value)}
                    />
                </Form>
            </div>
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="card">
                  
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
                                    <th style={{ width: '22.1%', fontSize: '10px' }}>Hành động</th>
                                    <th style={{ width: '11.1%', fontSize: '12px' }}>Chi tiết</th>
                                </tr>
                            </thead>

                            <tbody className="table-border-bottom-0" style={{ width: "100%" }}>
                                {search ? (
                                    search?.data?.map((order: any) => (
                                        <OrderShipDoneDetail key={order.order_id} data={order} />
                                    ))
                                ) : (
                                    isLoading ? (
                                        <div style={{ minHeight: "70px", marginLeft: "300%", marginTop: "10px" }}>
                                            <Spin tip="Loading..." size="large">
                                            </Spin>
                                        </div>
                                    ) : (
                                        (ordershiping?.orders || []).map((data: any) => <OrderShipDoneDetail data={data} />)
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

export default ListOrderShipDone