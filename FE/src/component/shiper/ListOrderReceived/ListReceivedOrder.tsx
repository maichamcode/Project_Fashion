
import { Button, Form, Spin, message } from "antd"
import OrderReceivedDetail from "./OrderReceivedDetail"
import { useGetAllOrderQuery, useGetOrderReceivedQuery, useGetSearchOrderDoneMutation } from "../../../api/order"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"


const ListReceivedOrder = () => {
    const { data: orderReceived, isLoading, refetch } = useGetOrderReceivedQuery('')
    const [loadingInitial, setLoadingInitial] = useState(true);
    const { data: orders } = useGetAllOrderQuery('')
    useEffect(() => {
        // Khi component được render, đặt loading thành true.
        setLoadingInitial(true);

        refetch().then(() => {
            // Sau khi query hoàn tất, đặt loading thành false.
            setLoadingInitial(false);
        });
    }, [refetch]);
    const counts = {
        cancell: orders?.orders.filter((order: { status: number; }) => order.status == 0).length,
        confirm: orders?.orders.filter((order: { status: number; }) => order.status == 1).length,
        awaitshipper: orders?.orders.filter((order: { status: number; }) => order.status == 2).length,
        shipping: orders?.orders.filter((order: { status: number; }) => order.status == 3).length,
        shipsuccess: orders?.orders.filter((order: { status: number; }) => order.status == 4).length,
        received: orders?.orders.filter((order: { status: number; }) => order.status == 5).length,
        complete: orders?.orders.filter((order: { status: number; }) => order.status == 6).length,
    };

    const [search, setSearch] = useState<any>(null);
    const [phone, setPhone] = useState();
    const [getSearch] = useGetSearchOrderDoneMutation();
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
    return (
        <>
            {contextHolder}
            <div className="input-group mb-3">
                <Form form={form} onFinish={handleSearch} style={{ width: "96%", marginLeft: "25px", marginTop: "2em", marginBottom: "1em" }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm đơn hàng theo mã đơn hàng"
                        onChange={(e:any) => setOrder(e?.target?.value)}
                    />
                </Form>
            </div>
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="card">
                    <h5 className="card-header">
                        <div style={{ textAlign: "right" }}>  <Button type="primary" style={{ marginLeft: "15px" }}><a href={`/admin/order/confirm`}>Đã đặt hàng  ({counts.confirm})</a></Button>
                            <Button type="primary" style={{ marginLeft: "15px" }}><a href={`/admin/order/awaitshipper`}>Đơn hàng mới ({counts.awaitshipper})</a></Button>
            
                            <Button type="primary" style={{ marginLeft: "15px" }}><a href={`/admin/order/received`}>Đã nhận hàng ({counts.received})</a></Button>
                            <Button type="primary" style={{ marginLeft: "15px" }}><a href={`/admin/order/complete`}>Đơn hàng hoàn tất ({counts.complete})</a></Button>
                            <Button type="primary" danger style={{ marginLeft: "15px" }}><a href={`/admin/order/cancell`}>Đã huỷ hàng ({counts.cancell})</a></Button></div></h5>
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
                                        <OrderReceivedDetail key={order.order_id} data={order} />
                                    ))
                                ) : (
                                    isLoading ? (
                                        <div style={{ minHeight: "70px", marginLeft: "300%", marginTop: "10px" }}>
                                            <Spin tip="Loading..." size="large">
                                            </Spin>
                                        </div>
                                    ) : (
                                        (orderReceived?.orders || []).map((data: any) => <OrderReceivedDetail data={data} />)
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

export default ListReceivedOrder