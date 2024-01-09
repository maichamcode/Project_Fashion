
import { Button, Form, Spin, message } from "antd";
import { useState } from "react";
import { useGetAllOrderQuery, useGetOrderBomdQuery, useGetSearchOrderCancell1Mutation, useGetSearchOrderCancellMutation } from "../../../api/order";
import OrderCancellDetail from "../ListOrderCancell/OrderCancellDetail";
import ListOrderBomdDetail from "./ListOrderBomdDetail";


const ListOrderBomd = () => {
    const { data: orderconfirm, isLoading } = useGetOrderBomdQuery('')
    const { data: orders, refetch } = useGetAllOrderQuery('')
    const counts = {
        cancell: orders?.orders.filter((order: { status: number; }) => order.status == 7).length,
        confirm: orders?.orders.filter((order: { status: number; }) => order.status == 1).length,
        awaitshipper: orders?.orders.filter((order: { status: number; }) => order.status == 2).length,
        shipping: orders?.orders.filter((order: { status: number; }) => order.status == 3).length,
        shipsuccess: orders?.orders.filter((order: { status: number; }) => order.status == 6 || order.status == 5).length,
        received: orders?.orders.filter((order: { status: number; }) => order.status == 5).length,
        complete: orders?.orders.filter((order: { status: number; }) => order.status == 6).length,
    };
    const [search, setSearch] = useState<any>(null);
    const [getSearch] = useGetSearchOrderCancell1Mutation();
    const [form] = Form.useForm();
    const [order, setOrder] = useState();
    const [searchLoading, setSearchLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
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
                        messageApi.open({
                            type: "success",
                            content: data.message,
                        });
                    } else {
                        console.log("Không tìm thấy đơn hàng");
                        messageApi.open({
                            type: "error",
                            content: "Không tìm thấy đơn hàng",
                        });
                    }
                })
                .finally(() => {
                    setSearchLoading(false);
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
                </Form>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    ``
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
                                    <th style={{ width: '11.1%', fontSize: '12px' }}>Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody className="table-border-bottom-0" style={{ width: "100%" }}>
                                {search ? (
                                    search?.data?.map((order: any) => (
                                        <OrderCancellDetail key={order.order_id} data={order} />
                                    ))
                                ) : (
                                    isLoading ? (
                                        <div style={{ minHeight: "70px", marginLeft: "300%", marginTop: "10px" }}>
                                            <Spin tip="Loading..." size="large">
                                            </Spin>
                                        </div>
                                    ) : (
                                        (orderconfirm?.orders || []).map((data: any) => <ListOrderBomdDetail data={data} />)
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

export default ListOrderBomd